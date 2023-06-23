import { ITournament } from '@src/models/Tournament';
import { ITeam } from '@src/models/Team';
import { IMatch } from '@src/models/Match';
import app from '@src/server';
import DB from './DB';
import MatchRepo from './MatchRepo';
import { IGame } from '@src/models/Game';

// **** Functions **** //

/**
 * Get one tournament.
 */

async function getOneById(id: number): Promise<ITournament | null> {
  let sql = 'SELECT * FROM tournaments WHERE id = $1';
  let rows = await DB.query(sql, [id]);

  if (rows.length === 0) {
    return null;
  }

  const tournament = <ITournament>rows[0];

  interface Prize {
    prize: string,
    rank: number
  }

  sql = 'SELECT prize, rank FROM prizes WHERE tournament = $1';
  rows = <Prize[]>await DB.query(sql, [id]);
  let prizes: string[] = new Array(rows.length);

  if (rows.length !== 0) {
    rows.forEach((p: Prize) => {
      prizes[p.rank] = p.prize;
    })
  }

  tournament.prizes = prizes;

  if (tournament.status > 0) {
    tournament.tournamentData = await app.locals.manager.get.tournamentData(id);
  }

  return tournament
}

/**
 * Get all tournaments.
 */
async function getAll(): Promise<ITournament[]> {
  const sql = 'SELECT * FROM tournaments';
  const rows = await DB.query(sql);
  return <ITournament[]>rows;
}

/**
 * Get matches.
 */
async function getMatches(id: number): Promise<IMatch[]> {
  let sql = 'SELECT m.*, t1.name as team_one_name, t2.name as team_two_name FROM matches m LEFT JOIN teams as t1 ON m.team_one = t1.id LEFT JOIN teams as t2 ON m.team_two = t2.id WHERE m.tournament = $1';
  let rows = <IMatch[]>await DB.query(sql, [id]);

  for (let i = 0; i < rows.length; i++) {
    let sql_games = 'SELECT * FROM games WHERE match = $1';
    let games = <IGame[]>await DB.query(sql_games, [rows[i].id]);
    rows[i].games = games;
  }

  return rows;
}

/**
 * Get teams.
 */
async function getTeams(id: number): Promise<ITeam[]> {
  const sql = `
      SELECT t.id, t.name, t.avatar, u1.id as owner_id, u1.name as owner_name, u1.avatar as owner_avatar, u1.email as owner_email, u2.id as member_id, u2.name as member_name, u2.avatar as member_avatar, u2.email as member_email, r.status as member_status
      FROM teams t
      LEFT JOIN tournaments_teams as tt ON t.id = tt.team
      LEFT JOIN users u1 ON t.owner = u1.id
      LEFT JOIN requests r ON t.id = r.team_id
      LEFT JOIN users u2 ON r.user_id = u2.id
      WHERE tt.tournament = $1
    `;
  const rows = await DB.query(sql, [id]);
  
  if (rows.length === 0) {
    return [];
  }

  const teams: ITeam[] = [];
  const teamMap = new Map<number, ITeam>();

  for (const row of rows) {
    const teamId = row.id;
    let team = teamMap.get(teamId);

    if (!team) {
      team = {
        id: teamId,
        name: row.name,
        owner: {
          id: row.owner_id,
          name: row.owner_name,
          avatar: row.owner_avatar,
          email: row.owner_email,
        },
        avatar: row.avatar,
        members: [],
      };
      teamMap.set(teamId, team);
      teams.push(team);
    }

    if (row.member_id && row.member_status !== 2) {
      team.members?.push({
        id: row.member_id,
        name: row.member_name,
        avatar: row.member_avatar,
        email: row.member_email,
        status: row.member_status,
      });
    }
  }

  return teams;
}

async function getAllByUser(id: number): Promise<ITournament[]> {
  let sql = 'SELECT * FROM tournaments';
  let rows = await DB.query(sql);
  const tournaments = <ITournament[]>rows;
  
  interface Prize {
    prize: string,
    rank: number
  }

  for (let i = 0; i < tournaments.length; i++) {
    sql = 'SELECT prize, rank FROM prizes WHERE tournament = $1';
    rows = <Prize[]>await DB.query(sql, [tournaments[i].id]);
    let prizes: string[] = new Array(rows.length);

    if (rows.length !== 0) {
      rows.forEach((p: Prize) => {
        prizes[p.rank] = p.prize;
      })
    }

    tournaments[i].prizes = prizes;
  }

  return tournaments;
}

/**
 * See if a tournament with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const sql = 'SELECT EXISTS(SELECT 1 FROM tournaments WHERE id = $1)';
  const rows = await DB.query(sql, [id]);
  return rows[0].exists;
}

/**
 * Add one tournament.
 */
async function add(tournament: ITournament): Promise<void> {
  const sql = 'INSERT INTO tournaments (name, admin, max_teams, organizer, information, status, stages, current_stage, avatar) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id';
  const sql_prizes = 'INSERT INTO prizes (prize, rank, tournament) VALUES ($1, $2, $3)';
  const values = [tournament.name, tournament.admin, tournament.max_teams, tournament.organizer, tournament.information, tournament.status, tournament.stages, tournament.currentStage, tournament.avatar];
  const insertedTournamentList: ITournament[] = await DB.query(sql, values);

  for (let i = 0; i < tournament.prizes.length; i++) {
    await DB.query(sql_prizes, [tournament.prizes[i], i, insertedTournamentList[0].id]);
  }
}

/**
 * Add team to tournament.
 */
async function addTeam(id: number, team: Number): Promise<void> {
  const sql = 'INSERT INTO tournaments_teams (tournament, team) VALUES ($1, $2)';
  const values = [id, team];
  
  await DB.query(sql, values);
}

/**
 * Remove team from tournament.
 */
async function removeTeam(id: number, team: Number): Promise<void> {
  const sql = 'DELETE FROM tournaments_teams WHERE tournament = $1 AND team = $2';
  const values = [id, team];
  
  await DB.query(sql, values);
}

/**
 * Update a tournament.
 */
async function update(tournament: ITournament): Promise<void> {
  const sql_delete_prizes = 'DELETE FROM prizes WHERE tournament = $1';
  await DB.query(sql_delete_prizes, [tournament.id]);

  const sql = 'UPDATE tournaments SET name = $1, admin = $2, max_teams = $3, organizer = $4, information = $5, status = $6, avatar = COALESCE($7, avatar) WHERE id = $8 RETURNING id';
  const sql_prizes = 'INSERT INTO prizes (prize, rank, tournament) VALUES ($1, $2, $3)';
  const values = [tournament.name, tournament.admin, tournament.max_teams, tournament.organizer, tournament.information, tournament.status, tournament.avatar, tournament.id];
  const updatedTournamentList: ITournament[] = await DB.query(sql, values);

  for (let i = 0; i < tournament.prizes.length; i++) {
    await DB.query(sql_prizes, [tournament.prizes[i], i, updatedTournamentList[0].id]);
  }
}

function calculateNumberOfGroups(numTeams: number): number {
  if (numTeams % 3 === 0) {
    const numGroups = numTeams / 3;
    return numGroups;
  } else if (numTeams % 4 === 0) {
    const numGroups = numTeams / 4;
    return numGroups;
  } else {
    let numGroups4 = Math.floor(numTeams / 4);
    while (numGroups4 > 0) {
      const remainingTeams = numTeams - numGroups4 * 4;
      if (remainingTeams % 3 === 0) {
        const numGroups3 = remainingTeams / 3;
        return numGroups4 + numGroups3;
      }
      numGroups4--;
    }
  }
  return -1;
}

function shuffle(array: Array<string>) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

/**
 * Update a tournament status.
 */
async function updateStatus(id: number, status: number): Promise<void> {
  const sql = 'UPDATE tournaments SET status = $1 WHERE id = $2 RETURNING *';
  const tournament = <ITournament>(await DB.query(sql, [status, id]))[0];

  if (status == 1) {
    let type;
    let name;

    switch (tournament.stages) {
      case 0: 
      case 3:
      case 4:
        type = "round_robin";
        name = "Group stage";
        break;
      case 1:
        type = "single_elimination";
        name = "Playoffs stage";
        break;
      case 2:
        type = "double_elimination";
        name = "Playoffs stage";
        break;
    }

    await app.locals.manager.delete.tournament(id);

    interface Config {
      grandFinal: string;
      groupCount?: number;
      size?: number;
    }

    let config: Config = {grandFinal: "simple"}
    let teams = (await getTeams(tournament.id));
    const teamNames: string[] = teams.map((t) => t.name);

    shuffle(teamNames);

    if (type == "round_robin") {
      config.groupCount = calculateNumberOfGroups(teams.length);
      config.size = teams.length;
    }

    await app.locals.manager.create({
            tournamentId: id,
            name: name,
            type: type,
            seeding: teamNames,
            settings: config,
        });
    
    const participants = await app.locals.jsonStorage.select('participant', {tournament_id: id})

    interface Participant {
      name: string;
      id: number;
    }

    const idToTeamId: { [key: number]: number } = {};

    participants.forEach((p: Participant) => {
      teams.forEach((t) => {
        if (t.name == p.name) {
          idToTeamId[p.id] = t.id;
        }
      })
    })

    
    const currentStage = await app.locals.manager.get.currentStage(id);
    const currentRound = await app.locals.manager.get.currentRound(currentStage.id);
    const matches = await app.locals.jsonStorage.select('match', { round_id: currentRound.id });
    
    interface Match {
      id: number;
      opponent1: Participant,
      opponent2: Participant
    }

    for (let i = 0; i < matches.length; i++) {
      let m = matches[i] as Match;
      let match = {
        type: type == "round_robin" ? 0 : 1,
        currentGame: 0,
        tournament: id,
        team_one: idToTeamId[m.opponent1.id],
        team_two: idToTeamId[m.opponent2.id],
        manager_id: m.id
      } as IMatch;
      MatchRepo.add(match);
    }
  }
}

/**
 * Delete one tournament.
 */
async function delete_(id: number): Promise<void> {
  const sql = 'DELETE FROM tournaments WHERE id = $1';
  const values = [id];
  await DB.query(sql, values);

  await app.locals.manager.delete.tournament(id);
}

// **** Export default **** //

export default {
  getOneById,
  getAll,
  getAllByUser,
  getMatches,
  getTeams,
  addTeam,
  removeTeam,
  persists,
  add,
  update,
  updateStatus,
  delete: delete_,
} as const;


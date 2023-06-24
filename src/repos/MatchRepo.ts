import { IGame } from '@src/models/Game';
import { IMatch, LogEvent, VetoStatus } from '@src/models/Match';
import { ITeam } from '@src/models/Team';
import app from '@src/server';
import DB from './DB';
import TournamentRepo from './TournamentRepo';

// **** Functions **** //

/**
 * Get one match.
 */

async function getOneById(id: number): Promise<IMatch | null> {
  let sql = 'SELECT m.*, t1.name as team_one_name, t2.name as team_two_name FROM matches m LEFT JOIN teams as t1 ON m.team_one = t1.id LEFT JOIN teams as t2 ON m.team_two = t2.id WHERE m.id = $1';
  let rows = await DB.query(sql, [id]);

  if (rows.length === 0) {
    return null;
  }

  const match = <IMatch>rows[0];

  sql = 'SELECT * FROM games WHERE match = $1';
  rows = await DB.query(sql, [match.id]);

  if (rows.length > 0) {
    match.games = <IGame[]>rows;
  }
  
  sql = `
      SELECT t.id, t.name, t.avatar, u1.id as owner_id, u1.name as owner_name, u1.avatar as owner_avatar, u1.email as owner_email, u2.id as member_id, u2.name as member_name, u2.avatar as member_avatar, u2.email as member_email, r.status as member_status
      FROM teams t
      LEFT JOIN users u1 ON t.owner = u1.id
      LEFT JOIN requests r ON t.id = r.team_id
      LEFT JOIN users u2 ON r.user_id = u2.id
      WHERE t.id = $1 OR t.id = $2
    `;
  rows = await DB.query(sql, [match.team_one, match.team_two]);
  
  if (rows.length === 0) {
    return null;
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

  let final_teams: Array<ITeam> = [];
  
  if (match.team_one != teams[0].id) {
    final_teams[0] = teams[1];
    final_teams[1] = teams[0];
  } else {
    final_teams = teams;
  }

  match.teams = final_teams;

  return match;
}

async function parseLogs(log: LogEvent) {
  if (log.event != "series_end") {
    return;
  }
  
  const sql = "SELECT * from matches WHERE id = $1"

  let match = <IMatch>(await DB.query(sql, [parseInt(log.matchid)]))[0];
  
  const currentStage = await app.locals.manager.get.currentStage(match.tournament);
  const beforeRound = await app.locals.manager.get.currentRound(currentStage.id);

  if (match) {
    let current_game = match.current_game;
    const sql_games = 'SELECT * FROM games WHERE "match" = $1 AND "order" = $2';
    const game = <IGame>(await DB.query(sql_games, [match.id, current_game]))[0];

    if (match.type == 0) {
      const sql_update_match = "UPDATE matches SET status = 2 WHERE id = $1";
      await DB.query(sql_update_match, [match.id])

      let games = await app.locals.jsonStorage.select("match_game", {parent_id: match.manager_id})
      
      const sql_game = "UPDATE games SET status = 1, team_one_score = $1, team_two_score = $2 WHERE id = $3";
      
      if (log.team1_series_score == 1) {
        await app.locals.manager.update.matchGame({
          id: games[0].id,
          opponent1: { score: 1, result: 'win' },
          opponent2: { score: 0 }
        })
        await DB.query(sql_game, [1, 0, game.id]);
      } else {
        await app.locals.manager.update.matchGame({
          id: games[0].id,
          opponent1: { score: 0 },
          opponent2: { score: 1, result: 'win' }
        })
        await DB.query(sql_game, [0, 1, game.id]);
      }
    } else {
      if (current_game == 2) {
        const sql_update_match = "UPDATE matches SET status = 2 WHERE id = $1";
        await DB.query(sql_update_match, [match.id]);
      } else if (current_game == 1) {
        let previousGame = <IGame>(await DB.query(sql_games, [match.id, 0]))[0];
        if ((previousGame.team_one_score == 1 && log.team1_series_score == 1) || (previousGame.team_two_score == 1 && log.team2_series_score == 1)) {
          const sql_update_match = "UPDATE matches SET status = 2 WHERE id = $1";
          await DB.query(sql_update_match, [match.id]);
        }
      }

      if (current_game == 0 || current_game == 1) {
          const sql_update_match = "UPDATE matches SET current_game = $1 WHERE id = $2";
          await DB.query(sql_update_match, [++current_game, match.id]);
      }

      let games = await app.locals.jsonStorage.select("match_game", {parent_id: match.manager_id})

      const sql_game = "UPDATE games SET status = 1, team_one_score = $1, team_two_score = $2 WHERE id = $3";
      
      if (log.team1_series_score == 1) {
        await app.locals.manager.update.matchGame({
          id: games[game.order].id,
          opponent1: { score: 1, result: 'win' },
          opponent2: { score: 0 }
        })
        await DB.query(sql_game, [1, 0, game.id]);
      } else {
        await app.locals.manager.update.matchGame({
          id: games[game.order].id,
          opponent1: { score: 0 },
          opponent2: { score: 1, result: 'win' }
        })
        await DB.query(sql_game, [0, 1, game.id]);
      }
    }

    const currentRound = await app.locals.manager.get.currentRound(currentStage.id);

    if (currentRound && currentRound.id != beforeRound.id) {
      const matches = await app.locals.jsonStorage.select('match', { round_id: currentRound.id });
      
      const participants = await app.locals.jsonStorage.select('participant', {tournament_id: match.tournament})

      interface Participant {
        name: string;
        id: number;
      }

      const idToTeamId: { [key: number]: number } = {};

      let teams = (await TournamentRepo.getTeams(match.tournament));

      participants.forEach((p: Participant) => {
        teams.forEach((t) => {
          if (t.name == p.name) {
            idToTeamId[p.id] = t.id;
          }
        })
      })

      interface Match {
        id: number;
        opponent1: Participant,
        opponent2: Participant
      }

      let tournamentId = match.id;
      let matchType = match.type;

      for (let i = 0; i < matches.length; i++) {
        let m = matches[i] as Match;
        let match = {
          type: matchType,
          current_game: 0,
          tournament: tournamentId,
          team_one: idToTeamId[m.opponent1.id],
          team_two: idToTeamId[m.opponent2.id],
          manager_id: m.id
        } as IMatch;
        add(match);
      }
    }
  }
}

/**
 * Get all matches.
 */
async function getAll(): Promise<IMatch[]> {
  const sql = 'SELECT * FROM matches';
  const rows = await DB.query(sql);
  return <IMatch[]>rows;
}

/**
 * See if a match with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const sql = 'SELECT EXISTS(SELECT 1 FROM matches WHERE id = $1)';
  const rows = await DB.query(sql, [id]);
  return rows[0].exists;
}

/**
 * Add one match.
 */
async function add(match: IMatch): Promise<void> {
  const sql = 'INSERT INTO matches (type, tournament, team_one, team_two, status, manager_id) VALUES ($1, $2, $3, $4, COALESCE($5, 0), $6)';
  const values = [match.type, match.tournament, match.team_one, match.team_two, match.status, match.manager_id];
  await DB.query(sql, values);
}

async function addGames(id: number, veto: VetoStatus) {
  const sql = 'SELECT * from matches WHERE id = $1';
  const match = <IMatch>(await DB.query(sql, [id]))[0];
  let manager_match = await app.locals.jsonStorage.select("match", match.manager_id);

  if (match.type == 0) {
    await app.locals.manager.update.matchChildCount('match', manager_match.id, 1);
    const sql_game = 'INSERT INTO games (status, map, team_one_score, team_two_score, "match", "order") VALUES ($1, $2, $3, $4, $5, $6)';
    let values = [0, veto.finalMap, 0, 0, id, 0];
    
    await DB.query(sql_game, values);
  } else {
    await app.locals.manager.update.matchChildCount('match', manager_match.id, 3);
    const sql_game = 'INSERT INTO games (status, map, team_one_score, team_two_score, "match", "order") VALUES ($1, $2, $3, $4, $5, $6)';
    let values = [0, veto.team1Picks[0], 0, 0, id, 0];
    
    await DB.query(sql_game, values);
    
    values = [0, veto.team2Picks[0], 0, 0, id, 1];
    
    await DB.query(sql_game, values);
    
    values = [0, veto.finalMap!, 0, 0, id, 2];
    
    await DB.query(sql_game, values);
  }

  const update_match_sql = 'UPDATE matches SET status = 1, current_game = 0 WHERE id = $1';

  await DB.query(update_match_sql, [id])
}

/**
 * Update a match.
 */
async function update(match: IMatch): Promise<void> {
  const sql = 'UPDATE matches SET type = $1, tournament = $2, team_one = $3, team_two = $4, current_game = $5 WHERE id = $6';
  const values = [match.type, match.tournament, match.team_one, match.team_two, match.current_game, match.id];
  await DB.query(sql, values);
}

/**
 * Delete one match.
 */
async function delete_(id: number): Promise<void> {
  const sql = 'DELETE FROM matches WHERE id = $1';
  const values = [id];
  await DB.query(sql, values);
}

// **** Export default **** //

export default {
  getOneById,
  getAll,
  parseLogs,
  persists,
  add,
  addGames,
  update,
  delete: delete_,
} as const;
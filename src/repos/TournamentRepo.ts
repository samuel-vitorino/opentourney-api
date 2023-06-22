import { ITournament } from '@src/models/Tournament';
import app from '@src/server';
import DB from './DB';

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

async function getAllByUser(id: number): Promise<ITournament[]> {
  let sql = 'SELECT * FROM tournaments WHERE admin = $1';
  let rows = await DB.query(sql, [id]);
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


    await app.locals.manager.create({
            tournamentId: id,
            name: name,
            type: type,
            seeding: [
                "Team 1",
                "Team 2",
                "Team 3",
                "Team 4",
                "Team 5",
                "Team 6",
                "Team 7",
                "Team 8",
            ],
            settings: { grandFinal: "simple", groupCount: 2 },
        });
  }
}

/**
 * Delete one tournament.
 */
async function delete_(id: number): Promise<void> {
  const sql = 'DELETE FROM tournaments WHERE id = $1';
  const values = [id];
  await DB.query(sql, values);
}

// **** Export default **** //

export default {
  getOneById,
  getAll,
  getAllByUser,
  persists,
  add,
  update,
  updateStatus,
  delete: delete_,
} as const;


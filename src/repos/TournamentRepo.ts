import { ITournament } from '@src/models/Tournament';
import DB from './DB';

// **** Functions **** //

/**
 * Get one tournament.
 */

async function getOneById(id: number): Promise<ITournament | null> {
  const sql = 'SELECT * FROM tournaments WHERE id = $1';
  const rows = await DB.query(sql, [id]);

  if (rows.length === 0) {
    return null;
  }

  return <ITournament>rows[0];
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
  const sql = 'INSERT INTO tournaments (name, admin, max_teams, avatar) VALUES ($1, $2, $3, $4)';
  const values = [tournament.name, tournament.admin, tournament.max_teams, tournament.avatar];
  await DB.query(sql, values);
}

/**
 * Update a tournament.
 */
async function update(tournament: ITournament): Promise<void> {
  const sql = 'UPDATE tournaments SET name = $1, admin = $2, max_teams = $3, avatar = $4 WHERE id = $5';
  const values = [tournament.name, tournament.admin, tournament.max_teams, tournament.avatar, tournament.id];
  await DB.query(sql, values);
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
  persists,
  add,
  update,
  delete: delete_,
} as const;


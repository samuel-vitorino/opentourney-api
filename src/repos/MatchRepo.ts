import { IMatch } from '@src/models/Match';
import DB from './DB';

// **** Functions **** //

/**
 * Get one match.
 */

async function getOneById(id: number): Promise<IMatch | null> {
  const sql = 'SELECT * FROM matches WHERE id = $1';
  const rows = await DB.query(sql, [id]);

  if (rows.length === 0) {
    return null;
  }

  return <IMatch>rows[0];
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
  const sql = 'INSERT INTO matches (status, team_1, team_2, connect_ip, map) VALUES ($1, $2, $3. $4, $5)';
  const values = [match.status, match.team_1, match.team_2, match.connect_ip, match.map];
  await DB.query(sql, values);
}

/**
 * Update a match.
 */
async function update(match: IMatch): Promise<void> {
  const sql = 'UPDATE matches SET status = $1, team_1 = $2, team_2 = $3, connect_ip = $4, map = $5 WHERE id = $6';
  const values = [match.status, match.team_1, match.team_2, match.connect_ip, match.map, match.id];
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
  persists,
  add,
  update,
  delete: delete_,
} as const;
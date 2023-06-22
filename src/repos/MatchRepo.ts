import { IGame } from '@src/models/Game';
import { IMatch } from '@src/models/Match';
import DB from './DB';

// **** Functions **** //

/**
 * Get one match.
 */

async function getOneById(id: number): Promise<IMatch | null> {
  let sql = 'SELECT * FROM matches WHERE id = $1';
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

  return match;
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
  const sql = 'INSERT INTO matches (type, tournament, team_one, team_two) VALUES ($1, $2, $3. $4)';
  const values = [match.type, match.tournament, match.team_one, match.team_two];
  await DB.query(sql, values);
}

/**
 * Update a match.
 */
async function update(match: IMatch): Promise<void> {
  const sql = 'UPDATE matches SET type = $1, tournament = $2, team_one = $3, team_two = $4, currentGame = $5 WHERE id = $6';
  const values = [match.type, match.tournament, match.team_one, match.team_two, match.currentGame, match.id];
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
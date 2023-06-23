import { IGame } from '@src/models/Game';
import DB from './DB';

// **** Functions **** //

/**
 * Get one game.
 */

async function getOneById(id: number): Promise<IGame | null> {
  const sql = 'SELECT * FROM games WHERE id = $1';
  const rows = await DB.query(sql, [id]);

  if (rows.length === 0) {
    return null;
  }

  return <IGame>rows[0];
}

/**
 * Get all games.
 */
async function getAll(): Promise<IGame[]> {
  const sql = 'SELECT * FROM games';
  const rows = await DB.query(sql);
  return <IGame[]>rows;
}

/**
 * See if a game with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const sql = 'SELECT EXISTS(SELECT 1 FROM games WHERE id = $1)';
  const rows = await DB.query(sql, [id]);
  return rows[0].exists;
}

/**
 * Add one game.
 */
async function add(game: IGame): Promise<void> {
  const sql = 'INSERT INTO games (status, match, connect_ip, map, manager_id) VALUES ($1, $2, $3. $4, $5)';
  const values = [game.status, game.match, game.connect_ip, game.map, game.manager_id];
  await DB.query(sql, values);
}

/**
 * Update a game.
 */
async function update(game: IGame): Promise<void> {
  const sql = 'UPDATE games SET status = $1, match = $2, team_one_score = $3, team_two_score = $4, connect_ip = $5, map = $6 WHERE id = $7';
  const values = [game.status, game.match, game.team_one_score, game.team_two_score, game.connect_ip, game.map, game.id];
  await DB.query(sql, values);
}

/**
 * Delete one game.
 */
async function delete_(id: number): Promise<void> {
  const sql = 'DELETE FROM games WHERE id = $1';
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
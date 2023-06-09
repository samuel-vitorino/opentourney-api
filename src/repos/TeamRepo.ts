import { ITeam } from '@src/models/Team';
import DB from './DB';

// **** Functions **** //

/**
 * Get one team.
 */

async function getOneById(id: number): Promise<ITeam | null> {
  const sql = 'SELECT * FROM teams WHERE id = $1';
  const rows = await DB.query(sql, [id]);

  if (rows.length === 0) {
    return null;
  }

  return <ITeam>rows[0];
}

/**
 * Get all teams.
 */
async function getAll(): Promise<ITeam[]> {
  const sql = 'SELECT * FROM teams';
  const rows = await DB.query(sql);
  return <ITeam[]>rows;
}

/**
 * See if a team with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const sql = 'SELECT EXISTS(SELECT 1 FROM teams WHERE id = $1)';
  const rows = await DB.query(sql, [id]);
  return rows[0].exists;
}

/**
 * Add one team.
 */
async function add(team: ITeam): Promise<void> {
  const sql = 'INSERT INTO teams (name, owner, avatar) VALUES ($1, $2, $3)';
  const values = [team.name, team.owner, team.avatar];
  await DB.query(sql, values);
}

/**
 * Update a team.
 */
async function update(team: ITeam): Promise<void> {
  const sql = 'UPDATE teams SET name = $1, owner = $2, avatar = $3 WHERE id = $4';
  const values = [team.name, team.owner, team.avatar, team.id];
  await DB.query(sql, values);
}

/**
 * Delete one team.
 */
async function delete_(id: number): Promise<void> {
  const sql = 'DELETE FROM teams WHERE id = $1';
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


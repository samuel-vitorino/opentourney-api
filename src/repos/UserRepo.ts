import { IUser } from '@src/models/User';
import PwdUtil from '@src/util/PwdUtil';
import DB from './DB';


// **** Functions **** //

/**
 * Get one user.
 */
async function getOne(email: string): Promise<IUser | null> {
  const sql = 'SELECT * FROM users WHERE email = $1';
  const rows = await DB.query(sql, [email]);
  if (rows.length === 0) {
    return null;
  }
  return <IUser>rows[0];
}

/**
 * See if a user with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const sql = 'SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)';
  const rows = await DB.query(sql, [id]);
  return rows[0].exists;
}

/**
 * Get all users.
 */
async function getAll(): Promise<IUser[]> {
  const sql = 'SELECT * FROM users';
  const rows = await DB.query(sql);
  return <IUser[]>rows;
}

/**
 * Add one user.
 */
async function add(user: IUser): Promise<void> {
  user.pwd = await PwdUtil.getHash(user.pwd!)
  const sql = 'INSERT INTO users (name, email, pwd, role) VALUES ($1, $2, $3, $4)';
  const values = [user.name, user.email, user.pwd, user.role];
  await DB.query(sql, values);
}

/**
 * Update a user.
 */
async function update(user: IUser): Promise<void> {
  const sql = 'UPDATE users SET name = $1, email = $2, pwd = $3, role = $4 WHERE id = $5';
  const values = [user.name, user.email, user.pwd, user.role, user.id];
  await DB.query(sql, values);
}

/**
 * Delete one user.
 */
async function delete_(id: number): Promise<void> {
  const sql = 'DELETE FROM users WHERE id = $1';
  const values = [id];
  await DB.query(sql, values);
}

async function addSteamID(userId: number, steamID: string) { 
  let vals = [steamID];
 
  const sql_check = "SELECT EXISTS(SELECT 1 FROM users WHERE steamid = $1)";
  const rows = await DB.query(sql_check, vals);

  if (rows[0].exists) {
    return null;
  }

  const sql_update = "UPDATE users SET steamid = $1 WHERE id = $2 RETURNING *";
  const values = [steamID, userId];
  return (await DB.query(sql_update, values)).length > 0;
}


// **** Export default **** //

export default {
  getOne,
  persists,
  getAll,
  add,
  update,
  delete: delete_,
  addSteamID
} as const;

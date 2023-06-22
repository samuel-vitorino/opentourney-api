import { ITeam } from "@src/models/Team";
import DB from "./DB";
import Request from "@src/models/Request";

// **** Functions **** //

/**
 * Get one team.
 */

async function getOneById(id: number): Promise<ITeam | null> {
  const sql = "SELECT * FROM teams WHERE id = $1";
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
  const sql =
    "SELECT teams.*, users.* FROM teams JOIN users ON teams.owner = users.id";
  const rows = await DB.query(sql);

  return <ITeam[]>rows;
}

// // Get one team by their user id.
// async function getOneByUserId(id: number): Promise<ITeam | null> {
//   const sql = 'SELECT * FROM teams WHERE owner = $1';
//   const rows = await DB.query(sql, [id]);

//   if (rows.length === 0) {
//     return null;
//   }

//   return <ITeam>rows[0];
// }

// /**
//  * Gett all teams by user id, being the owner the name of the user.
//  */
// async function getAllByUserId(id: number): Promise<ITeam[]> {
//   const sql = "SELECT * FROM teams WHERE owner = $1";
//   const rows = await DB.query(sql, [id]);
//   return <ITeam[]>rows;
// }

/**
 * Get all teams by user id, being the owner the name of the user.
 */
async function getAllByUserId(id: number): Promise<ITeam[]> {
  const sql =
    "SELECT teams.*, users.name AS ownerName FROM teams JOIN users ON teams.owner = users.id WHERE users.id = $1";
  const rows = await DB.query(sql, [id]);

  return <ITeam[]>rows;
}

/**
 * See if a team with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
  const sql = "SELECT EXISTS(SELECT 1 FROM teams WHERE id = $1)";
  const rows = await DB.query(sql, [id]);
  return rows[0].exists;
}

/**
 * Add one team.
 */
async function add(team: ITeam): Promise<void> {
  //create procedure for doing two requets in one

  const transactionClient = await DB.beginTransaction();

  let sql = "INSERT INTO teams (name, owner, avatar) VALUES ($1, $2, $3)";
  let values: any = [team.name, team.owner.id, team.avatar];
  await DB.queryInTransaction(transactionClient, sql, values);

  sql = "SELECT * FROM teams WHERE name = $1";
  values = [team.name];
  let responseTeam = <ITeam>(await DB.queryInTransaction(transactionClient, sql, values))[0];

  team.members?.forEach(async (member) => {
    sql = "INSERT INTO teams_users (user_id, team_id) VALUES ($1, $2)";
    values = [member.id, responseTeam.id];
    await DB.queryInTransaction(transactionClient, sql, values);

    let status = Request.RequestStatus.PENDING;
    if (member.id === team.owner.id) {
      status = Request.RequestStatus.ACCEPTED;
    }
    sql = "INSERT INTO requests (user_id, team_id, status) VALUES ($1, $2, $3)";
    values = [member.id, responseTeam.id, status];
    await DB.queryInTransaction(transactionClient, sql, values);
  });

  await DB.endTransaction(transactionClient);
}

/**
 * Update a team.
 */
async function update(team: ITeam): Promise<void> {
  const sql =
    "UPDATE teams SET name = $1, owner = $2, avatar = $3 WHERE id = $4";
  const values = [team.name, team.owner, team.avatar, team.id];
  await DB.query(sql, values);
}

/**
 * Delete one team.
 */
async function delete_(id: number): Promise<void> {
  const sql = "DELETE FROM teams WHERE id = $1";
  const values = [id];
  await DB.query(sql, values);
}

// **** Export default **** //

export default {
  getOneById,
  getAll,
  getAllByUserId,
  persists,
  add,
  update,
  delete: delete_,
} as const;

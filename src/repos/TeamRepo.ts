import { ITeam } from "@src/models/Team";
import DB from "./DB";
import Request from "@src/models/Request";
import { log } from "console";

// **** Functions **** //

/**
 * Get one team.
 */

async function getOneById(id: number): Promise<ITeam | null> {
  const sql = `
      SELECT t.id, t.name, t.avatar, u1.id as owner_id, u1.name as owner_name, u1.avatar as owner_avatar, u1.email as owner_email, u2.id as member_id, u2.name as member_name, u2.avatar as member_avatar, u2.email as member_email, r.status as member_status
      FROM teams t
      LEFT JOIN users u1 ON t.owner = u1.id
      LEFT JOIN requests r ON t.id = r.team_id
      LEFT JOIN users u2 ON r.user_id = u2.id
      WHERE t.id = $1
    `;
  const rows = await DB.query(sql, [id]);
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

  return teams[0];
}

/**
 * Get all teams.
 */
export const getAll = async (): Promise<ITeam[]> => {
  const sql = `
      SELECT t.id, t.name, t.avatar, u1.id as owner_id, u1.name as owner_name, u1.avatar as owner_avatar, u1.email as owner_email, u2.id as member_id, u2.name as member_name, u2.avatar as member_avatar, u2.email as member_email, r.status as member_status
      FROM teams t
      LEFT JOIN users u1 ON t.owner = u1.id
      LEFT JOIN requests r ON t.id = r.team_id
      LEFT JOIN users u2 ON r.user_id = u2.id
    `;
  const rows = await DB.query(sql);
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
};

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
// async function getAllByUserId(id: number): Promise<ITeam[]> {
//   const sql =
//     "SELECT teams.*, users.name AS ownerName FROM teams JOIN users ON teams.owner = users.id WHERE users.id = $1";
//   const rows = await DB.query(sql, [id]);

//   return <ITeam[]>rows;
// }

export const getAllByUserId = async (id: number): Promise<ITeam[]> => {
  const sql = `
      SELECT t.id, t.name, t.avatar, u1.id as owner_id, u1.name as owner_name, u1.avatar as owner_avatar, u1.email as owner_email, u2.id as member_id, u2.name as member_name, u2.avatar as member_avatar, u2.email as member_email, r.status as member_status
      FROM teams t
      LEFT JOIN users u1 ON t.owner = u1.id
      LEFT JOIN requests r ON t.id = r.team_id
      LEFT JOIN users u2 ON r.user_id = u2.id
      WHERE t.owner = $1
    `;
  const rows = await DB.query(sql, [id]);
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
};

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

  let sql =
    "INSERT INTO teams (name, owner, avatar) VALUES ($1, $2, $3) RETURNING id";
  let values: any = [team.name, team.owner.id, team.avatar];
  let id = (await DB.queryInTransaction(transactionClient, sql, values))[0].id;

  // sql = "SELECT * FROM teams WHERE name = $1";
  // values = [team.name];
  // let responseTeam = <ITeam>(
  //   (await DB.queryInTransaction(transactionClient, sql, values))[0]
  // );

  team.members?.forEach(async (member) => {
    // sql = "INSERT INTO teams_users (user_id, team_id) VALUES ($1, $2)";
    // values = [member.id, responseTeam.id];
    // await DB.queryInTransaction(transactionClient, sql, values);

    let status = Request.RequestStatus.PENDING;
    if (member.id === team.owner.id) {
      status = Request.RequestStatus.ACCEPTED;
    }
    sql = "INSERT INTO requests (user_id, team_id, status) VALUES ($1, $2, $3)";
    values = [member.id, id, status];
    await DB.queryInTransaction(transactionClient, sql, values);
  });

  await DB.endTransaction(transactionClient);
}

/**
 * Update a team.
 */
async function update(team: ITeam): Promise<void> {
  const sql_team =
    "UPDATE teams SET name = $1, owner = $2, avatar = $3 WHERE id = $4";
  const values_team = [team.name, team.owner.id, team.avatar, team.id];
  await DB.query(sql_team, values_team);

  // member id list
  let memberIds = team.members?.map((member) => member.id);

  if (memberIds?.length !== 0) {
    let params: string[] = [];
    memberIds?.forEach((_, index) => {
      params.push(`$` + (index + 2));
    });
    const sql_team_remove_users =
      "SELECT id FROM requests WHERE team_id = $1 AND user_id NOT IN (" +
      params.join(",") +
      ")";
    const values_team_users = [team.id, ...memberIds!!];
    let ids: any[] = await DB.query(sql_team_remove_users, values_team_users);

    let clientTransaction = await DB.beginTransaction();

    ids.forEach(async (id) => {
      const sql_team_users = "DELETE FROM requests WHERE id = $1";
      const values_team_users = [id.id];
      await DB.queryInTransaction(
        clientTransaction,
        sql_team_users,
        values_team_users
      );
    });
    // DB.endTransaction(clientTransaction);

    const sql_another = "SELECT user_id FROM requests WHERE team_id = $1";
    const values = [team.id];
    const rows = await DB.queryInTransaction(
      clientTransaction,
      sql_another,
      values
    );

    const newTeamMembers: number[] = memberIds!.filter((element) => {
      return !rows.some((item: any) => item.user_id === element);
    });

    // clientTransaction = await DB.beginTransaction();

    //TODO fix new team members not being added
    newTeamMembers.forEach(async (id) => {
      const sql_team_users =
        "INSERT INTO requests (user_id, team_id, status) VALUES ($1, $2, 0)";
      const values_team_users = [id, team.id];
      await DB.queryInTransaction(
        clientTransaction,
        sql_team_users,
        values_team_users
      );
    });
    DB.endTransaction(clientTransaction);
  }
}

/**
 * Delete one team.
 */
async function delete_(id: number): Promise<void> {
  log(`Deleting team ${id}`);
  const sql_requests = "DELETE FROM requests WHERE team_id = $1";
  const values_requests = [id];
  await DB.query(sql_requests, values_requests);

  const sql_teams = "DELETE FROM teams WHERE id = $1";
  const values_teams = [id];
  await DB.query(sql_teams, values_teams);
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

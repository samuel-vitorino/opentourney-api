import { IGame } from '@src/models/Game';
import { IMatch } from '@src/models/Match';
import { ITeam } from '@src/models/Team';
import DB from './DB';

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
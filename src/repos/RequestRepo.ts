import { IRequest } from "@src/models/Request";
import DB from "./DB";
import { log } from "console";

// **** Functions **** //

/**
 * Get one request.
 */

async function getOneById(id: number): Promise<IRequest | null> {
    const sql = "SELECT * FROM requests WHERE id = $1";
    const rows = await DB.query(sql, [id]);

    if (rows.length === 0) {
        return null;
    }

    return <IRequest>rows[0];
}

/**
 * Get all requests.
 */
async function getAll(): Promise<IRequest[]> {
    const sql =
        "SELECT requests.*, users.name AS username, teams.name AS teamname FROM requests JOIN users ON requests.user_id = users.id JOIN teams ON requests.team_id = teams.id ORDER BY requests.createdat DESC";
    const rows = await DB.query(sql);

    return <IRequest[]>rows;
}

/**
 * See if a request with the given id exists.
 */
async function persists(id: number): Promise<boolean> {
    const sql = "SELECT EXISTS(SELECT 1 FROM requests WHERE id = $1)";
    const rows = await DB.query(sql, [id]);
    return rows[0].exists;
}

/**
 * Add one request.
 */
async function add(request: IRequest): Promise<void> {
    //create procedure for doing two requets in one
    const sql = "INSERT INTO requests (user_id, team_id, status) VALUES ($1, $2, $3)";
    const values: any = [request.user_id, request.team_id, request.status];
    await DB.query(sql, values);
}

async function getAllByUserId(id: number): Promise<IRequest[]> {
    const sql =
        "SELECT requests.*, user.name AS username, teams.name AS teamname FROM requests JOIN users ON requests.user_id = users.id JOIN teams ON requests.team_id = teams.id HERE user_id = $1 ORDER BY requests.createdat DESC";
    const rows = await DB.query(sql, [id]);

    return <IRequest[]>rows;
}

/**
 * Update a request.
 */
async function update(request: IRequest): Promise<void> {
    const sql =
        "UPDATE requests SET status = $1 WHERE id = $2";
    const values = [request.status, request.id];
    await DB.query(sql, values);
}

// **** Export default **** //

export default {
    getOneById,
    getAll,
    persists,
    add,
    getAllByUserId,
    update,
} as const;

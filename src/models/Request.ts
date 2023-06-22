// **** Variables **** //

import { log } from "console";

const INVALID_CONSTRUCTOR_PARAM =
    "nameOrObj arg must a string or an " +
    "object with the appropriate user keys.";

// **** Types **** //

export enum RequestStatus {
    PENDING = 0,
    ACCEPTED = 1,
    REJECTED = 2,
}

export interface IRequest {
    id: number;
    user_id: number;
    team_id: number;
    status: RequestStatus;
    username?: string;
    teamname?: string;
}

// **** Functions **** //

/**
 * Create new Request.
 */
function new_(
    user_id: number,
    team_id: number,
    status: RequestStatus,
    username?: string,
    teamaname?: string,
    id?: number // id last cause usually set by db
): IRequest {
    return {
        id: id ?? -1,
        user_id: user_id ?? -1,
        team_id: team_id ?? -1,
        status: status ?? -1,
        username: username ?? "",
        teamname: teamaname ?? "",
    };
}

/**
 * Get Request instance from object.
 */
function from(param: object): IRequest {
    // Check is Reaquest
    if (!isRequest(param)) {
        throw new Error(INVALID_CONSTRUCTOR_PARAM);
    }
    // Get team instance
    const p = param as IRequest;
    return new_(p.user_id, p.team_id, p.status, p.teamname, p.username, p.id);
}

/**
 * See if the param meets criteria to be a Request.
 */
function isRequest(arg: unknown): boolean {
    return !!arg && typeof arg === "object" && "user_id" in arg && "team_id" in arg && "status" in arg;
}

function isRequestUpdate(arg: unknown): boolean {
    return !!arg && typeof arg === "object" && "status" in arg;
}

// **** Export default **** //

export default {
    new: new_,
    from,
    isRequest,
    isRequestUpdate,
    RequestStatus,
} as const;
// **** Variables **** //

import { IUser } from "./User";

const INVALID_CONSTRUCTOR_PARAM =
  "nameOrObj arg must a string or an " +
  "object with the appropriate user keys.";

// **** Types **** //

export interface ITeam {
  id: number;
  name: string;
  owner: IUser;
  avatar?: string;
  members?: IUser[];
}

// **** Functions **** //

/**
 * Create new Team.
 */
function new_(
  name: string,
  owner: IUser,
  avatar?: string,
  members?: IUser[],
  id?: number // id last cause usually set by db
): ITeam {
  return {
    id: id ?? -1,
    name: name,
    owner: owner,
    avatar: avatar ?? "",
    members: members ?? [],
  };
}

/**
 * Get team instance from object.
 */
function from(param: object): ITeam {
  // Check is team
  if (!isTeam(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  // Get team instance
  const p = param as ITeam;
  return new_(p.name, p.owner, p.avatar, p.members, p.id);
}

/**
 * See if the param meets criteria to be a team.
 */
function isTeam(arg: unknown): boolean {
  return !!arg && typeof arg === "object" && "owner" in arg && "name" in arg;
}

// **** Export default **** //

export default {
  new: new_,
  from,
  isTeam,
} as const;

// **** Variables **** //

import { log } from "console";
import { RequestStatus } from "./Request";

const INVALID_CONSTRUCTOR_PARAM =
  "nameOrObj arg must a string or an " +
  "object with the appropriate user keys.";

export enum UserRoles {
  Standard,
  Developer,
}

// **** Types **** //

export interface IUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  steamid?: string;
  pwd?: string;
  role?: UserRoles;
  status?: RequestStatus;
}

export interface ISessionUser {
  id: number;
}

// **** Functions **** //

/**
 * Create new User.
 */
function new_(
  name?: string,
  email?: string,
  role?: UserRoles,
  pwd?: string,
  avatar?: string,
  steamid?: string,
  status?: number,
  id?: number // id last cause usually set by db
): IUser {
  return {
    id: id ?? -1,
    name: name ?? "",
    email: email ?? "",
    role: role ?? UserRoles.Standard,
    pwd: pwd ?? "",
    avatar: avatar ?? "",
    steamid: steamid ?? "",
    status: status ?? RequestStatus.PENDING,
  };
}

/**
 * Get user instance from object.
 */
function from(param: object): IUser {
  // Check is user
  if (!isUser(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  // Get user instance
  const p = param as IUser;
  return new_(p.name, p.email, p.role, p.pwd, p.avatar, p.steamid, p.id);
}

/**
 * See if the param meets criteria to be a user.
 */
function isUser(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === "object" &&
    "id" in arg &&
    "email" in arg &&
    "name" in arg &&
    "role" in arg
  );
}

/**
 * See if the param meets criteria to be a user register.
 */
function isUserRegister(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === "object" &&
    "email" in arg &&
    "name" in arg &&
    "role" in arg &&
    "pwd" in arg
  );
}

// **** Export default **** //

export default {
  new: new_,
  from,
  isUser,
  isUserRegister,
} as const;

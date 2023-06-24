import UserRepo from "@src/repos/UserRepo";
import { IUser } from "@src/models/User";
import { RouteError } from "@src/other/classes";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";
import PwdUtil from "@src/util/PwdUtil";
import { tick } from "@src/util/misc";

// **** Variables **** //

export const USER_NOT_FOUND_ERR = "User not found";

// Errors
export const Errors = {
  Unauth: "Unauthorized",
  EmailNotFound(email: string) {
    return `User with email "${email}" not found`;
  },
} as const;

// **** Functions **** //

/**
 * Get all users.
 */
function getAll(): Promise<IUser[]> {
  return UserRepo.getAll();
}

function getOne(id: number): Promise<IUser | null> {
  return UserRepo.getOneById(id);
}

function getAllByName(name: string): Promise<IUser[]> {
  return UserRepo.getAllByName(name);
}

function getAllStandard(): Promise<IUser[]> {
  return UserRepo.getAllStandard();
}

/**
 * Add one user.
 */
function addOne(user: IUser): Promise<void> {
  return UserRepo.add(user);
}

/**
 * Update one user.
 */
async function updateOne(user: IUser): Promise<IUser> {
  const userBD = await UserRepo.getOne(user.email);
  if (!userBD) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      Errors.EmailNotFound(user.email)
    );
  }
  // Check password
  const hash = userBD.pwd ?? "",
    pwdPassed = await PwdUtil.compare(user.pwd!!, hash);
  if (!pwdPassed) {
    // If password failed, wait 500ms this will increase security
    await tick(500);
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, Errors.Unauth);
  }

  const persists = await UserRepo.persists(user.id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }
  // Return user
  return UserRepo.update(user);
}

/**
 * Delete a user by their id.
 */
async function _delete(id: number): Promise<void> {
  const persists = await UserRepo.persists(id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, USER_NOT_FOUND_ERR);
  }
  // Delete user
  return UserRepo.delete(id);
}

// **** Export default **** //

export default {
  getAll,
  getOne,
  getAllByName,
  getAllStandard,
  addOne,
  updateOne,
  delete: _delete,
} as const;

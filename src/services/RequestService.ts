import RequestRepo from "@src/repos/RequestRepo";
import { IRequest } from "@src/models/Request";
import { RouteError } from "@src/other/classes";
import HttpStatusCodes from "@src/constants/HttpStatusCodes";

// **** Variables **** //

export const TEAM_NOT_FOUND_ERR = "Team not found";

// **** Functions **** //

/**
 * Get all requests.
 */
function getAll(): Promise<IRequest[]> {
  return RequestRepo.getAll();
}

function getOne(id: number): Promise<IRequest | null> {
  return RequestRepo.getOneById(id);
}

/**
 * Get All Teams By User
 */
function getAllByUser(id: number): Promise<IRequest[]> {
  return RequestRepo.getAllByUserId(id);
}

/**
 * Add one request.
 */
function addOne(request: IRequest): Promise<void> {
  return RequestRepo.add(request);
}

/**
 * Update one request.
 */
async function updateOne(request: IRequest): Promise<void> {
  const persists = await RequestRepo.persists(request.id);
  if (!persists) {
    throw new RouteError(HttpStatusCodes.NOT_FOUND, TEAM_NOT_FOUND_ERR);
  }
  // Return request
  return RequestRepo.update(request);
}

// **** Export default **** //

export default {
  getAll,
  getAllByUser,
  getOne,
  addOne,
  updateOne,
} as const;

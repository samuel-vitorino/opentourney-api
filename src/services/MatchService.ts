import MatchRepo from '@src/repos/MatchRepo';
import { IMatch } from '@src/models/Match';
import { RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';


// **** Variables **** //

export const MATCH_NOT_FOUND_ERR = 'match not found';


// **** Functions **** //

/**
 * Get all matches.
 */
function getAll(): Promise<IMatch[]> {
  return MatchRepo.getAll();
}

function getOne(id: number): Promise<IMatch | null> {
  return MatchRepo.getOneById(id);
}

/**
 * Add one match.
 */
function addOne(game: IMatch): Promise<void> {
  return MatchRepo.add(game);
}

/**
 * Update one match.
 */
async function updateOne(game: IMatch): Promise<void> {
  const persists = await MatchRepo.persists(game.id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      MATCH_NOT_FOUND_ERR,
    );
  }
  // Return game
  return MatchRepo.update(game);
}

/**
 * Delete a match by their id.
 */
async function _delete(id: number): Promise<void> {
  const persists = await MatchRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      MATCH_NOT_FOUND_ERR,
    );
  }
  // Delete game
  return MatchRepo.delete(id);
}


// **** Export default **** //

export default {
  getAll,
  getOne,
  addOne,
  updateOne,
  delete: _delete,
} as const;
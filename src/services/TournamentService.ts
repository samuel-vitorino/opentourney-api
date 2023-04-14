import TournamentRepo from '@src/repos/TournamentRepo';
import { ITournament } from '@src/models/Tournament';
import { RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';


// **** Variables **** //

export const TOURNAMENT_NOT_FOUND_ERR = 'Tournament not found';


// **** Functions **** //

/**
 * Get all tournaments.
 */
function getAll(): Promise<ITournament[]> {
  return TournamentRepo.getAll();
}

function getOne(id: number): Promise<ITournament | null> {
  return TournamentRepo.getOneById(id);
}

/**
 * Add one tournament.
 */
function addOne(tournament: ITournament): Promise<void> {
  return TournamentRepo.add(tournament);
}

/**
 * Update one tournament.
 */
async function updateOne(tournament: ITournament): Promise<void> {
  const persists = await TournamentRepo.persists(tournament.id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      TOURNAMENT_NOT_FOUND_ERR,
    );
  }
  // Return tournament
  return TournamentRepo.update(tournament);
}

/**
 * Delete a tournament by their id.
 */
async function _delete(id: number): Promise<void> {
  const persists = await TournamentRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      TOURNAMENT_NOT_FOUND_ERR,
    );
  }
  // Delete tournament
  return TournamentRepo.delete(id);
}


// **** Export default **** //

export default {
  getAll,
  getOne,
  addOne,
  updateOne,
  delete: _delete,
} as const;
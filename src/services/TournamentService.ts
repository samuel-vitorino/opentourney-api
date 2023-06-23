import TournamentRepo from '@src/repos/TournamentRepo';
import { ITournament } from '@src/models/Tournament';
import { ITeam } from '@src/models/Team';
import { IMatch } from '@src/models/Match';
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

function getAllByUser(id: number): Promise<ITournament[] | null> {
  return TournamentRepo.getAllByUser(id);
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
 * Update tournament status.
 */
async function updateStatus(id: number, status: number): Promise<void> {
  const persists = await TournamentRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      TOURNAMENT_NOT_FOUND_ERR,
    );
  }
  // Return tournament
  return TournamentRepo.updateStatus(id, status);
}

/**
 * Get tournament teams.
 */
async function getTeams(id: number): Promise<ITeam[]> {
  const persists = await TournamentRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      TOURNAMENT_NOT_FOUND_ERR,
    );
  }
  // Return tournament
  return TournamentRepo.getTeams(id);
}

/**
 * Get tournament matches.
 */
async function getMatches(id: number): Promise<IMatch[]> {
  const persists = await TournamentRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      TOURNAMENT_NOT_FOUND_ERR,
    );
  }
  // Return tournament
  return TournamentRepo.getMatches(id);
}

/**
 * Add team to tournament.
 */
async function addTeam(id: number, team: number): Promise<void> {
  const persists = await TournamentRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      TOURNAMENT_NOT_FOUND_ERR,
    );
  }
  // Return tournament
  return TournamentRepo.addTeam(id, team);
}

/**
 * Delete team from tournament.
 */
async function removeTeam(id: number, team: number): Promise<void> {
  const persists = await TournamentRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      TOURNAMENT_NOT_FOUND_ERR,
    );
  }
  // Return tournament
  return TournamentRepo.removeTeam(id, team);
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
  getAllByUser,
  getTeams,
  getMatches,
  getOne,
  addOne,
  addTeam,
  removeTeam,
  updateOne,
  updateStatus,
  delete: _delete,
} as const;
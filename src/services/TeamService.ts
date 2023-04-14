import TeamRepo from '@src/repos/TeamRepo';
import { ITeam } from '@src/models/Team';
import { RouteError } from '@src/other/classes';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';


// **** Variables **** //

export const TEAM_NOT_FOUND_ERR = 'Team not found';


// **** Functions **** //

/**
 * Get all teams.
 */
function getAll(): Promise<ITeam[]> {
  return TeamRepo.getAll();
}

function getOne(id: number): Promise<ITeam | null> {
  return TeamRepo.getOneById(id);
}

/**
 * Add one team.
 */
function addOne(team: ITeam): Promise<void> {
  return TeamRepo.add(team);
}

/**
 * Update one team.
 */
async function updateOne(team: ITeam): Promise<void> {
  const persists = await TeamRepo.persists(team.id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      TEAM_NOT_FOUND_ERR,
    );
  }
  // Return team
  return TeamRepo.update(team);
}

/**
 * Delete a team by their id.
 */
async function _delete(id: number): Promise<void> {
  const persists = await TeamRepo.persists(id);
  if (!persists) {
    throw new RouteError(
      HttpStatusCodes.NOT_FOUND,
      TEAM_NOT_FOUND_ERR,
    );
  }
  // Delete team
  return TeamRepo.delete(id);
}


// **** Export default **** //

export default {
  getAll,
  getOne,
  addOne,
  updateOne,
  delete: _delete,
} as const;
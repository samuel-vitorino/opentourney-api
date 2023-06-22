// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an ' + 
  'object with the appropriate user keys.';

// **** Types **** //

enum StageType {
  roundRobin,
  singleElimination,
  doubleElimination,
  roundRobinSingleElimination,
  roundRobinDoubleElimination
}

export interface ITournament {
  id: number;
  name: string;
  admin: number;
  max_teams: number;
  organizer: string;
  information: string;
  prizes: string[];
  status: number;
  stages: StageType;
  currentStage: number;
  avatar?: string;
}

// **** Functions **** //

/**
 * Create new Tournament.
 */
function new_(
  name: string,
  admin: number,
  max_teams: number,
  organizer: string,
  information: string,
  prizes: Array<string>,
  status: number,
  stages: StageType,
  currentStage: number,
  avatar?: string,
  id?: number, // id last cause usually set by db
): ITournament {
  return {
    id: (id ?? -1),
    name: name,
    admin: admin,
    max_teams: max_teams,
    organizer: organizer,
    information: information,
    prizes: prizes,
    status: status,
    stages: stages,
    currentStage: currentStage,
    avatar: (avatar ?? ''),
  };
}

/**
 * Get tournament instance from object.
 */
function from(param: object): ITournament {
  // Check is tournament
  if (!isTournament(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  // Get tournament instance
  const p = param as ITournament;
  return new_(p.name, p.admin, p.max_teams, p.organizer, p.information, p.prizes, p.status, p.stages, p.currentStage, p.avatar, p.id);
}

/**
 * See if the param meets criteria to be a tournament.
 */
function isTournament(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'max_teams' in arg &&
    'name' in arg &&
    'admin' in arg &&
    'organizer' in arg &&
    'information' in arg &&
    'stages' in arg &&
    'currentStage' in arg
  );
}

// **** Export default **** //

export default {
  new: new_,
  from,
  isTournament,
} as const;

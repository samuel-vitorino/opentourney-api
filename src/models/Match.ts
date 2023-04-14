// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an ' + 
  'object with the appropriate user keys.';

// **** Types **** //

export interface IMatch {
  id: number;
  status: number;
  team_1: number;
  team_2: number;
  connect_ip?: string;
  map?: string;
}

// **** Functions **** //

/**
 * Create new Match.
 */
function new_(
  status: number,
  team_1: number,
  team_2: number,
  connect_ip?: string,
  map?: string,
  id?: number, // id last cause usually set by db
): IMatch {
  return {
    id: (id ?? -1),
    status: status,
    team_1: team_1,
    team_2: team_2,
    connect_ip: (connect_ip ?? ''),
    map: (map ?? ''),
  };
}

/**
 * Get match instance from object.
 */
function from(param: object): IMatch {
  // Check is match
  if (!isMatch(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  // Get match instance
  const p = param as IMatch;
  return new_(p.status, p.team_1, p.team_2, p.connect_ip, p.map, p.id);
}

/**
 * See if the param meets criteria to be a match.
 */
function isMatch(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'id' in arg &&
    'status' in arg &&
    'team_1' in arg &&
    'team_2' in arg
  );
}

// **** Export default **** //

export default {
  new: new_,
  from,
  isMatch,
} as const;
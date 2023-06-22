// **** Variables **** //

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an ' + 
  'object with the appropriate user keys.';

// **** Types **** //

export interface IGame {
  id: number;
  status: number;
  match: number;
  team_one_score?: number;
  team_two_score?: number;
  connect_ip?: string;
  map?: string;
}

// **** Functions **** //

/**
 * Create new Game.
 */
function new_(
  status: number,
  match: number,
  team_one_score?: number,
  team_two_score?: number,
  connect_ip?: string,
  map?: string,
  id?: number, // id last cause usually set by db
): IGame {
  return {
    id: (id ?? -1),
    status: status,
    match: match,
    team_one_score: (team_one_score ?? 0),
    team_two_score: (team_two_score ?? 0),
    connect_ip: (connect_ip ?? ''),
    map: (map ?? ''),
  };
}

/**
 * Get game instance from object.
 */
function from(param: object): IGame {
  // Check is game
  if (!isGame(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  // Get game instance
  const p = param as IGame;
  return new_(p.status, p.match, p.team_one_score, p.team_two_score, p.connect_ip, p.map, p.id);
}

/**
 * See if the param meets criteria to be a game.
 */
function isGame(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'status' in arg &&
    'match' in arg
  );
}

// **** Export default **** //

export default {
  new: new_,
  from,
  isGame,
} as const;
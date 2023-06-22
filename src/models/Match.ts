// **** Variables **** //

import { IGame } from "./Game";

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an ' + 
  'object with the appropriate user keys.';

enum MatchType {
    BO1,
    BO3
}

// **** Types **** //

export interface IMatch {
  id: number;
  type: MatchType;
  currentGame: number;
  tournament: number;
  team_one: number;
  team_two: number;
  games: IGame[];
}

// **** Functions **** //

/**
 * Create new Game.
 */
function new_(
  type: MatchType,
  currentGame: number,
  tournament: number,
  team_one: number,
  team_two: number,
  games: IGame[],
  id?: number, // id last cause usually set by db
): IMatch {
  return {
    id: (id ?? -1),
    type: type,
    currentGame: currentGame,
    tournament: tournament,
    team_one: team_one,
    team_two: team_two,
    games: games
  };
}

/**
 * Get game instance from object.
 */
function from(param: object): IMatch {
  // Check is game
  if (!isMatch(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  // Get game instance
  const p = param as IMatch;
  return new_(p.type, p.currentGame, p.tournament, p.team_one, p.team_two, p.games, p.id);
}

/**
 * See if the param meets criteria to be a game.
 */
function isMatch(arg: unknown): boolean {
  return (
    !!arg &&
    typeof arg === 'object' &&
    'type' in arg &&
    'tournament' in arg &&
    'team_one' in arg &&
    'team_two' in arg
  );
}

// **** Export default **** //

export default {
  new: new_,
  from,
  isMatch,
} as const;
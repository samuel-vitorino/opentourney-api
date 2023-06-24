// **** Variables **** //

import { IGame } from "./Game";
import { ITeam } from "./Team";

const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an ' + 
  'object with the appropriate user keys.';

enum MatchType {
    BO1,
    BO3
}

export interface VetoStatus {
  status: number;
  matchType: number;
  maps: string[];
  team1Bans: string[];
  team2Bans: string[];
  team1Picks: string[];
  team2Picks: string[];
  finalized: boolean;
  finalMap: string | null;
}

// **** Types **** //

export interface IMatch {
  id: number;
  type: MatchType;
  currentGame: number;
  tournament: number;
  team_one: number;
  status: number;
  team_one_name?: string;
  team_two: number;
  team_two_name?: string;
  teams?: ITeam[];
  games: IGame[];
  manager_id?:  number;
}

// **** Functions **** //

/**
 * Create new Match.
 */
function new_(
  type: MatchType,
  currentGame: number,
  tournament: number,
  team_one: number,
  team_two: number,
  status: number,
  games: IGame[],
  manager_id?: number,
  team_one_name?: string,
  team_two_name?: string,
  teams?: ITeam[],
  id?: number, // id last cause usually set by db
): IMatch {
  return {
    id: (id ?? -1),
    type: type,
    currentGame: currentGame,
    tournament: tournament,
    team_one: team_one,
    team_two: team_two,
    status: status,
    games: games,
    manager_id: manager_id,
    team_one_name: team_one_name,
    team_two_name: team_two_name,
    teams: teams,
  };
}

/**
 * Get match instance from object.
 */
function from(param: object): IMatch {
  // Check is game
  if (!isMatch(param)) {
    throw new Error(INVALID_CONSTRUCTOR_PARAM);
  }
  // Get game instance
  const p = param as IMatch;
  return new_(p.type, p.currentGame, p.tournament, p.team_one, p.team_two, p.status, p.games, p.id);
}

/**
 * See if the param meets criteria to be a match.
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
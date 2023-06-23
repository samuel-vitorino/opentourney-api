/**
 * Express router paths go here.
 */

import { Immutable } from "@src/other/types";

const Paths = {
  Base: "/api",
  Auth: {
    Base: "/auth",
    Login: "/login",
    Logout: "/logout",
    SteamConnect: "/steam/connect",
    SteamDisconnect: "/steam/disconnect",
    SteamCallback: "/steam/return",
  },
  Users: {
    Base: '/users',
    GetOne: '/users/:id',
    LoggedIn: '/users/me',
    GetTournaments: '/users/:id/tournaments'
  },
  Tournaments: {
    Base: "/tournaments",
    GetOne: "/tournaments/:id",
    GetTeams: "/tournaments/:id/teams",
    GetMatches: "/tournaments/:id/matches",
    DeleteTeam: "/tournaments/:id/teams/:team_id",
  },
  Teams: {
    Base: "/teams",
    GetOne: "/teams/:id",
    GetAllByUser: "/users/:id/teams",
  },
  Requests: {
    Base: "/requests",
    GetOne: "/requests/:id",
  },
  Matches: {
    GetOne: '/games/:id'
  },
};

// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;

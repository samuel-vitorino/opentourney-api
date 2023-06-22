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
    Base: "/users",
    GetOne: "/users/:id",
    LoggedIn: "/users/me",
  },
  Tournaments: {
    Base: "/tournaments",
    GetOne: "/tournaments/:id",
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
    Base: "/matches",
    GetOne: "/matches/:id",
  },
};

// **** Export **** //

export type TPaths = Immutable<typeof Paths>;
export default Paths as TPaths;

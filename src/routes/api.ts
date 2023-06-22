import { Router } from "express";
import jetValidator from "jet-validator";
import passport from "passport";

import developerMw from "./middleware/developerMw";
import userDevMw from "./middleware/userDevMw";
import userMw from "./middleware/userMw";
import Paths from "./constants/Paths";
import User from "@src/models/User";
import AuthRoutes from "./AuthRoutes";
import UserRoutes from "./UserRoutes";
import SteamRoutes from "./SteamRoutes";
import TournamentRoutes from "./TournamentRoutes";
import TeamRoutes from "./TeamRoutes";
import MatchRoutes from "./MatchRoutes";
import Tournament from "@src/models/Tournament";
import Team from "@src/models/Team";
import Match from "@src/models/Match";
import RequestRoutes from "./RequestRoutes";
import Request from "@src/models/Request";

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();

// **** Setup AuthRouter **** //

const authRouter = Router();

// Login user
authRouter.post(Paths.Auth.Login, validate("email", "pwd"), AuthRoutes.login);

// Logout user
authRouter.get(Paths.Auth.Logout, AuthRoutes.logout);

// initiate Steam login
authRouter.get(Paths.Auth.SteamConnect, [
  userMw,
  passport.authenticate("steam"),
]);

// handle Steam login callback
authRouter.get(
  Paths.Auth.SteamCallback,
  passport.authenticate("steam", {
    session: false,
    failureRedirect: "http://localhost:5173/settings",
    passReqToCallback: true,
  }),
  SteamRoutes.steamCallback
);

// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);

// ** Add UserRouter ** //

const userRouter = Router();

// Get all users
userRouter.get(Paths.Users.Base, developerMw, UserRoutes.getAll);

userRouter.get(Paths.Users.LoggedIn, UserRoutes.getLoggedIn);

userRouter.get(Paths.Users.GetOne, UserRoutes.getOne);

// Add one user
userRouter.post(
  Paths.Users.Base,
  validate(["user", User.isUserRegister]),
  UserRoutes.add
);

// Update one user
userRouter.put(
  Paths.Users.GetOne,
  [validate(["user", User.isUser]), userDevMw],
  UserRoutes.update
);

// Delete one user
userRouter.delete(
  Paths.Users.GetOne,
  [validate(["id", "number", "params"]), developerMw],
  UserRoutes.delete
);

// Add UserRouter
apiRouter.use(userRouter);

// ** Add TournamentRouter ** //

const tournamentRouter = Router();

// Get all tournaments
tournamentRouter.get(
  Paths.Tournaments.Base,
  //developerMw,
  TournamentRoutes.getAll
);

tournamentRouter.get(Paths.Tournaments.GetOne, TournamentRoutes.getOne);

// Add one tournament
tournamentRouter.post(
  Paths.Tournaments.Base,
  validate(["tournament", Tournament.isTournament]),
  TournamentRoutes.add
);

// Update one tournament
tournamentRouter.put(
  Paths.Tournaments.GetOne,
  [validate(["tournament", Tournament.isTournament]), userDevMw],
  TournamentRoutes.update
);

// Delete one tournament
tournamentRouter.delete(
  Paths.Tournaments.GetOne,
  [validate(["id", "number", "params"]), userDevMw],
  TournamentRoutes.delete
);

// Add TournamentRouter
apiRouter.use(tournamentRouter);

// ** Add TeamRouter ** //

const teamRouter = Router();

// Get all teams
teamRouter.get(Paths.Teams.Base, TeamRoutes.getAll);

teamRouter.get(Paths.Teams.GetOne, TeamRoutes.getOne);


// Add one team
teamRouter.post(
  Paths.Teams.Base,
  validate(["team", Team.isTeam]),
  TeamRoutes.add
);

// Update one team
teamRouter.put(
  Paths.Teams.GetOne,
  [validate(["team", Team.isTeam])],
  TournamentRoutes.update
);

// Delete one team
teamRouter.delete(
  Paths.Teams.GetOne,
  [validate(["id", "number", "params"])],
  TeamRoutes.delete
);

// Add TeamRouter
apiRouter.use(teamRouter);



// ** Add RequestRouter ** //

const requestRouter = Router();

// Get all requests
requestRouter.get(Paths.Requests.Base, RequestRoutes.getAll);
// requestRouter.get(Paths.Requests.GetOne, RequestRoutes.getOne);

// Add one request
requestRouter.post(
  Paths.Requests.Base,
  validate(["request", Request.isRequest]),
  RequestRoutes.add
);

// Update one request
requestRouter.put(
  Paths.Requests.GetOne,
  [validate(["request", Request.isRequest])],
  RequestRoutes.update
);

// Add RequestRouter
apiRouter.use(requestRouter);



// ** Add MatchRouter ** //

const matchRouter = Router();

// Get all matches
matchRouter.get(Paths.Matches.Base, MatchRoutes.getAll);

matchRouter.get(Paths.Matches.GetOne, MatchRoutes.getOne);

// Add one match
matchRouter.post(
  Paths.Matches.Base,
  validate(["match", Match.isMatch]),
  MatchRoutes.add
);

// Update one match
matchRouter.put(
  Paths.Matches.GetOne,
  [validate(["match", Match.isMatch])],
  MatchRoutes.update
);

// Delete one match
matchRouter.delete(
  Paths.Matches.GetOne,
  [validate(["id", "number", "params"])],
  MatchRoutes.delete
);

// Add MatchRouter
apiRouter.use(matchRouter);

// **** Export default **** //

export default apiRouter;

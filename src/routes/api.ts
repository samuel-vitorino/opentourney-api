import { Router } from 'express';
import jetValidator from 'jet-validator';
import passport from 'passport';

import developerMw from './middleware/developerMw';
import userDevMw from './middleware/userDevMw';
import userMw from './middleware/userMw';
import Paths from './constants/Paths';
import User from '@src/models/User';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';
import SteamRoutes from './SteamRoutes';

// **** Variables **** //

const apiRouter = Router(),
  validate = jetValidator();


// **** Setup AuthRouter **** //

const authRouter = Router();

// Login user
authRouter.post(
  Paths.Auth.Login,
  validate('email', 'pwd'),
  AuthRoutes.login,
);

// Logout user
authRouter.get(
  Paths.Auth.Logout,
  AuthRoutes.logout,
);

// initiate Steam login
authRouter.get(Paths.Auth.SteamConnect, [userMw, passport.authenticate('steam')]);

// handle Steam login callback
authRouter.get(Paths.Auth.SteamCallback, passport.authenticate('steam', {
  session: false,
  failureRedirect: "http://localhost:5173/settings",
  passReqToCallback: true
}), SteamRoutes.steamCallback)

// Add AuthRouter
apiRouter.use(Paths.Auth.Base, authRouter);

// ** Add UserRouter ** //

const userRouter = Router();

// Get all users
userRouter.get(
  Paths.Users.Base,
  developerMw,
  UserRoutes.getAll,
);

userRouter.get(
  Paths.Users.LoggedIn,
  UserRoutes.getLoggedIn
);

userRouter.get(
  Paths.Users.GetOne,
  UserRoutes.getOne,
);

// Add one user
userRouter.post(
  Paths.Users.Base,
  validate(['user', User.isUserRegister]),
  UserRoutes.add,
);

// Update one user
userRouter.put(
  Paths.Users.Base,
  [validate(['user', User.isUser]), userDevMw],
  UserRoutes.update,
);

// Delete one user
userRouter.delete(
  Paths.Users.Base,
  [validate(['id', 'number', 'params']), developerMw],
  UserRoutes.delete,
);

// Add UserRouter
apiRouter.use(userRouter);


// **** Export default **** //

export default apiRouter;

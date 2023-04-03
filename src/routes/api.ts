import { Router } from 'express';
import jetValidator from 'jet-validator';

import developerMw from './middleware/developerMw';
import userMw from './middleware/userMw';
import Paths from './constants/Paths';
import User from '@src/models/User';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';


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

// Add one user
userRouter.post(
  Paths.Users.Base,
  validate(['user', User.isUserRegister]),
  UserRoutes.add,
);

// Update one user
userRouter.put(
  Paths.Users.Base,
  [validate(['user', User.isUser]), userMw],
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

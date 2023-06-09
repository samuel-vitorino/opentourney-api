/**
 * Middleware to verify if the requester is a user.
 */

import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import SessionUtil from '@src/util/SessionUtil';
import User, { ISessionUser, UserRoles } from '@src/models/User';


// **** Variables **** //

const USER_UNAUTHORIZED_ERR = 'User not authorized to perform this action';


// **** Types **** //

type TSessionData = ISessionUser & JwtPayload;


// **** Functions **** //

/**
 * See note at beginning of file.
 */
async function userMw(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Get session data
  try {
    const sessionData = await SessionUtil.getSessionData<TSessionData>(req);
    res.locals.sessionUser = sessionData;
    return next();
  } catch (error) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: USER_UNAUTHORIZED_ERR });
  }
}


// **** Export Default **** //

export default userMw;
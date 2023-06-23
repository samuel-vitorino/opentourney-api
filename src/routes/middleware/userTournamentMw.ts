/**
 * Middleware to verify if the tournament belongs to a user.
 */

import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import SessionUtil from '@src/util/SessionUtil';
import User, { ISessionUser, UserRoles } from '@src/models/User';
import TournamentRepo from '@src/repos/TournamentRepo';


// **** Variables **** //

const USER_UNAUTHORIZED_ERR = 'User not authorized to perform this action';


// **** Types **** //

type TSessionData = ISessionUser & JwtPayload;


// **** Functions **** //

/**
 * See note at beginning of file.
 */
async function userTournamentMw(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Get session data
  const sessionData = await SessionUtil.getSessionData<TSessionData>(req);

  const tournament = await TournamentRepo.getOneById(+req.params.id);

  // Set session data to locals
  if (
    typeof sessionData === 'object' &&
    (sessionData?.id === tournament?.admin || sessionData?.role === UserRoles.Developer) 
  ) {
    res.locals.sessionUser = sessionData;
    return next();
  // Return an unauth error if user is not the owner of the data
  } else {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: USER_UNAUTHORIZED_ERR });
  }
}


// **** Export Default **** //

export default userTournamentMw;
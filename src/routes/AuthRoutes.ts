import HttpStatusCodes from '@src/constants/HttpStatusCodes';
import SessionUtil from '@src/util/SessionUtil';
import AuthService from '@src/services/AuthService';

import { IReq, IRes } from './types/express/misc';


// **** Types **** //

interface ILoginReq {
  email: string;
  pwd: string;
}


// **** Functions **** //

/**
 * Login a user.
 */
async function login(req: IReq<ILoginReq>, res: IRes) {
  const { email, pwd } = req.body;
  // Login
  const user = await AuthService.login(email, pwd);
  // Setup Cookie
  const userDetails = {
    id: user.id,
    steamID: user.steamID,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  }
  await SessionUtil.addSessionData(res, userDetails);
  // Return
  return res.status(HttpStatusCodes.OK).json(userDetails);
}

/**
 * Logout the user.
 */
function logout(_: IReq, res: IRes) {
  SessionUtil.clearCookie(res);
  return res.status(HttpStatusCodes.OK).end();
}


// **** Export default **** //

export default {
  login,
  logout,
} as const;

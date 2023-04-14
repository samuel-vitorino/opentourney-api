import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import UserService from '@src/services/UserService';
import { IUser } from '@src/models/User';
import { IReq, IRes } from './types/express/misc';
import SessionUtil from '@src/util/SessionUtil';
import { ISessionUser } from '@src/models/User';


// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(_: IReq, res: IRes) {
  const users = await UserService.getAll();
  return res.status(HttpStatusCodes.OK).json({ users });
}

async function getOne(req: IReq, res: IRes) {
  try {
    const user = await UserService.getOne(+req.params.id);
    return res.status(HttpStatusCodes.OK).json({ user });
  } catch(error) {
    return res.status(HttpStatusCodes.BAD_REQUEST);
  }
}

async function getLoggedIn(req: IReq, res: IRes) {
  try {
    const userData = <ISessionUser>(await SessionUtil.getSessionData<ISessionUser>(req));
    const user = await UserService.getOne(userData.id);

    if (user === null) {
      throw new Error();
    }

    return res.json(user);
  } catch(error) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).end();
  }
}

  /**
 * Add one user.
 */
async function add(req: IReq<{user: IUser}>, res: IRes) {
  const { user } = req.body;
  await UserService.addOne(user);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one user.
 */
async function update(req: IReq<{user: IUser}>, res: IRes) {
  const { user } = req.body;
  await UserService.updateOne(user);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one user.
 */
async function delete_(req: IReq, res: IRes) {
  const id = +req.params.id;
  await UserService.delete(id);
  return res.status(HttpStatusCodes.OK).end();
}


// **** Export default **** //

export default {
  getAll,
  getOne,
  getLoggedIn,
  add,
  update,
  delete: delete_,
} as const;

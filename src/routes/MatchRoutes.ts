import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import MatchService from '@src/services/MatchService';
import { IMatch } from '@src/models/Match';
import { IReq, IRes } from './types/express/misc';

// **** Functions **** //

/**
 * Get all matches.
 */
async function getAll(_: IReq, res: IRes) {
  const games = await MatchService.getAll();
  return res.status(HttpStatusCodes.OK).json({ games });
}

async function getOne(req: IReq, res: IRes) {
  try {
    const game = await MatchService.getOne(+req.params.id);
    return res.status(HttpStatusCodes.OK).json({ game });
  } catch(error) {
    return res.status(HttpStatusCodes.BAD_REQUEST);
  }
}

/**
 * Add one match.
 */
async function add(req: IReq<{game: IMatch}>, res: IRes) {
  const { game } = req.body;
  await MatchService.addOne(game);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one match.
 */
async function update(req: IReq<{game: IMatch}>, res: IRes) {
  const { game } = req.body;
  await MatchService.updateOne(game);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one match.
 */
async function delete_(req: IReq, res: IRes) {
  const id = +req.params.id;
  await MatchService.delete(id);
  return res.status(HttpStatusCodes.OK).end();
}


// **** Export default **** //

export default {
  getAll,
  getOne,
  add,
  update,
  delete: delete_,
} as const;

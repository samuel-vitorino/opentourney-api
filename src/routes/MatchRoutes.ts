import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import MatchService from '@src/services/MatchService';
import { IMatch } from '@src/models/Match';
import { IReq, IRes } from './types/express/misc';

// **** Functions **** //

/**
 * Get all matches.
 */
async function getAll(_: IReq, res: IRes) {
  const matches = await MatchService.getAll();
  return res.status(HttpStatusCodes.OK).json({ matches });
}

async function getOne(req: IReq, res: IRes) {
  try {
    const match = await MatchService.getOne(+req.params.id);
    return res.status(HttpStatusCodes.OK).json({ match });
  } catch(error) {
    return res.status(HttpStatusCodes.BAD_REQUEST);
  }
}

/**
 * Add one match.
 */
async function add(req: IReq<{match: IMatch}>, res: IRes) {
  const { match } = req.body;
  await MatchService.addOne(match);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one match.
 */
async function update(req: IReq<{match: IMatch}>, res: IRes) {
  const { match } = req.body;
  await MatchService.updateOne(match);
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

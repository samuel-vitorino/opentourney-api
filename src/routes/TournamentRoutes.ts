import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import TournamentService from '@src/services/TournamentService';
import { ITournament } from '@src/models/Tournament';
import { IReq, IRes } from './types/express/misc';

// **** Functions **** //

/**
 * Get all tournaments.
 */
async function getAll(_: IReq, res: IRes) {
  const tournaments = await TournamentService.getAll();
  return res.status(HttpStatusCodes.OK).json({ tournaments });
}

async function getOne(req: IReq, res: IRes) {
  try {
    const tournament = await TournamentService.getOne(+req.params.id);
    return res.status(HttpStatusCodes.OK).json({ tournament });
  } catch(error) {
    return res.status(HttpStatusCodes.BAD_REQUEST);
  }
}

/**
 * Add one tournament.
 */
async function add(req: IReq<{tournament: ITournament}>, res: IRes) {
  const { tournament } = req.body;
  await TournamentService.addOne(tournament);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one tournament.
 */
async function update(req: IReq<{tournament: ITournament}>, res: IRes) {
  const { tournament } = req.body;
  await TournamentService.updateOne(tournament);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one tournament.
 */
async function delete_(req: IReq, res: IRes) {
  const id = +req.params.id;
  await TournamentService.delete(id);
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

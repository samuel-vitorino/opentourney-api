import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import TeamService from "@src/services/TeamService";
import { ITeam } from "@src/models/Team";
import { IReq, IRes } from "./types/express/misc";
import { log } from "console";

// **** Functions **** //

/**
 * Get all teams.
 */
// async function getAll(req: IReq, res: IRes) {
//   const owner = parseInt(req.query.owner as string);
//   const teams = await TeamService.getAll(owner);
//   return res.status(HttpStatusCodes.OK).json({ teams });
// }

async function getOne(req: IReq, res: IRes) {
  try {
    const team = await TeamService.getOne(+req.params.id);
    return res.status(HttpStatusCodes.OK).json({ team });
  } catch (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST);
  }
}

// async function getOneByUser(req: IReq, res: IRes) {
//   try {
//     const team = await TeamService.getOneByUser(+req.params.id);
//     return res.status(HttpStatusCodes.OK).json({ team });
//   } catch(error) {
//     return res.status(HttpStatusCodes.BAD_REQUEST);
//   }
// }

async function getAll(req: IReq, res: IRes) {
  try {
    // WIthout params
    // const teams = await TeamService.getAllByUser(+req.params.id);
    // if with params (query)
    let teams = null;
    if (!req.query.owner) {
      teams = await TeamService.getAll();
    } else {
      const owner = parseInt(req.query.owner as string);

      teams = await TeamService.getAllByUser(owner);

    }

    // log(teams);

    return res.status(HttpStatusCodes.OK).json({ teams });
  } catch (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST);
  }
}

/**
 * Add one team.
 */
async function add(req: IReq<{ team: ITeam }>, res: IRes) {
  const { team } = req.body;
  await TeamService.addOne(team);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one team.
 */
async function update(req: IReq<{ team: ITeam }>, res: IRes) {
  const { team } = req.body;
  await TeamService.updateOne(team);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Delete one team.
 */
async function delete_(req: IReq, res: IRes) {
  const id = +req.params.id;
  await TeamService.delete(id);
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

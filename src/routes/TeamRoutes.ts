import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import TeamService from "@src/services/TeamService";
import { ITeam } from "@src/models/Team";
import { IReq, IRes } from "./types/express/misc";
import { log } from "console";
import SessionUtil from "@src/util/SessionUtil";
import { ISessionUser, UserRoles } from "@src/models/User";
import { JwtPayload } from "jsonwebtoken";
import fs from 'fs';
import path from 'path';


type TSessionData = ISessionUser & JwtPayload;

async function isAdmin(req: any): Promise<boolean> {
  const sessionData = await SessionUtil.getSessionData<TSessionData>(req);
  return typeof sessionData === 'object' &&
    (sessionData?.id === +req.params.id || sessionData?.role === UserRoles.Developer)
}

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
    log(team);
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

  if (team.avatar) {
    const games = team.avatar.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!games || games.length !== 3) {
      return res.status(400).send('Invalid base64 image data.');
    }

    const imageExtension = games[1].split('/')[1];
    const base64Image = games[2];

    // Generate a unique filename for the image
    const filename = `${Date.now()}_${team.name}.${imageExtension}`;

    // Save the image to the server
    const imagePath = path.join(__dirname, '../../public/images', filename);
    fs.writeFile(imagePath, base64Image, { encoding: 'base64' }, (err) => {
      if (err) {
        console.log('Error:', err);
        return res.status(500).send('An error occurred while saving the image.');
      }
      console.log('Image saved successfully.');
      return res.status(200).send('Image saved successfully.');
    });

    team.avatar = filename;
  }

  await TeamService.addOne(team, await isAdmin(req));
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one team.
 */
async function update(req: IReq<{ team: ITeam }>, res: IRes) {
  const { team } = req.body;

  if (team.avatar) {
    const games = team.avatar!.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!games || games.length !== 3) {
      return res.status(400).send('Invalid base64 image data.');
    }

    const imageExtension = games[1].split('/')[1];
    const base64Image = games[2];

    // Generate a unique filename for the image
    const filename = `${Date.now()}_${team.name}.${imageExtension}`;

    // Save the image to the server
    const imagePath = path.join(__dirname, '../../public/images', filename);
    fs.writeFile(imagePath, base64Image, { encoding: 'base64' }, (err) => {
      if (err) {
        console.log('Error:', err);
        return res.status(500).send('An error occurred while saving the image.');
      }
      console.log('Image saved successfully.');
      return res.status(200).send('Image saved successfully.');
    });

    team.avatar = filename;
  }


  await TeamService.updateOne(team, await isAdmin(req));
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

import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import UserService from "@src/services/UserService";
import { IUser } from "@src/models/User";
import { IReq, IRes } from "./types/express/misc";
import SessionUtil from "@src/util/SessionUtil";
import { ISessionUser } from "@src/models/User";
import TournamentService from "@src/services/TournamentService";
import { log } from "console";
import fs from "fs";
import path from "path";

// **** Functions **** //

/**
 * Get all users.
 */
async function getAll(req: IReq, res: IRes) {
  let users = null;

  if (req.query.name) {
    const user = req.query.name as string;
    users = await UserService.getAllByName(user);
  } else if (req.query.role) {
    users = await UserService.getAllStandard();
  } else {
    users = await UserService.getAll();
  }

  return res.status(HttpStatusCodes.OK).json({ users });
}

async function getAllTournaments(req: IReq, res: IRes) {
  const tournaments = await TournamentService.getAllByUser(+req.params.id);
  return res.status(HttpStatusCodes.OK).json({ tournaments });
}

async function getOne(req: IReq, res: IRes) {
  try {
    const user = await UserService.getOne(+req.params.id);
    return res.status(HttpStatusCodes.OK).json({ user });
  } catch (error) {
    return res.status(HttpStatusCodes.BAD_REQUEST);
  }
}

async function getLoggedIn(req: IReq, res: IRes) {
  try {
    const userData = <ISessionUser>(
      await SessionUtil.getSessionData<ISessionUser>(req)
    );
    const user = await UserService.getOne(userData.id);

    if (user === null) {
      throw new Error();
    }

    return res.json(user);
  } catch (error) {
    return res.status(HttpStatusCodes.UNAUTHORIZED).end();
  }
}

/**
 * Add one user.
 */
async function add(req: IReq<{ user: IUser }>, res: IRes) {
  const { user } = req.body;
  await UserService.addOne(user);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one user.
 */
async function update(req: IReq<{ user: IUser }>, res: IRes) {
  const { user } = req.body;
  if (user.avatar) {
    const games = user.avatar!.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!games || games.length !== 3) {
      return res.status(400).send("Invalid base64 image data.");
    }

    const imageExtension = games[1].split("/")[1];
    const base64Image = games[2];

    // Generate a unique filename for the image
    const filename = `${Date.now()}_${user.name}.${imageExtension}`;

    // Save the image to the server
    const imagePath = path.join(__dirname, "../../public/images", filename);
    fs.writeFile(imagePath, base64Image, { encoding: "base64" }, (err) => {
      if (err) {
        console.log("Error:", err);
        return res
          .status(500)
          .send("An error occurred while saving the image.");
      }
      console.log("Image saved successfully.");
    });

    user.avatar = filename;
  }

  const updatedUser = await UserService.updateOne(user);
  log(updatedUser);
  return res.status(HttpStatusCodes.OK).json({ updatedUser });
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
  getAllTournaments,
  getOne,
  getLoggedIn,
  add,
  update,
  delete: delete_,
} as const;

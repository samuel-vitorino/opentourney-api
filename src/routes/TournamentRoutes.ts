import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import TournamentService from '@src/services/TournamentService';
import { ITournament } from '@src/models/Tournament';
import { IReq, IRes } from './types/express/misc';
import fs from 'fs';
import path from 'path';

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
  
  if (tournament.avatar) {
    const matches = tournament.avatar.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).send('Invalid base64 image data.');
    }

    const imageExtension = matches[1].split('/')[1];
    const base64Image = matches[2];

    // Generate a unique filename for the image
    const filename = `${Date.now()}_${tournament.name}.${imageExtension}`;

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

    tournament.avatar = filename;
  }
  await TournamentService.addOne(tournament);
  return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one tournament.
 */
async function update(req: IReq<{tournament: ITournament}>, res: IRes) {
  const { tournament } = req.body;

  if (tournament.avatar !== undefined) {
    const matches = tournament.avatar!.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).send('Invalid base64 image data.');
    }

    const imageExtension = matches[1].split('/')[1];
    const base64Image = matches[2];

    // Generate a unique filename for the image
    const filename = `${Date.now()}_${tournament.name}.${imageExtension}`;

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

    tournament.avatar = filename;
  }

  await TournamentService.updateOne(tournament);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Update tournament status.
 */
async function updateStatus(req: IReq<{status: number}>, res: IRes) {
  const { status } = req.body;

  if (status > 2 || status < 0) {
    return res.status(HttpStatusCodes.BAD_REQUEST).end();
  } 

  await TournamentService.updateStatus(+req.params.id, status);
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
  updateStatus,
  delete: delete_,
} as const;

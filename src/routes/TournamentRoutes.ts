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

async function getTeams(req: IReq, res: IRes) {
  try {
    const tournament = await TournamentService.getTeams(+req.params.id);
    return res.status(HttpStatusCodes.OK).json({ tournament });
  } catch(error) {
    return res.status(HttpStatusCodes.BAD_REQUEST);
  }
}

async function getMatches(req: IReq, res: IRes) {
  try {
    const tournament = await TournamentService.getMatches(+req.params.id);
    return res.status(HttpStatusCodes.OK).json({ tournament });
  } catch(error) {
    return res.status(HttpStatusCodes.BAD_REQUEST);
  }
}

async function addTeam(req: IReq<{team: number}>, res: IRes) {
  const { team } = req.body;

  try {
    const tournament = await TournamentService.addTeam(+req.params.id, team);
    return res.status(HttpStatusCodes.OK).json({ tournament });
  } catch(error) {
    return res.status(HttpStatusCodes.BAD_REQUEST);
  }
}

async function removeTeam(req: IReq, res: IRes) {
  try {
    const tournament = await TournamentService.removeTeam(+req.params.id, +req.params.team_id);
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
    const games = tournament.avatar.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!games || games.length !== 3) {
      return res.status(400).send('Invalid base64 image data.');
    }

    const imageExtension = games[1].split('/')[1];
    const base64Image = games[2];

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
    const games = tournament.avatar!.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!games || games.length !== 3) {
      return res.status(400).send('Invalid base64 image data.');
    }

    const imageExtension = games[1].split('/')[1];
    const base64Image = games[2];

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
  getTeams,
  getMatches,
  addTeam,
  removeTeam,
  add,
  update,
  updateStatus,
  delete: delete_,
} as const;

/**
 * Setup express server.
 */

import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import passport from 'passport';
import SteamStrategy from 'passport-steam';

import 'express-async-errors';

import BaseRouter from '@src/routes/api';
import Paths from '@src/routes/constants/Paths';

import EnvVars from '@src/constants/EnvVars';
import HttpStatusCodes from '@src/constants/HttpStatusCodes';

import { NodeEnvs } from '@src/constants/misc';
import { RouteError } from '@src/other/classes';

import { JsonDatabase } from 'brackets-json-db';
import { BracketsManager } from 'brackets-manager';


const gamePorts = [{30015: false}, {30016: false}, {30017: false}, {30018: false}]

const jsonStorage = new JsonDatabase("manager_db/db.json");
const manager = new BracketsManager(jsonStorage);

// **** Variables **** //

const app = express();

app.locals.jsonStorage = jsonStorage;
app.locals.manager = manager;
app.locals.gamePorts = gamePorts;

// **** Setup **** //

// Basic middleware
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(EnvVars.CookieProps.Secret));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan('dev'));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production) {
  app.use(helmet());
}

// CORS
app.use(cors({credentials: true, origin: EnvVars.CORS.origins}));

//Passport
passport.use(new SteamStrategy.Strategy({
    returnURL: `${EnvVars.CORS.origins}/api/auth/steam/return`,
    realm: EnvVars.CORS.origins,
    apiKey: EnvVars.Steam.ApiKey,
}, function(identifier: string, profile: Object, done: passport.DoneCallback) {
    done(null, profile);
}));

// Add APIs, must be after middleware
app.use(Paths.Base, BaseRouter);

app.use(express.static('public'));

// Add error handler
app.use((
  err: Error,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ error: err.message });
});

// **** Export default **** //

export default app;

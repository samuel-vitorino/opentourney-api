import { IReq, IRes } from './types/express/misc';
import { ISessionUser } from '@src/models/User';
import SessionUtil from '@src/util/SessionUtil';
import SteamService from '@src/services/SteamService';

import EnvVars from '@src/constants/EnvVars';

interface SteamUserDetails {
    _json: SteamUser;
}

interface SteamUser {
    steamid: string;
}

async function steamCallback(req: IReq, res: IRes) {
    try { 
        const userData = await SessionUtil.getSessionData<ISessionUser>(req);
        const success = await SteamService.connectSteamID((<ISessionUser>userData).id, (<SteamUserDetails>req.user)._json.steamid);
        
        if (!success) {
            throw new Error()
        }
        
        return res.redirect(`${EnvVars.CORS.origins}/settings`);

    } catch (error) {
        return res.redirect(`${EnvVars.CORS.origins}/`)
    }
}

export default {
    steamCallback
} as const;
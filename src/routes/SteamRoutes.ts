import { IReq, IRes } from './types/express/misc';
import { ISessionUser } from '@src/models/User';
import SessionUtil from '@src/util/SessionUtil';
import SteamService from '@src/services/SteamService';

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
        
        return res.redirect("http://localhost:5173/settings");

    } catch (error) {
        return res.redirect("http://localhost:5173/")
    }
}

export default {
    steamCallback
} as const;
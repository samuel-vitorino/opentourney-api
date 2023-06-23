import HttpStatusCodes from "@src/constants/HttpStatusCodes";

import RequestService from "@src/services/RequestService";
import { IRequest } from "@src/models/Request";
import { IReq, IRes } from "./types/express/misc";
import { log } from "console";

// **** Functions **** //

// async function getOne(req: IReq, res: IRes) {
//     try {
//         const request = await RequestService.getOne(+req.params.id);
//         return res.status(HttpStatusCodes.OK).json({ request });
//     } catch (error) {
//         return res.status(HttpStatusCodes.BAD_REQUEST);
//     }
// }

async function getAll(req: IReq, res: IRes) {
    try {
        let requests = null;
        if (!req.query.user) {
            requests = await RequestService.getAll();
        } else {
            const user_id = parseInt(req.query.user as string);
            requests = await RequestService.getAllByUser(user_id);
        }

        return res.status(HttpStatusCodes.OK).json({ requests });
    } catch (error) {
        return res.status(HttpStatusCodes.BAD_REQUEST);
    }
}

/**
 * Add one request.
 */
async function add(req: IReq<{ request: IRequest }>, res: IRes) {
    const { request } = req.body;
    await RequestService.addOne(request);
    return res.status(HttpStatusCodes.CREATED).end();
}

/**
 * Update one request.
 */
async function update(req: IReq<{ request: IRequest }>, res: IRes) {
    const { request } = req.body;
    await RequestService.updateOne(request);
    return res.status(HttpStatusCodes.OK).end();
}

// **** Export default **** //

export default {
    getAll,
    // getOne,
    add,
    update,
} as const;

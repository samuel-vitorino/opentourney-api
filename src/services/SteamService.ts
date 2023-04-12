import UserRepo from '@src/repos/UserRepo';

async function connectSteamID(userId: number, steamID: string) {
    return UserRepo.addSteamID(userId, steamID);
}

export default {
    connectSteamID
} as const;
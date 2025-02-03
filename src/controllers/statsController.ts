import { myDataSource } from "..";
import { Stats, statsRepo } from "../entities/statsEntity";
import { User } from "../entities/userEntity";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
export const createStats = async (user: User) => {
    
    const newStats = statsRepo.create({ user, totalLogins: 0 });
    await statsRepo.save(newStats);
    return newStats;
};

export const getStatsByUserId = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if(!userId) return res.status(400).json({ message: 'Invalid user id' });
    return await myDataSource.getRepository(Stats).findOne({ where: { user: { id: userId } } });
};

export const updateStatsOnLogin = async (userId: number) => {
    
    let userStats = await statsRepo.findOne({ where: { user: { id: userId } } });
    if (userStats) {
        userStats.totalLogins += 1;
        userStats.lastLogin = new Date();
        await statsRepo.save(userStats);
    }
};

export const deleteStats = async (userId: number) => {
    return await myDataSource.getRepository(Stats).delete({ user: { id: userId } });
};



export const getTopLoginUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await myDataSource.getRepository(Stats)
        .createQueryBuilder('stats')
        .innerJoinAndSelect('stats.user', 'user')
        .orderBy('stats.totalLogins', 'DESC')
        .limit(3)
        .getMany();
    res.json(users);
});

export const getInactiveUsers = asyncHandler(async (req: Request, res: Response) => {
    const { period } = req.query;
    const threshold = period === 'month' ? 'INTERVAL 1 MONTH' : 'INTERVAL 1 HOUR';

    const users = await myDataSource.getRepository(Stats)
        .createQueryBuilder('stats')
        .innerJoinAndSelect('stats.user', 'user')
        .where(`stats.lastLogin < NOW() - ${threshold}`)
        .getMany();
    
    res.json(users);
});

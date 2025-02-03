import { validationResult } from "express-validator";
import { myDataSource } from "..";
import { User } from "../entities/userEntity";
import { createStats } from "./statsController";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import bcrypt from "bcryptjs";
export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(error => error.msg) });
    }
    try {
        const userRepo = myDataSource.getRepository(User);
        const existingUser = await userRepo.findOne({ where: { email: req.body.email } });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        const { password, name,email,role } = req.body;
        const newUser = userRepo.create({ password, name,email,role });
        const savedUser = await userRepo.save(newUser);
        await createStats(savedUser);
        res.status(201).json({user:savedUser, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
})

export const getUserByEmail = async (email: string) => {
    const userRepo = myDataSource.getRepository(User);
    return await userRepo.findOne({ where: { email } });
};


export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(error => error.msg) });
    }
    try {
        const userRepo = myDataSource.getRepository(User);
        let existingUser = await userRepo.findOne({ where: { id: Number(req.params.id) } });
        if (!existingUser) return res.status(404).json({ message: 'User not found' });

        Object.assign(existingUser, req.body);
        if (req.body.password) {
            existingUser.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await userRepo.save(existingUser);
        res.status(200).json({ updatedUser, message: 'User updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error updating user', error });
    }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const userRepo = myDataSource.getRepository(User);
        const user = await userRepo.findOne({ where: { id: Number(req.params.id) } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        await userRepo.delete(req.params.id);
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

export const getUserDetails = asyncHandler(async (req: Request, res: Response) => {
    const user = await myDataSource.getRepository(User).findOne({ where: { id: Number(req.params.id) } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({user, message: 'User details fetched successfully' });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, verified, startDate, endDate, page = 1, limit = 10 } = req.query;
    const userRepo = myDataSource.getRepository(User);
    
    console.log({
        name, email, verified, startDate, endDate, page , limit 
    })
    
    let query = userRepo.createQueryBuilder('user');
    if (name) query.andWhere('user.name LIKE :name', { name: `%${name}%` });
    if (email) query.andWhere('user.email LIKE :email', { email: `%${email}%` });
    if (verified !== undefined && verified !== '') query.andWhere('user.verified = :verified', { verified: verified === 'true' });
    if (startDate && endDate) query.andWhere('user.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    
    
    const users = await query
    .skip((Number(page) - 1) * Number(limit))
    .take(Number(limit))
    .getMany();
    const totalUsers = await query.getCount();
    const totalVerifiedUsers = await query.andWhere('user.verified = true').getCount();
    
    res.json({ totalUsers, totalVerifiedUsers, currentPage: Number(page), usersPerPage: Number(limit), users });
    
});

export const getTotalUsers = asyncHandler(async (req: Request, res: Response) => {
    const count = await myDataSource.getRepository(User).count();
    res.json({ totalUsers: count });
});

export const getTotalVerifiedUsers = asyncHandler(async (req: Request, res: Response) => {
    const count = await myDataSource.getRepository(User).count({ where: { verified: true } });
    res.json({ totalVerifiedUsers: count });
});
import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail, updateUser } from './userController';
import { createStats, updateStatsOnLogin } from './statsController';
import { myDataSource } from '..';
import { User } from '../entities/userEntity';
import { asyncHandler } from '../utils/asyncHandler';
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(error => error.msg) });
        }

        const { name, email, password } = req.body;
        const userData = { name, email,password,  verified: false }
        const userRepo = myDataSource.getRepository(User);
        const newUser = userRepo.create(userData);
        const savedUser = await userRepo.save(newUser);
        await createStats(savedUser)
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(error => error.msg) });
        }

        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });


        const token = jwt.sign({ id: user.id ,role: user.role}, process.env.JWT_SECRET!, { expiresIn: '1h' });
        await updateStatsOnLogin(user.id);

        res.json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

export const verifyUser = asyncHandler(async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array().map(error => error.msg) });
        }
        const { email } = req.body;
        const user = await getUserByEmail(email);
        if (!user) return res.status(400).json({ message: 'User not found' });
        if(user.verified) return res.status(400).json({ message: 'User already verified' });
        user.verified = true;
        const userRepo = myDataSource.getRepository(User);
        await userRepo.update(user.id, { verified: true });
        res.json({ message: 'User verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying user', error });
    }
});
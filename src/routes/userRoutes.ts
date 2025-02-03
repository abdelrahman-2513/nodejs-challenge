import { Router } from 'express';
import { createUser, updateUser, deleteUser, getAllUsers, getUserDetails } from '../controllers/userController';
import { asyncHandler } from '../utils/asyncHandler';
import { validateCreateUser, validateUpdateUser } from '../dtos/user-dto';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware';

export const userRouter = Router()

userRouter.route('/:id').get(authenticateToken, asyncHandler(getUserDetails))
    .patch(authenticateToken,isAdmin,validateUpdateUser, asyncHandler(updateUser))
    .delete(authenticateToken, asyncHandler(deleteUser))

userRouter.route('/').get(authenticateToken, isAdmin, asyncHandler(getAllUsers))
    .post(authenticateToken, isAdmin,validateCreateUser, asyncHandler(createUser))



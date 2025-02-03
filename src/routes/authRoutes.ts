import { Router } from 'express';
import { loginUser, registerUser, verifyUser } from '../controllers/authController';
import { validateCreateUser, validateLoginUser, validateVerifyUser } from '../dtos/userDto/user-dto';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticateToken } from '../middlewares/authMiddleware';


const authRouter = Router();

authRouter.post('/register', validateCreateUser, asyncHandler(registerUser));
authRouter.post('/login', validateLoginUser, asyncHandler(loginUser));
authRouter.post('/verfiy',authenticateToken,validateVerifyUser,asyncHandler(verifyUser))

export default authRouter;
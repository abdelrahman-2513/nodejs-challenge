import { Router } from 'express';
import { getInactiveUsers, getTopLoginUsers } from '../controllers/statsController';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware';
import { asyncHandler } from '../utils/asyncHandler';

export const statsRouter = Router();


statsRouter.get('/top', authenticateToken,isAdmin, asyncHandler(getTopLoginUsers));
statsRouter.get('/inactive', authenticateToken,isAdmin, asyncHandler(getInactiveUsers));

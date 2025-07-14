/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middlewares
 */
import { authenticate } from '../middlewares/authenticate';
/**
 * Controllers
 */
import { userController } from '../controllers/userController';

const userRoute = Router();

userRoute.get('/current-user', authenticate, userController.getCurrentUser);
userRoute.get('/summary', userController.getUserSummary);
userRoute.get('/', userController.getAllUsers);
userRoute.patch('/:userId/status', userController.updateUserStatus);
userRoute.put('/profile', authenticate, userController.updateProfile);
userRoute.put('/change-password', authenticate, userController.changePassword);

export default userRoute;

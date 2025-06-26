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
userRoute.get('/', authenticate, userController.getUsers);
userRoute.get('/:id', authenticate, userController.getUserById);
userRoute.post('/', authenticate, userController.createUser);
userRoute.patch('/:id', authenticate, userController.updateUser);
userRoute.delete('/:id', authenticate, userController.deleteUser);

export default userRoute;

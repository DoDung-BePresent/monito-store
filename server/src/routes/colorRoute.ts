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
import { colorController } from '../controllers/colorController';

const colorRoute = Router();

// Public routes
colorRoute.get('/', colorController.getColors);
colorRoute.get('/:id', colorController.getColorById);

// Protected routes
colorRoute.post('/', authenticate, colorController.createColor);
colorRoute.put('/:id', authenticate, colorController.updateColor);
colorRoute.delete('/:id', authenticate, colorController.deleteColor);

export default colorRoute;

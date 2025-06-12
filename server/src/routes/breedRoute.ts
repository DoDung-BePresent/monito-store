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
import { breedController } from '../controllers/breedController';

const breedRoute = Router();

// Public routes
breedRoute.get('/', breedController.getBreeds);
breedRoute.get('/:id', breedController.getBreedById);

// Protected routes
breedRoute.post('/', authenticate, breedController.createBreed);
breedRoute.put('/:id', authenticate, breedController.updateBreed);
breedRoute.delete('/:id', authenticate, breedController.deleteBreed);

export default breedRoute;

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
import { petController } from '../controllers/petController';

const petRoute = Router();

// Public routes
petRoute.get('/', petController.getPets);
petRoute.get('/:id', petController.getPetById);
petRoute.get('/sku/:sku', petController.getPetBySku);

// Protected routes
petRoute.post('/', authenticate, petController.createPet);
petRoute.put('/:id', authenticate, petController.updatePet);
petRoute.delete('/:id', authenticate, petController.deletePet);
petRoute.patch(
  '/:id/availability',
  authenticate,
  petController.updateAvailability,
);

export default petRoute;

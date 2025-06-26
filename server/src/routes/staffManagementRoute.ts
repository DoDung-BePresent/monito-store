/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middlewares
 */
import { authenticate } from '../middlewares/authenticate';
import { requireAdmin } from '../middlewares/authorize';

/**
 * Controllers
 */
import { staffManagementController } from '../controllers/staffManagementController';

const staffManagementRoute = Router();

// All routes require authentication and admin role
staffManagementRoute.use(authenticate, requireAdmin);


staffManagementRoute.get('/', staffManagementController.getStaffs);


staffManagementRoute.get('/:id', staffManagementController.getStaffById);

staffManagementRoute.post('/', staffManagementController.createStaff);

staffManagementRoute.put('/:id', staffManagementController.updateStaff);

staffManagementRoute.delete('/:id', staffManagementController.deleteStaff);

staffManagementRoute.delete('/:id/permanent', staffManagementController.permanentDeleteStaff);

staffManagementRoute.patch('/:id/activate', staffManagementController.activateStaff);

export default staffManagementRoute;

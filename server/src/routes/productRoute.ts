/**
 * Node modules
 */
import { Router } from 'express';

/**
 * Middlewares
 */
import { authenticate } from '../middlewares/authenticate';
import { requireAdminOrStaff } from '../middlewares/authorize';

/**
 * Controllers
 */
import { productController } from '../controllers/productController';

const productRoute = Router();

// Public routes
productRoute.get('/', productController.getProducts);
// Completely separate route to avoid any conflicts
productRoute.get('/options/filters', (req, res, next) => {
  console.log('Filter options route hit');
  productController.getFilterOptions(req, res, next);
});
// ID route (must come after all specific routes with parameters)
productRoute.get('/:id', (req, res, next) => {
  console.log('ID route hit with param:', req.params.id);
  productController.getProductById(req, res, next);
});

// Protected routes - Only admin and staff can manage products
productRoute.post(
  '/',
  authenticate,
  requireAdminOrStaff,
  productController.createProduct,
);
productRoute.put(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  productController.updateProduct,
);
productRoute.delete(
  '/:id',
  authenticate,
  requireAdminOrStaff,
  productController.deleteProduct,
);
productRoute.patch(
  '/:id/stock',
  authenticate,
  requireAdminOrStaff,
  productController.updateStock,
);

export default productRoute;

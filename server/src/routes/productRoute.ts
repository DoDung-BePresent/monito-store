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
import { productController } from '../controllers/productController';

const productRoute = Router();

// Public routes
productRoute.get('/', productController.getProducts);
productRoute.get('/:id', productController.getProductById);

// Protected routes
productRoute.post('/', authenticate, productController.createProduct);
productRoute.put('/:id', authenticate, productController.updateProduct);
productRoute.delete('/:id', authenticate, productController.deleteProduct);
productRoute.patch('/:id/stock', authenticate, productController.updateStock);

export default productRoute;

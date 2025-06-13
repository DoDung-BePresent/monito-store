import { Router } from 'express';
import { filterProductController } from '../controllers/filterProductController';

const filterProductRoute = Router();

filterProductRoute.get('/', filterProductController.filterProducts);
filterProductRoute.get('/options', filterProductController.getFilterOptions);

export default filterProductRoute;
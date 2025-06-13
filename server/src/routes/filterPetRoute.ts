
import { Router } from 'express';
import { filterPetController } from '../controllers/filterPetController';


const filterPetRoute = Router();

filterPetRoute.get('/', filterPetController.filterPets);
filterPetRoute.get('/options', filterPetController.getFilterOptions);

export default filterPetRoute;
/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Validations
 */
import {
  createPetSchema,
  updatePetSchema,
  petFiltersSchema,
} from '../validations/petValidation';

/**
 * Services
 */
import { petService } from '../services/petService';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

export const petController = {
  async createPet(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = createPetSchema.parse(req.body);
      const userId = req.userId!;
      
      const petData = {
        ...body,
        publishedDate: body.publishedDate || new Date()
      };

      const pet = await petService.createPet(petData, userId);

      res.status(STATUS_CODE.CREATED).json({
        message: 'Pet created successfully',
        data: { pet },
      });
    } catch (error) {
      next(error);
    }
  },

  async getPets(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const filters = petFiltersSchema.parse(req.query);

      const result = await petService.getPets(filters);

      res.status(STATUS_CODE.OK).json({
        message: 'Pets retrieved successfully',
        data: result.pets,
        meta: {
          pagination: result.pagination,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getPetById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const pet = await petService.getPetById(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Pet retrieved successfully',
        data: { pet },
      });
    } catch (error) {
      next(error);
    }
  },

  async getPetBySku(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { sku } = req.params;

      const pet = await petService.getPetBySku(sku);

      res.status(STATUS_CODE.OK).json({
        message: 'Pet retrieved successfully',
        data: { pet },
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePet(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const body = updatePetSchema.parse(req.body);
      const userId = req.userId!;

      const pet = await petService.updatePet(id, body, userId);

      res.status(STATUS_CODE.OK).json({
        message: 'Pet updated successfully',
        data: { pet },
      });
    } catch (error) {
      next(error);
    }
  },

  async deletePet(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      await petService.deletePet(id, userId);

      res.status(STATUS_CODE.OK).json({
        message: 'Pet deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async updateAvailability(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { isAvailable } = req.body;
      const userId = req.userId!;

      if (typeof isAvailable !== 'boolean') {
          res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'isAvailable must be a boolean value',
        });
      }

      const pet = await petService.updateAvailability(id, isAvailable, userId);

      res.status(STATUS_CODE.OK).json({
        message: 'Pet availability updated successfully',
        data: { pet },
      });
    } catch (error) {
      next(error);
    }
  },
};

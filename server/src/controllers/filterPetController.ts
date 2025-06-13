import { Request, Response, NextFunction } from 'express';
import { filterPets, getFilterOptions } from '../services/filterPetService';
import { PetFilters } from '../types/pet';
import { BadRequestException } from '../utils/errors';
import { STATUS_CODE } from '../constants';

export const filterPetController = {
  /**
   * Filter and sort pets
   */
  async filterPets(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filters: PetFilters = {
        // Extract sidebar filters
        breed: req.query.breed as string,
        gender: req.query.gender as string,
        color: req.query.color as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        
        // Extract dropdown filters
        size: req.query.size as string,
        location: req.query.location as string,
        isAvailable: req.query.isAvailable === 'true' ? true : 
                    req.query.isAvailable === 'false' ? false : undefined,
        
        // Pagination
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
        
        // Sorting
        sortBy: req.query.sortBy as any || 'publishedDate',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
      };
      
      if (filters.minPrice !== undefined && isNaN(filters.minPrice)) {
        throw new BadRequestException('Min price must be a valid number');
      }
      
      if (filters.maxPrice !== undefined && isNaN(filters.maxPrice)) {
        throw new BadRequestException('Max price must be a valid number');
      }
      
      if (isNaN(filters.page as number) || (filters.page as number) < 1) {
        throw new BadRequestException('Page must be a valid positive number');
      }
      
      if (isNaN(filters.limit as number) || (filters.limit as number) < 1) {
        throw new BadRequestException('Limit must be a valid positive number');
      }
      
      const result = await filterPets(filters);
      
      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'Pets filtered successfully',
        data: result.pets,
        pagination: result.pagination,
        appliedFilters: result.filters,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get filter options for sidebar
   */
  async getFilterOptions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filterOptions = await getFilterOptions();
      
      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'Filter options retrieved successfully',
        data: filterOptions,
      });
    } catch (error) {
      next(error);
    }
  }
};
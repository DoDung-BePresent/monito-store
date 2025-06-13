import { Request, Response, NextFunction } from 'express';
import { filterProducts, getProductFilterOptions } from '../services/filterProductService';
import { ProductFilters } from '../types/product';
import { BadRequestException } from '../utils/errors';
import { STATUS_CODE } from '../constants';

export const filterProductController = {
  /**
   * Filter and sort products
   */
  async filterProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filters: ProductFilters = {
        category: req.query.category as string,
        brand: req.query.brand as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        petType: req.query.petType as string,
        inStock: req.query.inStock === 'true' ? true : 
                 req.query.inStock === 'false' ? false : undefined,
        isActive: req.query.isActive === 'true' ? true : 
                  req.query.isActive === 'false' ? false : undefined,

        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 15,

        sortBy: (req.query.sortBy as 'name' | 'price' | 'rating' | 'createdAt') || 'createdAt',
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
      
      const result = await filterProducts(filters);
      
      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'Products filtered successfully',
        data: result.products,
        pagination: result.pagination,
        appliedFilters: result.filters,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get filter options for products sidebar
   */
  async getFilterOptions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const filterOptions = await getProductFilterOptions();
      
      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'Product filter options retrieved successfully',
        data: filterOptions,
      });
    } catch (error) {
      next(error);
    }
  }
};
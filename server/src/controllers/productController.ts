/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Validations
 */
import {
  createProductSchema,
  updateProductSchema,
  productFiltersSchema,
} from '../validations/productValidation';

/**
 * Services
 */
import { productService } from '../services/productService';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

export const productController = {
  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const body = createProductSchema.parse(req.body);

      const product = await productService.createProduct(body);

      res.status(STATUS_CODE.CREATED).json({
        message: 'Product created successfully',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  },
  async getProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      console.log('Raw query parameters:', req.query);
      const filters = productFiltersSchema.parse(req.query);
      console.log('Parsed filters:', filters);

      const result = await productService.getProducts(filters);

      res.status(STATUS_CODE.OK).json({
        message: 'Products retrieved successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in getProducts controller:', error);
      next(error);
    }
  },
  async getProductById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      
      // Add ObjectId validation
      if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Invalid product ID format',
        });
        return;
      }

      const product = await productService.getProductById(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Product retrieved successfully',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const body = updateProductSchema.parse(req.body);

      const product = await productService.updateProduct(id, body);

      res.status(STATUS_CODE.OK).json({
        message: 'Product updated successfully',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      await productService.deleteProduct(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
  async getFilterOptions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const filterOptions = await productService.getFilterOptions();

      res.status(STATUS_CODE.OK).json({
        message: 'Filter options retrieved successfully',
        data: filterOptions,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateStock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const { id } = req.params;
      const { quantity, operation } = req.body;

      if (!quantity || !operation || !['add', 'subtract'].includes(operation)) {
        res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Quantity and valid operation (add/subtract) are required',
        });
        return;
      }

      const product = await productService.updateStock(id, quantity, operation);

      res.status(STATUS_CODE.OK).json({
        message: 'Stock updated successfully',
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  },
};

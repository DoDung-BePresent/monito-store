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
      const userId = req.userId!;

      const product = await productService.createProduct(body, userId);

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
      const filters = productFiltersSchema.parse(req.query);

      const result = await productService.getProducts(filters);

      res.status(STATUS_CODE.OK).json({
        message: 'Products retrieved successfully',
        data: result.products,
        meta: {
          pagination: result.pagination,
        },
      });
    } catch (error) {
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
      const userId = req.userId!;

      const product = await productService.updateProduct(id, body, userId);

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
      const userId = req.userId!;

      await productService.deleteProduct(id, userId);

      res.status(STATUS_CODE.OK).json({
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async updateStock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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

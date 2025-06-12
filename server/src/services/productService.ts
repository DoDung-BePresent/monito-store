/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Types
 */
import {
  CreateProductPayload,
  UpdateProductPayload,
  ProductFilters,
} from '../types/product';

/**
 * Models
 */
import ProductModel from '../models/productModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';
import { ERROR_CODE_ENUM } from '../constants';

export const productService = {
  /**
   * Create new product
   */
  async createProduct(data: CreateProductPayload, userId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const newProduct = new ProductModel({
          ...data,
          createdBy: userId,
        });

        await newProduct.save({ session });
        await newProduct.populate('createdBy', 'name email');

        return newProduct;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Get all products with filters and pagination
   */
  async getProducts(filters: ProductFilters) {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      petType,
      inStock,
      isActive,
      page = 1,
      limit = 15,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    // Build query
    const query: any = {};

    if (category) query.category = category;
    if (brand) query.brand = new RegExp(brand, 'i');
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    if (petType) query['specifications.petType'] = { $in: [petType] };
    if (inStock !== undefined) query.isInStock = inStock;
    if (isActive !== undefined) query.isActive = isActive;

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [products, total] = await Promise.all([
      ProductModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .lean(),
      ProductModel.countDocuments(query),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get product by ID
   */
  async getProductById(productId: string) {
    const product = await ProductModel.findById(productId).populate(
      'createdBy',
      'name email',
    );

    if (!product) {
      throw new NotFoundException(
        'Product not found',
        ERROR_CODE_ENUM.PRODUCT_NOT_FOUND,
      );
    }

    return product;
  },

  /**
   * Update product
   */
  async updateProduct(
    productId: string,
    data: UpdateProductPayload,
    userId: string,
  ) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const product = await ProductModel.findById(productId).session(session);

        if (!product) {
          throw new NotFoundException(
            'Product not found',
            ERROR_CODE_ENUM.PRODUCT_NOT_FOUND,
          );
        }

        // Check if user is the creator or admin
        if (product.createdBy.toString() !== userId) {
          // Here you would check if user is admin
          // For now, only creator can update
          throw new BadRequestException(
            'You can only update your own products',
          );
        }

        Object.assign(product, data);
        await product.save({ session });
        await product.populate('createdBy', 'name email');

        return product;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Delete product
   */
  async deleteProduct(productId: string, userId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const product = await ProductModel.findById(productId).session(session);

        if (!product) {
          throw new NotFoundException(
            'Product not found',
            ERROR_CODE_ENUM.PRODUCT_NOT_FOUND,
          );
        }

        // Check if user is the creator or admin
        if (product.createdBy.toString() !== userId) {
          throw new BadRequestException(
            'You can only delete your own products',
          );
        }

        await ProductModel.findByIdAndDelete(productId).session(session);
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Update stock
   */
  async updateStock(
    productId: string,
    quantity: number,
    operation: 'add' | 'subtract',
  ) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const product = await ProductModel.findById(productId).session(session);

        if (!product) {
          throw new NotFoundException(
            'Product not found',
            ERROR_CODE_ENUM.PRODUCT_NOT_FOUND,
          );
        }

        const newStock =
          operation === 'add'
            ? product.stock + quantity
            : product.stock - quantity;

        if (newStock < 0) {
          throw new BadRequestException(
            'Insufficient stock',
            ERROR_CODE_ENUM.INSUFFICIENT_STOCK,
          );
        }

        product.stock = newStock;
        await product.save({ session });

        return product;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },
};

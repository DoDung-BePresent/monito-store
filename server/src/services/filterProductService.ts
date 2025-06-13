import mongoose from 'mongoose';
import ProductModel from '../models/productModel';
import { ProductFilters } from '../types/product';
import { NotFoundException } from '../utils/errors';

/**
 * Filter and sort products based on various criteria
 */
export const filterProducts = async (filters: ProductFilters) => {
  try {
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

    const query: Record<string, any> = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    
    if (petType) {
      query['specifications.petType'] = petType;
    }

    if (inStock !== undefined) {
      query.isInStock = inStock;
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Determine sort order
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy || 'createdAt'] = sortOrder === 'asc' ? 1 : -1;

    // Execute query with pagination and sorting
    const products = await ProductModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await ProductModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        applied: Object.keys(query).length > 0,
        criteria: query,
      },
    };
  } catch (error) {
    console.error('Error in filterProducts service:', error);
    throw error;
  }
};

/**
 * Get available filter options for products sidebar
 */
export const getProductFilterOptions = async () => {
  try {
    const categories = await ProductModel.distinct('category');

    const brands = await ProductModel.distinct('brand');

    const priceData = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);
    
    const priceRange = priceData.length > 0 ? {
      min: priceData[0].minPrice,
      max: priceData[0].maxPrice,
    } : { min: 0, max: 1000 };
    
    const petTypes = await ProductModel.distinct('specifications.petType');
    
    return {
      categories,
      brands,
      priceRange,
      petTypes
    };
  } catch (error) {
    console.error('Error in getProductFilterOptions service:', error);
    throw error;
  }
};
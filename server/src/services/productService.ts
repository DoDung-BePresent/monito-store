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
import CategoryModel from '../models/categoryModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';
import { ERROR_CODE_ENUM } from '../constants';

export const productService = {
  /**
   * Create new product
   */
  async createProduct(data: CreateProductPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        // Validate category exists
        const categoryExists = await CategoryModel.exists({
          _id: data.category,
          isActive: true,
        }).session(session);
        if (!categoryExists) {
          throw new BadRequestException('Invalid category selected');
        }

        const newProduct = new ProductModel(data);

        await newProduct.save({ session });
        await newProduct.populate([
          { path: 'category', select: 'name description' },
        ]);

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
    console.log('Received filters:', filters);
    console.log('Category type:', typeof filters.category);
    console.log('Category value:', filters.category);
    console.log('Is category array?', Array.isArray(filters.category));
    
    const {
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      inStock,
      isActive,
      page = 1,
      limit = 15,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    // Build query
    const query: any = {};    // Handle search functionality
    if (search) {
      const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'); // Escape special regex chars
      
      // Be very careful with search to avoid any ObjectId conflicts
      const searchConditions: any[] = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex }
      ];
      
      // Only add tags search if it's safe (no potential ObjectId conflicts)
      if (search && !mongoose.Types.ObjectId.isValid(search)) {
        searchConditions.push({ tags: searchRegex });
      }
      
      query.$or = searchConditions;
    }

    if (brand) query.brand = new RegExp(brand, 'i');
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    if (inStock !== undefined) query.isInStock = inStock;
    if (isActive !== undefined) query.isActive = isActive;    // Handle category filter (can be ObjectId or category name)
    if (category && typeof category === 'string' && category.trim() !== '') {
      const trimmedCategory = category.trim();
      console.log('Processing category filter:', trimmedCategory);
      console.log('Is valid ObjectId?', mongoose.Types.ObjectId.isValid(trimmedCategory));
      
      if (mongoose.Types.ObjectId.isValid(trimmedCategory)) {
        // If it's a valid ObjectId, use it directly
        query.category = new mongoose.Types.ObjectId(trimmedCategory);
        console.log('Using category as ObjectId:', trimmedCategory);
      } else {
        // If it's not a valid ObjectId, treat it as a category name and find the category
        try {
          console.log('Looking up category by name:', trimmedCategory);
          
          // Use a simple string match to avoid regex issues
          const categoryDoc = await CategoryModel.findOne({
            name: trimmedCategory,
            isActive: true,
          }).select('_id name').lean();
          
          console.log('Found category doc:', categoryDoc);
            if (categoryDoc && categoryDoc._id) {
            // Convert to ObjectId explicitly
            query.category = new mongoose.Types.ObjectId(categoryDoc._id.toString());
            console.log('Using category ObjectId from lookup:', categoryDoc._id);
          } else {
            // Try case-insensitive search as fallback
            console.log('Trying case-insensitive search for category:', trimmedCategory);
            const categoryDocCaseInsensitive = await CategoryModel.findOne({
              name: { $regex: new RegExp(`^${trimmedCategory}$`, 'i') },
              isActive: true,
            }).select('_id name').lean();
            
            console.log('Found category doc (case-insensitive):', categoryDocCaseInsensitive);
            
            if (categoryDocCaseInsensitive && categoryDocCaseInsensitive._id) {
              query.category = new mongoose.Types.ObjectId(categoryDocCaseInsensitive._id.toString());
              console.log('Using category ObjectId from case-insensitive lookup:', categoryDocCaseInsensitive._id);
            } else {
              // If category not found, return empty results
              console.log('Category not found, returning empty results');
              return {
                products: [],
                pagination: {
                  currentPage: page,
                  totalPages: 0,
                  totalItems: 0,
                  hasNextPage: false,
                  hasPrevPage: false,
                },
              };
            }
          }
        } catch (categoryError) {
          // If there's an error finding the category, return empty results
          console.log('Error finding category:', categoryError);
          return {
            products: [],
            pagination: {
              currentPage: page,
              totalPages: 0,
              totalItems: 0,
              hasNextPage: false,
              hasPrevPage: false,
            },
          };
        }
      }
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;    // Calculate pagination
    const skip = (page - 1) * limit;    console.log('Final query object:', JSON.stringify(query, null, 2));
    console.log('Sort object:', JSON.stringify(sort, null, 2));
    console.log('Skip:', skip, 'Limit:', limit);

    // Final validation: ensure ALL ObjectId fields in query are valid
    if (query.category) {
      console.log('Final category value:', query.category);
      console.log('Final category type:', typeof query.category);
      console.log('Is final category valid ObjectId?', mongoose.Types.ObjectId.isValid(query.category));
      
      if (!mongoose.Types.ObjectId.isValid(query.category)) {
        console.error('CRITICAL: Invalid ObjectId in final query for category:', query.category);
        throw new BadRequestException(`Invalid category filter provided: ${query.category}`);
      }
    }    // Additional check: scan the entire query for any string values that look like they should be ObjectIds
    const queryStr = JSON.stringify(query);
    if (queryStr.includes('"Toy"') || queryStr.includes("'Toy'")) {
      console.error('CRITICAL: Found "Toy" string in final query, this should not happen');
      console.error('Full query:', queryStr);
      throw new BadRequestException('Invalid query structure detected');
    }    // Deep check for any ObjectId-like fields that might have string values
    const checkObjectIdFields = (obj: any, path = ''): void => {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (key === 'category' && value && typeof value === 'string') {
          console.error(`CRITICAL: Found string value for category at ${currentPath}:`, value);
          throw new BadRequestException(`Invalid ObjectId string found at ${currentPath}: ${value}`);
        }
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof mongoose.Types.ObjectId)) {
          checkObjectIdFields(value, currentPath);
        }
      }
    };
    
    checkObjectIdFields(query);

    try {
      // Execute queries
      const [products, total] = await Promise.all([
        ProductModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .populate([{ path: 'category', select: 'name description' }])
          .lean(),
        ProductModel.countDocuments(query),
      ]);

      console.log('Query executed successfully. Found', products.length, 'products out of', total, 'total');
      
      return {
        products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      };
    } catch (queryError) {
      console.error('Error executing product query:', queryError);
      throw queryError;
    }
  },

  /**
   * Get product by ID
   */
  async getProductById(productId: string) {
    const product = await ProductModel.findById(productId).populate([
      { path: 'category', select: 'name description' },
    ]);

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
  async updateProduct(productId: string, data: UpdateProductPayload) {
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

        // Validate category if updating
        if (data.category) {
          const categoryExists = await CategoryModel.exists({
            _id: data.category,
            isActive: true,
          }).session(session);
          if (!categoryExists) {
            throw new BadRequestException('Invalid category selected');
          }
        }

        Object.assign(product, data);
        await product.save({ session });
        await product.populate([
          { path: 'category', select: 'name description' },
        ]);

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
  async deleteProduct(productId: string) {
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
  /**
 * Get filter options for products (categories, brands, price range)
 */
  async getFilterOptions() {
    try {
      // Get distinct categories
      const categories = await CategoryModel.find({ isActive: true })
        .select('_id name description')
        .lean();

      // Get distinct brands
      const brands = await ProductModel.distinct('brand');

      // Get price range
      const [priceRange] = await ProductModel.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' },
          },
        },
      ]);

      return {
        categories,
        brands,
        priceRange: priceRange || { minPrice: 0, maxPrice: 0 },
      };
    } catch (error) {
      throw error;
    }
  },
};

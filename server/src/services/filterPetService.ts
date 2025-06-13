import mongoose from 'mongoose';
import PetModel from '../models/petModel';
import { PetFilters } from '../types/pet';
import { NotFoundException } from '../utils/errors';

/**
 * Filter and sort pets based on various criteria
 */
export const filterPets = async (filters: PetFilters) => {
  try {
    const {
      category,
      breed,
      gender,
      size,
      color,
      minPrice,
      maxPrice,
      location,
      isAvailable,
      page = 1,
      limit = 15,
      sortBy = 'publishedDate',
      sortOrder = 'desc',
    } = filters;

    const query: Record<string, any> = {};

    if (breed) query.breed = breed;
    if (gender) query.gender = gender;
    if (size) query.size = size;
    if (color) query.color = color;
    if (category) query.category = category;
    if (location) query.location = location;

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    const skip = (page - 1) * limit;

    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const pets = await PetModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await PetModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      pets,
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
    console.error('Error in filterPets service:', error);
    throw error;
  }
};

/**
 * Get available filter options for sidebar
 */
export const getFilterOptions = async () => {
  try {
    const breeds = await PetModel.distinct('breed');
    const colors = await PetModel.distinct('color');
    const priceData = await PetModel.aggregate([
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
    } : { min: 0, max: 10000000 };
    
    const genders = ['Male', 'Female'];

    return {
      breeds,
      colors,
      priceRange,
      genders,
      sizes: ['Small', 'Medium', 'Large'],
      categories: ['Dog', 'Cat', 'Bird', 'Fish', 'Other'],
    };
  } catch (error) {
    console.error('Error in getFilterOptions service:', error);
    throw error;
  }
};
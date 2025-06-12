/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Types
 */
import { CreatePetPayload, UpdatePetPayload, PetFilters } from '../types/pet';

/**
 * Models
 */
import PetModel from '../models/petModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';
import { ERROR_CODE_ENUM } from '../constants';

export const petService = {
  /**
   * Create new pet
   */
  async createPet(data: CreatePetPayload, userId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        // Check if SKU already exists
        const existingSku = await PetModel.exists({ sku: data.sku }).session(
          session,
        );
        if (existingSku) {
          throw new BadRequestException('SKU already exists');
        }

        const newPet = new PetModel({
          ...data,
          createdBy: userId,
        });

        await newPet.save({ session });
        await newPet.populate('createdBy', 'name email');

        return newPet;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Get all pets with filters and pagination
   */
  async getPets(filters: PetFilters) {
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
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    // Build query
    const query: any = {};

    if (category) query.category = category;
    if (breed) query.breed = new RegExp(breed, 'i');
    if (gender) query.gender = gender;
    if (size) query.size = size;
    if (color) query.color = new RegExp(color, 'i');
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    if (location) query.location = new RegExp(location, 'i');
    if (isAvailable !== undefined) query.isAvailable = isAvailable;

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [pets, total] = await Promise.all([
      PetModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .lean(),
      PetModel.countDocuments(query),
    ]);

    return {
      pets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  },

  /**
   * Get pet by ID
   */
  async getPetById(petId: string) {
    const pet = await PetModel.findById(petId).populate(
      'createdBy',
      'name email',
    );

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    return pet;
  },

  /**
   * Get pet by SKU
   */
  async getPetBySku(sku: string) {
    const pet = await PetModel.findOne({ sku }).populate(
      'createdBy',
      'name email',
    );

    if (!pet) {
      throw new NotFoundException('Pet not found');
    }

    return pet;
  },

  /**
   * Update pet
   */
  async updatePet(petId: string, data: UpdatePetPayload, userId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const pet = await PetModel.findById(petId).session(session);

        if (!pet) {
          throw new NotFoundException('Pet not found');
        }

        // Check if user is the creator or admin
        if (pet.createdBy.toString() !== userId) {
          throw new BadRequestException('You can only update your own pets');
        }

        // Check SKU uniqueness if updating
        if (data.sku && data.sku !== pet.sku) {
          const existingSku = await PetModel.exists({
            sku: data.sku,
            _id: { $ne: petId },
          }).session(session);

          if (existingSku) {
            throw new BadRequestException('SKU already exists');
          }
        }

        Object.assign(pet, data);
        await pet.save({ session });
        await pet.populate('createdBy', 'name email');

        return pet;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Delete pet
   */
  async deletePet(petId: string, userId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const pet = await PetModel.findById(petId).session(session);

        if (!pet) {
          throw new NotFoundException('Pet not found');
        }

        // Check if user is the creator or admin
        if (pet.createdBy.toString() !== userId) {
          throw new BadRequestException('You can only delete your own pets');
        }

        await PetModel.findByIdAndDelete(petId).session(session);
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Update pet availability
   */
  async updateAvailability(
    petId: string,
    isAvailable: boolean,
    userId: string,
  ) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const pet = await PetModel.findById(petId).session(session);

        if (!pet) {
          throw new NotFoundException('Pet not found');
        }

        // Check if user is the creator or admin
        if (pet.createdBy.toString() !== userId) {
          throw new BadRequestException('You can only update your own pets');
        }

        pet.isAvailable = isAvailable;
        await pet.save({ session });

        return pet;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },
};

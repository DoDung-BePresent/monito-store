/**
 * Models
 */
import BreedModel from '../models/breedModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';

export const breedService = {
  async createBreed(data: { name: string; description?: string }) {
    try {
      const newBreed = new BreedModel(data);

      await newBreed.save();
      return newBreed;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Breed already exists in this category');
      }
      throw error;
    }
  },

  async getBreeds() {
    const breeds = await BreedModel.find().sort({ name: 1 });

    return breeds;
  },

  async getBreedById(breedId: string) {
    const breed = await BreedModel.findById(breedId);

    if (!breed) {
      throw new NotFoundException('Breed not found');
    }

    return breed;
  },

  async updateBreed(
    breedId: string,
    data: {
      name?: string;
      description?: string;
      isActive?: boolean;
    },
  ) {
    try {
      const breed = await BreedModel.findById(breedId);

      if (!breed) {
        throw new NotFoundException('Breed not found');
      }

      Object.assign(breed, data);
      await breed.save();

      return breed;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Breed already exists in this category');
      }
      throw error;
    }
  },

  async deleteBreed(breedId: string) {
    const breed = await BreedModel.findById(breedId);

    if (!breed) {
      throw new NotFoundException('Breed not found');
    }

    await BreedModel.findByIdAndDelete(breedId);
  },
};

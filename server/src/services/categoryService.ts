/**
 * Types
 */
import {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from '../types/category';

/**
 * Models
 */
import CategoryModel from '../models/categoryModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';

export const categoryService = {
  async createCategory(data: CreateCategoryPayload) {
    try {
      const newCategory = new CategoryModel(data);

      await newCategory.save();
      return newCategory;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Category name already exists');
      }
      throw error;
    }
  },

  async getCategories() {
    const categories = await CategoryModel.find().sort({ name: 1 });
    return categories;
  },

  async getCategoryById(categoryId: string) {
    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  },

  async updateCategory(categoryId: string, data: UpdateCategoryPayload) {
    try {
      const category = await CategoryModel.findById(categoryId);

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      Object.assign(category, data);
      await category.save();

      return category;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Category name already exists');
      }
      throw error;
    }
  },

  async deleteCategory(categoryId: string) {
    const category = await CategoryModel.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await CategoryModel.findByIdAndDelete(categoryId);
  },
};

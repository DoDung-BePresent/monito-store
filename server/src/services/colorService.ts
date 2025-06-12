/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Models
 */
import ColorModel from '../models/colorModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';

export const colorService = {
  async createColor(
    data: { name: string; hexCode?: string; description?: string },
    userId: string,
  ) {
    try {
      const newColor = new ColorModel({
        ...data,
        createdBy: userId,
      });

      await newColor.save();
      return newColor;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Color name already exists');
      }
      throw error;
    }
  },

  async getColors(filters: { isActive?: boolean } = {}) {
    const query: any = {};

    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    const colors = await ColorModel.find(query).sort({ name: 1 });

    return colors;
  },

  async getColorById(colorId: string) {
    const color = await ColorModel.findById(colorId);

    if (!color) {
      throw new NotFoundException('Color not found');
    }

    return color;
  },

  async updateColor(
    colorId: string,
    data: {
      name?: string;
      hexCode?: string;
      description?: string;
      isActive?: boolean;
    },
    userId: string,
  ) {
    try {
      const color = await ColorModel.findById(colorId);

      if (!color) {
        throw new NotFoundException('Color not found');
      }

      Object.assign(color, data);
      await color.save();

      return color;
    } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException('Color name already exists');
      }
      throw error;
    }
  },

  async deleteColor(colorId: string, userId: string) {
    const color = await ColorModel.findById(colorId);

    if (!color) {
      throw new NotFoundException('Color not found');
    }

    await ColorModel.findByIdAndDelete(colorId);
  },
};

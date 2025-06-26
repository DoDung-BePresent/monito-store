/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Models
 */
import UserModel from '../models/userModel';

/**
 * Utils
 */
import { NotFoundException, BadRequestException } from '../utils/errors';

export const userService = {
  /**
   * Get current user
   */
  async getCurrentUser(userId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const user = await UserModel.findById(userId).session(session);

        if (!user) {
          throw new NotFoundException('User not found');
        }
        
        return user;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },
  async getUsers() {
    return await UserModel.find().sort({ createdAt: -1 });
  },
  async getUserById(id: string) {
    const user = await UserModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  },
  async createUser(data: any) {
    const existing = await UserModel.findOne({ email: data.email });
    if (existing) throw new BadRequestException('Email already exists');
    const user = new UserModel(data);
    await user.save();
    return user;
  },
  async updateUser(id: string, data: any) {
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!user) throw new NotFoundException('User not found');
    return user;
  },
  async deleteUser(id: string) {
    const user = await UserModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    await UserModel.findByIdAndDelete(id);
  },
};

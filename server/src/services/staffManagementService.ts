/**
 * Node modules
 */
import mongoose from 'mongoose';

/**
 * Models
 */
import UserModel from '../models/userModel';

/**
 * Types
 */
import { CreateStaffPayload, UpdateStaffPayload, StaffListQuery, StaffListResponse } from '../types/user';

/**
 * Utils
 */
import { NotFoundException, ConflictException, BadRequestException } from '../utils/errors';

export const staffManagementService = {
  /**
   * Get all staff members with pagination and search
   */
  async getStaffs({ page = 1, limit = 10, search, isActive }: StaffListQuery): Promise<StaffListResponse> {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        // Build filter
        const filter: any = { role: 'staff' };
        
        if (search) {
          filter.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ];
        }
        
        if (isActive !== undefined) {
          filter.isActive = isActive;
        }

        // Calculate skip
        const skip = (page - 1) * limit;

        // Get total count
        const totalItems = await UserModel.countDocuments(filter).session(session);
        const totalPages = Math.ceil(totalItems / limit);

        // Get staffs
        const staffs = await UserModel
          .find(filter)
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .session(session)
          .lean();

        return {
          staffs: staffs as any,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit,
          },
        };
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Get single staff by ID
   */
  async getStaffById(staffId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const staff = await UserModel
          .findOne({ _id: staffId, role: 'staff' })
          .select('-password')
          .session(session)
          .lean();

        if (!staff) {
          throw new NotFoundException('Staff member not found');
        }

        return staff;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Create new staff member
   */
  async createStaff(payload: CreateStaffPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        // Check if email already exists
        const existingUser = await UserModel
          .findOne({ email: payload.email })
          .session(session);

        if (existingUser) {
          throw new ConflictException('Email already exists');
        }

        // Check if name already exists
        const existingName = await UserModel
          .findOne({ name: payload.name })
          .session(session);

        if (existingName) {
          throw new ConflictException('Username already exists');
        }

        // Create staff
        const staffData = {
          ...payload,
          role: 'staff',
          isActive: true,
        };

        const [newStaff] = await UserModel.create([staffData], { session });
        
        // Return staff without password
        return await UserModel
          .findById(newStaff._id)
          .select('-password')
          .session(session)
          .lean();
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Update staff member
   */
  async updateStaff(staffId: string, payload: UpdateStaffPayload) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        // Check if staff exists
        const existingStaff = await UserModel
          .findOne({ _id: staffId, role: 'staff' })
          .session(session);

        if (!existingStaff) {
          throw new NotFoundException('Staff member not found');
        }

        // Check for email conflicts if email is being updated
        if (payload.email && payload.email !== existingStaff.email) {
          const emailExists = await UserModel
            .findOne({ email: payload.email, _id: { $ne: staffId } })
            .session(session);

          if (emailExists) {
            throw new ConflictException('Email already exists');
          }
        }

        // Check for name conflicts if name is being updated
        if (payload.name && payload.name !== existingStaff.name) {
          const nameExists = await UserModel
            .findOne({ name: payload.name, _id: { $ne: staffId } })
            .session(session);

          if (nameExists) {
            throw new ConflictException('Username already exists');
          }
        }

        // Update staff
        const updatedStaff = await UserModel
          .findByIdAndUpdate(
            staffId,
            { ...payload, updatedAt: new Date() },
            { new: true, session }
          )
          .select('-password')
          .lean();

        return updatedStaff;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Delete staff member (soft delete by setting isActive to false)
   */
  async deleteStaff(staffId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const staff = await UserModel
          .findOne({ _id: staffId, role: 'staff' })
          .session(session);

        if (!staff) {
          throw new NotFoundException('Staff member not found');
        }

        // Soft delete by setting isActive to false
        const deletedStaff = await UserModel
          .findByIdAndUpdate(
            staffId,
            { isActive: false, updatedAt: new Date() },
            { new: true, session }
          )
          .select('-password')
          .lean();

        return deletedStaff;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Permanently delete staff member
   */
  async permanentDeleteStaff(staffId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const staff = await UserModel
          .findOne({ _id: staffId, role: 'staff' })
          .session(session);

        if (!staff) {
          throw new NotFoundException('Staff member not found');
        }

        await UserModel.findByIdAndDelete(staffId, { session });
        
        return { message: 'Staff member permanently deleted' };
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * Activate/Reactivate staff member
   */
  async activateStaff(staffId: string) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const staff = await UserModel
          .findOne({ _id: staffId, role: 'staff' })
          .session(session);

        if (!staff) {
          throw new NotFoundException('Staff member not found');
        }

        if (staff.isActive) {
          throw new BadRequestException('Staff member is already active');
        }

        const activatedStaff = await UserModel
          .findByIdAndUpdate(
            staffId,
            { isActive: true, updatedAt: new Date() },
            { new: true, session }
          )
          .select('-password')
          .lean();

        return activatedStaff;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },
};

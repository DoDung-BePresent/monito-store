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
import { NotFoundException } from '../utils/errors';
import { sendEmail } from '../utils/sendEmail';

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
  async getSummary() {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
    );

    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());

    const [
      totalUsers,
      totalUsersLastMonth,
      activeUsers,
      activeUsersLastMonth,
      suspendedUsers,
      suspendedUsersThisWeek,
      newUsersThisMonth,
      newUsersLastMonth,
    ] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      }),

      UserModel.countDocuments({ isActive: true }),
      UserModel.countDocuments({
        isActive: true,
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      }),

      UserModel.countDocuments({ isActive: false }),
      UserModel.countDocuments({
        isActive: false,
        createdAt: { $gte: startOfThisWeek },
      }),

      UserModel.countDocuments({ createdAt: { $gte: startOfThisMonth } }),
      UserModel.countDocuments({
        createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
      }),
    ]);

    const percent = (current: number, prev: number) => {
      if (prev === 0) return 100;
      return Math.round(((current - prev) / prev) * 100);
    };

    return {
      totalUsers: {
        count: totalUsers,
        percentChange: percent(totalUsers, totalUsersLastMonth),
      },
      activeUsers: {
        count: activeUsers,
        percentChange: percent(activeUsers, activeUsersLastMonth),
      },
      suspendedUsers: {
        count: suspendedUsers,
        weeklyChange: suspendedUsersThisWeek,
      },
      newUsersThisMonth: {
        count: newUsersThisMonth,
        percentChange: percent(newUsersThisMonth, newUsersLastMonth),
      },
    };
  },
  async getAllUsers() {
    try {
      const users = await UserModel.find({
        role: { $nin: ['staff', 'admin'] },
      }).sort({ createdAt: -1 });
      return users;
    } catch (error) {
      throw new Error('Failed to fetch all users');
    }
  },
  async updateUserStatus(userId: string, newStatus: boolean, reason: string, email: string) {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = newStatus;
    await user.save();

    const subject = 'Account Status Updated';
    const html = `
    <div style="font-family: sans-serif; color: #333;">
      <h2>Dear ${user.name || 'User'},</h2>
      <p>Your account has been <strong style="color:${newStatus ? 'green' : 'red'};">
      ${newStatus ? 'active' : 'inactive'}
      </strong>.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <hr/>
      <p style="font-size: 12px; color: #888;">If you have any questions, please contact support.</p>
    </div>
  `;

    await sendEmail({ to: email, subject, html });

    return user;
  },
  async updateProfile(
    userId: string,
    update: Partial<{
      name: string;
      email: string;
      phone: string;
      department: string;
      position: string;
    }>,
  ) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const user = await UserModel.findByIdAndUpdate(
          userId,
          { $set: update },
          { new: true, runValidators: true, session },
        );
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

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const session = await mongoose.startSession();
    try {
      return await session.withTransaction(async () => {
        const user = await UserModel.findById(userId).session(session);
        if (!user) {
          throw new NotFoundException('User not found');
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          throw new Error('Current password is incorrect');
        }
        if (await user.comparePassword(newPassword)) {
          throw new Error(
            'New password must be different from the current password.',
          );
        }
        user.password = newPassword;
        await user.save({ session });
        return user;
      });
    } catch (error) {
      throw error;
    } finally {
      session.endSession();
    }
  },
};

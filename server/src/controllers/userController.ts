/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Service
 */
import { userService } from '../services/userService';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';
import { BadRequestException } from '../utils/errors';

export const userController = {
  async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await userService.getCurrentUser(req.userId!);

      res.status(STATUS_CODE.OK).json({
        message: 'Get current user successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },
  async getUserSummary(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const summary = await userService.getSummary();

      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'User summary fetched successfully',
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  },
  async getAllUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const data = await userService.getAllUsers();

      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'All users fetched successfully',
        data,
        // meta có thể thêm sau nếu cần phân trang
      });
    } catch (error) {
      next(error);
    }
  },
  async updateUserStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        throw new BadRequestException('isActive must be a boolean');
      }

      const updatedUser = await userService.updateUserStatus(userId, isActive);

      res.status(STATUS_CODE.OK).json({
        success: true,
        message: 'User status updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },
  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.userId!;
      const user = await userService.getCurrentUser(userId);
      const { name, email, phone, department, position } = req.body;
      const update: any = { name, email, phone };
      if (user.role === 'staff') {
        update.department = department;
        update.position = position;
      }
      const updatedUser = await userService.updateProfile(userId, update);
      res.status(STATUS_CODE.OK).json({
        message: 'Profile updated successfully',
        data: { user: updatedUser },
      });
    } catch (error) {
      next(error);
    }
  },
  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.userId!;
      const { currentPassword, newPassword } = req.body;
      await userService.changePassword(userId, currentPassword, newPassword);
      res.status(STATUS_CODE.OK).json({
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

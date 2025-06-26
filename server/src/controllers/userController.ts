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
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUsers();
      res.status(STATUS_CODE.OK).json({
        message: 'Get users successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },
  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(STATUS_CODE.OK).json({
        message: 'Get user successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.createUser(req.body);
      res.status(STATUS_CODE.CREATED).json({
        message: 'User created successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(STATUS_CODE.OK).json({
        message: 'User updated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deleteUser(req.params.id);
      res.status(STATUS_CODE.OK).json({
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

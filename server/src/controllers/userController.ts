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
  
    async getUserSummary(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const summary = await userService.getSummary();

      res.status(STATUS_CODE.OK).json({
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  },
 async getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await userService.getAllUsers();

    res.status(STATUS_CODE.OK).json({
      data
    });
  } catch (error) {
    next(error);
  }
}
};

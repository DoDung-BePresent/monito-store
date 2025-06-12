/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';

/**
 * Services
 */
import { colorService } from '../services/colorService';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

export const colorController = {
  async createColor(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { name, hexCode, description } = req.body;
      const userId = req.userId!;

      if (!name) {
        return res.status(STATUS_CODE.BAD_REQUEST).json({
          message: 'Color name is required',
        });
      }

      const color = await colorService.createColor(
        { name, hexCode, description },
        userId,
      );

      res.status(STATUS_CODE.CREATED).json({
        message: 'Color created successfully',
        data: { color },
      });
    } catch (error) {
      next(error);
    }
  },

  async getColors(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { isActive } = req.query;

      const colors = await colorService.getColors({
        isActive: isActive === 'true',
      });

      res.status(STATUS_CODE.OK).json({
        message: 'Colors retrieved successfully',
        data: colors,
      });
    } catch (error) {
      next(error);
    }
  },

  async getColorById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      const color = await colorService.getColorById(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Color retrieved successfully',
        data: { color },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateColor(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { name, hexCode, description, isActive } = req.body;
      const userId = req.userId!;

      const color = await colorService.updateColor(
        id,
        { name, hexCode, description, isActive },
        userId,
      );

      res.status(STATUS_CODE.OK).json({
        message: 'Color updated successfully',
        data: { color },
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteColor(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      await colorService.deleteColor(id, userId);

      res.status(STATUS_CODE.OK).json({
        message: 'Color deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

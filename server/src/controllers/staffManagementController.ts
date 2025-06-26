/**
 * Node modules
 */
import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

/**
 * Service
 */
import { staffManagementService } from '../services/staffManagementService';

/**
 * Validations
 */
import {
  createStaffSchema,
  updateStaffSchema,
  staffListQuerySchema,
  staffIdSchema,
} from '../validations/staffValidation';

/**
 * Constants
 */
import { STATUS_CODE } from '../constants';

/**
 * Utils
 */
import { formatZodError } from '../utils/errors';

export const staffManagementController = {
  /**
   * Get all staff members
   */
  async getStaffs(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = staffListQuerySchema.parse(req.query);
      
      const result = await staffManagementService.getStaffs(validatedQuery);

      res.status(STATUS_CODE.OK).json({
        message: 'Get staff members successfully',
        data: result,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        formatZodError(res, error);
        return;
      }
      next(error);
    }
  },

  /**
   * Get single staff member by ID
   */
  async getStaffById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Validate params
      const { id } = staffIdSchema.parse(req.params);
      
      const staff = await staffManagementService.getStaffById(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Get staff member successfully',
        data: { staff },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        formatZodError(res, error);
        return;
      }
      next(error);
    }
  },

  /**
   * Create new staff member
   */
  async createStaff(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Validate request body
      const validatedData = createStaffSchema.parse(req.body);
      
      const staff = await staffManagementService.createStaff(validatedData);

      res.status(STATUS_CODE.CREATED).json({
        message: 'Staff member created successfully',
        data: { staff },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        formatZodError(res, error);
        return;
      }
      next(error);
    }
  },

  /**
   * Update staff member
   */
  async updateStaff(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Validate params and body
      const { id } = staffIdSchema.parse(req.params);
      const validatedData = updateStaffSchema.parse(req.body);
      
      const staff = await staffManagementService.updateStaff(id, validatedData);

      res.status(STATUS_CODE.OK).json({
        message: 'Staff member updated successfully',
        data: { staff },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        formatZodError(res, error);
        return;
      }
      next(error);
    }
  },

  /**
   * Delete staff member (soft delete)
   */
  async deleteStaff(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Validate params
      const { id } = staffIdSchema.parse(req.params);
      
      const staff = await staffManagementService.deleteStaff(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Staff member deactivated successfully',
        data: { staff },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        formatZodError(res, error);
        return;
      }
      next(error);
    }
  },

  /**
   * Permanently delete staff member
   */
  async permanentDeleteStaff(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Validate params
      const { id } = staffIdSchema.parse(req.params);
      
      const result = await staffManagementService.permanentDeleteStaff(id);

      res.status(STATUS_CODE.OK).json({
        message: result.message,
        data: null,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        formatZodError(res, error);
        return;
      }
      next(error);
    }
  },

  /**
   * Activate staff member
   */
  async activateStaff(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // Validate params
      const { id } = staffIdSchema.parse(req.params);
      
      const staff = await staffManagementService.activateStaff(id);

      res.status(STATUS_CODE.OK).json({
        message: 'Staff member activated successfully',
        data: { staff },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        formatZodError(res, error);
        return;
      }
      next(error);
    }
  },
};

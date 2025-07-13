import { Request, Response } from "express";
import { adminService } from "../services/adminService";

export const adminController = {
  async getAdminSummary(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const summary = await adminService.getSummary(days);
      res.status(200).json(summary);
    } catch (error) {
      console.error("Error fetching admin summary:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async getBusinessMetrics(req: Request, res: Response) {
    try {
      const days = parseInt(req.query.days as string) || 1;
      const metrics = await adminService.getBussinessMetric(days);
      res.status(200).json(metrics);
    } catch (error) {
      console.error("Error fetching business metrics:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
  async getUserStatistics(req: Request, res: Response) {
    try {
      const userStatistics = await adminService.getUserStats();
      res.status(200).json(userStatistics);
    } catch (error) {
      console.error("Error fetching userStatistics", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};
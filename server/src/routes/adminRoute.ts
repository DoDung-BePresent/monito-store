import express from "express";
import { adminController } from "../controllers/adminController";


const adminRoute = express.Router();

adminRoute.get("/summaryAll", adminController.getAdminSummary);
adminRoute.get("/business-metrics", adminController.getBusinessMetrics);
adminRoute.get("/user-statistics", adminController.getUserStatistics);
export default adminRoute;
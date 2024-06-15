import express from "express";
import {
  getBarCharts,
  getDashboardStats,
  getLineCharts,
  getPieCharts,
} from "../controllers/stats.js";
const router = express.Router();

// route - /api/v1/dashboard/stats
router.get("/stats", getDashboardStats);

// route - /api/v1/dashboard/pie
router.get("/pie", getPieCharts);

// route - /api/v1/dashboard/bar
router.get("/bar", getBarCharts);

// route - /api/v1/dashboard/line
router.get("/line", getLineCharts);

export default router;

import express from "express";
import {
  deleteOrder,
  getSingleOrder,
  myOrders,
  newOrder,
  processOrder,
} from "../controllers/order.js";
import { adminOnly } from "../middlewares/auth.js";
const router = express.Router();

// route - /api/v1/order/new
router.route("/new").post(newOrder);

// route - /api/v1/order/my
router.route("/my").get(myOrders);

// route - /api/v1/order/all
router.route("/all").get(adminOnly, myOrders);

// route - /api/v1/order/:id
router
  .route("/:id")
  .get(adminOnly, getSingleOrder)
  .patch(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default router;

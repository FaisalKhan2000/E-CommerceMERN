import express from "express";
import { newOrder } from "../controllers/order.js";
const router = express.Router();

router.route("/new").post(newOrder);

export default router;

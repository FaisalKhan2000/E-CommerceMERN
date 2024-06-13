import express from "express";
import {
  newUser,
  getAllUsers,
  getUser,
  deleteUser,
} from "../controllers/user.js";
import { adminOnly } from "../middlewares/auth.js";
const router = express.Router();

// route - /api/v1/user/new
router.route("/new").post(newUser);

// route - /api/v1/user/all
router.route("/all").get(adminOnly, getAllUsers);

// route - /api/v1/user/:id
router.route("/:id").get(adminOnly, getUser).delete(adminOnly, deleteUser);

export default router;

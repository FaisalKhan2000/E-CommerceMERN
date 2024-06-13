import express from "express";
import {
  getLatestProducts,
  newProduct,
  getAllCategories,
  getAdminProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/auth.js";
const router = express.Router();

// To Create New Product - api/v1/product/new
router.route("/new").post(adminOnly, singleUpload, newProduct);

// To get last 5 Product - api/v1/product/latest
router.route("/latest").get(getLatestProducts);

// To get all unique categories - api/v1/product/categories
router.route("/categories").get(getAllCategories);

// To get all products - api/v1/product/admin-products
router.route("/admin-products").get(adminOnly, getAdminProducts);

// To get, update, delete Product
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(adminOnly, singleUpload, updateProduct)
  .delete(adminOnly, deleteProduct);

export default router;

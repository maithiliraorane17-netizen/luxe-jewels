import express from "express";
import {
  getProducts, getProductBySlug, getProductById, createProduct, updateProduct, deleteProduct, uploadProductImages,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();
router.get("/", getProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.post("/upload-images", protect, admin, upload.array("images", 6), uploadProductImages);
export default router;

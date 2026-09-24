import express from "express";
import {
  getProductReviews, createReview, getAllReviews, moderateReview, deleteReview,
} from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/product/:productId", getProductReviews);
router.post("/", protect, createReview);
router.get("/", protect, admin, getAllReviews);
router.put("/:id", protect, admin, moderateReview);
router.delete("/:id", protect, admin, deleteReview);
export default router;

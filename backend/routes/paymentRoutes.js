import express from "express";
import { createCheckoutSession, verifySession } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/create-checkout-session", protect, createCheckoutSession);
router.post("/verify-session", protect, verifySession);
export default router;

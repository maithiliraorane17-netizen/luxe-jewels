import express from "express";
import { getPaymentConfig, createCheckoutSession, verifySession, demoPay } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/config", getPaymentConfig);
router.post("/demo-pay", protect, demoPay);
router.post("/create-checkout-session", protect, createCheckoutSession);
router.post("/verify-session", protect, verifySession);
export default router;
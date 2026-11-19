import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

// Stripe is OPTIONAL. Without a key the server still starts and the built-in demo gateway is used.
const key = process.env.STRIPE_SECRET_KEY || "";
export const stripeEnabled = /^sk_(test|live)_[A-Za-z0-9]{10,}$/.test(key) && !/x{6,}/i.test(key);

const stripe = stripeEnabled ? new Stripe(key) : null;
export default stripe;
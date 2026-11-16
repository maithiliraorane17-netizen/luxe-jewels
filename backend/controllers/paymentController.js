import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc Create a Stripe Checkout Session for an existing (online) order.
// NOTE: payment_method_types is intentionally omitted so Stripe shows every method you enabled in
// Dashboard → Settings → Payment methods (Cards, UPI, Netbanking …). Enable "UPI" there to accept it.
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });
    if (order.paymentMethod === "cod") return res.status(400).json({ message: "This is a Cash on Delivery order — no online payment needed" });
    if (order.isPaid) return res.status(400).json({ message: "This order is already paid" });
    if (order.status === "cancelled") return res.status(400).json({ message: "This order was cancelled" });

    const line_items = order.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name, images: item.image ? [item.image] : [] },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (order.shippingPrice) {
      line_items.push({
        price_data: { currency: "inr", product_data: { name: "Shipping" }, unit_amount: Math.round(order.shippingPrice * 100) },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: req.user.email,
      metadata: { orderId: order._id.toString() },
      success_url: `${process.env.CLIENT_URL}/order/${order._id}?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/order/${order._id}?payment=cancelled`,
    });

    order.paymentResult = { ...(order.paymentResult?.toObject?.() || {}), stripeSessionId: session.id };
    await order.save();

    res.json({ url: session.url, id: session.id });
  } catch (error) {
    next(error);
  }
};

const markPaid = async (order, session) => {
  if (order.isPaid) return;
  order.isPaid = true;
  order.paidAt = Date.now();
  order.status = "processing";
  order.paymentResult = {
    id: session.payment_intent,
    status: "paid",
    stripeSessionId: session.id,
    stripePaymentIntentId: session.payment_intent,
  };
  await order.save();
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }
};

// @desc Fallback: verify a session from the success page if the webhook is delayed
export const verifySession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") return res.status(400).json({ message: "Payment not completed" });

    const order = await Order.findById(session.metadata.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    await markPaid(order, session);
    res.json({ message: "Payment verified", order });
  } catch (error) {
    next(error);
  }
};

// @desc Stripe webhook — source of truth for payment confirmation (UPI can confirm asynchronously)
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // checkout.session.completed fires for instant methods; async_payment_succeeded for delayed ones (e.g. some UPI/netbanking flows)
  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      try {
        const order = await Order.findById(session.metadata.orderId);
        if (order) await markPaid(order, session);
      } catch (err) {
        console.error("Error processing webhook order update:", err.message);
      }
    }
  }
  res.json({ received: true });
};
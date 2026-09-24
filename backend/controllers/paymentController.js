import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Create a Stripe Checkout Session for an existing order
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate("items.product", "name images");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const line_items = order.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (order.shippingPrice) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Shipping" },
          unit_amount: Math.round(order.shippingPrice * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      customer_email: req.user.email,
      metadata: { orderId: order._id.toString() },
      success_url: `${process.env.CLIENT_URL}/order/${order._id}?payment=success`,
      cancel_url: `${process.env.CLIENT_URL}/order/${order._id}?payment=cancelled`,
    });

    order.paymentResult = { ...order.paymentResult, stripeSessionId: session.id };
    await order.save();

    res.json({ url: session.url, id: session.id });
  } catch (error) {
    next(error);
  }
};

// @desc Manually verify a session (fallback if webhook is delayed, called from success page)
export const verifySession = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const order = await Order.findById(session.metadata.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.isPaid) {
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
    }

    res.json({ message: "Payment verified", order });
  } catch (error) {
    next(error);
  }
};

// @desc Stripe webhook — source of truth for payment confirmation
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    try {
      const order = await Order.findById(session.metadata.orderId);
      if (order && !order.isPaid) {
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
      }
    } catch (err) {
      console.error("Error processing webhook order update:", err.message);
    }
  }

  res.json({ received: true });
};

import Order from "../models/Order.js";
import Product from "../models/Product.js";

const FREE_SHIPPING_AT = 20000;
const SHIPPING_FEE = 500;
const COD_LIMIT = 50000; // keep in sync with frontend src/utils/format.js

const restoreStock = async (items) => {
  for (const it of items) await Product.findByIdAndUpdate(it.product, { $inc: { stock: it.quantity } });
};

// @desc Create order. paymentMethod: "stripe" (UPI / cards, paid via Checkout) or "cod" (Cash on Delivery)
// Prices are re-calculated on the server from the database — never trusted from the browser.
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = "stripe" } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: "No order items" });
    if (!["stripe", "cod"].includes(paymentMethod)) return res.status(400).json({ message: "Invalid payment method" });

    // Build trusted order lines from DB
    const lines = [];
    for (const it of items) {
      const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
      const p = await Product.findById(it.product);
      if (!p || !p.isActive) return res.status(400).json({ message: "A product in your bag is no longer available" });
      if (p.stock < qty) return res.status(400).json({ message: `Only ${p.stock} of "${p.name}" left in stock` });
      lines.push({ product: p._id, name: p.name, image: p.images?.[0] || "", price: p.discountPrice || p.price, quantity: qty });
    }

    const itemsPrice = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const shippingPrice = itemsPrice >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
    const totalPrice = itemsPrice + shippingPrice;

    if (paymentMethod === "cod" && totalPrice > COD_LIMIT) {
      return res.status(400).json({ message: `Cash on Delivery is available only for orders up to ₹${COD_LIMIT.toLocaleString("en-IN")}` });
    }

    // COD orders are confirmed immediately, so reserve stock now (atomically, no overselling).
    // Online orders reserve stock when payment is confirmed (Stripe webhook / verify-session).
    const reserved = [];
    if (paymentMethod === "cod") {
      for (const l of lines) {
        const ok = await Product.findOneAndUpdate({ _id: l.product, stock: { $gte: l.quantity } }, { $inc: { stock: -l.quantity } });
        if (!ok) {
          await restoreStock(reserved);
          return res.status(400).json({ message: `"${l.name}" just went out of stock` });
        }
        reserved.push(l);
      }
    }

    try {
      const order = await Order.create({
        user: req.user._id,
        items: lines,
        shippingAddress,
        paymentMethod,
        paymentResult: paymentMethod === "cod" ? { status: "cod_pending" } : undefined,
        itemsPrice,
        shippingPrice,
        taxPrice: 0,
        totalPrice,
        status: "pending",
      });
      res.status(201).json(order);
    } catch (err) {
      await restoreStock(reserved); // roll back reservation if the order could not be saved
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// ===== Admin =====
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const prev = order.status;
    const next_ = req.body.status || prev;
    if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(next_)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (prev === "cancelled" && next_ !== "cancelled") {
      return res.status(400).json({ message: "Cancelled orders cannot be reopened" });
    }

    // Stock is held for COD orders (from creation) and for paid online orders.
    const stockHeld = order.paymentMethod === "cod" || order.isPaid;
    if (next_ === "cancelled" && prev !== "cancelled" && stockHeld) await restoreStock(order.items);

    order.status = next_;
    if (next_ === "delivered") {
      order.deliveredAt = Date.now();
      // Delivered COD order = cash collected by the courier
      if (order.paymentMethod === "cod" && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = { ...(order.paymentResult?.toObject?.() || {}), status: "cod_collected" };
      }
    }
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};
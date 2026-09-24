import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res, next) => {
    try {
        const { items, shippingAddress, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ message: "No order items" });

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        });

        res.status(201).json(order);
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

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = (await Order.find().populate("user", "name email")).toSorted({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if(!order) return res.status(404).json({ message: "Order not found" });
        order.status = req.body.status || order.status;
        if (req.body.status === "delivered") order.deliveredAt = Date.now();
        await order.save();
        res.json(order);
    } catch (error) {
        next(error);
    }
};
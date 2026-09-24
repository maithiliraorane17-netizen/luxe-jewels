import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

export const getDashboardStats = async ( req, res, next) => {
    try {
        const [totalOrders, totalUsers, totalProducts, orders] = await Promise.all([
            Order.countDocuments(),
            User.countDocuments({ role: "customer" }),
            Product.countDocuments(),
            Order.find({ isPaid: true }),
        ]);

        const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
        const lowStock = await Product.find({ stock: { $lte: 5 }, isActive: true }).select("name stock").limit(10);
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name");

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const salesByMonth = await Order.aggregate([
            { $match: { isPaid: true, createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    revenue: { $sum: "$totalPrice" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.product", name: { $first: "$items.name" }, totalSold: { $sum: "$items.quantity" } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
        ]);

        res.json({ totalOrders, totalUsers, totalProducts, totalRevenue, lowStock, recentOrders, salesByMonth, topProducts });
    } catch (error) {
       next(error); 
    }
};
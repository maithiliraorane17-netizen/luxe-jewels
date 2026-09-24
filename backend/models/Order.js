import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    image: String,
    price: Number,
    quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true },
        items: [orderItemSchema],
        shippingAddress: {
            line1: String,
            line2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
            phone: String,
        },
        paymentMethod: { type: String, default: "stripe" },
        paymentResult: {
            id: String,
            status: String,
            stripePaymentIntentId: String,
            stripeSessionId: String,
        },
        itemsPrice: Number,
        shippingPrice: { type: Number, default: 0 },
        taxPrice: { type: Number, default: 0 },
        totalPrice: { type: Number, required: true },
        isPaid: { type: Boolean, default: false },
        paidAt: Date,
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        deliveredAt: Date,
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
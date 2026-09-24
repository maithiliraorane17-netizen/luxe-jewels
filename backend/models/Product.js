import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        shortDescription: String,
        price: { type: Number, required: true },
        discountPrice: Number,
        images: [{ type: String }],
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
        collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
        designer: String,
        metalType: { type: String, enum: ["Gold", "Silver", "Platinum", "Rose Gold", "White Gold"] },
        gemstone: String,
        style: String,
        dimensions: String,
        weight: String,
        careInstructions: String,
        stock: { type: Number, default: 0 },
        sku: { type: String, unique: true, sparse: true },
        isFeatured: { type: Boolean, default: false },
        isNewArrival: { type: Boolean, default: false},
        isActive: { type: Boolean, default: true },
        ratingsAverage: { type: Number, default: 0 },
        ratingsCount: { type: Number, default: 0 },
        tags: [String],
    },
    { timestamps: true }
);

productSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.model("Product", productSchema);
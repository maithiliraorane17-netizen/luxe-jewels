import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: String,
        coverImage: String,
        designer: String,
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("Collection", collectionSchema);
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema({
    label: { type: String, default: "Home" },
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: "India" },
    phone: String,
    isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 6, select: false },
        phone: { type: String },
        role: { type: String, enum: ["customer", "admin"], default: "customer" },
        avatar: { type: String, default: "" },
        addresses: [addressSchema],
        stripeCustomerId: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
});

userSchema.methods.matchPassword = async function (entered) {
    return bcrypt.compare(entered, this.password);
};

export default mongoose.model("User", userSchema);
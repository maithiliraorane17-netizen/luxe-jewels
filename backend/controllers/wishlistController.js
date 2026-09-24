import WishlistItem from "../models/WishlistItem.js";

export const getWishlist = async (req, res, next) => {
  try {
    const items = await WishlistItem.find({ user: req.user._id }).populate("product");
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const exists = await WishlistItem.findOne({ user: req.user._id, product: productId });
    if (exists) return res.status(400).json({ message: "Already in wishlist" });

    const item = await WishlistItem.create({ user: req.user._id, product: productId });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    await WishlistItem.findOneAndDelete({ user: req.user._id, product: req.params.productId });
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    next(error);
  }
};

import Review from "../models/Review.js";
import Product from "../models/Product.js";

const recalcProductRating = async (productId) => {
  const stats = await Review.aggregate([
    { $match: { product: productId, isApproved: true } },
    { $group: { _id: "$product", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  const avg = stats[0]?.avg || 0;
  const count = stats[0]?.count || 0;
  await Product.findByIdAndUpdate(productId, { ratingsAverage: avg.toFixed(1), ratingsCount: count });
};

export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true }).populate("user", "name avatar");
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const review = await Review.create({ product: productId, user: req.user._id, rating, title, comment });
    await recalcProductRating(productId);
    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ message: "You already reviewed this product" });
    next(error);
  }
};

export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate("user", "name").populate("product", "name");
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

export const moderateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    review.isApproved = req.body.isApproved ?? review.isApproved;
    review.adminReply = req.body.adminReply ?? review.adminReply;
    await review.save();
    await recalcProductRating(review.product);
    res.json(review);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });
    const productId = review.product;
    await review.deleteOne();
    await recalcProductRating(productId);
    res.json({ message: "Review removed" });
  } catch (error) {
    next(error);
  }
};


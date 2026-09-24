import Blog from "../models/Blog.js";

export const getBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 }).populate("author", "name");
        res.json(blogs);
    } catch (error) {
        next(error);
    }
};

export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate("author", "name");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
    try {
        const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const blog = await Blog.create({ ...req.body, slug, author: req.usr._id });
        res.status(201).json(blog);
    } catch (error) {
        next(error);
    }
};

export const updateBlog = async (req, res, next) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (error) {
        next(error);
    }
};

export const deleteBlog = async (req, res, next) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: "Blog removed" });
    } catch (error) {
        next(error);
    }
};
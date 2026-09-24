import Collection from "../models/Collection.js";

export const getCollections = async (req, res, next) => {
    try {
        const collections = await Collection.find({ isActive: true });
        res.json(collections);
    } catch (error) {
        next(error);
    }
};

export const getCollectionBySlug = async (req, res, next) => {
    try {
        const collection = await Collection.findOne({ slug: req.params.slug }).populate("products");
        if (!collection) return res.status(404).json({ message: "Collection not found" });
        res.json(collection);
    } catch (error) {
        next(error);
    }
};

export const createCollection = async (req, res, next) => {
    try {
        const slug = req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const collection = await Collection.create({ ...req.body, slug });
        res.status(201).json(collection);
    } catch (error) {
        next(error)
    }
};

export const updateCollection = async (req, res, next) => {
    try {
        const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!collection) return res.status(404).json({ message: "Collection not found" });
        res.json(collection);
    } catch (error) {
        next(error);
    }
};

export const deleteCollection = async (req, res, next) => {
    try {
        await Collection.findByIdAndDelete(req.params.id);
        res.json({ message: "Collection removed" });
    } catch (error) {
        next(error);
    }
};
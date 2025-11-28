const Category = require('../models/category.model');
const Product = require('../models/product.model');

exports.createCategory = async (req, res) => {
    try {
        const { name, description, imageUrl } = req.body;
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        const category = new Category({ name, description, imageUrl });
        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Assuming we find by category name or ID. 
        // If Product model stores category name as string (based on previous code), we need the name.
        // If it stores ID, we use ID.
        // Let's fetch the category first to get the name.
        const category = await Category.findById(id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        // Check Product model structure. Assuming it uses 'category' field as string name based on frontend code.
        const products = await Product.find({ category: category.name });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

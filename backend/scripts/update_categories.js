const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Category = require('../src/models/category.model');
const Product = require('../src/models/product.model');

const categories = [
    "Woman Fashion",
    "Men Fashion",
    "Electronics",
    "Home & Lifestyle",
    "Medicine",
    "Sports & Outdoor",
    "Baby's & Toys",
    "Groceries & Pets",
    "Health & Beauty",
    "Men's clothing" // Explicitly requested
];

const updateCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Upsert categories
        for (const name of categories) {
            await Category.findOneAndUpdate(
                { name },
                { name },
                { upsert: true, new: true }
            );
            console.log(`Ensured category: ${name}`);
        }

        // 2. Update "Áo sơ mi" products
        const mensClothing = await Category.findOne({ name: "Men's clothing" });
        if (mensClothing) {
            const result = await Product.updateMany(
                { name: { $regex: /Áo sơ mi/i } },
                { category: mensClothing._id }
            );
            console.log(`Updated ${result.modifiedCount} products to "Men's clothing"`);
        } else {
            console.error("Men's clothing category not found (unexpected)");
        }

        console.log('Done');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

updateCategories();

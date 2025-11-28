require('dotenv').config({ path: 'backend/.env' });
const mongoose = require('mongoose');
const Product = require('../src/models/product.model');
const Category = require('../src/models/category.model');

const migrateCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const products = await Product.find({});
        console.log(`Found ${products.length} products to check.`);

        for (const product of products) {
            // Check if category is already an ObjectId
            if (mongoose.Types.ObjectId.isValid(product.category)) {
                continue;
            }

            const categoryName = product.category;
            if (!categoryName) {
                console.log(`Product ${product.name} has no category. Skipping.`);
                continue;
            }

            // Find or create category
            let category = await Category.findOne({ name: categoryName });
            if (!category) {
                console.log(`Category '${categoryName}' not found. Creating...`);
                category = await Category.create({
                    name: categoryName,
                    description: '', // Blank description as requested
                    imageUrl: '',
                });
            }

            // Update product
            product.category = category._id;
            await product.save();
            console.log(`Updated product ${product.name} to category ${category.name}`);
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateCategories();

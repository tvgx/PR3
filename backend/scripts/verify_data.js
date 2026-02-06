const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('../src/models/product.model');
const Category = require('../src/models/category.model');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const productCount = await Product.countDocuments();
        const categoryCount = await Category.countDocuments();

        console.log(`COUNT_PRODUCTS:${productCount}`);
        console.log(`COUNT_CATEGORIES:${categoryCount}`);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.connection.close();
    }
})();

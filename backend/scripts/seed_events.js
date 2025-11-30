const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from backend/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

const Event = require('../src/models/event.model');
const Product = require('../src/models/product.model');

const seedEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Get some products
        const products = await Product.find().limit(5);
        if (products.length === 0) {
            console.log('No products found to attach to events.');
            process.exit(0);
        }
        const productIds = products.map(p => p._id);

        // 2. Create Flash Sale Event
        const flashSale = {
            name: "Super Flash Sale",
            type: "flash-sale",
            startDate: new Date(),
            endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            products: productIds,
            isActive: true
        };

        await Event.findOneAndUpdate(
            { type: "flash-sale", isActive: true },
            flashSale,
            { upsert: true, new: true }
        );
        console.log('Seeded Flash Sale Event');

        // 3. Create Music Banner Event
        const musicEvent = {
            name: "Enhance Your Music Experience",
            type: "music-banner",
            startDate: new Date(),
            endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            products: [], // Can be empty for banner only
            isActive: true
        };

        await Event.findOneAndUpdate(
            { type: "music-banner", isActive: true },
            musicEvent,
            { upsert: true, new: true }
        );
        console.log('Seeded Music Banner Event');

        console.log('Done');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedEvents();

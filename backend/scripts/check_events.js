const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Event = require('../src/models/event.model');

const checkEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const events = await Event.find();
        console.log(`\nTotal events: ${events.length}\n`);

        events.forEach(event => {
            console.log('---');
            console.log(`Name: ${event.name}`);
            console.log(`Type: ${event.type}`);
            console.log(`Active: ${event.isActive}`);
            console.log(`Start: ${event.startDate}`);
            console.log(`End: ${event.endDate}`);
            console.log(`Products: ${event.products.length}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkEvents();

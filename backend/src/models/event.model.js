const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Event name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
    },
    type: {
        type: String,
        enum: ['flash-sale', 'music-banner', 'other'],
        default: 'other',
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// Index to easily find active events by type
eventSchema.index({ type: 1, isActive: 1, startDate: 1, endDate: 1 });

module.exports = mongoose.model('Event', eventSchema);

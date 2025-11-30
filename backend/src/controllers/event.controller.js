const Event = require('../models/event.model');

// Create a new event
exports.createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all events (for admin)
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get active event by type (for frontend)
exports.getActiveEventByType = async (req, res) => {
    try {
        const { type } = req.params;
        const now = new Date();

        const event = await Event.findOne({
            type,
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now },
        }).populate('products');

        if (!event) {
            return res.status(404).json({ message: 'No active event found' });
        }

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update event
exports.updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete event
exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');

// Public routes
router.get('/active/:type', eventController.getActiveEventByType);

// Admin routes (should be protected, but keeping open for now as per current auth setup or lack thereof in other routes)
// TODO: Add authentication middleware if needed
router.post('/', eventController.createEvent);
router.get('/', eventController.getEvents);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

module.exports = router;

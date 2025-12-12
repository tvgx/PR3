const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

// Create payment link
router.post('/create-payment-link', paymentController.createPaymentLink);

// Webhook endpoint for PayOS
router.post('/webhook', paymentController.handleWebhook);

// Get payment information
router.get('/:paymentLinkId', paymentController.getPaymentInfo);

module.exports = router;

const payOS = require('../config/payos.config');
const catchAsync = require('../utils/catchAsync');
const Order = require('../models/order.model');

// Create Payment Link
const createPaymentLink = catchAsync(async (req, res) => {
    const { orderId, amount, description, returnUrl, cancelUrl } = req.body;

    // Validate required fields
    if (!orderId || !amount) {
        return res.status(400).json({ message: 'Order ID and amount are required' });
    }

    // Create payment data for PayOS
    const paymentData = {
        orderCode: Number(orderId), // PayOS requires numeric order code
        amount: Number(amount),
        description: description || `Payment for order ${orderId}`,
        returnUrl: returnUrl || `${process.env.FRONTEND_URL}/payment/success`,
        cancelUrl: cancelUrl || `${process.env.FRONTEND_URL}/payment/failed`,
    };

    try {
        // Create payment link using PayOS
        const paymentLinkResponse = await payOS.createPaymentLink(paymentData);

        res.status(200).json({
            success: true,
            checkoutUrl: paymentLinkResponse.checkoutUrl,
            paymentLinkId: paymentLinkResponse.paymentLinkId,
        });
    } catch (error) {
        console.error('PayOS Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment link',
            error: error.message
        });
    }
});

// Webhook handler for PayOS payment status updates
const handleWebhook = catchAsync(async (req, res) => {
    const webhookData = req.body;

    console.log('PayOS Webhook received:', webhookData);

    // Verify webhook signature if needed
    // Update order status based on webhook data
    if (webhookData.code === '00') {
        // Payment successful
        const order = await Order.findOne({ _id: webhookData.orderCode });
        if (order) {
            order.paymentStatus = 'paid';
            order.status = 'processing';
            await order.save();
        }
    }

    res.status(200).json({ success: true });
});

// Get payment information
const getPaymentInfo = catchAsync(async (req, res) => {
    const { paymentLinkId } = req.params;

    try {
        const paymentInfo = await payOS.getPaymentLinkInformation(paymentLinkId);
        res.status(200).json({
            success: true,
            data: paymentInfo,
        });
    } catch (error) {
        console.error('PayOS Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get payment information',
            error: error.message
        });
    }
});

module.exports = {
    createPaymentLink,
    handleWebhook,
    getPaymentInfo,
};

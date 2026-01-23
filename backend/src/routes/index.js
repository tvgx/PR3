const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const productRoutes = require('./product.routes');
const categoryRoutes = require('./category.routes');
const orderRoutes = require('./order.routes');
const uploadRoutes = require('./upload.routes');
const wishlistRoutes = require('./wishlist.routes');
const eventRoutes = require('./event.routes');
const dashboardRoutes = require('./dashboard.routes');
const paymentRoutes = require('./payment.routes');

// Health check endpoint for deployment monitoring
router.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Public routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/events', eventRoutes);

// Protected routes (require authentication)
router.use('/users', userRoutes);
router.use('/orders', orderRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/dashboard', dashboardRoutes);

// Upload routes
router.use('/upload', uploadRoutes);

// Payment routes
router.use('/payment', paymentRoutes);

module.exports = router;
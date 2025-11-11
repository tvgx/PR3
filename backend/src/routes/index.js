const express = require('express');
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const orderRoutes = require('./order.routes');
const wishlistRoutes = require('./wishlist.routes');
const userRoutes = require('./user.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
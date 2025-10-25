const express = require('express');
const helmet = require('helmet');
// ... (các import khác)
const cartRoutes = require('./api/cart.route');
const orderRoutes = require('./api/order.route');
// ...

const app = express();
// ... (các middleware cơ bản)

// Gắn các route
// Request /cart/*
app.use('/cart', cartRoutes);
// Request /order/*
app.use('/order', orderRoutes);


// ... (Xử lý 404 và Error Handler)

module.exports = app;
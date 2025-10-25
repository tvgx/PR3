const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Middleware này là file auth.middleware.js sử dụng 'express-jwt'
const authenticateToken = require('./auth.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);


// --- Định tuyến đến các Microservices ---

const services = [
    {
        // Thêm route /auth để proxy đến auth-service
        route: '/auth',
        target: process.env.AUTH_SERVICE_URL,
        auth: false,
    },
    {
        route: '/products',
        target: process.env.PRODUCT_SERVICE_URL,
        auth: false,
    },
    {
        route: '/orders',
        target: process.env.ORDER_SERVICE_URL,
        auth: true, // Route này cần xác thực
    },
];

services.forEach(({ route, target, auth }) => {
    const proxyOptions = {
        target,
        changeOrigin: true,
        pathRewrite: {
            // Logic pathRewrite:
            // Nếu là '/auth', rewrite thành '/api/v1/auth'
            // Nếu là '/products', rewrite thành ''
            [`^${route}`]: route === '/auth' ? `/api/v1${route}` : '',
        },
        onProxyReq: (proxyReq, req, res) => {
            // Đọc thông tin user từ 'req.auth' (do express-jwt thêm vào)
            if (req.auth) {
                const userInfo = {
                    id: req.auth.sub,   // Lấy ID từ 'sub'
                    role: req.auth.role, // Lấy role (đã thêm vào token)
                };
                proxyReq.setHeader('X-User-Info', JSON.stringify(userInfo));
            }
        },
    };

    if (auth) {
        // Chạy middleware xác thực TRƯỚC khi proxy
        app.use(route, authenticateToken, createProxyMiddleware(proxyOptions));
    } else {
        app.use(route, createProxyMiddleware(proxyOptions));
    }
});

// Middleware xử lý lỗi tập trung cho express-jwt
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Invalid or expired token' });
  } else {
    next(err);
  }
});


// --- Khởi chạy Gateway ---
app.listen(PORT, () => {
    console.log(`🚀 API Gateway is running on port ${PORT}`);
});
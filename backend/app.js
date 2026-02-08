const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const allRoutes = require('./src/routes');
const { configurePassport } = require('./src/config/passport');
const ApiError = require('./src/utils/ApiError');
const httpStatus = require('http-status-codes');
const path = require('path');
const app = express();

// Middlewares cơ bản
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration with production support
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://pr-3-pi.vercel.app',  // Fixed: Frontend URL, not backend
    process.env.FRONTEND_URL || 'http://localhost:3000'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')));
// Cấu hình Passport
app.use(passport.initialize());
configurePassport(passport); // Gọi hàm cấu hình passport

// Định tuyến API
// Root route - API information
app.get('/', (req, res) => {
  res.json({
    message: 'PR3 E-Commerce API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      categories: '/api/categories',
      orders: '/api/orders',
      users: '/api/users',
      payment: '/api/payment'
    },
    documentation: 'https://github.com/tvgx/PR3'
  });
});

// Gắn tất cả các route trong thư mục /routes vào tiền tố /api
app.use('/api', allRoutes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not Found')); // Dùng ApiError
});

// Middleware xử lý lỗi chung (bắt lỗi từ catchAsync)
app.use((err, req, res, next) => {
  let { statusCode, message } = err;

  // Nếu là lỗi không phải do chúng ta định nghĩa, set 500
  if (!(err instanceof ApiError)) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = process.env.NODE_ENV === 'production'
      ? 'Internal Server Error'
      : err.message || 'Internal Server Error';
  }

  // Log lỗi ra console với thông tin chi tiết trong production
  if (process.env.NODE_ENV === 'production') {
    console.error({
      timestamp: new Date().toISOString(),
      statusCode,
      message: err.message,
      path: req.path,
      method: req.method,
      stack: err.stack
    });
  } else {
    console.error(err); // Log đầy đủ trong development
  }

  res.status(statusCode).json({
    code: statusCode,
    message,
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack
    })
  });
});
module.exports = app;
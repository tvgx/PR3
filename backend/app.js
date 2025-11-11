const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const allRoutes = require('./src/routes');
const { configurePassport } = require('./src/config/passport');
const ApiError = require('./src/utils/ApiError'); // <-- SỬA LỖI 3: Thêm './src/'
const httpStatus = require('http-status-codes');

const app = express();

// Middlewares cơ bản
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// app.options('/*',cors());
app.use(morgan('dev'));

// Cấu hình Passport
app.use(passport.initialize());
configurePassport(passport); // Gọi hàm cấu hình passport

// Định tuyến API
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
    message = 'Internal Server Error';
  }

  console.error(err); // Log lỗi ra console
  
  res.status(statusCode).send({ 
    code: statusCode, 
    message 
  });
});
module.exports = app;
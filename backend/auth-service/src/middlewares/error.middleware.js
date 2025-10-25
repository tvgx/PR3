const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const ApiError = require('../utils/ApiError');

// Middleware xử lý lỗi tập trung
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  
  // Xử lý các lỗi đặc biệt từ better-auth (nếu có)
  // Ví dụ: Lỗi validation của better-auth thường là 400
  if (err.message.includes('Validation error')) {
     statusCode = httpStatus.BAD_REQUEST;
  }
  
  if (!(err instanceof ApiError) && statusCode !== httpStatus.BAD_REQUEST) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  res.status(statusCode).send({
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Middleware chuyển đổi các lỗi sang ApiError
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};


module.exports = {
  errorHandler,
  errorConverter,
};
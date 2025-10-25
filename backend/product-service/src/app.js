const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const productRoutes = require('./api/product.route');
const { errorConverter, errorHandler } = require('./middlewares/error.middleware');
const ApiError = require('./utils/ApiError');
const httpStatus = require('http-status-codes');

const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Gắn các route sản phẩm vào root
// Request từ Gateway (ví dụ /products/123) sẽ được chuyển đến đây thành (/123)
app.use('/', productRoutes);

// Xử lý 404
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Xử lý lỗi
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
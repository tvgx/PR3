const httpStatus = require('http-status-codes');
const ApiError = require('../utils/ApiError');

/**
 * Middleware để kiểm tra xem request có thông tin user không
 * và gán vào req.user
 */
const requireAuth = (req, res, next) => {
  const userInfoHeader = req.headers['x-user-info'];
  
  if (!userInfoHeader) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
  }

  try {
    // Thông tin user (gồm id, role) được gán vào req.user
    req.user = JSON.parse(userInfoHeader);
    return next();
  } catch (error) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Invalid user info header'));
  }
};

/**
 * Middleware để kiểm tra xem user có phải là admin không
 * (Dùng cho các route quản lý *tất cả* đơn hàng)
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden: Admin access required'));
};

module.exports = {
  requireAuth,
  isAdmin,
};
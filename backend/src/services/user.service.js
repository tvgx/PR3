const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status-codes');

/**
 * Lấy thông tin user bằng ID (không lấy password)
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Cập nhật thông tin (profile)
 */
const updateUserProfile = async (userId, updateBody) => {
  const user = await getUserById(userId);
  
  // Chỉ cho phép cập nhật các trường an toàn
  // (Không cho phép cập nhật 'role' hoặc 'password' qua route này)
  if (updateBody.name) user.name = updateBody.name;
  // (Bạn có thể thêm 'address', 'phone' vào model và cập nhật ở đây)

  await user.save();
  return user;
};

/**
 * Đổi mật khẩu
 */
const changePassword = async (userId, body) => {
  const { currentPassword, newPassword } = body;
  
  // Lấy user VÀ password
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // 1. Kiểm tra mật khẩu cũ
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect current password');
  }

  // 2. Cập nhật mật khẩu mới
  user.password = newPassword; // Hook 'pre-save' trong model sẽ tự động hash
  await user.save();
};

module.exports = {
  getUserById,
  updateUserProfile,
  changePassword,
};
const userService = require('../services/user.service');
const catchAsync = require('../utils/catchAsync');

// Lấy thông tin user đang đăng nhập
const getMe = catchAsync(async (req, res) => {
  // req.user được gán từ middleware 'requireAuth'
  // Chúng ta gọi lại service để đảm bảo lấy data mới nhất
  const user = await userService.getUserById(req.user.id);
  res.status(200).json(user);
});

// Cập nhật thông tin user đang đăng nhập
const updateMe = catchAsync(async (req, res) => {
  const user = await userService.updateUserProfile(req.user.id, req.body);
  res.status(200).json(user);
});

// Đổi mật khẩu
const changePassword = catchAsync(async (req, res) => {
  await userService.changePassword(req.user.id, req.body);
  res.status(200).json({ message: 'Password changed successfully' });
});

module.exports = {
  getMe,
  updateMe,
  changePassword,
};
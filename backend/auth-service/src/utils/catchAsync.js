// Wrapper để bắt lỗi trong các hàm async
// Mặc dù không dùng trực tiếp, nhưng nên giữ lại cho
// các middleware tùy chỉnh sau này (nếu có)
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;
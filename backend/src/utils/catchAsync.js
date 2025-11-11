// Tiện ích này bắt lỗi trong các hàm async
// và chuyển nó cho middleware xử lý lỗi
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

module.exports = catchAsync;
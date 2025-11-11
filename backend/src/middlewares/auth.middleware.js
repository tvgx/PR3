const passport = require('passport');

// Middleware này dùng 'passport-jwt' để kiểm tra token
// Nó sẽ trả về lỗi 401 nếu token không hợp lệ
const requireAuth = passport.authenticate('jwt', { session: false });

// Middleware này kiểm tra xem user có phải là Admin không
// Phải dùng *sau* requireAuth
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // Cho phép đi tiếp
  }
  return res.status(403).json({ message: 'Forbidden: Admin access required' });
};

module.exports = {
  requireAuth,
  requireAdmin,
};      
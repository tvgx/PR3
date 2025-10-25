const { expressjwt: jwt } = require('express-jwt');
require('dotenv').config();

// Lấy secret được chia sẻ
const SHARED_SECRET = process.env.BETTER_AUTH_SECRET;

if (!SHARED_SECRET) {
  throw new Error('BETTER_AUTH_SECRET is not defined in API Gateway .env');
}

/**
 * Middleware xác thực token
 * Nó dùng thuật toán HS256 (mặc định) và secret đã chia sẻ
 */
const authenticateToken = jwt({
  secret: SHARED_SECRET,
  algorithms: ['HS256'], // Đây là thuật toán mặc định mà better-auth dùng
});

module.exports = authenticateToken;
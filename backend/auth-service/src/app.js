const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const { errorConverter, errorHandler } = require('./middlewares/error.middleware');
const ApiError = require('./utils/ApiError');
const httpStatus = require('http-status-codes');

// Import thư viện better-auth
const { betterAuth } = require('@better-auth/express');
const { MongoDBAdapter } = require('@better-auth/mongodb');

const app = express();

// Middlewares cơ bản
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options('*', cors());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- TÍCH HỢP BETTER AUTH ---
// Chúng ta gắn betterAuth vào tiền tố /api/v1/auth
// Nó sẽ tự động tạo các route:
// POST /api/v1/auth/register
// POST /api/v1/auth/login
// GET  /api/v1/auth/user (yêu cầu token)
// ... và nhiều route khác (update, delete, logout)
app.use('/api/v1/auth', betterAuth({
    // Cung cấp secret key
    secret: config.betterAuth.secret,
    
    // Cung cấp adapter database
    database: MongoDBAdapter(config.mongoose.url),

    // --- Tùy chỉnh (Hooks) ---
    // Đây là phần mạnh nhất của better-auth
    
    register: {
        // Tùy chỉnh dữ liệu user trước khi lưu vào DB
        before: (user) => ({
            ...user,
            role: 'user', // Tự động gán role 'user' cho người dùng mới
        }),
    },

    login: {
        // Tùy chỉnh nội dung của JWT payload
        // 'user' là object user từ DB, 'token' là payload mặc định
        token: (user, token) => ({
            ...token, // Giữ lại iat, exp
            sub: user._id, // Đảm bảo 'sub' (subject) là ID của user
            role: user.role, // Thêm 'role' vào token
            // Thêm bất cứ thông tin gì bạn muốn vào token
        }),
    },
}));

// --- XỬ LÝ LỖI ---
// Gửi 404 nếu không tìm thấy route nào khớp (kể cả các route của better-auth)
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// Chuyển đổi lỗi
app.use(errorConverter);

// Xử lý lỗi tập trung
app.use(errorHandler);

module.exports = app;
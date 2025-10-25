const mongoose = require('mongoose');
const app = require('./src/app');
const config = require('./src/config/config');
const connectDB = require('./src/config/db');

// Kết nối tới MongoDB
connectDB();

const server = app.listen(config.port, () => {
  console.log(`🚀 Auth Service (better-auth) is running on port ${config.port}`);
});

// Xử lý các lỗi không mong muốn
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
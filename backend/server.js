const dotenv = require('dotenv');
dotenv.config(); // Phải gọi trước khi import app

const app = require('./app');
const connectDB = require('./src/config/db');

// Kết nối DB
connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Monolith Server is running on port ${PORT}`);
});
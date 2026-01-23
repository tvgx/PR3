const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const app = require('./app');
const connectDB = require('./src/config/db');
connectDB();
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Monolith Server is running on port ${PORT}`);
});
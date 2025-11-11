const express = require('express');
const orderController = require('../controllers/order.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Áp dụng middleware 'requireAuth' cho *tất cả* các route bên dưới
router.use(requireAuth);

// --- Cart Routes ---
router.route('/cart')
  .get(orderController.getCart)
  .post(orderController.addItemToCart); // Thêm item vào giỏ

// (Bạn có thể thêm route DELETE /cart/:itemId, PUT /cart/:itemId sau)

// --- Order Routes ---
router.route('/')
  .get(orderController.getMyOrders) // Lấy lịch sử đơn hàng
  .post(orderController.checkout); // Tạo đơn hàng mới (từ giỏ)

module.exports = router;
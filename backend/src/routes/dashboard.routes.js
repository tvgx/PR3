const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// Bảo vệ TẤT CẢ các route trong file này
// Yêu cầu: Phải đăng nhập VÀ Phải là Admin
router.use(requireAuth, requireAdmin);

router.get('/stats', dashboardController.getStats);
router.get('/revenue', dashboardController.getRevenueOverTime);
router.get('/recent-orders', dashboardController.getRecentOrders);

module.exports = router;
const express = require('express');
const productController = require('../controllers/product.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

// --- Public Routes ---
router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProduct);

// --- Admin Routes ---
// Áp dụng middleware: Phải đăng nhập (requireAuth) VÀ là admin (requireAdmin)
router.post(
  '/',
  requireAuth,
  requireAdmin,
  // (Thêm validation ở đây nếu cần)
  productController.createProduct
);

router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  productController.updateProduct
);

router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  productController.deleteProduct
);

module.exports = router;
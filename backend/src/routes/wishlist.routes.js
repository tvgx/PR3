const express = require('express');
const wishlistController = require('../controllers/wishlist.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Áp dụng middleware 'requireAuth' cho tất cả các route
router.use(requireAuth);

router.route('/')
  .get(wishlistController.getWishlist)    // GET /api/wishlist
  .post(wishlistController.addProduct);   // POST /api/wishlist (body: { productId })

router.route('/:productId')
  .delete(wishlistController.removeProduct); // DELETE /api/wishlist/product_id_123

module.exports = router;
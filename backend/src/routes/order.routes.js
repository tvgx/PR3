const express = require('express');
const orderController = require('../controllers/order.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();
router.use(requireAuth);
router.route('/cart')
  .get(orderController.getCart)
  .post(orderController.addItemToCart);
router.route('/')
  .get(orderController.getMyOrders)
  .post(orderController.checkout);
router.route('/cart/:productId')
  .put(orderController.updateItemQuantity)
  .delete(orderController.removeItemFromCart);

router.route('/all')
  .get(requireAdmin, orderController.getAllOrders);

module.exports = router;

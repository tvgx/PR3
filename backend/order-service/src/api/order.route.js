const express = require('express');
const validate = require('../middlewares/validate.middleware');
const { orderValidation } = require('../validations'); // Cần tạo file này
const { orderController } = require('../controllers');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();
router.use(requireAuth);

router
  .route('/')
  .post(orderController.createOrder) // Cần validation cho body (shippingAddress)
  .get(orderController.getMyOrders);
  
module.exports = router;
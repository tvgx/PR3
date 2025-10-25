const express = require('express');
const validate = require('../middlewares/validate.middleware');
const { cartValidation } = require('../validations');
const { cartController } = require('../controllers');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Tất cả API giỏ hàng đều yêu cầu đăng nhập
router.use(requireAuth);

router
  .route('/')
  .get(cartController.getCart)
  .post(validate(cartValidation.addItemToCart), cartController.addItemToCart);

// ... (Các route cho /:itemId để xóa, sửa)

module.exports = router;
const express = require('express');
const userController = require('../controllers/user.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

const router = express.Router();

// Tất cả các route này đều yêu cầu đăng nhập
router.use(requireAuth);

router.route('/me')
  .get(userController.getMe)      // GET /api/users/me
  .put(userController.updateMe); // PUT /api/users/me (body: { name, ... })

router.put('/change-password', userController.changePassword); // PUT /api/users/change-password

module.exports = router;
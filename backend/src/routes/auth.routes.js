const express = require('express');
const passport = require('passport');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', authController.register);

// Dùng 'passport-local' để check email/pass
// Nếu thành công, 'authController.login' sẽ được gọi
router.post('/login', passport.authenticate('local', { session: false }), authController.login);

module.exports = router;
const jwt = require('jsonwebtoken');

const generateAuthToken = (user) => {
  const payload = {
    sub: user.id, // Subject (ID của user)
    role: user.role,
    name: user.name,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token hết hạn sau 1 ngày
  });
};

module.exports = { generateAuthToken };
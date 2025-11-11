const User = require('../models/user.model');
const { generateAuthToken } = require('../services/token.service');

// Controller cho Đăng Ký
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const user = await User.create({ name, email, password });
    // Không trả về password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({ user: userResponse });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller cho Đăng Nhập
// (Chỉ được gọi *sau khi* passport.authenticate 'local' thành công)
const login = (req, res) => {
  // req.user được gán bởi Passport
  const user = req.user; 
  const token = generateAuthToken(user);

  const userResponse = user.toObject();
  delete userResponse.password;
  
  res.status(200).json({ user: userResponse, token });
};

module.exports = {
  register,
  login,
};
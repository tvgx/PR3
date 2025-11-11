const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user.model');

// 1. Chiến lược Local (Email/Password) cho Đăng Nhập
const localStrategy = new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await user.comparePassword(password))) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

// 2. Chiến lược JWT cho Bảo Vệ Route
const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload, done) => {
    try {
      // payload.sub chính là ID của user
      const user = await User.findById(payload.sub);
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  }
);

const configurePassport = (passport) => {
  passport.use(localStrategy);
  passport.use(jwtStrategy);
};

module.exports = { configurePassport };
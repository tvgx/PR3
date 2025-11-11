const mongoose = require('mongoose');
const { Schema } = mongoose;

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Mỗi user chỉ có 1 wishlist
    index: true,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product', // Tham chiếu đến model Product
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
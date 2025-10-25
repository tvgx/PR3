const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  price: {
    type: Number,
    required: true, // Lưu lại giá lúc thêm vào giỏ
  },
  name: {
    type: String,
    required: true, // Lưu lại tên lúc thêm vào giỏ
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Chúng ta lưu ID từ JWT (string)
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Phương thức tính toán lại tổng tiền
cartSchema.methods.calculateTotal = function () {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
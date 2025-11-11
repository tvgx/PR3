const mongoose = require('mongoose');
const { Schema } = mongoose;

// Đây là Schema cho *một* sản phẩm bên trong đơn hàng
const OrderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { // Sao chép từ Product
    type: String,
    required: true,
  },
  price: { // Sao chép từ Product
    type: Number,
    required: true,
  },
  imageUrl: { // Sao chép từ Product
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Đánh index để tìm đơn hàng của user nhanh
    },
    items: [OrderItemSchema], // Mảng các sản phẩm
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ['cart', 'pending', 'paid', 'shipped', 'delivered', 'cancelled'],
      default: 'cart', // Mặc định là 'giỏ hàng'
      index: true,
    },
    shippingAddress: {
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
    paymentResult: {
      id: String,
      status: String,
    },
  },
  {
    timestamps: true,
  }
);

// Tự động tính tổng tiền trước khi lưu
orderSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);
  next();
});

module.exports = mongoose.model('Order', orderSchema);
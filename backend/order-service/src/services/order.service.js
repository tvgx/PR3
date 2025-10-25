const httpStatus = require('http-status-codes');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const { getCartByUserId, clearCart } = require('./cart.service');
const productClient = require('./product.client'); // Cần gọi để check kho lần cuối
const ApiError = require('../utils/ApiError');

/**
 * Tạo đơn hàng từ giỏ hàng của user
 * @param {string} userId
 * @param {Object} shippingAddress
 * @returns {Promise<Order>}
 */
const createOrder = async (userId, shippingAddress) => {
  const cart = await getCartByUserId(userId);

  if (cart.items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
  }

  // BƯỚC 1: KIỂM TRA TỒN KHO LẦN CUỐI (Rất quan trọng)
  // Tránh trường hợp user thêm vào giỏ, sau đó sản phẩm hết hàng
  for (const item of cart.items) {
    const product = await productClient.getProductById(item.productId.toString());
    if (product.stock < item.quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Product "${product.name}" is out of stock`);
    }
  }
  
  // BƯỚC 2: TẠO ĐƠN HÀNG
  const newOrder = await Order.create({
    userId: userId,
    items: cart.items, // Sao chép các item từ giỏ hàng
    totalPrice: cart.totalPrice,
    shippingAddress: shippingAddress,
    status: 'pending', // Trạng thái chờ thanh toán
  });

  // BƯỚC 3: (Nâng cao) GỌI PRODUCT-SERVICE ĐỂ TRỪ KHO
  // Tạm thời bỏ qua bước này để đơn giản hóa,
  // nhưng trong thực tế, bạn cần gọi API (ví dụ: POST /products/update-stock)
  // để trừ kho hàng.
  // Ví dụ: await productClient.updateStock(cart.items);

  // BƯỚC 4: XÓA GIỎ HÀNG
  await clearCart(userId);

  return newOrder;
};

/**
 * Lấy danh sách đơn hàng của một user
 * @param {string} userId
 * @returns {Promise<Order[]>}
 */
const getMyOrders = async (userId) => {
  return Order.find({ userId: userId }).sort({ createdAt: -1 });
};

// ... (Các hàm khác như getOrderById, updateOrderStatusToPaid)

module.exports = {
  createOrder,
  getMyOrders,
};
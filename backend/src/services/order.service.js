const Order = require('../models/order.model');
const Product = require('../models/product.model'); // Cần để kiểm tra kho
const ApiError = require('../utils/ApiError'); // Sẽ tạo sau
const httpStatus = require('http-status-codes');

/**
 * Lấy giỏ hàng (order có status 'cart') của user
 * Nếu chưa có, tạo một giỏ hàng mới
 */
const getCart = async (userId) => {
  let cart = await Order.findOne({ userId, status: 'cart' });
  if (!cart) {
    cart = await Order.create({ userId, items: [], status: 'cart' });
  }
  return cart;
};

/**
 * Thêm sản phẩm vào giỏ hàng
 */
const addItemToCart = async (userId, productId, quantity) => {
  // 1. Kiểm tra tồn kho
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  if (product.stock < quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough stock');
  }

  // 2. Lấy giỏ hàng
  const cart = await getCart(userId);

  // 3. Kiểm tra xem sản phẩm đã có trong giỏ chưa
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Cập nhật số lượng
    cart.items[existingItemIndex].quantity += quantity;
    // Kiểm tra lại tồn kho sau khi cộng
    if (product.stock < cart.items[existingItemIndex].quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough stock for updated quantity');
    }
  } else {
    // Thêm sản phẩm mới (ghi dư dữ liệu)
    cart.items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: quantity,
    });
  }

  // 4. Lưu giỏ hàng (totalPrice sẽ tự động cập nhật nhờ 'pre-save' hook)
  await cart.save();
  return cart;
};

/**
 * Chuyển đổi giỏ hàng thành đơn hàng (Checkout)
 */
const checkoutCart = async (userId, shippingAddress) => {
  const cart = await getCart(userId);
  if (cart.items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
  }

  // 1. (Quan trọng) Kiểm tra lại tồn kho cho *tất cả* sản phẩm
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, `Product ${item.name} not found`);
    }
    if (product.stock < item.quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Not enough stock for ${item.name}`);
    }
  }

  // 2. (Quan trọng) Trừ kho hàng
  // Chúng ta dùng $inc (atomic operation) để đảm bảo an toàn
  const bulkOps = cart.items.map(item => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { stock: -item.quantity } }
    }
  }));
  await Product.bulkWrite(bulkOps);

  // 3. Cập nhật đơn hàng (giỏ hàng)
  cart.status = 'pending'; // Chuyển trạng thái từ 'cart' -> 'pending' (chờ thanh toán)
  cart.shippingAddress = shippingAddress;
  await cart.save();

  return cart; // Trả về đơn hàng đã checkout
};

/**
 * Lấy lịch sử đơn hàng của user (không lấy giỏ hàng)
 */
const getMyOrders = async (userId) => {
  return Order.find({ userId, status: { $ne: 'cart' } }).sort({ createdAt: -1 });
};

module.exports = {
  getCart,
  addItemToCart,
  checkoutCart,
  getMyOrders,
};
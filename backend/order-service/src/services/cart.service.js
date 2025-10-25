const httpStatus = require('http-status-codes');
const Cart = require('../models/cart.model');
const productClient = require('./product.client'); // Client gọi product-service
const ApiError = require('../utils/ApiError');

/**
 * Lấy giỏ hàng của user, nếu chưa có thì tạo mới
 * @param {string} userId
 * @returns {Promise<Cart>}
 */
const getCartByUserId = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [], totalPrice: 0 });
  }
  return cart;
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {string} userId
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<Cart>}
 */
const addProductToCart = async (userId, productId, quantity) => {
  // BƯỚC 1: GỌI PRODUCT-SERVICE ĐỂ LẤY THÔNG TIN
  const product = await productClient.getProductById(productId);

  // BƯỚC 2: KIỂM TRA TỒN KHO
  if (product.stock < quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough stock');
  }

  // BƯỚC 3: XỬ LÝ GIỎ HÀNG
  const cart = await getCartByUserId(userId);
  
  const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

  if (existingItemIndex > -1) {
    // Cập nhật số lượng
    cart.items[existingItemIndex].quantity += quantity;
    // Kiểm tra lại tồn kho sau khi cộng dồn
    if (product.stock < cart.items[existingItemIndex].quantity) {
       throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough stock for updated quantity');
    }
  } else {
    // Thêm item mới
    cart.items.push({
      productId: productId,
      quantity: quantity,
      price: product.price,
      name: product.name,
    });
  }

  // BƯỚC 4: TÍNH TOÁN LẠI VÀ LƯU
  cart.calculateTotal();
  await cart.save();
  return cart;
};

// ... (Viết thêm các hàm updateQuantity, removeItem tương tự)

/**
 * Xóa toàn bộ giỏ hàng (sau khi đã checkout)
 * @param {string} userId
 */
const clearCart = async (userId) => {
    const cart = await getCartByUserId(userId);
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    return cart;
};

module.exports = {
  getCartByUserId,
  addProductToCart,
  clearCart,
  // ...
};
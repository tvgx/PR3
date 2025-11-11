const Wishlist = require('../models/wishlist.model');
const Product = require('../models/product.model'); // Cần để kiểm tra
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status-codes');

/**
 * Lấy wishlist của user (hoặc tạo mới nếu chưa có)
 * và populate (thay thế ID bằng object sản phẩm)
 */
const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ userId }).populate('products');
  
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, products: [] });
  }
  return wishlist;
};

/**
 * Thêm sản phẩm vào wishlist
 */
const addProductToWishlist = async (userId, productId) => {
  // 1. Kiểm tra sản phẩm có tồn tại không
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // 2. Lấy wishlist (hoặc tạo mới)
  const wishlist = await getWishlist(userId);

  // 3. Kiểm tra sản phẩm đã có trong list chưa
  const alreadyExists = wishlist.products.some(
    (item) => item._id.toString() === productId
  );

  if (alreadyExists) {
    return wishlist; // Không làm gì nếu đã có
  }

  // 4. Thêm sản phẩm và lưu
  wishlist.products.push(productId);
  await wishlist.save();
  
  // Populate lại để trả về dữ liệu đầy đủ
  return wishlist.populate('products');
};

/**
 * Xóa sản phẩm khỏi wishlist
 */
const removeProductFromWishlist = async (userId, productId) => {
  const wishlist = await getWishlist(userId);

  // 1. Lọc ra sản phẩm cần xóa
  wishlist.products = wishlist.products.filter(
    (item) => item._id.toString() !== productId
  );

  // 2. Lưu lại
  await wishlist.save();
  return wishlist.populate('products');
};

module.exports = {
  getWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
};
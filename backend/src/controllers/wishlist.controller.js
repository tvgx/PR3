const wishlistService = require('../services/wishlist.service');
const catchAsync = require('../utils/catchAsync');

// Lấy danh sách yêu thích
const getWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user.id);
  res.status(200).json(wishlist);
});

// Thêm vào danh sách
const addProduct = catchAsync(async (req, res) => {
  const { productId } = req.body;
  const wishlist = await wishlistService.addProductToWishlist(req.user.id, productId);
  res.status(201).json(wishlist); // 201 Created (hoặc 200 OK)
});

// Xóa khỏi danh sách
const removeProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const wishlist = await wishlistService.removeProductFromWishlist(req.user.id, productId);
  res.status(200).json(wishlist);
});

module.exports = {
  getWishlist,
  addProduct,
  removeProduct,
};
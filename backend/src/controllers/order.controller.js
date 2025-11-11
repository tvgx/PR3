const orderService = require('../services/order.service');
const catchAsync = require('../utils/catchAsync');

// Lấy giỏ hàng
const getCart = catchAsync(async (req, res) => {
  // req.user.id được gán từ middleware 'requireAuth'
  const cart = await orderService.getCart(req.user.id);
  res.status(200).json(cart);
});

// Thêm vào giỏ
const addItemToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await orderService.addItemToCart(req.user.id, productId, quantity);
  res.status(200).json(cart);
});

// Checkout
const checkout = catchAsync(async (req, res) => {
  const { shippingAddress } = req.body;
  const order = await orderService.checkoutCart(req.user.id, shippingAddress);
  res.status(201).json(order); // Trả về 201 (Created)
});

// Lấy lịch sử đơn hàng
const getMyOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user.id);
  res.status(200).json(orders);
});

module.exports = {
  getCart,
  addItemToCart,
  checkout,
  getMyOrders,
};
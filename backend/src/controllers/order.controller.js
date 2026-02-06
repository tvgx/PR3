const orderService = require('../services/order.service');
const catchAsync = require('../utils/catchAsync');


const getCart = catchAsync(async (req, res) => {
  const cart = await orderService.getCart(req.user.id);
  res.status(200).json(cart);
});
const addItemToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await orderService.addItemToCart(req.user.id, productId, quantity);
  res.status(200).json(cart);
});

const mergeCart = catchAsync(async (req, res) => {
  const { items } = req.body; // Expecting { items: [{ id, quantity }, ...] }
  const cart = await orderService.mergeCart(req.user.id, items);
  res.status(200).json(cart);
});

const checkout = catchAsync(async (req, res) => {
  const { shippingAddress, selectedProductIds } = req.body;
  const order = await orderService.checkoutCart(req.user.id, shippingAddress, selectedProductIds);
  res.status(201).json(order);
});

const getMyOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user.id);
  res.status(200).json(orders);
});

const updateItemQuantity = catchAsync(async (req, res) => {
  const { productId } = req.params; // Lấy ID từ URL
  const { quantity } = req.body; // Lấy số lượng từ body
  const cart = await orderService.updateItemQuantity(req.user.id, productId, quantity);
  res.status(200).json(cart);
});

const removeItemFromCart = catchAsync(async (req, res) => {
  const { productId } = req.params; // Lấy ID từ URL
  const cart = await orderService.removeItemFromCart(req.user.id, productId);
  res.status(200).json(cart);
});

const getAllOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.status(200).json(orders);
});

module.exports = {
  getCart,
  addItemToCart,
  checkout,
  getMyOrders,
  getAllOrders,
  updateItemQuantity,
  removeItemFromCart,
  mergeCart,
};

const httpStatus = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const { cartService } = require('../services');

const getCart = catchAsync(async (req, res) => {
  // req.user.id được gán từ auth.middleware.js
  const cart = await cartService.getCartByUserId(req.user.id); 
  res.send(cart);
});

const addItemToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addProductToCart(req.user.id, productId, quantity);
  res.status(httpStatus.CREATED).send(cart);
});

module.exports = {
  getCart,
  addItemToCart,
};
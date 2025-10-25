const httpStatus = require('http-status-codes');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const createOrder = catchAsync(async (req, res) => {
  const { shippingAddress } = req.body;
  const order = await orderService.createOrder(req.user.id, shippingAddress);
  res.status(httpStatus.CREATED).send(order);
});

const getMyOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user.id);
  res.send(orders);
});

module.exports = {
  createOrder,
  getMyOrders,
};
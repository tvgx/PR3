const dashboardService = require('../services/dashboard.service');
const catchAsync = require('../utils/catchAsync');

const getStats = catchAsync(async (req, res) => {
  const stats = await dashboardService.getStats();
  res.status(200).json(stats);
});

const getRevenueOverTime = catchAsync(async (req, res) => {
  const data = await dashboardService.getRevenueOverTime();
  res.status(200).json(data);
});

const getRecentOrders = catchAsync(async (req, res) => {
  const orders = await dashboardService.getRecentOrders();
  res.status(200).json(orders);
});

module.exports = {
  getStats,
  getRevenueOverTime,
  getRecentOrders,
};
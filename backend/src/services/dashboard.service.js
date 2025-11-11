const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');

/**
 * Lấy các số liệu thống kê tổng quan
 */
const getStats = async () => {
  // 1. Đếm số lượng
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments({ status: { $ne: 'cart' } });

  // 2. Tính tổng doanh thu (chỉ tính đơn hàng 'paid' hoặc 'delivered')
  const revenueResult = await Order.aggregate([
    {
      $match: {
        status: { $in: ['paid', 'delivered'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' }
      }
    }
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  return {
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
  };
};

/**
 * Lấy doanh thu theo ngày (7 ngày gần nhất)
 */
const getRevenueOverTime = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const revenueData = await Order.aggregate([
    {
      $match: {
        status: { $in: ['paid', 'delivered'] },
        createdAt: { $gte: sevenDaysAgo }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        dailyRevenue: { $sum: "$totalPrice" }
      }
    },
    { $sort: { _id: 1 } } // Sắp xếp theo ngày
  ]);

  return revenueData;
};

/**
 * Lấy các đơn hàng mới nhất
 */
const getRecentOrders = async () => {
  return Order.find({ status: { $ne: 'cart' } })
    .sort({ createdAt: -1 })
    .limit(10) // Lấy 10 đơn hàng mới nhất
    .populate('userId', 'name'); // Lấy tên của user
};

module.exports = {
  getStats,
  getRevenueOverTime,
  getRecentOrders,
};
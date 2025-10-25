const axios = require('axios');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status-codes');

// Khởi tạo một instance axios với URL cơ sở là product-service
const apiClient = axios.create({
  baseURL: config.productServiceUrl,
});

/**
 * Lấy thông tin chi tiết của một sản phẩm từ Product Service
 * @param {string} productId
 * @returns {Promise<Object>} Thông tin sản phẩm { _id, name, price, stock }
 */
const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/${productId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new ApiError(httpStatus.NOT_FOUND, `Product not found: ${productId}`);
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch product details');
  }
};

module.exports = {
  getProductById,
};
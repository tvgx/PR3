const httpStatus = require('http-status-codes');
const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');

/**
 * Tạo sản phẩm mới
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  return Product.create(productBody);
};

/**
 * Lấy danh sách sản phẩm (có thể thêm filter, pagination ở đây)
 * @returns {Promise<Product[]>}
 */
const queryProducts = async () => {
  const products = await Product.find();
  return products;
};

/**
 * Lấy chi tiết sản phẩm bằng ID
 * @param {string} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  return product;
};

/**
 * Cập nhật sản phẩm bằng ID
 * @param {string} id
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (id, updateBody) => {
  const product = await getProductById(id); // Tái sử dụng hàm get để check tồn tại
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Xóa sản phẩm bằng ID
 * @param {string} id
 * @returns {Promise<void>}
 */
const deleteProductById = async (id) => {
  const product = await getProductById(id);
  await product.deleteOne();
};

module.exports = {
  createProduct,
  queryProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
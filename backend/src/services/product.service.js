const Product = require('../models/product.model');

/**
 * Lấy danh sách sản phẩm (có filter, pagination, sort)
 * @param {Object} filters - Ví dụ: { category: 'Shirts', tag: 'flash-sale' }
 * @param {Object} options - Ví dụ: { limit: 10, page: 1, sortBy: 'price:asc' }
 */
const queryProducts = async (filters, options) => {
  const query = {};

  if (filters.category) {
    query.category = filters.category;
  }
  if (filters.tag) {
    query.tags = { $in: [filters.tag] };
  }
  // (Bạn có thể thêm logic lọc giá ở đây)

  const limit = options.limit || 10;
  const page = options.page || 1;
  const skip = (page - 1) * limit;

  const sort = {};
  if (options.sortBy) {
    const parts = options.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1; // Mặc định
  }

  const products = await Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);
    
  const totalResults = await Product.countDocuments(query);

  return { products, totalResults, totalPages: Math.ceil(totalResults / limit) };
};

/**
 * Lấy chi tiết sản phẩm bằng ID
 */
const getProductById = async (id) => {
  return Product.findById(id);
};

/**
 * Lấy danh sách các danh mục duy nhất
 */
const getProductCategories = async () => {
  return Product.distinct('category');
};

/**
 * Tạo sản phẩm mới
 */
const createProduct = async (productBody) => {
  // (Bạn có thể thêm logic kiểm tra trùng tên sản phẩm ở đây nếu muốn)
  return Product.create(productBody);
};

/**
 * Cập nhật sản phẩm
 */
const updateProductById = async (id, updateBody) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  Object.assign(product, updateBody);
  await product.save();
  return product;
};

/**
 * Xóa sản phẩm
 */
const deleteProductById = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

module.exports = {
  queryProducts,
  getProductById,
  getProductCategories,
  createProduct,
  updateProductById,
  deleteProductById,
};
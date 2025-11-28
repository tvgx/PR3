const Product = require('../models/product.model');
const Category = require('../models/category.model');
const mongoose = require('mongoose');

/**
 * Lấy danh sách sản phẩm (có filter, pagination, sort)
 * @param {Object} filters - Ví dụ: { category: 'Shirts', tag: 'flash-sale' }
 * @param {Object} options - Ví dụ: { limit: 10, page: 1, sortBy: 'price:asc' }
 */
const queryProducts = async (filters, options) => {
  let query = {};

  if (filters.category) {
    // Nếu category là tên (String), tìm ID tương ứng
    if (!mongoose.Types.ObjectId.isValid(filters.category)) {
      const cat = await Category.findOne({ name: filters.category });
      if (cat) query.category = cat._id;
      else query.category = null; // Không tìm thấy category -> không tìm thấy sản phẩm
    } else {
      query.category = filters.category;
    }
  }

  if (filters.tag) {
    query.tags = { $in: [filters.tag] };
  }
  // TODO: Thêm logic lọc theo giá
  const limit = parseInt(options.limit, 10) || 40;
  const page = parseInt(options.page, 10) || 1;
  const skip = (page - 1) * limit;

  let sort = {};
  if (options.sortBy) {
    const parts = options.sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  } else {
    sort.createdAt = -1; // Mặc định
  }

  let products = await Product.find(query)
    .populate('category')
    .sort(sort)
    .skip(skip)
    .limit(limit);

  let totalResults = await Product.countDocuments(query);

  // --- FALLBACK LOGIC ---
  if (products.length === 0 && filters.tag) {
    if (filters.tag === 'best-selling') {
      // Fallback: Highest price
      products = await Product.find({})
        .populate('category')
        .sort({ price: -1 })
        .limit(limit);
      totalResults = products.length; // Approximate for fallback
    } else if (filters.tag === 'new-arrival') {
      // Fallback: Newest created
      products = await Product.find({})
        .populate('category')
        .sort({ createdAt: -1 })
        .limit(limit);
      totalResults = products.length;
    } else if (filters.tag === 'flash-sale') {
      // Fallback: Random
      products = await Product.aggregate([{ $sample: { size: limit } }]);
      // Aggregate returns plain objects, need to populate manually or fetch again. 
      const ids = products.map(p => p._id);
      products = await Product.find({ _id: { $in: ids } }).populate('category');
      totalResults = products.length;
    }
  }

  const totalPages = Math.ceil(totalResults / limit);

  return { products, totalResults, totalPages, currentPage: page };
};

const getProductById = async (id) => {
  return Product.findById(id).populate('category');
};

/**
 * Lấy danh sách các danh mục
 */
const getProductCategories = async () => {
  return Category.find({});
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

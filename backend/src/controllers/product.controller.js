const productService = require('../services/product.service');
const catchAsync = require('../utils/catchAsync'); // Tiện ích bắt lỗi (sẽ tạo sau)

// Lấy tất cả sản phẩm (Public)
const getProducts = catchAsync(async (req, res) => {
  // req.query sẽ chứa các filter như ?category=...&limit=...
  const filters = req.query;
  const options = {
    limit: req.query.limit,
    page: req.query.page,
    sortBy: req.query.sortBy,
  };
  
  const result = await productService.queryProducts(filters, options);
  res.status(200).json(result);
});

// Lấy các danh mục (Public)
const getCategories = catchAsync(async (req, res) => {
  const categories = await productService.getProductCategories();
  res.status(200).json(categories);
});

// Lấy 1 sản phẩm (Public)
const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.status(200).json(product);
});

// Tạo sản phẩm (Admin)
const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
});

// Cập nhật sản phẩm (Admin)
const updateProduct = catchAsync(async (req, res) => {
  try {
    const product = await productService.updateProductById(req.params.id, req.body);
    res.status(200).json(product);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Xóa sản phẩm (Admin)
const deleteProduct = catchAsync(async (req, res) => {
  try {
    await productService.deleteProductById(req.params.id);
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

module.exports = {
  getProducts,
  getCategories,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
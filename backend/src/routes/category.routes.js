const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

router.post('/', requireAuth, requireAdmin, categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', requireAuth, requireAdmin, categoryController.updateCategory);
router.delete('/:id', requireAuth, requireAdmin, categoryController.deleteCategory);
router.get('/:id/products', categoryController.getProductsByCategory);

module.exports = router;

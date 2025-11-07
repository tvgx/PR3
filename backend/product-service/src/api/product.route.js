const express = require('express');
const validate = require('../middlewares/validate.middleware');
const { productValidation } = require('../validations');
const { productController } = require('../controllers');
const { requireAuth, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/categories').get(productController.getCategories);

router
  .route('/')
  .post(requireAuth, isAdmin, validate(productValidation.createProduct), productController.createProduct)
  .get(productController.getProducts); // Public

router
  .route('/:id')
  .get(validate(productValidation.getProduct), productController.getProduct) // Public
  .patch(requireAuth, isAdmin, validate(productValidation.updateProduct), productController.updateProduct)
  .delete(requireAuth, isAdmin, validate(productValidation.deleteProduct), productController.deleteProduct);

module.exports = router;
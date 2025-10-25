const Joi = require('joi');

// Validator cho MongoDB ObjectId
const objectId = Joi.string().custom((value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
}, 'MongoDB ID validation');


const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    stock: Joi.number().required().min(0),
    category: Joi.string().required(),
    imageUrl: Joi.string().uri().optional(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    id: objectId.required(),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    id: objectId.required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number().min(0),
    stock: Joi.number().min(0),
    category: Joi.string(),
    imageUrl: Joi.string().uri(),
  }).min(1), // Phải có ít nhất 1 trường để cập nhật
};

const deleteProduct = {
  params: Joi.object().keys({
    id: objectId.required(),
  }),
};

module.exports = {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
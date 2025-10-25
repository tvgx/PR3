const Joi = require('joi');

const objectId = Joi.string().custom((value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
}, 'MongoDB ID validation');

const addItemToCart = {
  body: Joi.object().keys({
    productId: objectId.required(),
    quantity: Joi.number().required().min(1),
  }),
};

const updateItemQuantity = {
  params: Joi.object().keys({
    itemId: objectId.required(), // 'itemId' ở đây là _id của item trong mảng items của cart
  }),
  body: Joi.object().keys({
    quantity: Joi.number().required().min(1),
  }),
};

const removeItemFromCart = {
  params: Joi.object().keys({
    itemId: objectId.required(),
  }),
};

module.exports = {
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
};
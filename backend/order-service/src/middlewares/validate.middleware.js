const Joi = require('joi');
const httpStatus = require('http-status-codes');
const ApiError = require('../utils/ApiError');

// Tiện ích để lấy các trường từ object
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

const validate = (schema) => (req, res, next) => {
  // Lấy các trường cần validate từ schema (ví dụ: body, params, query)
  const validSchema = pick(schema, ['params', 'query', 'body']);
  
  // Lấy dữ liệu tương ứng từ request
  const object = pick(req, Object.keys(validSchema));

  // Thực hiện validation
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  
  // Gán dữ liệu đã được validate (và có thể đã được chuẩn hóa) vào lại request
  Object.assign(req, value);
  return next();
};

module.exports = validate;
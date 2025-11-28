const Order = require('../models/order.model');
const Product = require('../models/product.model'); // Cần để kiểm tra kho
const ApiError = require('../utils/ApiError'); // Sẽ tạo sau
const httpStatus = require('http-status-codes');

const getCart = async (userId) => {
  let cart = await Order.findOne({ userId, status: 'cart' });
  if (!cart) {
    cart = await Order.create({ userId, items: [], status: 'cart' });
  }
  return cart;
};

const updateItemQuantity = async (userId, productId, quantity) => {
  if (quantity < 1) {
    return removeItemFromCart(userId, productId);
  }
  const cart = await getCart(userId);
  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (itemIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found in cart");
  }
  const product = await Product.findById(productId);
  if (product.stock < quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Only ${product.stock} items in stock`);
  }
  cart.items[itemIndex].quantity = quantity;
  await cart.save();
  return cart;
};
const removeItemFromCart = async (userId, productId) => {
  const cart = await getCart(userId);
  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
  return cart;
};
const addItemToCart = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  if (product.stock < quantity) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough stock');
  }

  const cart = await getCart(userId);
  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
    if (product.stock < cart.items[existingItemIndex].quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Not enough stock for updated quantity');
    }
  } else {
    cart.items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: quantity,
    });
  }
  await cart.save();
  return cart;
};
const checkoutCart = async (userId, shippingAddress) => {
  const cart = await getCart(userId);
  if (cart.items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
  }
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, `Product ${item.name} not found`);
    }
    if (product.stock < item.quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Not enough stock for ${item.name}`);
    }
  }
  const bulkOps = cart.items.map(item => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { stock: -item.quantity } }
    }
  }));
  await Product.bulkWrite(bulkOps);
  cart.status = 'pending'; // Chuyển trạng thái từ 'cart' -> 'pending' (chờ thanh toán)
  cart.shippingAddress = shippingAddress;
  await cart.save();

  return cart;
};
const getMyOrders = async (userId) => {
  return Order.find({ userId, status: { $ne: 'cart' } }).sort({ createdAt: -1 });
};

const getAllOrders = async () => {
  return Order.find({ status: { $ne: 'cart' } })
    .populate('userId', 'name email') // Populate user info
    .sort({ createdAt: -1 });
};

module.exports = {
  getCart,
  addItemToCart,
  checkoutCart,
  getMyOrders,
  getAllOrders,
  updateItemQuantity,
  removeItemFromCart,
};

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
const checkoutCart = async (userId, shippingAddress, selectedProductIds = []) => {
  const cart = await getCart(userId);
  if (cart.items.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cart is empty');
  }

  // Determine items to checkout
  let itemsToCheckout = [];
  if (selectedProductIds && selectedProductIds.length > 0) {
    itemsToCheckout = cart.items.filter(item => selectedProductIds.includes(item.productId.toString()));

    // Check if all selected items exist
    if (itemsToCheckout.length !== selectedProductIds.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Some selected items are not in the cart');
    }
  } else {
    itemsToCheckout = [...cart.items];
  }

  if (itemsToCheckout.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No items selected for checkout');
  }

  // Check stock and deduct
  for (const item of itemsToCheckout) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, `Product ${item.name} not found`);
    }
    if (product.stock < item.quantity) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Not enough stock for ${item.name}`);
    }
  }

  const bulkOps = itemsToCheckout.map(item => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { stock: -item.quantity } }
    }
  }));
  await Product.bulkWrite(bulkOps);

  // Create Order
  const order = await Order.create({
    userId,
    items: itemsToCheckout,
    shippingAddress,
    status: 'pending'
  });

  // Remove checked out items from Cart
  // If we checked out everything, we can just clear items. 
  // If partial, filter them out.
  // Note: If we selected everything, itemsToCheckout equals cart.items.

  // Identify IDs of items to remove
  const checkoutIds = itemsToCheckout.map(i => i.productId.toString());
  cart.items = cart.items.filter(item => !checkoutIds.includes(item.productId.toString()));
  await cart.save();

  return order;
};

const mergeCart = async (userId, guestItems) => {
  if (!guestItems || guestItems.length === 0) return getCart(userId);

  const cart = await getCart(userId);

  for (const guestItem of guestItems) {
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === guestItem.id // Frontend sends 'id', backend uses 'productId'
    );

    if (existingItemIndex > -1) {
      // If item exists, sum quantity
      cart.items[existingItemIndex].quantity += guestItem.quantity;
    } else {
      // If valid product, add to cart
      // We should ideally fetch product details to ensure price/image are up to date, 
      // but for merge speed we can trust the ID and fetch details or just push if structure matches.
      // Better: Fetch product to ensure validity.
      const product = await Product.findById(guestItem.id);
      if (product) {
        cart.items.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: guestItem.quantity
        });
      }
    }
  }
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
  mergeCart,
};

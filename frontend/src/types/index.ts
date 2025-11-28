// src/types/index.ts

/**
 * Đây là định nghĩa chung cho một Sản phẩm (Product).
 * Nó dựa trên product.model.js từ backend.
 */
export type Product = {
  id: string; // MongoDB _id
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  stock: number;
  category: string;
  imageUrl: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  discount?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
};

/**
 * Định nghĩa cho 1 item trong Giỏ hàng (Cart)
 */
export type CartItem = {
  id: string; // Product ID
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export type Order = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
  status: 'cart' | 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  totalAmount?: number; // Optional, calculated on frontend if needed
};

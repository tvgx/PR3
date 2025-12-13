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
  images: string[];
  rating: number;
  reviewCount: number;
  discount?: string;
  tags?: string[];
  colors: string[];
  sizes: string[];
  averageRating?: number;
  totalReviews?: number;
  // MongoDB often returns _id, so we add it as optional compatibility
  _id?: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Định nghĩa cho 1 item trong Giỏ hàng (Cart)
 */
export interface CartItem {
  id: string; // This will map to product.id or product._id
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  color?: string;
  size?: string;
}

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

export type Event = {
  _id: string;
  name: string;
  type: 'flash-sale' | 'music-banner' | 'other';
  startDate: string;
  endDate: string;
  products: Product[];
  isActive: boolean;
};

// src/lib/api-client.ts

import { useAuthStore } from "@/src/store/auth.store";
import axios from "axios";

// 1. Tạo một instance axios đã được cấu hình
const apiClient = axios.create({
  // 2. Lấy URL của API Gateway từ biến môi trường
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 3. (Quan trọng) Sử dụng Interceptor để Tự Động Gắn Token
// Đoạn code này sẽ chạy "trước" MỌI request mà frontend gửi đi
apiClient.interceptors.request.use((config) => {
  // Lấy trạng thái từ Zustand store (store này đã persist trong localStorage)
  // Chúng ta dùng .getState() vì chúng ta đang ở ngoài một React component
  const { token } = useAuthStore.getState();

  // Nếu có token, gắn nó vào header Authorization
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Trả về config đã được cập nhật
  return config;
});

export default apiClient;
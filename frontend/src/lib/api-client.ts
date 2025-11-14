// src/lib/api-client.ts

import { useAuthStore } from "@/src/store/auth.store";
import axios, { isAxiosError } from "axios";

// 1. Tạo một instance axios đã được cấu hình
const apiClient = axios.create({
  // 2. Lấy URL của API Gateway từ biến môi trường
  baseURL: process.env.NEXT_PUBLIC_API_GATEWAY_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
apiClient.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Trả về config đã được cập nhật
  return config;
});

export default apiClient;
export { isAxiosError };
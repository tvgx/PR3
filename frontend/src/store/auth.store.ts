import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import Cookies from "js-cookie";

// Định nghĩa kiểu User (dựa trên @better-auth và hook của chúng ta)
type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
};

// Custom cookie storage adapter
const cookieStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, { expires: 7 }); // 7 days expiry
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};

// 'persist' sẽ tự động lưu token vào cookies với thời hạn 7 ngày
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage", // Tên key trong cookies
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
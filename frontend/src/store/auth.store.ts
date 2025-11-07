import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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

// 'persist' sẽ tự động lưu token vào localStorage
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-storage", // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
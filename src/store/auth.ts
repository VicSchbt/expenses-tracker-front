'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  email: string | null;
  token: string | null; // "Basic <base64(email:password)>"
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: null,
      token: null,

      login: async (email, password) => {
        const basic = btoa(`${email}:${password}`);
        const token = `Basic ${basic}`;

        // ping backend to validate creds (any protected route works)
        const res = await fetch(`${API_BASE}/api/expenses`, {
          headers: { Authorization: token },
          cache: 'no-store',
        });

        if (!res.ok) return false;

        set({ email, token });
        return true;
      },

      logout: () => set({ email: null, token: null }),
    }),
    { name: 'auth' }
  )
);

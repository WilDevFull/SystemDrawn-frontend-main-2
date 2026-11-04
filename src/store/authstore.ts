import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthRole = 'customer' | 'admin';

interface AuthState {
  user: any;
  token: string | null;
  role: AuthRole | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: any, token: string, role?: AuthRole) => void;
  loginAsAdmin: (user: any, token: string) => void;
  logout: () => void;
}

const safeStorage =
  typeof window !== 'undefined' && 'localStorage' in window
    ? createJSONStorage(() => window.localStorage)
    : undefined;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (user, token, role = user?.role ?? 'customer') =>
        set(() => ({
          user: user ? { ...user, role } : null,
          token,
          role,
          isAuthenticated: Boolean(token),
          isAdmin: role === 'admin',
        })),

      loginAsAdmin: (user, token) =>
        set(() => ({
          user: user ? { ...user, role: 'admin' } : null,
          token,
          role: 'admin',
          isAuthenticated: Boolean(token),
          isAdmin: true,
        })),

      logout: () =>
        set(() => ({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
          isAdmin: false,
        })),
    }),
    {
      name: 'systemdrawn-auth',
      storage: safeStorage,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
      }),
    },
  ),
);

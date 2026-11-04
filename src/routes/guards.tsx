import { useAuthStore } from '@/store/authstore';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export function RequireAuth() {
  const token = useAuthStore((state) => state.token);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

// Proteção apenas de interface; o backend precisa validar o papel em cada chamada.
export function RequireAdmin() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const location = useLocation();

  if (!token || role !== 'admin') {
    return <Navigate to="/admin-login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

type RedirectIfAuthenticatedProps = { only?: 'admin' };

export function RedirectIfAuthenticated({ only }: RedirectIfAuthenticatedProps) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);

  if (token && (!only || role === only)) {
    return <Navigate to={role === 'admin' ? '/admin' : '/home'} replace />;
  }

  return <Outlet />;
}

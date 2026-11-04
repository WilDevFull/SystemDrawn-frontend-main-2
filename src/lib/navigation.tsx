import type { NavigateFunction } from 'react-router-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';

type RouteTarget =
  | string
  | {
      pathname: string;
      params?: Record<string, string | number | undefined>;
    };

let activeNavigate: NavigateFunction | undefined;

function normalizeTarget(target: RouteTarget) {
  const pathname = typeof target === 'string' ? target : target.pathname;
  const params = typeof target === 'string' ? undefined : target.params;
  let path = pathname;

  if (path === '/(tabs)' || path === '/(tabs)/') {
    path = '/home';
  } else if (path.startsWith('/(tabs)/')) {
    path = path.replace('/(tabs)', '');
  } else if (path === '/(admin)' || path === '/(admin)/') {
    path = '/admin';
  } else if (path.startsWith('/(admin)/')) {
    path = path.replace('/(admin)', '/admin');
  }

  if (params) {
    const query = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) query.set(key, String(value));
    }

    const queryString = query.toString();
    if (queryString) path += `?${queryString}`;
  }

  return path;
}

function navigateTo(target: RouteTarget, replace = false) {
  const path = normalizeTarget(target);

  if (activeNavigate) {
    activeNavigate(path, { replace });
  } else {
    window.location.assign(path);
  }
}

export function RouterBridge() {
  activeNavigate = useNavigate();
  return null;
}

export const router = {
  push: (target: RouteTarget) => navigateTo(target),
  replace: (target: RouteTarget) => navigateTo(target, true),
  back: () => activeNavigate?.(-1),
};

export function useRouter() {
  const navigate = useNavigate();

  return {
    push: (target: RouteTarget) => navigate(normalizeTarget(target)),
    replace: (target: RouteTarget) =>
      navigate(normalizeTarget(target), { replace: true }),
    back: () => navigate(-1),
  };
}

export function useLocalSearchParams() {
  const [searchParams] = useSearchParams();
  return Object.fromEntries(searchParams.entries());
}
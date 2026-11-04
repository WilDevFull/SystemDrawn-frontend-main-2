import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RouterBridge } from '@/lib/navigation';
import AppRoutes from './routes';

function RouteFallback() {
  return <main className="web-message" aria-live="polite">Carregando...</main>;
}

export default function App() {
  return (
    <BrowserRouter>
      <RouterBridge />
      <Suspense fallback={<RouteFallback />}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

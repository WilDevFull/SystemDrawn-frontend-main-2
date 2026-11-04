import { useAuthStore } from '@/store/authstore';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);

  useEffect(() => {
    if (!open) return;

    const handlePointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  if (token) {
    return (
      <Link className="account-link login-menu" to={role === 'admin' ? '/admin' : '/perfil'}>
        {role === 'admin' ? 'Painel admin' : 'Meu perfil'}
      </Link>
    );
  }

  return (
    <div className="login-menu" ref={containerRef}>
      <button
        className="login-menu-trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        Login <ChevronDown size={15} aria-hidden="true" />
      </button>
      {open && (
        <div className="login-menu-list" role="menu">
          <Link role="menuitem" to="/login" onClick={() => setOpen(false)}>Sou cliente</Link>
          <Link role="menuitem" to="/admin-login" onClick={() => setOpen(false)}>Sou administrador</Link>
        </div>
      )}
    </div>
  );
}

import { useAuthStore } from '@/store/authstore';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Brand from './Brand';
import LoginMenu from './LoginMenu';

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const schedulePath = token ? '/novo-agendamento' : '/login';
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Brand />
        <nav className="desktop-navigation public-navigation" aria-label="Navegação principal">
          <a href="/#servicos">Serviços</a>
          <a href="/#como-funciona">Como funciona</a>
        </nav>
        <div className="site-header-actions">
          <LoginMenu />
          <Link className="button button-header" to={schedulePath}>
            Agendar <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button
            className="mobile-menu-toggle"
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-navigation" aria-label="Navegação principal">
          <a href="/#servicos" onClick={closeMenu}>Serviços</a>
          <a href="/#como-funciona" onClick={closeMenu}>Como funciona</a>
          {token ? (
            <Link to={role === 'admin' ? '/admin' : '/perfil'} onClick={closeMenu}>
              {role === 'admin' ? 'Painel admin' : 'Meu perfil'}
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu}>Login de cliente</Link>
              <Link to="/admin-login" onClick={closeMenu}>Login de administrador</Link>
            </>
          )}
          <Link to={schedulePath} onClick={closeMenu}>Agendar horário</Link>
        </nav>
      )}
    </header>
  );
}

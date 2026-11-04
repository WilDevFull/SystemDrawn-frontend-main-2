import Brand from '@/components/Brand';
import SiteFooter from '@/components/SiteFooter';
import { useAuthStore } from '@/store/authstore';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

const userLinks = [
  { to: '/home', label: 'Tatuagens' },
  { to: '/piercings', label: 'Piercings' },
  { to: '/joias', label: 'Joias' },
  { to: '/artes', label: 'Simulador Tatoo' },
  { to: '/meus-agendamentos', label: 'Agendamentos' },
  { to: '/historico', label: 'Histórico' },
  { to: '/notificacoes', label: 'Notificações' },
  { to: '/perfil', label: 'Perfil' },
];

function UserHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const firstName = user?.nomeCompleto?.trim().split(/\s+/)[0] || 'Cliente';
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className="site-header customer-header">
      <div className="site-header-inner">
        <Brand />
        <nav className="desktop-navigation customer-navigation" aria-label="Navegação do cliente">
          {userLinks.map((link) => (
            <NavLink key={link.to} to={link.to}>{link.label}</NavLink>
          ))}
        </nav>
        <div className="site-header-actions customer-header-actions">
          <span className="customer-greeting">Olá, {firstName}</span>
          <button className="text-button" type="button" onClick={handleLogout}>Sair</button>
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
        <nav className="mobile-navigation customer-mobile-navigation" aria-label="Navegação do cliente">
          {userLinks.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={closeMenu}>{link.label}</NavLink>
          ))}
          <button className="text-button" type="button" onClick={handleLogout}>Sair</button>
        </nav>
      )}
    </header>
  );
}

export default function UserLayout() {
  const location = useLocation();
  const isBooking = location.pathname.startsWith('/agendamento-') || location.pathname === '/novo-agendamento';

  return (
    <div className="site-frame">
      <UserHeader />
      <main className="site-main">
        <div className={`site-content site-content-customer${isBooking ? ' site-content-booking' : ''}`}>
          <Outlet />
        </div>
      </main>
      <SiteFooter variant="customer" />
    </div>
  );
}

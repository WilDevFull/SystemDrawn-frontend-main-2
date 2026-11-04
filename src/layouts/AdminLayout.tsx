import SiteFooter from '@/components/SiteFooter';
import { useAuthStore } from '@/store/authstore';
import { Menu, Shield, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/admin-login', { replace: true });
  };

  return (
    <div className="site-frame admin-frame">
      <header className="site-header admin-header">
        <div className="site-header-inner">
          <Link className="site-brand" to="/admin">
            <span className="brand-mark admin-brand-mark"><Shield size={19} aria-hidden="true" /></span>
            <span className="brand-wordmark">System<span>Drawn</span></span>
            <span className="admin-brand-label">Admin</span>
          </Link>
          <nav className="desktop-navigation admin-navigation" aria-label="Navegação administrativa">
            <NavLink to="/admin" end>Dashboard</NavLink>
            <NavLink to="/admin/aprovacoes">Aprovações</NavLink>
            <NavLink to="/admin/agenda">Agenda</NavLink>
          </nav>
          <div className="site-header-actions">
            <Link className="account-link" to="/">Ver site</Link>
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
          <nav className="mobile-navigation admin-mobile-navigation" aria-label="Navegação administrativa">
            <NavLink to="/admin" end onClick={closeMenu}>Dashboard</NavLink>
            <NavLink to="/admin/aprovacoes" onClick={closeMenu}>Aprovações</NavLink>
            <NavLink to="/admin/agenda" onClick={closeMenu}>Agenda</NavLink>
            <Link to="/" onClick={closeMenu}>Ver site</Link>
            <button className="text-button" type="button" onClick={handleLogout}>Sair</button>
          </nav>
        )}
      </header>
      <main className="site-main admin-main">
        <div className="site-content site-content-admin"><Outlet /></div>
      </main>
      <SiteFooter variant="admin" />
    </div>
  );
}

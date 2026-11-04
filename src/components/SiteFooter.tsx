import { useAuthStore } from '@/store/authstore';
import { Link } from 'react-router-dom';
import Brand from './Brand';

type SiteFooterProps = { variant: 'public' | 'customer' | 'admin' };

export default function SiteFooter({ variant }: SiteFooterProps) {
  const token = useAuthStore((state) => state.token);

  return (
    <footer className={`site-footer site-footer-${variant}`}>
      <div className="site-footer-inner">
        <Brand />
        <p>Tattoo · Piercing · Agendamentos</p>
        {variant === 'public' && (
          <nav aria-label="Links do rodapé">
            <a href="/#servicos">Serviços</a>
            <a href="/#como-funciona">Como funciona</a>
            <Link to={token ? '/perfil' : '/login'}>{token ? 'Meu perfil' : 'Entrar'}</Link>
          </nav>
        )}
        {variant === 'customer' && (
          <nav aria-label="Links do rodapé">
            <Link to="/meus-agendamentos">Agendamentos</Link>
            <Link to="/historico">Histórico</Link>
            <Link to="/perfil">Perfil</Link>
          </nav>
        )}
        {variant === 'admin' && <span className="admin-footer-label">Painel administrativo</span>}
      </div>
    </footer>
  );
}

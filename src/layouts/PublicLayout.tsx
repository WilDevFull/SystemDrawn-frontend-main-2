import PublicHeader from '@/components/PublicHeader';
import SiteFooter from '@/components/SiteFooter';
import { Outlet } from 'react-router-dom';

type PublicLayoutProps = { variant?: 'default' | 'auth' };

export default function PublicLayout({ variant = 'default' }: PublicLayoutProps) {
  return (
    <div className="site-frame">
      <PublicHeader />
      <main className="site-main">
        <div className={`site-content ${variant === 'auth' ? 'site-content-auth' : 'site-content-public'}`}>
          <Outlet />
        </div>
      </main>
      <SiteFooter variant="public" />
    </div>
  );
}

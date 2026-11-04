import AdminLayout from '@/layouts/AdminLayout';
import AuthLayout from '@/layouts/AuthLayout';
import PublicLayout from '@/layouts/PublicLayout';
import UserLayout from '@/layouts/UserLayout';
import {
    AdminAgendaScreen,
    AdminDashboardScreen,
    AdminApprovalsScreen,
    AdminLoginScreen,
} from '@/pages/admin/screens';
import { CadastroScreen, LoginScreen, SplashScreen } from '@/pages/auth/screens';
import HomePage from '@/pages/public/HomePage';
import HistoryPage from '@/pages/user/HistoryPage';
import ServicePage from '@/pages/user/ServicePage';
import {
    ArtesScreen,
    ConfiguracoesScreen,
    JoiasScreen,
    MeusAgendamentosScreen,
    NotificacoesScreen,
    NovoAgendamentoScreen,
    PerfilScreen,
    PiercingDataScreen,
    PiercingHorarioScreen,
    PiercingIndexScreen,
    PiercingJoiaScreen,
    PiercingLoadingScreen,
    PiercingLocalScreen,
    PiercingResumoScreen,
    PiercingSucessoScreen,
    TattooDataScreen,
    TattooEstiloScreen,
    TattooHorarioScreen,
    TattooIndexScreen,
    TattooLocalScreen,
    TattooResumoScreen,
    TattooSucessoScreen,
    TattooTamanhoScreen,
} from '@/pages/user/screens';
import { Route, Routes } from 'react-router-dom';
import { RedirectIfAuthenticated, RequireAdmin, RequireAuth } from './guards';

function MissingScreen({ name }: { name: string }) {
  return (
    <main className="web-message">
      <h1>{name}</h1>
      <p>Esta rota existe na navegação, mas ainda não possui uma tela no projeto.</p>
    </main>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/splash" element={<SplashScreen />} />

      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route element={<RedirectIfAuthenticated />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/cadastro" element={<CadastroScreen />} />
        </Route>
      </Route>

      <Route element={<RedirectIfAuthenticated only="admin" />}>
        <Route element={<AuthLayout />}>
          <Route path="/admin-login" element={<AdminLoginScreen />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<UserLayout />}>
          <Route path="/home" element={<ServicePage service="tattoo" />} />
          <Route path="/piercings" element={<ServicePage service="piercing" />} />
          <Route path="/historico" element={<HistoryPage />} />
          <Route path="/joias" element={<JoiasScreen />} />
          <Route path="/artes" element={<ArtesScreen />} />
          <Route path="/meus-agendamentos" element={<MeusAgendamentosScreen />} />
          <Route path="/notificacoes" element={<NotificacoesScreen />} />
          <Route path="/perfil" element={<PerfilScreen />} />
          <Route path="/configuracoes" element={<ConfiguracoesScreen />} />
          <Route path="/novo-agendamento" element={<NovoAgendamentoScreen />} />

          <Route path="/agendamento-piercing">
            <Route index element={<PiercingIndexScreen />} />
            <Route path="local" element={<PiercingLocalScreen />} />
            <Route path="joia" element={<PiercingJoiaScreen />} />
            <Route path="data" element={<PiercingDataScreen />} />
            <Route path="horario" element={<PiercingHorarioScreen />} />
            <Route path="resumo" element={<PiercingResumoScreen />} />
            <Route path="loading" element={<PiercingLoadingScreen />} />
            <Route path="sucesso" element={<PiercingSucessoScreen />} />
          </Route>

          <Route path="/agendamento-tatuagem">
            <Route index element={<TattooIndexScreen />} />
            <Route path="local" element={<TattooLocalScreen />} />
            <Route path="tamanho" element={<TattooTamanhoScreen />} />
            <Route path="estilo" element={<TattooEstiloScreen />} />
            <Route path="data" element={<TattooDataScreen />} />
            <Route path="horario" element={<TattooHorarioScreen />} />
            <Route path="resumo" element={<TattooResumoScreen />} />
            <Route path="sucesso" element={<TattooSucessoScreen />} />
          </Route>
        </Route>
      </Route>

      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardScreen />} />
          <Route path="aprovacoes" element={<AdminApprovalsScreen />} />
          <Route path="agenda" element={<AdminAgendaScreen />} />
        </Route>
      </Route>

      <Route path="*" element={<MissingScreen name="Página não encontrada" />} />
    </Routes>
  );
}

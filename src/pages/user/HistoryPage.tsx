import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HistoryPage() {
  return (
    <section className="history-page" aria-labelledby="history-title">
      <header className="internal-page-heading">
        <p className="eyebrow"><span /> Conta</p>
        <h1 id="history-title">Histórico</h1>
        <p>Consulte os dados dos seus agendamentos concluídos.</p>
      </header>

      <div className="history-empty" role="status">
        <CalendarDays size={25} aria-hidden="true" />
        <h2>Histórico indisponível</h2>
        <p>Esta área ainda não está conectada a uma fonte de histórico real.</p>
        <Link className="text-link" to="/meus-agendamentos">
          Ver meus agendamentos <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
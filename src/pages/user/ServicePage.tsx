import {
    ArrowRight,
    CalendarDays,
    Clock3,
    Gem,
    Palette,
    Ruler,
    ShieldCheck,
    Sparkles,
    type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';

type ServiceKind = 'tattoo' | 'piercing';

type ServiceStep = {
  title: string;
  detail: string;
  icon: LucideIcon;
};

const serviceContent: Record<ServiceKind, {
  number: string;
  label: string;
  title: string;
  description: string;
  route: string;
  icon: LucideIcon;
  steps: ServiceStep[];
}> = {
  tattoo: {
    number: '01',
    label: 'Tatuagem',
    title: 'Uma ideia, construída em etapas.',
    description: 'Escolha local, tamanho e estilo. Depois selecione uma data e um horário para revisar seu agendamento.',
    route: '/agendamento-tatuagem/local',
    icon: Palette,
    steps: [
      { title: 'Local', detail: 'Escolha a região do corpo.', icon: Ruler },
      { title: 'Tamanho e estilo', detail: 'Defina as opções do seu projeto.', icon: Sparkles },
      { title: 'Data e horário', detail: 'Selecione quando deseja agendar.', icon: CalendarDays },
    ],
  },
  piercing: {
    number: '02',
    label: 'Piercing',
    title: 'Escolha a perfuração e a joia.',
    description: 'Escolha o local, a posição e uma joia disponível. Confira data e horário antes de enviar o pedido.',
    route: '/agendamento-piercing/local',
    icon: Gem,
    steps: [
      { title: 'Local e posição', detail: 'Escolha a região e o tipo de perfuração.', icon: Gem },
      { title: 'Joia', detail: 'Selecione uma peça disponível no catálogo.', icon: ShieldCheck },
      { title: 'Data e horário', detail: 'Selecione quando deseja agendar.', icon: CalendarDays },
    ],
  },
};

export default function ServicePage({ service }: { service: ServiceKind }) {
  const content = serviceContent[service];
  const Icon = content.icon;

  return (
    <div className={`service-page service-page-${service}`}>
      <section className="service-hero">
        <div className="service-hero-copy">
          <p className="eyebrow"><span /> {content.number} / {content.label}</p>
          <h1>{content.title}</h1>
          <p className="service-lede">{content.description}</p>
          <div className="home-actions">
            <Link className="button button-primary" to={content.route}>
              Iniciar agendamento <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-quiet" to="/meus-agendamentos">
              Meus agendamentos
            </Link>
          </div>
        </div>

        <aside className="service-overview" aria-label={`Resumo do fluxo de ${content.label}`}>
          <div className="service-overview-icon"><Icon size={27} aria-hidden="true" /></div>
          <p className="service-overview-label">Fluxo de agendamento</p>
          <strong>5 etapas</strong>
          <p>Suas escolhas permanecem no resumo antes da confirmação.</p>
          <div className="service-overview-meta"><Clock3 size={16} aria-hidden="true" /> Data e horário escolhidos por você</div>
        </aside>
      </section>

      <section className="service-steps" aria-labelledby="service-steps-title">
        <div className="section-heading">
          <p className="eyebrow">Seu percurso</p>
          <h2 id="service-steps-title">Do detalhe à revisão final.</h2>
        </div>
        <div className="service-steps-grid">
          {content.steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <article className="service-step" key={step.title}>
                <span className="process-index">0{index + 1}</span>
                <StepIcon size={20} aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
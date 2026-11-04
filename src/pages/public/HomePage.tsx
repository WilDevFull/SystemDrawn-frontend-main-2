import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  CircleCheck,
  Gem,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import brandArtwork from '@/assets/images/splash.png';
import { useAuthStore } from '@/store/authstore';

export default function HomePage() {
  const isAuthenticated = useAuthStore((state) => Boolean(state.token));
  const schedulePath = isAuthenticated ? '/novo-agendamento' : '/login';

  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-inner">
          <div className="home-copy">
            <p className="eyebrow"><span /> Tattoo &amp; Piercing</p>
            <h1 id="home-title">System<span>Drawn</span></h1>
            <p className="home-lede">
              Sua próxima ideia começa com uma escolha. Organize os detalhes e encontre um horário para tatuagem ou piercing.
            </p>
            <div className="home-actions">
              <Link className="button button-primary" to={schedulePath}>
                Agendar horário <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a className="button button-quiet" href="#servicos">
                Explorar serviços <ArrowDown size={16} aria-hidden="true" />
              </a>
            </div>
            <p className="home-note">Tatuagem e piercing em etapas claras de agendamento.</p>
          </div>

          <figure className="home-artwork">
            <img
              src={brandArtwork}
              alt="Identidade visual SystemDrawn com referências a tatuagem e piercing"
              fetchPriority="high"
            />
            <figcaption><span>SD</span> Arte corporal · Agendamentos</figcaption>
          </figure>
        </div>
        <a className="hero-scroll" href="#servicos" aria-label="Ir para serviços">
          <span /> Role para explorar
        </a>
      </section>

      <section className="home-section services-section" id="servicos" aria-labelledby="services-title">
        <div className="section-heading">
          <p className="eyebrow">Escolha seu caminho</p>
          <h2 id="services-title">Do primeiro detalhe ao horário marcado.</h2>
          <p>Veja as etapas disponíveis e comece por onde sua ideia pede.</p>
        </div>

        <div className="service-grid">
          <article className="service-panel service-panel-tattoo" id="tatuagem">
            <div className="service-panel-top">
              <span className="service-number">01 / Tatuagem</span>
              <Sparkles size={22} aria-hidden="true" />
            </div>
            <h3>Uma ideia, construída em etapas.</h3>
            <p>Defina local, tamanho e estilo. Depois escolha data e horário para revisar seu agendamento.</p>
            <Link className="text-link" to={schedulePath}>
              Começar tatuagem <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>

          <article className="service-panel service-panel-piercing" id="piercing">
            <div className="service-panel-top">
              <span className="service-number">02 / Piercing</span>
              <Gem size={22} aria-hidden="true" />
            </div>
            <h3>Escolha a perfuração e a joia.</h3>
            <p>Selecione o local, a posição e a joia disponível antes de escolher data e horário.</p>
            <Link className="text-link" to={schedulePath}>
              Começar piercing <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>
        </div>
      </section>

      <section className="home-section process-section" id="como-funciona" aria-labelledby="process-title">
        <div className="section-heading section-heading-inline">
          <div>
            <p className="eyebrow">Como funciona</p>
            <h2 id="process-title">Você acompanha cada decisão.</h2>
          </div>
          <p>As escolhas ficam reunidas até a revisão final do agendamento.</p>
        </div>

        <ol className="process-list">
          <li>
            <span className="process-index">01</span>
            <CircleCheck size={20} aria-hidden="true" />
            <h3>Escolha o serviço</h3>
            <p>Comece por tatuagem ou piercing.</p>
          </li>
          <li>
            <span className="process-index">02</span>
            <Sparkles size={20} aria-hidden="true" />
            <h3>Defina os detalhes</h3>
            <p>Selecione as opções próprias de cada serviço.</p>
          </li>
          <li>
            <span className="process-index">03</span>
            <CalendarDays size={20} aria-hidden="true" />
            <h3>Escolha data e horário</h3>
            <p>Revise as informações antes de confirmar.</p>
          </li>
        </ol>
      </section>

      <section className="home-final-cta" aria-labelledby="final-cta-title">
        <div>
          <p className="eyebrow">SystemDrawn</p>
          <h2 id="final-cta-title">Sua próxima etapa começa aqui.</h2>
        </div>
        <Link className="button button-light" to={schedulePath}>
          Agendar horário <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
import type { Settings } from '@/lib/types';

export default function Hero({ settings, tagline }: { settings: Settings; tagline: string }) {
  return (
    <section className="hero" id="inicio">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__content reveal">
          <p className="eyebrow">Tatuagem autoral &middot; Hora marcada</p>
          <h1 className="hero__title">
            Sua história,
            <br />
            <span className="text-red">eternizada</span> na pele.
          </h1>
          <p className="hero__text">{settings.hero_texto}</p>
          <div className="hero__actions">
            <a href="#orcamento" className="btn btn--red">
              Pedir orçamento
            </a>
            <a href="#portfolio" className="btn btn--ghost">
              Ver trabalhos
            </a>
          </div>

          <ul className="hero__stats">
            <li>
              <strong data-count={settings.stat_anos} data-suffix="+">
                {settings.stat_anos}+
              </strong>
              <span>anos de estrada</span>
            </li>
            <li>
              <strong data-count={settings.stat_tattoos} data-suffix="+">
                {settings.stat_tattoos}+
              </strong>
              <span>tattoos feitas</span>
            </li>
            <li>
              <strong data-count={100} data-suffix="%">
                100%
              </strong>
              <span>material descartável</span>
            </li>
          </ul>
        </div>

        <div className="hero__art reveal" aria-hidden="true">
          <div className="frame">
            <svg
              viewBox="0 0 300 380"
              className="hero__svg"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path className="draw" d="M150 20 L168 200 L150 215 L132 200 Z" />
              <path className="draw" d="M150 20 L150 215" />
              <path className="draw" d="M100 215 H200" />
              <path className="draw" d="M108 215 Q150 240 192 215" />
              <path className="draw" d="M150 230 V310" />
              <circle className="draw" cx="150" cy="322" r="10" />
              <path className="draw" d="M150 330 C100 330 70 300 78 262 C86 228 126 226 140 248 C150 262 134 280 118 274" />
              <path className="draw" d="M150 330 C200 330 230 300 222 262 C214 228 174 226 160 248 C150 262 166 280 182 274" />
              <path className="draw" d="M96 340 Q150 372 204 340" />
              <circle className="draw" cx="60" cy="90" r="3" />
              <circle className="draw" cx="242" cy="130" r="3" />
              <circle className="draw" cx="250" cy="260" r="3" />
              <path className="draw" d="M40 150 l10 -10 l10 10 l-10 10 Z" />
              <path className="draw" d="M236 60 l8 -8 l8 8 l-8 8 Z" />
            </svg>
          </div>
          {tagline && <span className="hero__tag">{tagline}</span>}
        </div>
      </div>

      <a href="#sobre" className="scroll-hint" aria-label="Rolar para baixo">
        <span />
      </a>
    </section>
  );
}

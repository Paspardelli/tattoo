import type { Settings } from '@/lib/types';
import PortraitPlaceholder from './Portrait';

export default function Hero({ settings }: { settings: Settings }) {
  return (
    <section className="hero" id="inicio">
      <span className="hero__word" aria-hidden="true">
        Ink
      </span>

      <div className="container hero__inner">
        <div className="hero__content reveal">
          <p className="eyebrow">Tatuador{settings.cidade ? ` · ${settings.cidade}` : ''}</p>
          <h1 className="hero__title">
            Arte que fica
            <br />
            <span className="text-red">para sempre</span>
            <br />
            na sua pele.
          </h1>
          <p className="hero__text">{settings.hero_texto}</p>

          <div className="hero__actions">
            <a href="#orcamento" className="btn btn--red">
              Quero minha tattoo
            </a>
            <a href="#portfolio" className="btn btn--ghost">
              Ver trabalhos
            </a>
          </div>

          <ul className="hero__proof">
            <li>Desenho exclusivo</li>
            <li>Atendimento com hora marcada</li>
            <li>Material 100% descartável</li>
          </ul>
        </div>

        <div className="hero__media reveal">
          <div className="portrait">
            {settings.hero_foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.hero_foto_url} alt={`${settings.nome}, tatuador`} fetchPriority="high" />
            ) : (
              <PortraitPlaceholder />
            )}
          </div>

          <div className="chip chip--name">
            <strong>{settings.nome}</strong>
            <span>{settings.cidade ? `Tatuador · ${settings.cidade}` : 'Tatuador profissional'}</span>
          </div>
          <div className="chip chip--stat">
            <strong data-count={settings.stat_tattoos} data-suffix="+">
              {settings.stat_tattoos}+
            </strong>
            <span>tattoos feitas</span>
          </div>
        </div>
      </div>
    </section>
  );
}

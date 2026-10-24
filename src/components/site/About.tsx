import type { Settings } from '@/lib/types';
import PortraitPlaceholder from './Portrait';

export default function About({ settings }: { settings: Settings }) {
  const photo = settings.foto_url || settings.hero_foto_url;

  return (
    <section className="section" id="sobre">
      <div className="container about">
        <div className="about__media reveal">
          <div className="about__photo">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={`${settings.nome} no estúdio`} loading="lazy" />
            ) : (
              <PortraitPlaceholder />
            )}
          </div>
          <div className="about__badge">
            <strong>Desde</strong>
            <span>{settings.ano_inicio}</span>
          </div>
        </div>

        <div className="about__content reveal">
          <p className="eyebrow">Quem vai riscar você</p>
          <h2 className="section__title">
            Arte, técnica e <span className="text-red">respeito</span> pela sua ideia.
          </h2>
          {settings.sobre_texto1 && <p>{settings.sobre_texto1}</p>}
          {settings.sobre_texto2 && <p>{settings.sobre_texto2}</p>}

          <ul className="about__stats">
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

          <ul className="checks">
            <li>Desenho exclusivo, feito para você</li>
            <li>Esterilização completa e tintas certificadas</li>
            <li>Acompanhamento durante toda a cicatrização</li>
          </ul>

          <a href="#orcamento" className="btn btn--red">
            Agendar minha sessão
          </a>
        </div>
      </div>
    </section>
  );
}

import type { Settings } from '@/lib/types';

export default function About({ settings }: { settings: Settings }) {
  return (
    <section className="section" id="sobre">
      <div className="container about">
        <div className="about__media reveal">
          <div className="about__photo">
            {settings.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={settings.foto_url} alt={`Foto de ${settings.nome}`} loading="lazy" />
            ) : (
              <svg
                viewBox="0 0 200 240"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="100" cy="82" r="38" />
                <path d="M30 230 C30 168 68 146 100 146 C132 146 170 168 170 230" />
                <path d="M70 70 C76 46 124 46 130 70" />
                <path d="M82 100 C92 112 108 112 118 100" />
              </svg>
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

          <ul className="checks">
            <li>Desenho exclusivo, feito para você</li>
            <li>Materiais descartáveis e esterilização completa</li>
            <li>Tintas e agulhas de marcas certificadas</li>
            <li>Acompanhamento durante a cicatrização</li>
          </ul>

          <a href="#orcamento" className="btn btn--red">
            Quero minha tattoo
          </a>
        </div>
      </div>
    </section>
  );
}

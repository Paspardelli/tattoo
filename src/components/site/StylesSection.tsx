import { artSvg } from '@/lib/arts';
import type { StyleItem } from '@/lib/types';
import StyleCta from './StyleCta';

export default function StylesSection({ styles }: { styles: StyleItem[] }) {
  return (
    <section className="section section--alt" id="estilos">
      <div className="container">
        <header className="section__head reveal">
          <p className="eyebrow">Especialidades</p>
          <h2 className="section__title">
            Estilos que <span className="text-accent">eu faço</span>
          </h2>
          <p className="section__sub">Escolha um estilo ou me conte a sua ideia: eu adapto o traço ao que você quer.</p>
        </header>

        <div className="cards">
          {styles.map((style, index) => (
            <article className="card reveal" key={style.id}>
              <div className="card__media">
                <span className="card__num">{String(index + 1).padStart(2, '0')}</span>
                {style.imagem_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={style.imagem_url} alt={`Tatuagem no estilo ${style.nome}`} loading="lazy" />
                ) : (
                  // SVG fixo do nosso código (lib/arts.ts), não vem do banco
                  <div dangerouslySetInnerHTML={{ __html: artSvg(style.arte) }} style={{ display: 'contents' }} />
                )}
              </div>
              <div className="card__body">
                <h3>{style.nome}</h3>
                <p>{style.descricao}</p>
                <StyleCta nome={style.nome} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

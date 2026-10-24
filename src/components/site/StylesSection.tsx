import { artSvg } from '@/lib/arts';
import type { StyleItem } from '@/lib/types';

export default function StylesSection({ styles }: { styles: StyleItem[] }) {
  return (
    <section className="section section--alt" id="estilos">
      <div className="container">
        <header className="section__head reveal">
          <p className="eyebrow">Especialidades</p>
          <h2 className="section__title">
            Estilos que <span className="text-red">eu faço</span>
          </h2>
          <p className="section__sub">Não achou o seu? Me conta a ideia, eu adapto o traço ao que você quer.</p>
        </header>

        <div className="cards">
          {styles.map((style, index) => (
            <article className="card reveal" key={style.id}>
              <span className="card__num">{String(index + 1).padStart(2, '0')}</span>
              {/* SVG fixo do nosso código (lib/arts.ts), não vem do banco */}
              <div className="card__icon" dangerouslySetInnerHTML={{ __html: artSvg(style.arte) }} />
              <h3>{style.nome}</h3>
              <p>{style.descricao}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

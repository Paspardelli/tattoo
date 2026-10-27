import type { Testimonial } from '@/lib/types';

export default function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section className="section section--light" id="depoimentos">
      <div className="container">
        <header className="section__head reveal">
          <p className="eyebrow">Quem já tatuou</p>
          <h2 className="section__title">
            O que dizem os <span className="text-accent">clientes</span>
          </h2>
        </header>

        <div className="testimonials">
          {items.map((item) => (
            <blockquote className="quote reveal" key={item.id}>
              <div className="stars" aria-label="5 estrelas">
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </div>
              <p>{item.texto}</p>
              <footer>
                <strong>{item.nome}</strong>
                {item.estilo ? <> &middot; {item.estilo}</> : null}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

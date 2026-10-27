'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { artSvg } from '@/lib/arts';
import type { WorkItem } from '@/lib/types';

function WorkMedia({ work, className }: { work: WorkItem; className: string }) {
  if (work.imagem_url) {
    return (
      <div className={`${className} work__media--img`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={work.imagem_url} alt={`${work.titulo} - tatuagem ${work.categoria}`} loading="lazy" />
      </div>
    );
  }
  // SVG fixo do nosso código (lib/arts.ts), não vem do banco
  return <div className={className} dangerouslySetInnerHTML={{ __html: artSvg(work.arte) }} />;
}

export default function Portfolio({ works, instagramUrl }: { works: WorkItem[]; instagramUrl: string }) {
  const [filter, setFilter] = useState('Todos');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(works.map((work) => work.categoria).filter(Boolean)));
    return ['Todos', ...unique];
  }, [works]);

  const visible = useMemo(
    () => works.filter((work) => filter === 'Todos' || work.categoria === filter),
    [works, filter],
  );

  const close = useCallback(() => setOpenIndex(null), []);
  const move = useCallback(
    (delta: number) => {
      setOpenIndex((current) => (current === null || visible.length === 0 ? null : (current + delta + visible.length) % visible.length));
    },
    [visible.length],
  );

  // teclado + trava de rolagem enquanto o lightbox está aberto
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIndex, close, move]);

  const current = openIndex !== null ? visible[openIndex] : undefined;

  return (
    <section className="section section--light" id="portfolio">
      <div className="container">
        <header className="section__head reveal">
          <p className="eyebrow">Portfólio</p>
          <h2 className="section__title">
            Artes que <span className="text-accent">falam por mim</span>
          </h2>
          <p className="section__sub">Toque em uma arte para ampliar. Todas as peças são autorais.</p>
        </header>

        {categories.length > 2 && (
          <div className="filters reveal" role="tablist" aria-label="Filtrar por estilo">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={category === filter}
                className={`filter${category === filter ? ' is-active' : ''}`}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="gallery">
          {visible.map((work, index) => (
            <button
              key={work.id}
              type="button"
              className={`work work--${work.formato}`}
              style={{ animationDelay: `${index * 70}ms` }}
              aria-label={`Ampliar ${work.titulo}`}
              onClick={() => setOpenIndex(index)}
            >
              <WorkMedia work={work} className="work__media" />
              <div className="work__info">
                <strong>{work.titulo}</strong>
                <span>{work.categoria}</span>
              </div>
            </button>
          ))}
        </div>

        <p className="center reveal">
          <a href={instagramUrl} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
            Ver mais no Instagram
          </a>
        </p>
      </div>

      {current && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Visualização da arte"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <button type="button" className="lightbox__close" aria-label="Fechar" onClick={close}>
            &times;
          </button>
          <button type="button" className="lightbox__nav lightbox__nav--prev" aria-label="Anterior" onClick={() => move(-1)}>
            &#8249;
          </button>
          <figure className="lightbox__figure">
            <WorkMedia work={current} className="lightbox__media" />
            <figcaption>
              {current.titulo}
              <span>{current.categoria}</span>
            </figcaption>
          </figure>
          <button type="button" className="lightbox__nav lightbox__nav--next" aria-label="Próxima" onClick={() => move(1)}>
            &#8250;
          </button>
        </div>
      )}
    </section>
  );
}

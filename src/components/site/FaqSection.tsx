'use client';

import { useRef, useState } from 'react';
import type { Faq } from '@/lib/types';

export default function FaqSection({ items }: { items: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const answers = useRef<Record<string, HTMLDivElement | null>>({});

  return (
    <section className="section" id="faq">
      <div className="container container--narrow">
        <header className="section__head reveal">
          <p className="eyebrow">Tire suas dúvidas</p>
          <h2 className="section__title">
            Perguntas <span className="text-red">frequentes</span>
          </h2>
        </header>

        <div className="faq">
          {items.map((item) => {
            const isOpen = openId === item.id;
            const height = isOpen ? (answers.current[item.id]?.scrollHeight ?? 400) : 0;
            return (
              <div className={`faq__item${isOpen ? ' is-open' : ''}`} key={item.id}>
                <button
                  type="button"
                  className="faq__q"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                >
                  {item.pergunta}
                  <span className="faq__icon" aria-hidden="true" />
                </button>
                <div
                  className="faq__a"
                  style={{ maxHeight: height }}
                  ref={(el) => {
                    answers.current[item.id] = el;
                  }}
                >
                  <p>{item.resposta}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

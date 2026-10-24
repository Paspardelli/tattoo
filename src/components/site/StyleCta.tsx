'use client';

// Leva o cliente ao formulário já com o estilo escolhido
export default function StyleCta({ nome }: { nome: string }) {
  return (
    <a
      href="#orcamento"
      className="card__cta"
      onClick={() => window.dispatchEvent(new CustomEvent('select-style', { detail: nome }))}
    >
      Quero este estilo <span aria-hidden="true">→</span>
    </a>
  );
}

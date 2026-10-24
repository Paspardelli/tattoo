'use client';

import { useEffect, useState } from 'react';

export type NavLink = { href: string; label: string };

export default function Header({ nome, links }: { nome: string; links: NavLink[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // trava a rolagem da página enquanto o menu do celular está aberto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}`} id="header">
      <div className="container header__inner">
        <a href="#inicio" className="logo" aria-label="Ir para o início">
          <span className="logo__mark">&#10022;</span>
          <span className="logo__text">{nome}</span>
        </a>

        <nav className={`nav${open ? ' is-open' : ''}`} id="nav" aria-label="Menu principal">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#orcamento" className="btn btn--small btn--red nav__cta" onClick={() => setOpen(false)}>
            Orçamento
          </a>
        </nav>

        <button
          type="button"
          className={`burger${open ? ' is-open' : ''}`}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

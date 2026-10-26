'use client';

import { useEffect, useRef, useState } from 'react';

export type NavLink = { href: string; label: string };

type Props = {
  nome: string;
  links: NavLink[];
  whatsappUrl: string;
  instagramUrl: string;
  horario?: string;
};

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Header({ nome, links, whatsappUrl, instagramUrl, horario }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const bar = useRef<HTMLDivElement>(null);

  // fundo do header ao rolar + barra de progresso de leitura
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      if (y < 120) setActive('');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // destaca no menu a seção que está na tela
  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0 || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [links]);

  // menu mobile: trava a rolagem, fecha com Esc e ao voltar para tela grande
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const media = window.matchMedia('(min-width: 1001px)');
    const onChange = () => {
      if (media.matches) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    media.addEventListener('change', onChange);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      media.removeEventListener('change', onChange);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`header${scrolled ? ' is-scrolled' : ''}${open ? ' is-menu-open' : ''}`} id="header">
      <div className="header__progress" ref={bar} aria-hidden="true" />

      <div className="container header__inner">
        <a href="#inicio" className="logo" aria-label={`${nome} - ir para o início`} onClick={close}>
          <span className="logo__mark">&#10022;</span>
          <span className="logo__text">{nome}</span>
        </a>

        <nav className="nav" aria-label="Menu principal">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={active === link.href.slice(1) ? 'is-active' : undefined}
              aria-current={active === link.href.slice(1) ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <a href={instagramUrl} className="icon-btn" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href="#orcamento" className="btn btn--red btn--small header__cta">
            Orçamento
          </a>
          <button
            type="button"
            className={`burger${open ? ' is-open' : ''}`}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Menu do celular (tela cheia) */}
      <div className={`menu${open ? ' is-open' : ''}`} id="menu" aria-hidden={!open}>
        <nav className="menu__nav" aria-label="Menu mobile">
          {links.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={active === link.href.slice(1) ? 'is-active' : undefined}
              style={{ transitionDelay: open ? `${120 + index * 55}ms` : '0ms' }}
              onClick={close}
            >
              <small>{String(index + 1).padStart(2, '0')}</small>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="menu__foot">
          <a href="#orcamento" className="btn btn--red btn--block" onClick={close}>
            Pedir orçamento
          </a>
          <div className="menu__contacts">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </div>
          {horario && <p className="menu__hours">{horario}</p>}
        </div>
      </div>
    </header>
  );
}

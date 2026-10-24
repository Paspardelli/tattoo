import type { ReactNode } from 'react';
import './site.css';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Sem JavaScript o conteúdo continua visível */}
      <noscript>
        <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
      </noscript>
      {children}
    </>
  );
}

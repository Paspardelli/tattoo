import type { ReactNode } from 'react';

// Estilos compartilhados do painel (text-base evita o zoom automático do iPhone nos campos)
export const inputClass =
  'w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-base text-neutral-100 placeholder:text-neutral-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30';

export const btnPrimary =
  'inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-50';

export const btnGhost =
  'inline-flex items-center justify-center rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-200 transition hover:border-neutral-500 hover:text-white disabled:opacity-40';

export const btnDanger =
  'inline-flex items-center justify-center rounded-lg border border-red-900 px-3 py-2 text-sm text-red-400 transition hover:bg-red-950 disabled:opacity-40';

export function Field({ label, help, children }: { label: string; help?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400">{label}</span>
      {children}
      {help && <span className="mt-1 block text-xs text-neutral-500">{help}</span>}
    </label>
  );
}

export function Notice({ kind = 'info', children }: { kind?: 'info' | 'error' | 'success'; children: ReactNode }) {
  const styles = {
    info: 'border-neutral-700 bg-neutral-900 text-neutral-300',
    error: 'border-red-900 bg-red-950/60 text-red-300',
    success: 'border-emerald-900 bg-emerald-950/60 text-emerald-300',
  }[kind];
  return <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}

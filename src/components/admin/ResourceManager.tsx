'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { revalidateSite } from '@/app/(admin)/admin/actions';
import { createClient } from '@/lib/supabase/client';
import FormFields, { type FieldDef, type Values } from './FormFields';
import { Notice, btnDanger, btnGhost, btnPrimary } from './ui';

type Row = {
  id: string;
  ordem: number;
  visivel: boolean;
  [key: string]: unknown;
};

type Props = {
  table: 'styles' | 'works' | 'testimonials' | 'faqs';
  title: string;
  intro: string;
  addLabel: string;
  fields: FieldDef[];
  /** campo mostrado como título de cada item da lista */
  titleKey: string;
  /** campo mostrado abaixo do título (opcional) */
  subtitleKey?: string;
  /** campo com a URL da foto, mostrada em miniatura (opcional) */
  imageKey?: string;
  /** valores iniciais ao criar um item novo */
  blank: Values;
  imageFolder?: string;
};

/**
 * Lista editável genérica (adicionar, editar, excluir, ordenar, ocultar).
 * Serve para Portfólio, Estilos, Depoimentos e FAQ: só muda a configuração recebida.
 */
export default function ResourceManager({
  table,
  title,
  intro,
  addLabel,
  fields,
  titleKey,
  subtitleKey,
  imageKey,
  blank,
  imageFolder,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Values | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data, error: loadError } = await supabase.from(table).select('*').order('ordem', { ascending: true });
    if (loadError) setError(loadError.message);
    else setRows((data ?? []) as Row[]);
    setLoading(false);
  }, [supabase, table]);

  useEffect(() => {
    void load();
  }, [load]);

  async function afterChange() {
    await load();
    await revalidateSite(); // o site público mostra a mudança na hora
  }

  function openNew() {
    setError('');
    setEditingId(null);
    setForm({ ...blank });
  }

  function openEdit(row: Row) {
    setError('');
    setEditingId(row.id);
    setForm({ ...row });
  }

  function closeForm() {
    setForm(null);
    setEditingId(null);
    setError('');
  }

  async function save() {
    if (!form) return;

    for (const field of fields) {
      if (field.required && !String(form[field.key] ?? '').trim()) {
        setError(`Preencha o campo "${field.label}".`);
        return;
      }
    }

    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const value = form[field.key];
      if (field.type === 'number') payload[field.key] = Number(value) || 0;
      else if (field.type === 'image') payload[field.key] = value ? String(value) : null;
      else payload[field.key] = String(value ?? '').trim();
    }

    setSaving(true);
    setError('');

    const nextOrder = rows.reduce((max, row) => Math.max(max, row.ordem), 0) + 1;
    const result = editingId
      ? await supabase.from(table).update(payload).eq('id', editingId)
      : await supabase.from(table).insert({ ...payload, ordem: nextOrder, visivel: true });

    setSaving(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }

    closeForm();
    await afterChange();
  }

  async function remove(row: Row) {
    const name = String(row[titleKey] ?? 'este item');
    if (!window.confirm(`Excluir "${name}"? Isso não pode ser desfeito.`)) return;
    const { error: deleteError } = await supabase.from(table).delete().eq('id', row.id);
    if (deleteError) setError(deleteError.message);
    else await afterChange();
  }

  async function toggleVisible(row: Row) {
    const { error: updateError } = await supabase.from(table).update({ visivel: !row.visivel }).eq('id', row.id);
    if (updateError) setError(updateError.message);
    else await afterChange();
  }

  async function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;

    const reordered = [...rows];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    // renumera 1..n e grava só o que mudou
    const changes = reordered
      .map((row, position) => ({ row, ordem: position + 1 }))
      .filter(({ row, ordem }) => row.ordem !== ordem);

    const results = await Promise.all(
      changes.map(({ row, ordem }) => supabase.from(table).update({ ordem }).eq('id', row.id)),
    );
    const failed = results.find((result) => result.error);
    if (failed?.error) setError(failed.error.message);
    await afterChange();
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-1 max-w-xl text-sm text-neutral-400">{intro}</p>
        </div>
        {!form && (
          <button type="button" className={btnPrimary} onClick={openNew}>
            + {addLabel}
          </button>
        )}
      </div>

      {error && <Notice kind="error">{error}</Notice>}

      {form && (
        <div className="space-y-4 rounded-xl border border-neutral-700 bg-neutral-900/60 p-4">
          <h3 className="font-semibold">{editingId ? 'Editar' : 'Novo item'}</h3>
          <FormFields
            fields={fields}
            values={form}
            imageFolder={imageFolder}
            onChange={(key, value) => setForm((previous) => ({ ...(previous ?? {}), [key]: value }))}
          />
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnPrimary} onClick={() => void save()} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
            <button type="button" className={btnGhost} onClick={closeForm} disabled={saving}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando...</p>
      ) : rows.length === 0 ? (
        <Notice>Nada cadastrado ainda. Toque em &quot;{addLabel}&quot; para começar.</Notice>
      ) : (
        <ul className="space-y-3">
          {rows.map((row, index) => {
            const image = imageKey ? String(row[imageKey] ?? '') : '';
            const subtitle = subtitleKey ? String(row[subtitleKey] ?? '') : '';
            return (
              <li
                key={row.id}
                className={`rounded-xl border bg-neutral-900/60 p-3 ${row.visivel ? 'border-neutral-800' : 'border-neutral-800 opacity-60'}`}
              >
                <div className="flex gap-3">
                  {imageKey && (
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
                      {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-neutral-600">sem foto</div>
                      )}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {String(row[titleKey] ?? '')}
                      {!row.visivel && <span className="ml-2 text-xs font-normal text-neutral-500">(oculto no site)</span>}
                    </p>
                    {subtitle && <p className="mt-0.5 line-clamp-2 text-sm text-neutral-400">{subtitle}</p>}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className={btnGhost} onClick={() => void move(index, -1)} disabled={index === 0} aria-label="Subir">
                    ↑
                  </button>
                  <button
                    type="button"
                    className={btnGhost}
                    onClick={() => void move(index, 1)}
                    disabled={index === rows.length - 1}
                    aria-label="Descer"
                  >
                    ↓
                  </button>
                  <button type="button" className={btnGhost} onClick={() => openEdit(row)}>
                    Editar
                  </button>
                  <button type="button" className={btnGhost} onClick={() => void toggleVisible(row)}>
                    {row.visivel ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <button type="button" className={btnDanger} onClick={() => void remove(row)}>
                    Excluir
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

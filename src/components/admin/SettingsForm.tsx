'use client';

import { useEffect, useMemo, useState } from 'react';
import { revalidateSite } from '@/app/(admin)/admin/actions';
import { DEFAULT_SETTINGS } from '@/lib/defaults';
import { createClient } from '@/lib/supabase/client';
import FormFields, { type FieldDef, type Values } from './FormFields';
import { Notice, btnPrimary } from './ui';

const FIELDS: FieldDef[] = [
  { key: 'nome', label: 'Nome do estúdio / tatuador', type: 'text', required: true },
  { key: 'cidade', label: 'Cidade', type: 'text', placeholder: 'Ex.: Santa Bárbara d’Oeste - SP', help: 'Aparece no título do Google.' },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    type: 'text',
    required: true,
    placeholder: '(19) 99999-9999',
    help: 'Pode digitar com parênteses e traço. Os pedidos de orçamento chegam neste número.',
  },
  { key: 'instagram', label: 'Instagram (sem o @)', type: 'text', placeholder: 'seuinstagram' },
  { key: 'endereco', label: 'Endereço', type: 'text' },
  { key: 'horario', label: 'Horário de atendimento', type: 'text', placeholder: 'Seg a Sáb, 10h às 19h' },
  { key: 'hero_foto_url', label: 'Foto do tatuador (topo do site)', type: 'image', help: 'Vertical (retrato), de preferência com fundo escuro. É a primeira coisa que o cliente vê.' },
  { key: 'foto_url', label: 'Foto do tatuador (seção Sobre)', type: 'image', help: 'Outra foto dele tatuando ou no estúdio.' },
  { key: 'ano_inicio', label: 'Tatuando desde (ano)', type: 'text', placeholder: '2018' },
  { key: 'stat_anos', label: 'Anos de experiência', type: 'number' },
  { key: 'stat_tattoos', label: 'Tatuagens feitas', type: 'number' },
  { key: 'hero_texto', label: 'Texto de abertura (topo do site)', type: 'textarea' },
  { key: 'sobre_texto1', label: 'Sobre mim - parágrafo 1', type: 'textarea' },
  { key: 'sobre_texto2', label: 'Sobre mim - parágrafo 2', type: 'textarea' },
  { key: 'mensagem_padrao', label: 'Mensagem do botão de WhatsApp', type: 'textarea', help: 'Texto que já vem escrito quando o cliente toca no botão do WhatsApp.' },
];

export default function SettingsForm() {
  const supabase = useMemo(() => createClient(), []);
  const [values, setValues] = useState<Values>({ ...DEFAULT_SETTINGS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error: loadError } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
      if (loadError) setError(loadError.message);
      else if (data) setValues((previous) => ({ ...previous, ...(data as Values) }));
      setLoading(false);
    })();
  }, [supabase]);

  async function save() {
    for (const field of FIELDS) {
      if (field.required && !String(values[field.key] ?? '').trim()) {
        setError(`Preencha o campo "${field.label}".`);
        return;
      }
    }

    const payload: Record<string, unknown> = { id: 1 };
    for (const field of FIELDS) {
      const value = values[field.key];
      if (field.type === 'number') payload[field.key] = Number(value) || 0;
      else if (field.type === 'image') payload[field.key] = value ? String(value) : null;
      else payload[field.key] = String(value ?? '').trim();
    }

    setSaving(true);
    setError('');
    setSaved(false);
    const { error: saveError } = await supabase.from('settings').upsert(payload);
    setSaving(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }
    setSaved(true);
    await revalidateSite();
  }

  if (loading) return <p className="text-sm text-neutral-500">Carregando...</p>;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Configurações</h2>
        <p className="mt-1 max-w-xl text-sm text-neutral-400">
          Dados de contato e textos principais do site. O que você salvar aqui aparece no site em segundos.
        </p>
      </div>

      {error && <Notice kind="error">{error}</Notice>}
      {saved && <Notice kind="success">Salvo! O site já está atualizado.</Notice>}

      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
        <FormFields
          fields={FIELDS}
          values={values}
          imageFolder="tatuador"
          onChange={(key, value) => {
            setSaved(false);
            setValues((previous) => ({ ...previous, [key]: value }));
          }}
        />
      </div>

      <button type="button" className={btnPrimary} onClick={() => void save()} disabled={saving}>
        {saving ? 'Salvando...' : 'Salvar configurações'}
      </button>
    </section>
  );
}

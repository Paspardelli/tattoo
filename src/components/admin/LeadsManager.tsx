'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { whatsappLink } from '@/lib/utils';
import { Notice, btnDanger, btnGhost } from './ui';

type Lead = {
  id: string;
  created_at: string;
  nome: string;
  telefone: string | null;
  estilo: string | null;
  local: string | null;
  tamanho: string | null;
  tipo: string | null;
  ideia: string;
  tratado: boolean;
};

export default function LeadsManager() {
  const supabase = useMemo(() => createClient(), []);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (loadError) setError(loadError.message);
    else setLeads((data ?? []) as Lead[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggleDone(lead: Lead) {
    const { error: updateError } = await supabase.from('leads').update({ tratado: !lead.tratado }).eq('id', lead.id);
    if (updateError) setError(updateError.message);
    else await load();
  }

  async function remove(lead: Lead) {
    if (!window.confirm(`Excluir o pedido de ${lead.nome}?`)) return;
    const { error: deleteError } = await supabase.from('leads').delete().eq('id', lead.id);
    if (deleteError) setError(deleteError.message);
    else await load();
  }

  const pending = leads.filter((lead) => !lead.tratado).length;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">Orçamentos</h2>
        <p className="mt-1 max-w-xl text-sm text-neutral-400">
          Pedidos enviados pelo formulário do site. {pending > 0 ? `${pending} aguardando resposta.` : 'Tudo respondido.'}
        </p>
      </div>

      {error && <Notice kind="error">{error}</Notice>}

      {loading ? (
        <p className="text-sm text-neutral-500">Carregando...</p>
      ) : leads.length === 0 ? (
        <Notice>Nenhum pedido ainda. Quando alguém preencher o formulário do site, aparece aqui.</Notice>
      ) : (
        <ul className="space-y-3">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className={`space-y-2 rounded-xl border bg-neutral-900/60 p-4 ${lead.tratado ? 'border-neutral-800 opacity-60' : 'border-brand/50'}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">{lead.nome}</p>
                <p className="text-xs text-neutral-500">{new Date(lead.created_at).toLocaleString('pt-BR')}</p>
              </div>
              <p className="text-sm text-neutral-300">
                {[lead.estilo, lead.local, lead.tamanho, lead.tipo].filter(Boolean).join(' · ')}
              </p>
              <p className="whitespace-pre-wrap text-sm text-neutral-400">{lead.ideia}</p>

              <div className="flex flex-wrap gap-2 pt-1">
                {lead.telefone && (
                  <a
                    className={btnGhost}
                    href={whatsappLink(lead.telefone, `Olá ${lead.nome}! Recebi seu pedido de orçamento pelo site.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chamar no WhatsApp
                  </a>
                )}
                <button type="button" className={btnGhost} onClick={() => void toggleDone(lead)}>
                  {lead.tratado ? 'Marcar como pendente' : 'Marcar como respondido'}
                </button>
                <button type="button" className={btnDanger} onClick={() => void remove(lead)}>
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import { ARTE_OPTIONS } from '@/lib/arts';
import { createClient } from '@/lib/supabase/client';
import type { FieldDef } from './FormFields';
import LeadsManager from './LeadsManager';
import ResourceManager from './ResourceManager';
import SettingsForm from './SettingsForm';
import { btnGhost } from './ui';

type TabId = 'orcamentos' | 'portfolio' | 'estilos' | 'depoimentos' | 'faq' | 'config';

const TABS: { id: TabId; label: string }[] = [
  { id: 'orcamentos', label: 'Orçamentos' },
  { id: 'portfolio', label: 'Portfólio' },
  { id: 'estilos', label: 'Estilos' },
  { id: 'depoimentos', label: 'Depoimentos' },
  { id: 'faq', label: 'Dúvidas' },
  { id: 'config', label: 'Configurações' },
];

// ---- Campos de cada lista (para adicionar um campo novo, basta incluir aqui e na tabela do banco) ----

const WORK_FIELDS: FieldDef[] = [
  { key: 'imagem_url', label: 'Foto da tatuagem', type: 'image', help: 'Sem foto, o site mostra uma ilustração no lugar.' },
  { key: 'titulo', label: 'Título', type: 'text', required: true, placeholder: 'Ex.: Leão realista no braço' },
  { key: 'categoria', label: 'Estilo', type: 'text', placeholder: 'Ex.: Realismo', help: 'Serve de filtro no portfólio. Use sempre o mesmo nome.' },
  {
    key: 'formato',
    label: 'Formato da foto',
    type: 'select',
    options: [
      { value: 'square', label: 'Quadrada' },
      { value: 'tall', label: 'Vertical' },
      { value: 'wide', label: 'Horizontal' },
    ],
  },
  {
    key: 'arte',
    label: 'Ilustração (usada quando não há foto)',
    type: 'select',
    options: ARTE_OPTIONS,
  },
];

const STYLE_FIELDS: FieldDef[] = [
  { key: 'imagem_url', label: 'Foto do estilo (opcional)', type: 'image', help: 'Uma tattoo que represente o estilo. Sem foto, aparece o ícone.' },
  { key: 'nome', label: 'Nome do estilo', type: 'text', required: true, placeholder: 'Ex.: Blackwork' },
  { key: 'descricao', label: 'Descrição', type: 'textarea' },
  { key: 'arte', label: 'Ícone', type: 'select', options: ARTE_OPTIONS },
];

const TESTIMONIAL_FIELDS: FieldDef[] = [
  { key: 'nome', label: 'Nome do cliente', type: 'text', required: true, placeholder: 'Ex.: Rafael M.' },
  { key: 'estilo', label: 'Tatuagem feita', type: 'text', placeholder: 'Ex.: Blackwork' },
  { key: 'texto', label: 'Depoimento', type: 'textarea', required: true },
];

const FAQ_FIELDS: FieldDef[] = [
  { key: 'pergunta', label: 'Pergunta', type: 'text', required: true },
  { key: 'resposta', label: 'Resposta', type: 'textarea', required: true },
];

export default function AdminPanel() {
  const supabase = useMemo(() => createClient(), []);
  const [tab, setTab] = useState<TabId>('portfolio');
  const [email, setEmail] = useState('');

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ''));
  }, [supabase]);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24">
      <header className="sticky top-0 z-10 -mx-4 border-b border-neutral-800 bg-neutral-950/95 px-4 pb-3 pt-4 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-bold">
              <span className="text-brand">&#10022;</span> Painel do site
            </p>
            {email && <p className="truncate text-xs text-neutral-500">{email}</p>}
          </div>
          <div className="flex shrink-0 gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer" className={btnGhost}>
              Ver site
            </a>
            <button type="button" className={btnGhost} onClick={() => void signOut()}>
              Sair
            </button>
          </div>
        </div>

        <nav className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1" aria-label="Seções do painel">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                tab === item.id
                  ? 'border-brand bg-brand text-white'
                  : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="pt-6">
        {tab === 'orcamentos' && <LeadsManager />}

        {tab === 'portfolio' && (
          <ResourceManager
            table="works"
            title="Portfólio"
            intro="Suas tatuagens aparecem na galeria do site, com filtro por estilo. Use as setas para mudar a ordem."
            addLabel="Adicionar trabalho"
            fields={WORK_FIELDS}
            titleKey="titulo"
            subtitleKey="categoria"
            imageKey="imagem_url"
            imageFolder="trabalhos"
            blank={{ titulo: '', categoria: '', formato: 'square', arte: 'adaga', imagem_url: '' }}
          />
        )}

        {tab === 'estilos' && (
          <ResourceManager
            table="styles"
            title="Estilos"
            intro="Os cards de “Estilos que eu faço”. Os nomes também aparecem no formulário de orçamento."
            addLabel="Adicionar estilo"
            fields={STYLE_FIELDS}
            titleKey="nome"
            subtitleKey="descricao"
            imageKey="imagem_url"
            imageFolder="estilos"
            blank={{ nome: '', descricao: '', arte: 'adaga', imagem_url: '' }}
          />
        )}

        {tab === 'depoimentos' && (
          <ResourceManager
            table="testimonials"
            title="Depoimentos"
            intro="O que os clientes dizem. Use só depoimentos reais."
            addLabel="Adicionar depoimento"
            fields={TESTIMONIAL_FIELDS}
            titleKey="nome"
            subtitleKey="texto"
            blank={{ nome: '', estilo: '', texto: '' }}
          />
        )}

        {tab === 'faq' && (
          <ResourceManager
            table="faqs"
            title="Perguntas frequentes"
            intro="Dúvidas comuns dos clientes: valores, sinal, cicatrização, cobertura."
            addLabel="Adicionar pergunta"
            fields={FAQ_FIELDS}
            titleKey="pergunta"
            subtitleKey="resposta"
            blank={{ pergunta: '', resposta: '' }}
          />
        )}

        {tab === 'config' && <SettingsForm />}
      </div>
    </div>
  );
}

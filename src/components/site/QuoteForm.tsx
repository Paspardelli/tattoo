'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { createClient, hasSupabase } from '@/lib/supabase/client';
import { whatsappLink } from '@/lib/utils';

type Values = {
  nome: string;
  telefone: string;
  estilo: string;
  local: string;
  tamanho: string;
  tipo: string;
  ideia: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { nome: '', telefone: '', estilo: '', local: '', tamanho: '', tipo: 'Não, pele virgem', ideia: '' };
const REQUIRED: (keyof Values)[] = ['nome', 'estilo', 'local', 'tamanho', 'ideia'];

const LOCAIS = ['Braço', 'Antebraço', 'Ombro', 'Costas', 'Peito', 'Costelas', 'Perna', 'Panturrilha', 'Pé', 'Mão', 'Pescoço', 'Outro'];
const TAMANHOS = ['Pequeno (até 8 cm)', 'Médio (8 a 15 cm)', 'Grande (15 a 30 cm)', 'Fechamento / projeto grande'];
const TIPOS = ['Não, pele virgem', 'Sim, cobertura', 'Retoque'];

export default function QuoteForm({ estilos, whatsapp }: { estilos: string[]; whatsapp: string }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});

  // "Quero este estilo" (cards) preenche o campo Estilo
  useEffect(() => {
    const onSelect = (event: Event) => {
      const nome = (event as CustomEvent<string>).detail;
      if (typeof nome === 'string') setValues((previous) => ({ ...previous, estilo: nome }));
    };
    window.addEventListener('select-style', onSelect);
    return () => window.removeEventListener('select-style', onSelect);
  }, []);

  function update(key: keyof Values, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
    if (errors[key]) setErrors((previous) => ({ ...previous, [key]: undefined }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const next: Errors = {};
    REQUIRED.forEach((key) => {
      if (!values[key].trim()) next[key] = 'Preencha este campo.';
    });
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const message = [
      'Olá! Vim pelo site e quero fazer um orçamento. 🖤',
      '',
      `*Nome:* ${values.nome.trim()}`,
      `*Estilo:* ${values.estilo}`,
      `*Local do corpo:* ${values.local}`,
      `*Tamanho:* ${values.tamanho}`,
      `*Tipo:* ${values.tipo}`,
      '',
      '*Minha ideia:*',
      values.ideia.trim(),
    ].join('\n');

    // Abre o WhatsApp primeiro e direto no toque: no iPhone o navegador bloqueia se vier depois de um "await".
    window.open(whatsappLink(whatsapp, message), '_blank', 'noopener');

    // Guarda o pedido no painel (sem travar nem avisar o cliente se falhar).
    if (hasSupabase()) {
      void createClient()
        .from('leads')
        .insert({
          nome: values.nome.trim(),
          telefone: values.telefone.trim() || null,
          estilo: values.estilo,
          local: values.local,
          tamanho: values.tamanho,
          tipo: values.tipo,
          ideia: values.ideia.trim().slice(0, 2000),
        })
        .then(
          () => undefined,
          () => undefined,
        );
    }
  }

  const fieldClass = (key: keyof Values) => `field${errors[key] ? ' has-error' : ''}`;

  return (
    <form className="form reveal" onSubmit={onSubmit} noValidate>
      <div className={fieldClass('nome')}>
        <label htmlFor="fNome">Seu nome</label>
        <input
          id="fNome"
          type="text"
          placeholder="Como posso te chamar?"
          autoComplete="name"
          maxLength={120}
          value={values.nome}
          onChange={(event) => update('nome', event.target.value)}
        />
        <small className="error" aria-live="polite">
          {errors.nome}
        </small>
      </div>

      <div className="field">
        <label htmlFor="fTelefone">Seu WhatsApp (opcional)</label>
        <input
          id="fTelefone"
          type="tel"
          inputMode="tel"
          placeholder="(00) 00000-0000"
          autoComplete="tel"
          maxLength={40}
          value={values.telefone}
          onChange={(event) => update('telefone', event.target.value)}
        />
      </div>

      <div className="field-row">
        <div className={fieldClass('estilo')}>
          <label htmlFor="fEstilo">Estilo</label>
          <select id="fEstilo" value={values.estilo} onChange={(event) => update('estilo', event.target.value)}>
            <option value="">Selecione</option>
            {estilos.map((estilo) => (
              <option key={estilo}>{estilo}</option>
            ))}
            <option>Ainda não sei</option>
          </select>
          <small className="error" aria-live="polite">
            {errors.estilo}
          </small>
        </div>
        <div className={fieldClass('local')}>
          <label htmlFor="fLocal">Local do corpo</label>
          <select id="fLocal" value={values.local} onChange={(event) => update('local', event.target.value)}>
            <option value="">Selecione</option>
            {LOCAIS.map((local) => (
              <option key={local}>{local}</option>
            ))}
          </select>
          <small className="error" aria-live="polite">
            {errors.local}
          </small>
        </div>
      </div>

      <div className="field-row">
        <div className={fieldClass('tamanho')}>
          <label htmlFor="fTamanho">Tamanho aproximado</label>
          <select id="fTamanho" value={values.tamanho} onChange={(event) => update('tamanho', event.target.value)}>
            <option value="">Selecione</option>
            {TAMANHOS.map((tamanho) => (
              <option key={tamanho}>{tamanho}</option>
            ))}
          </select>
          <small className="error" aria-live="polite">
            {errors.tamanho}
          </small>
        </div>
        <div className="field">
          <label htmlFor="fTipo">É cobertura?</label>
          <select id="fTipo" value={values.tipo} onChange={(event) => update('tipo', event.target.value)}>
            {TIPOS.map((tipo) => (
              <option key={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={fieldClass('ideia')}>
        <label htmlFor="fIdeia">Conte sua ideia</label>
        <textarea
          id="fIdeia"
          rows={4}
          maxLength={2000}
          placeholder="Descreva o desenho, o significado e referências que você gosta."
          value={values.ideia}
          onChange={(event) => update('ideia', event.target.value)}
        />
        <small className="error" aria-live="polite">
          {errors.ideia}
        </small>
      </div>

      <button type="submit" className="btn btn--primary btn--block">
        Enviar pelo WhatsApp
      </button>
      <p className="form__note">Você será redirecionado ao WhatsApp. Pode anexar fotos de referência por lá.</p>
    </form>
  );
}

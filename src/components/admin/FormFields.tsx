'use client';

import { useState } from 'react';
import { uploadImage } from '@/lib/image';
import { Field, btnDanger, btnGhost, inputClass } from './ui';

export type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'image' | 'number';
  options?: { value: string; label: string }[];
  required?: boolean;
  help?: string;
  placeholder?: string;
};

export type Values = Record<string, unknown>;

function ImageField({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onPick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      onChange(await uploadImage(file, folder));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar a imagem.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="Pré-visualização" className="h-40 w-auto rounded-lg border border-neutral-700 object-cover" />
      )}
      <div className="flex flex-wrap items-center gap-2">
        <label className={`${btnGhost} cursor-pointer`}>
          {busy ? 'Enviando...' : value ? 'Trocar foto' : 'Escolher foto'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(event) => {
              void onPick(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
        </label>
        {value && (
          <button type="button" className={btnDanger} onClick={() => onChange('')}>
            Remover foto
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default function FormFields({
  fields,
  values,
  onChange,
  imageFolder = 'geral',
}: {
  fields: FieldDef[];
  values: Values;
  onChange: (key: string, value: unknown) => void;
  imageFolder?: string;
}) {
  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const raw = values[field.key];
        const text = raw === null || raw === undefined ? '' : String(raw);

        return (
          <Field key={field.key} label={`${field.label}${field.required ? ' *' : ''}`} help={field.help}>
            {field.type === 'textarea' ? (
              <textarea
                rows={4}
                className={inputClass}
                placeholder={field.placeholder}
                value={text}
                onChange={(event) => onChange(field.key, event.target.value)}
              />
            ) : field.type === 'select' ? (
              <select className={inputClass} value={text} onChange={(event) => onChange(field.key, event.target.value)}>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'image' ? (
              <ImageField value={text} folder={imageFolder} onChange={(url) => onChange(field.key, url)} />
            ) : (
              <input
                className={inputClass}
                type={field.type === 'number' ? 'number' : 'text'}
                inputMode={field.type === 'number' ? 'numeric' : undefined}
                placeholder={field.placeholder}
                value={text}
                onChange={(event) => onChange(field.key, event.target.value)}
              />
            )}
          </Field>
        );
      })}
    </div>
  );
}

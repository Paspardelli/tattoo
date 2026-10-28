'use client';

import { useState, type FormEvent } from 'react';
import { createClient, hasSupabase } from '@/lib/supabase/client';
import { Field, Notice, btnPrimary, inputClass } from './ui';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasSupabase()) return;

    setBusy(true);
    setError('');
    const { error: signInError } = await createClient().auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);

    if (signInError) {
      const msg = signInError.message.toLowerCase();
      if (msg.includes('not confirmed')) {
        setError('E-mail ainda não confirmado. No Supabase, abra Authentication > Users, toque no usuário e confirme (ou recrie com "Auto Confirm User").');
      } else if (msg.includes('invalid login')) {
        setError('E-mail ou senha incorretos. Confira se o usuário existe em Authentication > Users no Supabase.');
      } else if (msg.includes('api key') || msg.includes('apikey') || msg.includes('jwt')) {
        setError('A chave do Supabase na Vercel está errada. Confira NEXT_PUBLIC_SUPABASE_ANON_KEY e faça um novo deploy.');
      } else if (msg.includes('fetch') || msg.includes('network')) {
        setError('Não consegui falar com o Supabase. Confira NEXT_PUBLIC_SUPABASE_URL na Vercel e se o projeto não está pausado.');
      } else {
        setError(`Não foi possível entrar: ${signInError.message}`);
      }
      return;
    }
    // recarrega a página inteira para o servidor enxergar a sessão
    window.location.href = '/admin';
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-5 py-10">
      <p className="text-center text-3xl text-brand">&#10022;</p>
      <h1 className="mt-2 text-center text-2xl font-bold">Painel do site</h1>
      <p className="mt-1 text-center text-sm text-neutral-400">Entre para editar fotos, textos e ver orçamentos.</p>

      {!hasSupabase() ? (
        <div className="mt-6">
          <Notice kind="error">
            O Supabase ainda não está configurado. Cadastre <code>NEXT_PUBLIC_SUPABASE_URL</code> e{' '}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> nas variáveis de ambiente (veja o README) e publique de novo.
          </Notice>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Field label="E-mail">
            <input
              className={inputClass}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Field label="Senha">
            <input
              className={inputClass}
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          {error && <Notice kind="error">{error}</Notice>}
          <button type="submit" className={`${btnPrimary} w-full`} disabled={busy}>
            {busy ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      )}

      <a href="/" className="mt-8 text-center text-sm text-neutral-500 hover:text-neutral-300">
        ← Voltar para o site
      </a>
    </main>
  );
}

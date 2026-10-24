import { createClient } from '@supabase/supabase-js';

/**
 * Cliente anônimo (sem cookies) para ler o conteúdo público do site.
 * Sem variáveis de ambiente devolve null e o site usa o conteúdo padrão (lib/defaults.ts).
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

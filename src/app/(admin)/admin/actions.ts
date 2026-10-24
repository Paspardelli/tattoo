'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabase/server';

/**
 * Chamada pelo painel depois de salvar algo: faz o site público mostrar a mudança na hora.
 * Só funciona para quem está logado.
 */
export async function revalidateSite(): Promise<{ ok: boolean }> {
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  revalidatePath('/');
  return { ok: true };
}

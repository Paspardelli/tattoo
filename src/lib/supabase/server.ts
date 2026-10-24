import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/** Servidor com a sessão do usuário logado (usado nas Server Actions do admin). */
export function createServerSupabase() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // chamado de um Server Component: pode ser ignorado
          }
        },
      },
    },
  );
}

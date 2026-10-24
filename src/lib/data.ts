import { cache } from 'react';
import { createPublicClient } from './supabase/public';
import { DEFAULT_DATA, DEFAULT_SETTINGS } from './defaults';
import type { Faq, SiteData, Settings, StyleItem, Testimonial, WorkItem } from './types';

// Junta o que veio do banco com os valores padrão (campos nulos usam o padrão).
function mergeSettings(row: Record<string, unknown> | null): Settings {
  const merged: Record<string, unknown> = { ...DEFAULT_SETTINGS };
  if (row) {
    for (const [key, value] of Object.entries(row)) {
      if (key in DEFAULT_SETTINGS && value !== null && value !== undefined) merged[key] = value;
    }
  }
  return merged as unknown as Settings;
}

/**
 * Lê todo o conteúdo público do site.
 * - Sem Supabase configurado, ou se alguma consulta falhar, usa o conteúdo padrão (o site nunca quebra).
 * - `cache` evita consultar duas vezes na mesma renderização (metadata + página).
 */
export const getSiteData = cache(async (): Promise<SiteData> => {
  const supabase = createPublicClient();
  if (!supabase) return DEFAULT_DATA;

  try {
    const [settings, styles, works, testimonials, faqs] = await Promise.all([
      supabase.from('settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('styles').select('*').eq('visivel', true).order('ordem', { ascending: true }),
      supabase.from('works').select('*').eq('visivel', true).order('ordem', { ascending: true }),
      supabase.from('testimonials').select('*').eq('visivel', true).order('ordem', { ascending: true }),
      supabase.from('faqs').select('*').eq('visivel', true).order('ordem', { ascending: true }),
    ]);

    return {
      settings: settings.error ? DEFAULT_DATA.settings : mergeSettings(settings.data as Record<string, unknown> | null),
      styles: styles.error ? DEFAULT_DATA.styles : (styles.data as StyleItem[]) ?? [],
      works: works.error ? DEFAULT_DATA.works : (works.data as WorkItem[]) ?? [],
      testimonials: testimonials.error ? DEFAULT_DATA.testimonials : (testimonials.data as Testimonial[]) ?? [],
      faqs: faqs.error ? DEFAULT_DATA.faqs : (faqs.data as Faq[]) ?? [],
    };
  } catch {
    return DEFAULT_DATA;
  }
});

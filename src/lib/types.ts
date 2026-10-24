// Tipos do conteúdo editável do site (espelham as tabelas em supabase/schema.sql)

export type Settings = {
  nome: string;
  cidade: string;
  whatsapp: string;
  instagram: string;
  endereco: string;
  horario: string;
  ano_inicio: string;
  stat_anos: number;
  stat_tattoos: number;
  hero_texto: string;
  sobre_texto1: string;
  sobre_texto2: string;
  foto_url: string | null;
  hero_foto_url: string | null;
  mensagem_padrao: string;
};

export type StyleItem = {
  id: string;
  nome: string;
  descricao: string;
  arte: string;
  imagem_url: string | null;
  ordem: number;
  visivel: boolean;
};

export type WorkFormat = 'tall' | 'square' | 'wide';

export type WorkItem = {
  id: string;
  titulo: string;
  categoria: string;
  formato: WorkFormat;
  imagem_url: string | null;
  arte: string;
  ordem: number;
  visivel: boolean;
};

export type Testimonial = {
  id: string;
  nome: string;
  estilo: string;
  texto: string;
  ordem: number;
  visivel: boolean;
};

export type Faq = {
  id: string;
  pergunta: string;
  resposta: string;
  ordem: number;
  visivel: boolean;
};

export type SiteData = {
  settings: Settings;
  styles: StyleItem[];
  works: WorkItem[];
  testimonials: Testimonial[];
  faqs: Faq[];
};

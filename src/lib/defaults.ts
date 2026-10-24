import type { Faq, SiteData, Settings, StyleItem, Testimonial, WorkItem } from './types';

// Conteúdo de exemplo. É usado quando o Supabase ainda não está configurado e
// serve de base para o seed do banco (supabase/schema.sql). Depois de conectado,
// tudo passa a ser editado no painel /admin.

export const DEFAULT_SETTINGS: Settings = {
  nome: 'Tattoo Studio',
  cidade: '',
  whatsapp: '5500000000000',
  instagram: 'seuinstagram',
  endereco: 'Sua rua, 000 - Sua Cidade/UF',
  horario: 'Seg a Sáb, 10h às 19h',
  ano_inicio: '2018',
  stat_anos: 8,
  stat_tattoos: 1500,
  hero_texto:
    'Cada tatuagem nasce de uma conversa e de um desenho feito do zero para você. Traço firme, sombras limpas, biossegurança total e um atendimento que respeita a sua ideia.',
  sobre_texto1:
    'Sou tatuador profissional e trabalho com desenhos autorais. Antes de pegar a máquina, a gente conversa: entendo o significado, o local do corpo, o tamanho ideal e o estilo que combina com você.',
  sobre_texto2:
    'Meu compromisso é entregar uma tatuagem bem executada, que envelheça bem e que você tenha orgulho de mostrar pelo resto da vida, num ambiente limpo, tranquilo e seguro.',
  foto_url: null,
  mensagem_padrao: 'Olá! Vim pelo site e gostaria de fazer um orçamento de tatuagem.',
};

const style = (i: number, nome: string, arte: string, descricao: string): StyleItem => ({
  id: `default-style-${i}`,
  nome,
  arte,
  descricao,
  ordem: i,
  visivel: true,
});

export const DEFAULT_STYLES: StyleItem[] = [
  style(1, 'Blackwork', 'geometrico', 'Preenchimentos sólidos em preto, contraste forte e composições de impacto.'),
  style(2, 'Realismo', 'olho', 'Retratos e elementos com profundidade, luz e sombra para parecer reais.'),
  style(3, 'Old School', 'adaga', 'Traço grosso, cores marcantes e a tradição clássica da tattoo americana.'),
  style(4, 'Fine Line', 'rosa', 'Linhas delicadas e minimalistas, perfeitas para detalhes sutis.'),
  style(5, 'Lettering', 'lettering', 'Frases, nomes e datas com caligrafia exclusiva e muito bem espaçada.'),
  style(6, 'Cobertura', 'cobra', 'Transformo tatuagens antigas ou indesejadas em uma nova arte.'),
];

const work = (i: number, titulo: string, categoria: string, formato: WorkItem['formato'], arte: string): WorkItem => ({
  id: `default-work-${i}`,
  titulo,
  categoria,
  formato,
  arte,
  imagem_url: null,
  ordem: i,
  visivel: true,
});

export const DEFAULT_WORKS: WorkItem[] = [
  work(1, 'Adaga e rosa', 'Old School', 'tall', 'adaga'),
  work(2, 'Olhar intenso', 'Realismo', 'square', 'olho'),
  work(3, 'Geometria sagrada', 'Blackwork', 'wide', 'geometrico'),
  work(4, 'Rosa delicada', 'Fine Line', 'tall', 'rosa'),
  work(5, 'Serpente', 'Cobertura', 'square', 'cobra'),
  work(6, 'Memento', 'Blackwork', 'tall', 'caveira'),
  work(7, 'Never fade', 'Lettering', 'wide', 'lettering'),
  work(8, 'Caveira clássica', 'Old School', 'square', 'caveira'),
  work(9, 'Olho que tudo vê', 'Fine Line', 'tall', 'olho'),
];

const quote = (i: number, nome: string, estilo: string, texto: string): Testimonial => ({
  id: `default-testimonial-${i}`,
  nome,
  estilo,
  texto,
  ordem: i,
  visivel: true,
});

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  quote(1, 'Rafael M.', 'Blackwork', 'Atendimento impecável do começo ao fim. O desenho ficou melhor do que eu imaginava e cicatrizou perfeito.'),
  quote(2, 'Camila S.', 'Fine line', 'Ambiente super limpo e tranquilo. Foi minha primeira tatuagem e me senti seguro o tempo todo.'),
  quote(3, 'Lucas P.', 'Cobertura', 'Fiz uma cobertura que eu achava impossível. Trabalho de mestre, recomendo de olhos fechados.'),
];

const faq = (i: number, pergunta: string, resposta: string): Faq => ({
  id: `default-faq-${i}`,
  pergunta,
  resposta,
  ordem: i,
  visivel: true,
});

export const DEFAULT_FAQS: Faq[] = [
  faq(1, 'Quanto custa uma tatuagem?', 'O valor depende do tamanho, nível de detalhe, estilo e local do corpo. Envie sua ideia pelo formulário abaixo e eu respondo com o orçamento.'),
  faq(2, 'Preciso pagar sinal para agendar?', 'Sim. O sinal reserva o seu horário e é abatido do valor final. Em caso de remarcação com aviso prévio, ele é mantido para a nova data.'),
  faq(3, 'Dói muito?', 'Varia de pessoa para pessoa e de região para região. Costelas, pés e articulações costumam incomodar mais. Faço pausas sempre que necessário para você ficar confortável.'),
  faq(4, 'Quanto tempo leva para cicatrizar?', 'A cicatrização superficial leva de 2 a 4 semanas. Passo um guia completo de cuidados e fico disponível para tirar qualquer dúvida nesse período.'),
  faq(5, 'Você faz cobertura de tatuagens antigas?', 'Faço, depois de avaliar a tattoo atual. Mande uma foto pelo formulário e eu digo o que é possível fazer.'),
  faq(6, 'Menor de idade pode tatuar?', 'Somente a partir dos 18 anos, com documento com foto. Em caso de dúvida, fale comigo antes de agendar.'),
];

export const DEFAULT_DATA: SiteData = {
  settings: DEFAULT_SETTINGS,
  styles: DEFAULT_STYLES,
  works: DEFAULT_WORKS,
  testimonials: DEFAULT_TESTIMONIALS,
  faqs: DEFAULT_FAQS,
};

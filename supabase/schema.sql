-- =====================================================================
-- TATTOO SITE - BANCO DE DADOS (Supabase / PostgreSQL)
-- Como usar: Supabase -> SQL Editor -> New query -> cole TUDO -> Run.
-- Pode rodar mais de uma vez sem duplicar nada.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1) TABELAS
-- ---------------------------------------------------------------------

-- Configurações gerais (sempre 1 linha, id = 1)
create table if not exists public.settings (
  id              int primary key default 1 check (id = 1),
  nome            text not null default 'Dinnao',
  cidade          text not null default '',
  whatsapp        text not null default '',
  instagram       text not null default '',
  endereco        text not null default '',
  horario         text not null default '',
  ano_inicio      text not null default '2018',
  stat_anos       int  not null default 8,
  stat_tattoos    int  not null default 1500,
  hero_texto      text not null default '',
  sobre_texto1    text not null default '',
  sobre_texto2    text not null default '',
  foto_url        text,
  hero_foto_url   text,
  mensagem_padrao text not null default 'Olá! Vim pelo site e gostaria de fazer um orçamento de tatuagem.'
);

-- Estilos (cards "Estilos que eu faço")
create table if not exists public.styles (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  descricao  text not null default '',
  arte       text not null default 'adaga',
  imagem_url text,
  ordem      int  not null default 0,
  visivel    boolean not null default true,
  created_at timestamptz not null default now()
);

-- Portfólio (trabalhos)
create table if not exists public.works (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null,
  categoria   text not null default '',
  formato     text not null default 'square' check (formato in ('tall', 'square', 'wide')),
  imagem_url  text,
  arte        text not null default 'adaga',
  ordem       int  not null default 0,
  visivel     boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Depoimentos
create table if not exists public.testimonials (
  id         uuid primary key default gen_random_uuid(),
  nome       text not null,
  estilo     text not null default '',
  texto      text not null,
  ordem      int  not null default 0,
  visivel    boolean not null default true,
  created_at timestamptz not null default now()
);

-- Perguntas frequentes
create table if not exists public.faqs (
  id         uuid primary key default gen_random_uuid(),
  pergunta   text not null,
  resposta   text not null,
  ordem      int  not null default 0,
  visivel    boolean not null default true,
  created_at timestamptz not null default now()
);

-- Pedidos de orçamento enviados pelo formulário do site
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nome       text not null check (char_length(nome) between 1 and 120),
  telefone   text check (telefone is null or char_length(telefone) <= 40),
  estilo     text check (estilo is null or char_length(estilo) <= 80),
  local      text check (local is null or char_length(local) <= 80),
  tamanho    text check (tamanho is null or char_length(tamanho) <= 80),
  tipo       text check (tipo is null or char_length(tipo) <= 80),
  ideia      text not null check (char_length(ideia) between 1 and 2000),
  tratado    boolean not null default false
);

-- Atualização para quem já tinha rodado uma versão anterior deste arquivo
alter table public.settings add column if not exists hero_foto_url text;
alter table public.styles   add column if not exists imagem_url text;

-- ---------------------------------------------------------------------
-- 2) SEGURANÇA (RLS)
--    Visitantes: só LEEM o conteúdo visível e ENVIAM orçamentos.
--    Usuário logado (admin): faz tudo.
-- ---------------------------------------------------------------------

alter table public.settings     enable row level security;
alter table public.styles       enable row level security;
alter table public.works        enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs         enable row level security;
alter table public.leads        enable row level security;

-- settings
drop policy if exists "settings: leitura publica" on public.settings;
create policy "settings: leitura publica" on public.settings
  for select to anon, authenticated using (true);
drop policy if exists "settings: admin" on public.settings;
create policy "settings: admin" on public.settings
  for all to authenticated using (true) with check (true);

-- styles
drop policy if exists "styles: leitura publica" on public.styles;
create policy "styles: leitura publica" on public.styles
  for select to anon, authenticated using (visivel = true);
drop policy if exists "styles: admin" on public.styles;
create policy "styles: admin" on public.styles
  for all to authenticated using (true) with check (true);

-- works
drop policy if exists "works: leitura publica" on public.works;
create policy "works: leitura publica" on public.works
  for select to anon, authenticated using (visivel = true);
drop policy if exists "works: admin" on public.works;
create policy "works: admin" on public.works
  for all to authenticated using (true) with check (true);

-- testimonials
drop policy if exists "testimonials: leitura publica" on public.testimonials;
create policy "testimonials: leitura publica" on public.testimonials
  for select to anon, authenticated using (visivel = true);
drop policy if exists "testimonials: admin" on public.testimonials;
create policy "testimonials: admin" on public.testimonials
  for all to authenticated using (true) with check (true);

-- faqs
drop policy if exists "faqs: leitura publica" on public.faqs;
create policy "faqs: leitura publica" on public.faqs
  for select to anon, authenticated using (visivel = true);
drop policy if exists "faqs: admin" on public.faqs;
create policy "faqs: admin" on public.faqs
  for all to authenticated using (true) with check (true);

-- leads: visitante só INSERE (nunca lê); admin gerencia
drop policy if exists "leads: visitante envia" on public.leads;
create policy "leads: visitante envia" on public.leads
  for insert to anon, authenticated with check (true);
drop policy if exists "leads: admin le" on public.leads;
create policy "leads: admin le" on public.leads
  for select to authenticated using (true);
drop policy if exists "leads: admin atualiza" on public.leads;
create policy "leads: admin atualiza" on public.leads
  for update to authenticated using (true) with check (true);
drop policy if exists "leads: admin apaga" on public.leads;
create policy "leads: admin apaga" on public.leads
  for delete to authenticated using (true);

-- ---------------------------------------------------------------------
-- 3) ARMAZENAMENTO DE FOTOS (bucket público "portfolio")
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

drop policy if exists "portfolio: admin envia" on storage.objects;
create policy "portfolio: admin envia" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio');
drop policy if exists "portfolio: admin altera" on storage.objects;
create policy "portfolio: admin altera" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio') with check (bucket_id = 'portfolio');
drop policy if exists "portfolio: admin apaga" on storage.objects;
create policy "portfolio: admin apaga" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio');

-- ---------------------------------------------------------------------
-- 4) CONTEÚDO INICIAL (só entra se a tabela estiver vazia)
-- ---------------------------------------------------------------------

insert into public.settings (id, nome, whatsapp, instagram, endereco, horario, hero_texto, sobre_texto1, sobre_texto2)
values (
  1,
  'Dinnao',
  '5500000000000',
  'dinnao',
  'Sua rua, 000 - Sua Cidade/UF',
  'Seg a Sáb, 10h às 19h',
  'Cada tatuagem nasce de uma conversa e de um desenho feito do zero para você. Traço firme, sombras limpas, biossegurança total e um atendimento que respeita a sua ideia.',
  'Sou tatuador profissional e trabalho com desenhos autorais. Antes de pegar a máquina, a gente conversa: entendo o significado, o local do corpo, o tamanho ideal e o estilo que combina com você.',
  'Meu compromisso é entregar uma tatuagem bem executada, que envelheça bem e que você tenha orgulho de mostrar pelo resto da vida, num ambiente limpo, tranquilo e seguro.'
)
on conflict (id) do nothing;

insert into public.styles (nome, arte, descricao, ordem)
select * from (values
  ('Blackwork',  'geometrico', 'Preenchimentos sólidos em preto, contraste forte e composições de impacto.', 1),
  ('Realismo',   'olho',       'Retratos e elementos com profundidade, luz e sombra para parecer reais.', 2),
  ('Old School', 'adaga',      'Traço grosso, cores marcantes e a tradição clássica da tattoo americana.', 3),
  ('Fine Line',  'rosa',       'Linhas delicadas e minimalistas, perfeitas para detalhes sutis.', 4),
  ('Lettering',  'lettering',  'Frases, nomes e datas com caligrafia exclusiva e muito bem espaçada.', 5),
  ('Cobertura',  'cobra',      'Transformo tatuagens antigas ou indesejadas em uma nova arte.', 6)
) as v(nome, arte, descricao, ordem)
where not exists (select 1 from public.styles);

insert into public.works (titulo, categoria, formato, arte, ordem)
select * from (values
  ('Adaga e rosa',      'Old School', 'tall',   'adaga',      1),
  ('Olhar intenso',     'Realismo',   'square', 'olho',       2),
  ('Geometria sagrada', 'Blackwork',  'wide',   'geometrico', 3),
  ('Rosa delicada',     'Fine Line',  'tall',   'rosa',       4),
  ('Serpente',          'Cobertura',  'square', 'cobra',      5),
  ('Memento',           'Blackwork',  'tall',   'caveira',    6),
  ('Never fade',        'Lettering',  'wide',   'lettering',  7),
  ('Caveira clássica',  'Old School', 'square', 'caveira',    8),
  ('Olho que tudo vê',  'Fine Line',  'tall',   'olho',       9)
) as v(titulo, categoria, formato, arte, ordem)
where not exists (select 1 from public.works);

insert into public.testimonials (nome, estilo, texto, ordem)
select * from (values
  ('Rafael M.', 'Blackwork',  'Atendimento impecável do começo ao fim. O desenho ficou melhor do que eu imaginava e cicatrizou perfeito.', 1),
  ('Camila S.', 'Fine line',  'Ambiente super limpo e tranquilo. Foi minha primeira tatuagem e me senti seguro o tempo todo.', 2),
  ('Lucas P.',  'Cobertura',  'Fiz uma cobertura que eu achava impossível. Trabalho de mestre, recomendo de olhos fechados.', 3)
) as v(nome, estilo, texto, ordem)
where not exists (select 1 from public.testimonials);

insert into public.faqs (pergunta, resposta, ordem)
select * from (values
  ('Quanto custa uma tatuagem?', 'O valor depende do tamanho, nível de detalhe, estilo e local do corpo. Envie sua ideia pelo formulário abaixo e eu respondo com o orçamento.', 1),
  ('Preciso pagar sinal para agendar?', 'Sim. O sinal reserva o seu horário e é abatido do valor final. Em caso de remarcação com aviso prévio, ele é mantido para a nova data.', 2),
  ('Dói muito?', 'Varia de pessoa para pessoa e de região para região. Costelas, pés e articulações costumam incomodar mais. Faço pausas sempre que necessário para você ficar confortável.', 3),
  ('Quanto tempo leva para cicatrizar?', 'A cicatrização superficial leva de 2 a 4 semanas. Passo um guia completo de cuidados e fico disponível para tirar qualquer dúvida nesse período.', 4),
  ('Você faz cobertura de tatuagens antigas?', 'Faço, depois de avaliar a tattoo atual. Mande uma foto pelo formulário e eu digo o que é possível fazer.', 5),
  ('Menor de idade pode tatuar?', 'Somente a partir dos 18 anos, com documento com foto. Em caso de dúvida, fale comigo antes de agendar.', 6)
) as v(pergunta, resposta, ordem)
where not exists (select 1 from public.faqs);

-- ---------------------------------------------------------------------
-- 5) USUÁRIO ADMIN
--    Não é criado por SQL. Supabase -> Authentication -> Users -> Add user
--    (e-mail + senha, marque "Auto Confirm User").
--    Depois: Authentication -> Sign In / Providers -> desligue "Allow new users
--    to sign up" para ninguém mais conseguir criar conta.
-- ---------------------------------------------------------------------

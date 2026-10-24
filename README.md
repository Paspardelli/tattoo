# Site para Tatuador — Preto & Vermelho

Site profissional para tatuador captar clientes, mostrar o portfólio e receber pedidos de orçamento direto no WhatsApp.
O próprio tatuador edita **fotos, textos, estilos, depoimentos e FAQ** pelo painel `/admin`, sem mexer em código.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS (painel) · Supabase (banco, login e fotos) · Vercel (hospedagem)

## O que o site tem

- Página única: topo, sobre, estilos, portfólio (filtro + ampliar foto), processo, diferenciais, depoimentos, FAQ, orçamento, rodapé
- Formulário de orçamento: monta a mensagem pronta, abre o WhatsApp e ainda guarda o pedido no painel
- Painel `/admin` (protegido por login): Orçamentos, Portfólio, Estilos, Depoimentos, Dúvidas e Configurações
- Upload de fotos direto do celular (a foto é reduzida automaticamente)
- SEO: título/descrição por cidade, dados estruturados para o Google, `sitemap.xml` e `robots.txt`
- Sem Supabase configurado, o site funciona com conteúdo de exemplo (não quebra)

## Estrutura

```
src/
  app/
    (site)/            # site público (page.tsx + site.css)
    (admin)/admin/     # painel: login e página principal
    layout.tsx         # HTML base
  components/
    site/              # seções do site (Hero, Portfolio, FaqSection, QuoteForm...)
    admin/             # painel (AdminPanel, ResourceManager, SettingsForm...)
  lib/
    defaults.ts        # conteúdo de exemplo (usado sem banco)
    data.ts            # lê o conteúdo do Supabase
    supabase/          # clientes do Supabase
    utils.ts           # links de WhatsApp e Instagram
  middleware.ts        # protege /admin
supabase/schema.sql    # tabelas, segurança e fotos (rodar 1 vez)
```

## Passo a passo para colocar no ar

### 1. Criar o banco (Supabase)
1. Entre em [supabase.com](https://supabase.com) → **New project** (guarde a senha do banco).
2. Menu **SQL Editor** → **New query** → cole todo o conteúdo de `supabase/schema.sql` → **Run**.
   Isso cria as tabelas, a segurança (RLS), a pasta de fotos e o conteúdo inicial.
3. Menu **Authentication → Users → Add user → Create new user**: informe e-mail e senha do tatuador e marque **Auto Confirm User**.
4. Menu **Authentication → Sign In / Providers**: desligue **Allow new users to sign up** (ninguém mais consegue criar conta).
5. Menu **Project Settings → API**: copie o **Project URL** e a chave **anon public**.

### 2. Subir o código no GitHub
```bash
cd tattoo-site
git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
git push -u origin main
```
(o repositório já vem com `git init` e o primeiro commit feito)

### 3. Publicar na Vercel
1. [vercel.com](https://vercel.com) → **Add New → Project** → importe o repositório.
2. Em **Environment Variables** cadastre:

| Nome | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | chave `anon public` |
| `NEXT_PUBLIC_SITE_URL` | endereço final do site (opcional, ajuda no Google) |

3. **Deploy**. Cada `git push` publica a nova versão sozinho.

### 4. Primeiro acesso ao painel
1. Abra `https://SEU-SITE/admin` e entre com o e-mail e a senha criados no passo 1.
2. **Configurações:** nome, cidade, WhatsApp, Instagram, endereço, horário, foto e textos.
3. **Portfólio:** adicione as fotos das tatuagens (apague ou oculte os itens de exemplo).
4. **Depoimentos / Dúvidas / Estilos:** troque os exemplos pelos reais.

As alterações aparecem no site na hora.

## Rodar no computador (opcional)
```bash
cp .env.example .env.local   # preencha com as chaves do Supabase
npm install
npm run dev                  # http://localhost:3000
npm run typecheck            # confere os tipos
```

## Como fazer manutenção

| Quero... | Onde |
|---|---|
| Trocar foto, texto, WhatsApp, horário | Painel `/admin` |
| Mudar as cores | `src/app/(site)/site.css` (variáveis `--red`, `--black` no topo) |
| Mudar o visual de uma seção | `src/components/site/NomeDaSecao.tsx` |
| Mudar a ordem das seções | `src/app/(site)/page.tsx` |
| Adicionar um campo novo | coluna em `supabase/schema.sql` + `src/lib/types.ts` + campos em `AdminPanel.tsx` |
| Textos fixos (processo, diferenciais) | `Process.tsx` e `Features.tsx` |

Fluxo de alteração: edite → `git add .` → `git commit -m "o que mudou"` → `git push` (a Vercel publica).

## Reaproveitar para outro cliente
1. Copie o projeto (ou use como template no GitHub) e crie **um projeto Supabase novo por cliente**.
2. Rode `supabase/schema.sql` nele e crie o usuário do cliente.
3. Crie um projeto na Vercel com as variáveis do novo Supabase.
4. Ajuste as cores em `site.css` e o conteúdo pelo painel.

## Segurança
- Visitantes só **leem** o conteúdo visível e **enviam** orçamentos; só o usuário logado altera dados (regras RLS no `schema.sql`).
- `/admin` exige login (middleware) e o cadastro público fica desligado.
- A chave `anon` é pública por design. **Nunca** coloque a chave `service_role` no projeto.
- `.env.local` está no `.gitignore`: não suba chaves para o Git.

## Problemas comuns
- **Painel diz "Supabase não configurado":** faltam as variáveis na Vercel; cadastre e faça *Redeploy*.
- **Não consigo entrar:** confira se o usuário foi criado com *Auto Confirm User*.
- **Erro ao enviar foto:** rode o `schema.sql` de novo (cria a pasta `portfolio`); limite de 5 MB por foto.
- **Mudança não aparece no site:** aguarde até 1 minuto e recarregue; o painel já força a atualização ao salvar.
- **Botão do WhatsApp com número errado:** confira em Configurações (DDD + número).

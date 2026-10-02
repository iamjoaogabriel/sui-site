# Site Sui · Maquiagem e Autoimagem

Site estático (HTML, CSS e JS puros). Sem build, sem dependências, sem mensalidade.

## O que editar

| O quê | Onde |
|---|---|
| WhatsApp, Instagram, agenda, planilha | `js/config.js` |
| Perguntas e perfis do quiz | `js/quiz-data.js` |
| Textos (bio, serviços, depoimentos, endereço) | `index.html` (procure por `EDITAR`) |
| Fotos | `assets/img/` (formato `.webp`) |

## Ver o site no computador

Abra um terminal na pasta e rode `python -m http.server 8765`, depois acesse http://127.0.0.1:8765

## Colocar no ar (Vercel, sem GitHub)

1. Criar conta grátis em vercel.com.
2. Na pasta do site, rodar `npx vercel` (pede login pelo navegador na primeira vez).
3. Para publicar a versão final: `npx vercel --prod`.
4. Domínio próprio: comprar no registro.br e adicionar em Vercel > Project > Settings > Domains.

## Planilha de leads (Google Sheets, grátis)

1. Criar uma planilha no Google Drive da Suellen.
2. Extensões > Apps Script, colar o conteúdo de `integracoes/planilha-leads.gs` e salvar.
3. Implantar > Nova implantação > App da Web. Executar como: Eu. Quem pode acessar: Qualquer pessoa.
4. Copiar a URL gerada para `leadsEndpoint` em `js/config.js`.

## Agendamento (Google Agenda, grátis)

1. No Google Agenda: Criar > Programação de horários (Agendamentos).
2. Definir serviços, duração e horários disponíveis.
3. Abrir a programação > Compartilhar > Incorporar no site > "Agenda inline": copiar só o endereço que está dentro de `src="..."` do iframe para `bookingUrl` em `js/config.js`.

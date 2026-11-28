# Página 404 padrão e espaço abaixo do cabeçalho

- **Status:** aprovada (decisões da dona do produto de 28/11/2026; publicação com o "sim" dela)
- **Componente:** `PaginaDeErro` (nova variante `moldura="card"`) em `src/app/components/ui/estado-vazio.tsx`; token `--espaco-abaixo-do-cabecalho` e classe `.ds-abaixo-do-cabecalho` em `src/styles/theme.css`
- **Data:** 2026-11-28
- **Branch:** `claude/pagina-404-padrao`
- **Documentação:** Molduras e estados › Página de erro (404) (`molduras#molduras-erro`); Grid e espaçamento › Espaço abaixo do cabeçalho (`grid#grid-cabecalho`)

## Motivo
A 404 do site do estúdio era um HTML solto, com o logo dentro da página, e um link de e-mail incompleto mostrava um formulário com botão desativado e aviso. A dona do produto decidiu: a 404 é a página padrão para qualquer endereço quebrado ou incompleto, num card branco abaixo do cabeçalho do site, e toda página que começa logo abaixo do cabeçalho fica a uma distância padrão dele.

## Regra
Link quebrado ou incompleto = página 404 padrão; nunca mostrar formulário com botão desativado e aviso, nem uma página ou variante "link incompleto".

## Tela de origem
Site do estúdio, `public/404.html` e as páginas que recebem links de e-mail. Prévia aprovada: `mock-404/dm-card.png` (a coluna "link incompleto" da prévia foi descartada pela própria decisão).

## API
- `moldura?: "nenhuma" | "card"` (padrão "nenhuma", o comportamento de antes). "card": card branco só de borda (`Card` do DS), centralizado, até 576 px; selo, título (h1), texto e ações.
- `selo?: ReactNode` (padrão "Erro " + `codigo`), desenhado pelo `SeloSecao` (tamanho sm).
- `abaixoDoCabecalho?: boolean` (padrão: sim com moldura="card"): o conteúdo começa a `--espaco-abaixo-do-cabecalho` do cabeçalho, em vez de ficar no meio da altura da tela.
- `elemento?: "main" | "div"` (padrão "main"; "div" nas demonstrações dentro de outra página).
- Continuam: `codigo`, `ilustracao`, `titulo`, `descricao`, `acoes`, `telaCheia`.

```tsx
<CabecalhoDoSite itens={itens} atual="inicio" />
<PaginaDeErro
  moldura="card"
  codigo="404"
  titulo="Página não encontrada"
  descricao="O endereço pode ter mudado ou não existe mais."
  acoes={<Button asChild size="lg"><a href="/">Ir para a página inicial</a></Button>}
/>
```

Token: `--espaco-abaixo-do-cabecalho` = `var(--space-8)` (32 px) no celular e no tablet; `var(--space-16)` (64 px) a partir de 1024 px, o ponto do desktop de 12 colunas do grid (o mesmo do `--section-space`). Classe `.ds-abaixo-do-cabecalho { padding-top: var(--espaco-abaixo-do-cabecalho) }`; no Tailwind, `pt-[var(--espaco-abaixo-do-cabecalho)]`. Mesmo nome e valores no DS FindLook.

## Variações e estados
Card: padding 32/24 px no celular e 48/40 px a partir de 640 px de largura (consulta de contêiner); título de 24 px até 480 px de largura, 32 px até 640 px e 36 px depois (numa linha só no celular, como na prévia); texto com `text-wrap: balance` (sem palavra sozinha); uma ação fica centralizada na largura do texto. Entrada suave (fade + subida de 8 px, `--duration-slow`, `--ease-snappy`), só sem "menos movimento". Sem moldura: igual a antes.

## Acessibilidade
h1 no título; selo lido como texto ("Erro 404"); botão de 44 px; axe (WCAG 2.0/2.1/2.2 AA e boas práticas) sem violações na demonstração, a 390 e 1280 px, nas duas telas.

## Testes
Ver o relatório do branch: `pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, axe e medidas (espaço de 32 px no celular e 64 px no computador; card a 17 px da borda a 390 px).

## Capturas
`shots-404/dm-404-390-celular.png` e `shots-404/dm-404-1280-computador.png` (pasta de trabalho do agente).

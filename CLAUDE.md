# CLAUDE.md — Dani Moscatelli Design System

## O que é

Design system oficial do estúdio Dani Moscatelli | Experience Design Studio: tokens, componentes, templates e regras de marca do site do estúdio e do produto DM | Experience Intelligence (repositório `daniellemoscatelli87/claude`). O site do DS é **bilíngue**: todo texto visível usa `t("English", "Português")` de `src/app/i18n.tsx`. Este arquivo e os registros do repositório são em português.

Publicado em https://designsystem.danimoscatelli.com.br. Este repositório é a única fonte da verdade do DS; quem consome é o site do estúdio e o DM | Experience Intelligence (`daniellemoscatelli87/claude`), que copiam os arquivos listados no `design-system/arquivos.txt` deles.

- `src/styles/theme.css`: tokens. `src/app/components/ui/`: componentes importáveis. `src/app/components/showcase/`: páginas de documentação (`shared/changelog.ts` é o histórico).
- [`CATALOGO.md`](CATALOGO.md) e `catalogo.json`: catálogo de tudo o que existe, **gerado** por `scripts/gerar-catalogo.mjs` (não edite à mão).
- [`propostas/`](propostas/README.md): propostas de componente novo. [`guidelines/Guidelines.md`](guidelines/Guidelines.md): regras de trabalho (changelog no topo, menu e página inicial em sincronia, card sem rolagem horizontal).

## Build e testes

- `pnpm install`, `pnpm dev`. `pnpm build` gera o catálogo antes (script `prebuild`) e depois o site em `dist/`.
- Antes do commit: `pnpm build` sem erros e `pnpm catalogo:check` (falha se `CATALOGO.md` ou `catalogo.json` estiverem desatualizados; rode `pnpm catalogo` ou o build e faça o commit dos dois).
- Abra no navegador as páginas que mudaram, no computador e no celular, e confira que nenhuma página tem erro no console.

## Publicação

- Trabalhe em branch (`claude/<assunto>` ou `componente/<nome>`). Nada vai para o `main` sem o **"sim" da dona do produto**.
- Com o sim, o merge no `main` basta: o repositório `daniellemoscatelli87/danimoscatelli-designsystem-deploy` (`.github/workflows/publish.yml`) confere o `main` a cada 15 minutos, cria a versão `vN`, publica no GitHub Pages e retém a versão se algo sumiu. Não publique à mão nem mexa no branch `gh-pages`.

## A regra: consumir o DS, nunca recriar

- Qualquer funcionalidade com interface que for desenvolvida — tela, seção, fluxo, ajuste ou correção, pedida pela dona do produto ou não — começa obrigatoriamente pela consulta ao DS, sem que ela precise pedir, e é montada com o que já existe.
- Antes de criar ou alterar qualquer elemento visual (inclusive páginas de demonstração e templates), consulte o [`CATALOGO.md`](CATALOGO.md) e use o componente, template ou padrão que já existe; não recrie à mão.
- Peça visual nova nasce em `src/app/components/ui/` como componente reutilizável e só depois é usada em demonstrações e templates; nada de marcação feita à mão em página de demonstração quando existe componente.
- Padrão da seção 2 do catálogo (só em demonstração, não importável): use exatamente aquele visual; para usá-lo num produto, promova-o a componente pelo processo abaixo.
- Se for pedido algo que não está no DS, o projeto tem autonomia para criar o componente, mas sempre dentro do DS e de forma formal e documentada:
  - branch `componente/<nome>` no repositório do DS;
  - componente em `src/app/components/ui/` usando só tokens e regras do DS;
  - seção na documentação, com variações, estados, acessibilidade e exemplo;
  - entrada no changelog e no catálogo;
  - registro da proposta em `propostas/AAAA-MM-DD-<nome>.md`, com motivo, tela de origem, API, variações, acessibilidade, testes e capturas.

  O produto só usa o componente depois que ele chega pela sincronização; nunca uma cópia local. A publicação continua com o "sim" da dona do produto.
- Ao delegar a um agente, a instrução inclui esta regra e o caminho do catálogo (`CATALOGO.md` na raiz deste repositório), e o relatório lista qual componente cada peça usa.
- Antes de mostrar capturas, confira cada peça contra o catálogo.

## Crítica de design e fundamentos (regras da dona do produto, 27/11/2026)
Antes de mostrar qualquer tela, demonstração ou componente, escreva uma crítica curta e corrija o que ela encontrar. A crítica cobre:
- prioridade;
- redundância;
- contexto;
- variedade;
- densidade e ritmo;
- intuição;
- estética de alto padrão.

Use a skill de UX/UI quando existir.

Nenhuma tela pode ferir:
- as leis da Gestalt;
- as heurísticas de usabilidade de Nielsen;
- os princípios de arquitetura de informação;
- a semiótica (o mesmo sinal significa sempre a mesma coisa).

E toda interface tem motion (tokens do DS, respeitando "menos movimento"), design de interação, sofisticação e modernidade.

Comunicação sempre não técnica: todo texto que explica uma funcionalidade, na interface, na documentação e nas mensagens para a dona do produto, usa linguagem natural, didática e objetiva, sem jargão técnico.

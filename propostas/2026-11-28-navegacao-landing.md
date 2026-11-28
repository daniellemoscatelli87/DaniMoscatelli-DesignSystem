# Navegação de landing page

- **Status:** em revisão
- **Componente:** `HeroComAba` e `AbaSaibaMais` (`ui/hero-com-aba.tsx`), `Parallax` (`ui/parallax.tsx`), `MenuDeAncoras` e `useSecaoAtiva` (`ui/menu-de-ancoras.tsx`), `ProgressoDeLeitura` (`ui/progresso-de-leitura.tsx`), `SecaoFixa` (`ui/secao-fixa.tsx`); `CurvaSecao` passa a usar a classe `.ds-curva-secao`; classes de CSS puro no bloco `@ds-css-puro:navegacao-landing` do `src/styles/theme.css`
- **Data:** 2026-11-28
- **Branch:** `claude/navegacao-landing`
- **Documentação:** Navegação de landing page (`navegacao-landing`, seções `nav-exemplo`, `nav-hero-aba`, `nav-curva`, `nav-parallax`, `nav-menu-ancoras`, `nav-progresso`, `nav-secao-fixa`, `nav-surgir`, `nav-classes`)

## Motivo
Página aprovada pela dona do produto nos dois DS: as peças que conduzem a leitura de uma página longa ainda não existiam como componentes (a aba "Saiba mais" do hero estava escrita à mão em três páginas do site do estúdio, com CSS repetido). Agora cada peça é um componente com a mesma API nos dois DS e um conjunto de classes de CSS puro para as páginas em HTML do site, de uma fonte só: os componentes usam as mesmas classes.

## Tela de origem
Site do estúdio Dani Moscatelli: página inicial (`index.html`, `.ih-hero` e `.ih-alca` em `src/em-breve.css`), Projeto Piloto (`.rolar-abaixo` em `src/projeto-piloto.css`), Rede de Parceiros e a aba do celular (`.alca-movel` em `src/compartilhado/menu.css` e `menu.ts`).

## Medidas da aba (medidas no site no ar em 28/11/2026, 390 e 1280 px; copiadas como estão)
- Computador (a partir de 1024 px): painel com 16 px de respiro e cantos de 32 px; aba de 320 × 56, cantos de cima de 40 px, 12 px de respiro, 16 px entre o texto (16 px, seminegrito) e a cápsula; cápsula de 20 × 32, borda grafite 100, seta de 14 px em `--primary`; a aba sobe da base em 0,7 s (curva snappy) depois de 0,6 s.
- Celular e tablet: hero de ponta a ponta; a seção seguinte começa com cantos de 28 px; aba de 132 × 28, cantos de 20 px, texto de 12 px, 8 px até a cápsula de 14 × 20, seta de 10 px.
- Os raios de 20, 28, 32 e 40 px ficam fora da escala de raios de propósito: são o desenho da aba no site, aprovado como está. Ficam em variáveis do próprio componente (`--aba-raio`, `--hero-raio`, `--hero-tampa`), não em tokens novos.

## Diferenças conscientes em relação ao site
- Hover da cápsula em cinza claro (`--accent`), não no rosa do site: regra do DS (rosa só para selecionado).
- Área de toque de 44 px na aba do celular (8 px invisíveis acima e abaixo); no site ela tem 28 px.
- Seta do Lucide (`ArrowDown`) no lugar do desenho próprio do site (uma família de ícones); diferença de 1 px no comprimento.
- No celular, a aba fica no hero, sem o efeito de "folha que sobe" com o topo fixo (isso é da página, não da aba).
- 24 px de respiro entre o conteúdo do hero e a aba no celular.

## API
- `<HeroComAba alvo="#sobre" rotulo corDaAba fundo telaCheia deslocamento tela raiz classNamePainel>` e `<AbaSaibaMais rotulo alvo deslocamento raiz>`.
- `<CurvaSecao posicao="topo|base" cor>`.
- `<Parallax imagem posicaoImagem fundo velocidade desligarNoToque raiz>`.
- `<MenuDeAncoras itens rotulo orientacao="horizontal|vertical" noCelular="chips|seletor" fixo deslocamento tela raiz aoMudar>`; `useSecaoAtiva(ids, { raiz, deslocamento })`.
- `<ProgressoDeLeitura alvo raiz posicao="fixo|grudado|absoluto" topo>`.
- `<SecaoFixa fixo lado="esquerda|direita" topo>`.

## Classes de CSS puro
`.ds-hero-com-aba` (`data-tela-cheia`, `--hero-aba-cor`, `--hero-fundo`) › `.ds-hero-com-aba-painel` › `a.ds-aba-saiba-mais` › `.ds-aba-saiba-mais-seta`; `svg.ds-curva-secao[data-posicao]`; `.ds-parallax` (`--parallax-velocidade`, `data-toque="parado"`) › `.ds-parallax-camada`; `nav.ds-menu-de-ancoras` (`data-fixo`, `data-orientacao`, `data-celular`) › `.ds-menu-de-ancoras-lista` › `a.ds-menu-de-ancoras-item[aria-current="true"]`; `.ds-alvo-de-ancora`; `.ds-progresso-de-leitura` › `.ds-progresso-de-leitura-barra`; `.ds-secao-fixa` (`data-lado`) › `.ds-secao-fixa-lado` + `.ds-secao-fixa-conteudo`. `data-tela="celular|computador"` força um desenho nas demonstrações.
O parallax e a barra de leitura funcionam sem JavaScript nos navegadores com animação ligada à rolagem (`animation-timeline`); nos outros, o componente React mede a rolagem, e a página em HTML fica com a foto parada e sem a barra.

## Acessibilidade
- Aba: link de verdade (`href="#id"`), foco com contorno interno de 2 px em `--primary`, área de toque de 44 px; ao chegar, o foco vai para a seção (tabindex -1).
- Menu: `<nav aria-label="Nesta página">`, `aria-current="true"` no item atual, que também ganha borda (e traço à esquerda na lista vertical): nunca só cor; hover cinza; alvos de 44 px; nada rola para o lado.
- Parallax, curva e barra de leitura: decorativos (`aria-hidden`), sem texto. Parallax e entrada da aba parados com menos movimento; rolagens instantâneas com menos movimento.
- Seção fixa: só `position: sticky`; no celular, empilha na ordem de leitura.

## Testes
`pnpm build` e `pnpm catalogo:check`; `comparar-ds.mjs` limpo; navegador (Playwright) em 390 e 1280 px: aba (medidas iguais às do site, rolagem até a seção certa abaixo do menu fixo, foco na seção), menu (item atual muda com a rolagem, último item no fim), barra de leitura (0 a 1), parallax (a camada se move), seção fixa (para no topo no computador, empilha no celular), voltar ao topo; `todas-paginas.js`, `quebras-paginas.js`, axe na página nova. Capturas e comparação lado a lado com o site no ar no relatório do branch.

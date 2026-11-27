# Peças do painel: casca, cabeçalho da página, card de indicador e ícone com base

- **Status:** proposta
- **Componente:** `MenuLateralProvider`, `MenuLateral`, `TopoDoMenu`, `BotaoRecolherMenu`, `NavDoMenu`, `ItemDoMenu`, `GrupoDoMenu`, `BarraSuperiorDoPainel`, `BotaoDeNotificacoes`, `GatilhoDaConta`, `AvatarPainel`, `ContadorDoPainel`, `CampoDeBuscaGlobal`, `CardDeAjuda` em `src/app/components/ui/painel-shell.tsx`; `CabecalhoDaPagina` em `src/app/components/ui/painel-cabecalho.tsx`; `IconeComBase`, `CardIndicador`, `CardComCabecalho`, `DivisorSuave`, `LinkVerTudo`, `Variacao`, `Explicacao` em `src/app/components/ui/painel-dados.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/pecas-do-painel`
- **Documentação:** Templates › Painel (`templates#template-painel`) e Templates › Peças do painel (`templates#template-painel-pecas`)

## Motivo
O catálogo não tem a casca do painel (o menu do site do DS é marcação própria do `App.tsx`; o `ui/sidebar` é o do shadcn, com item ativo cinza, menu na altura toda e textos em inglês), nem cabeçalho de página "Opção A", nem card de indicador (o `CardsDeKpi` é só demonstração, com sombra), nem ícone com base. A Início da área restrita em React teve de usar `Card` + `CardMidia` nos números ("péssimos… espremidos", dona do produto). As quatro peças já existem como componentes no FindLook Design System, com a mesma estrutura aprovada pela dona do produto para os dois design systems; só as cores mudam.

## Tela de origem
Área restrita do site do estúdio, Início em React (`apps/area-restrita`, branch `claude/admin-react` do repositório `claude`), e a casca aprovada das páginas de HTML (D-039, D-041).

## API
- `MenuLateralProvider` (`chave`, `padrao`, `recolhido`, `onRecolhidoChange`) envolve a casca; `MenuLateral` (aside; `midia`, padrão 1024 px) numa linha flex ao lado do conteúdo; dentro, `TopoDoMenu` (rótulos opcionais) e `NavDoMenu` com `GrupoDoMenu` e `ItemDoMenu`.
- `ItemDoMenu`: `icone`, `ativo`, `contador`, `rotuloContador`, `as` (Link do roteador), `href`.
- `GrupoDoMenu`: `titulo`, `expansivel`, `icone`, `padraoAberto`, `aberto`, `onAbertoChange`, `contador`, `rotuloContador`, `ativo`.
- `BotaoDeNotificacoes`: `naoLidas`, `indicador` ("numero" | "ponto"); `ContadorDoPainel`: `valor`, `rotulo`, `anel`.
- `CabecalhoDaPagina`: `titulo` (destaque entre `** **`), `saudacao`, `descricao`, `acoes`, `abas`, `nivel`, `idDoTitulo`.
- `CardIndicador`: `icone`, `valor` (número ou `null`), `rotulo`, `total`, `apoio`, `variacao`, `comparacao`, `explicacao`, `selo`, `acao`, `tom`, `href`, `as`.
- `IconeComBase`: `tom` ("marca" | "neutro"), `tamanho` (sm 32, md 40, lg 48 px), `redonda`.
- `CardComCabecalho`: `icone`, `titulo`, `descricao`, `acao`, `tom`, `cabecalho` ("divisor" | "simples"), `sangria`, `nivel`, `idDoTitulo`. `LinkVerTudo`: `href`, `rotulo`, `tom`, `icone`, `as`.

```tsx
<MenuLateralProvider chave="dm-admin-menu-recolhido">
  <BarraSuperiorDoPainel>… <BotaoDeNotificacoes naoLidas={7} /> <GatilhoDaConta nome="Dani" /></BarraSuperiorDoPainel>
  <div className="flex">
    <MenuLateral className="hidden lg:flex"><TopoDoMenu /><NavDoMenu aria-label="Páginas">…</NavDoMenu></MenuLateral>
    <main><CabecalhoDaPagina titulo="Bom dia, Dani!" />…</main>
  </div>
</MenuLateralProvider>
```

## Adaptação às cores deste DS
- Item ativo do menu: `bg-primary/10` + `text-primary-text`; hover: `bg-accent` + `text-foreground` (os mesmos do menu do site do DS, `App.tsx`). O FindLook usa `--primary-sutil` e `--primary-suave`, que este DS não tem.
- Destaque do título: `--primary-text` (o do `Heading`); o FindLook usa `--primary-destaque`, que este DS não tem.
- Cards: o `Card` deste DS (raio `rounded-xl`, só borda), no lugar da superfície própria do FindLook.
- Descrição do cabeçalho em `--foreground`: no fundo cinza, `--muted-foreground` fica com 4,3:1.

## Variações e estados
Menu expandido e recolhido (dica ao lado), item padrão, hover, ativo, foco, com contador; grupo fechado, aberto e ativo; contador com 1 e 2 algarismos e 99+; sino sem não lidas, com número e com ponto. Card de indicador simples, com total, variação, explicação, selo, ação, valor nulo e clicável (hover de borda e fundo, anel de foco). Ícone com base marca e neutro, em três tamanhos, quadrado ou redondo. Tema claro e escuro pelos tokens.

## Acessibilidade
`nav` com nome, `aria-current="page"`, botão ≡ MENU com `aria-expanded`/`aria-controls` e o nome da ação; contadores lidos com o sentido ("3 não lidas") e o número do sino `aria-hidden` (o nome do botão leva a contagem); alvos de 44 px no sino, na conta e nos itens da gaveta; variação com seta e texto; foco visível em tudo; "menos movimento" desliga a animação da largura do menu e o deslize da seta.

## Testes
`pnpm build` e `pnpm catalogo:check`; todas as páginas em 1280 e 390 px sem erro de console nem rolagem horizontal (`todas-paginas.js`), quebras de texto (`quebras-paginas.js`), mesma altura dos cards (`cards-altura-check.cjs`) e coluna de tags e hover de linha (`grid-colunas-check.cjs`). Resultados no pull request.

## Capturas
Template Painel em 1280 e 390 px (escala 2): `dm-pecas-painel-1280.png` e `dm-pecas-painel-390.png`, anexadas ao pull request.

## Pendências para a dona do produto
- **Cor do contador (resolvida em 27/11/2026):** com a nova `--primary` #CC4545 aprovada pela dona do produto, o número branco fica em 4,66:1 e o contador voltou a `--primary`, como pedido.
- Abas sublinhadas da Opção A: este DS só tem as abas em pílula (`Tabs`); o FindLook usa `AbasComContador estilo="sublinhado"`.
- `SeletorDeLoja` e `CardDePlano` não foram trazidos (são de loja).
- O menu do site do DS (`App.tsx`) continua com marcação própria; passar a usar a casca é um passo separado (três níveis de itens e o painel fixo do site).

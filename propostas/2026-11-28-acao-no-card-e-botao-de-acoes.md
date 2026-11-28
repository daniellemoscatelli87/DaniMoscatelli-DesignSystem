# A ação no card (AcoesDoCard) e o botão de ações (BotaoDeAcoes)

- **Status:** proposta
- **Componentes:** `AcoesDoCard` em `src/app/components/ui/acoes-do-card.tsx` (e a mesma regra no `CardFooter` de `ui/card.tsx`); `BotaoDeAcoes` em `src/app/components/ui/botao-de-acoes.tsx`. Arquivos iguais nos dois DS.
- **Data:** 2026-11-28
- **Branch:** `claude/cards-acao`
- **Documentação:** Cards › A ação no card (`cards#card-acao`); Sobreposições › Botão de ações (`overlays#botao-de-acoes`)

## Motivo
Decisões da dona do produto (28/11/2026):
- "Em todo tipo de card, a ação (botão) fica do lado direito e/ou ocupando 100% da largura do card. Caso tenha 2 botões e o card for pequeno, ambos os botões ocupam 100% da largura do card. Revise todos os cards."
- "Com 2 botões num card pequeno, os dois ocupam a largura toda, um embaixo do outro (apenas no mobile). No desktop, se houver espaço, um ao lado do outro."
- "No card é preferível a ação principal ser o botão cápsula e a secundária ser botão link. Agora, se as duas ações forem importantes, a principal continua sendo o botão vermelho/rosa e o secundário o botão com contorno."
- "Se houver mais ações no card, vamos criar um botão de ações padronizado, inspirado no que já existe no painel administrativo. É um botão escrito 'Ações', com uma seta apontando para baixo. [...] No mobile a palavra 'Ações' não aparece, e esse botão vira um botão com 3 pontinhos verticais dentro."

## A regra (texto da página Cards)
1. A ação fica embaixo, depois de um divisor, no lado DIREITO da linha. A informação de apoio (tempo de leitura, data, preço) fica à esquerda, na mesma linha.
2. No celular (tela com menos de 640 px), os botões ocupam a largura toda do card. Com dois botões, um fica embaixo do outro, o principal em cima.
3. No tablet e no computador, se houver espaço, os dois botões ficam lado a lado, à direita, com o principal na ponta. Sem espaço, quebram de baixo para cima, o principal em cima, ainda à direita.
4. Qual botão: a ação principal é a pílula preenchida; a secundária é o botão link. Quando as duas importam de verdade, a secundária vira o botão de contorno.
5. Mais de duas ações: a principal fica à vista e as outras vão para o botão Ações. Se nenhuma for a principal, só o botão Ações.
6. Um link de texto ("Ler artigo →") também fica à direita e nunca ocupa a largura toda.

Limite "card pequeno": a tela do celular (abaixo de 640 px, o `sm` do DS), como pediu a dona do produto ("apenas no mobile").
Fora desta regra (documentado): formulário dentro de card (regra dos formulários), conteúdo centralizado (estado vazio, página de erro, confirmação final) e alertas (regra do Alerta com ação).

## API
- `AcoesDoCard`: `info` (à esquerda), `divisor` (padrão: sim), `className`, children (secundária antes, principal por último).
- `CardFooter`: as mesmas regras (agora `justify-end`, quebra de linha e empilhamento no celular).
- `BotaoDeAcoes`: `opcoes` ({ rotulo, icone, onSelect, href, novaAba, destrutiva, desabilitada }[]), `rotulo` (padrão "Ações"), `soIcone`, `desabilitado`, `alinhar` (padrão "end"), children (itens próprios do DropdownMenu), `textos`, `className`.
- CSS puro: `.ds-acoes-do-card` (+ `--sem-divisor`, `__info`, `__botao`) no bloco "@ds-css-puro:cards-acao" do `theme.css`.

## Origem do botão de ações
Área restrita do estúdio, Pesquisas › Dados: botão de contorno com os 3 pontinhos (`EllipsisVertical`), `DropdownMenuContent align="end"` com ícone em cada opção e as opções de excluir em vermelho depois de um separador.

## Acessibilidade
Botão sempre com o nome "Ações" (ou `rotulo`) também no celular; menu do Radix com teclado (Enter, Espaço, setas, Esc devolve o foco); 44 px de toque; seta que gira só sem "menos movimento". Ordem do HTML = ordem de leitura (secundária, depois principal); no celular a principal fica em cima só visualmente.

## Testes
`cards-acao-check.cjs` (novo, na pasta de trabalho): para cada card com botão ou link, em 390, 768 e 1280 px, confere se a ação está à direita ou na largura toda e, no celular, se dois botões ficam na largura toda, um embaixo do outro. Mais `pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `cards-altura-check.cjs` e axe na página Cards.

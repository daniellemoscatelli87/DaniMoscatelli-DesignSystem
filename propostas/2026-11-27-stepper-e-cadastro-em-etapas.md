# Stepper e cadastro em etapas

- **Status:** proposta
- **Componente:** `Stepper`, `MolduraDoCadastro`, `EtapaDoCadastro`, `BarraDaEtapa`, `LateralDaEtapa`, `ListaDeRevisao`, `BlocoDeRevisao`, `LinhaDeDado`, `CampoDoCadastro` em `src/app/components/ui/stepper.tsx`, `src/app/components/ui/cadastro-em-etapas.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Peças da área restrita › Etapas e cadastro (`pecas-admin#admin-etapas`)

## Motivo
Trazidos do FindLook Design System com os mesmos nomes e a mesma API, para os dois DS ficarem paralelos.

## Tela de origem
Rede de Parceiros › cadastro (`rede-parceiros/cadastro/`), app EI (`BarraProgresso`, `Definicoes`).

## API
As do FindLook DS: Stepper (`etapas`, `atual`, `concluidas`, `onIrPara`, `rotulo`, `textos`); MolduraDoCadastro (`etapas`, `atual`, `concluidas`, `onIrPara`, `rotulo`, children); EtapaDoCadastro (`titulo`, `explicacao`, `tituloRef`, `obrigatorios`, `erro`, `resumoDeErros`, `lateral`, `barra`, `onSubmit`); BarraDaEtapa (`onVoltar`, `rotuloVoltar`, `rotuloContinuar`, `carregando`, `textoCarregando`, `desativado`); LateralDaEtapa (`icone`, `titulo`, `paragrafos`, `destaque`, `tom`, `iconeDestaque`); ListaDeRevisao, BlocoDeRevisao, LinhaDeDado (`rotulo`, `valor`, `vazio`). CampoDoCadastro é o Campo.

## Variações e estados
Escala de texto do DM (tokens), marcadores de 40 px, sublinhado de 4 px; o formulário do lojista do FindLook não veio.

## Acessibilidade
Etapas com estado em texto para leitores de tela; foco no título a cada etapa; responsivo pela largura do próprio cadastro. Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.

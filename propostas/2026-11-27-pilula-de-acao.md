# Pílula de ação

- **Status:** proposta
- **Componente:** `PilulaDeAcao` em `src/app/components/ui/pilula-de-acao.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Padrões do site › Elementos flutuantes

## Motivo
Integra o branch `claude/pilula-acao`, que não tinha proposta: a ação principal flutuante das páginas ("Quero ser parceiro", "Cadastrar empresa").

## Tela de origem
Rede de Parceiros e Projeto Piloto (`#cta-flutuante`, `.faixa-flutuante`).

## API
`rotulo`, `href`, `onClick`, `icone`, `iconeAntes`, `visivel`, `mostrarApos`, `esconderCom`, `sempreAte`, `raiz`, `layout` ("auto" | "celular" | "computador"), `faixa`, `fixo`.

## Variações e estados
Revisada: usa o Button do DS, 48 px de altura, camadas 43–45 com o WhatsApp e o botão subir.

## Acessibilidade
Escondida, sai do Tab e dos leitores de tela; entrada parada com menos movimento. Textos visíveis e lidos em português. Tamanhos de texto pelos tokens da escala (`text-body-sm`, `text-label`…), alvos de toque pela variante `toque` (44 px no celular e em telas de dedo).

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs` e `auditoria-ds/auditar.cjs` nas páginas novas; capturas em 390, 768, 1024 e 1280 px conferidas uma a uma. Resultados no relatório da entrega (27/11/2026).

## Capturas
`capturas-dm-novos/<largura>-<âncora>.png` (pasta de trabalho da entrega), nas quatro larguras.

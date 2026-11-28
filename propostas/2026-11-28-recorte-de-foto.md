# Recorte de foto

- **Status:** proposta
- **Componente:** `RecorteDeFoto` em `src/app/components/ui/recorte-de-foto.tsx`
- **Data:** 2026-11-28
- **Branch:** `claude/lacunas-finais`
- **Documentação:** Envio de arquivos › Recorte de foto (`upload#recorte-de-foto`)

## Motivo
A autorização da galeria da Rede de Parceiros recorta a foto de perfil; a página em React precisava da peça (lote S5).

## Tela de origem
Site do estúdio, `rede-parceiros/galeria/autorizar/` (HTML).

## API
`onRecortar(foto: Blob, url)`, `onCancelar`, `forma` ("circulo" | "quadrado"), `tamanhoDeSaida` (600), `tipo`, `qualidade`, `tamanhoMaximoMb` (15), `minimoPx` (300), `formatos`, `zoomMaximo` (3), `textos`, `className`.

## Variações e estados
Escolher (UploadDropzone, com erro de formato, tamanho e foto pequena); enquadrar (área quadrada, máscara redonda sobre `--sobreposicao`, zoom de 1 a 3 no Slider e botões − e +, recomeçar); prévia; usar ou cancelar. Sem biblioteca: canvas.

## Acessibilidade
A área de recorte recebe o foco; setas movem (Shift: passo maior), + e − mudam o zoom, 0 recomeça; botões de 44 px no toque; prévia com nome; erros em texto.

## Testes
`pnpm build` e `pnpm catalogo:check`; tipos (tsc com os tipos do React); navegador (Playwright) em 390, 768, 1024 e 1280 px sem erros no console nem rolagem lateral; `todas-paginas.js`, `quebras-paginas.js`, `grid-colunas-check.cjs`, `cards-altura-check.cjs`, `auditoria-ds/auditar.cjs` nas páginas mudadas e axe nos componentes novos. Resultados no relatório do branch `claude/lacunas-finais` e no changelog.

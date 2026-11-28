# Botão do WhatsApp nos dois DS

- **Status:** pedido da dona do produto (28/11/2026): "O botão do WhatsApp também já está nos botões das redes sociais no design system; precisa estar em ambos os DS."
- **Componente:** `BotaoWhatsApp`, `IconeWhatsApp`, `linkWhatsApp`, `htmlDoBotaoWhatsApp` em `src/app/components/ui/botao-whatsapp.tsx`. Mesma API nos dois DS; os arquivos só diferem no bloco dos valores padrão (número e mensagem do estúdio no DM; sem número no FindLook).
- **Classes:** `.ds-botao-whatsapp` (+ `--na-caixa`, `__icone`) e `.ds-espaco-botao-whatsapp` (bloco `@ds-css-puro` do theme.css)

## Desenho e regras
56 px, verde oficial `--marca-whatsapp` com ícone branco de 28 px (exceção da dona do produto, 19/11/2026), `--shadow-md`, 20 px da borda (24 px a partir de 640 px) mais a área segura do aparelho, camada 45 (acima das faixas fixas, 43, e dos outros flutuantes, 44). O rodapé leva `.ds-espaco-botao-whatsapp` (96 px embaixo) para o botão nunca cobrir o fim da página. Nome acessível em `rotulo` + "(abre em nova aba)", anel de foco, cresce 5% no hover, parado com "menos movimento". Ícone em comum com o `LinkDeRedeSocial`.

## Pendência conhecida
O ícone branco sobre o verde tem 2:1 (abaixo dos 3:1 de elementos gráficos); fica como exceção da dona do produto, já registrada.

## Testes (28/11/2026)
- Build dos dois DS sem erro; `node scripts/gerar-catalogo.mjs --check` em dia nos dois; `comparar-ds.mjs` limpo (104 arquivos de ui/ em comum, todos com os mesmos componentes e props).
- `todas-paginas.js` e `quebras-paginas.js`: 30 páginas (DM) e 34 (FindLook) sem erro, sem página vazia e sem rolagem horizontal. `grid-colunas-check.cjs`: nenhuma falha. `cards-altura-check.cjs`: FindLook sem falha; no DM, só os avisos já existentes em Fundamentos › Tipografia e Gráficos (seções não mexidas).
- Testes do componente (Playwright, 390, 768, 1024 e 1280 px): medidas, contraste, toque, nova aba, hover, foco, menos movimento e axe sem violações nas seções (scripts em `rede-social/` da pasta de trabalho).

## Capturas
`rede-social/cap/fl-secao-whatsapp-390.png`.

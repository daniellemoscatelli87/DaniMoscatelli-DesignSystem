# Card de depoimento (padrão dos dois DS)

- **Status:** decisão da dona do produto (28/11/2026): "Use o componente de depoimento do Design System … leve o componente de depoimento para o FindLook, adaptado para feedbacks de clientes que usaram a plataforma."
- **Componente:** `CardDeDepoimento` em `src/app/components/ui/card-de-depoimento.tsx` (arquivo idêntico nos dois DS); `Avaliacao` (`ui/avaliacao.tsx`) agora também no DS Dani Moscatelli, idêntica
- **Classes:** `.ds-card-depoimento` e partes (`__texto`, `__topo`, `__aspas`, `__pessoa`, `__foto`, `__iniciais`, `__quem`, `__nome`, `__cargo`, `__origem`, `__perfil`) no bloco `@ds-css-puro` do theme.css
- **Branch:** `claude/link-rede-social`

## API
`nome`, `cargo`, `foto` (sem foto: iniciais), `origem` (opcional; "Recomendação no LinkedIn" no DM), `children` e, opcionais, `perfil` ("consumidor" = selo Cliente, "lojista" = selo Loja parceira, no `ChipDeEstado` neutro), `loja` (na linha do cargo) e `nota` (a `Avaliacao` do DS, no alto à direita). No DM, perfil, loja e nota existem mas não são usados.

## Desenho
O mesmo de antes no DM: aspas de 20 px em `--primary-text`, o depoimento primeiro (14 px, `--muted-foreground`, trechos em `<strong>` no `--foreground`), divisor e a pessoa embaixo (foto de 48 px com anel `--primary-muted`). Card só de borda, cantos e respiro de 24 px, altura total da célula. Cores por token (no FindLook, o rosa da marca).

## Regras
Só feedback real, com autorização; nunca inventar números. Exemplos da documentação do FindLook fictícios ("Pessoa de exemplo", "Loja de exemplo").

## Testes (28/11/2026)
- Build dos dois DS sem erro; `node scripts/gerar-catalogo.mjs --check` em dia nos dois; `comparar-ds.mjs` limpo (104 arquivos de ui/ em comum, todos com os mesmos componentes e props).
- `todas-paginas.js` e `quebras-paginas.js`: 30 páginas (DM) e 34 (FindLook) sem erro, sem página vazia e sem rolagem horizontal. `grid-colunas-check.cjs`: nenhuma falha. `cards-altura-check.cjs`: FindLook sem falha; no DM, só os avisos já existentes em Fundamentos › Tipografia e Gráficos (seções não mexidas).
- Testes do componente (Playwright, 390, 768, 1024 e 1280 px): medidas, contraste, toque, nova aba, hover, foco, menos movimento e axe sem violações nas seções (scripts em `rede-social/` da pasta de trabalho).

## Capturas
`rede-social/cap/fl-depoimentos-fl-390.png` e `rede-social/cap/fl-depoimentos-fl-1280.png`.

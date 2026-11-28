# Pílula de destaque

- **Status:** aprovada (dona do produto, 28/11/2026; prévia `mock-pilulas/pilulas.png`, linha "Proposta")
- **Componentes:** `PilulaDeDestaque`, `GrupoDePilulasDeDestaque`, `htmlDaPilulaDeDestaque` em `src/app/components/ui/pilula-de-destaque.tsx` (arquivo idêntico no DS FindLook)
- **Classes:** `.ds-grupo-pilulas-destaque` (+ `--inicio`), `.ds-pilula-destaque`, `.ds-pilula-destaque__icone` (bloco `@ds-css-puro` do theme.css)
- **Branch:** `claude/link-rede-social`

## Motivo
Os destaques da seção de depoimentos da página inicial ("35 recomendações", "Excelência e compromisso", "Líderes, clientes & pares") usavam estrela em caractere e emoji. Viram componente, com ícones Lucide do DS.

## API e desenho
`icone` (componente Lucide: CircleCheck, Handshake, Users no site) e `children`. Não é link nem botão: `li` dentro de `ul`, sem hover, foco ou cursor de clique. Fundo: metade do `--muted` sobre o card; borda `--border-strong`; texto `--foreground` de 12 px (14 px a partir de 768 px, como no site), peso médio; ícone de 18 px em `--primary-text`; 8 × 16 px de respiro (ritmo de 4/8 px); 12 px entre as pílulas.

## Acessibilidade
Ícone `aria-hidden`; o grupo pede `aria-label` quando não há título perto. Contraste do texto acima de 4,5:1 e do ícone acima de 3:1 (medidos).

## Testes (28/11/2026)
- Build dos dois DS sem erro; `node scripts/gerar-catalogo.mjs --check` em dia nos dois; `comparar-ds.mjs` limpo (104 arquivos de ui/ em comum, todos com os mesmos componentes e props).
- `todas-paginas.js` e `quebras-paginas.js`: 30 páginas (DM) e 34 (FindLook) sem erro, sem página vazia e sem rolagem horizontal. `grid-colunas-check.cjs`: nenhuma falha. `cards-altura-check.cjs`: FindLook sem falha; no DM, só os avisos já existentes em Fundamentos › Tipografia e Gráficos (seções não mexidas).
- Testes do componente (Playwright, 390, 768, 1024 e 1280 px): medidas, contraste, toque, nova aba, hover, foco, menos movimento e axe sem violações nas seções (scripts em `rede-social/` da pasta de trabalho).

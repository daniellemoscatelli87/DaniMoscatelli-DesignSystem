# Link de rede social

- **Status:** aprovado (dona do produto, 28/11/2026; publicação com o "sim" dela)
- **Componentes:** `LinkDeRedeSocial`, `GrupoDeRedesSociais`, `IconeDeRedeSocial`, `htmlDoLinkDeRedeSocial`, `svgDaRedeSocial` em `src/app/components/ui/link-de-rede-social.tsx` (arquivo idêntico no DS FindLook)
- **Classes:** `.ds-link-rede-social` (+ `--md`, `--linkedin` … `--behance`, `__icone`), `.ds-grupo-redes-sociais` (+ `--inicio`), `.ds-so-leitor`, no bloco `@ds-css-puro` do `src/styles/theme.css`
- **Tokens novos:** `--shadow-suave` e `--marca-linkedin`, `--marca-instagram`, `--marca-whatsapp`, `--marca-facebook`, `--marca-youtube`, `--marca-tiktok` (branco no escuro), `--marca-behance`
- **Branch:** `claude/link-rede-social`

## Motivo
As pílulas "Me siga nas redes sociais" da página inicial do site eram marcação feita à mão. Viram componente do DS, com uma fonte só: o desenho mora nas classes do theme.css, que o componente em React aplica e que as páginas originais em HTML usam direto.

## API
`rede` (linkedin · instagram · whatsapp · facebook · youtube · tiktok · behance), `href`, `children`, `tamanho` ("sm" padrão, 32 px, texto de 12 px, ícone de 14 px; "md" 40 px, 14 px, 16 px), `novaAba` (padrão: sim para http/https, com "(abre em nova aba)" só para leitores de tela) e as props do `<a>`. `GrupoDeRedesSociais`: lista `ul/li`, centralizada, 12 px entre as pílulas, `alinhamento="inicio"`.

## Decisões e exceções
- Cores oficiais só no ícone (exceção da dona do produto, 19/11 e 28/11/2026). LinkedIn no azul oficial atual #0A66C2 (o site original usava #0077B5).
- Sombra: a pílula é link, não card; a regra "card sem sombra parada" não vale. Nenhum token tinha o desenho da referência (`shadow-subtle-card`), então nasceu `--shadow-suave`.
- Hover cinza (`--accent`), sobe 2 px e o ícone cresce 10%; foco com `--ring`; parado com "menos movimento". Área de toque de 44 px no celular por uma camada invisível, sem mudar o desenho de 32 px.
- Respiro lateral de 12 px (o site tinha 14 px): o DS só usa o ritmo de 4/8 px. A pílula fica cerca de 3 px mais estreita que a original.
- Ícones: Instagram e YouTube da Lucide 0.487 (ícones preservados); LinkedIn, Facebook e WhatsApp nas marcas cheias que o site já usa; TikTok e Behance do Simple Icons (CC0).
- Os tamanhos de texto ficam no `@theme` do Tailwind, que uma página sem Tailwind não lê: no bloco, levam o valor do próprio token como reserva.

## Testes (28/11/2026)
- Build dos dois DS sem erro; `node scripts/gerar-catalogo.mjs --check` em dia nos dois; `comparar-ds.mjs` limpo (104 arquivos de ui/ em comum, todos com os mesmos componentes e props).
- `todas-paginas.js` e `quebras-paginas.js`: 30 páginas (DM) e 34 (FindLook) sem erro, sem página vazia e sem rolagem horizontal. `grid-colunas-check.cjs`: nenhuma falha. `cards-altura-check.cjs`: FindLook sem falha; no DM, só os avisos já existentes em Fundamentos › Tipografia e Gráficos (seções não mexidas).
- Testes do componente (Playwright, 390, 768, 1024 e 1280 px): medidas, contraste, toque, nova aba, hover, foco, menos movimento e axe sem violações nas seções (scripts em `rede-social/` da pasta de trabalho).

## Capturas
`rede-social/lado.png` (referência | DS a 390 e a 1280 px, a partir do HTML puro gerado por `htmlDoLinkDeRedeSocial` com o theme.css cru).

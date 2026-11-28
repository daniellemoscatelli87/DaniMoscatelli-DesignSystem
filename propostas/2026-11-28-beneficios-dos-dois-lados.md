# Benefícios dos dois lados

- **Status:** proposta (prévia aprovada pela dona do produto em 28/11/2026; publicação com o "sim" dela)
- **Componente:** `BeneficiosDosDoisLados` em `src/app/components/ui/beneficios-dos-dois-lados.tsx` (o mesmo arquivo nos dois DS); classes `.ds-beneficios-lados` em `src/styles/theme.css` (bloco `@ds-css-puro:beneficios-dos-dois-lados`, igual nos dois DS)
- **Data:** 2026-11-28
- **Branch:** `claude/icones-e-beneficios`
- **Documentação:** DM: Seções do site › Benefícios dos dois lados (`secoes-site#secoes-beneficios`), com o conteúdo real do Projeto Piloto. FindLook: Moldura do site › Benefícios dos dois lados (`site#site-beneficios`), com um exemplo fictício identificado como tal.

## Motivo
Na página Projeto Piloto do site do estúdio, "Para sua empresa" e "Para o Studio" eram dois cards separados, feitos à mão. A dona do produto aprovou a prévia `mock-ben2/ben4.png` (`index3.html`): um card só, com alternador no celular e colunas lado a lado com espaço, e pediu que etiqueta, título e lista fiquem alinhados entre as colunas.

## Regra
- O bloco só informa: o ícone de cada lado fica no tom informativo (colorido na base cinza clara), pela regra do ícone com base de 28/11/2026. Nada clicável dentro das colunas; a ação vem embaixo do bloco.
- Uma fonte só do desenho: as classes em CSS puro. O componente em React só monta o HTML com elas; as páginas em HTML puro usam as mesmas classes, sem JavaScript.

## API
```tsx
<BeneficiosDosDoisLados
  lados={[
    { id: "empresa", rotulo: "Para sua empresa", icone: <Building />,
      titulo: "Mais clareza para tomar decisões que impulsionam seu negócio.",
      itens: ["Diagnóstico especializado", "Identificação de fricções e oportunidades", "Recomendações priorizadas para decisões e melhorias concretas"] },
    { id: "studio", rotulo: "Para o Studio", icone: <Sparkles />,
      titulo: "Experiência que amplia nossa prática.",
      itens: ["Atuação em diferentes setores e contextos", "Evolução contínua de métodos e ferramentas", "Possibilidade de documentar estudos de caso, mediante autorização"] },
  ]}
/>
```
- `lados`: `{ id, rotulo, icone, titulo, itens: ReactNode[] }[]`, dois (o uso normal) ou três.
- `ladoInicial` (padrão: o primeiro), `rotulo` (nome do grupo do alternador, padrão "Benefícios"), `nivel` (nível do título de cada lado, padrão 3), `className` e as props de `div`.

## Medidas e estados
- Card do DS só de borda, cantos do Card, 24 px de respiro (16 px num contêiner com menos de 22rem; 32 px com as colunas).
- Contêiner estreito: alternador compacto (trilho cinza `--muted` de 40 px, 4 px de respiro; opção escolhida em branco `--card` com borda e `--shadow-sm`; texto de 12 px seminegrito; ícone de 14 px, colorido `--primary-text` na opção escolhida). Cada opção tem a largura do próprio nome, para o nome inteiro caber (medido sem reticências a 310 px de contêiner, nos dois DS). Área de toque de 44 px. Embaixo, título (20 px, negrito) e lista do lado escolhido.
- Com espaço (contêiner a partir de 40rem; 56rem com três lados): sem alternador. Grade `1fr 1px 1fr` com 32 px entre a coluna e a linha; linhas `auto auto 1fr`; cada coluna ocupa as três linhas com `grid-template-rows: subgrid` e as partes com `align-self: start`. Etiqueta, título e lista começam na mesma altura em todas as colunas.
- Lista: `CircleCheckBig` de 20 px em `--primary-text`, 12 px entre ícone e texto e entre itens; texto de 16 px em `--muted-foreground`.
- Movimento: a opção escolhida muda de cor suavemente (`--duration-normal`) e o lado escolhido aparece com fade de 4 px; nada com "menos movimento".

## Acessibilidade
- O alternador é um grupo de rádios nativos (`role="radiogroup"` com nome): Tab entra no grupo e as setas trocam o lado. Foco: contorno `--ring`.
- Ícones com `aria-hidden`; o nome do lado está escrito. Título de cada lado num `h3` (ou o nível pedido).
- axe (WCAG 2.0/2.1/2.2 AA e boas práticas) sem violações na seção, a 390 e 1280 px, nos dois DS.

## Testes
`pnpm build`, `gerar-catalogo --check`, `comparar-ds.mjs` sem diferenças novas, `todas-paginas.js`, axe e medidas (alinhamento: a 768, 1024 e 1280 px, etiqueta, título e lista com o mesmo topo nas duas colunas, com títulos de uma e de duas linhas).

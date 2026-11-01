# Dani Moscatelli Design System

Design system oficial do estúdio Dani Moscatelli | Experience Design Studio, publicado em https://daniellemoscatelli87.github.io/DaniMoscatelli-DesignSystem/ e mostrado no site em https://www.danimoscatelli.com.br/designsystem.

Desde 01/11/2026 este repositório é a única fonte da verdade do design system: as alterações são feitas direto aqui (não mais pelo Figma Make). A publicação é automática pelo repositório `DaniMoscatelli-DesignSystem-Deploy`, com versionamento (`v1`, `v2`, ...) e trava contra remoções acidentais.

## Rodar

`pnpm install` e `pnpm dev`. Build com `pnpm build` (o GitHub Pages depende de `base: '/DaniMoscatelli-DesignSystem/'` no `vite.config.ts`).

## Estrutura

- `src/styles/theme.css`: tokens (escalas graphite e crimson, semânticos claro e escuro, sombras, raio).
- `src/app/components/ui/`: componentes (shadcn/ui + Radix).
- `src/app/components/showcase/`: páginas do design system; `shared/changelog.ts` é o histórico de mudanças mostrado na página inicial.
- `src/imports/`: logos em PNG e SVG.

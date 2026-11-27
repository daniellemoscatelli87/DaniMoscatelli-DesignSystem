# Tokens: sobreposição, raio de pílula, variante de toque e escala de texto

- **Status:** proposta
- **Componente:** tokens em `src/styles/theme.css`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** comentários do `theme.css`; usados por todas as páginas novas (Molduras e estados, Campos, Peças da área restrita, Seções do site)

## Motivo e justificativa de cada token
- **`--sobreposicao`** (grafite 950 a 50%, classe `bg-sobreposicao`): o véu atrás de janelas, gavetas e do menu do celular. Era necessário porque cada peça tinha o seu (`bg-black/50` no Dialog, Sheet, Drawer e AlertDialog; `bg-foreground/40` no SidePanel) e a área restrita em HTML definia o próprio `--sobreposicao` no `admin.css`. O menu do CabecalhoDoSite já usa; as janelas existentes devem passar a usar na correção delas (fora deste branch, para não mexer em componente existente).
- **`--radius-full`** (9999px), só no `:root`: a área restrita em HTML (`admin.css:5-12`) redefinia `--radius-full` porque o `theme.css` não tinha. No Tailwind continua `rounded-full` (não entra no `@theme`, para não mudar a classe).
- **Pontos de quebra: não criados.** Variável CSS não funciona dentro de `@media`, então um token não ajudaria; o DS usa os pontos do Tailwind (640, 768, 1024, 1280) e, nos componentes novos, container queries (largura do próprio componente). Os dois pontos soltos da área restrita (`min-[420px]`, `min-[44rem]`) somem quando ela usar estes componentes.
- **Variante `toque` e escala de texto** (`text-display-*`, `text-h1…h4`, `text-subtitle*`, `text-body*`, `text-button`, `text-label`, `text-caption`) e a regra base de 44 px no toque: a convenção dos dois DS definida no branch `claude/correcoes-auditoria` (texto idêntico ao do FindLook DS). Entram aqui para os componentes novos já nascerem nela; no merge com o branch de correções, fica a definição de lá.

## Acessibilidade
Véu com contraste suficiente para separar a janela da página; alvos de 44 px no celular e em telas de dedo.

## Testes
`pnpm build` e as páginas novas nas quatro larguras.

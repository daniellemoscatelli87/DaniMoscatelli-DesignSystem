# Chip de estado

- **Status:** proposta
- **Componente:** `ChipDeEstado` em `src/app/components/ui/chip-de-estado.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/pecas-do-painel`
- **Documentação:** Templates › Peças do painel, item 6 (`templates#template-painel-pecas`)

## Motivo
O catálogo não tem um chip de estado com texto. `Badge` não tem tons de estado e o `StatusChip` existe só no DS da FindLook, preso aos estados de informação de peça e loja. Na Início da área restrita, o estado das mensagens aparecia só pela forma do ícone e pela cor da base, contra a regra "estado nunca só por cor ou forma".

## Tela de origem
Área restrita em React, Início, listas Contato e Parceiros (revisão de design de 27/11/2026).

## API
`tom` ("marca" | "neutro" | "sucesso" | "info" | "aviso" | "erro", padrão "neutro"), `icone` (opcional), `tamanho` ("sm" 24 px, padrão; "md" 28 px), `children` (o texto, obrigatório).

```tsx
<LinhaDeLista titulo="Ana Ribeiro" fim={<ChipDeEstado tom="marca">Não lida</ChipDeEstado>} />
```

## Variações e estados
Seis tons e dois tamanhos, com ou sem ícone. Não é interativo (sem hover nem foco); fica dentro de linhas que podem ser links.

## Acessibilidade
Texto sempre visível. Contraste do texto sobre o fundo do chip: marca 5,5:1; neutro 14,8:1; sucesso 4,8:1; info 4,9:1; aviso 4,9:1; erro 4,8:1. `whitespace-nowrap`: o chip nunca quebra em duas linhas. Na LinhaDeLista, a coluna do fim nunca deixa o texto passar por baixo e, no celular, desce para uma linha própria.

## Testes
`pnpm build`, `pnpm catalogo:check`, `todas-paginas`, `quebras-paginas`, `cards-altura-check` e `grid-colunas-check`; no produto, o teste do navegador da Início confere o texto de estado em cada linha.

## Capturas
Templates › Painel e a Início da área restrita (`admin-react-inicio-v3-*.png`).

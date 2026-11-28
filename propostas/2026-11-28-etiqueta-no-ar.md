# Etiqueta "No ar" com a bolinha piscando

- **Status:** aprovada (decisão da dona do produto, 28/11/2026)
- **Componente:** `ChipDeEstado`, nova prop `aoVivo` em `src/app/components/ui/chip-de-estado.tsx` (mesma API no DS FindLook)
- **Branch:** `claude/etiqueta-no-ar`

## Motivo
Decisão da dona do produto, nas palavras dela: "A tag no ar está fora de padrão. Onde 'no ar' aparecer ele tem que vir no formato de tag com a bolinha piscando". Antes, "No ar" aparecia como um ChipDeEstado verde sem bolinha (painel do site do estúdio) ou como texto cinza solto na descrição (lista de pesquisas).

## API e desenho
- `aoVivo` (boolean, padrão `false`): antes do texto, uma bolinha de 8 px na cor cheia do tom (`bg-success` no sucesso; `bg-primary`, `bg-muted-foreground`, `bg-info`, `bg-warning`, `bg-error` nos outros) e, por baixo, um halo da mesma cor que pulsa (`motion-safe:animate-ping`, 75% de opacidade).
- Uso: "No ar" = `<ChipDeEstado tom="sucesso" aoVivo>No ar</ChipDeEstado>`; "Fora do ar" = `<ChipDeEstado tom="neutro">Fora do ar</ChipDeEstado>`, sem bolinha.
- O resto do chip (tons, alturas, ícone) não muda. Atributo `data-ao-vivo` no chip e `data-slot="chip-de-estado-ponto"` na bolinha.
- Sem cor nova: só os tokens de estado que já existem.

## Acessibilidade
- A bolinha é `aria-hidden`; quem diz o estado é o texto (estado nunca só por cor).
- Com "menos movimento" (`prefers-reduced-motion: reduce`), o halo some (`motion-reduce:hidden`) e fica só a bolinha parada.

## Documentação
Templates › Painel administrativo › 6. Chip de estado (`#template-painel-no-ar`, em `showcase/PainelTemplates.tsx`): exemplo ao vivo "No ar" ao lado de "Fora do ar", a regra "Onde 'No ar' aparecer: etiqueta com a bolinha piscando" e faça/não faça. Changelog no topo.

## Onde já passa a valer no DS
o badge "Ao vivo" de Feedback › Badges (bolinha parada feita à mão) e o chip "Online" do chat ao vivo no template de landing (`TemplatesResponsivos.tsx`).

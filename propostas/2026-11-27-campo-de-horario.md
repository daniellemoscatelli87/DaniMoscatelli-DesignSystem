# Campo de horário

- **Status:** proposta
- **Componente:** `CampoDeHorario` em `src/app/components/ui/campo-de-horario.tsx`
- **Data:** 2026-11-27
- **Branch:** `claude/componentes-novos`
- **Documentação:** Campos › Campo de horário (`campos#campos-horario`)

## Motivo
A área restrita precisa marcar reunião (Contato) e agendar envio (Parceiros) com hora; o DS só tinha o Calendar (data). Item 10 de `docs/engineering/ADMIN_REACT.md` §7.1 (claude).

## Tela de origem
Área restrita › Contato (marcar reunião) e Parceiros (agendar envio).

## API
`valor` ("HH:MM"), `onValorChange`, `rotulo` ("Horário"), `passo` (15), `inicio` ("07:00"), `fim` ("21:00"), `indisponiveis` (string[]), `fuso` ("Horário de Brasília (UTC−3)"), `placeholder`, `obrigatorio`, `desabilitado`, `erro`, `id`, `className`.

## Variações e estados
Select do DS com os horários em passos; horários indisponíveis riscados e desativados; fuso sempre escrito embaixo; erro com ícone + texto.

## Acessibilidade
Rótulo ligado; o fuso e o erro entram no aria-describedby; "(indisponível)" para leitores de tela; 44 px no toque.

## Testes
`pnpm build`, `pnpm catalogo:check`, os scripts de páginas e a auditoria nas páginas novas.

## Capturas
`capturas-dm-novos-v2/<largura>-campos-horario.png`.

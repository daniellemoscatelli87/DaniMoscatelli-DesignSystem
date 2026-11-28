# Caixa de consentimento

- **Status:** aprovada (dona do produto, 28/11/2026; publicação com o "sim" dela)
- **Componente:** `CaixaDeConsentimento` em `src/app/components/ui/caixa-de-consentimento.tsx` (mesmo arquivo e API no DS FindLook)
- **Data:** 2026-11-28
- **Branch:** `claude/pagina-404-padrao`
- **Documentação:** Campos › Caixa de consentimento (`campos#campos-consentimento`)

## Motivo
O consentimento de avisos aparecia com um círculo (que lê como rádio) num card de borda rosa. A dona do produto aprovou um card que se marca inteiro, com caixa QUADRADA. A comparação da área restrita também notou que a Checkbox do DS parecia redonda: os cantos passam de 8 px para 6 px (novo `--radius-xs`).

## Tela de origem
Formulários do site com "Sim, quero receber os avisos." Prévia aprovada: `mock-consent/consent.png` (os dois estados "Proposta").

## API
`titulo` (16 px seminegrito), `children` (frase numa linha corrida) ou `paragrafos` (lista; cada item numa linha nova, por exemplo "Posso revogar…" depois de "Política de Privacidade."), `erro`, `onCheckedChange(marcado)`, `className` e as props da caixa nativa (`checked`, `defaultChecked`, `onChange`, `disabled`, `name`, `required`, `id`…). Ref vai para o input.

## Variações e estados
Desmarcado: card branco, borda neutra, hover cinza claro. Marcado: fundo `--primary-suave`, borda `--primary`, caixa cheia na primária com check branco (entra com um pequeno movimento). Foco: anel em volta do card. Erro: borda `--error` e `MensagemDeErro` embaixo. Desativado: 50% de opacidade, sem clique.

## Acessibilidade
Caixa nativa dentro de um `<label>`: o card inteiro é o alvo (bem acima de 44 px). Nome acessível = título (aria-labelledby); a frase e o erro em aria-describedby; aria-invalid no erro. Clicar num link do texto abre o link e não marca. Texto em grafite 600 (10,3:1 no branco, 9,1:1 no rosa do selecionado); links em `--primary-text`. Movimento só sem "menos movimento".

## Testes
Teste de interação (clique no card marca; clique no link não marca; espaço alterna; erro com borda e mensagem; desativado), axe sem violações a 390 e 1280 px; ver o relatório do branch.

## Capturas
`shots-404/dm-consentimento-390.png`.

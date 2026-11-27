# CampoDeEndereco (endereço com sugestões)

- **Status:** proposta
- **Componente:** `CampoDeEndereco`, `buscaNoPhoton`, `enderecoDoPhoton`, `textoDaSugestao` em `src/app/components/ui/campo-de-endereco.tsx` (mesmo arquivo nos dois DS)
- **Data:** 2026-11-27
- **Branch:** `claude/consistencia-final`
- **Documentação:** Campos › Endereço com sugestões

## Motivo
A área restrita em HTML (Contatos › Agendar reunião › Presencial) sugeria endereços do OpenStreetMap enquanto a pessoa digitava; a versão em React perdeu isso. Nenhum componente do catálogo fazia combobox com busca.

## Tela de origem
Área restrita do site do estúdio, agendamento de reunião presencial (`public/admin/contatos/index.html`, removido em b6808e3). O pedido usava o serviço Photon (dados do OpenStreetMap): `https://photon.komoot.io/api/?limit=5&lat=-25.43&lon=-49.27&q=<texto>`, só resultados do Brasil, depois de 350 ms e com 3 letras ou mais.

## API
`rotulo`, `valor`, `onValorChange`, `buscar(texto, sinal)` → `Promise<{ id, titulo, linha }[]>`, `onEscolher`, `atraso` (350), `minimo` (3), `textos`, e as props do Campo (`ajuda`, `erro`, `obrigatorio`, `opcional`, `placeholder`). O DS não chama serviço nenhum sozinho: `buscaNoPhoton({ lat, lon, limite, pais })` devolve uma função `buscar` com o mesmo pedido da área restrita, para o produto usar se quiser.

## Variações e estados
Procurando (girando), lista de sugestões, nenhum resultado, erro; em todos a pessoa continua escrevendo à mão.

## Acessibilidade
Combobox ARIA 1.2: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`; lista `role="listbox"` com `role="option"`; setas, Enter e Esc; quantidade de sugestões anunciada (`aria-live`); opções de 44 px no toque; rótulo, ajuda e erro do Campo.

## Testes
Navegador (Playwright): com 2 letras não abre; com 3, depois da espera, 3 sugestões e "3 sugestões de endereço" anunciado; setas mudam a opção ativa (aria-activedescendant); Enter escolhe e fecha; texto sem resultado mostra "Nenhum endereço encontrado". axe na página Campos: sem falhas.

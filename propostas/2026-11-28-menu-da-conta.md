# Menu da conta

- **Status:** aprovada (pedido da dona do produto, 28/11/2026)
- **Componentes:** `MenuDaConta`, `CabecalhoDaConta`, `ItemDaConta`, `SeparadorDaConta` em `src/app/components/ui/menu-da-conta.tsx` (arquivo idêntico nos dois DS)
- **Data:** 2026-11-28
- **Branch:** `claude/menu-da-conta`
- **Documentação:** Overlays › Menu da conta (`overlays#menu-da-conta`)

## Motivo
Pedido da dona do produto (28/11/2026): "também precisamos padronizar no Design System os componentes de detalhamento ali do perfil [...]. Não é para o nome e o e-mail serem links." Na captura do painel no iPhone, o nome e o e-mail apareciam sublinhados como links. No código eram texto (`span`); o sublinhado vinha do Safari do iPhone, que transforma e-mails e outros dados em links sozinho ("data detectors"). Cada tela montava o menu à mão com `DropdownMenuLabel`.

Também a pedido da dona: "remova essa marcação vermelha que deixa o item selecionado". Depois de fechar o menu tocando, o gatilho (avatar e seta) ficava com o anel vermelho de foco, porque o menu devolve o foco ao gatilho e o Safari mostra esse foco.

## Tela de origem
Área restrita Dani Moscatelli, cabeçalho do painel (`apps/area-restrita/src/casca/Casca.tsx`, `MenuDaConta`), no iPhone (Safari). Templates de painel dos dois DS.

## API
- `MenuDaConta`: `nome` (obrigatório), `email`, `detalhe` (outra linha de apoio: papel, loja), `foto`, `papel` (ao lado do nome no gatilho), `rotuloDoGatilho`, `classeDoGatilho`, `gatilho` (um gatilho próprio), `aberto` e `onAbertoChange`, `align` (padrão `end`) e as outras props do `DropdownMenuContent`; `children` são as ações.
- `ItemDaConta`: `icone` (Lucide) e as props do `DropdownMenuItem` (`onSelect`, `disabled`, `asChild`). Com `asChild`, o ícone entra dentro do link filho (link do roteador do produto).
- `SeparadorDaConta`: divisor entre grupos de ações.
- `CabecalhoDaConta`: nome e e-mail, para quem monta o menu de outro jeito.
- `GatilhoDaConta` (painel-shell) ganhou `rotulo`: o nome para o leitor de tela vai como texto escondido, e não mais como `aria-label`, para o nome visível continuar dentro do nome lido (WCAG 2.5.3). Sem mudança visual; quem passa `aria-label` continua funcionando.

```tsx
<MenuDaConta nome={perfil.nome} email={perfil.email} foto={perfil.foto}>
  <ItemDaConta icone={<Settings />} asChild><LinkDaArea href="/admin/configuracoes/">Configurações</LinkDaArea></ItemDaConta>
  <ItemDaConta icone={<LogOut />} onSelect={sair}>Sair</ItemDaConta>
</MenuDaConta>
```

## Variações e estados
- Desenho igual ao do painel (regra da dona: o que existe nos produtos vai ao DS como está): menu do `DropdownMenu` do DS, sem mudança; nome semibold em `--foreground` (14 px); e-mail em `text-label` e `--muted-foreground` (12 px); divisor; ações com ícone cinza; Sair neutro (não é exclusão).
- Largura: no mínimo 224 px; cresce até 320 px; passando disso, o e-mail termina em reticências.
- Foco: aberto ou fechado com toque/clique, o foco não volta marcado ao gatilho. Pelo teclado (Enter ou Espaço abre, Esc fecha), o foco volta ao gatilho com o anel.

## Acessibilidade
- Nome e e-mail são texto (`span` dentro do rótulo do menu), sem sublinhado, sem cor de link, não focáveis e sem toque. Links que o iPhone criar dentro do cabeçalho (`a[x-apple-data-detectors]`) herdam a cor, perdem o sublinhado e não respondem ao toque.
- As páginas que usam o menu devem ter `<meta name="format-detection" content="telephone=no, email=no, address=no, date=no">`; os dois sites do DS passaram a ter.
- O e-mail cortado continua inteiro na página para o leitor de tela; nome e e-mail com `translate="no"`.
- Teclado do Radix (setas, Home/End, Esc); anel de foco mantido para o teclado (WCAG 2.4.7).
- Itens do menu com 28 px de altura, como no painel (acima dos 24 px da WCAG 2.5.8; abaixo dos 44 px da regra do celular): mantido para não mudar o desenho do DropdownMenu, levado à dona do produto.

## Testes (28/11/2026)
- Build dos dois DS sem erro; `gerar-catalogo.mjs --check` em dia; `comparar-ds.mjs` com a lista de marca: saída 0 (menu-da-conta.tsx igual nos dois).
- `todas-paginas.js` e `quebras-paginas.js`: 30 páginas (DM) e 34 (FindLook) sem erro, sem página vazia e sem rolagem horizontal.
- axe na seção nova (390 e 1280, claro e escuro): sem violações; e na Barra superior do FindLook. Nos templates de painel, só violações que já existiam e não são do menu (landmarks `main` aninhados, contraste do endereço de exemplo, seletor de loja).
- Playwright (`conta/teste-menu.cjs` na pasta de trabalho), 390 (toque) e 1280 (mouse), escala 2: nome e e-mail são `span`, nenhum `a`, `text-decoration: none`; link do iPhone simulado (`a[x-apple-data-detectors]`) fica com a cor do texto, sem sublinhado e sem toque; menu dentro da tela; toque num item ou fora: gatilho sem foco e sem anel; Enter e Espaço abrem com foco no 1º item, Esc fecha e o foco volta ao gatilho com anel; aberto pelo teclado e fechado com toque: sem anel; e-mail longo com reticências e texto inteiro.
- Não verificável aqui: os links automáticos do iPhone não acontecem no Chrome/Playwright; a proteção foi conferida no código e com um link simulado, não num iPhone de verdade.

## Capturas
`conta/` da pasta de trabalho: menu aberto a 390 e 1280, e-mail longo, gatilho depois do toque (390) e depois do Esc (1280), nos dois DS.

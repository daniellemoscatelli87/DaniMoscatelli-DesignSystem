# Consistência entre os dois design systems

- **Status:** proposta
- **O quê:** mesmos componentes e mesmas props nos arquivos de `ui/` que o FindLook e o Dani Moscatelli têm em comum; bordas de campo com 3:1; ícones de estado; véu das janelas; tabelas da documentação; Calendar; e os pedidos das migrações dos produtos.
- **Data:** 2026-11-27
- **Branch:** `claude/consistencia-final` (nos dois repositórios)
- **Conferência:** `node scripts/comparar-ds.mjs <pasta-do-DS-FindLook> --ignorar scripts/comparar-ds-marca.json` (sai com erro se aparecer diferença nova)

## Motivo
Os dois DS nasceram separados e os produtos começaram a trocar peças entre eles. Com o mesmo nome e props diferentes, quem usa um não consegue usar o outro, e o mesmo sinal passava a ter dois sentidos (o triângulo era erro num DS e aviso no outro).

## Decisões
- **Bordas de campo (WCAG 1.4.11):** `--input` = grafite 400 nos dois. FindLook #888896: 3,49:1 no branco e 3,24:1 no cinza #F6F6F7 (antes rgba(0,0,0,.18) = 1,53:1). Dani Moscatelli #627288: 4,9:1 no branco e 4,29:1 no fundo #EDF0F5 (antes 1,4:1; o grafite 300 dá 2,93:1 e não chega a 3:1). Vale para campo, seleção, área de texto, caixa de marcar, opção, botão de contorno e chips; o trilho do interruptor desligado também (`--switch-background`). `--border-strong` fica só para cards e divisores.
- **Ícones de estado:** aviso = AlertCircle (! no círculo, o âmbar aprovado pela dona do produto no AlertaComAcao); erro = XCircle (X no círculo). O triângulo saiu dos estados: no mundo ele quer dizer atenção, e usá-lo para erro enquanto o círculo é aviso inverteria a convenção. O X no círculo se distingue do ! mesmo sem cor e em 16 px.
- **Véu:** `--sobreposicao` (grafite 950 a 50%) em toda janela, gaveta, folha, painel lateral e menu do celular, sem desfoque, nos dois.
- **Peças a mais de um produto** no mesmo arquivo (por exemplo, MenuDoCelular e as peças do painel do FindLook) ficam como diferença de marca, listadas em `scripts/comparar-ds-marca.json`, assim como o CardIndicador, que tem um desenho de marca em cada DS.

## Resultado do script (este DS × FindLook)
Gerado por `scripts/comparar-ds.mjs`. 94 arquivos de ui/ existem nos dois; 94 com os mesmos componentes e as mesmas props (fora as diferenças de marca listadas).

| Arquivo | Componentes em comum | Resultado |
|---|---|---|
| accordion.tsx | 4 | igual |
| alert-dialog.tsx | 11 | igual |
| alert.tsx | 3 | igual |
| alerta-com-acao.tsx | 3 | igual |
| aspect-ratio.tsx | 1 | igual |
| avatar-circles.tsx | 1 | igual |
| avatar.tsx | 3 | igual |
| badge.tsx | 1 | igual |
| botao-de-envio.tsx | 1 | igual |
| breadcrumb.tsx | 7 | igual |
| button.tsx | 1 | igual |
| cabecalho-do-site.tsx | 1 | igual |
| calendar.tsx | 1 | igual |
| campo-de-busca.tsx | 1 | igual |
| campo-de-endereco.tsx | 1 | igual |
| campo.tsx | 6 | igual |
| card.tsx | 8 | igual |
| carousel.tsx | 5 | igual |
| cartao-de-escolha.tsx | 2 | igual |
| chart.tsx | 4 | igual |
| checkbox.tsx | 1 | igual |
| chip-de-estado.tsx | 1 | igual |
| chip-filtravel.tsx | 2 | igual |
| collapsible.tsx | 3 | igual |
| command.tsx | 9 | igual |
| context-menu.tsx | 15 | igual |
| contrast.ts | 0 | igual |
| conversa.tsx | 4 | igual |
| dialog.tsx | 10 | igual |
| divisor-do-card.tsx | 1 | igual |
| doodle-texture.tsx | 1 | igual |
| drawer.tsx | 10 | igual |
| dropdown-menu.tsx | 15 | igual |
| estado-vazio.tsx | 3 | igual |
| form.tsx | 7 | igual |
| glass-card.tsx | 2 | igual |
| grade-de-cards.tsx | 3 | igual |
| graficos-catalogo.tsx | 23 | igual |
| graficos-inteligencia.tsx | 18 | igual |
| graficos-paleta.ts | 0 | igual |
| heading.tsx | 2 | igual |
| hover-card.tsx | 3 | igual |
| icones-preservados.tsx | 18 | igual |
| input-otp.tsx | 4 | igual |
| input.tsx | 1 | igual |
| label.tsx | 1 | igual |
| linha-de-lista.tsx | 1 | igual |
| link-saiba-mais.tsx | 1 | igual |
| links.tsx | 3 | igual |
| logo.tsx | 1 | igual |
| lucide-catalogo.ts | 0 | igual |
| luzes-difusas.tsx | 1 | igual |
| menubar.tsx | 16 | igual |
| moldura-de-conta.tsx | 1 | igual |
| navigation-menu.tsx | 8 | igual |
| pagination.tsx | 7 | igual |
| painel-cabecalho.tsx | 1 | igual |
| painel-dados.tsx | 7 | igual |
| painel-shell.tsx | 14 | igual |
| partner-card.tsx | 1 | igual |
| password-field.tsx | 2 | igual |
| popover.tsx | 4 | igual |
| progress.tsx | 1 | igual |
| prosa.tsx | 1 | igual |
| quadro.tsx | 1 | igual |
| radio-group.tsx | 2 | igual |
| resizable.tsx | 3 | igual |
| scroll-area.tsx | 2 | igual |
| segmented-control.tsx | 1 | igual |
| select.tsx | 10 | igual |
| selo-secao.tsx | 1 | igual |
| selo.tsx | 1 | igual |
| separator.tsx | 1 | igual |
| sheet.tsx | 8 | igual |
| shine-border.tsx | 2 | igual |
| side-panel.tsx | 8 | igual |
| sidebar.tsx | 23 | igual |
| skeleton.tsx | 1 | igual |
| slider.tsx | 1 | igual |
| sonner.tsx | 1 | igual |
| stepper.tsx | 1 | igual |
| surgir-ao-rolar.tsx | 2 | igual |
| switch.tsx | 1 | igual |
| tabela-adaptavel.tsx | 2 | igual |
| table.tsx | 8 | igual |
| tabs.tsx | 4 | igual |
| textarea.tsx | 1 | igual |
| timeline.tsx | 1 | igual |
| toggle-group.tsx | 2 | igual |
| toggle.tsx | 1 | igual |
| tooltip.tsx | 4 | igual |
| upload.tsx | 5 | igual |
| use-mobile.ts | 0 | igual |
| utils.ts | 0 | igual |

## Diferenças de marca aceitas

| Onde | O quê |
|---|---|
| cabecalho-do-site.tsx | MenuDoCelular |
| chip-filtravel.tsx | GrupoDeChips, ChipDeFiltro, ListaDeFiltrosAtivos |
| conversa.tsx | MolduraDeCelular, CabecalhoDaConversa, BotaoDeResposta, CampoDeMensagem, FolhaDeOpcoes |
| pagination.tsx | PaginationStatus |
| painel-cabecalho.tsx | SeletorDePeriodo, BotaoDividido, BannerPromocional |
| painel-dados.tsx | GraficoDeDesempenho, ItemDeAtividade, ItemDeAcao, ListaDeTendencias, ItemDeChecklist, AnelDePontuacao, CarrosselDeDicas, FaixaDeBeneficios, CardDoPainel, ConteudoRecolhivel, PainelDeUso, CardDeUso, FaixaDeEstado, ProgressoRotulado, ResumoEmLinha |
| painel-dados.tsx#CardIndicador | comoLink, estilo, grafico, acao, apoio, as, compacto, selo, soNumeroNoCelular, tom |
| painel-shell.tsx | SeletorDeLoja, CardDePlano, ContadorDoPainel |
| upload.tsx | UploadTextsProvider |

Só no Dani Moscatelli Design System (26): agenda-do-mes.tsx, aviso-cookies.tsx, aviso-projeto.tsx, barra-de-composicao.tsx, barra-de-numeros.tsx, botao-subir.tsx, botao-whatsapp.tsx, cadastro-em-etapas.tsx, caixa-de-entrada.tsx, campo-copiavel.tsx, campo-de-email.tsx, campo-de-emails.tsx, campo-de-horario.tsx, campo-estado-cidade.tsx, card-de-artigo.tsx, card-de-depoimento.tsx, card-de-navegacao.tsx, card-frente.tsx, cartao-flutuante.tsx, citacao.tsx, curva-secao.tsx, faixa-de-logos.tsx, lista-de-pilares.tsx, pilula-de-acao.tsx, rodape-site.tsx, simulacao.tsx.

Só no FindLook Design System (26): avaliacao.tsx, barra-fixa-celular.tsx, busca-pecas.tsx, cadastro-lojista.tsx, caixa-de-codigo.tsx, card-de-preco.tsx, card-loja.tsx, carregando.tsx, cursor-de-demonstracao.tsx, faixa-parceiros.tsx, fashion-icons.tsx, graficos.tsx, grupo-de-opcoes.tsx, lista-de-vantagens.tsx, mapa-lojas.tsx, miniatura-do-painel.tsx, movimento.ts, numero-animado.tsx, painel-produtos.tsx, product-card.tsx, prova-social.tsx, rodape-do-site.tsx, seletor-de-quantidade.tsx, status-chip.tsx, titulo-de-grupo.tsx, voltar-ao-topo.tsx.


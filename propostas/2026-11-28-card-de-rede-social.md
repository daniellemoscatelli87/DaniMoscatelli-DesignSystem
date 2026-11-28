# Card de rede social (só no DS Dani Moscatelli)

- **Status:** pedido da dona do produto (28/11/2026): "Esse componente entra apenas no Dani Moscatelli, na área de componentes de redes sociais. Porém esse componente está precisando ser enquadrado nos espaçamentos internos do padrão dos cards."
- **Componente:** `CardDeRedeSocial`, `htmlDoCardDeRedeSocial` em `src/app/components/ui/card-de-rede-social.tsx`
- **Classes:** `.ds-card-rede-social` (+ `--<rede>`, `__icone`, `__texto`, `__titulo`, `__descricao`, `__rodape`, `__botao`, `__rotulo`, `__marca`), no trecho "Só no DS Dani Moscatelli" do bloco `@ds-css-puro`

## Por que um card para qualquer rede
`CardDeRedeSocial` com `rede="linkedin"` por padrão, em vez de um `CardDeRecomendacoes` só do LinkedIn: o mesmo desenho serve para "veja todas as avaliações" em outra rede sem um card novo, e reaproveita os ícones e as cores do `LinkDeRedeSocial`.

## API
`titulo`, `descricao`, `href`, `rotuloDoBotao`, `rede` (padrão linkedin), `nivel` (2, 3 ou 4; padrão 3), `novaAba`.

## Desenho (padrão dos cards do DS)
Só borda, cantos e respiro de 24 px; ícone BadgeCheck (Lucide) de 20 px numa base de 44 px com cantos de 16 px, na cor da rede sobre 10% dela; 16 px do ícone ao título (20 px, negrito), 4 px até o texto (14 px), 24 px até o divisor, 16 px até o botão em pílula. Abaixo de 640 px, vertical e o botão na largura inteira (regra da dona do produto para a ação dos cards, 28/11/2026); a partir de 640 px, horizontal (ícone à esquerda, 24 px até o texto) e o botão no canto inferior direito. Botão no azul do LinkedIn (texto branco 5,7:1); nas redes em que o texto branco ficaria abaixo de 4,5:1, a primária do DS. O ícone vai dentro do rótulo do botão, para ficar junto do texto se ele quebrar.

## Testes
48 verificações a 390, 768, 1024 e 1280 px sem falha (respiro, raio, sem sombra, base de 44 px, distâncias, botão largo no celular e à direita no computador, 44 px de toque, contraste, nova aba, axe sem violações). Também conferido em HTML puro (theme.css cru + `htmlDoCardDeRedeSocial`).

## Capturas
`rede-social/recomendacoes-antes-depois.png` (recorte da dona do produto | DS a 390 px).

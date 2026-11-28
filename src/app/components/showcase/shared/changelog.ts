import type { Bi } from "../../../i18n";

export type ChangeKind = "New" | "Updated" | "Removed";

export type ChangeEntry = {
  date: string;
  kind: ChangeKind;
  title: Bi;
  desc: Bi;
  page?: string;
  anchor?: string;
};

// Newest first. Every entry needs both en and pt. Add every new DS inclusion at the TOP of this list.
export const changelog: ChangeEntry[] = [
  {
    date: "Nov 2026", kind: "New", title: { en: "Landing page navigation", pt: "Navegação de landing page" },
    desc: { en: "New page (28/11/2026, approved by the owner; same API in both DS) with the pieces that guide reading on a long page. HeroComAba and AbaSaibaMais: the hero of the studio site as it is live, a rounded panel (16 px of space, corners of 32 px) with a white tab of 320 × 56 cut out at the bottom centre (top corners of 40 px, 16 px text, arrow capsule of 20 × 32); on phones the next section starts with corners of 28 px and a 132 × 28 tab with a 44 px touch area; tapping scrolls smoothly to the next section (instantly with reduced motion) and moves the focus. Parallax (transform only, stopped with reduced motion and on touch screens), MenuDeAncoras (the section being read in selected pink with aria-current; chips that wrap, a vertical list on the computer or a select on phones; sticks below the site header), ProgressoDeLeitura (4 px bar in the brand colour, aria-hidden, no transition) and SecaoFixa (sticky column on the computer, stacked on phones). CurvaSecao, SurgirAoRolar and BotaoSubir are on the same page. Each piece has plain CSS classes (.ds-hero-com-aba, .ds-aba-saiba-mais, .ds-curva-secao, .ds-parallax, .ds-menu-de-ancoras, .ds-progresso-de-leitura, .ds-secao-fixa) in their own block of theme.css, used by the components too: one source for the React apps and the HTML pages of the site.", pt: "Página nova (28/11/2026, aprovada pela dona do produto; mesma API nos dois DS) com as peças que conduzem a leitura de uma página longa. HeroComAba e AbaSaibaMais: o hero do site do estúdio como está no ar, um painel arredondado (16 px de respiro, cantos de 32 px) com uma aba branca de 320 × 56 recortada no centro da base (cantos de cima de 40 px, texto de 16 px, cápsula da seta de 20 × 32); no celular, a seção seguinte começa com cantos de 28 px e a aba de 132 × 28, com área de toque de 44 px; o toque leva à seção seguinte com rolagem suave (instantânea com menos movimento) e põe o foco lá. Parallax (só transform, parado com menos movimento e nas telas de toque), MenuDeAncoras (a seção em leitura no rosa de selecionado, com aria-current; chips que quebram de linha, lista vertical no computador ou lista de seleção no celular; gruda abaixo do cabeçalho do site), ProgressoDeLeitura (barra de 4 px na cor da marca, aria-hidden, sem transição) e SecaoFixa (coluna parada no computador, empilhada no celular). CurvaSecao, SurgirAoRolar e BotaoSubir ficam na mesma página. Cada peça tem classes de CSS puro (.ds-hero-com-aba, .ds-aba-saiba-mais, .ds-curva-secao, .ds-parallax, .ds-menu-de-ancoras, .ds-progresso-de-leitura, .ds-secao-fixa) num bloco próprio do theme.css, usadas também pelos componentes: uma fonte só para os apps em React e as páginas em HTML do site." },
    page: "navegacao-landing",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Consent box and square checkbox", pt: "Caixa de consentimento e caixa de marcar quadrada" },
    desc: { en: "CaixaDeConsentimento (28/11/2026, approved by the owner; same API in both DS): a consent yes in a card ticked as a whole (native checkbox inside a label): square 22 px box with 6 px corners, 16 px semibold title, 14 px dark grey text (graphite 600, 10:1) with links in --primary-text; ticked = --primary-suave background and --primary border; focus ring, error (--error border + MensagemDeErro) and disabled. paragrafos puts each sentence on its own line. The Checkbox is now clearly square: corners of 6 px (new --radius-xs) instead of 8 px, which made the 20 px box look round, like a radio.", pt: "CaixaDeConsentimento (28/11/2026, aprovada pela dona do produto; mesma API nos dois DS): um sim de consentimento num card que se marca inteiro (caixa nativa dentro de um label): caixa quadrada de 22 px com cantos de 6 px, título de 16 px seminegrito, texto de 14 px em cinza escuro (grafite 600, 10:1) com links em --primary-text; marcado = fundo --primary-suave e borda --primary; anel de foco, erro (borda --error e MensagemDeErro) e desativado. paragrafos põe cada frase numa linha nova. A Checkbox fica claramente quadrada: cantos de 6 px (novo --radius-xs) no lugar de 8 px, que deixavam a caixa de 20 px com cara de redonda, como um rádio." },
    page: "campos", anchor: "campos-consentimento",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Pill as the default button shape", pt: "Pílula como forma padrão do botão" },
    desc: { en: "Owner's decision (28/11/2026), in both DS: \"Pill as the default in both projects\". Button is a pill (rounded-full) in every variant and size, with 4 px more padding on each side; icon-only buttons are circles. forma=\"quadrado\" (12 px corners) stays for rare cases (a button glued to a field or inside a straight-cornered toolbar); forma=\"padrao\" is the old name and still works. Same rule in the components that draw buttons: dialogs, calendar (days and arrows), pagination, BotaoDoAlerta and LinkDoAlerta, SegmentedControl (pill track), the copy button, the close buttons of windows and drawers, the password eye and the help button of the panel. Fields, cards and chips keep their shapes.", pt: "Decisão da dona do produto (28/11/2026), nos dois DS: \"Pílula como padrão em ambos os projetos\". O Button é pílula (rounded-full) em qualquer variante e tamanho, com 4 px a mais de cada lado; o botão só de ícone é um círculo. forma=\"quadrado\" (cantos de 12 px) fica para casos raros (botão colado a um campo ou numa barra de ferramentas de cantos retos); forma=\"padrao\" é o nome antigo e continua valendo. A mesma regra nos componentes que desenham botões: janelas, calendário (dias e setas), paginação, BotaoDoAlerta e LinkDoAlerta, SegmentedControl (trilho em pílula), o botão de copiar, os botões de fechar das janelas e gavetas, o olho da senha e o botão de ajuda do painel. Campos, cards e chips mantêm a forma." },
    page: "buttons",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Error colour: the brand red, darker", pt: "Cor de erro: o vermelho da marca, mais escuro" },
    desc: { en: "Owner's decision (28/11/2026, \"Option A\"), replaces the pink of 23/11: --error and --error-text = crimson 500 (#B82828). White text on it 6.2:1; as text 6.2:1 on white, 5.5:1 on the page background, 5.6:1 on the alert background and 4.6:1 on the alert icon base. --error-muted = rgba(184, 40, 40, 0.10) (about #F8EAEA, 5.3:1 with the text). Field error borders use --error (6.2:1). Dark theme: crimson 300 (#E88080), 6.6:1 on the dark card and 6.0:1 on the alert; graphite text on it 6.5:1. Warning, info and success did not change. Alerts, fields, error messages, ResumoDeErros, EstadoFinal, the chat bubble, chips, upload and charts follow the tokens. Only in this DS; FindLook keeps its own.", pt: "Decisão da dona do produto (28/11/2026, \"Opção A\"), substitui o rosa de 23/11: --error e --error-text = carmim 500 (#B82828). Texto branco sobre ele 6,2:1; como texto 6,2:1 no branco, 5,5:1 no fundo da página, 5,6:1 no fundo do alerta e 4,6:1 na base do ícone do alerta. --error-muted = rgba(184, 40, 40, 0,10) (cerca de #F8EAEA, 5,3:1 com o texto). A borda do campo com erro usa o --error (6,2:1). Tema escuro: carmim 300 (#E88080), 6,6:1 no card escuro e 6,0:1 no alerta; texto grafite sobre ele 6,5:1. Aviso, informação e sucesso não mudaram. Alertas, campos, mensagens de erro, ResumoDeErros, EstadoFinal, balão da conversa, chips, envio de arquivos e gráficos seguem os tokens. Só neste DS; o FindLook mantém o dele." },
    page: "feedback",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Field border 50% lighter", pt: "Borda dos campos 50% mais clara" },
    desc: { en: "Owner's decision (28/11/2026): the field border was \"a bit heavy; make it 50% less strong\". --input in the light theme goes from graphite 400 (#627288, 4.9:1 on white) to #B0B8C4 (half of #627288 mixed with white): 2.0:1 on white and 1.75:1 on the page background, below the 3:1 adopted on 27/11 (WCAG 1.4.11). The owner chose it knowingly. It affects fields, selects, checkboxes, radios, outline buttons, chips and the switch when off. Disabled fields stay lighter (--border-strong, 1.4:1, at 50% opacity). Dark theme unchanged. Only in this DS.", pt: "Decisão da dona do produto (28/11/2026): a borda dos campos estava \"um pouco pesada; deixe 50% menos forte\". O --input do tema claro passa do grafite 400 (#627288, 4,9:1 no branco) para #B0B8C4 (metade do #627288 misturado ao branco): 2,0:1 no branco e 1,75:1 no fundo da página, abaixo dos 3:1 adotados em 27/11 (WCAG 1.4.11). A dona do produto escolheu sabendo disso. Vale para campos, seleção, caixa de marcar, opção, botão de contorno, chip e interruptor desligado. O campo desativado continua mais claro (--border-strong, 1,4:1, com 50% de opacidade). Tema escuro sem mudança. Só neste DS." },
    page: "buttons",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Standard 404 page and space below the header", pt: "Página 404 padrão e espaço abaixo do cabeçalho" },
    desc: { en: "Owner's decisions (28/11/2026). PaginaDeErro gains moldura=\"card\" (white border-only card, centred, with the \"Erro 404\" badge from SeloSecao, the title, the text and one pill button; the logo stays only in the header), selo, abaixoDoCabecalho and elemento (\"div\" for demos inside another page); the current API keeps working. Rule: a broken or incomplete link (an e-mail link missing its code) = the standard 404 page; never a form with a disabled button and a notice, never an \"incomplete link\" page. New token --espaco-abaixo-do-cabecalho (32 px on phones and tablets, 64 px from 1024 px, the desktop breakpoint of the grid) and class .ds-abaixo-do-cabecalho, the same in both DS: every page whose content starts right under the site header uses it. Docs: Frames & states › Error page (404) and Grid & spacing › Space below the header, with live examples.", pt: "Decisões da dona do produto (28/11/2026). PaginaDeErro ganha moldura=\"card\" (card branco só de borda, centralizado, com o selo \"Erro 404\" do SeloSecao, o título, o texto e um botão pílula; o logo fica só no cabeçalho), selo, abaixoDoCabecalho e elemento (\"div\" nas demonstrações dentro de outra página); a API de antes continua valendo. Regra: link quebrado ou incompleto (um link de e-mail sem o código) = página 404 padrão; nunca formulário com botão desativado e aviso, nunca uma página \"link incompleto\". Novo token --espaco-abaixo-do-cabecalho (32 px no celular e no tablet, 64 px a partir de 1024 px, o ponto do desktop do grid) e a classe .ds-abaixo-do-cabecalho, iguais nos dois DS: toda página cujo conteúdo começa logo abaixo do cabeçalho do site usa. Documentação: Molduras e estados › Página de erro (404) e Grid e espaçamento › Espaço abaixo do cabeçalho, com exemplos ao vivo." },
    page: "molduras", anchor: "molduras-erro",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Diagrama do ecossistema", pt: "Diagrama do ecossistema" },
    desc: { en: "DiagramaDeEcossistema (28/11/2026), recuperado da roda da Rede de Parceiros em HTML: o centro, as especialidades em pétalas e os setores num anel de fora, ligados por linhas. Lista de verdade (cada anel é uma lista com nome; o desenho é enfeite). A partir de 48 rem de espaço, a roda; abaixo, na vertical, com um tronco saindo do centro e um raio para cada item. Entra ao aparecer na tela; parado com “menos movimento”.", pt: "DiagramaDeEcossistema (28/11/2026), recuperado da roda da Rede de Parceiros em HTML: o centro, as especialidades em pétalas e os setores num anel de fora, ligados por linhas. Lista de verdade (cada anel é uma lista com nome; o desenho é enfeite). A partir de 48 rem de espaço, a roda; abaixo, na vertical, com um tronco saindo do centro e um raio para cada item. Entra ao aparecer na tela; parado com “menos movimento”." },
    page: "secoes-site",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Simulação: cenas no HTML e campos de exemplo", pt: "Simulação: cenas no HTML e campos de exemplo" },
    desc: { en: "Simulacao (28/11/2026): a primeira pintura é igual à do servidor (o Pausar não depende mais de “menos movimento” antes de montar, o que quebrava a hidratação); todas as cenas ficam no HTML, uma por cima da outra, e só a ativa aparece (a tela tem a altura da maior cena). Novo MockDeCampo: campos de exemplo dentro da cena, com o valor sendo digitado, a lista da seleção aberta e as opções marcadas, como na simulação em HTML.", pt: "Simulacao (28/11/2026): a primeira pintura é igual à do servidor (o Pausar não depende mais de “menos movimento” antes de montar, o que quebrava a hidratação); todas as cenas ficam no HTML, uma por cima da outra, e só a ativa aparece (a tela tem a altura da maior cena). Novo MockDeCampo: campos de exemplo dentro da cena, com o valor sendo digitado, a lista da seleção aberta e as opções marcadas, como na simulação em HTML." },
    page: "secoes-site",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Aviso do projeto, faixa de logos e campo de e-mail", pt: "Aviso do projeto, faixa de logos e campo de e-mail" },
    desc: { en: "AvisoProjeto e FaixaDeLogos sem <style> dentro do componente (quebrava a hidratação): as animações viraram tokens no theme.css (--animate-aviso-projeto, --animate-faixa-de-logos). FaixaDeLogos ganha silhueta (logos brancos ou coloridos demais viram uma forma no cinza do token). CampoDeEmail: className, classeDoBloco e inteiro vão para o bloco de fora; classeDoCampo para o campo.", pt: "AvisoProjeto e FaixaDeLogos sem <style> dentro do componente (quebrava a hidratação): as animações viraram tokens no theme.css (--animate-aviso-projeto, --animate-faixa-de-logos). FaixaDeLogos ganha silhueta (logos brancos ou coloridos demais viram uma forma no cinza do token). CampoDeEmail: className, classeDoBloco e inteiro vão para o bloco de fora; classeDoCampo para o campo." },
    page: "secoes-site",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Escolha ordenada e escala de notas", pt: "Escolha ordenada e escala de notas" },
    desc: { en: "Peças da pesquisa Moda em Curitiba, iguais nos dois DS (28/11/2026). EscolhaOrdenada: escolher até N opções na ordem dos toques (1º, 2º, 3º; tocar de novo tira e as de depois sobem; no máximo, as outras travam; a opção exclusiva fica sozinha); caixas de marcar nativas com a posição no nome e anúncio para leitores de tela. EscalaDeNotas e GrupoDeEscalas: nota de 1 a 10 (também 0 a 10 e NPS) em rádios nativos numerados, metade por linha no estreito e todos numa linha a partir de 34 rem, pontas escritas embaixo e erro por aspecto. Escolhido no rosa de selecionado com a borda primária; hover cinza.", pt: "Peças da pesquisa Moda em Curitiba, iguais nos dois DS (28/11/2026). EscolhaOrdenada: escolher até N opções na ordem dos toques (1º, 2º, 3º; tocar de novo tira e as de depois sobem; no máximo, as outras travam; a opção exclusiva fica sozinha); caixas de marcar nativas com a posição no nome e anúncio para leitores de tela. EscalaDeNotas e GrupoDeEscalas: nota de 1 a 10 (também 0 a 10 e NPS) em rádios nativos numerados, metade por linha no estreito e todos numa linha a partir de 34 rem, pontas escritas embaixo e erro por aspecto. Escolhido no rosa de selecionado com a borda primária; hover cinza." },
    page: "campos",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Recorte de foto", pt: "Recorte de foto" },
    desc: { en: "RecorteDeFoto (28/11/2026), igual nos dois DS: escolher a foto na área de envio do DS, arrastar para enquadrar (dedo, mouse ou setas do teclado), zoom de 1 a 3 no controle deslizante, prévia redonda ou quadrada e “Usar esta foto” / “Cancelar”. O recorte é feito no aparelho, num canvas, e sai como arquivo de 600 × 600 px sem os dados escondidos da foto. Sem biblioteca nova.", pt: "RecorteDeFoto (28/11/2026), igual nos dois DS: escolher a foto na área de envio do DS, arrastar para enquadrar (dedo, mouse ou setas do teclado), zoom de 1 a 3 no controle deslizante, prévia redonda ou quadrada e “Usar esta foto” / “Cancelar”. O recorte é feito no aparelho, num canvas, e sai como arquivo de 600 × 600 px sem os dados escondidos da foto. Sem biblioteca nova." },
    page: "upload",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Confete na conquista", pt: "Confete na conquista" },
    desc: { en: "Confete e dispararConfete (28/11/2026), iguais nos dois DS, com o desenho da tela final do cadastro da Rede de Parceiros: papeizinhos caindo por cerca de 3 s, nas cores dos tokens. Com “menos movimento”, nada aparece. EstadoFinal ganha comemorar.", pt: "Confete e dispararConfete (28/11/2026), iguais nos dois DS, com o desenho da tela final do cadastro da Rede de Parceiros: papeizinhos caindo por cerca de 3 s, nas cores dos tokens. Com “menos movimento”, nada aparece. EstadoFinal ganha comemorar." },
    page: "feedback",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Campos: contorno no escuro, desabilitado, erro, prefixo e asterisco", pt: "Campos: contorno no escuro, desabilitado, erro, prefixo e asterisco" },
    desc: { en: "Tokens (28/11/2026): o --input passa a ser só o contorno e nasce o --input-fundo, o preenchimento dos campos no escuro (antes o mesmo valor fazia as duas coisas, e a borda no escuro tinha 1,03:1). Contorno no escuro: grafite 400 (#627288): 3,63:1 no card, 3,62:1 no campo e 3,85:1 no fundo. Interruptor desligado no escuro no mesmo grafite. Desabilitado: o contorno volta ao cinza sutil (--border-strong), porque o contraste mínimo não vale para o que não se usa. Erro: a borda do campo usa o --error (o mesmo rosa da mensagem), #D9416E: 4,26:1 no branco e 3,73:1 no fundo #EDF0F5. Input ganha prefixo e sufixo (https://, R$, kg), fora do valor salvo; Input, Textarea, Badge e Card repassam a ref (forwardRef); Label ganha obrigatorio (o asterisco colado ao fim do rótulo).", pt: "Tokens (28/11/2026): o --input passa a ser só o contorno e nasce o --input-fundo, o preenchimento dos campos no escuro (antes o mesmo valor fazia as duas coisas, e a borda no escuro tinha 1,03:1). Contorno no escuro: grafite 400 (#627288): 3,63:1 no card, 3,62:1 no campo e 3,85:1 no fundo. Interruptor desligado no escuro no mesmo grafite. Desabilitado: o contorno volta ao cinza sutil (--border-strong), porque o contraste mínimo não vale para o que não se usa. Erro: a borda do campo usa o --error (o mesmo rosa da mensagem), #D9416E: 4,26:1 no branco e 3,73:1 no fundo #EDF0F5. Input ganha prefixo e sufixo (https://, R$, kg), fora do valor salvo; Input, Textarea, Badge e Card repassam a ref (forwardRef); Label ganha obrigatorio (o asterisco colado ao fim do rótulo)." },
    page: "campos",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Botão no celular, avatares, cabeçalho, quadro, cartões de escolha e gráficos", pt: "Botão no celular, avatares, cabeçalho, quadro, cartões de escolha e gráficos" },
    desc: { en: "Button: no celular, um texto longo quebra em linhas, centralizado, e o botão cresce (quebra=“celular”, padrão; “nunca” e “sempre”). AvatarCircles: modo decorativo (sem links). CabecalhoDoSite: as pílulas são o Button forma=“pilula”; no menu do celular, o foco entra na folha, fica preso nela e volta ao botão Menu. Quadro: cartões com position relative (link esticado fica no cartão). GrupoDeCartoesDeEscolha: sem consulta de contêiner (no Chromium do celular, dentro de um fieldset, o grupo sumia depois de um envio com erro). CardIndicador: formato=“percentual” e formatar. BarrasOrdenadas: destaque por rótulo, para escalas em ordem natural. Funil: lista de verdade (sem role=“img”).", pt: "Button: no celular, um texto longo quebra em linhas, centralizado, e o botão cresce (quebra=“celular”, padrão; “nunca” e “sempre”). AvatarCircles: modo decorativo (sem links). CabecalhoDoSite: as pílulas são o Button forma=“pilula”; no menu do celular, o foco entra na folha, fica preso nela e volta ao botão Menu. Quadro: cartões com position relative (link esticado fica no cartão). GrupoDeCartoesDeEscolha: sem consulta de contêiner (no Chromium do celular, dentro de um fieldset, o grupo sumia depois de um envio com erro). CardIndicador: formato=“percentual” e formatar. BarrasOrdenadas: destaque por rótulo, para escalas em ordem natural. Funil: lista de verdade (sem role=“img”)." },
    page: "buttons",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Demonstrações com os componentes do DS", pt: "Demonstrações com os componentes do DS" },
    desc: { en: "Os campos de Botões › Controles de formulário usam o Campo (antes, uma cópia à mão, com a borda de erro a 60%: 2,76:1); o Skeleton de verdade no carregamento; os seletores das páginas de Fundos e Cards viram SegmentedControl e Button (antes, botões feitos à mão com cores soltas).", pt: "Os campos de Botões › Controles de formulário usam o Campo (antes, uma cópia à mão, com a borda de erro a 60%: 2,76:1); o Skeleton de verdade no carregamento; os seletores das páginas de Fundos e Cards viram SegmentedControl e Button (antes, botões feitos à mão com cores soltas)." },
    page: "backgrounds",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Consistency between the two design systems", pt: "Consistência entre os dois design systems" },
    desc: {
      en: "The components FindLook and Dani Moscatelli share now end with the same names and the same props (27/11/2026). Quadro accepts both ways (columns with ready cards, or items that move between stages with onMover); CabecalhoDoSite has the same props in both (acaoSecundaria, transparenteNoTopo, iconeAoRolar, telaLarga, comoLink, containerDoMenu and modelo), each DS keeping its brand model; TabelaAdaptavel measures its width and shows the columns that fit for any priority number (new moldura prop); EstadoVazio (ilustracao, moldura), Conversa (rolagem, citacao, imagem, texto and icone in IndicadorDeDigitacao), Logo (href, comoLink), Prosa (html), MolduraDeConta (lateral, comoLink), Campo (opcional, acaoDoRotulo, show password), CampoDeBusca (rotuloVisivel), ChipFiltravel (icone), Textarea (contador), PasswordConfirm, Alert (icone), the panel side menu and CardComCabecalho with the same props. scripts/comparar-ds.mjs checks it: 94 ui/ files in common, 94 equal (apart from the brand differences listed in scripts/comparar-ds-marca.json). Full table in propostas/2026-11-27-consistencia-entre-ds.md.",
      pt: "Os componentes que o FindLook e o Dani Moscatelli têm em comum terminam com os mesmos nomes e as mesmas props (27/11/2026). Quadro aceita os dois jeitos (colunas com cartões prontos ou itens que mudam de etapa, com onMover); CabecalhoDoSite tem as mesmas props nos dois (acaoSecundaria, transparenteNoTopo, iconeAoRolar, telaLarga, comoLink, containerDoMenu e modelo), cada DS com o seu modelo de marca; TabelaAdaptavel mede a largura e mostra as colunas que cabem por qualquer número de prioridade (nova prop moldura); EstadoVazio (ilustracao, moldura), Conversa (rolagem, citacao, imagem, texto e icone no IndicadorDeDigitacao), Logo (href, comoLink), Prosa (html), MolduraDeConta (lateral, comoLink), Campo (opcional, acaoDoRotulo, Mostrar senha), CampoDeBusca (rotuloVisivel), ChipFiltravel (icone), Textarea (contador), PasswordConfirm, Alert (icone), menu lateral do painel e CardComCabecalho com as mesmas props. O script scripts/comparar-ds.mjs confere: 94 arquivos de ui/ em comum, 94 iguais (fora as diferenças de marca listadas em scripts/comparar-ds-marca.json). Tabela completa em propostas/2026-11-27-consistencia-entre-ds.md.",
    },
    page: "campos",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Field outlines of at least 3:1", pt: "Bordas de campo com pelo menos 3:1" },
    desc: {
      en: "The outline of fields, selects, checkboxes, radios, outline buttons, chips and the switch when off is now --input = graphite 400 (WCAG 1.4.11). Measured: FindLook #888896, 3.49:1 on white and 3.24:1 on grey #F6F6F7; Dani Moscatelli #627288, 4.9:1 on white and 4.29:1 on the page background #EDF0F5 (before 1.53:1 and 1.4:1). --border-strong stays only on cards and dividers, which are not fields. The switch track when off uses the same graphite 400.",
      pt: "O contorno de campos, seleção, caixa de marcar, opção, botão de contorno, chip e do interruptor desligado passa a ser --input = grafite 400 (WCAG 1.4.11). Medido: FindLook #888896, 3,49:1 no branco e 3,24:1 no cinza #F6F6F7; Dani Moscatelli #627288, 4,9:1 no branco e 4,29:1 no fundo #EDF0F5 (antes 1,53:1 e 1,4:1). O --border-strong fica só nos cards e divisores, que não são campos. Trilho do interruptor desligado no mesmo grafite 400.",
    },
    page: "buttons",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Same state icons in both DS", pt: "Ícones de estado iguais nos dois DS" },
    desc: {
      en: "One sign per state (semiotics): warning = ! in a circle (AlertCircle), error = X in a circle (XCircle). The triangle is no longer a state icon: worldwide it means caution, and FindLook used it for error while Dani Moscatelli used it for warning. Applies to Alert, AlertaComAcao, EstadoVazio and EstadoFinal, BalaoDaConversa, Campo, ResumoDeErros, toasts, Upload, password, status chips and the docs.",
      pt: "Um sinal só para cada estado (semiótica): aviso = ! no círculo (AlertCircle), erro = X no círculo (XCircle). O triângulo deixa de ser ícone de estado, porque no mundo ele quer dizer atenção, e o FindLook usava para erro enquanto o Dani Moscatelli usava para aviso. Vale para Alert, AlertaComAcao, EstadoVazio e EstadoFinal, BalaoDaConversa, Campo, ResumoDeErros, avisos (toast), Upload, senha, chips de status e para a documentação.",
    },
    page: "feedback",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "One overlay behind every window", pt: "Um véu só atrás das janelas" },
    desc: {
      en: "Dialog, AlertDialog, Sheet, Drawer, SidePanel, the phone menu and the demos use the --sobreposicao token (graphite 950 at 50%, no blur), with the same name and value in both DS.",
      pt: "Dialog, AlertDialog, Sheet, Drawer, SidePanel, o menu do celular e as demonstrações usam o token --sobreposicao (grafite 950 a 50%, sem desfoque), com o mesmo nome e o mesmo valor nos dois DS.",
    },
    page: "overlays",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Popover inside a dialog, Button with ref, pill button and 44 px icon", pt: "Popover dentro de janela, Button com ref, botão pílula e ícone de 44 px" },
    desc: {
      en: "Button now forwards its ref (forwardRef): with React 18, a Popover opened by a Button inside a dialog stayed off screen (translate(0, -200%)); now it opens anchored to the field, 8 px from the screen edge. New demo: date field inside a dialog. Button gets forma=\"pilula\" and size=\"icon-lg\" (always 44 px); on phones the button is 44 px also through Tailwind's own variants (max-sm and pointer-coarse), without depending on theme.css being in the same CSS as Tailwind.",
      pt: "Button passa a repassar a ref (forwardRef): com React 18, o Popover aberto por um Button dentro de uma janela ficava fora da tela (translate(0, -200%)); agora abre ancorado no campo, com 8 px de folga da borda. Nova demonstração: campo de data dentro de uma janela. Button ganha forma=\"pilula\" e size=\"icon-lg\" (44 px sempre); no celular, o botão tem 44 px também com as variantes do próprio Tailwind (max-sm e pointer-coarse), sem depender do theme.css estar no mesmo CSS do Tailwind.",
    },
    page: "overlays",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Calendar on phones, in Portuguese", pt: "Calendar no celular, em português" },
    desc: {
      en: "On touch, the month takes the width it has (up to 320 px), each day is a square of up to 40 px and the touch area is always 44 × 44 px; it fits whole in a card from a 320 px screen (before it needed about 336 px). Chosen day in the selected pink, today outlined; weekdays and months in Portuguese.",
      pt: "No toque, o mês ocupa a largura que tem (até 320 px), cada dia é um quadrado de até 40 px e a área de toque é sempre de 44 × 44 px; cabe inteiro num card a partir de 320 px de tela (antes pedia cerca de 336 px). Dia escolhido no rosa de selecionado, hoje com contorno; dias da semana e meses em português.",
    },
    page: "campos",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Docs tables on phones", pt: "Tabelas da documentação no celular" },
    desc: {
      en: "The docs table (props, keys, tokens) becomes a list when narrow, with the name above and the description below; code never breaks mid-word.",
      pt: "A tabela de documentação (props, teclas, tokens) vira lista no estreito, com o nome em cima e a descrição embaixo; o código nunca quebra no meio da palavra (antes, \"esconderAoRolar\" quebrava em três pedaços).",
    },
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "CampoDeEndereco, accessible Upload, Stepper with dates and other fixes", pt: "CampoDeEndereco, Upload acessível, Stepper com data e outros ajustes" },
    desc: {
      en: "New CampoDeEndereco: suggests addresses while the person types (combobox with a list, keyboard, 350 ms wait, searching, no result and error states); the product does the search, with buscaNoPhoton() ready (the same request as the HTML restricted area). UploadDropzone with no control inside another and a named file input (axe: 0 label and nested-interactive failures). Stepper measures its real width and accepts a second line (detalhe, such as a date). Side menu: the names fade in only when opening and collapsing, not when the window width changes. AccordionContent: className documented and manterNoHtml. Campo: an outside aria-describedby is added to Campo's own, and manterAjudaNoErro. BarraDaEtapa: descricaoDoContinuar. Layout effects safe on the server. Logo with fill-rule evenodd. New links.tsx with LinkPularConteudo, LinkDeTexto and LinkDeVoltar (same API as FindLook).",
      pt: "Novo CampoDeEndereco: sugere endereços enquanto a pessoa digita (combobox com lista, teclado, espera de 350 ms, procurando, nenhum resultado e erro); quem busca é o produto, com buscaNoPhoton() pronto (o mesmo pedido da área restrita em HTML). UploadDropzone sem controle dentro de outro e com campo de arquivo nomeado (axe: 0 falhas de label e nested-interactive). Stepper mede a largura real e aceita uma segunda linha (detalhe, como a data). Menu lateral: os nomes só entram com o esmaecer ao abrir e recolher, não ao mudar a largura da janela. AccordionContent: className documentado e manterNoHtml. Campo: aria-describedby de fora somado ao do Campo e manterAjudaNoErro. BarraDaEtapa: descricaoDoContinuar. Efeitos de layout seguros no servidor. Logo com fill-rule evenodd. Novo links.tsx com LinkPularConteudo, LinkDeTexto e LinkDeVoltar (a mesma API do FindLook).",
    },
    page: "campos",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Site sections: testimonials, articles, logos, quotes, pillars, floating cards, simulation and long text", pt: "Seções do site: depoimentos, artigos, logos, citações, pilares, cartões flutuantes, simulação e texto longo" },
    desc: {
      en: "So the studio site can switch its hand-built sections to the DS without changing content (27/11/2026): CardDeDepoimento, CardDeArtigo (highlight, horizontal, vertical), FaixaDeLogos (pauses, still grid with reduced motion), Citacao, ListaDePilares, CartaoFlutuante, Simulacao (real tabs, auto-advance with Pause), LinkSaibaMais, Prosa, BarraDeNumeros, CardDeNavegacao, and LuzesDifusas brought from the FindLook DS with the same API. New page Components › Site sections.",
      pt: "Para o site do estúdio trocar as seções feitas à mão pelo DS sem mudar o conteúdo (27/11/2026): CardDeDepoimento, CardDeArtigo (destaque, horizontal, vertical), FaixaDeLogos (pausa, grade parada com menos movimento), Citacao, ListaDePilares, CartaoFlutuante, Simulacao (abas de verdade, avança sozinha com Pausar), LinkSaibaMais, Prosa, BarraDeNumeros, CardDeNavegacao, e LuzesDifusas trazida do DS da FindLook com a mesma API. Nova página Componentes › Seções do site.",
    },
    page: "secoes-site", anchor: "secoes-depoimentos",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Restricted area pieces: inbox, conversation, month agenda, step-by-step sign-up and board", pt: "Peças da área restrita: caixa de entrada, conversa, agenda do mês, cadastro em etapas e quadro" },
    desc: {
      en: "CaixaDeEntrada (list and reading pane side by side from 672 px of its own width, one at a time with Back below that), Conversa with BalaoDaConversa, SeparadorDaConversa and IndicadorDeDigitacao, AgendaDoMes (keyboard grid, list of the chosen day), Quadro (kanban that never scrolls sideways) and, brought from the FindLook DS with the same names and API, Stepper, MolduraDoCadastro, EtapaDoCadastro, BarraDaEtapa, LateralDaEtapa, ListaDeRevisao, BlocoDeRevisao and LinhaDeDado. New page Components › Restricted area pieces.",
      pt: "CaixaDeEntrada (lista e leitura lado a lado a partir de 672 px da própria largura; abaixo, uma por vez com Voltar), Conversa com BalaoDaConversa, SeparadorDaConversa e IndicadorDeDigitacao, AgendaDoMes (grade com teclado e lista do dia escolhido), Quadro (kanban que nunca rola para o lado) e, trazidos do DS da FindLook com os mesmos nomes e API, Stepper, MolduraDoCadastro, EtapaDoCadastro, BarraDaEtapa, LateralDaEtapa, ListaDeRevisao, BlocoDeRevisao e LinhaDeDado. Nova página Componentes › Peças da área restrita.",
    },
    page: "pecas-admin", anchor: "admin-caixa",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Fields: standard field, e-mail with domain suggestion, state and city, masks, search, copy, several e-mails, chips, choice cards, send button and adaptive table", pt: "Campos: campo padrão, e-mail com sugestão de domínio, estado e cidade, máscaras, busca, copiar, vários e-mails, chips, cartões de escolha, botão de envio e tabela adaptável" },
    desc: {
      en: "Campo (label, control, help and error always linked; same API as FindLook's CampoDoCadastro) with GradeDeCampos, MensagemDeErro and ResumoDeErros; CampoDeEmail, CampoEstadoCidade, CampoDeTelefone and CampoDeCnpj (masks and cnpjValido); CampoDeBusca; CampoCopiavel; CampoDeEmails (with domain suggestions); CampoDeHorario (15-minute steps, time zone written); ChipFiltravel and GrupoDeChipsFiltraveis; CartaoDeEscolha with BrilhoDeSelecionado (from the FindLook DS, selected on --primary-suave); BotaoDeEnvio (sending, sent, try again) and the Button variant exclusao-contorno; TabelaAdaptavel (sorting, columns leave by priority with a notice, LinhaDeLista list below 480 px). The admin pieces follow the restricted area spec (ADMIN_REACT.md §7.1). New page Components › Fields.",
      pt: "Campo (rótulo, controle, ajuda e erro sempre ligados; a mesma API do CampoDoCadastro da FindLook) com GradeDeCampos, MensagemDeErro e ResumoDeErros; CampoDeEmail, CampoEstadoCidade, CampoDeTelefone e CampoDeCnpj (máscaras e cnpjValido); CampoDeBusca; CampoCopiavel; CampoDeEmails (com sugestão de domínio); CampoDeHorario (passos de 15 minutos, fuso escrito); ChipFiltravel e GrupoDeChipsFiltraveis; CartaoDeEscolha com BrilhoDeSelecionado (do DS da FindLook, selecionado em --primary-suave); BotaoDeEnvio (enviando, enviado, tentar de novo) e a variante exclusao-contorno do Button; TabelaAdaptavel (ordenação, colunas saem por prioridade com aviso; lista de LinhaDeLista abaixo de 480 px). As peças da área restrita seguem a especificação dela (ADMIN_REACT.md §7.1). Nova página Componentes › Campos.",
    },
    page: "campos", anchor: "campos-campo",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Frames and states: site header, account frame, empty, final and error states, Alert by tone, Logo", pt: "Molduras e estados: cabeçalho do site, moldura de conta, estados vazio, final e de erro, Alert por tom, Logo" },
    desc: {
      en: "CabecalhoDoSite (pill or strip on desktop, bottom-sheet menu on phones, hides on scroll down), MolduraDeConta (sign-in and password screens), EstadoVazio, EstadoFinal and PaginaDeErro, the Alert tom prop (Portuguese tones with the state icon in place) and Logo (official artwork as inline SVG, no image copies in products). The site footer (RodapeSite) was checked against the site: same content and variants. Tokens: --sobreposicao (one overlay for every window) and --radius-full; the toque variant and the text-size scale of the fix branch. PilulaDeAcao (branch claude/pilula-acao) merged with its proposal. New page Components › Frames & states.",
      pt: "CabecalhoDoSite (pílula ou faixa no computador, menu em folha inferior no celular, some ao rolar para baixo), MolduraDeConta (telas de entrar e de senha), EstadoVazio, EstadoFinal e PaginaDeErro, a prop tom do Alert (tons em português com o ícone do estado já colocado) e Logo (a arte oficial em SVG no código, sem cópia de imagem nos produtos). O rodapé (RodapeSite) foi conferido com o do site: mesmo conteúdo e variantes. Tokens: --sobreposicao (um véu só para todas as janelas) e --radius-full; a variante toque e a escala de texto do branch de correções. PilulaDeAcao (branch claude/pilula-acao) integrada, com proposta. Nova página Componentes › Molduras e estados.",
    },
    page: "molduras", anchor: "molduras-cabecalho",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Phone audit fixes: responsive templates, 44 px touch targets, text and radius tokens", pt: "Correções da auditoria de celular: templates que se adaptam, toque de 44 px, tokens de texto e de raio" },
    desc: {
      en: "Fixes from the alignment audit at 390, 768, 1024 and 1280 px (27/11/2026). Dashboard, Settings and Inbox now use the panel shell (the side menu becomes a drawer below 56rem; the inbox opens the message over the list on phones, with Back). The Landing adapts to its own width: bottom-sheet menu, numbers in 2 × 2, one card per row, one card per plan instead of the table, the DS Accordion, Timeline and footer, and the form below the trust list. Touch: on phones and finger screens every button, tab and field is at least 44 px (toque: variant and a safety rule in theme.css); checkbox, radio and switch grow only their tap area. New text-size tokens with the same names as FindLook (text-caption to text-display-xl): every text-[…] became the nearest step of the scale (13→14, 15→16, 10→11, 28→32). Radii only by token (glass cards 20→16 px) and spacing on the 4/8 px rhythm. Tabs wrap (even grid on phones), pagination stays on one line, tables inside cards never scroll sideways (columns that fit or a list), code blocks wrap. CardComCabecalho keeps its action on the title row; PartnerCard and the moved-content notice never leave a link alone under a button. Hover borders are grey (--border-strong); pink only for selected. Headings wrap with text-wrap: pretty. Components speak Portuguese to screen readers (Fechar, Anterior, Próxima).",
      pt: "Correções da auditoria de alinhamento em 390, 768, 1024 e 1280 px (27/11/2026). Dashboard, Configurações e Caixa de entrada passam a usar a casca do painel (o menu lateral vira gaveta abaixo de 56rem; no celular, a caixa de entrada abre a mensagem no lugar da lista, com Voltar). A Landing se adapta à própria largura: menu em folha inferior, números em 2 × 2, um card por linha, um card por plano no lugar da tabela, o Accordion, a Timeline e o rodapé do DS, e o formulário embaixo da lista de confiança. Toque: no celular e em telas de dedo, todo botão, aba e campo tem pelo menos 44 px (variante toque: e uma regra de segurança no theme.css); caixa de seleção, rádio e interruptor crescem só a área de toque. Novos tokens de tamanho de texto, com os mesmos nomes do FindLook (text-caption a text-display-xl): todo text-[…] foi para o passo mais perto da escala (13→14, 15→16, 10→11, 28→32). Raios só por token (cards de vidro de 20 para 16 px) e espaçamento no ritmo de 4/8 px. Abas quebram de linha (grade de colunas iguais no celular), a paginação fica numa linha só, tabelas dentro de card nunca rolam para o lado (colunas que cabem ou lista) e blocos de código quebram a linha. O CardComCabecalho mantém a ação na linha do título; o PartnerCard e o aviso de conteúdo que mudou de lugar nunca deixam um link sozinho embaixo do botão. Bordas de hover são cinza (--border-strong); rosa só para selecionado. Títulos quebram com text-wrap: pretty. Os componentes falam português com leitores de tela (Fechar, Anterior, Próxima).",
    },
    page: "templates", anchor: "template-dashboard",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Approved colours and the light-pink rule: selected, hover and highlight", pt: "Cores aprovadas e a regra dos rosas claros: selecionado, hover e destaque" },
    desc: {
      en: "Product owner's decisions (27/11/2026). --primary is #CC4545 (white text 4.66:1) and --primary-hover #B82828 (crimson-500, 6.2:1), in light and dark (dark was 4.2:1 and 3.7:1). --muted-foreground is #5A6A80 (4.83:1 on the #EDF0F5 background). Three solid light pinks with one job each: SELECTED --primary-suave #FCEEEE (new; active menu item, selected chip, segment, row and plan; stays pink under the pointer; --primary-text 5.5:1), HOVER light grey --accent #E8EDF3, never pink, and HIGHLIGHT --primary-muted #FAE4E4 (now solid; icon bases, status chips). Applied to the panel menu and this site's menu, LinhaDeLista, SegmentedControl (soft variant), chips and the Templates demos; pink hovers on upload areas, outline buttons and links became grey. The panel counter (ContadorDoPainel) goes back to --primary, now 4.66:1 with white. Documented in Foundations › Colours › Light pinks, the same rule as in the FindLook DS.",
      pt: "Decisões da dona do produto (27/11/2026). --primary passa a #CC4545 (texto branco 4,66:1) e --primary-hover a #B82828 (crimson-500, 6,2:1), no claro e no escuro (no escuro eram 4,2:1 e 3,7:1). --muted-foreground passa a #5A6A80 (4,83:1 no fundo #EDF0F5). Três rosas claros sólidos, cada um com um papel: SELECIONADO --primary-suave #FCEEEE (novo; item ativo do menu, chip, segmento, linha e plano selecionados; continua rosa com o mouse em cima; --primary-text 5,5:1), HOVER cinza claro --accent #E8EDF3, nunca rosa, e DESTAQUE --primary-muted #FAE4E4 (agora sólido; bases de ícones, chips de estado). Aplicado ao menu do painel e ao menu deste site, à LinhaDeLista, ao SegmentedControl (variante suave), aos chips e às demonstrações dos Templates; os hovers rosa de áreas de upload, botões de contorno e links passaram a cinza. O contador do painel (ContadorDoPainel) volta a --primary, agora com 4,66:1 com o branco. Documentado em Fundamentos › Cores › Rosas claros, a mesma regra do DS da FindLook.",
    },
    page: "colors", anchor: "cores-selecao",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Alert with action and list rows on phones: one left edge", pt: "Alerta com ação e linhas de lista no celular: uma borda esquerda só" },
    desc: {
      en: "Product owner's request (27/11/2026): \"poorly laid out on mobile, mainly the tag and the buttons\". AlertaComAcao below 640 px: smaller icon base (36 px) on the title line, centred with it; description, button and link start at the card's padding edge, in line with the icon; button and link side by side, centred, wrapping only when they do not fit (16 px card padding on phones). From 640 px nothing changes. LinhaDeLista: when the tags and actions move below the text, the row now starts at the left edge of the text column, the same x as the title (alinharAcoesAbaixo=\"inicio\" is the default; \"fim\" keeps the old right edge). alerta-com-acao.tsx stays identical in both design systems.",
      pt: "Pedido da dona do produto (27/11/2026): \"no mobile, diagramação ruim, principalmente na tag e nos botões\". AlertaComAcao abaixo de 640 px: base do ícone menor (36 px) na linha do título, centralizada com ele; descrição, botão e link começam na borda do respiro do card, alinhados com o ícone; botão e link lado a lado, centralizados, quebrando só quando não cabem (respiro de 16 px no celular). Do 640 px em diante, nada muda. LinhaDeLista: quando as tags e ações descem para baixo do texto, a linha começa na borda esquerda da coluna do texto, o mesmo x do título (alinharAcoesAbaixo=\"inicio\" passa a ser o padrão; \"fim\" mantém a borda direita de antes). O alerta-com-acao.tsx continua idêntico nos dois design systems.",
    },
    page: "feedback", anchor: "alerta-com-acao",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Status chip, composition bar, full-height panel menu and compact indicator card", pt: "Chip de estado, barra de composição, menu do painel na altura da página e card de indicador compacto" },
    desc: {
      en: "From the design review of the restricted area's home page (27/11/2026). New ChipDeEstado (ui/chip-de-estado.tsx): the state of an item always in words, in the end column of a list row (marca, neutro, sucesso, info, aviso and erro tones, all 4.8:1 or more). New BarraDeComposicao (ui/barra-de-composicao.tsx): one bar split into 2 to 5 parts, in the order title, bar, legend below with a dot in each part's colour, count and percentage, chart tokens only. MenuLateral gains grudarAbaixoDe: on pages that scroll as a whole, the menu is a white column as tall as the page and its items stick under the header. CardIndicador gains compacto (16 px padding, 32 px icon; 4 across from a 44rem container, 2 × 2 on phones) and soNumeroNoCelular (phones show only label and number). The Panel template uses all of them, with the amber attention alert.",
      pt: "Da revisão de design da Início da área restrita (27/11/2026). Novo ChipDeEstado (ui/chip-de-estado.tsx): o estado de um item sempre em palavras, na coluna do fim da linha da lista (tons marca, neutro, sucesso, info, aviso e erro, todos com 4,8:1 ou mais). Nova BarraDeComposicao (ui/barra-de-composicao.tsx): uma barra dividida em 2 a 5 partes, na ordem título, barra e legenda embaixo com o ponto na cor de cada parte, quantidade e percentual, só com os tokens de gráfico. MenuLateral ganha grudarAbaixoDe: em páginas que rolam inteiras, o menu é uma coluna branca da altura da página e os itens ficam grudados abaixo do cabeçalho. CardIndicador ganha compacto (respiro de 16 px, ícone de 32 px; 4 lado a lado a partir de um contêiner de 44rem, 2 × 2 no celular) e soNumeroNoCelular (o celular mostra só rótulo e número). O template Painel usa todos, com o alerta de atenção em âmbar.",
    },
    page: "templates", anchor: "template-painel-pecas",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Panel pieces: shell, page header, indicator card and icon with base", pt: "Peças do painel: casca, cabeçalho da página, card de indicador e ícone com base" },
    desc: {
      en: "Brought from the FindLook Design System with this DS's colours, for the restricted area in React (27/11/2026). New ui/painel-shell.tsx: MenuLateralProvider, MenuLateral (240/64 px, pushes the content, choice saved per panel), TopoDoMenu and BotaoRecolherMenu (≡ MENU), NavDoMenu, ItemDoMenu (active bg-primary/10 + --primary-text and hover --accent, the same as this site's menu; as prop for the product's router link; 44 px targets in the drawer), GrupoDoMenu (opens and closes, with a counter), BarraSuperiorDoPainel (white, full width), BotaoDeNotificacoes (44 px, round red counter on the bell's corner with a 2 px ring, or a dot), GatilhoDaConta, AvatarPainel (on the DS Avatar), CampoDeBuscaGlobal, CardDeAjuda and the new ContadorDoPainel (round, red --primary-text, white bold tabular numbers, round-ended pill for two digits, 99+). New ui/painel-cabecalho.tsx: CabecalhoDaPagina (Option A: title with Heading, description in --foreground for contrast on grey, actions and tabs outside the cards). New ui/painel-dados.tsx: IconeComBase (marca: pink base + red icon; neutro: grey base + grey icon; never mixed), CardIndicador (KPI on the DS Card: label, icon top right, big number at the bottom; total, support line, trend, explanation, badge, footer action, null value and the whole card as a link), CardComCabecalho, DivisorSuave, LinkVerTudo, Variacao and Explicacao. New Panel template and Panel pieces section in Templates.",
      pt: "Trazidas do FindLook Design System com as cores deste DS, para a área restrita em React (27/11/2026). Novo ui/painel-shell.tsx: MenuLateralProvider, MenuLateral (240/64 px, empurra o conteúdo, escolha guardada por painel), TopoDoMenu e BotaoRecolherMenu (≡ MENU), NavDoMenu, ItemDoMenu (ativo bg-primary/10 + --primary-text e hover --accent, iguais ao menu deste site; prop as para o link do roteador do produto; alvos de 44 px na gaveta), GrupoDoMenu (abre e fecha, com contador), BarraSuperiorDoPainel (branca, na largura toda), BotaoDeNotificacoes (44 px, contador redondo vermelho no canto do sino com anel de 2 px, ou ponto), GatilhoDaConta, AvatarPainel (sobre o Avatar do DS), CampoDeBuscaGlobal, CardDeAjuda e o novo ContadorDoPainel (redondo, vermelho --primary-text, número branco em negrito e tabular, pílula de pontas redondas com dois algarismos, 99+). Novo ui/painel-cabecalho.tsx: CabecalhoDaPagina (Opção A: título com o Heading, descrição em --foreground pelo contraste no cinza, ações e abas fora dos cards). Novo ui/painel-dados.tsx: IconeComBase (marca: base rosa + ícone vermelho; neutro: base cinza + ícone cinza; nunca misturados), CardIndicador (KPI sobre o Card do DS: rótulo, ícone no canto superior direito, número grande na base; total, apoio, variação, explicação, selo, ação no rodapé, valor nulo e o card inteiro como link), CardComCabecalho, DivisorSuave, LinkVerTudo, Variacao e Explicacao. Novo template Painel e a seção Peças do painel em Templates.",
    },
    page: "templates", anchor: "template-painel",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Fixes from the product screen review", pt: "Correções da revisão das telas do produto" },
    desc: {
      en: "Review of 27/11/2026. Alert without a title: with no AlertTitle, the sentence takes the main text colour, spans both rows, sits centred on the icon and wraps evenly, on its own, with no extra class; new section Feedback > Alert without a title. Supporting text of the coloured alerts and of the Alert with action: --muted-foreground with 15% of --foreground, above 4.5:1 on every background (the error one was 4.47:1). BotaoDoAlerta and LinkDoAlerta are 40 px tall, the DS button height, with 14 px text. \"use client\" in every ui/ file that uses state or context (Card, GradeDeCards, BotaoSubir and others), so products can build static pages. PartnerCard tint: supporting text with 15% of --foreground (4.7:1, was 3.8:1). Password requirements (PasswordConfirm): a neutral dot for \"not yet\" and the success check (CheckCircle2 in --success-text) for \"met\", instead of the hollow circle that looked like a radio button; \"Passwords match\" also in success green.",
      pt: "Revisão de 27/11/2026. Alerta só com descrição: sem AlertTitle, a frase fica na cor do texto principal, ocupa as duas linhas, centraliza na altura do ícone e quebra a linha de forma equilibrada, sozinha, sem classe extra; nova seção Feedback > Alerta só com descrição. Texto de apoio dos alertas coloridos e do Alerta com ação: --muted-foreground com 15% de --foreground, acima de 4,5:1 em todos os fundos (o do erro dava 4,47:1). BotaoDoAlerta e LinkDoAlerta com 40 px de altura, a dos botões do DS, com o texto de 14 px. \"use client\" em todos os arquivos de ui/ que usam estado ou contexto (Card, GradeDeCards, BotaoSubir e outros), para os produtos montarem páginas estáticas. PartnerCard tint: texto de apoio com 15% de --foreground (4,7:1; antes 3,8:1). Requisitos de senha (PasswordConfirm): ponto neutro para \"ainda não\" e o check de sucesso (CheckCircle2 em --success-text) para \"atendido\", no lugar do círculo vazado que parecia um botão de rádio; \"As senhas coincidem\" também no verde de sucesso.",
    },
    page: "feedback", anchor: "alerta-sem-titulo",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Lists on phones: tags and actions below the text by default", pt: "Listas no celular: tags e ações embaixo do texto por padrão" },
    desc: {
      en: "Product owner's decision (27/11/2026): in lists on phones, tags and actions move to their own row below the whole text block, so the text uses the full width. This is now the default of LinhaDeLista (quebraAcoes=\"estreito\", below 640 px); quebraAcoes={false} keeps them beside the text at every width and quebraAcoes={true} puts them below at every width. Documented in Data display > Rows with tags and actions (rule 3, examples and code) and in Cards > Responsive behavior.",
      pt: "Decisão da dona do produto (27/11/2026): nas listas no celular, tags e ações descem para uma linha própria embaixo de todo o bloco de texto, e o texto usa a largura toda. Agora é o padrão da LinhaDeLista (quebraAcoes=\"estreito\", abaixo de 640 px); quebraAcoes={false} as mantém ao lado do texto em qualquer largura e quebraAcoes={true} as põe embaixo em qualquer largura. Documentado em Dados > Linhas com tags e ações (regra 3, exemplos e código) e em Cards > Comportamento responsivo.",
    },
    page: "data", anchor: "linhas-colunas",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Cards side by side: same height, or one per row", pt: "Cards lado a lado: mesma altura, ou um por linha" },
    desc: {
      en: "Rule of the product owner (27/11/2026): cards side by side never have different heights; if the content difference would leave one card with a large empty vertical area, the cards become horizontal, one per row. New GradeDeCards (ui/grade-de-cards.tsx), with ItemDaGrade (label + card, with subgrid so the cards start and end together) and useOrientacaoDoCard: it stretches the cards of a row, measures the natural height of each one (ResizeObserver and MutationObserver, before painting) and becomes a list (data-layout=\"lista\") when the difference is above 120 px, or above 1/3 of the tallest card and at least 64 px; it goes back to the grid below 75% of the limit, without flicker; with one column (phones) nothing changes; the switch fades in --duration-normal, with no animation under reduced motion. Props: colunas, larguraMinima, limiteDeDiferenca, layout, onLayoutChange. Card gains orientacao (vertical or horizontal, automatic inside the list; always vertical on phones), the new CardMidia (image, or icon on a light pink base) and CardFooter moves to the bottom (mt-auto). Card with an action (product owner, 27/11/2026): in the horizontal card the footer becomes a full-width row below, with the card divider (DivisorDoCard, which uses the Separator) and the buttons in the bottom-right corner; the media stays on the left. PartnerCard follows the grid orientation when it gets no orientation and keeps its action at the bottom. Applied to the card grids of every page (Cards, Data, Charts, Templates, Site patterns, Do and Don't, principles and more) and documented in Cards > Same height, or one per row, with a live demo, correct and incorrect examples and the threshold.",
      pt: "Regra da dona do produto (27/11/2026): cards lado a lado nunca têm tamanhos diferentes; se a diferença de conteúdo deixaria um card com uma área vazia vertical grande, os cards passam a ser horizontais, um por linha. Novo GradeDeCards (ui/grade-de-cards.tsx), com ItemDaGrade (rótulo + card, com subgrid para os cards começarem e terminarem juntos) e useOrientacaoDoCard: estica os cards da linha, mede a altura natural de cada um (ResizeObserver e MutationObserver, antes da pintura) e vira lista (data-layout=\"lista\") quando a diferença passa de 120 px, ou de 1/3 do card mais alto com pelo menos 64 px; volta à grade abaixo de 75% do limite, sem piscar; com uma coluna (celular), nada muda; a troca esmaece em --duration-normal, sem animação com \"menos movimento\". Props: colunas, larguraMinima, limiteDeDiferenca, layout, onLayoutChange. Card ganha orientacao (vertical ou horizontal, automática dentro da lista; no celular, sempre vertical), a nova CardMidia (imagem ou ícone em base rosa clara) e o CardFooter desce para a base (mt-auto). Card com ação (pedido da dona do produto, 27/11/2026): no card horizontal, o rodapé vira uma linha de largura inteira embaixo, com o divisor do card (DivisorDoCard, que usa o Separator) e os botões no canto inferior direito; a mídia continua à esquerda. PartnerCard segue a orientação da grade quando não recebe orientation e alinha a ação na base. Aplicado nas grades de cards de todas as páginas (Cards, Dados, Gráficos, Templates, Padrões do site, Faça e Não faça, princípios e demais) e documentado em Cards > Mesma altura, ou um por linha, com demonstração, exemplos certos e errados e o limite.",
    },
    page: "cards", anchor: "card-mesma-altura",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Design system catalog (CATALOGO.md and catalogo.json) and consumption rule", pt: "Catálogo do design system (CATALOGO.md e catalogo.json) e regra de consumo" },
    desc: {
      en: "Requested by the product owner (27/11/2026): no conversation or agent should rebuild by hand what the DS already has. New catalog generated automatically by scripts/gerar-catalogo.mjs before every pnpm build: CATALOGO.md (for people and AI agents) and catalogo.json (for programs), at the repository root, with every ui/ component (purpose, props, variants and where to see it), the templates and patterns that still only exist in the demo pages (backlog for promotion to components), the tokens, the usage rules and the component proposals. pnpm catalogo:check fails if the committed catalog is out of date. CLAUDE.md at the root with the consumption rule and propostas/README.md with the process to create a new component inside the DS. New Catalog section on the Develop page.",
      pt: "Pedido da dona do produto (27/11/2026): nenhuma conversa ou agente deve recriar à mão o que o DS já tem. Novo catálogo gerado automaticamente por scripts/gerar-catalogo.mjs antes de cada pnpm build: CATALOGO.md (para pessoas e agentes de IA) e catalogo.json (para programas), na raiz do repositório, com todos os componentes de ui/ (para que servem, props, variantes e onde ver), os templates e padrões que ainda só existem nas páginas de demonstração (backlog de promoção a componente), os tokens, as regras de uso e as propostas de componente. pnpm catalogo:check falha se o catálogo gravado estiver desatualizado. CLAUDE.md na raiz com a regra de consumo e propostas/README.md com o processo para criar componente novo dentro do DS. Nova seção Catálogo na página Desenvolvimento.",
    },
    page: "develop", anchor: "dev-catalogo",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Rows with tags and actions: text never passes the trailing column, and hover covers the whole row", pt: "Linhas com tags e ações: o texto nunca passa da coluna final, e o hover cobre a linha inteira" },
    desc: {
      en: "Product owner's rule (24/11/2026): in grids, text never goes past the tags or actions column. In any row of a list, table, grid or card list with a trailing column of tags, badges, status or actions, the text stays in its own column (minmax(0,1fr)) at every width and the trailing column keeps its width (auto); on phones, no col-span-full, flex-basis 100% or grid areas such as \"res res\" passing under it. Without room, the tags and actions move to their own row below the whole text, or the row becomes a stacked card. Second product owner's rule, the same day: row hover covers the whole row, edge to edge, with no rounded corners (--row-hover), including the leading checkbox and the trailing tags and actions; the selected row has the same shape, keyboard focus is an inset outline, and only a row that is itself a standalone card keeps the card's radius. New LinhaDeLista component (ui/linha-de-lista.tsx), with leading, content (title and description) and trailing (tags and actions) slots, an auto | minmax(0,1fr) | auto grid and the quebraAcoes option (always or on phones only). New section Data display > Rows with tags and actions, with correct and incorrect examples at phone width; both rules also in Cards > Responsive behavior. Fixed: the unread dot in notifications (own column, inset focus) and the Accessibility checklist (square hover).",
      pt: "Regra da dona do produto (24/11/2026): nos grids, o texto nunca deve ultrapassar a coluna de tags ou ações. Em toda linha de lista, tabela, grade ou lista de cards com uma coluna final de tags, selos, status ou ações, o texto fica na coluna dele (minmax(0,1fr)) em qualquer largura e a coluna final mantém a largura (auto); no celular, nada de col-span-full, flex-basis 100% ou áreas de grid como \"res res\" passando por baixo dela. Sem espaço, as tags e ações descem para uma linha própria abaixo de todo o texto, ou a linha vira um card empilhado. Segunda regra da dona do produto, no mesmo dia: o hover da linha cobre a linha inteira, de ponta a ponta, sem cantos arredondados (--row-hover), incluindo a caixa de seleção do início e as tags e ações do fim; a linha selecionada tem a mesma forma, o foco do teclado é um contorno por dentro, e só a linha que é um card sozinho mantém o raio do card. Novo componente LinhaDeLista (ui/linha-de-lista.tsx), com início, conteúdo (título e descrição) e fim (tags e ações), grade auto | minmax(0,1fr) | auto e a opção quebraAcoes (sempre ou só no celular). Nova seção Dados > Linhas com tags e ações, com exemplo certo e errado na largura do celular, e as duas regras também em Cards > Comportamento responsivo. Corrigidos: o ponto de não lida das notificações (coluna própria, foco por dentro) e a lista de verificação de Acessibilidade (hover sem cantos).",
    },
    page: "data", anchor: "linhas-colunas",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Alert with action, every alert in the same pattern and new warning and error colours", pt: "Alerta com ação, todos os alertas no mesmo padrão e novas cores de aviso e erro" },
    desc: {
      en: "Approved by the product owner (23/11/2026). New AlertaComAcao (ui/alerta-com-acao.tsx), with BotaoDoAlerta and LinkDoAlerta: 44 px icon with base (state colour at 18%, 30% for warning), 15 px bold title and everything else at 14 px, border in the state colour at 22% and card background tinted with the state colour at 7% (9% for warning). Actions always below the text: one outline-only primary, with text in the state's text colour, and a secondary styled as an underlined link; in a narrow alert the action row also uses the width under the icon. role=\"alert\" for warning and error, role=\"status\" for info and success. New state colours approved by the product owner on 23/11/2026: warning is now a yellowish orange (--warning #F0A020, with graphite text on it: --warning-foreground = --graphite-900, never white) and error is pinker, separate from the brand red (--error #D9416E); --primary, --primary-text, --destructive and the crimson scale do not change. Dark theme: --warning #F5B040 and --error #E5688F (5.7:1 on the dark card), both with graphite text on them. New tokens, only for text and icons on light backgrounds, approved the same day: --success-text (#327650), --info-text (#366E97), --warning-text (#935E0A) and --error-text (#C52756), 5.0–5.1:1 on the alert background; in the dark theme they point to --success, --info, --warning and --error. Text and icons that used --warning or --error as text colour now use the -text tokens (badges, toasts, form and upload errors). The Alert (ui/alert.tsx) now has the same look without changing its API: the svg child becomes the icon with base; pattern icons: info Info, success CheckCircle2, warning AlertCircle, error TriangleAlert.",
      pt: "Aprovado pela dona do produto (23/11/2026). Novo AlertaComAcao (ui/alerta-com-acao.tsx), com BotaoDoAlerta e LinkDoAlerta: ícone com base de 44 px (cor do estado a 18%, 30% no aviso), título de 15 px em negrito e todo o resto em 14 px, borda na cor do estado a 22% e fundo do card com a cor do estado a 7% (9% no aviso). Ações sempre embaixo do texto: uma principal só de contorno, com texto na cor de texto do estado, e uma secundária em forma de link sublinhado; em alerta estreito, a linha de ações usa também a largura sob o ícone. role=\"alert\" em aviso e erro, role=\"status\" em info e sucesso. Novas cores de estado aprovadas pela dona do produto em 23/11/2026: aviso laranja amarelado (--warning #F0A020, com texto em grafite sobre ele: --warning-foreground = --graphite-900, nunca branco) e erro mais rosa, separado do vermelho da marca (--error #D9416E); --primary, --primary-text, --destructive e a escala crimson não mudam. Tema escuro: --warning #F5B040 e --error #E5688F (5,7:1 no card escuro), os dois com texto em grafite sobre eles. Tokens novos, só para texto e ícone sobre fundo claro, aprovados no mesmo dia: --success-text (#327650), --info-text (#366E97), --warning-text (#935E0A) e --error-text (#C52756), 5,0–5,1:1 no fundo do alerta; no tema escuro apontam para --success, --info, --warning e --error. Textos e ícones que usavam --warning ou --error como cor de texto passam aos tokens -text (badges, toasts, erros de formulário e de upload). O Alert (ui/alert.tsx) passa a ter a mesma aparência, sem mudar a API: o svg filho vira o ícone com base; ícones do padrão: info Info, sucesso CheckCircle2, aviso AlertCircle, erro TriangleAlert.",
    },
    page: "feedback", anchor: "alerta-com-acao",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Panels: menu that pushes, border-only cards, lighter hover and disabled", pt: "Painéis: menu que empurra, cards só com borda, hover e desabilitado mais claros" },
    desc: { en: "Product owner's decisions (23/11/2026): on the computer the side menu opens and closes with the Menu button at its top and, when open, pushes the content column instead of covering it (phones keep the drawer). A card sitting directly on the page background, white or light grey, is always border only (1 px border, no shadow). Row and item hovers inside cards use the new --row-hover token, a very light, subtle grey (half of --graphite-50 over the card, ≈ #F6F8FA; 4% white in the dark theme). Disabled: --disabled is now --graphite-100 (#D6DCE6) and --disabled-foreground --graphite-400, 3.6:1.", pt: "Decisões da dona do produto (23/11/2026): no computador, o menu lateral abre e fecha pelo botão Menu no topo dele e, aberto, empurra a coluna de conteúdo em vez de cobri-la (o celular continua com a gaveta). Card que fica direto sobre o fundo da página, branco ou cinza claro, é sempre só borda (borda de 1 px, sem sombra). O hover de linha ou item dentro do card usa o novo token --row-hover, um cinza bem claro e sutil (metade do --graphite-50 sobre o card, ≈ #F6F8FA; branco a 4% no tema escuro). Desabilitado: --disabled passa a ser --graphite-100 (#D6DCE6) e --disabled-foreground --graphite-400, 3,6:1." },
    page: "cards", anchor: "card-fundos",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "7-tone chart palette", pt: "Paleta de 7 tons nos gráficos" },
    desc: { en: "Product owner's decision (21/11/2026): 7 tones in order of importance, from the brand red to gray (--chart-1 to --chart-7: #D44D4D, #F0828B, #F2BDC2, #D99BA1, #BFA0A3, #D4D7DC, #EBEEF4), the same in the light and dark themes. Ranges: 1–2 highlight, 3–5 support and transition, 6–7 context. Five usage rules: 1 chart = 1 focus, importance in order, context in gray, at most 2 intense tones and continuous scales from gray to red (--chart-seq-1 to 4 = tones 6, 4, 2 and 1). Series take the tones in order; \"Other\" goes on tone 6 when the parts stop before it and on tone 7 otherwise. --chart-neutral is now tone 7; --chart-8 stays only for compatibility and points to tone 7. Components pick tones with coresPorImportancia(n), configured in graficos-paleta.ts; BarrasOrdenadas gets cores=\"importancia\" and GraficoDeLinhas accepts neutro (dashed) and tom series.", pt: "Decisão da dona do produto (21/11/2026): 7 tons em ordem de importância, do vermelho da marca ao cinza (--chart-1 a --chart-7: #D44D4D, #F0828B, #F2BDC2, #D99BA1, #BFA0A3, #D4D7DC, #EBEEF4), os mesmos no tema claro e no escuro. Faixas: 1–2 destaque, 3–5 apoio e transição, 6–7 contexto. Cinco regras de uso: 1 gráfico = 1 foco, importância em ordem, contexto em cinza, no máximo 2 tons intensos e escalas contínuas do cinza ao vermelho (--chart-seq-1 a 4 = tons 6, 4, 2 e 1). As séries usam os tons em sequência; \"Outros\" fica no tom 6 quando as partes param antes dele e no tom 7 nos demais casos. --chart-neutral passa a ser o tom 7; --chart-8 fica só por compatibilidade e aponta para o tom 7. Os componentes escolhem os tons com coresPorImportancia(n), configurada em graficos-paleta.ts; BarrasOrdenadas ganha cores=\"importancia\" e GraficoDeLinhas aceita séries neutro (tracejadas) e tom." },
    page: "graficos", anchor: "graficos-cores",
  },
  {
    date: "Nov 2026", kind: "Removed", title: { en: "Sunburst and Waterfall", pt: "Sunburst e Cascata" },
    desc: { en: "Product owner's decision (20/11/2026): the Sunburst and Waterfall (Cascata) charts leave the chart catalog.", pt: "Decisão da dona do produto (20/11/2026): os gráficos Sunburst e Cascata (waterfall) saem do catálogo de gráficos." },
    page: "graficos", anchor: "graficos-catalogo-composicao",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Charts and visualizations", pt: "Gráficos e visualizações" },
    desc: { en: "New page and ui/graficos-inteligencia.tsx: how to choose a chart, chart colours, a redesigned donut, the recommended charts (ranked bars, regional heat map, dumbbell, lines and area, slope, treemap, 100% bars, bubbles, matrix heat map, bump chart, funnel), each as a discovery card (conclusion, chart, why it matters, next step), and the intelligence design principle. Chart tokens become tonal variations of the brand red; graphite only for non-highlighted or disabled information.", pt: "Página nova e ui/graficos-inteligencia.tsx: como escolher o gráfico, cores dos gráficos, rosca redesenhada, os gráficos recomendados (barras ordenadas, mapa de calor por região, dumbbell, linhas e área, slope, treemap, barras 100%, bolhas, heatmap matricial, bump, funil), cada um como um card de descoberta (conclusão, gráfico, por que importa, próximo passo), e o princípio do design de inteligência. Os tokens de gráfico passam a ser variações de tom do vermelho da marca; o grafite fica só para informação sem destaque ou desabilitada." },
    page: "graficos", anchor: "graficos-recomendados",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Site patterns", pt: "Padrões do site" },
    desc: { en: "New page with the site's patterns as components: footer (light, dark and compact), WhatsApp button, \"Tem um projeto?\" notice and back-to-top, cookie notice, reveal on scroll (slide up and blur, word by word), area-of-work card and curved dividers. Header: on phones the site bar stays light when scrolling.", pt: "Página nova com os padrões do site como componentes: rodapé (claro, escuro e compacto), botão do WhatsApp, aviso \"Tem um projeto?\" e voltar ao topo, aviso de cookies, entrada ao rolar (subir e desfoque, palavra por palavra), card de frente de atuação e divisores curvos. Header: no celular, a faixa do site continua clara ao rolar." },
    page: "site", anchor: "site-rodape",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "No sideways scroll on phones", pt: "Celular sem rolagem lateral" },
    desc: { en: "Every page fits 390 px: pagination and tabs wrap instead of scrolling, typography cards break long text, and the orbiting circles stack on phones.", pt: "Todas as páginas cabem em 390 px: paginação e abas quebram linha em vez de rolar, os cards de tipografia quebram textos longos e os círculos em órbita ficam um embaixo do outro no celular." },
    page: "overlays", anchor: "pagination",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Organization and cleanup", pt: "Organização e limpeza" },
    desc: { en: "One section title style in every page (title font, 24 px). Radii moved to the scale (8, 12, 16 and 24 px). Tailwind default colors and leftover hex values replaced by tokens; all red text uses --primary-text. Feedback and Labels now show different content; Motion tokens got their own address; menu items that only led to \"See in\" notices were removed. Toasts work (ui/sonner, without next-themes) and the Feedback page shows real notifications. Tabs, accordion, dropdown menu, dialog, confirmation (ui/alert-dialog), checkbox, radio and switch pages now use the ui/ components, adjusted to the documented look. New Component catalog page with every ui/ file.", pt: "Um estilo só de título de seção em todas as páginas (fonte de títulos, 24 px). Raios levados para a escala (8, 12, 16 e 24 px). Cores padrão do Tailwind e hexadecimais que sobravam trocados por tokens; todo texto em vermelho usa --primary-text. Feedback e Rótulos passam a ter conteúdo próprio; os tokens de Movimento ganham endereço próprio; saem do menu os itens que só levavam a avisos \"Ver em\". As notificações (toast) funcionam (ui/sonner, sem next-themes) e a página Feedback mostra notificações reais. Abas, sanfona, menu suspenso, diálogo, confirmação (ui/alert-dialog), caixa de seleção, opção e chave passam a usar os componentes de ui/, ajustados ao visual documentado. Página nova Catálogo de componentes, com todos os arquivos de ui/." },
    page: "catalogo", anchor: "catalogo-lista",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Voice and UX writing", pt: "Tom de voz e UX writing" },
    desc: { en: "New Guidelines page: four writing principles, the types of information (statement, observation, record, measurement, hypothesis, conclusion) and how to write intelligence texts as a conversation, not a report: rules, one structure for every discovery (discovery, context, possible reading, next step, details), avoid and prefer pairs and a review checklist. Also: breadcrumb, pagination, tooltip and side panel on the Overlays page now use the real ui/ components; the side panel (ui/sheet) traps focus and closes with Esc.", pt: "Página nova em Diretrizes: quatro princípios de escrita, os tipos de informação (declaração, observação, registro, medição, hipótese, conclusão) e como escrever textos de inteligência como uma conversa, e não um relatório: regras, uma estrutura única para toda descoberta (descoberta, contexto, leitura possível, próximo passo, detalhamento), pares evitar e preferir e perguntas de revisão. Também: trilha de navegação, paginação, dica de contexto e painel lateral da página Overlays passam a usar os componentes reais de ui/; o painel lateral (ui/sheet) prende o foco e fecha com Esc." },
    page: "voice", anchor: "escrita-principios",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "One standard for buttons, fields and focus", pt: "Padrão único de botão, campo e foco" },
    desc: { en: "ui/button now matches what the docs show: 40 px, 15 px semibold text, 12 px corners; text field, select and toggle are also 40 px, so they line up side by side. One focus ring for the whole DS: 2 px ring with 2 px offset, keyboard only. The Form controls and Feedback pages now render the real ui/ components (button, input, alert). ui/alert gains the state variants (success, info, warning, error). Motion tokens (--duration-*, --ease-*) now exist in theme.css, the *-muted colors work as classes, and token tables read their values from theme.css. Password field: lighter tip box and checks in the primary color.", pt: "O ui/button passa a ser igual ao que a documentação mostra: 40 px, texto 15 px seminegrito e cantos de 12 px; campo de texto, seleção e alternador também com 40 px, para alinharem lado a lado. Um destaque de foco só para o DS inteiro: anel de 2 px com respiro de 2 px, só pelo teclado. As páginas Controles de formulário e Feedback passam a mostrar os componentes reais (botão, campo, alerta). O ui/alert ganha as variantes de estado (sucesso, informação, aviso, erro). Os tokens de movimento (--duration-*, --ease-*) passam a existir no theme.css, as cores *-muted funcionam como classes e as tabelas de tokens leem os valores do theme.css. Campo de senha: caixa de dicas mais clara e checks na cor primária." },
    page: "buttons", anchor: "buttons",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Accessibility and consistency fixes", pt: "Correções de acessibilidade e consistência" },
    desc: { en: "shadow-* classes now use the DS shadow tokens (they used Tailwind's defaults). Form field borders are visible in the light theme (--input = --border-strong). Success and info darkened just enough for white text (4.5:1) and warning became burnt orange (#C2410C, 5.2:1). Alert titles in graphite, with colored icon and border. Error states use the error tokens. New --primary-text (crimson 500, 6.2:1) for red text and links. The Cards page now states the real default radius: 24 px (rounded-xl).", pt: "As classes shadow-* passam a usar as sombras do DS (usavam as padrão do Tailwind). A borda dos campos aparece no tema claro (--input = --border-strong). Sucesso e informação escurecidos só o necessário para o texto branco (4,5:1) e aviso em laranja queimado (#C2410C, 5,2:1). Título dos alertas em grafite, com ícone e borda coloridos. Estados de erro usam os tokens de erro. Novo --primary-text (carmim 500, 6,2:1) para texto e links em vermelho. A página Cards informa o raio real do card padrão: 24 px (rounded-xl)." },
    page: "feedback", anchor: "alerts",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Grid and spacing", pt: "Grid e espaçamento" },
    desc: { en: "New Foundation page with the grid system: 4 px spacing scale with real tokens (--space-1 to --space-24), 4, 8 and 12-column grid (phone, tablet from 640 px and desktop from 1024 px) with 16, 24 and 32 px margin and 16, 24 and 24 px gutter, maximum widths for reading (768 px), default (1152 px) and wide (1280 px), 64/80 px rhythm between sections and 96 px around the hero, usage examples, what to avoid and tokens. Ready classes: .ds-container, .ds-grid and .ds-section. The old Spacing section in Foundation links to the new page.", pt: "Nova página em Fundamentos com o sistema de grid: escala de espaçamento de 4 px com tokens reais (--space-1 a --space-24), grid de 4, 8 e 12 colunas (celular, tablet a partir de 640 px e desktop a partir de 1024 px) com margem de 16, 24 e 32 px e calha de 16, 24 e 24 px, larguras máximas de leitura (768 px), padrão (1152 px) e larga (1280 px), ritmo de 64/80 px entre seções e 96 px no hero, exemplos de uso, o que evitar e tokens. Classes prontas: .ds-container, .ds-grid e .ds-section. A antiga seção Espaçamento de Fundamentos leva para a página nova." },
    page: "grid", anchor: "grid-visao",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Faster Shine Border", pt: "Shine Border mais ligeiro" },
    desc: { en: "The shine loop is about 40% faster: component default from 14 s to 8 s; slow, standard and fast examples at 11, 8 and 5 s; highlight card and colour combinations at 7 s.", pt: "A volta do brilho ficou cerca de 40% mais rápida: padrão do componente de 14 s para 8 s; exemplos lento, padrão e rápido em 11, 8 e 5 s; card de destaque e combinações de cor em 7 s." },
    page: "cards", anchor: "card-shine",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Shine Border: the light now travels around the whole border", pt: "Shine Border: a luz agora dá a volta pela borda inteira" },
    desc: { en: "Before, a radial gradient slid back and forth on the diagonal: the border only changed tone and the shine did not travel through the corners. Now a beam (conic gradient) goes around the card every duration and passes through every corner. Colours, presets, duration and reduced motion stay the same.", pt: "Antes, um gradiente radial ia e voltava na diagonal: a borda só mudava de tom e o brilho não percorria os cantos. Agora um feixe (gradiente cônico) gira em volta do card a cada duration e passa por todos os cantos. Cores, presets, duração e movimento reduzido continuam iguais." },
    page: "cards", anchor: "card-shine",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Cards page reorganized: everything about cards in one place", pt: "Página Cards reorganizada: tudo sobre cards num só lugar" },
    desc: { en: "The Cards page now gathers everything about cards. It starts with “How to choose” (the background defines card, border, shadow and radius), then: 1) Solid card: anatomy, by background (white, light grey, and dark in light mode: white card without border and with strong shadow), border, shadow and radius, vertical and horizontal, with and without photo and button, buttons, information architecture (with the KPI cards), states (including loading), animation and where to apply it (lift on hover, Wobble, Canvas Reveal), Shine Border, nested and ready-made components; 2) Glass card: only combinations that pass the contrast check, by background (light, dark and photo) and with content; the “Default” finish is now called “Glass”; 3) Test the glass: the workbench, separated; 4) What to avoid: every “don't” in one place. Wobble Card, Shine Border, Canvas Reveal and the KPI cards left Motion, Backgrounds and Data Display; a “See in Cards” link stays there.", pt: "A página Cards foi reorganizada e passou a concentrar tudo sobre cards. Começa por “Como escolher” (o fundo define card, borda, sombra e raio) e segue em partes: 1) Card sólido: anatomia, por fundo (branco, cinza claro e escuro no modo claro: card branco sem borda e com sombra forte), borda, sombra e raio, vertical e horizontal, com e sem foto e botão, botões, arquitetura de informação (com os cards de KPI), estados (incluindo carregando), animação e onde aplicar (elevação no hover, Wobble, Canvas Reveal), Shine Border, aninhados e componentes prontos; 2) Card de vidro: só combinações aprovadas no contraste, por fundo (claro, escuro e foto) e com conteúdo; o acabamento “Padrão” passou a se chamar “Vidro”; 3) Testar o vidro: a bancada de teste, separada; 4) O que evitar: todos os “não faça” num só lugar. Wobble Card, Shine Border, Canvas Reveal e os cards de KPI saíram de Motion, Backgrounds e Exibição de dados; lá ficou um link “Ver em Cards”." },
    page: "cards", anchor: "card-escolher",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Glass cards: test background", pt: "Cards de vidro: fundo de teste" },
    desc: { en: "The finish picker gained a “Test background” control: default, dense texture, open texture, dark texture, light and subtle, and solid colour (light grey, mid grey, graphite or primary). The contrast check of each card uses the chosen background (worst case between the background and a texture stroke). The default glass now also appears in the finish gallery. On phones, the finish control and the rules table no longer push the page sideways.", pt: "O seletor de acabamentos ganhou o controle “Fundo de teste”: padrão, textura fechada, textura aberta, textura escura, clara e discreta e cor sólida (cinza claro, cinza médio, grafite ou primária). A conferência de contraste de cada card usa o fundo escolhido (pior caso entre o fundo e um traço da textura). O vidro padrão passou a aparecer também na galeria de acabamentos. No celular, o seletor de acabamento e a tabela de regras não empurram mais a página para o lado." },
    page: "cards", anchor: "card-glass",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Header & menus: current site model", pt: "Header e menus: modelo atual do site" },
    desc: { en: "The default is now the current header of the studio site: floating light pill on desktop, bar that turns graphite on phones, bottom-sheet menu. Scrolling became three independent switches (transparent at the top, logo becomes the icon, hides on scroll down). The full logo version is chosen by what is behind it (light, dark or photo). The menu stays in one place only: header or bottom bar.", pt: "O padrão agora é o header atual do site do estúdio: pílula clara flutuando no desktop, faixa que fica grafite no celular e menu em folha inferior. A rolagem virou três chaves independentes (transparente no topo, logo vira ícone ao rolar, some ao descer e volta ao subir). A versão do logo completo é escolhida pelo que está atrás dele (claro, escuro ou foto). O menu fica em um lugar só: header ou barra inferior." },
    page: "header", anchor: "header-demo",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Header & menus", pt: "Header e menus" },
    desc: { en: "New section with the site header pattern, based on the studio site and this DS header. Interactive demo in a window with its own scroll: three scroll behaviours (transparent → solid, hide and return, compact on scroll), three phone menus (side drawer, full screen, bottom bar for apps) and four backgrounds behind the header (page background, dark photo with veil, brand gradient, dark mode). Includes accessibility checklist, usage and tokens.", pt: "Nova seção com o padrão de header de site, a partir do site do estúdio e do header deste DS. Demonstração em uma janela com rolagem própria: três comportamentos de rolagem (transparente → sólido, some e volta, compacto ao rolar), três menus no celular (gaveta lateral, tela cheia e barra inferior para apps) e quatro fundos por trás do header (fundo da página, foto escura com véu, gradiente da marca e modo escuro). Inclui checklist de acessibilidade, uso e tokens." },
    page: "header", anchor: "header-demo",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Pricing cards: collapsible features and optional “Who it's for”", pt: "Cards de preço: recursos recolhíveis e “Para quem” opcional" },
    desc: { en: "The feature list starts collapsed, with a “Show plan features” button and the count (for example, 5 of 10). Opening or closing applies to every card, so they stay aligned; the button uses aria-expanded. The “Who it's for” box is optional: a plan without that text does not show it, and a switch in the demo shows the card with and without it.", pt: "A lista de recursos começa recolhida, com o botão “Ver recursos do plano” e a contagem (por exemplo, 5 de 10). Abrir ou fechar vale para todos os cards, que ficam sempre alinhados; o botão usa aria-expanded. O bloco “Para quem” é opcional: plano sem esse texto não mostra o bloco, e um interruptor na demonstração mostra o card com e sem ele." },
    page: "templates", anchor: "template-pricing",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Pricing cards in the wobble card style", pt: "Cards de preço no estilo do card com wobble" },
    desc: { en: "The pricing template now borrows the wobble card's look: larger rounding, round icon, “Recommended” chip with a star, bold plan name, checks in tinted circles and a footer with price and action. It keeps the Monthly/Yearly switch, the “Who it's for” box, included and not-included features and the selected state. Columns now follow the available width, and the “Who it's for” box grows instead of overflowing when the card is too narrow.", pt: "O template de preços passou a usar o visual do card com wobble: cantos mais arredondados, ícone em círculo, selo “Recomendado” com estrela, nome do plano em destaque, checks em círculo colorido e rodapé com preço e ação. Continuam o seletor Mensal/Anual, o bloco “Para quem”, os recursos incluídos e não incluídos e o estado selecionado. As colunas agora seguem a largura disponível, e o bloco “Para quem” cresce em vez de vazar quando o card fica estreito demais." },
    page: "templates", anchor: "template-pricing",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Cards on white: border, no shadow", pt: "Card sobre fundo branco: borda, sem sombra" },
    desc: { en: "New rule in Cards: on a white background, a card has no shadow and uses a light gray border (--border); shadows are for hover and overlays.", pt: "Nova regra em Cards: sobre fundo branco, o card não tem sombra e usa borda cinza clara (--border); a sombra fica para o hover e para sobreposições." },
    page: "cards", anchor: "card-guidelines",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Real version number", pt: "Número de versão real" },
    desc: { en: "Pages now show the published version and year (for example “Version 37 · 2026”), updated on every publication, instead of the fixed “Version 1.0 · 2024” left over from the template.", pt: "As páginas passaram a mostrar a versão publicada e o ano (por exemplo, “Versão 37 · 2026”), atualizados a cada publicação, no lugar do texto fixo “Versão 1.0 · 2024” que veio do modelo." },
    page: "overview",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Header shimmer visible in light mode", pt: "Brilho do cabeçalho visível no modo claro" },
    desc: { en: "In light mode, the shimmer on “Design System” in the header now sweeps in the primary colour over graphite text, so the animation can be seen. Dark mode is unchanged.", pt: "No modo claro, o brilho que passa por “Design System” no cabeçalho agora corre na cor primária sobre o texto grafite, e a animação fica visível. O modo escuro não mudou." },
    page: "overview",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Menu: “Comece aqui” group", pt: "Menu: grupo “Comece aqui”" },
    desc: { en: "In Portuguese, the first menu group is now called “Comece aqui”, so it no longer repeats the name of its first item, “Início”.", pt: "O primeiro grupo do menu passou a se chamar “Comece aqui”, para não repetir o nome do primeiro item, “Início”." },
    page: "overview",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Opens in light mode", pt: "DS abre no modo claro" },
    desc: { en: "Light mode is now the default: the design system opens in light. Dark mode is still one click away in the header. In dark mode, the Clear Space logo now uses the white-text version.", pt: "O modo claro passou a ser o padrão: o design system abre no claro. O modo escuro continua a um clique, no topo. No escuro, o logo da Área de respiro agora usa a versão com texto branco." },
    page: "overview",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Complete Lucide library", pt: "Biblioteca Lucide completa" },
    desc: { en: "Icons › Library now shows the whole Lucide library (lucide-react 1.70.0, 2,029 icons in Lucide's official categories, searchable). The 18 brand icons Lucide removed in 1.x (Figma, Github, Instagram, Linkedin, Youtube…) are kept in the DS in their own group. No icon was removed.", pt: "Ícones › Biblioteca agora mostra a Lucide inteira (lucide-react 1.70.0, 2.029 ícones nas categorias oficiais da Lucide, com busca). Os 18 ícones de marca que a Lucide tirou na versão 1.x (Figma, Github, Instagram, Linkedin, Youtube…) continuam no DS, num grupo próprio. Nenhum ícone foi removido." },
    page: "icons", anchor: "icon-library",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Pricing template: new texts and calmer dark mode", pt: "Template de preços: textos novos e modo escuro mais sóbrio" },
    desc: { en: "New \"Who it's for\" texts; the box now has a fixed height of four lines. In dark mode, plan name, price, icon and the \"Who it's for\" box are neutral (only the lightbulb stays yellow); the primary colour remains on the Recommended tag, checks, highlighted border and button.", pt: "Textos novos em \"Para quem\"; a caixa agora tem altura fixa de quatro linhas. No modo escuro, nome, preço, ícone e a caixa \"Para quem\" ficaram neutros (só a lâmpada continua amarela); a cor primária fica na etiqueta Recomendado, nos checks, na borda do destaque e no botão." },
    page: "templates", anchor: "template-pricing",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Pricing template: \"Who it's for\" box", pt: "Template de preços: caixa \"Para quem\"" },
    desc: { en: "The \"Who it's for\" box is now light yellow (warning-muted) with a lightbulb icon, has a fixed height of three lines in every card and no ellipsis: the text must fit in three lines. Three columns from 1280 px; one column below.", pt: "A caixa \"Para quem\" ficou amarelo-clara (warning-muted), com ícone de lâmpada, altura fixa de três linhas em todos os cards e sem reticências: o texto deve caber em até três linhas. Três colunas a partir de 1280 px; uma coluna abaixo disso." },
    page: "templates", anchor: "template-pricing",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Pricing template: plan names and selected state", pt: "Template de preços: nomes dos planos e estado selecionado" },
    desc: { en: "Plans are now named after what each tag meant (Visibility, Performance, Opportunities) and the tag was removed. The button reads \"Select Plan\" and, once clicked, fills with the primary colour, shows a check and \"Plan selected\"; the chosen card gets the primary border. Under Templates › Pricing.", pt: "Os planos passaram a se chamar pelo que cada tag dizia (Visibilidade, Desempenho, Oportunidades) e a tag saiu do card. O botão agora diz \"Selecionar Plano\" e, ao ser clicado, fica preenchido na primária, com check e \"Plano selecionado\"; o card escolhido ganha a borda na primária. Em Templates › Preços." },
    page: "templates", anchor: "template-pricing",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Pricing template", pt: "Template de preços" },
    desc: { en: "Plan cards now have a section seal above the name, name and price in the primary colour with \"/ month\", a \"Who it's for\" box limited to two lines, a description, a divider, included items with a check and not-included items with a dash, a \"Recommended\" tag on the highlighted plan and an outlined \"Select\" button. Equal heights; one column on phones. Under Templates › Pricing.", pt: "Os cards de plano ganharam selo de seção acima do nome, nome e preço na cor primária com \"/ mês\", caixa \"Para quem\" com no máximo duas linhas, descrição, divisor, itens incluídos com check e não incluídos com traço, etiqueta \"Recomendado\" no plano em destaque e botão \"Selecionar\" em contorno. Mesma altura; uma coluna no celular. Em Templates › Preços." },
    page: "templates", anchor: "template-pricing",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "English review", pt: "Revisão do inglês" },
    desc: { en: "Texts that showed in Portuguese in English mode are now in English: the upload components (drop area, file list, single image and gallery, including validation and status messages), the Heading examples in Typography, the section seal description, the side panel rules and the glass card contrast numbers.", pt: "Textos que apareciam em português no modo inglês agora estão em inglês: componentes de upload (área de soltar, lista de arquivos, imagem única e galeria, incluindo mensagens de validação e de estado), exemplos do Heading em Tipografia, descrição do selo de seção, regras do painel lateral e números de contraste do card de vidro." },
    page: "upload", anchor: "upload-dropzone",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Password field with confirmation", pt: "Campo de senha com confirmação" },
    desc: { en: "Password and confirmation with show/hide, strength in four bars with a label, hints that get a green check as each requirement is met, and a match message. Under Components › Buttons › Password.", pt: "Senha e confirmação com exibir/ocultar, força da senha em quatro barras com rótulo, dicas de preenchimento que ganham check verde conforme os requisitos são atendidos e aviso de coincidência. Em Componentes › Botões › Senha." },
    page: "buttons", anchor: "password",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Section seal", pt: "Selo de seção" },
    desc: { en: "The coloured pill from the site's sections (light primary fill, primary border, primary uppercase text with wide tracking), naming the subject above each section title. Next to the hero tag, under Components › Badges.", pt: "Pílula colorida das seções do site (tom claro da primária, borda na primária, texto na primária em caixa alta com espaçamento largo), para nomear o assunto acima do título de cada seção. Ao lado do selo do hero, em Componentes › Rótulos." },
    page: "badges", anchor: "selo-secao",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Timeline", pt: "Linha do tempo" },
    desc: { en: "Ported from the studio site's \"How it works\" section: steps with a round marker and a card, rail on the left on phones and centred with alternating cards from 768 px, plus the scroll-driven Step Indicator animation (current step grows, done steps fill the rail, cards slide in once). Honours reduced motion. Under Components.", pt: "Portada da seção \"Como funciona\" do site do estúdio: etapas com marcador redondo e card, linha à esquerda no celular e no centro com cards alternados a partir de 768 px, e a animação Step Indicator na rolagem (etapa atual cresce, feitas preenchem a linha, cards entram uma vez). Respeita movimento reduzido. Em Componentes." },
    page: "timeline", anchor: "timeline-demo",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Glassmorphism cards: test area with contrast alert", pt: "Cards glassmorphism: área de teste com alerta de contraste" },
    desc: { en: "Examples over the system texture with small icons; each test card measures title and subtitle contrast against the effective glass surface (WCAG AA) and alerts when accessibility is compromised. glassTextContrast helper and contrast utilities exported.", pt: "Exemplos sobre a textura do sistema em ícones pequenos; cada card de teste mede o contraste de título e subtítulo contra a superfície efetiva do vidro (WCAG AA) e alerta quando a acessibilidade fica comprometida. Helper glassTextContrast e utilitários de contraste exportados." },
    page: "cards", anchor: "card-glass",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Glass card with free opacity and blur control", pt: "Card de vidro com controle livre de opacidade e desfoque" },
    desc: { en: "Numeric props opacity (0–100 %) and blur (0–80 px) override the finish; sliders in the glassmorphism picker show the result and the code live.", pt: "Props numéricas opacity (0–100 %) e blur (0–80 px) sobrepõem o acabamento; sliders no seletor da seção Cards glassmorphism mostram o resultado e o código na hora." },
    page: "cards", anchor: "card-glass",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Glassmorphism cards with finishes", pt: "Cards glassmorphism com acabamentos" },
    desc: { en: "New finish prop with degrees of transparency: translucent, frosted, light focus and crystal, combinable with tone and opacity. Interactive picker in the glassmorphism cards section; finish tokens.", pt: "Nova prop finish com graus de transparência: translúcido, fosco, foco de luz e cristal, combináveis com tom e opacidade. Seletor interativo na seção de cards glassmorphism; tokens dos acabamentos." },
    page: "cards", anchor: "card-glass",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Doodle texture", pt: "Textura doodle" },
    desc: { en: "Seamless pattern with 66 line icons from the studio's universe (research, innovation, UX, UI, people, journeys, sticky notes, design thinking). Solid stroke color: graphite-200 on light, graphite-800 on dark, or any token via mask. SVG and PNG downloads. Under Backgrounds.", pt: "Padrão sem emenda com 66 ícones de traço do universo do estúdio (pesquisa, inovação, UX, UI, pessoas, jornadas, post-its, design thinking). Traço em cor sólida: grafite-200 no claro, grafite-800 no escuro, ou qualquer token via máscara. Download em SVG e PNG. Em Backgrounds." },
    page: "backgrounds", anchor: "doodle-bg",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Glassmorphism cards", pt: "Cards glassmorphism" },
    desc: { en: "New Cards subcategory: GlassCard component with light and dark glass, three intensities, primary tint, interactive version and a solid fallback under reduced transparency; rules for background, contrast and quantity.", pt: "Nova subcategoria em Cards: componente GlassCard com vidro claro e escuro, três intensidades, tingimento na primária, versão interativa e fallback sólido com transparência reduzida; regras de fundo, contraste e quantidade." },
    page: "cards", anchor: "card-glass",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Segmented control", pt: "Controle segmentado" },
    desc: { en: "Coupled options tapped like buttons, always with one selected: soft and solid variants, three sizes, icons, full width and disabled option. Under Components › Buttons › Segmented control.", pt: "Opções acopladas que se tocam como botões, sempre com uma selecionada: variantes suave e sólida, três tamanhos, ícones, largura total e opção desabilitada. Em Componentes › Botões › Controle segmentado." },
    page: "buttons", anchor: "segmented",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Shine Border with color combinations", pt: "Shine Border com combinações de cores" },
    desc: { en: "New preset prop with five token-only combinations (primaria, dourada, primaria-dourada, ouro, contraste); the gold is the --warning token. shineColor still accepts a list of colors. Documented under Motion › Shine Border.", pt: "Nova prop preset com cinco combinações só de tokens (primária, dourada, primária-dourada, ouro, contraste); o dourado é o token --warning. shineColor segue aceitando uma lista de cores. Documentado em Motion › Shine Border." },
    page: "motion", anchor: "shine-border",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Avatar Circles", pt: "Avatar Circles" },
    desc: { en: "Overlapping avatar circles with a “+N” count, ported from Magic UI and adapted to the tokens (borders follow the background, three sizes, “+N” clickable only with a destination). Under Components › Badges › Avatar.", pt: "Círculos de avatares sobrepostos com “+N”, portado do Magic UI e adaptado aos tokens (bordas seguem o fundo, três tamanhos, “+N” clicável só com destino). Em Componentes › Badges › Avatar." },
    page: "badges", anchor: "avatar-circles",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Partner invitation card", pt: "Card de convite ao parceiro" },
    desc: { en: "Card inviting professionals to join the Partner Network: hero tag, headline with highlight, benefit, primary action and secondary link. Vertical and horizontal, sizes S, M and L, card, tint and dark surfaces. Under Components › Cards.", pt: "Card que convida profissionais para a Rede de Parceiros: selo, título com destaque, benefício, ação principal e link secundário. Vertical e horizontal, tamanhos P, M e G, superfícies card, apoio e grafite. Em Componentes › Cards." },
    page: "cards", anchor: "card-partner",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Headlines with a primary-color highlight", pt: "Títulos com destaque na cor primária" },
    desc: { en: "The site's hero pattern applied to headlines: the key expression is set in the primary color (Heading component, highlight between asterisks). Page titles updated and the rule documented under Foundation › Typography.", pt: "Padrão do hero do site aplicado aos títulos: a expressão-chave fica na cor primária (componente Heading, destaque entre asteriscos). Títulos de página atualizados e regra documentada em Fundamentos › Tipografia." },
    page: "colors", anchor: "typography",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Upload components", pt: "Componentes de upload" },
    desc: { en: "Drop area (with camera on mobile), file list with progress and states, single image with preview and image gallery with cover. Type, size and count validation, accessibility checklist, usage and tokens.", pt: "Área de arrastar e soltar (com câmera no celular), lista de arquivos com progresso e estados, imagem única com prévia e galeria de imagens com capa. Validação de tipo, tamanho e quantidade, checklist de acessibilidade, uso e tokens." },
    page: "upload", anchor: "upload-dropzone",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Hero tag (selo)", pt: "Selo (tag do hero)" },
    desc: { en: "The pill at the top of the Experience Intelligence page on the studio site is now a component: card background, thin border, uppercase with wide tracking and a primary dot or icon. Under Labels › Hero tag, with usage rules and tokens.", pt: "A pílula do topo da página Experience Intelligence do site do estúdio virou componente: fundo de card, borda fina, caixa alta com espaçamento largo e ponto ou ícone na cor primária. Em Rótulos › Selo, com regras de uso e tokens." },
    page: "badges", anchor: "selo",
  },
  {
    date: "Nov 2026", kind: "New", title: { en: "Side panel (drawer)", pt: "Painel lateral (gaveta)" },
    desc: { en: "The studio site's contact drawer documented and turned into a component: anatomy (header, scrollable body, fixed action bar, footer), behavior, the full contact form variant with validation and success state, accessibility checklist, usage and tokens.", pt: "A gaveta de contato do site do estúdio documentada e transformada em componente: anatomia (cabeçalho, corpo rolável, barra de ação fixa, rodapé), comportamento, a variante formulário de contato com validação e estado de sucesso, checklist de acessibilidade, uso e tokens." },
    page: "sidepanel", anchor: "sidepanel-anatomy",
  },
  {
    date: "Nov 2026", kind: "Updated", title: { en: "Maintained on GitHub, no longer in Figma Make", pt: "Mantido no GitHub, não mais no Figma Make" },
    desc: { en: "From November 1st, 2026 the repository is the single source of truth: every change is made in code, published automatically as a numbered version (v1, v2, ...) and checked against the previous version so nothing disappears unnoticed.", pt: "A partir de 1º de novembro de 2026 o repositório é a única fonte da verdade: toda mudança é feita no código, publicada automaticamente como versão numerada (v1, v2, ...) e comparada com a anterior para que nada suma sem aviso." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "New", title: { en: "Shine Border for highlighted cards", pt: "Shine Border para cards em destaque" },
    desc: { en: "A Magic UI-inspired Shine Border primitive is now available as an opt-in Card decoration, with timing and reduced-motion guidance documented under Motion.", pt: "Um primitive Shine Border inspirado no Magic UI agora está disponível como decoração opcional de Card, com orientações de timing e movimento reduzido documentadas em Motion." },
    page: "cards", anchor: "card-shine",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Ghost, link and card button patterns", pt: "Padrões de botões ghost, link e em cards" },
    desc: { en: "Buttons now documents Ghost and Link usage, while Cards covers header, content, footer, navigation and destructive action patterns.", pt: "Botões agora documenta o uso de Ghost e Link, enquanto Cards contempla padrões no cabeçalho, conteúdo, rodapé, navegação e ações destrutivas." },
    page: "cards", anchor: "card-actions",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Nested card elevation rule", pt: "Regra de elevação para cards aninhados" },
    desc: { en: "The Cards specification now covers nested cards: the parent owns elevation, while every inner card uses shadow-none.", pt: "A especificação de Cards agora contempla cards aninhados: o card pai define a elevação, enquanto todo card interno usa shadow-none." },
    page: "cards", anchor: "card-nested",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Global search no longer depends on forwarded refs", pt: "Busca global não depende mais de refs encaminhadas" },
    desc: { en: "The search palette now uses a local React dialog, preserving bilingual filtering, keyboard shortcuts, focus and navigation without the unstable cmdk/Radix forwardRef path.", pt: "A paleta de busca agora usa um diálogo React local, preservando filtro bilíngue, atalhos, foco e navegação sem o caminho instável de forwardRef do cmdk/Radix." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Dialog composition stabilized for hot reload", pt: "Composição do diálogo estabilizada no hot reload" },
    desc: { en: "The Radix overlay now renders directly inside the portal, preserving function component identity while keeping SlotClone refs on the primitive.", pt: "O overlay Radix agora é renderizado diretamente no portal, preservando a identidade dos function components e mantendo as refs do SlotClone no primitive." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Dialog refs now reach Radix primitives", pt: "Refs do diálogo agora chegam aos primitives Radix" },
    desc: { en: "Dialog wrappers now forward refs correctly, removing SlotClone warnings from global search and every shared dialog.", pt: "Os wrappers de diálogo agora encaminham refs corretamente, removendo warnings do SlotClone na busca global e em todos os diálogos compartilhados." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Complete Cards specification restored", pt: "Especificação completa de Cards restaurada" },
    desc: { en: "Cards is back under Components with anatomy, variants, layout, interactive states, usage guidance, accessibility and semantic tokens.", pt: "Cards voltou para Componentes com anatomia, variantes, layout, estados interativos, diretrizes de uso, acessibilidade e tokens semânticos." },
    page: "cards",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Stable search dialog runtime", pt: "Runtime estável no diálogo de busca" },
    desc: { en: "React is now deduplicated by the Vite resolver, preventing the global search dialog from loading hooks from a second runtime instance.", pt: "O React agora é deduplicado pelo resolver do Vite, evitando que o diálogo de busca global carregue hooks de uma segunda instância do runtime." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Global search is now functional", pt: "Busca global agora funciona" },
    desc: { en: "Open search from the header or with Command/Ctrl + K to find and navigate to any page or section in English or Portuguese.", pt: "Abra a busca pelo cabeçalho ou com Command/Ctrl + K para encontrar e acessar qualquer página ou seção em inglês ou português." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Caption for the sidebar menu icon", pt: "Legenda no ícone de menu da sidebar" },
    desc: { en: "The menu icon at the top of the sidebar now has a tooltip and shows a \"Menu\" label when the sidebar is expanded.", pt: "O ícone de menu no topo da sidebar agora tem tooltip e exibe o rótulo \"Menu\" quando a sidebar está expandida." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "\"Motion\" kept as-is in Portuguese", pt: "\"Motion\" mantido em português" },
    desc: { en: "The Motion menu group and token category no longer translate to \"Movimento\", matching how the term is used in Portuguese design and development.", pt: "O grupo Motion do menu e a categoria de tokens deixam de ser traduzidos como \"Movimento\", seguindo o uso do termo no design e desenvolvimento em português." },
    page: "motion",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Cleaner sidebar header", pt: "Cabeçalho da sidebar mais limpo" },
    desc: { en: "Removed the divider line under the menu icon at the top of the sidebar.", pt: "Removida a linha divisória abaixo do ícone de menu no topo da sidebar." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Content aligned with the breadcrumb", pt: "Conteúdo alinhado ao breadcrumb" },
    desc: { en: "The breadcrumb trail and the page content now share the same container, so their left edges always line up.", pt: "O breadcrumb e o conteúdo da página agora compartilham o mesmo container, e suas bordas esquerdas ficam sempre alinhadas." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Consistent sidebar guide line", pt: "Linha guia consistente no menu lateral" },
    desc: { en: "Every open sidebar group now shows the same vertical guide line, including single-page groups with sub-items.", pt: "Todo grupo aberto do menu lateral agora mostra a mesma linha vertical, inclusive grupos de página única com subitens." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Sidebar behaves as an accordion", pt: "Menu lateral funciona como acordeão" },
    desc: { en: "Opening a category now closes the others, so only one group is expanded at a time.", pt: "Ao abrir uma categoria, as demais são fechadas: apenas um grupo fica expandido por vez." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Sidebar starts with 9 groups", pt: "Menu lateral começa com 9 grupos" },
    desc: { en: "The menu now opens collapsed, showing only Start, Brand, Foundation, Concepts, Guidelines, Backgrounds, Motion, Templates and Components. Click a group to reveal its pages.", pt: "O menu agora abre recolhido, mostrando só Start, Brand, Foundation, Concepts, Guidelines, Backgrounds, Motion, Templates e Components. Clique em um grupo para ver suas páginas." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Sidebar expands on hover", pt: "Menu lateral expande ao passar o mouse" },
    desc: { en: "On desktop, the sidebar stays as a 64px icon rail and only expands, over the content, while you hover or focus it.", pt: "No desktop, o menu lateral fica como uma faixa de ícones de 64px e só expande, por cima do conteúdo, enquanto você passa o mouse ou foca nele." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Sidebar overlays the content", pt: "Menu lateral fica por cima do conteúdo" },
    desc: { en: "On desktop, expanding the sidebar no longer pushes the page. It slides over the content while the page keeps a fixed 64px rail.", pt: "No desktop, expandir o menu lateral não empurra mais a página. Ele fica por cima do conteúdo, que mantém uma faixa fixa de 64px." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Menu toggle now inside the sidebar", pt: "Botão do menu agora dentro do menu lateral" },
    desc: { en: "On desktop, the hamburger icon sits at the top of the sidebar itself. On mobile it stays in the header.", pt: "No desktop, o ícone de hambúrguer fica no topo do próprio menu lateral. No mobile ele continua no cabeçalho." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Menu toggle moved to the header", pt: "Botão do menu agora no cabeçalho" },
    desc: { en: "The hamburger icon before the logo now opens and closes the sidebar on every screen size.", pt: "O ícone de hambúrguer antes do logo agora abre e fecha o menu lateral em qualquer tamanho de tela." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Collapsible sidebar", pt: "Menu lateral retraível" },
    desc: { en: "On desktop, collapse the menu down to icons only and expand it back. Your choice is remembered.", pt: "No desktop, recolha o menu para mostrar só os ícones e expanda de novo. Sua escolha fica salva." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "New", title: { en: "What's New on Home", pt: "Novidades na Home" },
    desc: { en: "This log. Every addition to the design system is recorded here, newest first.", pt: "Este registro. Toda adição ao design system é anotada aqui, da mais recente para a mais antiga." },
    page: "overview", anchor: "whats-new",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Home refreshed", pt: "Home renovada" },
    desc: { en: "Rewritten for vibe coders and AI tools, with a map of every section in the system.", pt: "Reescrita para vibe coders e ferramentas de IA, com um mapa de todas as seções do sistema." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Design Principles as a timeline", pt: "Princípios de Design em linha do tempo" },
    desc: { en: "A vertical timeline with cards alternating left and right on desktop, and a single rail on mobile.", pt: "Uma linha do tempo vertical com cards alternando entre esquerda e direita no desktop, e um único trilho no mobile." },
    page: "principles",
  },
  {
    date: "Oct 2026", kind: "New", title: { en: "Home in the sidebar", pt: "Home na barra lateral" },
    desc: { en: "Home is now the first item in the Start group, above Get Started.", pt: "A Home agora é o primeiro item do grupo Início, acima de Primeiros passos." },
    page: "overview",
  },
  {
    date: "Oct 2026", kind: "Removed", title: { en: "Posts & Carousels", pt: "Posts e Carrosséis" },
    desc: { en: "Removed from the menu to keep the system focused on product interfaces.", pt: "Removidos do menu para manter o sistema focado em interfaces de produto." },
  },
  {
    date: "Oct 2026", kind: "Updated", title: { en: "Single-line header", pt: "Cabeçalho em uma linha" },
    desc: { en: "Icon, Dani Moscatelli, a divider and a shimmering Design System label on one line.", pt: "Ícone, Dani Moscatelli, um divisor e um rótulo Design System com brilho, tudo em uma linha." },
  },
  {
    date: "Oct 2026", kind: "New", title: { en: "Guidelines: Usability and Accessibility", pt: "Diretrizes: Usabilidade e Acessibilidade" },
    desc: { en: "Action hierarchy, target sizes, microcopy, contrast, focus, keyboard and ARIA, each with a checklist.", pt: "Hierarquia de ações, tamanhos de alvo, microcopy, contraste, foco, teclado e ARIA, cada um com um checklist." },
    page: "usability",
  },
  {
    date: "Oct 2026", kind: "New", title: { en: "Start group", pt: "Grupo Início" },
    desc: { en: "Get Started, Design Principles and Develop sit at the top of the menu, above Brand.", pt: "Primeiros passos, Princípios de Design e Desenvolvimento ficam no topo do menu, acima de Marca." },
    page: "get-started",
  },
];

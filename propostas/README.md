# Propostas de componente

Qualquer funcionalidade com interface que for desenvolvida — tela, seção, fluxo, ajuste ou correção, pedida pela dona do produto ou não — começa obrigatoriamente pela consulta ao DS, sem que ela precise pedir, e é montada com o que já existe.

Se for pedido algo que não está no DS, o projeto tem autonomia para criar o componente, mas sempre dentro do DS e de forma formal e documentada:
- branch `componente/<nome>` no repositório do DS;
- componente em `src/app/components/ui/` usando só tokens e regras do DS;
- seção na documentação, com variações, estados, acessibilidade e exemplo;
- entrada no changelog e no catálogo;
- registro da proposta em `propostas/AAAA-MM-DD-<nome>.md`, com motivo, tela de origem, API, variações, acessibilidade, testes e capturas.

O produto só usa o componente depois que ele chega pela sincronização; nunca uma cópia local. A publicação continua com o "sim" da dona do produto.

## Passo a passo

1. Confira no [`CATALOGO.md`](../CATALOGO.md) que a peça não existe (nem como componente na seção 1 nem como padrão só em demonstração na seção 2). Se existir como padrão, a proposta é promovê-lo, com o mesmo visual.
2. Crie a branch `componente/<nome>` neste repositório.
3. Crie o componente em `src/app/components/ui/<nome>.tsx`, só com tokens e regras do DS. Abra o arquivo com um comentário (`/** ... */`) dizendo quando usar: ele vira o "Quando usar" do catálogo.
4. Documente numa seção do site (com `id` e item no menu): variações, estados, acessibilidade e exemplo de uso.
5. Acrescente a entrada no **topo** de `src/app/components/showcase/shared/changelog.ts`.
6. Copie o modelo abaixo para `propostas/AAAA-MM-DD-<nome>.md` e preencha.
7. Rode `pnpm build` (atualiza o catálogo, que passa a listar o componente e esta proposta) e `pnpm catalogo:check`; faça o commit de tudo e abra o pull request.
8. A publicação só acontece com o "sim" da dona do produto. O produto usa o componente depois que ele chega pela sincronização do design system; nunca uma cópia local.

## Status

Use um destes no campo **Status** (o catálogo mostra o status de cada proposta): `proposta` · `em revisão` · `aprovada` · `publicada` · `recusada`.

## Modelo

```markdown
# <Nome do componente>

- **Status:** proposta
- **Componente:** `<NomeDoComponente>` em `src/app/components/ui/<arquivo>.tsx`
- **Data:** AAAA-MM-DD
- **Branch:** `componente/<nome>`
- **Documentação:** página › seção (`pagina#ancora`)

## Motivo
Por que nenhum componente ou padrão do catálogo atende.

## Tela de origem
Produto, tela e pedido que geraram a necessidade.

## API
Props, valores padrão e exemplo de uso.

## Variações e estados
Variações, estados (padrão, hover, foco, desabilitado, carregando, erro, vazio) e temas.

## Acessibilidade
Contraste, foco, teclado, leitores de tela, menos movimento, alvo de toque.

## Testes
O que foi executado (build, páginas no navegador, celular) e o resultado.

## Capturas
Computador e celular.
```

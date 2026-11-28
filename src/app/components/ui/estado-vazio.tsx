"use client";

import * as React from "react";
import { CheckCircle2, Info, XCircle, AlertCircle } from "lucide-react";
import { cn } from "./utils";
import { Confete } from "./confete";
import { IconeComBase, tomSemClique } from "./painel-dados";
import { Card } from "./card";
import { SeloSecao } from "./selo-secao";

/**
 * EstadoVazio, EstadoFinal e PaginaDeErro: as três telas "sem conteúdo" do DS. Mesma API nos dois DS (FindLook e
 * Dani Moscatelli, 27/11/2026).
 *
 * EstadoVazio — uma lista, tabela ou área que ainda não tem nada (ou que o filtro esvaziou). Ícone na base, título,
 *   uma frase que explica o porquê e, quando houver, a próxima ação. O estado vazio não se toca, então o ícone fica
 *   informativo (colorido na base cinza, regra de 28/11/2026); tom "desabilitado" quando a área está indisponível. Os
 *   nomes antigos ("neutro", "marca") continuam aceitos e ficam informativos. variante "pagina" (padrão,
 *   centralizado no lugar da lista) ou "lista" (dentro de um card, alinhado à esquerda como uma linha da lista).
 *   `ilustracao`: imagem decorativa no lugar do ícone (no FindLook, o mascote de Mascote & Ilustrações › Estados
 *   vazios). `moldura`: "nenhuma" (padrão), "tracejado" (no lugar de uma lista) ou "card" (sozinho na página).
 * EstadoFinal — o fim de um fluxo (cadastro enviado, pesquisa concluída, peça publicada): ícone de estado que entra com um pequeno
 *   movimento, título, texto, um resumo opcional (children) e as ações. tom "sucesso" (padrão), "info", "aviso" ou
 *   "erro"; o ícone e o texto dizem o estado, nunca só a cor.
 * PaginaDeErro — página inteira de erro (404, sem acesso, fora do ar): código grande ou ilustração, título, texto e
 *   as ações ("Voltar ao início" em botão cheio). Centralizada na altura da tela; com abaixoDoCabecalho, começa a
 *   --espaco-abaixo-do-cabecalho do cabeçalho do site. moldura="card" (28/11/2026): card branco só de borda com o selo
 *   "Erro 404" (o padrão do site Dani Moscatelli; o logo fica só no cabeçalho).
 *   Regra (dona do produto, 28/11/2026): link quebrado ou incompleto (um link de e-mail sem o código, por exemplo) =
 *   esta página 404 padrão. Nunca mostrar formulário com botão desativado e aviso, nem uma página "link incompleto".
 *
 * Alinhamento (regra do celular): tudo centralizado numa coluna estreita; as ações ficam juntas numa linha
 * centralizada e, quando não cabem, viram uma coluna de botões da mesma largura.
 * Acessibilidade: o título é um <h2> (ou o nível de `nivel`); EstadoFinal usa role="status" e recebe o foco no título;
 * PaginaDeErro tem <h1>. Movimento só com "menos movimento" desligado.
 * Texto: diga o que está vazio e o próximo passo, sem "Ops" nem culpa; nunca invente números ou motivos.
 */

type Nivel = 1 | 2 | 3 | 4;
const titulo = (n: Nivel) => (`h${n}` as unknown) as React.ElementType;

/* Ações: lado a lado e centralizadas; quando não cabem, uma coluna com os botões na mesma largura. */
function Acoes({ children, className }: { children?: React.ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <div data-slot="estado-acoes" className={cn("mt-6 flex w-full flex-col items-stretch justify-center gap-3 min-[26rem]:flex-row min-[26rem]:flex-wrap min-[26rem]:items-center", className)}>
      {children}
    </div>
  );
}

const MOLDURA = {
  nenhuma: "",
  tracejado: "rounded-lg border border-dashed border-[var(--border-strong)] px-6",
  card: "rounded-xl border border-border bg-card px-6",
} as const;

export type EstadoVazioProps = Omit<React.ComponentProps<"div">, "title"> & {
  icone?: React.ReactNode;
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  /** Botões ou links (um primário no máximo). */
  acoes?: React.ReactNode;
  /** "informativo" (padrão) ou "desabilitado". "neutro" e "marca" ainda valem e ficam informativos. */
  tom?: "informativo" | "desabilitado" | "neutro" | "marca";
  /** "sm" dentro de cards e painéis estreitos; "md" (padrão) no lugar de uma lista ou página. */
  tamanho?: "sm" | "md";
  variante?: "pagina" | "lista";
  nivel?: Nivel;
  /** Imagem decorativa no lugar do ícone. */
  ilustracao?: string;
  /** Borda em volta (só na variante "pagina"). */
  moldura?: keyof typeof MOLDURA;
};

function EstadoVazio({ icone, titulo: t, descricao, acoes, tom = "informativo", tamanho = "md", variante = "pagina", nivel = 2, ilustracao, moldura = "nenhuma", className, ...props }: EstadoVazioProps) {
  const H = titulo(nivel);
  if (variante === "lista") {
    return (
      <div data-slot="estado-vazio" data-tom={tom} data-variante="lista" className={cn("grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 px-4 py-4", className)} {...props}>
        {icone ? <IconeComBase tom={tomSemClique(tom)} tamanho="md">{icone}</IconeComBase> : <span />}
        <div className="min-w-0 self-center">
          <H className="m-0 text-body-sm font-semibold text-foreground text-pretty">{t}</H>
          {descricao && <p className="m-0 mt-1 text-body-sm text-pretty text-muted-foreground">{descricao}</p>}
          {acoes && <div className="mt-3 flex flex-wrap items-center gap-3">{acoes}</div>}
        </div>
      </div>
    );
  }
  return (
    <div
      data-slot="estado-vazio"
      data-tom={tom}
      data-moldura={moldura}
      className={cn(
        "mx-auto flex w-full flex-col items-center text-center motion-safe:animate-in motion-safe:fade-in motion-safe:duration-[var(--duration-slow)]",
        moldura === "nenhuma" ? "max-w-md" : MOLDURA[moldura],
        tamanho === "sm" ? "py-6" : "py-12",
        className,
      )}
      {...props}
    >
      {ilustracao ? (
        <img src={ilustracao} alt="" className={cn("h-auto object-contain", tamanho === "sm" ? "mb-3 w-24" : "mb-4 w-40")} />
      ) : icone ? (
        <IconeComBase tom={tomSemClique(tom)} tamanho={tamanho === "sm" ? "md" : "lg"} className={tamanho === "sm" ? "mb-3" : "mb-4"}>
          {icone}
        </IconeComBase>
      ) : null}
      <H className={cn("m-0 max-w-md font-semibold text-foreground text-balance", tamanho === "sm" ? "text-body" : "text-subtitle")}>{t}</H>
      {descricao && <p className={cn("m-0 mt-2 max-w-md text-pretty text-muted-foreground", tamanho === "sm" ? "text-body-sm" : "text-body-sm sm:text-body")}>{descricao}</p>}
      <Acoes className={tamanho === "sm" ? "mt-4" : undefined}>{acoes}</Acoes>
    </div>
  );
}

const TONS_FINAIS = {
  sucesso: { Icone: CheckCircle2, base: "bg-success-muted text-success-text" },
  info: { Icone: Info, base: "bg-info-muted text-info-text" },
  aviso: { Icone: AlertCircle, base: "bg-warning-muted text-warning-text" },
  erro: { Icone: XCircle, base: "bg-error-muted text-error-text" },
} as const;

export type EstadoFinalProps = Omit<React.ComponentProps<"div">, "title"> & {
  tom?: keyof typeof TONS_FINAIS;
  /** Troca o ícone padrão do tom (mantenha o mesmo significado). */
  icone?: React.ReactNode;
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  acoes?: React.ReactNode;
  nivel?: Nivel;
  /** Recebe o foco ao aparecer (troca de tela num fluxo). */
  focarAoAparecer?: boolean;
  /** Confete ao aparecer (28/11/2026): só para uma conquista de verdade, como um cadastro concluído. Nada com "menos movimento". */
  comemorar?: boolean;
};

function EstadoFinal({ tom = "sucesso", icone, titulo: t, descricao, acoes, nivel = 2, focarAoAparecer = true, comemorar = false, children, className, ...props }: EstadoFinalProps) {
  const H = titulo(nivel);
  const ref = React.useRef<HTMLHeadingElement>(null);
  const { Icone, base } = TONS_FINAIS[tom];
  React.useEffect(() => {
    if (focarAoAparecer) ref.current?.focus({ preventScroll: true });
  }, [focarAoAparecer]);
  return (
    <div data-slot="estado-final" data-tom={tom} role="status" className={cn("mx-auto flex w-full max-w-lg flex-col items-center py-12 text-center", className)} {...props}>
      <span aria-hidden className={cn("mb-5 flex size-16 items-center justify-center rounded-full [&_svg]:size-8 motion-safe:animate-in motion-safe:zoom-in-50 motion-safe:duration-[var(--duration-slow)] motion-safe:ease-[var(--ease-back)]", base)}>
        {icone ?? <Icone />}
      </span>
      <H ref={ref} tabIndex={-1} className="m-0 text-h3 font-bold leading-tight tracking-[-0.02em] text-foreground outline-none text-balance">{t}</H>
      {descricao && <p className="m-0 mt-3 text-pretty text-body leading-relaxed text-muted-foreground">{descricao}</p>}
      {children && <div className="mt-6 w-full text-left">{children}</div>}
      <Acoes>{acoes}</Acoes>
      {comemorar && <Confete ativo />}
    </div>
  );
}

export type PaginaDeErroProps = Omit<React.ComponentProps<"main">, "title"> & {
  /** "404", "403"… Sem moldura, é o número grande (decorativo; o título diz o que aconteceu); no card, vai no selo. */
  codigo?: string;
  /** Ilustração no lugar do código (imagem decorativa; no FindLook, a ilustração 404 do mascote). */
  ilustracao?: React.ReactNode;
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  acoes?: React.ReactNode;
  /** Ocupa a altura da tela (padrão) ou só o conteúdo (demonstrações). Sem efeito com abaixoDoCabecalho. */
  telaCheia?: boolean;
  /**
   * "nenhuma" (padrão): o conteúdo solto na página. "card" (28/11/2026, o padrão do site Dani Moscatelli): um card
   * branco só de borda, centralizado, com o selo "Erro 404", o título, o texto e o botão. O logo fica só no cabeçalho.
   */
  moldura?: "nenhuma" | "card";
  /** Texto do selo do card (padrão: "Erro " + codigo). */
  selo?: React.ReactNode;
  /**
   * O conteúdo começa a --espaco-abaixo-do-cabecalho do cabeçalho do site (32 px no celular, 64 px do desktop em diante),
   * em vez de ficar no meio da altura da tela. Padrão: sim com moldura="card"; não sem moldura.
   */
  abaixoDoCabecalho?: boolean;
  /** "main" (padrão, a página) ou "div" (demonstração dentro de outra página, que já tem o seu <main>). */
  elemento?: "main" | "div";
};

function PaginaDeErro({ codigo, ilustracao, titulo: t, descricao, acoes, telaCheia = true, moldura = "nenhuma", selo, abaixoDoCabecalho, elemento = "main", className, ...props }: PaginaDeErroProps) {
  const Raiz = elemento as React.ElementType;
  const abaixo = abaixoDoCabecalho ?? moldura === "card";
  const comCard = moldura === "card";
  const textoDoSelo = selo ?? (codigo ? `Erro ${codigo}` : null);
  return (
    <Raiz
      data-slot="pagina-de-erro"
      data-moldura={moldura}
      className={cn(
        "@container/erro flex w-full flex-col items-center text-center",
        abaixo ? "ds-abaixo-do-cabecalho justify-start pb-16" : "justify-center py-16",
        comCard ? "px-[var(--grid-margin)]" : "px-4",
        telaCheia && !abaixo && "min-h-svh",
        className,
      )}
      {...props}
    >
      {comCard ? (
        <Card className="w-full max-w-xl items-center gap-0 px-6 py-8 shadow-none motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-[var(--duration-slow)] motion-safe:ease-[var(--ease-snappy)] @min-[40rem]/erro:px-10 @min-[40rem]/erro:py-12">
          {ilustracao ? (
            <div aria-hidden className="mb-6 w-full max-w-60">{ilustracao}</div>
          ) : textoDoSelo ? (
            <SeloSecao size="sm" className="mb-4">{textoDoSelo}</SeloSecao>
          ) : null}
          {/* Título numa linha só no celular, como na prévia aprovada (28/11/2026): 24 px até 480 px de largura, 32 px até 640 px e 36 px depois. */}
          <h1 className="m-0 text-h3 font-bold leading-tight tracking-[-0.03em] text-foreground text-balance @min-[30rem]/erro:text-h2 @min-[40rem]/erro:text-display-md">{t}</h1>
          {descricao && <p className="m-0 mt-3 max-w-xs text-balance text-body leading-relaxed text-muted-foreground">{descricao}</p>}
          {/* Uma ação só fica centralizada na largura do texto; duas ou mais seguem a regra das Acoes. */}
          <Acoes className="[&:has(>:only-child)]:items-center">{acoes}</Acoes>
        </Card>
      ) : (
        <div className="flex w-full max-w-lg flex-col items-center">
          {ilustracao ? (
            <div aria-hidden className="mb-8 w-full max-w-xs">{ilustracao}</div>
          ) : codigo ? (
            <p aria-hidden className="m-0 mb-4 text-h1 font-bold leading-none tracking-[-0.04em] text-primary-text tabular-nums sm:text-display-lg">{codigo}</p>
          ) : null}
          <h1 className="m-0 text-h2 font-bold leading-tight tracking-[-0.03em] text-foreground text-balance">{t}</h1>
          {descricao && <p className="m-0 mt-3 text-pretty text-body leading-relaxed text-muted-foreground">{descricao}</p>}
          <Acoes className="mt-8">{acoes}</Acoes>
        </div>
      )}
    </Raiz>
  );
}

export { EstadoVazio, EstadoFinal, PaginaDeErro };

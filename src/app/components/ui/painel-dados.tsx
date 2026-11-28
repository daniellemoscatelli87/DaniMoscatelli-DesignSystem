import * as React from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Info } from "lucide-react";
import { cn } from "./utils";
import { Card } from "./card";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

/**
 * Dados do painel: ícone com base, card de indicador (KPI), card com cabeçalho de ícone, divisor suave e link "ver tudo".
 * Trazidos do FindLook Design System (ui/painel-dados.tsx) com as cores deste DS. Os cards são o Card do DS (só borda,
 * sem sombra parada, cantos do Card).
 */

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/* ── Ícone com base ──────────────────────────────────────────── */
/**
 * Regra: só três jeitos de mostrar um ícone, e nunca misturados.
 * marca: base rosa (--primary-muted) + ícone vermelho (--primary-text). O ícone do que é foco ou convida a agir
 *        (cabeçalho de card de seção, destaque, próxima ação, algo ativo).
 * neutro: base cinza (--muted) + ícone cinza (--muted-foreground). O ícone só identifica o tipo de informação
 *        (cards de indicador, itens pausados, encerrados ou só de registro). É o padrão em grades de cards iguais.
 * Ícone sem base (inline, ao lado do texto) não usa este componente. Nunca base cinza com ícone vermelho, nem o contrário.
 */
type TomDoIcone = "marca" | "neutro";
const TAMANHO_DA_BASE = { sm: "h-8 w-8 [&>svg]:h-4 [&>svg]:w-4", md: "h-10 w-10 [&>svg]:h-5 [&>svg]:w-5", lg: "h-12 w-12 [&>svg]:h-6 [&>svg]:w-6" };
function IconeComBase({ tom, tamanho = "md", redonda = false, children, className }: { tom: TomDoIcone; tamanho?: keyof typeof TAMANHO_DA_BASE; redonda?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <span
      aria-hidden
      data-slot="icone-com-base"
      data-tom={tom}
      className={cn(
        "flex shrink-0 items-center justify-center",
        redonda ? "rounded-full" : "rounded-md",
        tom === "marca" ? "bg-[var(--primary-muted)] text-primary-text" : "bg-muted text-muted-foreground",
        TAMANHO_DA_BASE[tamanho],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ── Formatação pt-BR ────────────────────────────────────────── */
const fmtNumero = new Intl.NumberFormat("pt-BR");
function formatarNumero(n: number) { return fmtNumero.format(n); }
/** +18,6% / −4% (sinal sempre visível; vírgula decimal). */
function formatarVariacao(n: number) {
  const abs = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 }).format(Math.abs(n));
  return `${n > 0 ? "+" : n < 0 ? "−" : ""}${abs}%`;
}

/* ── Variação (seta + texto; nunca só cor) ───────────────────── */
function Variacao({ valor, comparacao, className }: { valor: number; comparacao?: string; /** Mantida por compatibilidade com o DS FindLook: não muda o desenho. */ pilula?: boolean; className?: string }) {
  const sobe = valor >= 0;
  const Icone = sobe ? ArrowUpRight : ArrowDownRight;
  const leitura = `${sobe ? "Alta" : "Queda"} de ${formatarVariacao(Math.abs(valor)).replace("+", "")}${comparacao ? ` ${comparacao}` : ""}`;
  return (
    <span data-slot="variacao" className={cn("inline-flex items-center gap-1 text-body-sm font-semibold", sobe ? "text-success-text" : "text-primary-text", className)}>
      <Icone aria-hidden className="h-4 w-4" />
      <span aria-hidden className="tabular-nums">{formatarVariacao(valor)}</span>
      {comparacao && <span aria-hidden className="ml-1 font-normal text-muted-foreground">{comparacao}</span>}
      <span className="sr-only">{leitura}</span>
    </span>
  );
}

/* ── Explicação acessível (toque, teclado e mouse) ───────────── */
function Explicacao({ termo, children }: { termo: string; children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger aria-label={`O que é ${termo}?`} data-alvo-compacto="" className={cn("relative inline-flex h-6 w-6 items-center after:absolute after:-inset-2.5 after:content-[''] justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground", foco)}>
        <Info aria-hidden className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-64 text-body-sm leading-relaxed">{children}</PopoverContent>
    </Popover>
  );
}

/* ── Card de indicador (KPI) ─────────────────────────────────── */
type CardIndicadorProps = Omit<React.ComponentProps<"div">, "children"> & {
  icone: React.ReactNode;
  /** Número do indicador. null: a contagem não veio (mostra "–" e "Sem dado" para leitores de tela). */
  valor: number | null;
  /** Total de que o valor faz parte (48 de 75): aparece "de 75", menor, ao lado do número. */
  total?: number;
  rotulo: string;
  /**
   * Como o número aparece (28/11/2026): "numero" (padrão, 1.234) ou "percentual" (o valor em pontos: 67 vira "67%").
   * Para outro formato (moeda, horas), passe `formatar`, que recebe o número e devolve o texto; ele vale também para o total.
   */
  formato?: "numero" | "percentual";
  formatar?: (n: number) => string;
  /** Linha curta de contexto, embaixo do número ("nos últimos 7 dias"). */
  apoio?: React.ReactNode;
  variacao?: number;
  comparacao?: string;
  explicacao?: React.ReactNode;
  /** Selo de estado embaixo do número (Badge do DS: "3 não respondidas"). */
  selo?: React.ReactNode;
  /** Ação no rodapé do card (LinkVerTudo), separada por um DivisorSuave. */
  acao?: React.ReactNode;
  /** Base do ícone: "neutro" (padrão em grades de cards iguais) ou "marca". */
  tom?: TomDoIcone;
  /**
   * Card clicável: o card inteiro leva ao detalhe (o rótulo é o link, esticado sobre o card). Use no lugar de um link
   * "Ver …" que repetiria o rótulo. Hover: borda --border-strong (cinza, nunca rosa) e fundo --row-hover; foco: anel no card inteiro.
   */
  href?: string;
  /** Elemento do link do card clicável (padrão "a"; use o Link do roteador do produto). */
  as?: React.ElementType;
  /**
   * Compacto: respiro de 16 px e ícone de 32 px, para 4 cards lado a lado em contêineres a partir de ~44rem (cada card
   * com ~168 px) ou 2 × 2 no celular. Rótulo de uma palavra ou duas, número e uma linha curta de contexto.
   */
  compacto?: boolean;
  /** No celular (abaixo de 640 px), mostra só rótulo e número: esconde ícone, apoio, variação e selo (no 2 × 2 do celular o
   *  rótulo usa a largura toda do card e nunca é cortado pelo ícone). */
  soNumeroNoCelular?: boolean;
};

/**
 * Card de indicador: rótulo em cima à esquerda, ícone com base no canto superior direito e, logo abaixo, o número grande.
 * A linha do rótulo tem a altura de duas linhas de texto (a do ícone), então numa linha de cards os números ficam
 * alinhados mesmo quando um rótulo quebra. Depois vêm apoio, variação e selo; a ação, se houver, desce para o rodapé.
 * O ícone de explicação fica colado à última palavra do rótulo.
 * Use numa GradeDeCards com colunas pelo contêiner (não aperte: 4 lado a lado só com um contêiner de 66rem, cada card com
 * ~15,75rem e o rótulo numa linha; senão 2 × 2, e 1 no celular).
 */
function CardIndicador({ icone, valor, total, rotulo, formato = "numero", formatar, apoio, variacao, comparacao, explicacao, selo, acao, tom = "neutro", href, as, compacto = false, soNumeroNoCelular = false, className, ...props }: CardIndicadorProps) {
  const mostrar = (n: number) => (formatar ? formatar(n) : formato === "percentual" ? `${formatarNumero(n)}%` : formatarNumero(n));
  const extra = soNumeroNoCelular ? "max-sm:hidden" : undefined;
  const palavras = rotulo.split(" ");
  const ultima = palavras.pop() ?? "";
  const Link = as ?? "a";
  const textoDoRotulo = (
    <>
      {palavras.length > 0 && `${palavras.join(" ")} `}
      <span className="whitespace-nowrap">
        {ultima}
        {explicacao && <span className="relative z-10 ml-1 inline-flex align-middle"><Explicacao termo={rotulo}>{explicacao}</Explicacao></span>}
      </span>
    </>
  );
  return (
    <Card
      orientacao="vertical"
      data-indicador=""
      data-clicavel={href ? "" : undefined}
      className={cn(
        "relative min-w-0 gap-0",
        compacto ? "p-4" : "p-5",
        href && "cursor-pointer transition-[background-color,border-color] duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-[var(--border-strong)] hover:bg-row-hover active:border-[var(--border-strong)] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background motion-reduce:transition-none",
        className,
      )}
      {...props}
    >
      <div className={cn("flex items-start justify-between", compacto ? "min-h-8 gap-3" : "min-h-10 gap-4", soNumeroNoCelular && "max-sm:min-h-10")}>
        <p className={cn("min-w-0 pt-1 font-medium leading-snug text-muted-foreground", compacto ? "text-body-sm" : "text-body")}>
          {href ? (
            // O link cobre o card inteiro (after:inset-0); o nome acessível é o rótulo seguido do número.
            <Link href={href} className="text-foreground outline-none after:absolute after:inset-0 after:rounded-xl after:content-['']">{textoDoRotulo}</Link>
          ) : textoDoRotulo}
        </p>
        <IconeComBase tom={tom} tamanho={compacto ? "sm" : "md"} className={extra}>{icone}</IconeComBase>
      </div>
      <div className="pt-2">
        <p className={cn("font-bold leading-none tracking-[-0.025em] tabular-nums text-foreground", "text-h2")}>
          {valor === null ? <><span aria-hidden>–</span><span className="sr-only">Sem dado</span></> : mostrar(valor)}
          {total !== undefined && valor !== null && <span className="ml-1 text-body font-semibold tracking-normal text-muted-foreground">de {mostrar(total)}</span>}
        </p>
        {apoio && <p className={cn("mt-2 text-body-sm leading-snug text-muted-foreground", extra)}>{apoio}</p>}
        {variacao !== undefined && <div className={cn("mt-2", extra)}><Variacao valor={variacao} comparacao={comparacao} /></div>}
        {selo && <div className={cn("mt-3 flex flex-wrap gap-2", extra)}>{selo}</div>}
      </div>
      {acao && (
        <div className="mt-auto pt-4">
          <DivisorSuave />
          <div className="pt-3">{acao}</div>
        </div>
      )}
    </Card>
  );
}

/* ── Divisor suave ───────────────────────────────────────────── */
/**
 * Linha de 1 px que some nas laterais: degradê transparente → --border-strong → transparente, com o esmaecimento nos
 * últimos ~18% de cada lado. Separa partes de um card sem fechar uma caixa.
 */
function DivisorSuave({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      data-slot="divisor-suave"
      className={cn("h-px w-full shrink-0 bg-[linear-gradient(to_right,transparent,var(--border-strong)_18%,var(--border-strong)_82%,transparent)]", className)}
    />
  );
}

/* ── Card com cabeçalho de ícone ─────────────────────────────── */
/**
 * Card das páginas do painel (Card do DS, só borda): ícone com base (marca, padrão), título e uma linha opcional de
 * descrição; ação opcional à direita, no alto; depois, o conteúdo. Fica embaixo do CabecalhoDaPagina. Um card por
 * assunto. tom="neutro" para o que está pausado ou é só registro.
 * cabecalho: "divisor" (padrão): o cabeçalho é separado do conteúdo por um DivisorSuave. "simples": sem divisor.
 * sangria: o conteúdo vai de ponta a ponta do card (listas com hover de linha inteira, como a LinhaDeLista).
 */
type EstiloDoCabecalhoDoCard = "divisor" | "simples";
type CardComCabecalhoProps = Omit<React.ComponentProps<"section">, "title"> & {
  icone: React.ReactNode;
  titulo: string;
  descricao?: React.ReactNode;
  acao?: React.ReactNode;
  tom?: TomDoIcone;
  cabecalho?: EstiloDoCabecalhoDoCard;
  nivel?: 2 | 3 | 4;
  sangria?: boolean;
  /** Id do título (aria-labelledby da seção). */
  idDoTitulo?: string;
};

function CardComCabecalho({ icone, titulo, descricao, acao, tom = "marca", cabecalho = "divisor", nivel = 2, sangria = false, idDoTitulo, children, className, ...props }: CardComCabecalhoProps) {
  const gerado = React.useId();
  const tid = idDoTitulo ?? gerado;
  const Titulo = `h${nivel}` as "h2" | "h3" | "h4";
  const temConteudo = children !== undefined && children !== null && children !== false;
  return (
    <section aria-labelledby={tid} data-slot="card-com-cabecalho" data-cabecalho={cabecalho} className={cn("min-w-0", className)} {...props}>
      <Card orientacao="vertical" className="@container h-full min-w-0 gap-0 py-5 sm:py-6">
        {/* Ícone, texto e ação na mesma linha: a ação fica à direita, centralizada com o texto, e o texto quebra dentro da
            coluna dele. Em card estreito (menos de 20rem), a ação desce para baixo do texto, na mesma borda esquerda dele;
            nunca volta para a borda do ícone (regra do DS, 27/11/2026). */}
        <div data-slot="cabecalho-do-card" className={cn("grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 px-5 sm:px-6", acao && "@xs:grid-cols-[auto_minmax(0,1fr)_auto]", temConteudo && cabecalho === "simples" && "mb-5")}>
          <IconeComBase tom={tom} className="self-start">{icone}</IconeComBase>
          <div className="min-w-0 self-center">
            <Titulo id={tid} className="text-body-lg font-bold leading-snug tracking-[-0.01em] text-foreground [text-wrap:pretty]">{titulo}</Titulo>
            {descricao && <p className="mt-1 text-body-sm leading-snug text-muted-foreground [text-wrap:pretty]">{descricao}</p>}
          </div>
          {acao && <div data-slot="acao-do-cabecalho" className="col-start-2 flex min-w-0 flex-wrap items-center gap-2 justify-self-start @xs:col-start-3 @xs:row-start-1 @xs:justify-self-end">{acao}</div>}
        </div>
        {temConteudo && cabecalho === "divisor" && <DivisorSuave className="my-4 sm:my-5" />}
        <div data-slot="conteudo-do-card" className={cn("min-w-0", !sangria && "px-5 sm:px-6")}>{children}</div>
      </Card>
    </section>
  );
}

/* ── Link "ver tudo" ─────────────────────────────────────────── */
/**
 * Link "ver tudo" com seta. tom="marca" (padrão, --primary-text) para o principal; tom="neutro" (cinza) para o
 * secundário. Sem href e com onClick, vira botão. as: o Link do roteador do produto. Alvo de pelo menos 24 px de altura (44 px no
 * celular, abaixo de 640 px).
 */
type LinkVerTudoProps = Omit<React.ComponentProps<"a">, "children"> & {
  children?: React.ReactNode;
  /** Nome acessível mais completo que o texto visível (deve conter o texto visível). */
  rotulo?: string;
  tom?: TomDoIcone;
  icone?: React.ReactNode;
  as?: React.ElementType;
};
function LinkVerTudo({ children = "Ver tudo", href, rotulo, onClick, tom = "marca", icone, as, className, ...props }: LinkVerTudoProps) {
  const classe = cn(
    "group inline-flex min-h-6 shrink-0 items-center gap-1 rounded-sm text-body-sm font-semibold toque:min-h-11 underline-offset-2 hover:underline [&>svg]:h-4 [&>svg]:w-4",
    tom === "marca" ? "text-primary-text" : "text-muted-foreground hover:text-foreground",
    foco,
    className,
  );
  const conteudo = (
    <>
      {icone && <span aria-hidden className="mr-1 inline-flex [&>svg]:h-4 [&>svg]:w-4">{icone}</span>}
      {children} <ArrowRight aria-hidden className="transition-transform motion-safe:group-hover:translate-x-0.5" />
    </>
  );
  if (href === undefined && onClick && !as) {
    return <button type="button" aria-label={rotulo} onClick={onClick as unknown as React.MouseEventHandler<HTMLButtonElement>} className={classe}>{conteudo}</button>;
  }
  const Elemento = as ?? "a";
  return <Elemento data-slot="link-ver-tudo" href={href ?? "#"} aria-label={rotulo} onClick={onClick} className={classe} {...props}>{conteudo}</Elemento>;
}

export { IconeComBase, CardIndicador, CardComCabecalho, DivisorSuave, LinkVerTudo, Variacao, Explicacao, formatarNumero, formatarVariacao };
export type { TomDoIcone, EstiloDoCabecalhoDoCard, CardIndicadorProps, CardComCabecalhoProps, LinkVerTudoProps };

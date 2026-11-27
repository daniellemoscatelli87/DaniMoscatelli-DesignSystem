"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "./utils";
import { IconeComBase } from "./painel-dados";

/**
 * EstadoVazio, EstadoFinal e PaginaDeErro: as três telas "sem conteúdo" do DS.
 *
 * EstadoVazio — uma lista, tabela ou área que ainda não tem nada (ou que o filtro esvaziou). Ícone na base, título,
 *   uma frase que explica o porquê e, quando houver, a próxima ação. Use dentro de um card ou no lugar da lista.
 *   tom "neutro" (padrão: nada a fazer agora, ou "nenhum resultado") ou "marca" (convite a começar: "Crie o primeiro").
 * EstadoFinal — o fim de um fluxo (cadastro enviado, pesquisa concluída, descadastro feito): ícone de estado que entra
 *   com um pequeno movimento, título, texto, um resumo opcional (children) e as ações. tom "sucesso" (padrão), "info",
 *   "aviso" ou "erro"; o ícone e o texto dizem o estado, nunca só a cor.
 * PaginaDeErro — página inteira de erro (404, sem acesso, fora do ar): código grande opcional, título, texto e as
 *   ações ("Voltar ao início" em botão cheio). Centralizada na altura da tela.
 *
 * Alinhamento (regra do celular): tudo centralizado numa coluna estreita (até 28rem no vazio, 32rem no final);
 * as ações ficam juntas numa linha centralizada e, quando não cabem, viram uma coluna de botões da mesma largura.
 * Acessibilidade: o título é um <h2> (ou o nível de `nivel`); EstadoFinal usa role="status" (anuncia o fim do fluxo)
 * e PaginaDeErro tem <h1>. Movimento só com "menos movimento" desligado.
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

export type EstadoVazioProps = Omit<React.ComponentProps<"div">, "title"> & {
  icone?: React.ReactNode;
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  /** Botões ou links (um primário no máximo). */
  acoes?: React.ReactNode;
  tom?: "neutro" | "marca";
  /** "sm" dentro de cards e painéis estreitos; "md" (padrão) no lugar de uma lista ou página. */
  tamanho?: "sm" | "md";
  nivel?: Nivel;
};

function EstadoVazio({ icone, titulo: t, descricao, acoes, tom = "neutro", tamanho = "md", nivel = 2, className, ...props }: EstadoVazioProps) {
  const H = titulo(nivel);
  return (
    <div
      data-slot="estado-vazio"
      data-tom={tom}
      className={cn("mx-auto flex w-full max-w-md flex-col items-center text-center", tamanho === "sm" ? "py-6" : "py-12", className)}
      {...props}
    >
      {icone && (
        <IconeComBase tom={tom} tamanho={tamanho === "sm" ? "md" : "lg"} className={tamanho === "sm" ? "mb-3" : "mb-4"}>
          {icone}
        </IconeComBase>
      )}
      <H className={cn("font-semibold text-foreground text-balance", tamanho === "sm" ? "text-body" : "text-subtitle")}>{t}</H>
      {descricao && <p className={cn("mt-2 text-pretty text-muted-foreground", tamanho === "sm" ? "text-body-sm" : "text-body-sm sm:text-body")}>{descricao}</p>}
      <Acoes className={tamanho === "sm" ? "mt-4" : undefined}>{acoes}</Acoes>
    </div>
  );
}

const TONS_FINAIS = {
  sucesso: { Icone: CheckCircle2, base: "bg-success-muted text-success-text" },
  info: { Icone: Info, base: "bg-info-muted text-info-text" },
  aviso: { Icone: AlertTriangle, base: "bg-warning-muted text-warning-text" },
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
};

function EstadoFinal({ tom = "sucesso", icone, titulo: t, descricao, acoes, nivel = 2, focarAoAparecer = true, children, className, ...props }: EstadoFinalProps) {
  const reduzir = useReducedMotion();
  const H = titulo(nivel);
  const ref = React.useRef<HTMLHeadingElement>(null);
  const { Icone, base } = TONS_FINAIS[tom];
  React.useEffect(() => {
    if (focarAoAparecer) ref.current?.focus({ preventScroll: true });
  }, [focarAoAparecer]);
  return (
    <div
      data-slot="estado-final"
      data-tom={tom}
      role="status"
      className={cn("mx-auto flex w-full max-w-lg flex-col items-center py-12 text-center", className)}
      {...props}
    >
      <motion.span
        aria-hidden
        initial={reduzir ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
        className={cn("mb-5 flex size-16 items-center justify-center rounded-full [&_svg]:size-8", base)}
      >
        {icone ?? <Icone />}
      </motion.span>
      <H ref={ref} tabIndex={-1} className="text-h3 font-bold leading-tight tracking-[-0.02em] text-foreground outline-none text-balance">
        {t}
      </H>
      {descricao && <p className="mt-3 text-pretty text-body leading-relaxed text-muted-foreground">{descricao}</p>}
      {children && <div className="mt-6 w-full text-left">{children}</div>}
      <Acoes>{acoes}</Acoes>
    </div>
  );
}

export type PaginaDeErroProps = Omit<React.ComponentProps<"main">, "title"> & {
  /** "404", "403"… (decorativo; o título diz o que aconteceu). */
  codigo?: string;
  /** Ilustração no lugar do código (imagem decorativa). */
  ilustracao?: React.ReactNode;
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  acoes?: React.ReactNode;
  /** Ocupa a altura da tela (padrão) ou só o conteúdo (demonstrações). */
  telaCheia?: boolean;
};

function PaginaDeErro({ codigo, ilustracao, titulo: t, descricao, acoes, telaCheia = true, className, ...props }: PaginaDeErroProps) {
  return (
    <main
      data-slot="pagina-de-erro"
      className={cn("flex w-full flex-col items-center justify-center px-4 py-16 text-center", telaCheia && "min-h-svh", className)}
      {...props}
    >
      <div className="flex w-full max-w-lg flex-col items-center">
        {ilustracao ? (
          <div aria-hidden className="mb-8 w-full max-w-xs">{ilustracao}</div>
        ) : codigo ? (
          <p aria-hidden className="mb-4 text-h1 font-bold leading-none tracking-[-0.04em] text-primary-text tabular-nums sm:text-display-lg">
            {codigo}
          </p>
        ) : null}
        <h1 className="text-h2 font-bold leading-tight tracking-[-0.03em] text-foreground text-balance">{t}</h1>
        {descricao && <p className="mt-3 text-pretty text-body leading-relaxed text-muted-foreground">{descricao}</p>}
        <Acoes className="mt-8">{acoes}</Acoes>
      </div>
    </main>
  );
}

export { EstadoVazio, EstadoFinal, PaginaDeErro };

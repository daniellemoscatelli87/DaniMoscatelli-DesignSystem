"use client";

import * as React from "react";
import { ChevronDown, EllipsisVertical } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./dropdown-menu";

/**
 * BotaoDeAcoes (menu "Ações") — pedido da dona do produto, 28/11/2026
 *
 * "Se houver mais ações no card, vamos criar um botão de ações padronizado, inspirado no que já existe no painel
 * administrativo. É um botão escrito 'Ações', com uma seta apontando para baixo. Quando a pessoa toca, abre o menu de
 * opções. No mobile a palavra 'Ações' não aparece, e esse botão vira um botão com 3 pontinhos verticais dentro."
 *
 * Veio do menu "Ações" da área restrita (Pesquisas › Dados: botão de contorno com os 3 pontinhos, menu alinhado à
 * direita, com ícone em cada opção e as de excluir em vermelho, depois de um separador).
 *
 * - Tablet e computador: botão secundário (contorno, pílula) "Ações" com a seta para baixo (ChevronDown), que gira
 *   quando o menu abre.
 * - Celular (abaixo de 640 px) ou soIcone: botão redondo só de ícone, com os 3 pontinhos verticais (EllipsisVertical),
 *   44 px de área de toque. O nome "Ações" continua para leitores de tela.
 * - Abre o DropdownMenu do DS, alinhado à borda direita do botão. Teclado: Enter, Espaço ou seta para baixo abrem; as
 *   setas percorrem; Esc fecha e devolve o foco ao botão.
 * - opcoes: rótulo, ícone (Lucide), onSelect ou href (novaAba), destrutiva (cor de erro, depois de um separador) e
 *   desabilitada. Para um menu diferente, passe DropdownMenuItem como children no lugar de opcoes.
 * - No card (regra da ação nos cards): com mais de 2 ações, a principal (pílula) e este botão com as outras; sem uma
 *   principal clara, só este botão. Fica no lado direito da linha da ação (AcoesDoCard / CardFooter).
 */
export type OpcaoDeAcao = {
  rotulo: string;
  icone?: React.ReactNode;
  onSelect?: () => void;
  href?: string;
  novaAba?: boolean;
  /** Ação de excluir ou apagar: cor de erro, depois de um separador. */
  destrutiva?: boolean;
  desabilitada?: boolean;
};

export type BotaoDeAcoesProps = {
  opcoes?: OpcaoDeAcao[];
  /** Nome do botão (visível no tablet e no computador; só para leitores de tela no celular). Padrão: "Ações". */
  rotulo?: string;
  /** Só o ícone dos 3 pontinhos em qualquer largura (por exemplo, numa linha de lista). */
  soIcone?: boolean;
  desabilitado?: boolean;
  /** Alinhamento do menu em relação ao botão. Padrão: "end" (borda direita). */
  alinhar?: "start" | "center" | "end";
  /** Itens do menu feitos à mão (DropdownMenuItem do DS), no lugar de opcoes. */
  children?: React.ReactNode;
  textos?: { novaAba?: string };
  className?: string;
};

function BotaoDeAcoes({ opcoes = [], rotulo = "Ações", soIcone = false, desabilitado, alinhar = "end", children, textos, className }: BotaoDeAcoesProps) {
  const tx = { novaAba: " (abre em nova aba)", ...textos };
  const primeiraDestrutiva = opcoes.findIndex((o) => o.destrutiva);
  return (
    <span data-slot="botao-de-acoes" className={cn("inline-flex shrink-0", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={desabilitado}>
          <Button
            type="button"
            variant="outline"
            aria-label={rotulo}
            title={soIcone ? rotulo : undefined}
            className={cn(
              "group/acoes",
              soIcone ? "size-10 px-0 toque:size-11 max-sm:size-11 pointer-coarse:size-11" : "max-sm:size-11 max-sm:px-0",
            )}
          >
            {!soIcone && <span aria-hidden className="max-sm:hidden">{rotulo}</span>}
            {!soIcone && (
              <ChevronDown aria-hidden className="max-sm:hidden transition-transform duration-[var(--duration-fast)] group-data-[state=open]/acoes:rotate-180 motion-reduce:transition-none" />
            )}
            <EllipsisVertical aria-hidden className={soIcone ? "" : "sm:hidden"} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={alinhar} className="min-w-56">
          {children ??
            opcoes.map((o, i) => {
              const conteudo = (
                <>
                  {o.icone}
                  {o.rotulo}
                  {o.href && o.novaAba && <span className="sr-only">{tx.novaAba}</span>}
                </>
              );
              return (
                <React.Fragment key={o.rotulo + i}>
                  {i > 0 && i === primeiraDestrutiva && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    variant={o.destrutiva ? "destructive" : "default"}
                    disabled={o.desabilitada}
                    onSelect={o.onSelect}
                    asChild={!!o.href}
                    className="toque:min-h-11"
                  >
                    {o.href ? (
                      <a href={o.href} {...(o.novaAba ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{conteudo}</a>
                    ) : (
                      conteudo
                    )}
                  </DropdownMenuItem>
                </React.Fragment>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
}

export { BotaoDeAcoes };

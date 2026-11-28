"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { GatilhoDaConta } from "./painel-shell";
import { cn } from "./utils";

/**
 * MenuDaConta, CabecalhoDaConta, ItemDaConta e SeparadorDaConta (menu do perfil no cabeçalho)
 *
 * O menu que abre do avatar no cabeçalho do painel: no topo, o nome (semibold, --foreground) e o e-mail (menor, em
 * --muted-foreground), um divisor e as ações da conta com ícone (Configurações, Sair…). Padronizado a partir da área
 * restrita, com o mesmo desenho, a pedido da dona do produto (28/11/2026). Mesmo arquivo e mesma API nos dois DS.
 *
 * Nome e e-mail são texto, nunca link: não sublinham, não mudam de cor e não respondem ao toque. No iPhone, o Safari
 * transforma e-mails e outros dados em links sozinho ("data detectors"); o cabeçalho anula esses links (cor herdada,
 * sem sublinhado, sem toque) e a página que usa o menu deve ter
 * <meta name="format-detection" content="telephone=no, email=no, address=no, date=no">.
 * O e-mail longo termina em reticências; o texto inteiro continua na página para o leitor de tela.
 *
 * Foco: depois de tocar ou clicar, o gatilho não fica marcado ao fechar (o foco não volta para ele, e o anel vermelho
 * não aparece). Pelo teclado (Enter ou Espaço para abrir, Esc para fechar), o foco volta ao gatilho com o anel.
 *
 * O "Sair" fica neutro, como as outras ações (não é exclusão). Use ItemDaConta com asChild para um link do roteador.
 */

type Interacao = "ponteiro" | "teclado";

export type MenuDaContaProps = Omit<React.ComponentProps<typeof DropdownMenuContent>, "children"> & {
  /** Nome da pessoa (topo do menu e gatilho). */
  nome: string;
  /** E-mail mostrado embaixo do nome, como texto. */
  email?: string;
  /** Outra linha de apoio no lugar do (ou junto com o) e-mail: papel, loja. */
  detalhe?: string;
  /** Foto da pessoa no gatilho; sem foto, as iniciais. */
  foto?: string;
  /** Papel mostrado no gatilho, ao lado do nome (a partir de 640 px). */
  papel?: string;
  /** Nome do gatilho para o leitor de tela (padrão: "Conta de <nome>. Abrir menu da conta"). */
  rotuloDoGatilho?: string;
  /** Classe do gatilho (o GatilhoDaConta do painel). */
  classeDoGatilho?: string;
  /** Um gatilho próprio, no lugar do GatilhoDaConta (precisa aceitar ref e eventos, como um <button>). */
  gatilho?: React.ReactElement;
  /** Abre e fecha controlado de fora, se precisar. */
  aberto?: boolean;
  onAbertoChange?: (aberto: boolean) => void;
  /** As ações: ItemDaConta e SeparadorDaConta. */
  children: React.ReactNode;
};

function MenuDaConta({
  nome, email, detalhe, foto, papel, rotuloDoGatilho, classeDoGatilho, gatilho, aberto, onAbertoChange,
  align = "end", className, children, onCloseAutoFocus, onPointerDown, onPointerDownOutside, onKeyDown, ...props
}: MenuDaContaProps) {
  // Como a pessoa usou o menu por último: com toque/clique, o foco não volta marcado ao gatilho; pelo teclado, volta.
  const ultima = React.useRef<Interacao>("teclado");
  const ponteiro = () => { ultima.current = "ponteiro"; };
  const teclado = () => { ultima.current = "teclado"; };

  return (
    <DropdownMenu open={aberto} onOpenChange={onAbertoChange}>
      <DropdownMenuTrigger asChild onPointerDown={ponteiro} onKeyDown={teclado}>
        {gatilho ?? <GatilhoDaConta nome={nome} papel={papel} foto={foto} rotulo={rotuloDoGatilho} className={classeDoGatilho} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn("min-w-56 max-w-80", className)}
        {...props}
        data-slot="menu-da-conta"
        onPointerDown={(e) => { ponteiro(); onPointerDown?.(e); }}
        onPointerDownOutside={(e) => { ponteiro(); onPointerDownOutside?.(e); }}
        onKeyDown={(e) => { teclado(); onKeyDown?.(e); }}
        onCloseAutoFocus={(e) => {
          onCloseAutoFocus?.(e);
          if (ultima.current === "ponteiro") e.preventDefault();
        }}
      >
        <CabecalhoDaConta nome={nome} email={email} detalhe={detalhe} />
        <SeparadorDaConta />
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type CabecalhoDaContaProps = Omit<React.ComponentProps<typeof DropdownMenuLabel>, "children"> & {
  nome: string;
  email?: string;
  detalhe?: string;
};

/** Nome e e-mail no topo do menu: texto simples, nunca link (anula também os links que o Safari do iPhone cria). */
function CabecalhoDaConta({ nome, email, detalhe, className, ...props }: CabecalhoDaContaProps) {
  return (
    <DropdownMenuLabel
      className={cn(
        "min-w-0 font-normal",
        // Links criados pelo iPhone (x-apple-data-detectors) ou por outro detector: texto como o resto, sem toque.
        "[&_a]:cursor-default [&_a]:pointer-events-none [&_a]:text-inherit! [&_a]:no-underline!",
        className,
      )}
      {...props}
      data-slot="cabecalho-da-conta"
    >
      <span translate="no" className="block truncate text-body-sm font-semibold text-foreground">{nome}</span>
      {email && <span translate="no" className="block truncate text-label text-muted-foreground">{email}</span>}
      {detalhe && <span className="block truncate text-label text-muted-foreground">{detalhe}</span>}
    </DropdownMenuLabel>
  );
}

export type ItemDaContaProps = React.ComponentProps<typeof DropdownMenuItem> & {
  /** Ícone da Lucide (16 px, cinza), antes do texto. */
  icone?: React.ReactNode;
};

/** Uma ação da conta. Com asChild, o ícone entra dentro do link filho (ex.: o link do roteador do produto). */
function ItemDaConta({ icone, asChild, children, ...props }: ItemDaContaProps) {
  const comIcone = (filhos: React.ReactNode) => (
    <>
      {icone && <span aria-hidden className="contents">{icone}</span>}
      {filhos}
    </>
  );
  if (asChild && React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return (
      <DropdownMenuItem asChild {...props} data-slot="item-da-conta">
        {React.cloneElement(children, undefined, comIcone(children.props.children))}
      </DropdownMenuItem>
    );
  }
  return <DropdownMenuItem {...props} data-slot="item-da-conta">{comIcone(children)}</DropdownMenuItem>;
}

/** Divisor entre grupos de ações (o mesmo do DropdownMenu). */
function SeparadorDaConta(props: React.ComponentProps<typeof DropdownMenuSeparator>) {
  return <DropdownMenuSeparator {...props} />;
}

export { MenuDaConta, CabecalhoDaConta, ItemDaConta, SeparadorDaConta };

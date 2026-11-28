import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";

import { cn } from "./utils";

// Padrão único (decisão de 16/11/2026): botão de 40 px, mesma altura do campo de texto. Forma: pílula (28/11/2026).
// Texto no token do botão (14 px, seminegrito; escala tipográfica de 27/11/2026). No toque (celular ou tela de dedo),
// todo botão tem 44 px de altura (decisão de 27/11/2026); no computador com mouse, 40 px (sm: 32 px).

// Secundário (contorno), o mesmo desenho para variant="secondary" e o apelido variant="outline" (28/11/2026).
const varianteSecundaria =
  "border border-input bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input-fundo/30 dark:border-input dark:hover:bg-input-fundo/50";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-button font-semibold transition-all disabled:cursor-not-allowed disabled:shadow-none disabled:border-transparent disabled:bg-disabled disabled:text-disabled-foreground disabled:hover:bg-disabled disabled:hover:text-disabled-foreground dark:disabled:bg-disabled dark:disabled:hover:bg-disabled dark:disabled:border-transparent [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[var(--primary-hover)]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        // Secundário (contorno): o botão secundário do DS é um só (decisão da dona do produto, 28/11/2026: "o botão
        // contorno e o secundário podem virar um único botão"; o secundário já era o de contorno desde 20/11/2026).
        // Use variant="secondary". variant="outline" é apelido do mesmo botão, mantido para nada quebrar nos produtos.
        secondary: varianteSecundaria,
        outline: varianteSecundaria,
        // Exclusão em contorno (27/11/2026, especificação da área restrita, ADMIN_REACT.md §7.1): ação destrutiva que não
        // é a principal da área ("Excluir", "Apagar tudo"); o vermelho cheio (destructive) fica só na confirmação.
        // Contorno e texto --error-text (5,5:1 no branco), hover --error-muted, foco com anel de erro.
        "exclusao-contorno":
          "border border-[var(--error-text)] bg-transparent text-error-text hover:bg-error-muted focus-visible:ring-[var(--error)] dark:bg-input-fundo/30",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 disabled:bg-transparent disabled:hover:bg-transparent dark:disabled:bg-transparent",
        link: "text-primary-text underline-offset-4 hover:underline disabled:bg-transparent disabled:hover:bg-transparent disabled:no-underline",
      },
      // 44 px no toque com as variantes do próprio Tailwind (max-sm e pointer-coarse), além da variante toque do DS:
      // assim o botão tem 44 px no celular mesmo num produto que copiou ui/ e theme.css mas não carrega o theme.css no
      // mesmo CSS do @import "tailwindcss" (27/11/2026). Medido: 44 px a 390 px de tela (com e sem dedo) e 40 px no
      // computador com mouse.
      size: {
        default: "h-10 px-4 has-[>svg]:px-3 toque:h-11 max-sm:h-11 pointer-coarse:h-11",
        sm: "h-8 rounded-sm gap-1 px-3 text-button has-[>svg]:px-2 toque:h-11 max-sm:h-11 pointer-coarse:h-11",
        lg: "h-11 rounded-md px-5 text-body has-[>svg]:px-4",
        // Ícone: 40 px no computador, 44 px no toque. icon-lg: 44 px sempre (botões de ícone soltos, como o menu).
        icon: "size-10 rounded-md toque:size-11 max-sm:size-11 pointer-coarse:size-11",
        "icon-lg": "size-11 rounded-md",
      },
      // Forma. Decisão da dona do produto (28/11/2026), nos dois DS: "Pílula como padrão em ambos os projetos". Todo
      // botão é pílula (rounded-full) em qualquer variante e tamanho; o botão só de ícone vira círculo. "quadrado" (cantos
      // de 12 px; 8 px no sm) é exceção rara: botão colado a um campo ou dentro de uma barra de ferramentas de cantos
      // retos, onde a pílula destoa do que está em volta. "padrao" é o nome antigo de "quadrado" (até 27/11/2026, quando
      // o padrão eram os cantos de 12 px) e continua aceito.
      forma: {
        pilula: "rounded-full",
        quadrado: "",
        padrao: "",
      },
      // Quebra do texto (28/11/2026): no celular (abaixo de 640 px), um texto que não cabe na largura quebra em mais de
      // uma linha, centralizado, e o botão cresce para baixo (mínimo de 44 px, 8 px de respiro em cima e embaixo), em vez
      // de passar da borda da tela. Com um texto curto nada muda: continua uma linha só, com 44 px. Do tablet em diante,
      // uma linha só, como sempre. "nunca": uma linha em qualquer tela (para botões numa barra que rola para o lado).
      // Botão com altura própria no className (h-12, size-9) fica em "nunca", a menos que quebra venha explícita.
      // "sempre": pode quebrar em qualquer tela.
      quebra: {
        celular: "whitespace-nowrap max-sm:whitespace-normal max-sm:text-center max-sm:max-w-full",
        nunca: "whitespace-nowrap",
        sempre: "whitespace-normal text-center max-w-full",
      },
      // Camadas (28/11/2026): quando o botão pode carregar (prop carregando passada, true ou false), o rótulo e o
      // "carregando" ficam empilhados na mesma célula; a largura é a da maior das duas e nada pula ao trocar.
      camadas: {
        sim: "inline-grid place-items-center [grid-template-areas:'x'] *:[grid-area:x]",
        nao: "",
      },
    },
    // Quando o texto pode quebrar, a altura passa a ser mínima (a mesma de sempre) e o botão cresce com as linhas.
    compoundVariants: [
      { quebra: "celular", size: ["default", "sm", "lg"], class: "max-sm:h-auto max-sm:min-h-11 max-sm:py-2 toque:h-auto toque:min-h-11 pointer-coarse:h-auto pointer-coarse:min-h-11" },
      { quebra: "sempre", size: "default", class: "h-auto min-h-10 py-2 toque:h-auto toque:min-h-11 max-sm:h-auto max-sm:min-h-11 pointer-coarse:h-auto pointer-coarse:min-h-11" },
      { quebra: "sempre", size: "sm", class: "h-auto min-h-8 py-1.5 toque:h-auto toque:min-h-11 max-sm:h-auto max-sm:min-h-11 pointer-coarse:h-auto pointer-coarse:min-h-11" },
      { quebra: "sempre", size: "lg", class: "h-auto min-h-11 py-2" },
      // Na pílula, 4 px a mais de cada lado: o texto não encosta na curva (28/11/2026).
      { forma: "pilula", size: "default", class: "px-5 has-[>svg]:px-4" },
      { forma: "pilula", size: "sm", class: "px-4 has-[>svg]:px-3" },
      { forma: "pilula", size: "lg", class: "px-6 has-[>svg]:px-5" },
      // Com camadas, o ícone fica dentro da camada do rótulo: o respiro menor do botão com ícone vale do mesmo jeito.
      { camadas: "sim", forma: "pilula", size: "default", class: "has-[>[data-camada=parado]>svg]:px-4" },
      { camadas: "sim", forma: "pilula", size: "sm", class: "has-[>[data-camada=parado]>svg]:px-3" },
      { camadas: "sim", forma: "pilula", size: "lg", class: "has-[>[data-camada=parado]>svg]:px-5" },
      { camadas: "sim", forma: ["quadrado", "padrao"], size: "default", class: "has-[>[data-camada=parado]>svg]:px-3" },
      { camadas: "sim", forma: ["quadrado", "padrao"], size: "sm", class: "has-[>[data-camada=parado]>svg]:px-2" },
      { camadas: "sim", forma: ["quadrado", "padrao"], size: "lg", class: "has-[>[data-camada=parado]>svg]:px-4" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      forma: "pilula",
      // Padrão "nunca" para quem usa buttonVariants() direto (dia do calendário, paginação, ações do AlertDialog): o
      // desenho deles não muda. O componente Button liga a quebra do celular sozinho (veja quebraEfetiva).
      quebra: "nunca",
      camadas: "nao",
    },
  },
);

// Carregando (decisão da dona do produto, 28/11/2026: "o botão loading é colorido, porém levemente esmaecido"). O botão
// que está trabalhando fica na cor da própria variante (o vermelho do principal, o contorno do secundário), a 80% de
// opacidade, sem receber clique nem passar o mouse. Desabilitado (cinza, --disabled) é outra coisa: a ação não está
// disponível. Medido a 80%: texto branco sobre o principal 3,4:1 (Dani Moscatelli) e 4,0:1 (FindLook); texto escuro do
// contorno, 9:1 ou mais. Exportado para o BotaoDeEnvio e quem desenha o próprio conteúdo usarem o mesmo estado.
const classeDoCarregando = "pointer-events-none opacity-80";

type ButtonProps = React.ComponentProps<"button"> &
  Omit<VariantProps<typeof buttonVariants>, "camadas"> & {
    asChild?: boolean;
    /**
     * Ocupado, trabalhando (28/11/2026): mostra o giro antes do rótulo (ou do textoCarregando), mantém a cor da
     * variante um pouco esmaecida (80%), bloqueia o clique (aria-disabled, sem o cinza do desabilitado) e marca
     * aria-busy. Passe sempre (true ou false) num botão que pode carregar: a largura já reserva o giro e não pula.
     */
    carregando?: boolean;
    /** Texto no lugar do rótulo enquanto carrega ("Salvando…"). Sem ele, fica o próprio rótulo, com o giro. */
    textoCarregando?: React.ReactNode;
  };

// forwardRef (27/11/2026): com React 18, sem ele a ref do Radix (asChild em PopoverTrigger, TooltipTrigger,
// DropdownMenuTrigger…) se perdia no Button e o Popover ficava fora da tela (translate(0, -200%)), por exemplo o
// seletor de data dentro de uma janela.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, forma, quebra, asChild = false, carregando, textoCarregando, children, onClick, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  // Quem dá uma altura própria ao botão (h-12, size-9…) fica com uma linha só, como antes (28/11/2026): a quebra
  // automática do celular trocaria essa altura pela mínima. Com quebra explícita, vale o que foi pedido.
  const alturaPropria = /(^|\s)(h|size|min-h)-/.test(className ?? "");
  const quebraEfetiva = quebra ?? (alturaPropria ? "nunca" : "celular");
  // Carregando: camadas só quando o botão pode carregar (prop passada) e desenha o próprio conteúdo (asChild não).
  const ocupado = !!carregando;
  const comCamadas = carregando !== undefined && !asChild;
  // Texto lido pelo leitor de tela enquanto carrega: o textoCarregando, ou "Carregando" junto do rótulo.
  const anuncio = typeof textoCarregando === "string" ? textoCarregando : textoCarregando == null ? "Carregando" : "";

  return (
    <Comp
      ref={ref}
      data-slot="button"
      {...props}
      data-carregando={ocupado || undefined}
      aria-busy={ocupado ? true : props["aria-busy"]}
      aria-disabled={ocupado ? true : props["aria-disabled"]}
      className={cn(
        buttonVariants({ variant, size, forma, quebra: quebraEfetiva, camadas: comCamadas ? "sim" : "nao" }),
        ocupado && !props.disabled && classeDoCarregando,
        className,
      )}
      // Ocupado não recebe clique: nem do mouse (pointer-events), nem do teclado ou do Enter num formulário.
      onClick={ocupado ? (e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault() : onClick}
    >
      {comCamadas ? (
        <>
          <span data-camada="parado" className={cn("inline-flex items-center justify-center gap-2", ocupado && "invisible")}>
            {children}
          </span>
          <span
            data-camada="carregando"
            aria-hidden={typeof textoCarregando === "string" || undefined}
            className={cn("inline-flex items-center justify-center gap-2 [&>svg:not([data-giro])]:hidden", !ocupado && "invisible")}
          >
            {/* O giro do DS; com "menos movimento", fica parado e o texto continua dizendo que está carregando. */}
            <LoaderCircle data-giro aria-hidden className="motion-safe:animate-spin" />
            {textoCarregando ?? children}
          </span>
          <span className="sr-only" aria-live="polite">{ocupado ? anuncio : ""}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  );
});

export { Button, buttonVariants, classeDoCarregando };

import * as React from "react";
import { cn } from "./utils";

/**
 * Heading com destaque
 *
 * Padrão do hero do site do estúdio: Plus Jakarta Sans 700, tracking apertado, entrelinha 1,1 e a expressão-chave
 * na cor primária (`.destaque`). Escreva o destaque entre dois asteriscos:
 *   <Heading level={1}>Transforme a experiência das pessoas em **ativo estratégico** para o seu negócio.</Heading>
 * Regras: um destaque por título, de uma a três palavras, nunca o título inteiro.
 */

const sizes = {
  hero: "text-[2rem] sm:text-[2.5rem] lg:text-[3.25rem] leading-[1.1] tracking-[-0.03em] font-bold",
  page: "text-[2rem] sm:text-[2.5rem] leading-none tracking-[-0.035em] font-bold",
  section: "text-[1.5rem] leading-tight tracking-[-0.02em] font-bold",
  card: "text-[1.25rem] leading-snug tracking-[-0.015em] font-bold",
} as const;

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4;
  size?: keyof typeof sizes;
  /** Cor do destaque. "primary" segue a paleta do sistema. */
  tone?: "primary";
  children: React.ReactNode;
};

/** Converte "texto **destaque** texto" em spans. Aceita também children já em JSX. */
export function withHighlight(children: React.ReactNode, className = "text-primary"): React.ReactNode {
  if (typeof children !== "string") return children;
  const parts = children.split(/\*\*(.+?)\*\*/g);
  if (parts.length === 1) return children;
  return parts.map((p, i) => (i % 2 === 1 ? <span key={i} className={className}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>));
}

export function Heading({ level = 2, size, tone = "primary", className, children, ...props }: HeadingProps) {
  const Tag = (`h${level}` as unknown) as React.ElementType;
  const sz = size ?? (level === 1 ? "page" : level === 2 ? "section" : "card");
  return (
    <Tag
      data-slot="heading"
      className={cn("text-foreground [text-wrap:balance]", sizes[sz], className)}
      style={{ fontFamily: "var(--font-sans)" }}
      {...props}
    >
      {withHighlight(children, tone === "primary" ? "text-primary" : undefined)}
    </Tag>
  );
}

/** Só o destaque, para usar dentro de um título já existente. */
export function Destaque({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("text-primary", className)}>{children}</span>;
}

import * as React from "react";
import { cn } from "./utils";

/**
 * Prosa (texto longo: Termos de uso, Política de privacidade, páginas de ajuda): mesma API nos dois DS (FindLook e
 * Dani Moscatelli, 27/11/2026). Aplica a tipografia do DS a um texto corrido em HTML simples (h1, h2, h3, p, ul, ol, a, strong,
 * blockquote, table, hr), sem classes em cada elemento.
 * - Coluna de leitura de até 768 px (--content-reading), texto de 16 px com entrelinha 1,7, parágrafos a 16 px um do
 *   outro, títulos com respiro acima maior que abaixo.
 * - Links sublinhados em --primary-text (6,4:1), com foco visível. Tabelas quebram o texto e nunca rolam para o lado.
 * - tamanho "sm" para notas e rodapés legais (14 px).
 * - `html`: o HTML convertido do Markdown dos textos jurídicos do próprio site (nunca texto de quem usa o site), para
 *   a página não precisar de dangerouslySetInnerHTML.
 */
export type ProsaProps = React.ComponentProps<"div"> & { tamanho?: "sm" | "md"; html?: string };

function Prosa({ tamanho = "md", html, className, children, ...props }: ProsaProps) {
  return (
    <div
      data-slot="prosa"
      className={cn(
        "max-w-[var(--content-reading)] text-pretty text-foreground [overflow-wrap:anywhere]",
        tamanho === "sm" ? "text-body-sm leading-relaxed" : "text-body leading-[1.7]",
        "[&>*+*]:mt-4",
        "[&_h1]:text-h2 [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:tracking-[-0.02em] [&_h1]:text-balance [&_h1+*]:mt-6",
        "[&_h2]:mt-12 [&_h2]:text-h3 [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-[-0.02em] [&_h2]:text-balance [&_h2+*]:mt-4",
        "[&_h3]:mt-8 [&_h3]:text-subtitle [&_h3]:font-semibold [&_h3]:leading-snug [&_h3+*]:mt-2",
        "[&>:first-child]:mt-0",
        "[&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground",
        "[&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li+li]:mt-2 [&_li]:marker:text-primary-text",
        "[&_a]:font-medium [&_a]:text-primary-text [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:decoration-2 [&_a]:rounded-sm [&_a:focus-visible]:outline-none [&_a:focus-visible]:ring-2 [&_a:focus-visible]:ring-ring",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:text-foreground",
        "[&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse [&_table]:text-body-sm [&_th]:border-b [&_th]:border-border [&_th]:py-2 [&_th]:pr-4 [&_th]:text-left [&_th]:font-semibold [&_td]:border-b [&_td]:border-border [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top",
        "[&_hr]:my-8 [&_hr]:border-border",
        className,
      )}
      {...(html !== undefined ? { dangerouslySetInnerHTML: { __html: html } } : { children })}
      {...props}
    />
  );
}

export { Prosa };

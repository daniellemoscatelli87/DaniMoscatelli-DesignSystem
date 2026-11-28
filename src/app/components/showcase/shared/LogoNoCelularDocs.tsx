import React, { useState } from "react";
import { Menu } from "lucide-react";
import { useI18n } from "../../../i18n";
import { AlternadorCompacto } from "../../ui/alternador-compacto";
import { DoDont } from "./Guidance";

/**
 * Regra do logo no cabeçalho do celular (28/11/2026, pedido da dona do produto, a mesma nos dois DS): abaixo de 640 px,
 * o cabeçalho mostra só o símbolo; o nome aparece a partir de 640 px. O mesmo arquivo nos dois DS; cada um passa a
 * própria marca.
 */
export function LogoNoCelularDocs({ simbolo, completo, completoEscuro, nome }: {
  simbolo: string;
  /** Logo completo para fundo claro e para o tema escuro (texto claro). */
  completo: string;
  completoEscuro: string;
  nome: string;
}) {
  const { t } = useI18n();
  const [largura, setLargura] = useState<"celular" | "maior">("celular");
  const celular = largura === "celular";
  return (
    <div id="header-logo-celular" className="mt-8 scroll-mt-32">
      <h3 className="font-[family-name:var(--font-display)] text-body font-semibold tracking-[-0.01em] text-foreground mb-1">
        {t("Logo on phones", "Logo no celular")}
      </h3>
      <p className="text-body-sm leading-relaxed text-muted-foreground mb-4 max-w-[68ch]">
        {t(
          "On phones (below 640 px), the header shows only the symbol; the name appears from 640 px. The symbol leaves room for the menu button and the preferences (theme, language) without anything touching, and the brand is still recognised. In the CabecalhoDoSite, below 640 px it is always the symbol (the default, no prop needed); this site's header follows the same rule.",
          "No celular (abaixo de 640 px), o cabeçalho mostra só o símbolo; o nome aparece a partir de 640 px. O símbolo deixa espaço para o botão de menu e as preferências (tema, idioma) sem nada encostar, e a marca continua reconhecível. No CabecalhoDoSite, abaixo de 640 px é sempre o símbolo (é o padrão, sem prop); o cabeçalho deste site segue a mesma regra.",
        )}
      </p>
      <div className="rounded-lg border border-border bg-muted/40 p-4">
        <AlternadorCompacto
          aria-label={t("Screen width", "Largura da tela")}
          value={largura}
          onValueChange={setLargura}
          options={[
            { value: "celular", label: t("Below 640 px", "Abaixo de 640 px") },
            { value: "maior", label: t("From 640 px", "A partir de 640 px") },
          ]}
        />
        <div
          aria-hidden
          className={`mt-4 flex h-16 items-center justify-between gap-3 rounded-md border border-border bg-card px-4 shadow-[var(--shadow-sm)] motion-safe:transition-[max-width] motion-safe:duration-[var(--duration-normal)] motion-safe:ease-[var(--ease-snappy)] ${celular ? "max-w-[390px]" : "max-w-full"}`}
        >
          {celular
            ? <img src={simbolo} alt="" className="h-10 w-auto object-contain" />
            : (
              <>
                <img src={completo} alt="" className="h-9 w-auto min-w-0 object-contain object-left dark:hidden" />
                <img src={completoEscuro} alt="" className="hidden h-9 w-auto min-w-0 object-contain object-left dark:block" />
              </>
            )}
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground">
            <Menu className="size-5" />
          </span>
        </div>
        <p className="mt-3 text-label text-muted-foreground" aria-live="polite">
          {celular
            ? t(`Phone: only the ${nome} symbol, next to the menu button.`, `Celular: só o símbolo da ${nome}, ao lado do botão de menu.`)
            : t(`From 640 px: the full ${nome} logo, with the name.`, `A partir de 640 px: o logo completo da ${nome}, com o nome.`)}
        </p>
      </div>
      <div className="mt-4">
        <DoDont
          dos={[
            t("Below 640 px, use only the symbol in the header, with the link to the home page and its name (aria-label).", "Abaixo de 640 px, use só o símbolo no cabeçalho, com o link para a página inicial e o nome dele (aria-label)."),
            t("From 640 px, show the full logo, with the name; extra text (such as “| Design System”) only where it does not touch the search.", "A partir de 640 px, mostre o logo completo, com o nome; um texto a mais (como “| Design System”) só onde não encosta na busca."),
          ]}
          donts={[
            t("Don't squeeze the full logo next to the menu button and the preferences on a phone.", "Não aperte o logo completo ao lado do botão de menu e das preferências no celular."),
            t("Don't shrink the logo below its minimum size to make the name fit.", "Não diminua o logo abaixo do tamanho mínimo para o nome caber."),
          ]}
        />
      </div>
    </div>
  );
}

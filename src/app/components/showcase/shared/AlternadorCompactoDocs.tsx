import React, { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "../../../i18n";
import { AlternadorCompacto } from "../../ui/alternador-compacto";
import { DoDont } from "./Guidance";

/**
 * Documentação do AlternadorCompacto (28/11/2026), em Controles de formulário, ao lado do Controle segmentado.
 * O mesmo arquivo nos dois DS (Dani Moscatelli e FindLook).
 */
export function AlternadorCompactoDocs() {
  const { t } = useI18n();
  const [tema, setTema] = useState<"claro" | "escuro">("claro");
  const [idioma, setIdioma] = useState<"pt" | "en">("pt");
  const nomes = { claro: t("Light", "Claro"), escuro: t("Dark", "Escuro"), pt: "Português (BR)", en: "English" };
  return (
    <>
      <p className="text-body-sm leading-relaxed text-muted-foreground mb-5">
        {t(
          "A compact switch between two to four short options, for preferences that sit in a header or toolbar: light or dark theme, language, unit. A grey pill track with the chosen option in white, with a border and a light shadow, which slides to the new choice. 36 px tall with a 44 px invisible touch area. For filters and choices inside the content, use the Segmented control.",
          "Um alternador compacto entre duas a quatro opções curtas, para preferências que ficam no cabeçalho ou numa barra de ferramentas: tema claro ou escuro, idioma, unidade. Trilho cinza em pílula com a opção escolhida em branco, com borda e sombra leve, que desliza até a nova escolha. Tem 36 px de altura e área de toque invisível de 44 px. Para filtros e escolhas dentro do conteúdo, use o Controle segmentado.",
        )}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col items-start gap-2">
          <p className="text-body-sm font-medium text-foreground">
            {t("Theme, with icons", "Tema, com ícones")} <span className="text-muted-foreground font-normal">· rotuloVisivel="sm"</span>
          </p>
          <AlternadorCompacto
            aria-label={t("Theme", "Tema")}
            value={tema}
            onValueChange={setTema}
            rotuloVisivel="sm"
            options={[
              { value: "claro", label: nomes.claro, icon: <Sun /> },
              { value: "escuro", label: nomes.escuro, icon: <Moon /> },
            ]}
          />
          <p className="text-label text-muted-foreground">
            {t("On phones (below 640 px), only the icons; the text stays for screen readers. Chosen: ", "No celular (abaixo de 640 px), só os ícones; o texto continua para o leitor de tela. Escolhido: ")}
            <span className="font-medium text-foreground">{nomes[tema]}</span>
          </p>
        </div>
        <div className="flex flex-col items-start gap-2">
          <p className="text-body-sm font-medium text-foreground">{t("Language, with text", "Idioma, com texto")}</p>
          <AlternadorCompacto
            aria-label={t("Language", "Idioma")}
            value={idioma}
            onValueChange={setIdioma}
            options={[
              { value: "pt", label: "PT", nome: "PT, Português (BR)" },
              { value: "en", label: "EN", nome: "EN, English" },
            ]}
          />
          <p className="text-label text-muted-foreground">
            {t("Short label on screen; the full name (nome) goes to screen readers and the tooltip. Chosen: ", "Sigla na tela; o nome completo (nome) vai para o leitor de tela e a dica. Escolhido: ")}
            <span className="font-medium text-foreground">{nomes[idioma]}</span>
          </p>
        </div>
      </div>
      <pre className="mt-5 whitespace-pre-wrap [overflow-wrap:anywhere] rounded-md bg-muted/60 p-3 text-label text-muted-foreground"><code>{`import { AlternadorCompacto } from "@/app/components/ui/alternador-compacto";

<AlternadorCompacto
  aria-label="Tema"
  value={tema}
  onValueChange={setTema}
  rotuloVisivel="sm"
  options={[
    { value: "claro", label: "Claro", icon: <Sun /> },
    { value: "escuro", label: "Escuro", icon: <Moon /> },
  ]}
/>`}</code></pre>
      <ul className="mt-4 mb-6 grid gap-1 text-body-sm text-muted-foreground sm:grid-cols-2">
        <li>• {t("Props: options (value, label, icon, disabled, nome), value, defaultValue, onValueChange, rotuloVisivel sempre | sm | nunca, aria-label (required).", "Props: options (value, label, icon, disabled, nome), value, defaultValue, onValueChange, rotuloVisivel sempre | sm | nunca, aria-label (obrigatório).")}</li>
        <li>• {t("Same selection logic as the Segmented control: one option is always chosen; arrows change it and move the focus; Tab enters and leaves the group.", "Mesma lógica de seleção do Controle segmentado: sempre há uma opção escolhida; as setas mudam a escolha e levam o foco; Tab entra e sai do grupo.")}</li>
        <li>• {t("Screen readers hear a radio group (radiogroup, radio, aria-checked). With rotuloVisivel sm or nunca, every option needs an icon.", "O leitor de tela ouve um grupo de opções (radiogroup, radio, aria-checked). Com rotuloVisivel sm ou nunca, toda opção precisa de ícone.")}</li>
        <li>• {t("The white thumb slides with --duration-normal and --ease-snappy; with reduced motion it changes without sliding.", "O polegar branco desliza com --duration-normal e --ease-snappy; com menos movimento, troca sem deslizar.")}</li>
      </ul>
      <DoDont
        dos={[
          t("Use it for a preference that changes the whole page or app (theme, language, unit) in the header or a toolbar.", "Use para uma preferência que muda a página ou o aplicativo inteiro (tema, idioma, unidade), no cabeçalho ou numa barra de ferramentas."),
          t("Keep two to four options with one word, a short code (PT, EN) or an icon.", "Mantenha de duas a quatro opções com uma palavra, uma sigla (PT, EN) ou um ícone."),
          t("Name the group (aria-label) and, when the text is a code, give the full name in nome, starting with the visible text.", "Dê nome ao grupo (aria-label) e, quando o texto for uma sigla, o nome completo em nome, começando pelo texto visível."),
        ]}
        donts={[
          t("Don't use it for filters or choices in a form or in the content: there, use the Segmented control, with the selected pink.", "Não use em filtros ou escolhas de formulário e do conteúdo: ali, use o Controle segmentado, com o rosa de selecionado."),
          t("Don't use it for an on/off setting: use the Switch.", "Não use para ligar e desligar uma opção: use o Switch."),
          t("Don't hide the text without an icon, and don't make a hand-built copy of the track in a product.", "Não esconda o texto sem ícone, nem faça uma cópia do trilho à mão no produto."),
        ]}
      />
    </>
  );
}

import React, { useState } from "react";
import { useI18n } from "../../../i18n";
import { CaixaDeConsentimento } from "../../ui/caixa-de-consentimento";
import { GradeDeCards, ItemDaGrade } from "../../ui/grade-de-cards";
import { SectionBlock, ShowcaseCard } from "./SectionBlock";

/* Documentação da CaixaDeConsentimento (28/11/2026, aprovada pela dona do produto). */
export function SecaoCaixaDeConsentimento() {
  const { t } = useI18n();
  const [aceito, setAceito] = useState(true);
  const [termos, setTermos] = useState(false);
  const politica = <a href="#campos-consentimento">{t("Privacy Policy", "Política de Privacidade")}</a>;
  const frase = [
    <>{t("I authorise the use of my contacts only for this purpose, under the ", "Autorizo o uso dos meus contatos exclusivamente para essa finalidade, conforme a ")}{politica}.</>,
    t("I can withdraw my consent at any time.", "Posso revogar meu consentimento a qualquer momento."),
  ];
  return (
    <SectionBlock
      id="campos-consentimento"
      titulo={t("Consent box", "Caixa de consentimento")}
      quando={t(
        "A yes to a consent (receive notices, accept the terms) in a card that the person ticks as a whole: square checkbox, title and the legal sentence with its links. Checked, the card takes the selected pink.",
        "Um sim de consentimento (receber avisos, aceitar os termos) num card que a pessoa marca inteiro: caixa de marcar quadrada, título e a frase legal com os links. Marcado, o card fica no rosa do selecionado.",
      )}
      arquivo="ui/caixa-de-consentimento.tsx"
      nomes={["CaixaDeConsentimento"]}
      api={`<CaixaDeConsentimento
  titulo="Sim, quero receber os avisos."
  paragrafos={[
    <>Autorizo o uso dos meus contatos exclusivamente para essa finalidade, conforme a <a href="/privacidade">Política de Privacidade</a>.</>,
    "Posso revogar meu consentimento a qualquer momento.",
  ]}
  checked={aceito}
  onCheckedChange={setAceito}
  erro={enviado && !aceito ? "Marque para continuar." : undefined}
/>`}
      faca={[
        t("Use a SQUARE box for a yes/no consent.", "Use caixa QUADRADA para um sim/não de consentimento."),
        t("Start the title with the yes (\"Yes, I want…\") and keep the legal sentence below it.", "Comece o título pelo sim (\"Sim, quero…\") e deixe a frase legal embaixo."),
        t("Put each sentence that must start on its own line in paragrafos.", "Ponha em paragrafos cada frase que deve começar numa linha nova."),
      ]}
      naoFaca={[
        t("Never use a circle for a consent: a circle is a choice between options (radio).", "Nunca use círculo para consentimento: círculo é escolha entre opções (rádio)."),
        t("Don't leave the box ticked in advance for an optional consent.", "Não deixe a caixa marcada de antemão num consentimento opcional."),
        t("Don't hide the link to the policy outside the card.", "Não esconda o link da política fora do card."),
      ]}
    >
      <GradeDeCards className="gap-4 md:grid-cols-2">
        <ItemDaGrade>
          <ShowcaseCard className="h-full" rotulo={t("Not ticked", "Desmarcado")}>
            <CaixaDeConsentimento titulo={t("Yes, I want to receive the notices.", "Sim, quero receber os avisos.")} paragrafos={frase} />
          </ShowcaseCard>
        </ItemDaGrade>
        <ItemDaGrade>
          <ShowcaseCard className="h-full" rotulo={t("Ticked", "Marcado")}>
            <CaixaDeConsentimento titulo={t("Yes, I want to receive the notices.", "Sim, quero receber os avisos.")} paragrafos={frase} checked={aceito} onCheckedChange={setAceito} />
          </ShowcaseCard>
        </ItemDaGrade>
      </GradeDeCards>
      <GradeDeCards className="gap-4 md:grid-cols-2">
        <ItemDaGrade>
          <ShowcaseCard className="h-full" rotulo={t("Error (shown after sending without ticking; tick to clear)", "Erro (aparece ao enviar sem marcar; marque para sumir)")}>
            <CaixaDeConsentimento
              titulo={t("I have read and accept the terms of use.", "Li e aceito os termos de uso.")}
              checked={termos}
              onCheckedChange={setTermos}
              erro={!termos ? t("Tick to continue.", "Marque para continuar.") : undefined}
            >
              {t("The terms are in ", "Os termos estão em ")}<a href="#campos-consentimento">{t("Terms of use", "Termos de uso")}</a>.
            </CaixaDeConsentimento>
          </ShowcaseCard>
        </ItemDaGrade>
        <ItemDaGrade>
          <ShowcaseCard className="h-full" rotulo={t("Disabled", "Desativado")}>
            <CaixaDeConsentimento disabled titulo={t("Yes, I want to receive the notices.", "Sim, quero receber os avisos.")} paragrafos={frase} />
          </ShowcaseCard>
        </ItemDaGrade>
      </GradeDeCards>
    </SectionBlock>
  );
}

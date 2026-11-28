import React, { useRef, useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { useI18n } from "../../../i18n";
import { CabecalhoDoSite } from "../../ui/cabecalho-do-site";
import { SegmentedControl } from "../../ui/segmented-control";
import { Button } from "../../ui/button";
import { PaginaDeErro } from "../../ui/estado-vazio";

/* Demonstração do espaço abaixo do cabeçalho (28/11/2026): o cabeçalho do site e a página de erro padrão numa moldura
   de celular (390 px) ou de computador. As media queries seguem a janela da documentação, não a moldura; por isso a
   moldura define os valores da tela escolhida (--espaco-abaixo-do-cabecalho e --grid-margin), os mesmos do theme.css. */

type Tela = "celular" | "computador";
const VALORES: Record<Tela, { espaco: string; margem: string; px: number }> = {
  celular: { espaco: "var(--space-8)", margem: "16px", px: 32 },
  computador: { espaco: "var(--space-16)", margem: "32px", px: 64 },
};

export function PaginaAbaixoDoCabecalho({ telaInicial = "celular" }: { telaInicial?: Tela }) {
  const { t } = useI18n();
  const [tela, setTela] = useState<Tela>(telaInicial);
  const raiz = useRef<HTMLDivElement>(null);
  const v = VALORES[tela];
  const itens = [
    { id: "inicio", rotulo: "Home", href: "#molduras-erro" },
    { id: "projeto", rotulo: "Projeto Piloto", href: "#molduras-erro" },
    { id: "parceiros", rotulo: "Seja Parceiro", href: "#molduras-erro" },
  ];
  return (
    <div className="space-y-4">
      <SegmentedControl
        size="lg"
        aria-label={t("Screen", "Tela")}
        value={tela}
        onValueChange={setTela}
        options={[
          { value: "celular", label: t("Phone · 390 px", "Celular · 390 px"), icon: <Smartphone aria-hidden /> },
          { value: "computador", label: t("Desktop", "Computador"), icon: <Monitor aria-hidden /> },
        ]}
      />
      <div
        ref={raiz}
        data-testid="demo-abaixo-do-cabecalho"
        data-tela={tela}
        className={`overflow-hidden rounded-xl border border-border bg-background ${tela === "celular" ? "mx-auto max-w-[390px]" : ""}`}
        style={{ "--espaco-abaixo-do-cabecalho": v.espaco, "--grid-margin": v.margem } as React.CSSProperties}
      >
        <CabecalhoDoSite
          itens={itens}
          atual="inicio"
          tela={tela}
          raiz={raiz}
          esconderAoRolar={false}
          inicioHref="#molduras-erro"
          acao={{ rotulo: "Contato", href: "#molduras-erro" }}
        />
        <div className="relative">
          {/* Régua da documentação (decorativa): mostra o espaço entre o fim do cabeçalho e o card. */}
          <div aria-hidden className="pointer-events-none absolute left-1 top-0 flex items-center gap-1" style={{ height: "var(--espaco-abaixo-do-cabecalho)" }}>
            <span className="h-full w-0.5 rounded-full bg-primary" />
            <span className="font-mono text-caption font-semibold text-primary-text">{v.px}</span>
          </div>
          <PaginaDeErro
            moldura="card"
            elemento="div"
            telaCheia={false}
            codigo="404"
            selo={t("Error 404", "Erro 404")}
            titulo={t("Page not found", "Página não encontrada")}
            descricao={t("The address may have changed or no longer exists.", "O endereço pode ter mudado ou não existe mais.")}
            acoes={<Button asChild size="lg" forma="pilula"><a href="#molduras-erro">{t("Go to the home page", "Ir para a página inicial")}</a></Button>}
            className="pb-24"
          />
        </div>
      </div>
    </div>
  );
}

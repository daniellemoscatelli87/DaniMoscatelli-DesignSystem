"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "./utils";

/**
 * AvisoCookies (aviso de cookies, LGPD)
 *
 * Faixa do site (public/analytics.js) que pede consentimento antes de ligar a medição de acessos. Fica no rodapé
 * da tela, centralizada, com até 720 px; abaixo de 480 px os dois botões dividem a largura. Recusar e Aceitar têm o
 * mesmo peso de leitura (contorno e primária) e 44 px de altura.
 *
 * A escolha fica neste navegador (localStorage, chave "dm-cookies": "aceito" | "recusado"). Sem escolha, o aviso
 * aparece; com escolha, só volta quando a pessoa pede (abrirAvisoCookies(), por exemplo no botão "Preferências de
 * cookies" do rodapé). O componente só registra a escolha e avisa por onAceitar / onRecusar: quem liga ou desliga
 * a medição é a página (nada de medição antes de "Aceitar").
 *
 * aberto — controla a exibição por fora (demonstrações). Sem ele, segue a escolha guardada.
 * fixo   — false: position absolute, dentro de uma caixa.
 */

export const CHAVE_COOKIES = "dm-cookies";
const EVENTO = "dm:preferencias-cookies";

/** Abre o aviso de novo (botão "Preferências de cookies"). */
export function abrirAvisoCookies() {
  window.dispatchEvent(new CustomEvent(EVENTO));
}

export type EscolhaCookies = "aceito" | "recusado";

export function lerEscolhaCookies(chave = CHAVE_COOKIES): EscolhaCookies | null {
  try {
    const v = localStorage.getItem(chave);
    return v === "aceito" || v === "recusado" ? v : null;
  } catch { return null; }
}

export type AvisoCookiesProps = {
  texto?: string;
  politica?: { href: string; rotulo: string } | null;
  rotuloRecusar?: string;
  rotuloAceitar?: string;
  rotuloRegiao?: string;
  onAceitar?: () => void;
  onRecusar?: () => void;
  aberto?: boolean;
  chave?: string;
  fixo?: boolean;
  className?: string;
};

function AvisoCookies({
  texto = "Usamos cookies do Google Analytics para entender, de forma agregada, como as pessoas usam o site e melhorar a sua experiência. A medição só começa se você aceitar.",
  politica = { href: "/privacidade/#cookies", rotulo: "Política de Privacidade" },
  rotuloRecusar = "Recusar",
  rotuloAceitar = "Aceitar",
  rotuloRegiao = "Aviso de cookies",
  onAceitar,
  onRecusar,
  aberto,
  chave = CHAVE_COOKIES,
  fixo = true,
  className,
}: AvisoCookiesProps) {
  const [mostrar, setMostrar] = React.useState(false);

  React.useEffect(() => {
    if (aberto !== undefined) return;
    if (!lerEscolhaCookies(chave)) setMostrar(true);
    const abrir = () => setMostrar(true);
    window.addEventListener(EVENTO, abrir);
    return () => window.removeEventListener(EVENTO, abrir);
  }, [aberto, chave]);

  const escolher = (v: EscolhaCookies) => {
    if (aberto === undefined) {
      try { localStorage.setItem(chave, v); } catch { /* sem armazenamento */ }
      setMostrar(false);
    }
    if (v === "aceito") onAceitar?.();
    else onRecusar?.();
  };

  if (!(aberto ?? mostrar)) return null;

  return (
    <div
      role="region"
      aria-label={rotuloRegiao}
      data-slot="aviso-cookies"
      className={cn(
        fixo ? "fixed" : "absolute",
        "inset-x-4 bottom-4 z-[60] mx-auto flex max-w-[720px] flex-wrap items-center gap-x-5 gap-y-3 rounded-lg border border-border bg-card px-[18px] py-4 font-sans text-sm leading-normal text-foreground shadow-lg",
        className,
      )}
    >
      <p className="m-0 min-w-0 flex-[1_1_320px]">
        {texto}{" "}
        {politica && (
          <a
            href={politica.href}
            className="rounded-sm font-semibold text-[var(--primary-text)] underline underline-offset-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {politica.rotulo}
          </a>
        )}
      </p>
      <div className="ml-auto flex flex-none gap-2 max-[479px]:w-full">
        <Button type="button" variant="outline" size="lg" onClick={() => escolher("recusado")} className="h-11 rounded-full bg-card px-5 text-sm max-[479px]:flex-1">
          {rotuloRecusar}
        </Button>
        <Button type="button" size="lg" onClick={() => escolher("aceito")} className="h-11 rounded-full px-5 text-sm max-[479px]:flex-1">
          {rotuloAceitar}
        </Button>
      </div>
    </div>
  );
}

export { AvisoCookies };

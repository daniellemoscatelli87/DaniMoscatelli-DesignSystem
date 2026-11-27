"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, Loader2, XCircle } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/** Tema atual: segue a classe .dark do documento (sem depender de next-themes). */
function useTemaDoDocumento(): "light" | "dark" {
  const ler = () => (typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light");
  const [tema, setTema] = React.useState<"light" | "dark">(ler);
  React.useEffect(() => {
    const obs = new MutationObserver(() => setTema(ler()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return tema;
}

/**
 * Notificações temporárias (toast). Monte <Toaster /> uma vez na raiz do app e chame toast(), toast.success(),
 * toast.error(), toast.warning(), toast.info() ou toast.loading() de "sonner". Ícone e texto sempre juntos.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const tema = useTemaDoDocumento();

  return (
    <Sonner
      theme={tema}
      className="toaster group"
      position="bottom-right"
      icons={{
        success: <CheckCircle2 className="h-[18px] w-[18px] text-success" aria-hidden />,
        error: <XCircle className="h-[18px] w-[18px] text-error-text" aria-hidden />,
        warning: <AlertCircle className="h-[18px] w-[18px] text-warning-text" aria-hidden />,
        info: <Info className="h-[18px] w-[18px] text-info" aria-hidden />,
        loading: <Loader2 className="h-[18px] w-[18px] animate-spin text-info" aria-hidden />,
      }}
      toastOptions={{
        classNames: {
          toast: "!rounded-md !border !border-border !bg-card !text-foreground !shadow-[var(--shadow-md)] !font-sans",
          title: "!text-body-sm !font-medium",
          description: "!text-body-sm !text-muted-foreground",
          closeButton: "!bg-card !border-border !text-muted-foreground",
        },
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };

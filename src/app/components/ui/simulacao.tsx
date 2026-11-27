"use client";

import * as React from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { cn } from "./utils";

/**
 * Simulacao (demonstração em etapas: tópicos + tela simulada)
 *
 * Conta um processo em etapas com uma tela de exemplo que muda a cada etapa, como "Da conexão à colaboração" da
 * Rede de Parceiros (`rx-mt-*`: tópicos clicáveis à esquerda e a tela do sistema à direita). Cada tópico tem título,
 * uma frase e a cena (qualquer conteúdo do DS: um formulário de exemplo, um cartão de pessoa, uma conversa).
 *
 * - Abas de verdade (role="tablist"): o tópico escolhido fica no rosa de selecionado (--primary-suave) com a barra na
 *   primária à esquerda; hover cinza. Setas ↑/↓ (ou ←/→) trocam o tópico; a cena é o painel da aba.
 * - Avança sozinha a cada `intervalo` (padrão 6 s) quando está na tela, com a barra de progresso no tópico ativo;
 *   para ao passar o mouse, ao focar e pelo botão Pausar (44 px; WCAG 2.2.2). Com "menos movimento", não avança
 *   sozinha e as cenas trocam sem animação.
 * - Responsiva pela própria largura: tópicos à esquerda e tela à direita a partir de 48rem; abaixo, a tela vem
 *   primeiro e os tópicos embaixo, na largura toda.
 * - A tela é ilustração: tem um nome ("Tela de exemplo: Faça parte da rede") e o conteúdo da cena deve ser legível,
 *   sem dados reais de pessoas.
 */

export type TopicoDaSimulacao = { id: string; titulo: string; descricao?: React.ReactNode; cena: React.ReactNode };

export type SimulacaoProps = {
  topicos: TopicoDaSimulacao[];
  /** Frase acima dos tópicos ("Como sua participação acontece"). */
  intro?: React.ReactNode;
  /** Barra de cima da tela simulada (ícone + nome do sistema). */
  topoDaTela?: React.ReactNode;
  intervalo?: number;
  autoAvancar?: boolean;
  rotulo?: string;
  textos?: { pausar?: string; continuar?: string; telaDeExemplo?: string };
  className?: string;
};

function Simulacao({ topicos, intro, topoDaTela, intervalo = 6000, autoAvancar = true, rotulo = "Demonstração", textos, className }: SimulacaoProps) {
  const tx = { pausar: "Pausar a demonstração", continuar: "Continuar a demonstração", telaDeExemplo: "Tela de exemplo", ...textos };
  const [atual, setAtual] = React.useState(0);
  const [pausadaPeloBotao, setPausadaPeloBotao] = React.useState(false);
  const [pausadaPeloUso, setPausadaPeloUso] = React.useState(false);
  const reduzir = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const naTela = useInView(ref, { amount: 0.4 });
  const id = React.useId();
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const rodando = autoAvancar && !reduzir && !pausadaPeloBotao && !pausadaPeloUso && naTela && topicos.length > 1;

  React.useEffect(() => {
    if (!rodando) return;
    const t = window.setTimeout(() => setAtual(a => (a + 1) % topicos.length), intervalo);
    return () => window.clearTimeout(t);
  }, [rodando, atual, intervalo, topicos.length]);

  const ir = (i: number, focar = false) => {
    const n = (i + topicos.length) % topicos.length;
    setAtual(n);
    if (focar) tabs.current[n]?.focus();
  };
  const topico = topicos[atual];

  return (
    <div
      ref={ref}
      data-slot="simulacao"
      role="region"
      aria-label={rotulo}
      onMouseEnter={() => setPausadaPeloUso(true)}
      onMouseLeave={() => setPausadaPeloUso(false)}
      onFocusCapture={() => setPausadaPeloUso(true)}
      onBlurCapture={e => { if (!ref.current?.contains(e.relatedTarget as Node)) setPausadaPeloUso(false); }}
      className={cn("@container/simulacao", className)}
    >
      <div className="grid gap-6 @min-[48rem]/simulacao:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] @min-[48rem]/simulacao:items-center @min-[48rem]/simulacao:gap-10">
        {/* Tópicos */}
        <div className="order-2 min-w-0 @min-[48rem]/simulacao:order-1">
          <div className="mb-3 flex items-center justify-between gap-3">
            {intro ? <p className="text-body-sm font-semibold text-muted-foreground">{intro}</p> : <span />}
            {autoAvancar && !reduzir && topicos.length > 1 && (
              <button
                type="button"
                onClick={() => setPausadaPeloBotao(p => !p)}
                aria-label={pausadaPeloBotao ? tx.continuar : tx.pausar}
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-input bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {pausadaPeloBotao ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
              </button>
            )}
          </div>
          <div role="tablist" aria-orientation="vertical" aria-label={rotulo} className="grid gap-2">
            {topicos.map((t, i) => {
              const ativo = i === atual;
              return (
                <div
                  key={t.id}
                  role="presentation"
                  className={cn(
                    "relative overflow-hidden rounded-md border px-4 py-3 text-left transition-colors duration-[var(--duration-fast)]",
                    "before:absolute before:inset-y-0 before:left-0 before:w-1 before:transition-colors",
                    ativo ? "border-primary/30 bg-primary-suave before:bg-primary" : "border-transparent hover:bg-accent before:bg-transparent",
                  )}
                >
                  {/* O botão é o título e se estende sobre o tópico inteiro (::after). */}
                  <button
                    ref={el => { tabs.current[i] = el; }}
                    type="button"
                    role="tab"
                    id={`${id}-aba-${t.id}`}
                    aria-selected={ativo}
                    aria-controls={`${id}-cena`}
                    aria-describedby={t.descricao ? `${id}-desc-${t.id}` : undefined}
                    tabIndex={ativo ? 0 : -1}
                    onClick={() => ir(i)}
                    onKeyDown={e => {
                      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); ir(i + 1, true); }
                      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); ir(i - 1, true); }
                      if (e.key === "Home") { e.preventDefault(); ir(0, true); }
                      if (e.key === "End") { e.preventDefault(); ir(topicos.length - 1, true); }
                    }}
                    className={cn(
                      "block w-full text-left text-body-sm font-semibold outline-none after:absolute after:inset-0 after:rounded-md after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring",
                      ativo ? "text-primary-text" : "text-foreground",
                    )}
                  >
                    {t.titulo}
                  </button>
                  {t.descricao && (
                    <span id={`${id}-desc-${t.id}`} className={cn("block text-body-sm text-muted-foreground", ativo ? "mt-1" : "sr-only @min-[48rem]/simulacao:not-sr-only @min-[48rem]/simulacao:mt-1")}>
                      {t.descricao}
                    </span>
                  )}
                  {/* Progresso até a próxima etapa */}
                  {ativo && rodando && (
                    <motion.span
                      key={`p-${atual}`}
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-1 origin-left bg-primary/40"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: intervalo / 1000, ease: "linear" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tela simulada */}
        <div
          id={`${id}-cena`}
          role="tabpanel"
          aria-labelledby={`${id}-aba-${topico?.id}`}
          className="order-1 min-w-0 overflow-hidden rounded-xl border border-border bg-background shadow-lg @min-[48rem]/simulacao:order-2"
        >
          <div className="flex h-11 items-center gap-2 border-b border-border bg-card px-4">
            {topoDaTela ?? <span className="text-body-sm font-semibold text-foreground">{tx.telaDeExemplo}</span>}
          </div>
          <div className="relative grid min-h-80 p-4 @min-[32rem]/simulacao:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={topico?.id}
                className="min-w-0 self-center [grid-area:1/1]"
                initial={reduzir ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduzir ? undefined : { opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {topico?.cena}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Simulacao };

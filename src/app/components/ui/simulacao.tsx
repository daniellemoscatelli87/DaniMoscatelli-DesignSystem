"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Check, ChevronDown, Pause, Play } from "lucide-react";
import { cn } from "./utils";

/**
 * Simulacao (demonstração em etapas: tópicos + tela simulada)
 *
 * Conta um processo em etapas com uma tela de exemplo que muda a cada etapa, como "Da conexão à colaboração" da
 * Rede de Parceiros (`rx-mt-*`: tópicos clicáveis à esquerda e a tela do sistema à direita). Cada tópico tem título,
 * uma frase e a cena (qualquer conteúdo do DS: um formulário de exemplo com MockDeCampo, um cartão de pessoa, uma conversa).
 *
 * - Abas de verdade (role="tablist"): o tópico escolhido fica no rosa de selecionado (--primary-suave) com a barra na
 *   primária à esquerda; hover cinza. Setas ↑/↓ (ou ←/→) trocam o tópico; cada cena é o painel da sua aba.
 * - Todas as cenas ficam no HTML desde o servidor (28/11/2026), uma por cima da outra; só a ativa aparece (as outras
 *   ficam invisíveis, fora dos leitores de tela e sem foco). A tela tem a altura da maior cena, então não pula ao trocar.
 * - Avança sozinha a cada `intervalo` (padrão 6 s) quando está na tela, com a barra de progresso no tópico ativo;
 *   para ao passar o mouse, ao focar e pelo botão Pausar (44 px; WCAG 2.2.2). Com "menos movimento", não avança
 *   sozinha, não mostra o Pausar e as cenas trocam sem animação.
 * - Primeira pintura estável (28/11/2026): o servidor e a primeira pintura do navegador são iguais (o Pausar aparece e
 *   nada avança); a preferência de "menos movimento" só é lida depois de montar. Antes, o Pausar dependia dela já na
 *   primeira pintura e quebrava a hidratação.
 * - Responsiva pela própria largura: tópicos à esquerda e tela à direita a partir de 48rem; abaixo, a tela vem
 *   primeiro e os tópicos embaixo, na largura toda.
 * - A tela é ilustração: tem um nome ("Tela de exemplo: Faça parte da rede") e o conteúdo da cena deve ser legível,
 *   sem dados reais de pessoas. Para campos de formulário de exemplo, use MockDeCampo (abaixo), nunca campos de verdade.
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

/** Diz a uma peça dentro da cena se a cena dela é a que está aparecendo (para recomeçar animações, como a digitação). */
const CenaAtivaContexto = React.createContext(true);
/** true quando a cena em volta está aparecendo (fora de uma Simulacao, sempre true). */
export function useCenaAtiva() {
  return React.useContext(CenaAtivaContexto);
}

/** true só depois de montar no navegador: a primeira pintura fica igual à do servidor. */
function useMontado() {
  const [montado, setMontado] = React.useState(false);
  React.useEffect(() => setMontado(true), []);
  return montado;
}

/** "Menos movimento", lido só depois de montar (no servidor e na primeira pintura vale false). */
function useMenosMovimento() {
  const montado = useMontado();
  const reduzir = useReducedMotion();
  return montado && !!reduzir;
}

function Simulacao({ topicos, intro, topoDaTela, intervalo = 6000, autoAvancar = true, rotulo = "Demonstração", textos, className }: SimulacaoProps) {
  const tx = { pausar: "Pausar a demonstração", continuar: "Continuar a demonstração", telaDeExemplo: "Tela de exemplo", ...textos };
  const [atual, setAtual] = React.useState(0);
  const [pausadaPeloBotao, setPausadaPeloBotao] = React.useState(false);
  const [pausadaPeloUso, setPausadaPeloUso] = React.useState(false);
  const montado = useMontado();
  const reduzir = useMenosMovimento();
  const ref = React.useRef<HTMLDivElement>(null);
  const naTela = useInView(ref, { amount: 0.4 });
  const id = React.useId();
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const mostrarPausa = autoAvancar && !reduzir && topicos.length > 1;
  const rodando = montado && mostrarPausa && !pausadaPeloBotao && !pausadaPeloUso && naTela;

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
          <div className="mb-3 flex min-h-11 items-center justify-between gap-3">
            {intro ? <p className="text-body-sm font-semibold text-muted-foreground">{intro}</p> : <span />}
            {mostrarPausa && (
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
                    aria-controls={`${id}-cena-${t.id}`}
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

        {/* Tela simulada: todas as cenas no HTML, uma por cima da outra; só a ativa aparece. */}
        <div className="order-1 min-w-0 overflow-hidden rounded-xl border border-border bg-background shadow-lg @min-[48rem]/simulacao:order-2">
          <div className="flex h-11 items-center gap-2 border-b border-border bg-card px-4">
            {topoDaTela ?? <span className="text-body-sm font-semibold text-foreground">{tx.telaDeExemplo}</span>}
          </div>
          <div className="relative grid min-h-80 p-4 @min-[32rem]/simulacao:p-6">
            {topicos.map((t, i) => {
              const ativa = i === atual;
              return (
                <div
                  key={t.id}
                  id={`${id}-cena-${t.id}`}
                  role="tabpanel"
                  aria-labelledby={`${id}-aba-${t.id}`}
                  tabIndex={ativa ? 0 : -1}
                  data-ativa={ativa || undefined}
                  className={cn(
                    "min-w-0 self-center rounded-md outline-none [grid-area:1/1] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "transition-[opacity,transform,visibility] duration-[var(--duration-slow)] ease-[var(--ease-snappy)] motion-reduce:transition-none",
                    ativa ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0 motion-reduce:translate-y-0",
                  )}
                >
                  <CenaAtivaContexto.Provider value={ativa}>{t.cena}</CenaAtivaContexto.Provider>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * MockDeCampo (campo de formulário de exemplo, dentro de uma tela simulada)
 *
 * Veio da simulação da Rede de Parceiros em HTML (`rx-mf-campo`): na tela de exemplo, o cadastro aparece sendo
 * preenchido, com o valor sendo digitado, a lista de uma seleção aberta e as opções marcadas. É só ilustração: não é
 * campo de verdade (não recebe foco nem toque) e o leitor de tela lê "rótulo: valor" de uma vez, sem a digitação.
 *
 * - tipo "texto" (padrão): caixa com o valor. Com `digitar`, o valor aparece letra a letra quando a cena fica ativa
 *   (com o cursor piscando), depois de `atraso` ms. "area": o mesmo, com mais de uma linha.
 * - tipo "selecao": caixa com o valor e a seta; com `aberta`, a lista das `opcoes` embaixo, a escolhida no rosa de
 *   selecionado (--primary-suave) com o check.
 * - tipo "opcoes": as `opcoes` como caixas de marcar desenhadas; as de `selecionadas` marcadas na primária.
 * - Contorno no --input (≥ 3:1), fundo --input-background, texto e rótulo nos tokens de texto. `largo` ocupa as duas
 *   colunas numa GradeDeCampos. Com "menos movimento", o valor aparece inteiro, sem digitação e sem cursor piscando.
 * - No servidor e na primeira pintura, o valor aparece inteiro (pintura estável); a digitação só começa depois.
 */
export type MockDeCampoProps = {
  rotulo: string;
  valor?: string;
  tipo?: "texto" | "area" | "selecao" | "opcoes";
  /** Lista da seleção aberta ou as caixas de marcar. */
  opcoes?: string[];
  /** Opções marcadas (tipo "opcoes"). */
  selecionadas?: string[];
  /** Mostra a lista da seleção aberta (tipo "selecao"). */
  aberta?: boolean;
  obrigatorio?: boolean;
  /** O valor aparece letra a letra quando a cena fica ativa. */
  digitar?: boolean;
  /** Espera antes de começar a digitar, em ms (para os campos entrarem um depois do outro). */
  atraso?: number;
  /** Ocupa as duas colunas da GradeDeCampos. */
  largo?: boolean;
  className?: string;
};

function MockDeCampo({ rotulo, valor = "", tipo = "texto", opcoes = [], selecionadas = [], aberta = false, obrigatorio = false, digitar = false, atraso = 0, largo = false, className }: MockDeCampoProps) {
  const ativa = useCenaAtiva();
  const reduzir = useMenosMovimento();
  const montado = useMontado();
  // null = valor inteiro (servidor, primeira pintura, menos movimento ou sem digitação).
  const [letras, setLetras] = React.useState<number | null>(null);
  const animar = montado && digitar && !reduzir && (tipo === "texto" || tipo === "area");

  React.useEffect(() => {
    if (!animar || !ativa) { setLetras(null); return; }
    setLetras(0);
    let n = 0;
    let passo: number | undefined;
    const comeco = window.setTimeout(() => {
      passo = window.setInterval(() => {
        n += 1;
        setLetras(n);
        if (n >= valor.length) window.clearInterval(passo);
      }, 45);
    }, atraso);
    return () => { window.clearTimeout(comeco); window.clearInterval(passo); };
  }, [animar, ativa, valor, atraso]);

  const digitando = letras !== null && letras < valor.length;
  const visivel = letras === null ? valor : valor.slice(0, letras);
  const caixa = "flex w-full min-w-0 items-center gap-2 rounded-md border border-input bg-input-background px-3 text-body-sm text-foreground dark:bg-input-fundo/30";

  return (
    <div data-slot="mock-de-campo" data-tipo={tipo} className={cn("min-w-0 space-y-2", largo && "col-span-full", className)}>
      <p className="text-body-sm font-semibold leading-snug text-foreground">
        {rotulo}
        {obrigatorio && <span aria-hidden className="text-primary-text"> *</span>}
        {(tipo === "texto" || tipo === "area" || tipo === "selecao") && <span className="sr-only">: {valor}</span>}
      </p>
      {tipo === "opcoes" ? (
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {opcoes.map(o => {
            const marcada = selecionadas.includes(o);
            return (
              <li key={o} className="flex items-center gap-2 text-body-sm text-foreground">
                <span aria-hidden className={cn("flex size-4 shrink-0 items-center justify-center rounded-sm border", marcada ? "border-primary bg-primary text-primary-foreground" : "border-input bg-input-background")}>
                  {marcada && <Check className="size-3" strokeWidth={3} />}
                </span>
                {o}
                <span className="sr-only">{marcada ? "(marcada)" : "(desmarcada)"}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div aria-hidden className="relative">
          <div className={cn(caixa, tipo === "area" ? "min-h-20 items-start py-2" : "h-10")}>
            <span className="min-w-0 flex-1 truncate whitespace-pre-wrap">
              {visivel}
              {digitando && <span className="ml-px inline-block h-4 w-px translate-y-0.5 bg-foreground motion-safe:animate-pulse" />}
            </span>
            {tipo === "selecao" && <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--duration-fast)]", aberta && "rotate-180")} />}
          </div>
          {tipo === "selecao" && aberta && opcoes.length > 0 && (
            <ul className="mt-1 grid gap-0.5 rounded-md border border-border bg-popover p-1 shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1">
              {opcoes.map(o => (
                <li key={o} className={cn("flex items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-body-sm", o === valor ? "bg-primary-suave font-semibold text-primary-text" : "text-foreground")}>
                  {o}
                  {o === valor && <Check className="size-4 shrink-0" />}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export { Simulacao, MockDeCampo };

"use client";

import * as React from "react";

/**
 * Confete (comemoração de um envio que deu certo)
 *
 * Veio da tela final do cadastro da Rede de Parceiros em HTML (rede-parceiros/cadastro, função confetti): papeizinhos
 * que caem do topo da tela balançando, por cerca de 3 s, e somem aos poucos no 4º segundo. Desenhado num canvas por cima
 * da página, que não recebe clique nem toque e é retirado no fim.
 *
 * - Só para um momento de conquista de verdade (cadastro concluído, primeira loja publicada), uma vez por conquista;
 *   nunca em toda ação. O texto do sucesso (EstadoFinal) é o que comunica: o confete é só enfeite (aria-hidden).
 * - "Menos movimento": não aparece nada (nem parado).
 * - Cores só por tokens (lidas do CSS na hora de disparar): a primária duas vezes, o rosa do texto, o cinza do texto de
 *   apoio, o contorno dos campos e o aviso. Mude com `cores` (nomes de tokens, como "--primary").
 * - Uso: <Confete ativo={enviado} /> (dispara quando `ativo` passa a true) ou dispararConfete() direto. Também pela prop
 *   `comemorar` do EstadoFinal.
 */

export const CORES_DO_CONFETE = ["--primary", "--primary", "--primary-muted-foreground", "--muted-foreground", "--input", "--warning"];

export type OpcoesDoConfete = { quantidade?: number; duracao?: number; cores?: string[] };

/** Dispara o confete uma vez. Devolve uma função que para antes do fim. Não faz nada com "menos movimento". */
export function dispararConfete({ quantidade = 160, duracao = 4000, cores = CORES_DO_CONFETE }: OpcoesDoConfete = {}): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return () => {};
  const estilo = getComputedStyle(document.documentElement);
  const paleta = cores.map(c => (c.startsWith("--") ? estilo.getPropertyValue(c).trim() : c)).filter(Boolean);
  if (!paleta.length) return () => {};
  const cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  cv.dataset.slot = "confete";
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60";
  document.body.appendChild(cv);
  const ctx = cv.getContext("2d");
  if (!ctx) { cv.remove(); return () => {}; }
  const dpr = window.devicePixelRatio || 1;
  const W = window.innerWidth, H = window.innerHeight;
  cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
  const ps = Array.from({ length: quantidade }, () => ({
    x: Math.random() * W, y: -20 - Math.random() * H * 0.4,
    vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 3,
    w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
    r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
    c: paleta[Math.floor(Math.random() * paleta.length)]!,
  }));
  const t0 = performance.now();
  const sumir = Math.max(0, duracao - 1000);
  let quadro = 0;
  const parar = () => { cancelAnimationFrame(quadro); cv.remove(); };
  const desenhar = (t: number) => {
    const el = t - t0;
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = el > sumir ? Math.max(0, 1 - (el - sumir) / 1000) : 1;
    for (const p of ps) {
      p.x += p.vx + Math.sin(el / 300 + p.r) * 0.6; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r))); ctx.restore();
    }
    if (el < duracao) quadro = requestAnimationFrame(desenhar); else cv.remove();
  };
  quadro = requestAnimationFrame(desenhar);
  return parar;
}

export type ConfeteProps = OpcoesDoConfete & {
  /** Dispara quando passa a true (e ao montar, se já vier true). */
  ativo: boolean;
};

/** Componente: dispara o confete quando `ativo` passa a true. Não desenha nada no lugar onde está. */
function Confete({ ativo, quantidade, duracao, cores }: ConfeteProps) {
  React.useEffect(() => {
    if (!ativo) return;
    return dispararConfete({ quantidade, duracao, cores });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ativo]);
  return null;
}

export { Confete };

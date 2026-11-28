"use client";

import * as React from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { cn } from "./utils";
import { Button } from "./button";
import { Slider } from "./slider";
import { UploadDropzone } from "./upload";

/**
 * RecorteDeFoto (enviar uma foto e enquadrar: quadrado ou redondo)
 *
 * Veio da página de autorização da galeria da Rede de Parceiros (rede-parceiros/galeria/autorizar, em HTML): a pessoa
 * escolhe a foto, arrasta para enquadrar o rosto, ajusta o zoom, vê a prévia e usa a foto. O recorte é feito no próprio
 * aparelho, num canvas (sem biblioteca), e sai como um arquivo (Blob) do tamanho pedido, o que também tira os dados
 * escondidos da foto, como a localização.
 *
 * - Escolher: a área de envio do DS (UploadDropzone), com os formatos e o tamanho máximo; o erro aparece logo abaixo,
 *   em texto (formato, tamanho ou foto pequena demais, com o tamanho que ela tem).
 * - Enquadrar: arrastar com o mouse ou o dedo; no teclado, a área recebe o foco e as setas movem a foto (Shift: passo
 *   maior), + e − mudam o zoom e 0 volta ao começo. O zoom também tem o controle deslizante e os botões − e + (44 px no
 *   toque). A foto sempre cobre o recorte inteiro (não sobra borda vazia).
 * - Prévia: a foto como vai aparecer (redonda ou quadrada), atualizada a cada movimento.
 * - Ações: "Usar esta foto" (chama onRecortar com o Blob e um endereço local para mostrar) e "Cancelar" (volta à escolha
 *   da foto e chama onCancelar).
 * - forma "circulo" (padrão) ou "quadrado"; o arquivo sai sempre quadrado (o círculo é só a máscara da prévia).
 * - Cores, raios e textos só por tokens; véu fora do recorte no token --sobreposicao. Com "menos movimento", o zoom e a
 *   troca de etapa não animam.
 */

/** Dados do arquivo que a pessoa escolheu (28/11/2026). */
export type ArquivoDoRecorte = { nome: string; tipo: string; nomeDoRecorte: string };

export type RecorteDeFotoProps = {
  /** Recebe a foto recortada (Blob) e um endereço local (URL.createObjectURL) para a prévia; revogue-o quando não precisar. */
  /**
   * Recebe o recorte (Blob), um endereço local para a prévia e, desde 28/11/2026, os dados do arquivo escolhido: `nome` e
   * `tipo` originais (para listas mostrarem o nome do arquivo) e `nomeDoRecorte` (o mesmo nome com a extensão do recorte).
   */
  onRecortar: (foto: Blob, url: string, arquivo: ArquivoDoRecorte) => void;
  onCancelar?: () => void;
  forma?: "circulo" | "quadrado";
  /** Lado do arquivo final, em pixels (padrão 600). */
  tamanhoDeSaida?: number;
  tipo?: "image/jpeg" | "image/webp" | "image/png";
  /** Qualidade do JPEG ou WEBP, de 0 a 1 (padrão 0,88). */
  qualidade?: number;
  /** Tamanho máximo do arquivo enviado, em MB (padrão 15). */
  tamanhoMaximoMb?: number;
  /** Menor lado aceito da foto, em pixels (padrão 300), para não ficar borrada. */
  minimoPx?: number;
  formatos?: string[];
  /** Zoom máximo (padrão 3×). */
  zoomMaximo?: number;
  textos?: Partial<typeof TEXTOS>;
  className?: string;
};

const TEXTOS = {
  titulo: "Escolha uma foto",
  descricao: "JPG, PNG ou WEBP",
  dica: "Arraste a foto para enquadrar o rosto e use o zoom se precisar.",
  area: "Área de recorte da foto. Use as setas para mover, + e − para o zoom e 0 para recomeçar.",
  zoom: "Zoom",
  menos: "Diminuir o zoom",
  mais: "Aumentar o zoom",
  recomecar: "Recomeçar o enquadramento",
  previa: "Prévia",
  usar: "Usar esta foto",
  cancelar: "Cancelar",
  erroFormato: (nome: string) => `O arquivo “${nome}” não é JPG, PNG ou WEBP. Escolha uma foto em um desses formatos.`,
  erroTamanho: (nome: string, mb: string, max: number) => `A foto “${nome}” tem ${mb} MB. Escolha uma foto de até ${max} MB.`,
  erroPequena: (nome: string, w: number, h: number, min: number) => `A foto “${nome}” tem ${w} × ${h} pixels. Escolha uma foto com pelo menos ${min} × ${min} pixels para não ficar borrada.`,
  erroLeitura: (nome: string) => `Não foi possível abrir “${nome}”. Tente outra foto.`,
};

type Enquadre = { zoom: number; x: number; y: number };

function RecorteDeFoto({
  onRecortar, onCancelar, forma = "circulo", tamanhoDeSaida = 600, tipo = "image/jpeg", qualidade = 0.88, tamanhoMaximoMb = 15,
  minimoPx = 300, formatos = ["image/jpeg", "image/png", "image/webp"], zoomMaximo = 3, textos, className,
}: RecorteDeFotoProps) {
  const tx = { ...TEXTOS, ...textos };
  const [foto, setFoto] = React.useState<{ img: HTMLImageElement; url: string; nome: string; tipo: string } | null>(null);
  const [erro, setErro] = React.useState<string | null>(null);
  const [enq, setEnq] = React.useState<Enquadre>({ zoom: 1, x: 0, y: 0 });
  const [lado, setLado] = React.useState(280);
  const [usando, setUsando] = React.useState(false);
  const area = React.useRef<HTMLDivElement>(null);
  const previa = React.useRef<HTMLCanvasElement>(null);
  const arrasto = React.useRef<{ id: number; x: number; y: number; ex: number; ey: number } | null>(null);
  const idDica = React.useId();

  // Lado da área de recorte (ela é quadrada e se ajusta à largura disponível).
  React.useEffect(() => {
    const el = area.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setLado(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [foto]);

  React.useEffect(() => () => { if (foto) URL.revokeObjectURL(foto.url); }, [foto]);

  // Escala da foto para cobrir a área no zoom 1, e o enquadre sempre cobrindo o recorte.
  const base = foto ? lado / Math.min(foto.img.naturalWidth, foto.img.naturalHeight) : 1;
  const limitar = React.useCallback((e: Enquadre): Enquadre => {
    if (!foto) return e;
    const zoom = Math.min(zoomMaximo, Math.max(1, e.zoom));
    const esc = base * zoom, w = foto.img.naturalWidth * esc, h = foto.img.naturalHeight * esc;
    return { zoom, x: Math.min(0, Math.max(lado - w, e.x)), y: Math.min(0, Math.max(lado - h, e.y)) };
  }, [foto, base, lado, zoomMaximo]);
  const centralizar = React.useCallback((zoom = 1): Enquadre => {
    if (!foto) return { zoom, x: 0, y: 0 };
    const esc = base * zoom;
    return { zoom, x: (lado - foto.img.naturalWidth * esc) / 2, y: (lado - foto.img.naturalHeight * esc) / 2 };
  }, [foto, base, lado]);

  // Ao trocar a foto ou o tamanho da área, recomeça centralizado.
  React.useEffect(() => { if (foto) setEnq(centralizar(1)); }, [foto, lado, centralizar]);

  // Zoom mantendo o centro do recorte no mesmo ponto da foto.
  const mudarZoom = (novo: number) => setEnq(e => {
    const z = Math.min(zoomMaximo, Math.max(1, novo));
    const k = z / e.zoom, c = lado / 2;
    return limitar({ zoom: z, x: c - (c - e.x) * k, y: c - (c - e.y) * k });
  });

  // Recorte num canvas: a parte da foto que está dentro da área, no tamanho pedido.
  const desenhar = React.useCallback((canvas: HTMLCanvasElement, tamanho: number) => {
    if (!foto) return;
    canvas.width = canvas.height = tamanho;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const esc = base * enq.zoom;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(foto.img, -enq.x / esc, -enq.y / esc, lado / esc, lado / esc, 0, 0, tamanho, tamanho);
  }, [foto, base, enq, lado]);

  React.useEffect(() => { if (previa.current) desenhar(previa.current, 192); }, [desenhar]);

  const escolher = (arquivos: File[]) => {
    const f = arquivos[0]; if (!f) return;
    setErro(null);
    const mb = (f.size / 1024 / 1024).toFixed(1).replace(".", ",");
    if (!formatos.includes(f.type)) return setErro(tx.erroFormato(f.name));
    if (f.size > tamanhoMaximoMb * 1024 * 1024) return setErro(tx.erroTamanho(f.name, mb, tamanhoMaximoMb));
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth < minimoPx || img.naturalHeight < minimoPx) {
        URL.revokeObjectURL(url);
        return setErro(tx.erroPequena(f.name, img.naturalWidth, img.naturalHeight, minimoPx));
      }
      setFoto({ img, url, nome: f.name, tipo: f.type });
      requestAnimationFrame(() => area.current?.focus());
    };
    img.onerror = () => { URL.revokeObjectURL(url); setErro(tx.erroLeitura(f.name)); };
    img.src = url;
  };

  const usar = () => {
    const c = document.createElement("canvas");
    desenhar(c, tamanhoDeSaida);
    setUsando(true);
    c.toBlob(b => {
      setUsando(false);
      if (b) {
        const extensao = tipo === "image/png" ? "png" : tipo === "image/webp" ? "webp" : "jpg";
        const base = (foto?.nome ?? "").replace(/\.[^.]+$/, "") || "foto";
        onRecortar(b, URL.createObjectURL(b), { nome: foto?.nome ?? `${base}.${extensao}`, tipo: foto?.tipo ?? tipo, nomeDoRecorte: `${base}.${extensao}` });
      }
    }, tipo, qualidade);
  };

  // Cancelar volta à escolha da foto (e avisa quem usa, para fechar uma janela, por exemplo).
  const cancelar = () => { setFoto(null); setErro(null); onCancelar?.(); };

  const teclas = (e: React.KeyboardEvent) => {
    const p = e.shiftKey ? 40 : 8;
    const mover = (dx: number, dy: number) => { e.preventDefault(); setEnq(v => limitar({ ...v, x: v.x + dx, y: v.y + dy })); };
    if (e.key === "ArrowLeft") mover(p, 0);
    else if (e.key === "ArrowRight") mover(-p, 0);
    else if (e.key === "ArrowUp") mover(0, p);
    else if (e.key === "ArrowDown") mover(0, -p);
    else if (e.key === "+" || e.key === "=") { e.preventDefault(); mudarZoom(enq.zoom + 0.1); }
    else if (e.key === "-" || e.key === "_") { e.preventDefault(); mudarZoom(enq.zoom - 0.1); }
    else if (e.key === "0") { e.preventDefault(); setEnq(centralizar(1)); }
  };

  const redondo = forma === "circulo";

  if (!foto) {
    return (
      <div data-slot="recorte-de-foto" data-etapa="escolher" className={cn("w-full", className)}>
        <UploadDropzone
          onFiles={escolher}
          accept={formatos}
          maxSize={tamanhoMaximoMb * 1024 * 1024}
          multiple={false}
          title={tx.titulo}
          description={`${tx.descricao} · até ${tamanhoMaximoMb} MB · pelo menos ${minimoPx} × ${minimoPx} px`}
          error={erro}
          onError={m => setErro(m)}
        />
      </div>
    );
  }

  const esc = base * enq.zoom;
  return (
    <div
      data-slot="recorte-de-foto"
      data-etapa="enquadrar"
      className={cn("@container/recorte w-full rounded-lg border border-border bg-card p-4 motion-safe:animate-in motion-safe:fade-in", className)}
    >
      <div className="grid gap-6 @min-[34rem]/recorte:grid-cols-[minmax(0,1fr)_auto] @min-[34rem]/recorte:items-start">
        <div className="grid min-w-0 gap-3">
          <p id={idDica} className="m-0 text-body-sm text-muted-foreground">{tx.dica}</p>
          <div
            ref={area}
            role="application"
            tabIndex={0}
            aria-label={tx.area}
            aria-describedby={idDica}
            onKeyDown={teclas}
            onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); arrasto.current = { id: e.pointerId, x: e.clientX, y: e.clientY, ex: enq.x, ey: enq.y }; }}
            onPointerMove={e => { const a = arrasto.current; if (!a || a.id !== e.pointerId) return; setEnq(v => limitar({ ...v, x: a.ex + e.clientX - a.x, y: a.ey + e.clientY - a.y })); }}
            onPointerUp={() => { arrasto.current = null; }}
            onPointerCancel={() => { arrasto.current = null; }}
            onWheel={e => { if (!e.ctrlKey) return; e.preventDefault(); mudarZoom(enq.zoom - e.deltaY * 0.002); }}
            className="relative aspect-square w-full max-w-80 cursor-grab touch-none select-none overflow-hidden rounded-md bg-muted outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <img
              src={foto.url}
              alt=""
              draggable={false}
              className="pointer-events-none absolute left-0 top-0 max-w-none origin-top-left"
              style={{ width: foto.img.naturalWidth, height: foto.img.naturalHeight, transform: `translate(${enq.x}px, ${enq.y}px) scale(${esc})` }}
            />
            {/* Véu fora do recorte e o contorno do recorte */}
            <span
              aria-hidden
              className={cn("pointer-events-none absolute inset-0 border-2 border-[var(--primary-foreground)] shadow-[0_0_0_999px_var(--sobreposicao)]", redondo ? "rounded-full" : "rounded-sm")}
            />
          </div>
          <div className="flex w-full max-w-80 items-center gap-2">
            <Button type="button" variant="ghost" size="icon" aria-label={tx.menos} onClick={() => mudarZoom(enq.zoom - 0.25)} disabled={enq.zoom <= 1}>
              <Minus aria-hidden />
            </Button>
            <Slider
              aria-label={tx.zoom}
              min={1}
              max={zoomMaximo}
              step={0.01}
              value={[enq.zoom]}
              onValueChange={([v]) => mudarZoom(v)}
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="icon" aria-label={tx.mais} onClick={() => mudarZoom(enq.zoom + 0.25)} disabled={enq.zoom >= zoomMaximo}>
              <Plus aria-hidden />
            </Button>
            <Button type="button" variant="ghost" size="icon" aria-label={tx.recomecar} onClick={() => setEnq(centralizar(1))}>
              <RotateCcw aria-hidden />
            </Button>
          </div>
        </div>
        <div className="grid justify-items-start gap-2 @min-[34rem]/recorte:justify-items-center">
          <p className="m-0 text-body-sm font-semibold text-foreground">{tx.previa}</p>
          <canvas
            ref={previa}
            role="img"
            aria-label={`${tx.previa}: ${foto.nome}`}
            className={cn("size-24 border border-border bg-muted", redondo ? "rounded-full" : "rounded-md")}
          />
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={cancelar}>{tx.cancelar}</Button>
        <Button type="button" onClick={usar} disabled={usando}>{tx.usar}</Button>
      </div>
    </div>
  );
}

export { RecorteDeFoto };

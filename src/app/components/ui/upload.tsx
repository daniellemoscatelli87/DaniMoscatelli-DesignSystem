"use client";

import * as React from "react";
import { UploadCloud, FileText, FileSpreadsheet, FileImage, File as FileIcon, X, RotateCcw, CheckCircle2, AlertCircle, Loader2, Camera, ImagePlus, Star, Trash2 } from "lucide-react";
import { cn } from "./utils";

/* ─────────────────────────────────────────────────────────────
   Upload
   Área de arrastar e soltar, lista de arquivos com progresso e
   estados, imagem única com prévia e galeria de imagens.
   Os componentes não enviam nada: recebem arquivos, validam e
   expõem callbacks. O envio é responsabilidade do produto.
   ───────────────────────────────────────────────────────────── */

export type UploadStatus = "pendente" | "enviando" | "concluido" | "erro";

export type UploadFile = {
  id: string;
  file?: File;
  name: string;
  size: number;
  type: string;
  status: UploadStatus;
  /** 0 a 100 */
  progress?: number;
  /** Mensagem curta quando status = erro */
  error?: string;
  /** URL de prévia (imagens) */
  url?: string;
};

export function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const v = bytes / Math.pow(1024, i);
  return `${v < 10 && i > 0 ? v.toFixed(1) : Math.round(v)} ${units[i]}`;
}

const primaryText = "text-[var(--primary-text,var(--primary))]";

export function fileKind(type: string, name = ""): "image" | "sheet" | "doc" | "other" {
  if (type.startsWith("image/")) return "image";
  if (/sheet|excel|csv/.test(type) || /\.(csv|xlsx?|numbers)$/i.test(name)) return "sheet";
  if (/pdf|word|text|document/.test(type) || /\.(pdf|docx?|txt|md)$/i.test(name)) return "doc";
  return "other";
}

function KindIcon({ type, name, className }: { type: string; name?: string; className?: string }) {
  const k = fileKind(type, name);
  const Icon = k === "image" ? FileImage : k === "sheet" ? FileSpreadsheet : k === "doc" ? FileText : FileIcon;
  return <Icon className={className} aria-hidden />;
}

/** Valida tipo, tamanho e quantidade. Retorna a mensagem de erro em português ou null. */
export function validateFiles(
  files: File[],
  opts: { accept?: string[]; maxSize?: number; maxFiles?: number; current?: number },
): string | null {
  const { accept, maxSize, maxFiles, current = 0 } = opts;
  if (maxFiles && current + files.length > maxFiles) return `Envie no máximo ${maxFiles} ${maxFiles === 1 ? "arquivo" : "arquivos"}.`;
  for (const f of files) {
    if (accept && accept.length) {
      const ok = accept.some(a => (a.endsWith("/*") ? f.type.startsWith(a.slice(0, -1)) : a.startsWith(".") ? f.name.toLowerCase().endsWith(a.toLowerCase()) : f.type === a));
      if (!ok) return `“${f.name}” não é um formato aceito.`;
    }
    if (maxSize && f.size > maxSize) return `“${f.name}” passa de ${formatBytes(maxSize)}.`;
  }
  return null;
}

/* ── Dropzone ── */
type DropzoneProps = {
  onFiles: (files: File[]) => void;
  /** Tipos aceitos (MIME ou extensão), ex.: ["image/*", ".pdf"] */
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  /** Abre a câmera no celular (fotos). */
  capture?: "environment" | "user";
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Texto do botão secundário (“Tirar foto” quando capture está definido). */
  actionLabel?: string;
  error?: string | null;
  onError?: (message: string) => void;
  size?: "md" | "lg" | "compact";
  className?: string;
  icon?: React.ReactNode;
};

export function UploadDropzone({
  onFiles, accept, maxSize, maxFiles, multiple = true, disabled, capture, title, description, actionLabel, error, onError, size = "md", className, icon,
}: DropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const captureRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const id = React.useId();

  const handle = (list: FileList | null) => {
    if (!list || disabled) return;
    const files = Array.from(list);
    const msg = validateFiles(files, { accept, maxSize, maxFiles });
    if (msg) { onError?.(msg); return; }
    onFiles(multiple ? files : files.slice(0, 1));
  };

  const hint = [
    accept?.length ? accept.map(a => (a.endsWith("/*") ? a.replace("/*", "") : a.replace(".", "").toUpperCase())).join(", ") : null,
    maxSize ? `até ${formatBytes(maxSize)}` : null,
    maxFiles && multiple ? `máx. ${maxFiles}` : null,
  ].filter(Boolean).join(" · ");

  const pad = size === "lg" ? "p-10 sm:p-14" : size === "compact" ? "p-4" : "p-8";

  return (
    <div className={cn("w-full", className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-describedby={`${id}-hint`}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={e => { if ((e.key === "Enter" || e.key === " ") && !disabled) { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={e => { e.preventDefault(); if (!disabled) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files); }}
        className={cn(
          "group relative flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-[20px] border-2 border-dashed text-center transition-all duration-200 outline-none",
          pad,
          disabled ? "cursor-not-allowed border-border bg-muted/40 opacity-60" :
          dragging ? "border-primary bg-[var(--primary-muted)] scale-[1.01] shadow-[var(--shadow-md)]" :
          error ? "border-error/60 bg-error/5" :
          "border-border bg-card hover:border-primary/60 hover:bg-[var(--primary-muted)]/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          size === "compact" && "flex-row justify-start gap-4 text-left rounded-[14px]",
        )}
      >
        <span className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-[var(--primary-muted)] transition-transform duration-200 group-hover:-translate-y-0.5",
          size === "compact" ? "h-10 w-10" : "h-14 w-14",
          dragging && "scale-110",
        )}>
          {icon ?? <UploadCloud className={cn(primaryText, size === "compact" ? "h-5 w-5" : "h-6 w-6")} strokeWidth={1.75} aria-hidden />}
        </span>
        <div className="min-w-0">
          <p className={cn("font-semibold text-foreground", size === "compact" ? "text-[0.875rem]" : "text-[1rem]")}>
            {title ?? (dragging ? "Solte para enviar" : <>Arraste e solte ou <span className={cn(primaryText, "underline-offset-4 group-hover:underline")}>escolha {multiple ? "arquivos" : "um arquivo"}</span></>)}
          </p>
          {(description || hint) && (
            <p id={`${id}-hint`} className="mt-1 text-[0.8125rem] text-muted-foreground">{description ?? hint}</p>
          )}
        </div>
        {capture && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); captureRef.current?.click(); }}
            className="mt-1 inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background px-4 text-[0.8125rem] font-semibold text-foreground transition-colors hover:border-primary hover:text-[var(--primary-text,var(--primary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Camera className="h-4 w-4" aria-hidden /> {actionLabel ?? "Tirar foto"}
          </button>
        )}
        <input ref={inputRef} type="file" className="sr-only" tabIndex={-1} multiple={multiple} accept={accept?.join(",")} disabled={disabled} onChange={e => { handle(e.target.files); e.target.value = ""; }} />
        {capture && <input ref={captureRef} type="file" className="sr-only" tabIndex={-1} accept="image/*" capture={capture} disabled={disabled} onChange={e => { handle(e.target.files); e.target.value = ""; }} />}
      </div>
      {error && (
        <p role="alert" className="mt-2 flex items-start gap-1.5 text-[0.8125rem] text-error">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />{error}
        </p>
      )}
    </div>
  );
}

/* ── Item e lista ── */
export function UploadItem({
  item, onRemove, onRetry, className,
}: { item: UploadFile; onRemove?: (id: string) => void; onRetry?: (id: string) => void; className?: string }) {
  const isImg = fileKind(item.type, item.name) === "image" && item.url;
  const statusLabel = item.status === "enviando" ? `Enviando… ${Math.round(item.progress ?? 0)}%` : item.status === "concluido" ? "Concluído" : item.status === "erro" ? (item.error ?? "Falha no envio") : "Aguardando";
  return (
    <li className={cn("flex items-center gap-3 rounded-[14px] border bg-card p-3 transition-colors", item.status === "erro" ? "border-error/50" : "border-border", className)}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-muted">
        {isImg ? <img src={item.url} alt="" className="h-full w-full object-cover" /> : <KindIcon type={item.type} name={item.name} className="h-5 w-5 text-muted-foreground" />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="truncate text-[0.875rem] font-semibold text-foreground">{item.name}</p>
          <span className="shrink-0 text-[0.75rem] text-muted-foreground">{formatBytes(item.size)}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          {item.status === "enviando" && (
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(item.progress ?? 0)} aria-label={`Envio de ${item.name}`}>
              <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${item.progress ?? 0}%` }} />
            </div>
          )}
          <span className={cn("flex shrink-0 items-center gap-1 text-[0.75rem]",
            item.status === "concluido" ? "text-success" : item.status === "erro" ? "text-error" : "text-muted-foreground")}>
            {item.status === "enviando" && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />}
            {item.status === "concluido" && <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />}
            {item.status === "erro" && <AlertCircle className="h-3.5 w-3.5" aria-hidden />}
            {statusLabel}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {item.status === "erro" && onRetry && (
          <button type="button" onClick={() => onRetry(item.id)} aria-label={`Tentar de novo: ${item.name}`} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><RotateCcw className="h-4 w-4" aria-hidden /></button>
        )}
        {onRemove && (
          <button type="button" onClick={() => onRemove(item.id)} aria-label={`Remover ${item.name}`} className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X className="h-4 w-4" aria-hidden /></button>
        )}
      </div>
    </li>
  );
}

export function UploadList({ items, onRemove, onRetry, className }: { items: UploadFile[]; onRemove?: (id: string) => void; onRetry?: (id: string) => void; className?: string }) {
  if (!items.length) return null;
  return <ul className={cn("space-y-2", className)} aria-live="polite">{items.map(i => <UploadItem key={i.id} item={i} onRemove={onRemove} onRetry={onRetry} />)}</ul>;
}

/* ── Imagem única com prévia ── */
export function ImageUpload({
  value, onChange, shape = "square", size = 120, label = "Imagem", accept = ["image/*"], maxSize, onError, className, capture,
}: {
  value?: string | null;
  onChange: (file: File | null, url: string | null) => void;
  shape?: "square" | "circle" | "wide";
  size?: number;
  label?: string;
  accept?: string[];
  maxSize?: number;
  onError?: (m: string) => void;
  className?: string;
  capture?: "environment" | "user";
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const pick = (list: FileList | null) => {
    if (!list?.length) return;
    const f = list[0];
    const msg = validateFiles([f], { accept, maxSize });
    if (msg) { onError?.(msg); return; }
    onChange(f, URL.createObjectURL(f));
  };
  const dims = shape === "wide" ? { width: "100%", maxWidth: size * 3, aspectRatio: "3 / 1" } : { width: size, height: size };
  return (
    <div className={cn("inline-flex flex-col items-start gap-2", shape === "wide" && "w-full", className)}>
      <div
        role="button" tabIndex={0} aria-label={value ? `Trocar ${label.toLowerCase()}` : `Adicionar ${label.toLowerCase()}`}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files); }}
        style={dims}
        className={cn(
          "group relative flex cursor-pointer items-center justify-center overflow-hidden border-2 bg-muted/40 text-muted-foreground transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          shape === "circle" ? "rounded-full" : "rounded-[16px]",
          value ? "border-solid border-border" : "border-dashed border-border hover:border-primary/60 hover:bg-[var(--primary-muted)]/60",
          dragging && "border-primary bg-[var(--primary-muted)]",
        )}
      >
        {value ? (
          <>
            <img src={value} alt={label} className="h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 opacity-0 transition-all group-hover:bg-foreground/45 group-hover:opacity-100 group-focus-visible:bg-foreground/45 group-focus-visible:opacity-100">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-[0.75rem] font-semibold text-foreground"><ImagePlus className="h-3.5 w-3.5" aria-hidden /> Trocar</span>
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-1.5 px-3 text-center">
            {capture ? <Camera className={cn("h-6 w-6", primaryText)} strokeWidth={1.75} aria-hidden /> : <ImagePlus className={cn("h-6 w-6", primaryText)} strokeWidth={1.75} aria-hidden />}
            <span className="text-[0.75rem] font-medium text-foreground">{label}</span>
            {maxSize && <span className="text-[0.6875rem]">até {formatBytes(maxSize)}</span>}
          </span>
        )}
        <input ref={inputRef} type="file" className="sr-only" tabIndex={-1} accept={accept.join(",")} capture={capture} onChange={e => { pick(e.target.files); e.target.value = ""; }} />
      </div>
      {value && (
        <button type="button" onClick={() => onChange(null, null)} className="inline-flex items-center gap-1 text-[0.75rem] font-semibold text-muted-foreground transition-colors hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
          <Trash2 className="h-3.5 w-3.5" aria-hidden /> Remover
        </button>
      )}
    </div>
  );
}

/* ── Galeria de imagens ── */
export type GalleryImage = { id: string; url: string; name?: string; status?: UploadStatus; progress?: number };

export function ImageGrid({
  images, onAdd, onRemove, onSetCover, coverId, max = 8, accept = ["image/*"], maxSize, onError, className, addLabel = "Adicionar fotos",
}: {
  images: GalleryImage[];
  onAdd: (files: File[]) => void;
  onRemove?: (id: string) => void;
  onSetCover?: (id: string) => void;
  coverId?: string;
  max?: number;
  accept?: string[];
  maxSize?: number;
  onError?: (m: string) => void;
  className?: string;
  addLabel?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const pick = (list: FileList | null) => {
    if (!list?.length) return;
    const files = Array.from(list);
    const msg = validateFiles(files, { accept, maxSize, maxFiles: max, current: images.length });
    if (msg) { onError?.(msg); return; }
    onAdd(files);
  };
  const remaining = max - images.length;
  return (
    <div className={className}>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
        {images.map(img => {
          const cover = coverId ? img.id === coverId : images[0]?.id === img.id;
          return (
            <li key={img.id} className="group relative aspect-square overflow-hidden rounded-[14px] border border-border bg-muted">
              <img src={img.url} alt={img.name ?? ""} className="h-full w-full object-cover" />
              {img.status === "enviando" && (
                <span className="absolute inset-0 flex items-end bg-foreground/35 p-2" aria-label={`Enviando ${Math.round(img.progress ?? 0)}%`}>
                  <span className="h-1.5 w-full overflow-hidden rounded-full bg-white/40"><span className="block h-full rounded-full bg-primary transition-[width]" style={{ width: `${img.progress ?? 0}%` }} /></span>
                </span>
              )}
              {img.status === "erro" && <span className="absolute inset-0 flex items-center justify-center bg-error/70 text-white"><AlertCircle className="h-6 w-6" aria-hidden /></span>}
              {cover && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-background/95 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-[0.08em] text-foreground"><Star className="h-3 w-3 fill-current text-primary" aria-hidden /> Capa</span>}
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 p-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                {onSetCover && !cover && <button type="button" onClick={() => onSetCover(img.id)} aria-label="Definir como capa" className="flex h-7 w-7 items-center justify-center rounded-full bg-background/95 text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Star className="h-3.5 w-3.5" aria-hidden /></button>}
                {onRemove && <button type="button" onClick={() => onRemove(img.id)} aria-label="Remover foto" className="flex h-7 w-7 items-center justify-center rounded-full bg-background/95 text-foreground hover:text-error focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Trash2 className="h-3.5 w-3.5" aria-hidden /></button>}
              </span>
            </li>
          );
        })}
        {remaining > 0 && (
          <li>
            <button
              type="button" onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); pick(e.dataTransfer.files); }}
              className="flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-[14px] border-2 border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-primary/60 hover:bg-[var(--primary-muted)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ImagePlus className={cn("h-6 w-6", primaryText)} strokeWidth={1.75} aria-hidden />
              <span className="px-2 text-center text-[0.6875rem] font-semibold leading-tight text-foreground">{addLabel}</span>
              <span className="text-[0.625rem]">{images.length}/{max}</span>
            </button>
            <input ref={inputRef} type="file" multiple className="sr-only" tabIndex={-1} accept={accept.join(",")} onChange={e => { pick(e.target.files); e.target.value = ""; }} />
          </li>
        )}
      </ul>
    </div>
  );
}

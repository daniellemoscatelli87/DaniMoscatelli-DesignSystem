import React, { useEffect, useRef, useState } from "react";
import { Check, UploadCloud, Camera } from "lucide-react";
import { useI18n } from "../../i18n";
import { TokenTable, type TokenGroup } from "./shared/TokenTable";
import { UploadDropzone, UploadList, ImageUpload, ImageGrid, formatBytes, type UploadFile, type GalleryImage } from "@/app/components/ui/upload";

/* Troque para true no FindLook Design System: muda só os exemplos. */
const FINDLOOK = false;

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-[1.375rem] font-bold tracking-[-0.02em] text-foreground">{title}</h2>
      {description && <p className="mt-1 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">{description}</p>}
      <div className="mt-4 h-px bg-border" />
    </div>
  );
}
function ShowcaseCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-[16px] border border-border bg-card p-6 ${className}`} style={{ boxShadow: "var(--shadow-xs)" }}>{children}</div>;
}
function SubTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{children}</p>;
}

/* Simulação de envio só para a demonstração: o produto troca por sua API. */
function useSimulatedUpload() {
  const [items, setItems] = useState<UploadFile[]>([]);
  const timers = useRef<Record<string, number>>({});
  const start = (id: string, failAt?: number) => {
    window.clearInterval(timers.current[id]);
    setItems(prev => prev.map(i => (i.id === id ? { ...i, status: "enviando", progress: 0, error: undefined } : i)));
    timers.current[id] = window.setInterval(() => {
      setItems(prev => prev.map(i => {
        if (i.id !== id || i.status !== "enviando") return i;
        const p = Math.min(100, (i.progress ?? 0) + 6 + Math.random() * 10);
        if (failAt && p >= failAt) { window.clearInterval(timers.current[id]); return { ...i, status: "erro", progress: p, error: "Conexão interrompida" }; }
        if (p >= 100) { window.clearInterval(timers.current[id]); return { ...i, status: "concluido", progress: 100 }; }
        return { ...i, progress: p };
      }));
    }, 180);
  };
  const add = (files: File[]) => {
    const novos: UploadFile[] = files.map(f => ({ id: `${f.name}-${f.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, file: f, name: f.name, size: f.size, type: f.type, status: "pendente", progress: 0, url: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined }));
    setItems(prev => [...prev, ...novos]);
    novos.forEach((n, i) => setTimeout(() => start(n.id, i === 1 && files.length > 1 ? 62 : undefined), 150 * i));
  };
  const remove = (id: string) => { window.clearInterval(timers.current[id]); setItems(prev => prev.filter(i => i.id !== id)); };
  const retry = (id: string) => start(id);
  useEffect(() => () => Object.values(timers.current).forEach(t => window.clearInterval(t)), []);
  return { items, add, remove, retry, setItems };
}

export function UploadShowcase() {
  const { t } = useI18n();
  const docs = useSimulatedUpload();
  const [docsError, setDocsError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [coverId, setCoverId] = useState<string | undefined>();
  const [galError, setGalError] = useState<string | null>(null);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const sheet = useSimulatedUpload();

  const addToGallery = (files: File[]) => {
    const novos: GalleryImage[] = files.map(f => ({ id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, url: URL.createObjectURL(f), name: f.name, status: "enviando", progress: 0 }));
    setGallery(prev => [...prev, ...novos]);
    novos.forEach(n => {
      const timer = window.setInterval(() => setGallery(prev => prev.map(g => {
        if (g.id !== n.id) return g;
        const p = Math.min(100, (g.progress ?? 0) + 8 + Math.random() * 12);
        if (p >= 100) { window.clearInterval(timer); return { ...g, status: "concluido", progress: 100 }; }
        return { ...g, progress: p };
      })), 160);
    });
  };

  const ex = FINDLOOK ? {
    dropTitle: t("Busca por foto", "Busca por foto"),
    dropDesc: t("Envie uma foto da peça que você procura. JPG, PNG ou HEIC, até 10 MB.", "Envie uma foto da peça que você procura. JPG, PNG ou HEIC, até 10 MB."),
    listTitle: t("Fotos e documentos da loja", "Fotos e documentos da loja"),
    avatarLabel: t("Logo da loja", "Logo da loja"),
    coverLabel: t("Capa da vitrine", "Capa da vitrine"),
    galleryTitle: t("Fotos da peça", "Fotos da peça"),
    galleryDesc: t("Até 8 fotos por peça. A primeira é a capa; toque na estrela para trocar.", "Até 8 fotos por peça. A primeira é a capa; toque na estrela para trocar."),
    sheetTitle: t("Importar planilha de produtos", "Importar planilha de produtos"),
    sheetDesc: t("Cadastre várias peças de uma vez com uma planilha CSV ou Excel. Nada é publicado sem a sua confirmação.", "Cadastre várias peças de uma vez com uma planilha CSV ou Excel. Nada é publicado sem a sua confirmação."),
  } : {
    dropTitle: t("Documents", "Documentos"),
    dropDesc: t("Drop files here or choose from the device. PDF, images and spreadsheets, up to 10 MB each.", "Solte os arquivos aqui ou escolha no dispositivo. PDF, imagens e planilhas, até 10 MB cada."),
    listTitle: t("Attachments", "Anexos"),
    avatarLabel: t("Profile photo", "Foto de perfil"),
    coverLabel: t("Cover image", "Imagem de capa"),
    galleryTitle: t("Image gallery", "Galeria de imagens"),
    galleryDesc: t("Up to 8 images. The first one is the cover; tap the star to change it.", "Até 8 imagens. A primeira é a capa; toque na estrela para trocar."),
    sheetTitle: t("Import spreadsheet", "Importar planilha"),
    sheetDesc: t("Bulk import with a CSV or Excel file. Nothing is saved without confirmation.", "Importação em lote com um arquivo CSV ou Excel. Nada é gravado sem confirmação."),
  };

  const tokenGroups: TokenGroup[] = [
    {
      group: t("Upload — surfaces", "Upload — superfícies"),
      tokens: [
        { name: "--card / --border", description: t("Dropzone at rest (dashed 2 px border)", "Área de soltar em repouso (borda tracejada de 2 px)"), light: "card", dark: "card" },
        { name: "--primary / --primary-muted", description: t("Hover and dragging: border and tint; icon circle", "Hover e arrastando: borda e tom; círculo do ícone"), light: "primary", dark: "primary" },
        { name: "--error", description: t("Invalid file: border, message and failed item", "Arquivo inválido: borda, mensagem e item com falha"), light: "error", dark: "error" },
        { name: "--success", description: t("Completed item", "Item concluído"), light: "success", dark: "success" },
        { name: "--muted", description: t("Thumbnails and progress track", "Miniaturas e trilho da barra de progresso"), light: "muted", dark: "muted" },
      ],
    },
    {
      group: t("Upload — shape and motion", "Upload — forma e movimento"),
      tokens: [
        { name: "radius", description: t("Dropzone 20 px · items 14 px · thumbnails 10 px", "Área 20 px · itens 14 px · miniaturas 10 px"), light: "20 / 14 / 10 px" },
        { name: "icon circle", description: t("56 px (40 px compact), primary-muted", "56 px (40 px compacta), primary-muted"), light: "56px" },
        { name: "transition", description: t("Border, tint and scale (1.01) while dragging", "Borda, tom e escala (1,01) ao arrastar"), light: "200ms" },
        { name: "progress", description: t("6 px track, primary fill, width animated", "Trilho de 6 px, preenchimento primário, largura animada"), light: "200ms" },
      ],
    },
  ];

  return (
    <div className="space-y-16">
      <section id="upload-dropzone">
        <SectionHeader
          title={t("Upload", "Upload")}
          description={t(
            "Four pieces that work together: the drop area, the file list with progress and states, the single image with preview and the image gallery. They validate type, size and quantity and hand the files to the product; sending is the product's job.",
            "Quatro peças que trabalham juntas: a área de soltar, a lista de arquivos com progresso e estados, a imagem única com prévia e a galeria de imagens. Elas validam tipo, tamanho e quantidade e entregam os arquivos ao produto; o envio é responsabilidade do produto.",
          )}
        />
        <ShowcaseCard>
          <SubTitle>{t("Drop area", "Área de soltar")}</SubTitle>
          <UploadDropzone
            onFiles={files => { setDocsError(null); docs.add(files); }}
            onError={setDocsError}
            error={docsError}
            accept={FINDLOOK ? ["image/*", ".pdf", ".csv", ".xlsx"] : [".pdf", "image/*", ".csv", ".xlsx"]}
            maxSize={10 * 1024 * 1024}
            maxFiles={6}
            description={ex.dropDesc}
          />
          <p className="mt-3 text-[0.8125rem] text-muted-foreground">{t("Try it: drop a few files, or one too large, to see the states. The second file of a batch fails on purpose to show the retry.", "Experimente: solte alguns arquivos, ou um grande demais, para ver os estados. O segundo arquivo de um lote falha de propósito para mostrar o “tentar de novo”.")}</p>
          <div id="upload-list" className="mt-6 scroll-mt-32">
            <SubTitle>{ex.listTitle}</SubTitle>
            {docs.items.length ? (
              <UploadList items={docs.items} onRemove={docs.remove} onRetry={docs.retry} />
            ) : (
              <p className="rounded-[12px] border border-dashed border-border px-4 py-6 text-center text-[0.8125rem] text-muted-foreground">{t("No files yet. The list appears below the drop area as soon as a file arrives.", "Nenhum arquivo ainda. A lista aparece abaixo da área de soltar assim que um arquivo chega.")}</p>
            )}
          </div>
        </ShowcaseCard>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <ShowcaseCard>
            <SubTitle>{t("Compact", "Compacta")}</SubTitle>
            <UploadDropzone size="compact" multiple={false} accept={[".pdf"]} maxSize={5 * 1024 * 1024} title={t("Attach a PDF", "Anexar um PDF")} description={t("One file, up to 5 MB", "Um arquivo, até 5 MB")} onFiles={files => docs.add(files)} onError={setDocsError} />
            <p className="mt-3 text-[0.8125rem] text-muted-foreground">{t("For forms and side panels, where height matters.", "Para formulários e painéis laterais, onde a altura importa.")}</p>
          </ShowcaseCard>
          <ShowcaseCard>
            <SubTitle>{t("Photo with camera (mobile)", "Foto com câmera (celular)")}</SubTitle>
            <UploadDropzone
              multiple={false} accept={["image/*"]} maxSize={10 * 1024 * 1024} capture="environment"
              icon={<Camera className="h-6 w-6 text-[var(--primary-text,var(--primary))]" strokeWidth={1.75} aria-hidden />}
              title={ex.dropTitle} description={ex.dropDesc}
              onFiles={files => { setImgError(null); setPhoto(URL.createObjectURL(files[0])); }} onError={setImgError} error={imgError}
            />
            {photo && (
              <div className="mt-3 flex items-center gap-3">
                <img src={photo} alt="" className="h-16 w-16 rounded-[10px] object-cover" />
                <span className="inline-flex items-center gap-1 text-[0.8125rem] text-success"><Check className="h-4 w-4" aria-hidden />{t("Photo ready", "Foto pronta")}</span>
                <button type="button" onClick={() => setPhoto(null)} className="ml-auto text-[0.75rem] font-semibold text-muted-foreground hover:text-foreground">{t("Remove", "Remover")}</button>
              </div>
            )}
            <p className="mt-3 text-[0.8125rem] text-muted-foreground">{t("On the phone, “Take photo” opens the camera directly; on desktop it opens the file picker.", "No celular, “Tirar foto” abre a câmera direto; no computador, abre o seletor de arquivos.")}</p>
          </ShowcaseCard>
        </div>
      </section>

      <section id="upload-image">
        <SectionHeader title={t("Single image with preview", "Imagem única com prévia")} description={t("Avatar, logo or cover. The area shows the image, offers “Change” on hover and “Remove” below.", "Avatar, logo ou capa. A área mostra a imagem, oferece “Trocar” ao passar o mouse e “Remover” abaixo.")} />
        <ShowcaseCard>
          <div className="flex flex-wrap items-start gap-10">
            <div>
              <SubTitle>{t("Circle", "Círculo")}</SubTitle>
              <ImageUpload shape="circle" size={112} label={ex.avatarLabel} value={avatar} onChange={(_, url) => setAvatar(url)} maxSize={5 * 1024 * 1024} onError={setImgError} />
            </div>
            <div>
              <SubTitle>{t("Square", "Quadrado")}</SubTitle>
              <ImageUpload shape="square" size={112} label={t("Image", "Imagem")} value={null} onChange={() => {}} maxSize={5 * 1024 * 1024} onError={setImgError} />
            </div>
            <div className="min-w-0 flex-1 basis-[280px]">
              <SubTitle>{t("Wide (3:1)", "Larga (3:1)")}</SubTitle>
              <ImageUpload shape="wide" size={140} label={ex.coverLabel} value={cover} onChange={(_, url) => setCover(url)} maxSize={8 * 1024 * 1024} onError={setImgError} />
            </div>
          </div>
          {imgError && <p role="alert" className="mt-3 text-[0.8125rem] text-error">{imgError}</p>}
        </ShowcaseCard>
      </section>

      <section id="upload-gallery">
        <SectionHeader title={ex.galleryTitle} description={ex.galleryDesc} />
        <ShowcaseCard>
          <ImageGrid images={gallery} onAdd={files => { setGalError(null); addToGallery(files); }} onRemove={id => setGallery(g => g.filter(x => x.id !== id))} onSetCover={setCoverId} coverId={coverId} max={8} maxSize={10 * 1024 * 1024} onError={setGalError} addLabel={t("Add photos", "Adicionar fotos")} />
          {galError && <p role="alert" className="mt-3 text-[0.8125rem] text-error">{galError}</p>}
          <p className="mt-4 text-[0.8125rem] text-muted-foreground">{t("Each thumbnail shows its own progress; the cover badge marks the first image unless another is chosen.", "Cada miniatura mostra o próprio progresso; o selo “Capa” marca a primeira imagem, a menos que outra seja escolhida.")}</p>
        </ShowcaseCard>
      </section>

      <section id="upload-sheet">
        <SectionHeader title={ex.sheetTitle} description={ex.sheetDesc} />
        <ShowcaseCard>
          <UploadDropzone size="lg" multiple={false} accept={[".csv", ".xlsx"]} maxSize={20 * 1024 * 1024} title={t("Drop your spreadsheet here", "Solte sua planilha aqui")} description={t("CSV or Excel (.xlsx), up to 20 MB. We show a preview before saving.", "CSV ou Excel (.xlsx), até 20 MB. Mostramos uma prévia antes de gravar.")} onFiles={files => { setSheetError(null); sheet.add(files); }} onError={setSheetError} error={sheetError} />
          <UploadList className="mt-4" items={sheet.items} onRemove={sheet.remove} onRetry={sheet.retry} />
        </ShowcaseCard>
      </section>

      <section id="upload-states">
        <SectionHeader title={t("States and messages", "Estados e mensagens")} />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [t("Rest", "Repouso"), t("Dashed border, card background, icon in a primary-muted circle, one sentence of instruction and the limits in small text.", "Borda tracejada, fundo de card, ícone em círculo primary-muted, uma frase de instrução e os limites em texto pequeno.")],
            [t("Hover / dragging", "Hover / arrastando"), t("Border turns primary, background gets the primary tint, the area grows 1% and the title changes to “Drop to upload”.", "A borda vira primária, o fundo ganha o tom primário, a área cresce 1% e o título muda para “Solte para enviar”.")],
            [t("Invalid file", "Arquivo inválido"), t("The area is outlined in error color and a message says exactly what is wrong: format, size or count. Nothing is added.", "A área ganha contorno na cor de erro e uma mensagem diz exatamente o que está errado: formato, tamanho ou quantidade. Nada é adicionado.")],
            [t("Uploading", "Enviando"), t("Item with 6 px progress bar, spinner and percentage. The remove button cancels.", "Item com barra de 6 px, indicador girando e porcentagem. O botão remover cancela.")],
            [t("Done", "Concluído"), t("Green check and “Concluído”; the thumbnail shows the image when there is one.", "Check verde e “Concluído”; a miniatura mostra a imagem quando houver.")],
            [t("Failed", "Falha"), t("Error border, short reason (“Conexão interrompida”) and a “try again” button; the file stays in the list.", "Borda de erro, motivo curto (“Conexão interrompida”) e botão “tentar de novo”; o arquivo fica na lista.")],
            [t("Disabled", "Desabilitado"), t("60% opacity, no hover, cursor not-allowed; explain why nearby.", "Opacidade 60%, sem hover, cursor de proibido; explique o motivo ao lado.")],
            [t("Messages", "Mensagens"), t("“… não é um formato aceito.” · “… passa de 10 MB.” · “Envie no máximo 8 arquivos.” Always with the file name.", "“… não é um formato aceito.” · “… passa de 10 MB.” · “Envie no máximo 8 arquivos.” Sempre com o nome do arquivo.")],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-[14px] border border-border bg-card p-4">
              <p className="mb-1 text-[0.875rem] font-semibold text-foreground">{title}</p>
              <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="upload-a11y">
        <SectionHeader title={t("Accessibility checklist", "Checklist de acessibilidade")} />
        <ShowcaseCard>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              t("The drop area is a button: Tab reaches it, Enter and Space open the picker; dragging is an extra, never the only way.", "A área de soltar é um botão: Tab chega nela, Enter e Espaço abrem o seletor; arrastar é um extra, nunca o único caminho."),
              t("Limits are read with the area (aria-describedby) before the person chooses a file.", "Os limites são lidos junto com a área (aria-describedby) antes de a pessoa escolher o arquivo."),
              t("Errors use role=\"alert\" and name the file and the reason.", "Erros usam role=\"alert\" e dizem o nome do arquivo e o motivo."),
              t("Progress bars are role=\"progressbar\" with value and an accessible name; the list is aria-live.", "Barras de progresso são role=\"progressbar\" com valor e nome acessível; a lista é aria-live."),
              t("Remove, retry and cover buttons have explicit labels with the file name.", "Botões de remover, tentar de novo e capa têm rótulos explícitos com o nome do arquivo."),
              t("Status never depends on color alone: icon plus text on every item.", "O estado nunca depende só da cor: ícone mais texto em todo item."),
              t("Touch targets of at least 44 px; thumbnails show actions on focus, not only on hover.", "Alvos de toque de pelo menos 44 px; miniaturas mostram as ações no foco, não só no hover."),
              t("Previews use object URLs released when the item is removed.", "As prévias usam object URLs liberadas quando o item é removido."),
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-[0.8125rem] leading-relaxed text-muted-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />{item}</li>
            ))}
          </ul>
        </ShowcaseCard>
      </section>

      <section id="upload-usage">
        <SectionHeader title={t("Usage", "Uso")} description={t("Composition in code. The product owns the upload call and updates the item status.", "Composição em código. O produto faz a chamada de envio e atualiza o estado de cada item.")} />
        <ShowcaseCard className="overflow-x-auto">
          <pre className="text-[0.75rem] leading-relaxed text-muted-foreground"><code>{`import { UploadDropzone, UploadList, ImageUpload, ImageGrid, type UploadFile } from "@/app/components/ui/upload";

<UploadDropzone accept={["image/*", ".pdf"]} maxSize={10 * 1024 * 1024} maxFiles={6}
  onFiles={files => enviar(files)} onError={setErro} error={erro} />
<UploadList items={itens} onRemove={remover} onRetry={tentarDeNovo} />

<ImageUpload shape="circle" label="${ex.avatarLabel}" value={url} onChange={(file, url) => …} />
<ImageGrid images={fotos} onAdd={adicionar} onRemove={remover} onSetCover={definirCapa} max={8} />`}</code></pre>
          <p className="mt-3 text-[0.75rem] text-muted-foreground">{t("UploadFile.status: pendente · enviando · concluido · erro. Update progress (0 to 100) while sending.", "UploadFile.status: pendente · enviando · concluido · erro. Atualize progress (0 a 100) durante o envio.")} {t("Sizes shown with", "Tamanhos exibidos com")} <code>formatBytes</code> ({formatBytes(10 * 1024 * 1024)}).</p>
        </ShowcaseCard>
      </section>

      <section id="upload-tokens">
        <SectionHeader title={t("Tokens", "Tokens")} />
        <TokenTable groups={tokenGroups} />
      </section>
    </div>
  );
}

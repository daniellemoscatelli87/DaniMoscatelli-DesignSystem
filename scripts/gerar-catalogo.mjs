#!/usr/bin/env node
/*
 * Gera o CATÁLOGO do design system: CATALOGO.md (para pessoas e agentes de IA) e catalogo.json (para programas).
 *
 * Roda sozinho antes de cada `pnpm build` (script "prebuild" do package.json), então o catálogo está sempre atualizado.
 * Uso:
 *   node scripts/gerar-catalogo.mjs           grava CATALOGO.md e catalogo.json na raiz
 *   node scripts/gerar-catalogo.mjs --check   não grava nada; falha (código 1) se os arquivos gravados estiverem desatualizados
 *
 * O que ele lê (só o código, sem dependências):
 *   - src/app/components/ui/*.ts(x): componentes importáveis (exports, comentário de abertura, props, variantes cva);
 *   - src/app/components/showcase/**: páginas de demonstração, as âncoras (id="...") e o que cada seção usa;
 *   - src/app/App.tsx: menu (páginas, itens, rótulos em português) e qual arquivo monta cada página;
 *   - src/styles/theme.css: tokens;
 *   - propostas/*.md: propostas de componente novo e o status de cada uma.
 * A saída é determinística (ordem fixa, sem data), para o --check funcionar.
 */
import { readFileSync, readdirSync, existsSync, writeFileSync, statSync } from "node:fs";
import { join, dirname, relative, resolve, basename } from "node:path";
import { fileURLToPath } from "node:url";

/* ── Configuração deste design system ─────────────────────────────────────── */
const CONFIG = {
  "nome": "Dani Moscatelli Design System",
  "repositorio": "daniellemoscatelli87/DaniMoscatelli-DesignSystem",
  "site": "https://designsystem.danimoscatelli.com.br",
  "regraCurta": "antes de criar ou alterar qualquer elemento visual (inclusive páginas de demonstração e templates), consulte este catálogo e use o componente, template ou padrão que já existe; não recrie à mão. Peça nova nasce em `src/app/components/ui/` pelo processo de `propostas/README.md`.",
  "importacao": "Dentro do design system, importe de `../ui/<arquivo>` (ou `@/app/components/ui/<arquivo>`). No produto, use a cópia que chega pela sincronização do design system (`design-system/arquivos.txt` do produto), nunca uma cópia feita à mão.",
  "notaTokens": "",
  "gruposDeProduto": [
    "Componentes",
    "Templates"
  ],
  "andaimes": [
    "SectionHeader",
    "PageHeader",
    "PageSection",
    "SectionLabel",
    "NavCard",
    "CardGrid",
    "CopyLinkButton",
    "CopyBtn",
    "CodeBlock",
    "TextLink",
    "Mono",
    "SectionBlock",
    "Panel",
    "Bullets",
    "DownloadButton",
    "Swatch",
    "TokenRowItem",
    "TokenTable",
    "VejaEm",
    "DoDont",
    "Callout",
    "SubSection",
    "SubTitle",
    "ShowcaseCard",
    "TemplateLabel",
    "TemplateFrame",
    "SpecCard",
    "Parte",
    "Rotulo",
    "RotuloVariante",
    "Token",
    "Pill",
    "StepBadge",
    "MolduraCelular",
    "ConteudoFalso",
    "Moldura",
    "PaginaFalsa",
    "DataTable",
    "CustomTooltip",
    "RegraDasLinhas",
    "Linhas"
  ],
  "regras": [
    [
      "ux-hierarchy",
      "Hierarquia de ações: principal, secundária e terciária"
    ],
    [
      "card-escolher",
      "Como escolher o card: pelo fundo, com borda ou com sombra"
    ],
    [
      "card-layout",
      "Card: borda, sombra e raio"
    ],
    [
      "card-guidelines",
      "Card: o que evitar"
    ],
    [
      "alerts",
      "Alertas: tipos e quando usar cada um"
    ],
    [
      "alerta-com-acao",
      "Alerta com ação: ações sempre embaixo do texto"
    ],
    [
      "grid-colunas",
      "Grid de colunas: 4, 8 e 12 colunas por tela"
    ],
    [
      "grid-uso",
      "Grid e espaçamento: como usar"
    ],
    [
      "grid-evitar",
      "Grid e espaçamento: o que evitar"
    ],
    [
      "states-regras",
      "Estado nunca só por cor: ícone e texto juntos"
    ],
    [
      "a11y-contrast",
      "Contraste mínimo (WCAG 2.2 AA)"
    ],
    [
      "a11y-motion",
      "Respeitar a preferência por menos movimento"
    ],
    [
      "motion-tokens",
      "Durações e curvas oficiais de movimento"
    ],
    [
      "ux-destructive",
      "Ações destrutivas: confirmação e desfazer"
    ],
    [
      "graficos-escolher",
      "Gráficos: como escolher"
    ],
    [
      "graficos-cores",
      "Gráficos: cores e ordem dos tons"
    ],
    [
      "header-usage",
      "Cabeçalho: uso"
    ],
    [
      "escrita-principios",
      "Escrita: princípios"
    ]
  ],
  "arquivosDeRegras": [
    "CLAUDE.md",
    "guidelines/Guidelines.md",
    "propostas/README.md"
  ]
};

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const UI = "src/app/components/ui";
const SHOWCASE = "src/app/components/showcase";
const GITHUB = `https://github.com/${CONFIG.repositorio}/blob/main`;

const ler = (rel) => readFileSync(join(RAIZ, rel), "utf8");
const existe = (rel) => existsSync(join(RAIZ, rel));
const ordenar = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

function listarArquivos(rel, filtro) {
  const base = join(RAIZ, rel);
  if (!existsSync(base)) return [];
  const saida = [];
  const andar = (dir) => {
    for (const nome of readdirSync(dir).sort(ordenar)) {
      const p = join(dir, nome);
      if (statSync(p).isDirectory()) andar(p);
      else if (filtro(nome)) saida.push(relative(RAIZ, p).split("\\").join("/"));
    }
  };
  andar(base);
  return saida;
}

const semAcento = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const normalizar = (s) => semAcento(String(s)).toLowerCase().replace(/[^a-z0-9]/g, "");
const linhaDe = (texto, indice) => texto.slice(0, indice).split("\n").length;

/* Troca comentários por espaços (mantém as quebras de linha, para os números de linha continuarem certos).
   Só comentários de bloco e linhas que começam com //, para não estragar URLs dentro de textos. */
function mascararComentarios(src) {
  let s = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
  s = s.replace(/^([ \t]*)\/\/.*$/gm, (m, ind) => ind + " ".repeat(m.length - ind.length));
  return mascararExemplosDeCodigo(s);
}

/* Troca por espaços o conteúdo dos textos entre crases de várias linhas (exemplos de código nas páginas), para que
   "import ..." ou "<Componente>" escritos como exemplo não contem como código. Textos de uma linha ficam (className). */
function mascararExemplosDeCodigo(s) {
  const out = s.split("");
  const re = /([{(=,:?[+]|return)\s*`/g;
  let m;
  while ((m = re.exec(s))) {
    const ini = m.index + m[0].length; // logo depois da crase
    let j = ini, prof = 0;
    while (j < s.length) {
      const c = s[j];
      if (c === "\\") { j += 2; continue; }
      if (prof === 0 && c === "`") break;
      if (c === "$" && s[j + 1] === "{") { prof++; j += 2; continue; }
      if (prof > 0 && c === "}") prof--;
      j++;
    }
    if (s.slice(ini, j).includes("\n")) for (let k = ini; k < j; k++) if (out[k] !== "\n") out[k] = " ";
    re.lastIndex = j + 1;
  }
  return out.join("");
}

/* Pula uma string que começa em src[i] (", ' ou `) e devolve o índice logo depois dela. */
function pularString(src, i) {
  const q = src[i];
  let j = i + 1;
  while (j < src.length) {
    if (src[j] === "\\") { j += 2; continue; }
    if (src[j] === q) return j + 1;
    j++;
  }
  return src.length;
}

/* Fim da tag JSX de abertura que começa em src[i] === "<". */
function fimDaTag(src, i) {
  let prof = 0;
  let j = i + 1;
  while (j < src.length) {
    const c = src[j];
    if (c === '"' || c === "'" || (prof > 0 && c === "`")) { j = pularString(src, j); continue; }
    if (c === "{") prof++;
    else if (c === "}") prof--;
    else if (c === ">" && prof <= 0) return { fim: j, autoFechada: src[j - 1] === "/" };
    j++;
  }
  return { fim: src.length, autoFechada: true };
}

/* Bloco balanceado que começa em src[i] (um de "{[(") e devolve o índice do fechamento. Para código TS (sem JSX). */
function fimDoBloco(src, i) {
  const abre = src[i];
  const fecha = { "{": "}", "(": ")", "[": "]", "<": ">" }[abre];
  let prof = 0;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (c === '"' || c === "'" || c === "`") { j = pularString(src, j) - 1; continue; }
    if (c === abre) prof++;
    else if (c === fecha) { prof--; if (prof === 0) return j; }
  }
  return src.length - 1;
}

/* Divide uma lista por vírgulas de nível 0. */
function dividirNivelZero(txt) {
  const partes = [];
  let prof = 0, atual = "";
  for (let j = 0; j < txt.length; j++) {
    const c = txt[j];
    if (c === '"' || c === "'" || c === "`") { const f = pularString(txt, j); atual += txt.slice(j, f); j = f - 1; continue; }
    if ("{([<".includes(c)) prof++;
    else if ("})]>".includes(c)) prof--;
    if (c === "," && prof === 0) { partes.push(atual); atual = ""; continue; }
    atual += c;
  }
  if (atual.trim()) partes.push(atual);
  return partes.map((p) => p.trim()).filter(Boolean);
}

/* Texto em português de um valor de atributo: "x", {"x"}, {t("en", "pt")}. */
function textoPt(expr) {
  if (!expr) return null;
  const e = expr.trim();
  let m = e.match(/^"([^"]*)"$/) || e.match(/^\{\s*"([^"]*)"\s*\}$/);
  if (m) return m[1];
  m = e.match(/^\{\s*t\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*,?\s*\)\s*\}$/);
  if (m) return m[2];
  return null;
}

/* Valor do atributo `nome` dentro do texto de uma tag de abertura. */
function atributo(tag, nome) {
  const re = new RegExp(`\\s${nome}=`, "g");
  const m = re.exec(tag);
  if (!m) return null;
  let j = m.index + m[0].length;
  if (tag[j] === '"') return tag.slice(j, pularString(tag, j));
  if (tag[j] === "{") {
    let prof = 0;
    for (let k = j; k < tag.length; k++) {
      const c = tag[k];
      if (c === '"' || c === "'" || c === "`") { k = pularString(tag, k) - 1; continue; }
      if (c === "{") prof++;
      else if (c === "}") { prof--; if (prof === 0) return tag.slice(j, k + 1); }
    }
  }
  return null;
}

/* Limpa um comentário (/** *\/, /* *\/ ou //) e devolve o texto corrido. */
function limparComentario(c) {
  return c
    .replace(/^\/\*\*?|\*\/$/g, "")
    .split("\n")
    .map((l) => l.replace(/^\s*(\*|\/\/)\s?/, "").trimEnd())
    .join("\n")
    .replace(/[─━═]+|={3,}/g, "")
    .trim();
}
// Primeiro parágrafo; se ele for só um título curto, junta o seguinte.
function primeiroParagrafo(t) {
  const ps = (t || "").split(/\n\s*\n/).map((p) => p.replace(/\s+/g, " ").trim()).filter(Boolean);
  let s = ps[0] || "";
  if (s.length < 80 && ps[1]) s = `${s.replace(/[.:]?$/, ":")} ${ps[1]}`;
  return s;
}
function resumir(t, max = 320) {
  const s = primeiroParagrafo(t);
  if (s.length <= max) return s;
  const corte = s.slice(0, max);
  const fim = Math.max(corte.lastIndexOf(". "), corte.lastIndexOf("; "));
  return (fim > max * 0.5 ? corte.slice(0, fim + 1) : corte.replace(/\s+\S*$/, "") + " …").trim();
}

/* Comentário que termina logo antes da posição `indice` (só espaços entre os dois). */
function comentarioAntes(src, indice) {
  const antes = src.slice(0, indice).replace(/\s+$/, "");
  if (antes.endsWith("*/")) {
    const ini = antes.lastIndexOf("/*");
    if (ini >= 0) return limparComentario(antes.slice(ini));
  }
  const linhas = antes.split("\n");
  const coment = [];
  for (let k = linhas.length - 1; k >= 0 && /^\s*\/\//.test(linhas[k]); k--) coment.unshift(linhas[k]);
  return coment.length ? limparComentario(coment.join("\n")) : "";
}

/* ── Definições de nível 0 de um arquivo (função, const, tipo...) ─────────── */
const RE_DEF = /^(export\s+)?(default\s+)?(async\s+)?(?:(function)\*?\s+([A-Za-z_$][\w$]*)|(const|let|var)\s+([A-Za-z_$][\w$]*)|(class)\s+([A-Za-z_$][\w$]*)|(type|interface|enum)\s+([A-Za-z_$][\w$]*))/;
function definicoes(src) {
  const linhas = src.split("\n");
  const defs = [];
  let pos = 0;
  for (let n = 0; n < linhas.length; n++) {
    const l = linhas[n];
    const m = l.match(RE_DEF);
    if (m) {
      const tipo = m[4] || m[6] || m[8] || m[10];
      const nome = m[5] || m[7] || m[9] || m[11];
      defs.push({ nome, tipo, exportado: !!m[1], inicio: pos, linha: n + 1 });
    } else if (/^(export\s+\{|export\s+default|import\s|\}\s*from)/.test(l) && defs.length) {
      defs.push({ nome: null, tipo: "outro", inicio: pos, linha: n + 1 });
    }
    pos += l.length + 1;
  }
  for (let k = 0; k < defs.length; k++) defs[k].fim = k + 1 < defs.length ? defs[k + 1].inicio : src.length;
  return defs.filter((d) => d.nome);
}

/* Tags JSX com nome de componente (<Nome ou <Nome.Parte). Ignora genéricos de TS (useState<Tipo>). */
function tagsDeComponente(src, ini = 0, fim = src.length) {
  const re = /<([A-Z][\w$]*)(?:\.([A-Z][\w$]*))?(?=[\s/>])/g;
  re.lastIndex = ini;
  const out = [];
  let m;
  while ((m = re.exec(src)) && m.index < fim) {
    const antes = src[m.index - 1];
    if (antes && /[\w$.\])]/.test(antes)) continue;
    out.push({ nome: m[1], pos: m.index });
  }
  return out;
}
const temJSX = (src, ini, fim) => /(^|[\s({>?:,=&|])<([A-Za-z][\w.]*|>)[\s/>]/.test(src.slice(ini, fim));

/* Elementos com estilo visual feito à mão (borda, fundo, raio, sombra no className). */
const RE_VISUAL = /(^|[\s"'`{:])(?:[a-z-]+:)*(rounded(?:-[^\s"'`]*)?|border(?:-[trblxy])?(?:-[^\s"'`]*)?|bg-[^\s"'`]+|shadow(?:-[^\s"'`]*)?|ring-\d[^\s"'`]*)/;
const TAGS_IGNORADAS = new Set(["svg", "path", "circle", "rect", "g", "line", "polyline", "polygon", "defs", "linearGradient", "radialGradient", "stop", "ellipse", "text", "tspan", "mask", "clipPath", "foreignObject", "input", "img", "video", "source", "br", "hr", "option", "td", "th", "tr", "thead", "tbody", "table", "code", "pre", "kbd", "strong", "em", "b", "i", "time", "label", "textarea", "select"]);
function elementosFeitosAMao(src, ini, fim, ehComponenteDoDS) {
  const re = /<([a-zA-Z][\w$]*)(?=[\s>])/g;
  re.lastIndex = ini;
  let m, n = 0;
  while ((m = re.exec(src)) && m.index < fim) {
    const antes = src[m.index - 1];
    if (antes && /[\w$.\])]/.test(antes)) continue;
    const nome = m[1];
    const minuscula = nome[0] === nome[0].toLowerCase();
    if (minuscula && TAGS_IGNORADAS.has(nome)) continue;
    if (!minuscula && !ehComponenteDoDS(nome)) continue;
    const { fim: f } = fimDaTag(src, m.index);
    const tag = src.slice(m.index, f + 1);
    const cls = atributo(tag, "className");
    if (!cls) continue;
    // Num componente do DS, só conta quando o className muda a aparência (borda, fundo, raio, sombra).
    if (RE_VISUAL.test(cls.replace(/^\{|\}$/g, ""))) n++;
  }
  return n;
}

/* ── Imports de um arquivo ────────────────────────────────────────────────── */
function imports(src, arquivo) {
  const mapa = {}; // nome local -> { origem: "ui"|"showcase"|"externo", arquivo, nome }
  const re = /import\s+(type\s+)?([\s\S]*?)\s+from\s+["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src))) {
    if (m[1]) continue;
    const espec = m[2];
    const de = m[3];
    let alvo = null;
    if (de.startsWith(".")) {
      const abs = relative(RAIZ, resolve(join(RAIZ, dirname(arquivo)), de)).split("\\").join("/");
      for (const ext of [".tsx", ".ts", "/index.tsx", "/index.ts", ""]) {
        if (existe(abs + ext) && statSync(join(RAIZ, abs + ext)).isFile()) { alvo = abs + ext; break; }
      }
    } else if (de.startsWith("@/")) {
      const abs = "src/" + de.slice(2);
      for (const ext of [".tsx", ".ts"]) if (existe(abs + ext)) { alvo = abs + ext; break; }
    }
    const origem = !alvo ? "externo" : alvo.startsWith(UI + "/") ? "ui" : alvo.startsWith(SHOWCASE + "/") ? "showcase" : "outro";
    const chaves = espec.match(/\{([\s\S]*)\}/);
    if (chaves) {
      for (const parte of chaves[1].split(",").map((s) => s.trim()).filter(Boolean)) {
        if (parte.startsWith("type ")) continue;
        const [orig, alias] = parte.split(/\s+as\s+/).map((s) => s.trim());
        mapa[alias || orig] = { origem, arquivo: alvo, nome: orig };
      }
    }
    const padrao = espec.replace(/\{[\s\S]*\}/, "").replace(/,/g, " ").trim();
    if (padrao && !padrao.startsWith("*")) mapa[padrao] = { origem, arquivo: alvo, nome: "default" };
  }
  return mapa;
}

/* ════════════════════════════════════════════════════════════════════════════
   1. Menu e páginas (App.tsx)
   ════════════════════════════════════════════════════════════════════════════ */
const app = ler("src/app/App.tsx");
const ptLabels = {};
{
  const bloco = app.match(/const ptLabels[^{]*\{([\s\S]*?)\n\};/);
  if (bloco) for (const m of bloco[1].matchAll(/"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g)) ptLabels[m[1]] = m[2];
}
const pt = (rotulo) => ptLabels[rotulo] ?? rotulo;

const paginas = []; // { id, rotulo, grupo, itens: [{ id, rotulo }] }
const paginaPorId = {};
const itemDoMenu = {}; // âncora -> { pagina, rotulo }
{
  const navIni = app.indexOf("const navGroups");
  const navFim = navIni >= 0 ? app.indexOf("\n];", navIni) : -1;
  const nav = navIni >= 0 ? app.slice(navIni, navFim) : "";
  let grupo = "";
  const re = /group:\s*"([^"]+)"|\{\s*id:\s*"([^"]+)",\s*label:\s*"([^"]+)",\s*(icon|sectionId):\s*"?([\w-]+)"?/g;
  let m;
  while ((m = re.exec(nav))) {
    if (m[1]) { grupo = pt(m[1]); continue; }
    if (m[4] === "icon") {
      const p = { id: m[2], rotulo: pt(m[3]), grupo, itens: [] };
      paginas.push(p);
      paginaPorId[p.id] = p;
    } else {
      const p = paginaPorId[m[5]];
      if (p && !p.itens.some((i) => i.id === m[2])) p.itens.push({ id: m[2], rotulo: pt(m[3]) });
      if (!itemDoMenu[m[2]]) itemDoMenu[m[2]] = { pagina: m[5], rotulo: pt(m[3]) };
    }
  }
}
const ordemDaPagina = (id) => { const k = paginas.findIndex((p) => p.id === id); return k < 0 ? 999 : k; };
const rotuloDaPagina = (id) => paginaPorId[id]?.rotulo ?? id;

// Qual componente de página monta cada página: sectionComponents e o encadeamento activeSection === "x" ? <Comp.
const paginasDoComponente = {}; // NomeDoComponente -> [{ pagina, parte }]
{
  const bloco = app.match(/const sectionComponents[^{]*\{([\s\S]*?)\n\};/);
  const add = (comp, pagina, parte) => (paginasDoComponente[comp] ??= []).push({ pagina, parte: parte || null });
  if (bloco) for (const m of bloco[1].matchAll(/["']?([\w-]+)["']?\s*:\s*<(\w+)([^>]*)\/>/g)) add(m[2], m[1], (m[3].match(/parte="(\w+)"/) || [])[1]);
  for (const m of app.matchAll(/===\s*"([\w-]+)"\s*\?\s*<(\w+)/g)) add(m[2], m[1]);
}

/* ════════════════════════════════════════════════════════════════════════════
   2. Componentes de ui/
   ════════════════════════════════════════════════════════════════════════════ */
// Descrições do catálogo do site (CatalogoShowcase), usadas quando o arquivo não tem comentário de abertura.
const descricaoDoSite = {};
if (existe(`${SHOWCASE}/CatalogoShowcase.tsx`)) {
  const c = ler(`${SHOWCASE}/CatalogoShowcase.tsx`);
  for (const m of c.matchAll(/\{\s*nome:\s*"([\w-]+)",\s*en:\s*"((?:[^"\\]|\\.)*)",\s*pt:\s*"((?:[^"\\]|\\.)*)"/g)) descricaoDoSite[m[1]] = m[3];
}

function propsDaAssinatura(src, def) {
  const trecho = src.slice(def.inicio, Math.min(def.fim, def.inicio + 1500));
  // Primeiro parâmetro desestruturado: ({ a, b = 1, ...props }
  const k = trecho.search(/\(\s*\{/);
  const fimNome = trecho.indexOf(def.nome) + def.nome.length;
  if (k >= 0 && k < 400) {
    const abre = trecho.indexOf("{", k);
    const fecha = fimDoBloco(trecho, abre);
    const nomes = dividirNivelZero(trecho.slice(abre + 1, fecha))
      .filter((p) => !p.startsWith("..."))
      .map((p) => p.split(/[=:]/)[0].trim())
      .filter((p) => /^[A-Za-z_$][\w$]*$/.test(p));
    if (nomes.length) return nomes;
  }
  // (props: TipoProps) -> campos do tipo no mesmo arquivo
  const tipo = trecho.slice(fimNome, fimNome + 300).match(/\(\s*\w+\s*:\s*([A-Z]\w*)/);
  if (tipo) {
    const re = new RegExp(`(?:type|interface)\\s+${tipo[1]}\\b[^={]*=?\\s*[^{]*\\{`);
    const m = re.exec(src);
    if (m) {
      const abre = m.index + m[0].length - 1;
      const corpo = mascararComentarios(src.slice(abre + 1, fimDoBloco(src, abre)));
      const nomes = dividirNivelZero(corpo.replace(/;\s*/g, ",")).map((p) => p.match(/^([A-Za-z_$][\w$]*)\??\s*:/)).filter(Boolean).map((x) => x[1]);
      if (nomes.length) return nomes;
    }
  }
  return [];
}

function variantesCva(src) {
  const out = {};
  for (const m of src.matchAll(/variants:\s*\{/g)) {
    const abre = m.index + m[0].length - 1;
    const corpo = src.slice(abre + 1, fimDoBloco(src, abre));
    let j = 0;
    while (j < corpo.length) {
      const r = /([A-Za-z_$][\w$]*)\s*:\s*\{/g;
      r.lastIndex = j;
      const mm = r.exec(corpo);
      if (!mm) break;
      const a = mm.index + mm[0].length - 1;
      const f = fimDoBloco(corpo, a);
      const interno = corpo.slice(a + 1, f);
      const valores = dividirNivelZero(interno).map((p) => p.match(/^["']?([\w-]+)["']?\s*:/)).filter(Boolean).map((x) => x[1]);
      if (valores.length) out[mm[1]] = valores;
      j = f + 1;
    }
  }
  return out;
}

const componentes = []; // por arquivo
const exportDoUi = {}; // "arquivo#Nome" -> registro do export
for (const arquivo of listarArquivos(UI, (n) => /\.(tsx|ts)$/.test(n))) {
  const src = ler(arquivo);
  const nomeArquivo = basename(arquivo).replace(/\.(tsx|ts)$/, "");
  const defs = definicoes(src);
  const defPorNome = Object.fromEntries(defs.map((d) => [d.nome, d]));

  // Comentário de abertura: o primeiro comentário de nível 0 depois dos imports.
  const ultimoImport = [...src.matchAll(/^import[\s\S]*?from\s+["'][^"']+["'];?\s*$|^import\s+["'][^"']+["'];?\s*$/gm)].pop();
  const depois = ultimoImport ? ultimoImport.index + ultimoImport[0].length : 0;
  const resto = src.slice(depois);
  const mc = resto.match(/^\s*(\/\*[\s\S]*?\*\/|(?:[ \t]*\/\/.*\n)+)/);
  let quandoUsar = mc ? limparComentario(mc[1]) : "";
  if (!quandoUsar && defs[0]) quandoUsar = comentarioAntes(src, defs[0].inicio);
  if (/^(eslint|@ts-|prettier)/.test(quandoUsar)) quandoUsar = "";
  const fonteDescricao = quandoUsar ? "comentário do arquivo" : descricaoDoSite[nomeArquivo] ? "catálogo do site" : null;
  if (!quandoUsar) quandoUsar = descricaoDoSite[nomeArquivo] || "";

  // Exports
  const nomes = new Map(); // nome exportado -> { local, reexport }
  const tipos = [];
  for (const d of defs) {
    if (!d.exportado) continue;
    if (d.tipo === "type" || d.tipo === "interface") tipos.push(d.nome);
    else nomes.set(d.nome, { local: d.nome });
  }
  for (const m of src.matchAll(/^export\s+(type\s+)?\{([^}]*)\}(\s*from\s*["']([^"']+)["'])?/gm)) {
    for (const parte of m[2].split(",").map((s) => s.trim()).filter(Boolean)) {
      const ehTipo = !!m[1] || parte.startsWith("type ");
      const [orig, alias] = parte.replace(/^type\s+/, "").split(/\s+as\s+/).map((s) => s.trim());
      if (ehTipo) tipos.push(alias || orig);
      else nomes.set(alias || orig, { local: orig, reexport: m[4] || null });
    }
  }
  const mDefault = src.match(/^export\s+default\s+(?:function\s+)?([A-Za-z_$][\w$]*)/m);
  if (mDefault && !nomes.has(mDefault[1])) nomes.set(mDefault[1], { local: mDefault[1], padrao: true });

  const variantes = variantesCva(src);
  const exportsDoArquivo = [...nomes.entries()]
    .map(([nome, info]) => {
      const d = defPorNome[info.local];
      const ehComponente = /^[A-Z][a-z0-9]/.test(nome) || /^[A-Z]$/.test(nome);
      const doc = d ? comentarioAntes(src, d.inicio) : "";
      return {
        nome,
        tipo: ehComponente && (!d || d.tipo === "function" || temJSX(src, d.inicio, d.fim) || /forwardRef|memo\(/.test(src.slice(d.inicio, d.inicio + 200))) ? "componente" : "utilitário",
        linha: d ? d.linha : null,
        descricao: doc && doc !== quandoUsar ? resumir(doc, 240) : "",
        props: d && ehComponente ? propsDaAssinatura(src, d) : [],
        reexportaDe: info.reexport || null,
      };
    })
    .sort((a, b) => (a.linha ?? 1e9) - (b.linha ?? 1e9) || ordenar(a.nome, b.nome));

  const registro = {
    arquivo,
    nome: nomeArquivo,
    quandoUsar: resumir(quandoUsar, 420),
    fonteDescricao,
    exports: exportsDoArquivo,
    tipos: [...new Set(tipos)].sort(ordenar),
    variantes,
    ondeVer: [],
  };
  componentes.push(registro);
  for (const e of exportsDoArquivo) exportDoUi[`${arquivo}#${e.nome}`] = { comp: registro, exp: e };
}
componentes.sort((a, b) => ordenar(a.nome, b.nome));

/* ════════════════════════════════════════════════════════════════════════════
   3. Páginas de demonstração: âncoras, componentes locais e o que cada um usa
   ════════════════════════════════════════════════════════════════════════════ */
// Peças da própria documentação (títulos, rótulos, tabelas de spec, molduras): não são padrões de produto.
const ANDAIMES = new Set(CONFIG.andaimes);

const arquivosShowcase = listarArquivos(SHOWCASE, (n) => n.endsWith(".tsx"));
const fontes = {}; // arquivo -> { src, mascarado, defs, imports }
for (const arquivo of arquivosShowcase) {
  const src = ler(arquivo);
  const mascarado = mascararComentarios(src);
  fontes[arquivo] = { src, mascarado, defs: definicoes(mascarado), imports: imports(mascarado, arquivo) };
}

// Página de cada arquivo: direto pelo App ou herdada de quem importa o arquivo.
const paginasDoArquivo = {};
for (const [arquivo, f] of Object.entries(fontes)) {
  for (const d of f.defs) for (const p of paginasDoComponente[d.nome] || []) if (d.exportado) (paginasDoArquivo[arquivo] ??= []).push(p);
}
for (let volta = 0; volta < 4; volta++) {
  for (const [arquivo, f] of Object.entries(fontes)) {
    for (const imp of Object.values(f.imports)) {
      if (imp.origem !== "showcase" || !paginasDoArquivo[arquivo]) continue;
      if (!paginasDoArquivo[imp.arquivo]) paginasDoArquivo[imp.arquivo] = paginasDoArquivo[arquivo].map((p) => ({ pagina: p.pagina, parte: null }));
    }
  }
}

// Componentes locais (funções que devolvem JSX) de cada arquivo de demonstração.
const locais = {}; // "arquivo#Nome" -> registro
for (const [arquivo, f] of Object.entries(fontes)) {
  for (const d of f.defs) {
    if (!/^[A-Z]/.test(d.nome) || d.tipo === "type" || d.tipo === "interface" || d.tipo === "class" || d.tipo === "enum") continue;
    const cabeca = f.mascarado.slice(d.inicio, Math.min(d.fim, d.inicio + 400));
    const ehFuncao = d.tipo === "function" || /=\s*(\([^)]*\)|[A-Za-z_$][\w$]*)\s*(:[^=]+)?=>|=\s*(React\.)?(forwardRef|memo)\b|=\s*function\b|:\s*React\.FC/.test(cabeca);
    if (!ehFuncao || !temJSX(f.mascarado, d.inicio, d.fim)) continue;
    locais[`${arquivo}#${d.nome}`] = { arquivo, nome: d.nome, linha: d.linha, inicio: d.inicio, fim: d.fim, exportado: d.exportado, doc: comentarioAntes(f.src, d.inicio) };
  }
}

function resolverNome(arquivo, nome) {
  const f = fontes[arquivo];
  const local = locais[`${arquivo}#${nome}`];
  if (local) return { tipo: "local", chave: `${arquivo}#${nome}` };
  const imp = f.imports[nome];
  if (!imp) return null;
  if (imp.origem === "ui") {
    // Segue reexportações simples (export { X } from "./y")
    let chave = `${imp.arquivo}#${imp.nome}`;
    if (exportDoUi[chave]) return { tipo: "ui", chave };
    return null;
  }
  if (imp.origem === "showcase") {
    const chave = `${imp.arquivo}#${imp.nome}`;
    if (locais[chave]) return { tipo: "local", chave };
  }
  return null;
}
const ehDoDS = (arquivo) => (nome) => resolverNome(arquivo, nome)?.tipo === "ui";

// Âncoras: <section id="x">, componentes da documentação com id="x" (PageSection, Parte...) e itens do menu.
const ancoras = []; // { id, arquivo, pagina, titulo, inicio, fim, linha }
for (const [arquivo, f] of Object.entries(fontes)) {
  const s = f.mascarado;
  const brutas = [];
  for (const m of s.matchAll(/<([A-Za-z][\w$.]*)\s[^<>]*?\bid=(?:"([\w-]+)"|\{\s*"([\w-]+)"\s*\})/g)) {
    // Garante que o id pertence a esta tag (sem atravessar outra tag).
    const tagNome = m[1];
    const id = m[2] || m[3];
    const { fim: fimAbertura, autoFechada } = fimDaTag(s, m.index);
    if (m.index + m[0].length > fimAbertura + 1) continue;
    const ehSecao = tagNome === "section";
    const ehDocumentacao = /^[A-Z]/.test(tagNome) && resolverNome(arquivo, tagNome)?.tipo === "local";
    if (!ehSecao && !ehDocumentacao && !itemDoMenu[id]) continue;
    // Só dentro de componentes (descarta exemplos de código em textos).
    if (!Object.values(locais).some((l) => l.arquivo === arquivo && l.inicio <= m.index && m.index < l.fim)) continue;
    let fim;
    if (autoFechada) fim = null;
    else {
      const re = new RegExp(`<${tagNome.replace(".", "\\.")}(?=[\\s>])|</${tagNome.replace(".", "\\.")}>`, "g");
      re.lastIndex = m.index;
      let prof = 0, mm;
      fim = s.length;
      while ((mm = re.exec(s))) {
        if (mm[0].startsWith("</")) { prof--; if (prof === 0) { fim = mm.index + mm[0].length; break; } }
        else if (!fimDaTag(s, mm.index).autoFechada) prof++;
      }
    }
    const tag = s.slice(m.index, fimAbertura + 1);
    brutas.push({ id, arquivo, tagNome, inicio: m.index, fimAbertura, fim, tag });
  }
  brutas.sort((a, b) => a.inicio - b.inicio);
  for (let k = 0; k < brutas.length; k++) {
    const a = brutas[k];
    const dono = Object.values(locais).find((l) => l.arquivo === arquivo && l.inicio <= a.inicio && a.inicio < l.fim);
    if (a.fim === null) a.fim = Math.min(brutas[k + 1]?.inicio ?? dono.fim, dono.fim);
    // Título: item do menu; senão o title da própria tag; senão o SectionHeader/h2/h3 logo no começo.
    const inicioDoCorpo = s.slice(a.fimAbertura + 1, Math.min(a.fim, a.fimAbertura + 1600));
    let titulo = itemDoMenu[a.id]?.rotulo || textoPt(atributo(a.tag, "title")) || textoPt(atributo(a.tag, "titulo"));
    if (!titulo) {
      const sh = inicioDoCorpo.match(/<(SectionHeader|TemplateLabel|PageHeader|Titulo\w*)\s[\s\S]*?(\/>|>)/);
      if (sh) titulo = textoPt(atributo(sh[0], "title")) || textoPt(atributo(sh[0], "label")) || textoPt(atributo(sh[0], "titulo"));
    }
    if (!titulo) {
      const h = inicioDoCorpo.match(/<h[234][^>]*>\s*([^<{]+?)\s*</) || inicioDoCorpo.match(/<h[234][^>]*>\s*\{\s*t\(\s*"[^"]*"\s*,\s*"([^"]*)"\s*\)\s*\}/);
      if (h) titulo = h[1].trim();
    }
    // Página: menu; senão a parte do arquivo (FeedbackShowcase parte="rotulos"); senão a página do arquivo.
    let pagina = itemDoMenu[a.id]?.pagina || null;
    if (!pagina) {
      const opcoes = paginasDoArquivo[arquivo] || [];
      if (opcoes.length > 1) {
        const partes = [...s.slice(0, a.inicio).matchAll(/parte\s*===\s*"(\w+)"/g)];
        const parte = partes.length ? partes[partes.length - 1][1] : null;
        pagina = (opcoes.find((o) => o.parte === parte) || opcoes[0]).pagina;
      } else if (opcoes.length) pagina = opcoes[0].pagina;
    }
    ancoras.push({ id: a.id, arquivo, pagina, titulo: titulo || null, inicio: a.inicio, fim: a.fim, linha: linhaDe(s, a.inicio) });
  }
}
// Uma âncora aparece uma vez (a primeira, na ordem dos arquivos).
const vistas = new Set();
for (let k = ancoras.length - 1; k >= 0; k--) {} // (mantém a ordem; duplicatas tratadas abaixo)
const ancorasUnicas = [];
for (const a of ancoras.sort((x, y) => ordenar(x.arquivo, y.arquivo) || x.inicio - y.inicio)) {
  const chave = `${a.pagina}#${a.id}`;
  if (vistas.has(chave)) continue;
  vistas.add(chave);
  ancorasUnicas.push(a);
}

// O que cada âncora usa diretamente (sem contar as âncoras de dentro) e por meio dos componentes locais.
function usosDiretos(arquivo, ini, fim, excluir = []) {
  const s = fontes[arquivo].mascarado;
  const out = [];
  for (const t of tagsDeComponente(s, ini, fim)) {
    if (excluir.some(([a, b]) => a <= t.pos && t.pos < b)) continue;
    const r = resolverNome(arquivo, t.nome);
    if (r) out.push(r);
  }
  // Componentes e funções de ui/ usados sem tag (toast(), buttonVariants, listas exportadas...).
  const nomesUi = Object.entries(fontes[arquivo].imports).filter(([, i]) => i.origem === "ui").map(([n]) => n);
  if (nomesUi.length) {
    const re = new RegExp(`(?<![\\w$.<])(${nomesUi.map((n) => n.replace(/\$/g, "\\$")).join("|")})(?![\\w$])`, "g");
    re.lastIndex = ini;
    let m;
    while ((m = re.exec(s)) && m.index < fim) {
      if (excluir.some(([a, b]) => a <= m.index && m.index < b)) continue;
      const r = resolverNome(arquivo, m[1]);
      if (r) out.push(r);
    }
  }
  return out;
}
const cacheLocal = {};
function fechoDoLocal(chave, pilha = new Set()) {
  if (cacheLocal[chave]) return cacheLocal[chave];
  if (pilha.has(chave)) return { ui: new Set(), locais: new Set() };
  pilha.add(chave);
  const l = locais[chave];
  const ui = new Set(), loc = new Set();
  for (const r of usosDiretos(l.arquivo, l.inicio, l.fim)) {
    if (r.tipo === "ui") ui.add(r.chave);
    else if (r.chave !== chave) {
      loc.add(r.chave);
      const sub = fechoDoLocal(r.chave, pilha);
      sub.ui.forEach((x) => ui.add(x));
      sub.locais.forEach((x) => loc.add(x));
    }
  }
  pilha.delete(chave);
  return (cacheLocal[chave] = { ui, locais: loc });
}
for (const l of Object.values(locais)) {
  l.feitosAMao = elementosFeitosAMao(fontes[l.arquivo].mascarado, l.inicio, l.fim, ehDoDS(l.arquivo));
  l.usaDiretoUi = new Set(usosDiretos(l.arquivo, l.inicio, l.fim).filter((r) => r.tipo === "ui").map((r) => r.chave));
}

for (const a of ancorasUnicas) {
  const internas = ancorasUnicas.filter((b) => b !== a && b.arquivo === a.arquivo && b.inicio > a.inicio && b.inicio < a.fim).map((b) => [b.inicio, b.fim]);
  const diretos = usosDiretos(a.arquivo, a.inicio, a.fim, internas);
  a.uiDireto = new Set();
  a.ui = new Set();
  a.locais = new Set();
  for (const r of diretos) {
    if (r.tipo === "ui") { a.uiDireto.add(r.chave); a.ui.add(r.chave); }
    else {
      a.locais.add(r.chave);
      const sub = fechoDoLocal(r.chave);
      sub.ui.forEach((x) => a.ui.add(x));
      sub.locais.forEach((x) => a.locais.add(x));
    }
  }
  // Marcação feita à mão no próprio corpo da seção (fora das seções de dentro).
  let n = 0;
  const s = fontes[a.arquivo].mascarado;
  let cursor = a.inicio;
  for (const [ii, ff] of [...internas, [a.fim, a.fim]].sort((x, y) => x[0] - y[0])) {
    if (ii > cursor) n += elementosFeitosAMao(s, cursor, ii, ehDoDS(a.arquivo));
    cursor = Math.max(cursor, ff);
  }
  a.feitosAMao = n;
}

// Fora das seções: o que o componente da página usa fora de qualquer âncora (por exemplo, diálogos abertos por um botão).
const componentesDePaginaSet = new Set(Object.keys(paginasDoComponente));
const foraDasSecoes = [];
for (const l of Object.values(locais)) {
  if (!componentesDePaginaSet.has(l.nome) || !l.exportado) continue;
  for (const p of paginasDoComponente[l.nome]) {
    const internas = ancorasUnicas.filter((b) => b.arquivo === l.arquivo && b.inicio >= l.inicio && b.inicio < l.fim).map((b) => [b.inicio, b.fim]);
    const a = { id: null, arquivo: l.arquivo, pagina: p.pagina, titulo: null, inicio: l.inicio, fim: l.fim, linha: l.linha, ui: new Set(), uiDireto: new Set(), locais: new Set() };
    for (const r of usosDiretos(l.arquivo, l.inicio, l.fim, internas)) {
      if (r.tipo === "ui") { a.uiDireto.add(r.chave); a.ui.add(r.chave); }
      else { a.locais.add(r.chave); const sub = fechoDoLocal(r.chave); sub.ui.forEach((x) => a.ui.add(x)); sub.locais.forEach((x) => a.locais.add(x)); }
    }
    foraDasSecoes.push(a);
  }
}

const refAncora = (a) => ({ pagina: a.pagina, paginaRotulo: rotuloDaPagina(a.pagina), ancora: a.id, titulo: a.titulo, arquivo: a.arquivo, linha: a.linha });
const ordenarAncoras = (x, y) => ordemDaPagina(x.pagina) - ordemDaPagina(y.pagina) || ordenar(x.arquivo, y.arquivo) || x.linha - y.linha;

// Onde cada componente de ui/ aparece. Primeiro as seções que falam dele (nome no id ou no título), depois uso direto, depois indireto.
for (const c of componentes) {
  const chaves = c.exports.map((e) => `${c.arquivo}#${e.nome}`);
  const nomesNorm = [normalizar(c.nome), ...c.exports.filter((e) => e.tipo === "componente").map((e) => normalizar(e.nome))];
  const lista = [];
  for (const a of ancorasUnicas) {
    if (!a.pagina) continue;
    const direto = chaves.some((k) => a.uiDireto.has(k));
    const indireto = !direto && chaves.some((k) => a.ui.has(k));
    if (!direto && !indireto) continue;
    const alvo = normalizar(a.id) + "|" + normalizar(a.titulo || "");
    const fala = nomesNorm.some((n) => n.length > 2 && alvo.includes(n));
    const exportsUsados = c.exports.filter((e) => a.ui.has(`${c.arquivo}#${e.nome}`)).map((e) => e.nome);
    lista.push({ ...refAncora(a), relevancia: fala ? 0 : direto ? 1 : 2, uso: direto ? "direto" : "dentro de outro exemplo", exports: exportsUsados });
  }
  for (const a of foraDasSecoes) {
    if (lista.some((x) => x.pagina === a.pagina)) continue;
    if (!chaves.some((k) => a.ui.has(k))) continue;
    const direto = chaves.some((k) => a.uiDireto.has(k));
    lista.push({ ...refAncora(a), relevancia: 3, uso: direto ? "na página, fora das seções" : "na página, dentro de outro exemplo", exports: c.exports.filter((e) => a.ui.has(`${c.arquivo}#${e.nome}`)).map((e) => e.nome) });
  }
  lista.sort((x, y) => x.relevancia - y.relevancia || ordenarAncoras(x, y));
  c.ondeVer = lista;
}

/* Padrões só em demonstração: componentes locais com marcação feita à mão (ou templates), fora dos andaimes e das páginas. */
const componentesDePagina = new Set(Object.keys(paginasDoComponente));
const padroes = [];
for (const [chave, l] of Object.entries(locais)) {
  if (ANDAIMES.has(l.nome) || componentesDePagina.has(l.nome)) continue;
  if (l.arquivo === `${SHOWCASE}/CatalogoShowcase.tsx`) continue;
  const ehTemplate = /Template$|^Template(?!Label|Frame)/.test(l.nome);
  if (l.feitosAMao === 0 && !ehTemplate) continue; // só monta componentes do DS: não é padrão novo
  // Componente que só agrupa seções da página (tem âncoras dentro): as seções já aparecem em 2.4.
  const secoesDentro = ancorasUnicas.filter((a) => a.pagina && a.arquivo === l.arquivo && a.inicio >= l.inicio && a.inicio < l.fim);
  if (secoesDentro.length && !ehTemplate) continue;
  const onde = ancorasUnicas.filter((a) => a.pagina && a.locais.has(chave)).map(refAncora).sort(ordenarAncoras);
  // Quando aparece em muitas seções, a primeira que fala dele vem antes.
  const n = normalizar(l.nome);
  onde.sort((x, y) => (normalizar(x.ancora + (x.titulo || "")).includes(n) ? 0 : 1) - (normalizar(y.ancora + (y.titulo || "")).includes(n) ? 0 : 1));
  const paginaArquivo = (paginasDoArquivo[l.arquivo] || [])[0]?.pagina || null;
  const sub = fechoDoLocal(chave);
  const paginaFinal = onde[0]?.pagina || paginaArquivo;
  const grupo = paginaPorId[paginaFinal]?.grupo || "";
  padroes.push({
    nome: l.nome,
    tipo: ehTemplate ? "template" : CONFIG.gruposDeProduto.includes(grupo) ? "padrão de componente" : "demonstração de conceito",
    arquivo: l.arquivo,
    linha: l.linha,
    descricao: resumir(l.doc, 240),
    pagina: onde[0]?.pagina || paginaArquivo,
    paginaRotulo: rotuloDaPagina(onde[0]?.pagina || paginaArquivo),
    onde,
    usaComponentes: [...sub.ui].filter((k) => exportDoUi[k].exp.tipo === "componente").map((k) => exportDoUi[k].exp.nome).filter((v, i, a) => a.indexOf(v) === i).sort(ordenar),
    elementosFeitosAMao: l.feitosAMao,
  });
}
padroes.sort((a, b) => ordemDaPagina(a.pagina) - ordemDaPagina(b.pagina) || ordenar(a.arquivo, b.arquivo) || a.linha - b.linha);

// Seções com marcação feita à mão no próprio corpo (sem componente local).
const LIMITE_SECAO = 3;
const secoesAMao = ancorasUnicas
  .filter((a) => a.pagina && a.feitosAMao >= LIMITE_SECAO)
  .map((a) => ({ ...refAncora(a), elementosFeitosAMao: a.feitosAMao, usaComponentes: [...a.uiDireto].filter((k) => exportDoUi[k].exp.tipo === "componente").map((k) => exportDoUi[k].exp.nome).filter((v, i, x) => x.indexOf(v) === i).sort(ordenar) }))
  .sort(ordenarAncoras);

/* ════════════════════════════════════════════════════════════════════════════
   4. Tokens (theme.css)
   ════════════════════════════════════════════════════════════════════════════ */
const css = ler("src/styles/theme.css");
function blocosDe(seletorRe) {
  const out = [];
  let prof = 0, iniBloco = -1, atual = null, k = 0, cabecalho = "";
  // Percorre só o nível 0 (fora de @media), guardando blocos cujo seletor casa.
  const cssSemComent = css;
  while (k < cssSemComent.length) {
    const c = cssSemComent[k];
    if (c === "/" && cssSemComent[k + 1] === "*") { const f = cssSemComent.indexOf("*/", k + 2); k = f < 0 ? cssSemComent.length : f + 2; continue; }
    if (c === "{") {
      if (prof === 0) {
        const sel = cssSemComent.slice(cabecalho ? cabecalho : 0, k).replace(/\/\*[\s\S]*?\*\//g, "").split(/[;}]/).pop().trim();
        if (seletorRe.test(sel)) { atual = sel; iniBloco = k + 1; }
      }
      prof++;
    } else if (c === "}") {
      prof--;
      if (prof === 0) {
        if (atual !== null) out.push(cssSemComent.slice(iniBloco, k));
        atual = null;
        cabecalho = k + 1;
      }
    }
    k++;
  }
  return out;
}
function declaracoes(bloco) {
  const out = [];
  let grupo = "";
  const linhas = bloco.split("\n");
  for (let n = 0; n < linhas.length; n++) {
    const l = linhas[n];
    const g = l.match(/^\s*\/\*\s*──\s*(.+?)\s*(──\s*)?(\*\/)?\s*$/);
    if (g) grupo = g[1].replace(/\s*──.*$/, "");
    for (const m of l.matchAll(/(--[\w-]+)\s*:\s*([^;]+);(\s*\/\*\s*(.*?)\s*(\*\/|$))?/g)) {
      out.push({ nome: m[1], valor: m[2].trim(), comentario: (m[4] || "").trim(), grupoCss: grupo });
    }
  }
  return out;
}
const claro = new Map();
for (const b of blocosDe(/^:root$/)) for (const d of declaracoes(b)) if (!claro.has(d.nome)) claro.set(d.nome, d);
const escuro = new Map();
for (const b of blocosDe(/^\.dark$/)) for (const d of declaracoes(b)) if (!escuro.has(d.nome)) escuro.set(d.nome, d);
const temaInline = new Map();
for (const m of css.matchAll(/@theme inline\s*\{([\s\S]*?)\n\}/g)) for (const d of declaracoes(m[1])) temaInline.set(d.nome, d);

const resolverVar = (valor, mapa = claro, prof = 0) => {
  const m = valor.match(/^var\((--[\w-]+)\)$/);
  if (!m || prof > 4) return valor;
  const alvo = mapa.get(m[1]) || claro.get(m[1]);
  return alvo ? resolverVar(alvo.valor, mapa, prof + 1) : valor;
};
const mostrarValor = (valor, mapa) => {
  const m = valor.match(/^var\((--[\w-]+)\)$/);
  if (!m) return valor;
  const final = resolverVar(valor, mapa);
  return final !== valor ? `${m[1]} (${final})` : m[1];
};

const GRUPOS = [
  ["escalas", "Escalas de cor (primitivas)", (n) => /^--[a-z]+-\d{2,3}$/.test(n) && !/^--(space|grid|content|section)-/.test(n)],
  ["marca", "Cores da marca (atalhos)", (n) => n.startsWith("--brand-")],
  ["graficos", "Gráficos", (n) => n.startsWith("--chart-")],
  ["menu", "Menu lateral (sidebar)", (n) => n.startsWith("--sidebar")],
  ["tipografia", "Tipografia", (n) => n.startsWith("--font")],
  ["raio", "Raio", (n) => n.startsWith("--radius")],
  ["sombra", "Sombras", (n) => n.startsWith("--shadow")],
  ["espaco", "Espaçamento, grid e larguras", (n) => /^--(space|grid|content|section)-/.test(n) || n === "--grid-columns"],
  ["movimento", "Movimento", (n) => /^--(duration|ease)/.test(n)],
  ["semanticas", "Cores semânticas (use estas no código)", () => true],
];
const tokens = Object.fromEntries(GRUPOS.map(([id]) => [id, []]));
for (const [nome, d] of claro) {
  const [id] = GRUPOS.find(([, , f]) => f(nome));
  const e = escuro.get(nome);
  tokens[id].push({ nome, claro: d.valor, escuro: e && e.valor !== d.valor ? e.valor : null, papel: d.comentario || (e?.comentario ?? ""), grupoCss: d.grupoCss });
}
// Tokens que só existem no tema escuro
for (const [nome, e] of escuro) if (!claro.has(nome)) { const [id] = GRUPOS.find(([, , f]) => f(nome)); tokens[id].push({ nome, claro: null, escuro: e.valor, papel: e.comentario, grupoCss: "" }); }
// Raio do Tailwind (@theme inline)
for (const [nome, d] of temaInline) if (nome.startsWith("--radius-")) tokens.raio.push({ nome, claro: d.valor, escuro: null, papel: "classe rounded-" + nome.slice(9), grupoCss: "@theme inline" });

// Escala tipográfica (@layer base)
const escalaTipografica = [];
{
  const base = css.match(/@layer base\s*\{([\s\S]*?)\n\}/);
  if (base) {
    for (const m of base[1].matchAll(/^\s*([a-z0-9][\w\s,.:>-]*?)\s*\{([^}]*)\}/gm)) {
      const props = Object.fromEntries([...m[2].matchAll(/([\w-]+)\s*:\s*([^;]+);/g)].map((x) => [x[1], x[2].trim()]));
      if (!props["font-size"] && !props["font-weight"]) continue;
      escalaTipografica.push({ seletor: m[1].replace(/\s+/g, " "), tamanho: props["font-size"] || null, peso: props["font-weight"] || null, alturaDaLinha: props["line-height"] || null, fonte: props["font-family"] || null });
    }
  }
}
const totalTokens = Object.values(tokens).reduce((s, l) => s + l.length, 0);

/* ════════════════════════════════════════════════════════════════════════════
   5. Regras de uso e propostas
   ════════════════════════════════════════════════════════════════════════════ */
const ancoraPorId = Object.fromEntries(ancorasUnicas.map((a) => [a.id, a]));
const regras = CONFIG.regras
  .filter(([id]) => ancoraPorId[id] || itemDoMenu[id])
  .map(([id, resumo]) => { const a = ancoraPorId[id]; return { ancora: id, pagina: a?.pagina || itemDoMenu[id].pagina, paginaRotulo: rotuloDaPagina(a?.pagina || itemDoMenu[id].pagina), titulo: a?.titulo || itemDoMenu[id]?.rotulo || id, resumo, arquivo: a?.arquivo || null, linha: a?.linha || null }; });
const RE_REGRA = /(^|-)(uso|usage|evitar|guidelines|regras|rules|escolher|checklist|hierarchy|principal|nunca)(-|$)/;
const outrasRegras = ancorasUnicas
  .filter((a) => a.pagina && RE_REGRA.test(a.id) && !CONFIG.regras.some(([id]) => id === a.id))
  .map(refAncora)
  .sort(ordenarAncoras);

const propostas = listarArquivos("propostas", (n) => n.endsWith(".md") && n.toLowerCase() !== "readme.md").map((arquivo) => {
  const t = ler(arquivo);
  const titulo = (t.match(/^#\s+(.+)$/m) || [])[1]?.trim() || basename(arquivo, ".md");
  const status = (t.match(/^\s*(?:[-*]\s*)?\*{0,2}Status\*{0,2}\s*:\s*\*{0,2}\s*(.+?)\s*$/im) || [])[1]?.replace(/\*+/g, "").trim() || "sem status";
  const componente = (t.match(/^\s*(?:[-*]\s*)?\*{0,2}Componente\*{0,2}\s*:\s*\*{0,2}\s*(.+?)\s*$/im) || [])[1]?.replace(/[*`]+/g, "").trim() || null;
  return { arquivo, titulo, status, componente };
});

/* ════════════════════════════════════════════════════════════════════════════
   6. Saída
   ════════════════════════════════════════════════════════════════════════════ */
const totalExports = componentes.reduce((s, c) => s + c.exports.filter((e) => e.tipo === "componente").length, 0);
const semDemo = componentes.filter((c) => c.ondeVer.length === 0);

const json = {
  designSystem: CONFIG.nome,
  repositorio: CONFIG.repositorio,
  site: CONFIG.site,
  geradoPor: "scripts/gerar-catalogo.mjs",
  regra: CONFIG.regraCurta,
  resumo: {
    arquivosDeComponentes: componentes.length,
    componentesExportados: totalExports,
    templatesEPadroesSoEmDemonstracao: padroes.length,
    secoesComMarcacaoAMao: secoesAMao.length,
    tokens: totalTokens,
    paginas: paginas.length,
    ancoras: ancorasUnicas.filter((a) => a.pagina).length,
    propostas: propostas.length,
  },
  componentes: componentes.map((c) => ({ ...c, ondeVer: c.ondeVer.map(({ relevancia, ...r }) => r) })),
  padroesSoEmDemonstracao: padroes,
  secoesComMarcacaoAMao: secoesAMao,
  tokens: { ...tokens, escalaTipografica },
  regras: { essenciais: regras, outras: outrasRegras, arquivos: CONFIG.arquivosDeRegras },
  propostas,
  paginas: paginas.map((p) => ({
    id: p.id,
    rotulo: p.rotulo,
    grupo: p.grupo,
    ancoras: ancorasUnicas.filter((a) => a.pagina === p.id).sort(ordenarAncoras).map((a) => ({ id: a.id, titulo: a.titulo, arquivo: a.arquivo, linha: a.linha })),
  })),
};

const md = [];
const L = (s = "") => md.push(s);
const link = (arquivo, linha) => `[${arquivo}${linha ? `:${linha}` : ""}](${arquivo}${linha ? `#L${linha}` : ""})`;
const onde = (r) => r.ancora ? `${r.paginaRotulo} › ${r.titulo ? `${r.titulo} ` : ""}(\`${r.pagina}#${r.ancora}\`)` : `${r.paginaRotulo} (\`${r.pagina}\`, fora das seções)`;
const esc = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");

L(`# Catálogo do ${CONFIG.nome}`);
L();
L(`> Gerado automaticamente por \`scripts/gerar-catalogo.mjs\` a cada \`pnpm build\`. **Não edite à mão**: mude o código e rode o build (ou \`node scripts/gerar-catalogo.mjs\`). \`node scripts/gerar-catalogo.mjs --check\` falha se este arquivo estiver desatualizado. Versão para programas: [\`catalogo.json\`](catalogo.json).`);
L();
L(`**A regra:** ${CONFIG.regraCurta}`);
L();
L(`**Resumo:** ${componentes.length} arquivos de componentes em \`${UI}/\` com ${totalExports} componentes exportados · ${padroes.length} templates e padrões ainda só em demonstração · ${secoesAMao.length} seções com marcação feita à mão · ${totalTokens} tokens · ${paginas.length} páginas e ${json.resumo.ancoras} âncoras no site (${CONFIG.site}) · ${propostas.length} propostas de componente.`);
L();
L(`Como procurar: use a busca do editor (Ctrl+F) pelo que a tela precisa (por exemplo "plano", "preço", "card", "alerta", "tabela", "chip"). "Onde ver" leva à página do site e à âncora da seção (\`página#âncora\`); no site, abra a página pelo menu e a seção pelo submenu.`);
L();
L(`## Sumário`);
L();
L(`1. [Componentes importáveis](#1-componentes-importáveis)`);
L(`2. [Padrões ainda só em demonstração (não importáveis)](#2-padrões-ainda-só-em-demonstração-não-importáveis)`);
L(`3. [Tokens](#3-tokens)`);
L(`4. [Regras de uso](#4-regras-de-uso)`);
L(`5. [Propostas de componente](#5-propostas-de-componente)`);
L(`6. [Páginas e âncoras do site](#6-páginas-e-âncoras-do-site)`);
L();

L(`## 1. Componentes importáveis`);
L();
L(`Tudo o que está em \`${UI}/\`. ${CONFIG.importacao}`);
L();
for (const c of componentes) {
  L(`### ${c.nome}`);
  L();
  L(`- **Arquivo:** ${link(c.arquivo)}`);
  if (c.quandoUsar) L(`- **Quando usar:** ${c.quandoUsar}`);
  const comps = c.exports.filter((e) => e.tipo === "componente");
  const utils = c.exports.filter((e) => e.tipo !== "componente");
  if (comps.length) {
    L(`- **Componentes:**`);
    for (const e of comps) L(`  - \`${e.nome}\`${e.props.length ? ` (props: ${e.props.map((p) => `\`${p}\``).join(", ")})` : ""}${e.reexportaDe ? ` — reexportado de \`${e.reexportaDe}\`` : ""}${e.descricao ? `: ${e.descricao}` : ""}`);
  }
  if (utils.length) L(`- **Funções e constantes:** ${utils.map((e) => `\`${e.nome}\``).join(", ")}`);
  const vs = Object.entries(c.variantes);
  if (vs.length) L(`- **Variantes:** ${vs.map(([k, v]) => `\`${k}\` = ${v.map((x) => `\`${x}\``).join(" · ")}`).join("; ")}`);
  if (c.ondeVer.length) {
    const mostra = c.ondeVer.slice(0, 3).map(onde).join(" · ");
    L(`- **Onde ver:** ${mostra}${c.ondeVer.length > 3 ? ` · e mais ${c.ondeVer.length - 3} seções (ver \`catalogo.json\`)` : ""}`);
  } else L(`- **Onde ver:** nenhuma página do site importa este componente (sem demonstração).`);
  L();
}

L(`## 2. Padrões ainda só em demonstração (não importáveis)`);
L();
L(`Templates e padrões que existem **só dentro das páginas de demonstração** (\`${SHOWCASE}/\`) e não são exportados de \`ui/\`. **Use exatamente este visual; se precisar no produto, peça para promover a componente.** Esta lista é o backlog de promoção a componente (seguindo o processo de \`propostas/README.md\`).`);
L();
L(`Como a lista é feita: componentes locais das páginas de demonstração (\`function X(\` ou \`const X = (...) =>\` que devolvem JSX) com elementos de estilo visual feito à mão (borda, fundo, raio ou sombra no \`className\`), mais todos os templates. Ficam de fora as peças da própria documentação (títulos, rótulos, molduras e tabelas de especificação: ${[...ANDAIMES].sort(ordenar).map((n) => `\`${n}\``).join(", ")}) e os componentes que só montam componentes do DS sem estilo próprio. "Marcação à mão" é o número de elementos com estilo visual próprio.`);
L();
const tabelaDePadroes = (lista) => {
  L(`| Padrão | Onde ver | Arquivo | Usa do DS | Marcação à mão |`);
  L(`|---|---|---|---|---|`);
  for (const p of lista) {
    const w = p.onde.length ? onde(p.onde[0]) + (p.onde.length > 1 ? ` (+${p.onde.length - 1})` : "") : `${p.paginaRotulo ?? "fora do menu"}`;
    L(`| \`${p.nome}\`${p.descricao ? `<br>${esc(p.descricao)}` : ""} | ${esc(w)} | ${link(p.arquivo, p.linha)} | ${p.usaComponentes.slice(0, 8).map((x) => `\`${x}\``).join(", ")}${p.usaComponentes.length > 8 ? ` +${p.usaComponentes.length - 8}` : ""} | ${p.elementosFeitosAMao} |`);
  }
  L();
};
const porTipo = (t) => padroes.filter((p) => p.tipo === t);
L(`### 2.1 Templates (${porTipo("template").length})`);
L();
L(`Telas inteiras montadas nas páginas de demonstração. Para uma tela parecida no produto, parta do template (mesma estrutura e as mesmas peças).`);
L();
tabelaDePadroes(porTipo("template"));
L(`### 2.2 Padrões nas páginas de componentes (${porTipo("padrão de componente").length})`);
L();
L(`Peças de interface (cards, painéis, menus, controles) desenhadas à mão dentro das páginas de componentes. São as primeiras candidatas a virar componente.`);
L();
tabelaDePadroes(porTipo("padrão de componente"));
L(`### 2.3 Demonstrações nas páginas de fundamentos e diretrizes (${porTipo("demonstração de conceito").length})`);
L();
L(`Exemplos que ilustram uma regra (usabilidade, acessibilidade, movimento, marca, tokens). Normalmente não vão para o produto como estão; servem de referência de comportamento.`);
L();
tabelaDePadroes(porTipo("demonstração de conceito"));
L(`### 2.4 Seções com marcação feita à mão no próprio corpo (${secoesAMao.length})`);
L();
L(`Seções que montam peças direto na página, sem componente local, com ${LIMITE_SECAO} ou mais elementos de estilo próprio. Antes de copiar uma delas, confira se a peça já existe na seção 1.`);
L();
L(`| Seção | Arquivo | Usa do DS | Marcação à mão |`);
L(`|---|---|---|---|`);
for (const s of secoesAMao) L(`| ${esc(onde(s))} | ${link(s.arquivo, s.linha)} | ${s.usaComponentes.slice(0, 8).map((x) => `\`${x}\``).join(", ")}${s.usaComponentes.length > 8 ? ` +${s.usaComponentes.length - 8}` : ""} | ${s.elementosFeitosAMao} |`);
L();

L(`## 3. Tokens`);
L();
L(`Todos em [src/styles/theme.css](src/styles/theme.css). No código, use sempre o token (classe do Tailwind ou \`var(--token)\`), nunca o valor solto. ${CONFIG.notaTokens}`);
L();
const PAPEIS = ["--primary", "--primary-hover", "--primary-foreground", "--primary-destaque", "--primary-text", "--primary-muted", "--primary-muted-foreground", "--ring"];
const papeis = PAPEIS.map((n) => tokens.semanticas.find((t) => t.nome === n)).filter(Boolean);
if (papeis.length) {
  L(`**Cor principal: qual token usar** (claro → escuro)`);
  L();
  for (const t of papeis) L(`- \`${t.nome}\`: \`${esc(mostrarValor(t.claro, claro))}\`${t.escuro ? ` → \`${esc(mostrarValor(t.escuro, escuro))}\`` : ""}${t.papel ? ` — ${esc(t.papel)}` : ""}`);
  L();
}
L(`### 3.1 ${GRUPOS.find((g) => g[0] === "escalas")[1]}`);
L();
L(`Primitivas: servem de base para os tokens semânticos. Em componentes, prefira os semânticos (3.2).`);
L();
const escalas = {};
for (const t of tokens.escalas) { const [, nome, passo] = t.nome.match(/^--([a-z]+)-(\d+)$/); (escalas[nome] ??= []).push({ passo, valor: t.claro, papel: t.papel }); }
for (const [nome, passos] of Object.entries(escalas)) {
  L(`- **${nome}:** ${passos.map((p) => `${p.passo} \`${p.valor}\``).join(" · ")}`);
  for (const p of passos.filter((x) => x.papel)) L(`  - \`--${nome}-${p.passo}\`: ${p.papel}`);
}
L();
L(`### 3.2 ${GRUPOS.find((g) => g[0] === "semanticas")[1]}`);
L();
L(`| Token | Claro | Escuro | Papel |`);
L(`|---|---|---|---|`);
for (const t of tokens.semanticas) L(`| \`${t.nome}\` | ${t.claro ? `\`${esc(mostrarValor(t.claro, claro))}\`` : "—"} | ${t.escuro ? `\`${esc(mostrarValor(t.escuro, escuro))}\`` : "igual"} | ${esc(t.papel)} |`);
L();
let secaoTok = 3;
for (const [id, titulo] of GRUPOS) {
  if (id === "escalas" || id === "semanticas" || !tokens[id].length) continue;
  L(`### 3.${secaoTok++} ${titulo}`);
  L();
  for (const t of tokens[id]) L(`- \`${t.nome}\`: \`${esc(mostrarValor(t.claro ?? t.escuro, claro))}\`${t.escuro && t.claro ? ` (escuro: \`${esc(mostrarValor(t.escuro, escuro))}\`)` : ""}${t.papel ? ` — ${esc(t.papel)}` : ""}`);
  L();
}
if (escalaTipografica.length) {
  L(`### 3.${secaoTok++} Escala tipográfica (estilos base)`);
  L();
  L(`| Elemento | Tamanho | Peso | Altura da linha |`);
  L(`|---|---|---|---|`);
  for (const e of escalaTipografica) L(`| \`${esc(e.seletor)}\` | ${e.tamanho ?? "—"} | ${e.peso ?? "—"} | ${e.alturaDaLinha ?? "—"} |`);
  L();
}

L(`## 4. Regras de uso`);
L();
L(`Regras documentadas no site. Antes de montar uma tela, leia as que valem para ela.`);
L();
for (const r of regras) L(`- **${r.resumo}** — ${onde(r)}${r.arquivo ? ` · ${link(r.arquivo, r.linha)}` : ""}`);
L();
L(`Regras de trabalho do repositório: ${CONFIG.arquivosDeRegras.map((a) => `[\`${a}\`](${a})`).join(", ")}.`);
L();
if (outrasRegras.length) {
  L(`Outras seções de uso, cuidados e checklists:`);
  L();
  for (const r of outrasRegras) L(`- ${onde(r)}`);
  L();
}

L(`## 5. Propostas de componente`);
L();
L(`Peças novas pedidas por um produto, no processo de [\`propostas/README.md\`](propostas/README.md).`);
L();
if (propostas.length) {
  L(`| Proposta | Componente | Status |`);
  L(`|---|---|---|`);
  for (const p of propostas) L(`| [${esc(p.titulo)}](${p.arquivo}) | ${p.componente ? `\`${esc(p.componente)}\`` : "—"} | ${esc(p.status)} |`);
} else L(`Nenhuma proposta registrada.`);
L();

L(`## 6. Páginas e âncoras do site`);
L();
for (const p of json.paginas) {
  if (!p.ancoras.length) { L(`- **${p.rotulo}** (\`${p.id}\`)`); continue; }
  L(`- **${p.rotulo}** (\`${p.id}\`): ${p.ancoras.map((a) => `\`${a.id}\`${a.titulo ? ` ${a.titulo}` : ""}`).join(" · ")}`);
}
L();

const saidaMd = md.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
const saidaJson = JSON.stringify(json, null, 2) + "\n";

const alvos = [["CATALOGO.md", saidaMd], ["catalogo.json", saidaJson]];
if (process.argv.includes("--check")) {
  const velhos = alvos.filter(([f, c]) => !existe(f) || ler(f) !== c).map(([f]) => f);
  if (velhos.length) {
    console.error(`Catálogo desatualizado: ${velhos.join(", ")}. Rode "node scripts/gerar-catalogo.mjs" (ou "pnpm build") e faça o commit.`);
    process.exit(1);
  }
  console.log(`Catálogo em dia (${componentes.length} arquivos, ${totalExports} componentes, ${padroes.length} padrões só em demonstração, ${totalTokens} tokens).`);
} else {
  for (const [f, c] of alvos) if (!existe(f) || ler(f) !== c) writeFileSync(join(RAIZ, f), c);
  console.log(`Catálogo gerado: ${componentes.length} arquivos, ${totalExports} componentes, ${padroes.length} padrões só em demonstração, ${secoesAMao.length} seções à mão, ${totalTokens} tokens.`);
}

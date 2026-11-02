// Gerador das texturas doodle dos dois design systems.
// Uso: LUCIDE=<caminho de node_modules/lucide-react> node scripts/gerar-texturas.mjs
// Escreve public/texturas/*.svg nos dois repositórios (caminhos no fim do arquivo); os PNG são renderizados à parte com Playwright.
// Gera as texturas doodle (tile SVG sem emenda) para os dois design systems.
import fs from "node:fs";
import path from "node:path";
const LUCIDE = process.env.LUCIDE;
function lucide(name) {
  const src = fs.readFileSync(path.join(LUCIDE, "dist/esm/icons", name + ".js"), "utf8");
  const m = src.match(/const __iconNode = (\[[\s\S]*?\]);\nconst /);
  if (!m) throw new Error("iconNode não encontrado: " + name);
  return new Function("return " + m[1])();
}
const P = (d) => ["path", { d }];
const C = (cx, cy, r) => ["circle", { cx, cy, r }];
// ── ícones próprios (viewBox 24, traço 2, estilo lucide) ──
const custom = {
  // estúdio
  "duplo-diamante": [P("M3 12l4.5-6 4.5 6-4.5 6z"), P("M12 12l4.5-6 4.5 6-4.5 6z")],
  "jornada": [P("M3 19c4-9 6-9 9-4s5 5 9-4"), C(3, 19, 1.5), C(12, 13, 1.5), C(21, 11, 1.5)],
  "wireframe": [P("M3 4h18v16H3z"), P("M3 9h18"), P("M7 13h6"), P("M7 16h10")],
  "persona": [P("M3 3h18v18H3z"), C(12, 10, 3), P("M7 18c1-3 3-4 5-4s4 1 5 4")],
  "post-it": [P("M4 4h16v12l-4 4H4z"), P("M16 20v-4h4"), P("M8 9h8"), P("M8 13h5")],
  "post-its": [P("M3 7h10v10H3z"), P("M7 3h10v10"), P("M11 11h10v10H11z")],
  "teste-ab": [P("M3 5h7v14H3z"), P("M14 5h7v14h-7z"), P("M5 14l1.5 1.5L9 12"), P("M16 11l3 3m0-3-3 3")],
  "balao-ideia": [P("M4 4h16v11H9l-5 4z"), P("M12 7v3"), P("M10.5 12h3")],
  "fluxo": [P("M4 4h5v4H4z"), P("M15 4h5v4h-5z"), P("M9.5 14h5v4h-5z"), P("M6.5 8v3h11V8"), P("M12 11v3")],
  "protótipo": [P("M7 2h10v20H7z"), P("M9 6h6"), P("M9 10h6v5H9z"), P("M11 19h2")],
  "cursor-botao": [P("M4 6h12v6H4z"), P("M13 11l6 7 1.5-2.5L23 15z")],
  "mapa-empatia": [C(12, 12, 9), P("M12 3v18"), P("M3 12h18"), C(12, 12, 2)],
  "checklist": [P("M4 6l1.5 1.5L8 5"), P("M11 6h9"), P("M4 12l1.5 1.5L8 11"), P("M11 12h9"), P("M4 18l1.5 1.5L8 17"), P("M11 18h9")],
  // moda
  "cabide": [P("M12 3a2 2 0 0 1 2 2c0 1.5-2 1.7-2 3.5V10"), P("M12 10 3.4 15.7A1.6 1.6 0 0 0 4.3 18.6h15.4a1.6 1.6 0 0 0 .9-2.9z")],
  "calca": [P("M7 3h10l1 18h-5l-1-9-1 9H6z"), P("M7 7h10")],
  "saia": [P("M8 4h8l4 17H4z"), P("M8 4c0 1.2 2 1.5 4 1.5s4-.3 4-1.5"), P("M10 9l-1 12"), P("M14 9l1 12")],
  "cropped": [P("M6 4l3-1c1 1.5 2 2 3 2s2-.5 3-2l3 1v4l-2 1v4H8V9L6 8z"), P("M8 13h8")],
  "vestido": [P("M9 2h1.5L12 5l1.5-3H15l1 5-2 3 5 11H5l5-11-2-3z")],
  "salto": [P("M3 19h18v2H3z"), P("M21 19c0-4-5-6-9-5l-6 1-2 4"), P("M15 12l3-6 2.5 1.2L18 13"), P("M7 19v-3.5")],
  "anel": [C(12, 15, 5), P("M12 10 9 7l1-3h4l1 3z"), P("M10 4l2 3 2-3")],
  "colar": [P("M5 3c0 7 3 11 7 11s7-4 7-11"), P("M12 14v2l-2 2 2 2 2-2-2-2")],
  "brinco": [P("M12 2c-1.2 0-2 .8-2 2s2 2 2 4"), P("M12 8l-3.5 5a3.5 3.5 0 0 0 7 0z")],
  "bolsa": [P("M6 9h12l1.2 11H4.8z"), P("M9 9V7a3 3 0 0 1 6 0v2"), P("M10 13h4")],
  "chapeu": [P("M3 16c0-1.2 4-2 9-2s9 .8 9 2-4 2-9 2-9-.8-9-2z"), P("M7 15V9a5 5 0 0 1 10 0v6")],
  "bota": [P("M8 3h6v10l4 3v3H5v-3l3-2z"), P("M8 13h6"), P("M5 19h13")],
  "tenis": [P("M3 17c0-3 2-4 5-5l4-3c2 2 4 3 8 3 1 0 1 1 1 3v2H3z"), P("M8 17v-3"), P("M11 17v-4"), P("M3 17h18"), P("M9 11l1.5 1.5"), P("M11 9.5l1.5 1.5")],
  "batom": [P("M9 21h6v-7H9z"), P("M10 14V8l2-5 2 5v6")],
  "perfume": [P("M8 21h8l1-9H7z"), P("M10 12V9h4v3"), P("M10 6h4v3h-4z"), P("M14 7h3")],
  "laco": [P("M12 12 4 7v10z"), P("M12 12l8-5v10z"), P("M10.5 10.5h3v3h-3z")],
  "shorts": [P("M6 4h12l1 11h-6l-1-5-1 5H5z"), P("M6 8h12")],
  "gravata": [P("M10 3h4l-1 4 2 11-3 3-3-3 2-11z")],
  "jaqueta": [P("M9 3h6l4 2v14h-4v-7l-3 2-3-2v7H5V5z"), P("M12 7v3"), P("M9 3c1 2 2 3 3 3s2-1 3-3")],
  "cinto": [P("M3 12h18"), P("M3 10v4"), P("M21 10v4"), P("M9 9h6v6H9z"), P("M12 9v6")],
  "meia": [P("M9 3h6v9l3 3a4 4 0 0 1-6 5l-3-3z"), P("M9 7h6")],
  "biquini": [P("M4 8c2 4 5 6 8 6s6-2 8-6"), P("M4 8l1 7h4l3-1 3 1h4l1-7"), P("M12 3v3")],
  "pulseira": [["ellipse", { cx: 12, cy: 13, rx: 8, ry: 5 }], C(4.5, 11.5, 1), C(19.5, 11.5, 1), C(12, 18, 1)],
  "oculos-sol": [P("M2 10h20"), P("M3 10l1 5a3 3 0 0 0 3 2h1a3 3 0 0 0 3-2.5V10"), P("M21 10l-1 5a3 3 0 0 1-3 2h-1a3 3 0 0 1-3-2.5V10"), P("M11 12h2")],
  "clutch": [P("M3 8h18v10H3z"), P("M3 12h18"), C(12, 12, 1.5)],
  "bone": [P("M4 14a7 7 0 0 1 14 0v1"), P("M3 15h15c2.6 0 4.6 1 4.6 2.2S20.6 19.2 18 19.2H4a1 1 0 0 1-1-1z"), P("M11 7V5.5"), P("M11 10v5")],
  "sandalia": [P("M9 2c3.3 0 5.5 3.2 5.5 8.5S13 22 9 22s-5.5-6.2-5.5-11.5S5.7 2 9 2z"), P("M9 8.5 5.5 14"), P("M9 8.5l3.5 5.5"), P("M9 8.5V6.5")],
  "camisa": [P("M8 3 4 6v12l4 1v-6h8v6l4-1V6l-4-3"), P("M8 3c1 2 2.5 3 4 3s3-1 4-3"), P("M12 9v5")],
};
const sets = {
  dm: {
    arquivo: "doodle-studio", claro: "#B3BDD0", escuro: "#1C2333", primaria: "#F3B3B3",
    lucide: ["search", "lightbulb", "sticky-note", "users", "user", "route", "map-pin", "mouse-pointer-click", "pencil", "smartphone", "compass", "layers", "message-circle", "brain", "target", "flask-conical", "workflow", "puzzle", "rocket", "eye", "heart", "star", "sparkles", "clipboard-list", "kanban", "layout-template", "pen-tool", "palette", "monitor", "mic", "quote", "chart-column", "trending-up", "footprints", "flag", "timer", "megaphone", "smile", "thumbs-up", "notebook-pen", "toggle-left", "hand", "book-open", "binoculars", "signpost", "milestone", "git-branch", "shapes", "wand-sparkles", "list-checks", "hourglass", "frame", "component"],
    custom: ["duplo-diamante", "jornada", "wireframe", "persona", "post-it", "post-its", "teste-ab", "balao-ideia", "fluxo", "protótipo", "cursor-botao", "mapa-empatia", "checklist"],
  },
  fl: {
    arquivo: "doodle-moda", claro: "#D4D4D9", escuro: "#2B2B31", primaria: "#F8BCC6",
    lucide: ["shirt", "glasses", "watch", "gem", "crown", "scissors", "ruler", "tag", "shopping-bag", "umbrella", "backpack", "heart", "sparkles", "store", "camera", "star", "footprints", "wallet", "gift", "sun", "shopping-cart", "badge-percent"],
    custom: ["cabide", "calca", "saia", "cropped", "vestido", "salto", "anel", "colar", "brinco", "bolsa", "chapeu", "bota", "tenis", "batom", "perfume", "laco", "shorts", "gravata", "jaqueta", "cinto", "meia", "biquini", "pulseira", "oculos-sol", "clutch", "camisa", "bone", "sandalia"],
    // itens obrigatórios (pedido da dona do produto): aparecem com o dobro da frequência
    destaque: ["vestido", "calca", "bone", "oculos-sol", "sandalia", "tenis", "shirt"],
  },
};
// preenchimentos pequenos entre os ícones
const fillers = [[C(12, 12, 1.6)], [P("M12 7v10M7 12h10")], [P("M12 5l1.6 5.4L19 12l-5.4 1.6L12 19l-1.6-5.4L5 12l5.4-1.6z")], [P("M8 15l4-7 4 7z")], [P("M7 12h10")], [C(12, 12, 4)], [P("M6 12c2-4 4-4 6 0s4 4 6 0")]];

function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function renderNode([tag, a]) {
  const attrs = Object.entries(a).filter(([k]) => k !== "key").map(([k, v]) => `${k}="${v}"`).join(" ");
  return `<${tag} ${attrs}/>`;
}
function tile(set, seed) {
  const W = 800, cols = 10, cell = W / cols, rand = rng(seed);
  const icons = [...set.lucide.map(lucide), ...set.custom.map((n) => custom[n])];
  // itens em destaque entram duas vezes no sorteio
  const nomes = [...set.lucide, ...set.custom];
  for (const n of set.destaque ?? []) { const k = nomes.indexOf(n); if (k < 0) throw new Error("destaque não encontrado: " + n); icons.push(icons[k]); }
  const order = [];
  let pool = [];
  for (let i = 0; i < cols * cols; i++) {
    if (!pool.length) pool = icons.map((_, k) => k).sort(() => rand() - 0.5);
    let k = pool.pop();
    if (order.length && (order[order.length - 1] === k || order[order.length - cols] === k)) { pool.unshift(k); k = pool.pop(); }
    order.push(k);
  }
  let out = "";
  order.forEach((k, i) => {
    const row = Math.floor(i / cols), col = i % cols;
    // linhas alternadas deslocadas meia célula (tijolo) para quebrar a grade; a emenda continua perfeita
    const shift = row % 2 ? cell / 2 : 0;
    let cx = col * cell + cell / 2 + shift + (rand() - 0.5) * 22;
    const cy = row * cell + cell / 2 + (rand() - 0.5) * 22;
    const size = 40 + rand() * 24; // 40–64 px
    const sc = size / 24, rot = (rand() - 0.5) * 70;
    const g = (x) => `<g transform="translate(${x.toFixed(1)} ${cy.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${sc.toFixed(3)}) translate(-12 -12)">${icons[k].map(renderNode).join("")}</g>`;
    out += g(cx);
    // o que ultrapassa a borda direita reaparece à esquerda, mantendo a emenda
    if (cx + size > W) out += g(cx - W);
    if (cx - size < 0) out += g(cx + W);
  });
  for (let i = 0; i < cols * cols; i++) {
    if (rand() < 0.4) continue;
    const f = fillers[Math.floor(rand() * fillers.length)];
    const row = Math.floor(i / cols), col = i % cols;
    const cx = col * cell + (row % 2 ? 0 : cell / 2) + (rand() - 0.5) * 10;
    const cy = row * cell + 4 + (rand() - 0.5) * 8;
    const sc = (10 + rand() * 8) / 24;
    const g = (x, y) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((rand() - 0.5) * 60).toFixed(1)}) scale(${sc.toFixed(3)}) translate(-12 -12)">${f.map(renderNode).join("")}</g>`;
    out += g(cx, cy);
    if (cx < 12) out += g(cx + W, cy);
    if (cx > W - 12) out += g(cx - W, cy);
    if (cy < 12) out += g(cx, cy + W);
  }
  return { W, body: out, total: icons.length };
}
function svg({ W, body }, stroke, opacity) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${W}" viewBox="0 0 ${W} ${W}" fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">\n${body}\n</svg>\n`;
}
const repos = { dm: "/home/user/danimoscatelli-designsystem", fl: "/home/user/findlook-designsystem" };
for (const [key, set] of Object.entries(sets)) {
  const t = tile(set, key === "dm" ? 20261101 : 20261102);
  const dir = path.join(repos[key], "public/texturas"); fs.mkdirSync(dir, { recursive: true });
  const files = {
    [`${set.arquivo}-claro.svg`]: svg(t, set.claro, 1),
    [`${set.arquivo}-escuro.svg`]: svg(t, set.escuro, 1),
    [`${set.arquivo}-primaria.svg`]: svg(t, set.primaria, 1),
    [`${set.arquivo}-traco.svg`]: svg(t, "currentColor", 1),
  };
  for (const [n, c] of Object.entries(files)) fs.writeFileSync(path.join(dir, n), c);
  console.log(key, set.arquivo, "ícones distintos:", t.total, "| arquivos:", Object.keys(files).join(", "), "| tamanho:", Math.round(files[`${set.arquivo}-claro.svg`].length / 1024) + " KB");
}

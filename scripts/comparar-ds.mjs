#!/usr/bin/env node
/**
 * comparar-ds.mjs — compara os componentes de ui/ deste design system com os do outro DS (FindLook × Dani Moscatelli).
 *
 * Para cada arquivo de src/app/components/ui/ que existe nos dois, lista:
 *   - os componentes exportados (nomes com inicial maiúscula) que só um dos dois tem;
 *   - para cada componente que os dois têm, as props que só um dos dois aceita.
 * As props vêm do tipo do primeiro parâmetro do componente (o TypeScript lê o tipo; as props herdadas de elementos
 * HTML ou do React ficam de fora, só contam as declaradas no próprio DS).
 *
 * Uso: node scripts/comparar-ds.mjs <pasta-do-outro-ds> [--md arquivo.md] [--json arquivo.json] [--ignorar arquivo.json]
 * Precisa do pacote "typescript" (do projeto ou global; ou passe o caminho em TYPESCRIPT_PATH).
 * --ignorar: lista de diferenças de marca aceitas, no formato { "arquivo#Componente": ["prop", ...], "arquivo": ["Export", ...] }.
 * Sai com código 1 se houver diferença que não esteja na lista de marca.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const aqui = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opc = (n) => { const i = args.indexOf(n); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v; };
const saidaMd = opc("--md"); const saidaJson = opc("--json"); const ignorarArq = opc("--ignorar");
const outro = args[0] && path.resolve(args[0]);
if (!outro || !fs.existsSync(path.join(outro, "src/app/components/ui"))) {
  console.error("Uso: node scripts/comparar-ds.mjs <pasta-do-outro-ds> [--md saida.md] [--json saida.json] [--ignorar marca.json]");
  process.exit(2);
}

function carregarTs() {
  const tentativas = [process.env.TYPESCRIPT_PATH, path.join(aqui, "node_modules/typescript"), "typescript", "/opt/node-tools/node_modules/typescript", "/usr/local/lib/node_modules/typescript", "/usr/lib/node_modules/typescript"].filter(Boolean);
  const req = createRequire(path.join(aqui, "package.json"));
  for (const t of tentativas) { try { return req(t); } catch {} }
  console.error("Não achei o pacote typescript. Rode com TYPESCRIPT_PATH=/caminho/para/node_modules/typescript ou instale-o (npm i -D typescript).");
  process.exit(2);
}
const ts = carregarTs();

// Tipos do React (para as props herdadas saírem do tipo, e não virarem "any"): node_modules/@types/react, ou a cópia
// do pnpm em node_modules/.pnpm.
function tiposDoReact(raiz) {
  const nm = path.join(raiz, "node_modules");
  const direto = path.join(nm, "@types/react");
  if (fs.existsSync(path.join(direto, "index.d.ts"))) return direto;
  try {
    const pn = fs.readdirSync(path.join(nm, ".pnpm")).filter((d) => d.startsWith("@types+react@")).sort().pop();
    if (pn) return path.join(nm, ".pnpm", pn, "node_modules/@types/react");
  } catch {}
  return null;
}

function lerDs(raiz) {
  const pasta = path.join(raiz, "src/app/components/ui");
  const arquivos = fs.readdirSync(pasta).filter((f) => /\.tsx?$/.test(f)).map((f) => path.join(pasta, f));
  const programa = ts.createProgram(arquivos, {
    jsx: ts.JsxEmit.Preserve, noEmit: true, skipLibCheck: true, allowJs: false, strict: false,
    target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler ?? ts.ModuleResolutionKind.NodeJs,
    baseUrl: raiz, noResolve: false, types: [],
    paths: { "@/*": ["src/*"], ...(tiposDoReact(raiz) ? { react: [tiposDoReact(raiz)], "react/*": [tiposDoReact(raiz) + "/*"] } : {}) },
  });
  const ch = programa.getTypeChecker();
  const res = {};
  for (const arq of arquivos) {
    const sf = programa.getSourceFile(arq); if (!sf) continue;
    const mod = ch.getSymbolAtLocation(sf); if (!mod) continue;
    const comps = {};
    for (const exp of ch.getExportsOfModule(mod)) {
      const nome = exp.getName();
      if (!/^[A-Z]/.test(nome)) continue;
      let sym = exp; if (sym.flags & ts.SymbolFlags.Alias) sym = ch.getAliasedSymbol(sym);
      if (!(sym.flags & (ts.SymbolFlags.Function | ts.SymbolFlags.Variable))) continue;
      const decl = sym.valueDeclaration ?? sym.declarations?.[0]; if (!decl) continue;
      const tipo = ch.getTypeOfSymbolAtLocation(sym, decl);
      const assinaturas = tipo.getCallSignatures();
      if (!assinaturas.length) continue;
      const props = new Set();
      for (const a of assinaturas) {
        const p0 = a.getParameters()[0]; if (!p0) continue;
        const tp = ch.getTypeOfSymbolAtLocation(p0, p0.valueDeclaration ?? decl);
        for (const pr of ch.getApparentType(tp).getProperties()) {
          const ds = pr.declarations ?? [];
          if (ds.some((d) => d.getSourceFile().fileName.includes("/components/ui/"))) props.add(pr.getName());
        }
      }
      // Só funções que parecem componentes: retornam JSX ou recebem props (ignora utilitários exportados com maiúscula).
      const retorno = ch.typeToString(assinaturas[0].getReturnType());
      if (!props.size && !/Element|ReactNode|ReactElement|any/.test(retorno)) continue;
      comps[nome] = [...props].sort();
    }
    res[path.basename(arq)] = comps;
  }
  return res;
}

const nomeDs = (r) => { try { return JSON.parse(fs.readFileSync(path.join(r, "catalogo.json"), "utf8")).designSystem; } catch { return path.basename(r); } };
const A = lerDs(aqui), B = lerDs(outro);
const nA = nomeDs(aqui), nB = nomeDs(outro);
const marca = ignorarArq ? JSON.parse(fs.readFileSync(ignorarArq, "utf8")) : {};
const comuns = Object.keys(A).filter((f) => B[f]).sort();
const linhas = []; let pendentes = 0;
for (const f of comuns) {
  const ca = A[f], cb = B[f];
  const soA = Object.keys(ca).filter((c) => !cb[c]), soB = Object.keys(cb).filter((c) => !ca[c]);
  const aceitosArq = new Set(marca[f] ?? []);
  const difs = [];
  const expA = soA.filter((c) => !aceitosArq.has(c)), expB = soB.filter((c) => !aceitosArq.has(c));
  if (expA.length || expB.length) difs.push({ componente: "(exports)", soAqui: expA, soNoOutro: expB });
  for (const c of Object.keys(ca).filter((c) => cb[c]).sort()) {
    const aceitas = new Set(marca[`${f}#${c}`] ?? []);
    const pa = ca[c].filter((p) => !cb[c].includes(p) && !aceitas.has(p));
    const pb = cb[c].filter((p) => !ca[c].includes(p) && !aceitas.has(p));
    if (pa.length || pb.length) difs.push({ componente: c, soAqui: pa, soNoOutro: pb });
  }
  pendentes += difs.length;
  linhas.push({ arquivo: f, componentes: Object.keys(ca).filter((c) => cb[c]).length, igual: difs.length === 0, difs });
}
const soAqui = Object.keys(A).filter((f) => !B[f]).sort(), soNoOutro = Object.keys(B).filter((f) => !A[f]).sort();

let md = `# Comparação de componentes: ${nA} × ${nB}\n\nGerado por \`scripts/comparar-ds.mjs\`. ${comuns.length} arquivos de ui/ existem nos dois; ${linhas.filter((l) => l.igual).length} com os mesmos componentes e as mesmas props${Object.keys(marca).length ? " (fora as diferenças de marca listadas)" : ""}.\n\n`;
md += `| Arquivo | Componentes em comum | Resultado |\n|---|---|---|\n`;
for (const l of linhas) {
  const r = l.igual ? "igual" : l.difs.map((d) => `${d.componente}: ${[d.soAqui.length ? `só no ${nA}: ${d.soAqui.join(", ")}` : "", d.soNoOutro.length ? `só no ${nB}: ${d.soNoOutro.join(", ")}` : ""].filter(Boolean).join("; ")}`).join(" · ");
  md += `| ${l.arquivo} | ${l.componentes} | ${r} |\n`;
}
if (Object.keys(marca).length) {
  md += `\n## Diferenças de marca aceitas\n\n| Onde | O quê |\n|---|---|\n`;
  for (const [k, v] of Object.entries(marca)) if (!k.startsWith("_")) md += `| ${k} | ${v.join(", ")} |\n`;
}
md += `\nSó no ${nA} (${soAqui.length}): ${soAqui.join(", ") || "nenhum"}.\n\nSó no ${nB} (${soNoOutro.length}): ${soNoOutro.join(", ") || "nenhum"}.\n`;
if (saidaMd) fs.writeFileSync(saidaMd, md);
if (saidaJson) fs.writeFileSync(saidaJson, JSON.stringify({ comuns: linhas, soAqui, soNoOutro }, null, 2));
console.log(md);
process.exit(pendentes ? 1 : 0);

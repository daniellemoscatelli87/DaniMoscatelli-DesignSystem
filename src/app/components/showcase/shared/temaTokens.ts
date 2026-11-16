// Valores reais dos tokens, lidos do próprio theme.css na hora do build.
// As tabelas de tokens usam estes valores no lugar dos digitados à mão, para nunca ficarem desatualizadas.
import tema from "../../../../styles/theme.css?raw";

type Mapa = Map<string, string>;

function lerBlocos(css: string, seletor: RegExp): Mapa {
  const mapa: Mapa = new Map();
  const semComentarios = css.replace(/\/\*[\s\S]*?\*\//g, "");
  // Só blocos de nível superior (fora de @media), na ordem em que aparecem
  let nivel = 0;
  let i = 0;
  while (i < semComentarios.length) {
    const c = semComentarios[i];
    if (c === "{") nivel++;
    else if (c === "}") nivel--;
    else if (nivel === 0) {
      const resto = semComentarios.slice(i);
      const m = resto.match(/^([^{}]+)\{/);
      if (m) {
        // o seletor é o que vem depois da última declaração solta (ex.: @custom-variant ...;)
        const sel = m[1].split(";").pop()!.trim();
        const inicio = i + m[0].length;
        let fim = inicio, prof = 1;
        while (fim < semComentarios.length && prof > 0) {
          if (semComentarios[fim] === "{") prof++;
          else if (semComentarios[fim] === "}") prof--;
          fim++;
        }
        if (seletor.test(sel)) {
          const corpo = semComentarios.slice(inicio, fim - 1);
          for (const d of corpo.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) mapa.set(d[1], d[2].trim());
        }
        i = fim;
        continue;
      }
    }
    i++;
  }
  return mapa;
}

const claro = lerBlocos(tema, /^:root$/);
const escuro = lerBlocos(tema, /^\.dark$/);

function resolver(valor: string, modo: Mapa, profundidade = 0): string {
  if (profundidade > 8) return valor;
  return valor.replace(/var\((--[\w-]+)(?:\s*,\s*([^)]+))?\)/g, (_, nome: string, reserva?: string) => {
    const v = modo.get(nome) ?? claro.get(nome);
    if (v !== undefined) return resolver(v, modo, profundidade + 1);
    return reserva ? resolver(reserva.trim(), modo, profundidade + 1) : `var(${nome})`;
  });
}

/** Valor real do token no tema claro e no escuro (undefined se o token não existir no theme.css). */
export function valorDoToken(nome: string): { claro: string; escuro: string } | undefined {
  const c = claro.get(nome);
  if (c === undefined) return undefined;
  const e = escuro.get(nome);
  return { claro: resolver(c, claro), escuro: resolver(e ?? c, escuro) };
}

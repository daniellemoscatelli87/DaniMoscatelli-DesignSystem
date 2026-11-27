"use client";

import * as React from "react";
import { Loader2, MapPin } from "lucide-react";
import { cn } from "./utils";
import { Campo, type CampoProps } from "./campo";
import { Input } from "./input";

/**
 * CampoDeEndereco (endereço com sugestões)
 *
 * O campo de endereço que sugere enquanto a pessoa digita, como o "Presencial" do agendamento de reuniões da área
 * restrita (que sugeria endereços do OpenStreetMap e se perdeu na versão em React). Mesmo arquivo e mesma API nos dois
 * DS (27/11/2026).
 *
 * - Quem busca é o produto: `buscar(texto, sinal)` devolve as sugestões ({ id, titulo, linha }). O DS não chama nenhum
 *   serviço sozinho. Para repetir o comportamento da área restrita em HTML, use `buscaNoPhoton()` (o serviço Photon,
 *   com dados do OpenStreetMap, os mesmos parâmetros: 5 resultados, prioridade para a região de Curitiba e só Brasil).
 * - Espera `atraso` (350 ms) depois da última tecla e só busca com `minimo` (3) letras ou mais; cancela a busca anterior.
 * - Estados na lista: procurando (girando, "Procurando endereços…"), sem resultado ("Nenhum endereço encontrado…"),
 *   erro ("Não foi possível buscar agora…"); em todos, a pessoa pode continuar escrevendo o endereço à mão.
 * - Padrão combobox (ARIA 1.2): o campo tem role="combobox", a lista role="listbox"; setas descem e sobem, Enter escolhe,
 *   Esc fecha; a opção ativa fica no cinza do hover (--accent), de ponta a ponta. A quantidade de sugestões é anunciada.
 * - Usa o Campo do DS (rótulo, ajuda, erro, obrigatório, opcional); cada opção tem 44 px de altura no toque.
 */

export type SugestaoDeEndereco = { id: string; titulo: string; linha?: string };

export type CampoDeEnderecoProps = Omit<CampoProps, "children" | "value" | "onChange" | "defaultValue"> & {
  valor: string;
  onValorChange: (valor: string) => void;
  /** Busca as sugestões do texto digitado. Use o sinal para cancelar o pedido (fetch(url, { signal })). */
  buscar: (texto: string, sinal: AbortSignal) => Promise<SugestaoDeEndereco[]>;
  /** Chamado ao escolher uma sugestão (depois de `onValorChange` com o texto completo). */
  onEscolher?: (sugestao: SugestaoDeEndereco) => void;
  /** Espera depois da última tecla, em ms (padrão 350). */
  atraso?: number;
  /** Letras mínimas para buscar (padrão 3). */
  minimo?: number;
  textos?: { procurando?: string; nenhum?: string; erro?: string; sugestoes?: (n: number) => string };
};

const TEXTOS = {
  procurando: "Procurando endereços…",
  nenhum: "Nenhum endereço encontrado. Confira o texto ou escreva o endereço completo.",
  erro: "Não foi possível buscar agora. Escreva o endereço completo.",
  sugestoes: (n: number) => (n === 1 ? "1 sugestão de endereço. Use as setas para escolher." : `${n} sugestões de endereço. Use as setas para escolher.`),
};

/** O texto que vai para o campo ao escolher: título e linha, sem repetir partes. */
export const textoDaSugestao = (s: SugestaoDeEndereco) => [s.titulo, s.linha].filter((x, i, a) => x && a.indexOf(x) === i).join(", ");

function CampoDeEndereco({
  valor, onValorChange, buscar, onEscolher, atraso = 350, minimo = 3, textos, icone, id: idProp, className,
  placeholder, disabled, name, maxLength = 500, autoFocus, ...campo
}: CampoDeEnderecoProps) {
  const tx = { ...TEXTOS, ...textos };
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const idLista = `${id}-sugestoes`;
  const [estado, setEstado] = React.useState<"fechado" | "procurando" | "lista" | "nenhum" | "erro">("fechado");
  const [sugestoes, setSugestoes] = React.useState<SugestaoDeEndereco[]>([]);
  const [ativa, setAtiva] = React.useState(-1);
  const espera = React.useRef<number | undefined>(undefined);
  const pedido = React.useRef<AbortController | null>(null);
  const raiz = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => () => { window.clearTimeout(espera.current); pedido.current?.abort(); }, []);

  const fechar = () => { setEstado("fechado"); setAtiva(-1); };
  const procurar = (texto: string) => {
    window.clearTimeout(espera.current);
    pedido.current?.abort();
    const q = texto.trim();
    if (q.length < minimo) { fechar(); return; }
    espera.current = window.setTimeout(async () => {
      const ctrl = new AbortController();
      pedido.current = ctrl;
      setEstado("procurando");
      try {
        const lista = await buscar(q, ctrl.signal);
        if (ctrl.signal.aborted) return;
        setSugestoes(lista);
        setAtiva(-1);
        setEstado(lista.length ? "lista" : "nenhum");
      } catch (e) {
        if (ctrl.signal.aborted || (e as Error)?.name === "AbortError") return;
        setEstado("erro");
      }
    }, atraso);
  };
  const escolher = (s: SugestaoDeEndereco) => {
    onValorChange(textoDaSugestao(s));
    onEscolher?.(s);
    fechar();
  };
  const aberta = estado !== "fechado";
  const aoTeclar = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && aberta) { e.preventDefault(); fechar(); return; }
    if (estado !== "lista") return;
    if (e.key === "ArrowDown") { e.preventDefault(); setAtiva((a) => (a + 1) % sugestoes.length); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setAtiva((a) => (a <= 0 ? sugestoes.length - 1 : a - 1)); }
    else if (e.key === "Enter" && ativa >= 0) { e.preventDefault(); escolher(sugestoes[ativa]!); }
  };
  const aviso = estado === "procurando" ? tx.procurando : estado === "nenhum" ? tx.nenhum : estado === "erro" ? tx.erro : estado === "lista" ? tx.sugestoes(sugestoes.length) : "";

  return (
    <Campo id={id} classeDoBloco={className} {...campo}>
      {(p) => (
        <div
          ref={raiz}
          className="relative"
          onBlur={(e) => { if (!raiz.current?.contains(e.relatedTarget as Node)) fechar(); }}
        >
          <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground [&>svg]:size-4">{icone ?? <MapPin />}</span>
          <Input
            {...p}
            type="text"
            role="combobox"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={estado === "lista"}
            aria-controls={idLista}
            aria-activedescendant={estado === "lista" && ativa >= 0 ? `${idLista}-${ativa}` : undefined}
            value={valor}
            onChange={(e) => { onValorChange(e.target.value); procurar(e.target.value); }}
            onKeyDown={aoTeclar}
            className={cn("h-10 bg-card pl-10 toque:h-11", estado === "procurando" && "pr-10")}
            placeholder={placeholder}
            disabled={disabled}
            name={name}
            maxLength={maxLength}
            autoFocus={autoFocus}
          />
          {estado === "procurando" && <Loader2 aria-hidden className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground motion-safe:animate-spin" />}
          <ul
            id={idLista}
            role="listbox"
            aria-label={typeof campo.rotulo === "string" ? campo.rotulo : "Sugestões de endereço"}
            hidden={estado !== "lista"}
            className="absolute inset-x-0 top-full z-50 mt-1 max-h-72 list-none overflow-y-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-[var(--shadow-md)] motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-1"
          >
            {sugestoes.map((s, i) => (
              <li
                key={s.id}
                id={`${idLista}-${i}`}
                role="option"
                aria-selected={i === ativa}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => escolher(s)}
                onMouseMove={() => setAtiva(i)}
                className={cn("flex min-h-11 cursor-pointer flex-col justify-center rounded-sm px-3 py-2 text-left", i === ativa && "bg-accent")}
              >
                <span className="text-body-sm font-medium text-foreground">{s.titulo}</span>
                {s.linha && s.linha !== s.titulo && <span className="text-label text-muted-foreground">{s.linha}</span>}
              </li>
            ))}
          </ul>
          {(estado === "procurando" || estado === "nenhum" || estado === "erro") && (
            <p className="absolute inset-x-0 top-full z-50 mt-1 m-0 flex items-start gap-2 rounded-md border border-border bg-popover px-3 py-3 text-body-sm text-muted-foreground shadow-[var(--shadow-md)]">
              {aviso}
            </p>
          )}
          <span className="sr-only" aria-live="polite">{aviso}</span>
        </div>
      )}
    </Campo>
  );
}

/* ── Busca no Photon (OpenStreetMap), igual à área restrita em HTML ── */
const UF: Record<string, string> = { "Acre": "AC", "Alagoas": "AL", "Amapá": "AP", "Amazonas": "AM", "Bahia": "BA", "Ceará": "CE", "Distrito Federal": "DF", "Espírito Santo": "ES", "Goiás": "GO", "Maranhão": "MA", "Mato Grosso": "MT", "Mato Grosso do Sul": "MS", "Minas Gerais": "MG", "Pará": "PA", "Paraíba": "PB", "Paraná": "PR", "Pernambuco": "PE", "Piauí": "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN", "Rio Grande do Sul": "RS", "Rondônia": "RO", "Roraima": "RR", "Santa Catarina": "SC", "São Paulo": "SP", "Sergipe": "SE", "Tocantins": "TO" };
type PropriedadesDoPhoton = { name?: string; street?: string; housenumber?: string; district?: string; city?: string; county?: string; state?: string; postcode?: string; countrycode?: string; osm_id?: number };

/** O título e a linha de um resultado do Photon (o mesmo texto da área restrita em HTML). */
export function enderecoDoPhoton(p: PropriedadesDoPhoton) {
  const rua = [p.street, p.housenumber].filter(Boolean).join(", ");
  const local = p.name && p.name !== p.street ? p.name : "";
  const cidade = [p.city || p.county, (p.state && UF[p.state]) || p.state].filter(Boolean).join(" - ");
  return { titulo: local || rua || cidade, linha: [local && rua, rua || local ? p.district : "", cidade, p.postcode].filter(Boolean).join(", ") };
}

/**
 * Uma função `buscar` pronta, com o serviço Photon (photon.komoot.io, dados do OpenStreetMap): os mesmos parâmetros da
 * área restrita em HTML (até 5 resultados, prioridade para perto de lat/lon, padrão Curitiba, e só o país `pais`).
 * O produto escolhe se usa: o DS não chama o serviço sozinho.
 */
export function buscaNoPhoton({ lat = -25.43, lon = -49.27, limite = 5, pais = "BR" }: { lat?: number; lon?: number; limite?: number; pais?: string } = {}) {
  return async (texto: string, sinal: AbortSignal): Promise<SugestaoDeEndereco[]> => {
    const res = await fetch(`https://photon.komoot.io/api/?limit=${limite}&lat=${lat}&lon=${lon}&q=${encodeURIComponent(texto)}`, { signal: sinal });
    const dados = (await res.json()) as { features?: { properties?: PropriedadesDoPhoton }[] };
    return (dados.features ?? [])
      .filter((f) => !pais || f.properties?.countrycode === pais)
      .map((f, i) => ({ id: String(f.properties?.osm_id ?? i), ...enderecoDoPhoton(f.properties ?? {}) }));
  };
}

export { CampoDeEndereco };

import * as React from "react";
import { cn } from "./utils";

/**
 * LinkDeRedeSocial e GrupoDeRedesSociais (links de redes sociais)
 *
 * A pílula branca de "Me siga nas redes sociais" da página inicial do site (`ih-redes`): o ícone da rede na cor
 * oficial da marca, o texto em --foreground e a sombra suave (--shadow-suave). É um link: abre o perfil da rede.
 * Aprovados pela dona do produto em 28/11/2026.
 *
 * Uma fonte só do desenho: as classes .ds-link-rede-social (+ --md e --<rede>) e .ds-grupo-redes-sociais do
 * theme.css (bloco "@ds-css-puro"). Este componente só monta o HTML com essas classes; as páginas em HTML puro usam
 * as mesmas classes (o HTML pronto sai de htmlDoLinkDeRedeSocial, abaixo).
 *
 * - rede: linkedin · instagram · whatsapp · facebook · youtube · tiktok · behance (escolhe o ícone e a cor).
 * - tamanho: "sm" (padrão, o da referência: 32 px, texto de 12 px) ou "md" (40 px, texto de 14 px). No toque, a área
 *   de toque tem 44 px de altura sem mudar o desenho.
 * - novaAba: abre em nova aba (padrão: sim para link externo, http ou https) e acrescenta "(abre em nova aba)" só
 *   para leitores de tela.
 * - Hover cinza (--accent), a pílula sobe 2 px; foco com o anel --ring; parado com "menos movimento".
 *
 * Ícones: a marca de cada rede, aria-hidden (o nome da rede vem do texto). Instagram e YouTube são os desenhos da
 * Lucide 0.487.0 guardados em ui/icones-preservados (licença ISC); LinkedIn, Facebook e WhatsApp são as marcas cheias
 * que o site já usa (o WhatsApp é o mesmo do BotaoWhatsApp); TikTok e Behance vêm do Simple Icons (CC0). As marcas
 * pertencem aos seus donos e servem só para indicar a rede. Cor oficial de cada marca: exceção da dona do produto
 * (WhatsApp em 19/11/2026; redes e compartilhar em 28/11/2026), só no ícone.
 */

export type RedeSocial = "linkedin" | "instagram" | "whatsapp" | "facebook" | "youtube" | "tiktok" | "behance";

type No = [string, Record<string, string>];
type Marca = { nome: string; contorno?: boolean; nos: No[] };

const MARCAS: Record<RedeSocial, Marca> = {
  linkedin: {
    nome: "LinkedIn",
    nos: [["path", { d: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" }]],
  },
  instagram: {
    nome: "Instagram",
    contorno: true,
    nos: [
      ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5" }],
      ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }],
      ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5" }],
    ],
  },
  whatsapp: {
    nome: "WhatsApp",
    nos: [["path", { d: "M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.5 9.5 0 0 1-4.84-1.33l-.35-.21-3.6.94.96-3.5-.23-.36a9.46 9.46 0 0 1-1.45-5.04c0-5.24 4.27-9.5 9.52-9.5a9.44 9.44 0 0 1 6.72 2.79 9.43 9.43 0 0 1 2.78 6.72c0 5.24-4.27 9.5-9.5 9.5zm8.09-17.59A11.36 11.36 0 0 0 12.05.56C5.75.56.62 5.68.62 11.98c0 2.01.53 3.98 1.53 5.71L.53 23.6l6.06-1.59a11.4 11.4 0 0 0 5.45 1.39h.01c6.3 0 11.43-5.13 11.43-11.43 0-3.05-1.19-5.92-3.35-8.08z" }]],
  },
  facebook: {
    nome: "Facebook",
    nos: [["path", { d: "M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.23 2.68.23v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" }]],
  },
  youtube: {
    nome: "YouTube",
    contorno: true,
    nos: [
      ["path", { d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" }],
      ["path", { d: "m10 15 5-3-5-3z" }],
    ],
  },
  tiktok: {
    nome: "TikTok",
    nos: [["path", { d: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" }]],
  },
  behance: {
    nome: "Behance",
    nos: [["path", { d: "M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z" }]],
  },
};

/** As redes que o DS conhece, na ordem da documentação. */
export const redesSociais = Object.keys(MARCAS) as RedeSocial[];

/** Nome da rede como a marca escreve ("LinkedIn", "YouTube"). */
export function nomeDaRede(rede: RedeSocial) {
  return MARCAS[rede].nome;
}

const AVISO_NOVA_ABA = " (abre em nova aba)";
const ehExterno = (href?: string) => !!href && /^https?:\/\//i.test(href);

function atributosDoSvg(rede: RedeSocial): Record<string, string> {
  const m = MARCAS[rede];
  return m.contorno
    ? { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" }
    : { viewBox: "0 0 24 24", fill: "currentColor" };
}

const paraReact = (a: Record<string, string>) =>
  Object.fromEntries(Object.entries(a).map(([k, v]) => [k.replace(/-([a-z])/g, (_, l) => l.toUpperCase()), v]));

/** O ícone da marca (aria-hidden), na cor oficial quando dentro de .ds-link-rede-social--<rede>. */
export function IconeDeRedeSocial({ rede, className }: { rede: RedeSocial; className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" className={className} {...paraReact(atributosDoSvg(rede))}>
      {MARCAS[rede].nos.map(([tag, attrs], i) => React.createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
}

export type LinkDeRedeSocialProps = Omit<React.ComponentProps<"a">, "href" | "children"> & {
  rede: RedeSocial;
  href: string;
  /** O texto da pílula ("Perfil profissional", "Instagram"). */
  children: React.ReactNode;
  tamanho?: "sm" | "md";
  /** Abrir em nova aba. Padrão: sim para link externo (http ou https). */
  novaAba?: boolean;
};

const classesDoLink = (rede: RedeSocial, tamanho: "sm" | "md") =>
  `ds-link-rede-social ds-link-rede-social--${rede}${tamanho === "md" ? " ds-link-rede-social--md" : ""}`;

function LinkDeRedeSocial({ rede, href, children, tamanho = "sm", novaAba, className, target, rel, ...props }: LinkDeRedeSocialProps) {
  const abreNovaAba = novaAba ?? ehExterno(href);
  return (
    <a
      data-slot="link-de-rede-social"
      data-rede={rede}
      href={href}
      target={abreNovaAba ? "_blank" : target}
      rel={abreNovaAba ? rel ?? "noopener noreferrer" : rel}
      className={cn(classesDoLink(rede, tamanho), className)}
      {...props}
    >
      <IconeDeRedeSocial rede={rede} className="ds-link-rede-social__icone" />
      <span>{children}</span>
      {abreNovaAba && <span className="ds-so-leitor">{AVISO_NOVA_ABA}</span>}
    </a>
  );
}

export type GrupoDeRedesSociaisProps = React.ComponentProps<"ul"> & {
  /** "centro" (padrão, como na página inicial) ou "inicio" (alinhado à esquerda, junto de um texto à esquerda). */
  alinhamento?: "centro" | "inicio";
};

/** Lista dos links: cada LinkDeRedeSocial vira um item; centralizados e quebrando em linhas, 12 px entre eles. */
function GrupoDeRedesSociais({ alinhamento = "centro", className, children, ...props }: GrupoDeRedesSociaisProps) {
  return (
    <ul
      data-slot="grupo-de-redes-sociais"
      className={cn("ds-grupo-redes-sociais", alinhamento === "inicio" && "ds-grupo-redes-sociais--inicio", className)}
      {...props}
    >
      {React.Children.map(children, (filho) => (filho == null || filho === false ? null : <li>{filho}</li>))}
    </ul>
  );
}

const escapar = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** O svg da marca em HTML puro (aria-hidden), com a classe dada: o mesmo desenho do IconeDeRedeSocial. */
export function svgDaRedeSocial(rede: RedeSocial, classe = "ds-link-rede-social__icone") {
  const svgAttrs = Object.entries(atributosDoSvg(rede)).map(([k, v]) => ` ${k}="${v}"`).join("");
  const nos = MARCAS[rede].nos.map(([tag, attrs]) => `<${tag}${Object.entries(attrs).map(([k, v]) => ` ${k}="${v}"`).join("")}/>`).join("");
  return `<svg class="${classe}" aria-hidden="true" focusable="false"${svgAttrs}>${nos}</svg>`;
}

/**
 * O mesmo link em HTML puro, para as páginas que não usam React (as páginas originais do site): mesmas classes,
 * mesmo ícone, mesmo aviso de nova aba. Precisa do bloco "@ds-css-puro" do theme.css na página.
 */
export function htmlDoLinkDeRedeSocial({ rede, href, texto, tamanho = "sm", novaAba }: { rede: RedeSocial; href: string; texto: string; tamanho?: "sm" | "md"; novaAba?: boolean }) {
  const abreNovaAba = novaAba ?? ehExterno(href);
  return (
    `<a class="${classesDoLink(rede, tamanho)}" href="${escapar(href)}"${abreNovaAba ? ' target="_blank" rel="noopener noreferrer"' : ""}>` +
    svgDaRedeSocial(rede) +
    `<span>${escapar(texto)}</span>${abreNovaAba ? `<span class="ds-so-leitor">${AVISO_NOVA_ABA}</span>` : ""}</a>`
  );
}

export { LinkDeRedeSocial, GrupoDeRedesSociais };

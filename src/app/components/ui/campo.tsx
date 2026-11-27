"use client";

import * as React from "react";
import { Eye, EyeOff, XCircle } from "lucide-react";
import { cn } from "./utils";
import { Input } from "./input";
import { Label } from "./label";
import { Alert, AlertDescription, AlertTitle } from "./alert";

/**
 * Campo (o campo padrão do formulário): rótulo, controle, ajuda e erro sempre na mesma ordem e com os mesmos
 * vínculos de acessibilidade. Mesma API do Campo do DS FindLook (decisão de 27/11/2026: um campo só) e serve a todos os
 * formulários: contato, cadastro de parceiro, área restrita, telas de conta.
 *
 * - Sem children: desenha um Input do DS com o resto das props (type, value, onChange, placeholder…).
 * - Com children em função: entrega { id, "aria-invalid", "aria-describedby", required } para outro controle do DS
 *   (Select, Textarea, PasswordInput…):  <Campo rotulo="Mensagem" erro={erro}>{p => <Textarea {...p} />}</Campo>
 * - obrigatorio: acrescenta " *" ao rótulo (o aviso "* Campos obrigatórios" fica no topo do formulário) e required.
 * - Ajuda embaixo; com erro, o erro ocupa o lugar da ajuda (ícone + texto na cor de erro, nunca só a cor). Com
 *   `manterAjudaNoErro`, a ajuda continua, embaixo do erro (decisão de 27/11/2026: o erro primeiro, colado ao campo,
 *   porque é o que a pessoa precisa resolver; a ajuda depois, porque continua valendo).
 * - aria-describedby: o que você passar é somado ao do Campo (erro, ajuda e o seu, nessa ordem), nunca trocado; use
 *   para ligar o conteúdo de `depois` (por exemplo, os requisitos da senha) ao campo.
 * - `opcional` ("(opcional)" depois do rótulo), `acaoDoRotulo` (link curto à direita do rótulo) e, com
 *   type="password", o botão Mostrar senha / Ocultar senha (`textosDaSenha`), com 44 px no toque.
 * Altura do campo: 44 px no toque (variante toque) e 40 px no computador.
 *
 * Também aqui: MensagemDeErro, GradeDeCampos (um campo por linha; dois só quando cada um fica com 240 px ou mais),
 * ResumoDeErros (com 2 erros ou mais) e as máscaras CampoDeTelefone, CampoDeCnpj, mascaraTelefone, mascaraCnpj e
 * cnpjValido (os mesmos do DS Dani Moscatelli).
 */

type PropsDoControle = { id: string; "aria-invalid"?: true; "aria-describedby"?: string; required?: boolean };

export type CampoProps = Omit<React.ComponentProps<typeof Input>, "children"> & {
  rotulo: React.ReactNode;
  ajuda?: React.ReactNode;
  erro?: React.ReactNode | null;
  /** Ícone à esquerda, dentro do campo (16 px). */
  icone?: React.ReactNode;
  obrigatorio?: boolean;
  /** Dentro da GradeDeCampos, ocupa a linha inteira. */
  inteiro?: boolean;
  /** Conteúdo logo abaixo do campo, antes da ajuda (por exemplo, "Não tenho CNPJ"). */
  depois?: React.ReactNode;
  classeDoBloco?: string;
  /** Outro controle do DS no lugar do Input. */
  children?: (props: PropsDoControle) => React.ReactNode;
  /** "(opcional)" depois do rótulo. */
  opcional?: boolean;
  /** Link curto à direita do rótulo ("Esqueci minha senha"). */
  acaoDoRotulo?: React.ReactNode;
  /** Textos do botão da senha (com type="password"). */
  textosDaSenha?: { mostrar: string; ocultar: string };
  /**
   * Com erro, a ajuda continua visível, embaixo do erro (padrão: o erro ocupa o lugar da ajuda). Use quando a ajuda
   * ainda serve para corrigir ("Use pelo menos 8 caracteres", o formato do CNPJ).
   */
  manterAjudaNoErro?: boolean;
};

function Campo({
  rotulo, ajuda, erro, icone, obrigatorio, inteiro, depois, classeDoBloco, className, id: idProp, children, required,
  opcional, acaoDoRotulo, textosDaSenha = { mostrar: "Mostrar senha", ocultar: "Ocultar senha" }, manterAjudaNoErro = false, type,
  "aria-describedby": descritosDeFora, ...props
}: CampoProps) {
  const autoId = React.useId();
  const id = idProp ?? autoId;
  const [visivel, setVisivel] = React.useState(false);
  const senha = type === "password";
  const mostrarAjuda = Boolean(ajuda) && (!erro || manterAjudaNoErro);
  // O aria-describedby de quem usa (por exemplo, os requisitos da senha passados em `depois`) é somado ao do Campo:
  // primeiro o erro, depois a ajuda, depois o de fora.
  const descritores = [erro ? `${id}-erro` : null, mostrarAjuda ? `${id}-ajuda` : null, descritosDeFora].filter(Boolean).join(" ") || undefined;
  const controle: PropsDoControle = { id, "aria-invalid": erro ? true : undefined, "aria-describedby": descritores, required: required ?? obrigatorio };
  return (
    <div data-slot="campo" className={cn("min-w-0 space-y-2", inteiro && "col-span-full", classeDoBloco)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <Label htmlFor={id} className="inline text-body-sm font-semibold leading-snug">
          {rotulo}
          {obrigatorio && <span aria-hidden className="text-primary-text"> *</span>}
          {opcional && <span className="font-normal text-muted-foreground"> (opcional)</span>}
        </Label>
        {acaoDoRotulo && <span className="text-body-sm">{acaoDoRotulo}</span>}
      </div>
      {children ? (
        children(controle)
      ) : (
        <div className="relative">
          {icone && <span aria-hidden className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground [&>svg]:size-4">{icone}</span>}
          <Input
            {...controle}
            type={senha && visivel ? "text" : type}
            className={cn("h-10 bg-card toque:h-11", icone && "pl-10", senha && "pr-12", className)}
            {...props}
          />
          {senha && (
            <button
              type="button"
              onClick={() => setVisivel((v) => !v)}
              aria-pressed={visivel}
              aria-label={visivel ? textosDaSenha.ocultar : textosDaSenha.mostrar}
              aria-controls={id}
              className="absolute right-0 top-0 flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring toque:size-11"
            >
              {visivel ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            </button>
          )}
        </div>
      )}
      {depois}
      {erro && <MensagemDeErro id={`${id}-erro`}>{erro}</MensagemDeErro>}
      {mostrarAjuda && <p id={`${id}-ajuda`} className="m-0 text-body-sm leading-5 text-muted-foreground">{ajuda}</p>}
    </div>
  );
}

/** Texto de erro de um campo ou grupo: ícone + texto na cor de texto do erro (nunca só a cor). */
function MensagemDeErro({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <p id={id} data-slot="mensagem-de-erro" className={cn("m-0 flex items-start gap-2 text-body-sm leading-5 font-medium text-error-text motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1", className)}>
      <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> <span className="min-w-0">{children}</span>
    </p>
  );
}

/** Grade dos campos: um por linha; dois por linha só a partir de 31rem (cada campo com 240 px ou mais). */
function GradeDeCampos({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div data-slot="grade-de-campos" className={cn("@container/campos min-w-0", className)}>
      <div className="grid gap-x-4 gap-y-6 @min-[31rem]/campos:grid-cols-2">{children}</div>
    </div>
  );
}

type ErroDoResumo = { id: string; rotulo: string; mensagem: string };

/** Resumo dos erros (use com 2 erros ou mais): Alerta de erro com um link para cada campo. */
function ResumoDeErros({ erros, titulo, onIrPara, className }: { erros: ErroDoResumo[]; titulo?: string; onIrPara?: (id: string) => void; className?: string }) {
  const ir = (id: string) => {
    if (onIrPara) return onIrPara(id);
    const el = document.getElementById(id);
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  };
  return (
    <Alert variant="error" data-slot="resumo-de-erros" className={className}>
      <XCircle aria-hidden />
      <AlertTitle>{titulo ?? `Confira ${erros.length} campos antes de continuar`}</AlertTitle>
      <AlertDescription>
        <ul className="grid gap-1">
          {erros.map((e) => (
            <li key={e.id}>
              <button type="button" onClick={() => ir(e.id)} className="rounded-sm text-left font-semibold text-error-text underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {e.rotulo}
              </button>
              <span>: {e.mensagem}</span>
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

/* ── Máscaras brasileiras ─────────────────────────────────────── */
const digitos = (v: string) => v.replace(/\D/g, "");

/** (41) 99999-9999 ou (41) 3333-3333, enquanto a pessoa digita. */
function mascaraTelefone(valor: string) {
  const d = digitos(valor).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** 12.345.678/0001-90, enquanto a pessoa digita. */
function mascaraCnpj(valor: string) {
  const d = digitos(valor).slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

/** Confere os dígitos verificadores do CNPJ (só o formato; não consulta a Receita). */
function cnpjValido(valor: string) {
  const d = digitos(valor);
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const calc = (n: number) => {
    const pesos = n === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = pesos.reduce((s, p, i) => s + Number(d[i]) * p, 0);
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(12) === Number(d[12]) && calc(13) === Number(d[13]);
}

type CampoComMascaraProps = Omit<CampoProps, "value" | "onChange" | "children"> & { valor: string; onValorChange: (valor: string) => void };

/** Telefone com DDD; teclado numérico no celular. */
function CampoDeTelefone({ valor, onValorChange, placeholder = "(41) 99999-9999", ...props }: CampoComMascaraProps) {
  return <Campo type="tel" inputMode="tel" autoComplete="tel" placeholder={placeholder} value={valor} onChange={(e) => onValorChange(mascaraTelefone(e.target.value))} {...props} />;
}

/** CNPJ com a máscara; teclado numérico no celular. A validação (cnpjValido) fica a cargo do formulário. */
function CampoDeCnpj({ valor, onValorChange, placeholder = "00.000.000/0000-00", ...props }: CampoComMascaraProps) {
  return <Campo inputMode="numeric" autoComplete="off" placeholder={placeholder} value={valor} onChange={(e) => onValorChange(mascaraCnpj(e.target.value))} {...props} />;
}

export { Campo, MensagemDeErro, GradeDeCampos, ResumoDeErros, CampoDeTelefone, CampoDeCnpj, mascaraTelefone, mascaraCnpj, cnpjValido };
export type { ErroDoResumo, PropsDoControle as PropsDoControleDoCampo };

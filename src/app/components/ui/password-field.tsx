import * as React from "react";
import { Eye, EyeOff, Check, Circle, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "./utils";

/**
 * Campo de senha com confirmação (PasswordField / PasswordConfirm)
 *
 * - Exibir/ocultar senha em cada campo (botão com aria-pressed e rótulo).
 * - Força da senha em 4 barras + rótulo em texto (Fraca, Razoável, Boa, Forte), calculada pelos requisitos atendidos.
 * - Dica de preenchimento: cada requisito ganha um check verde (--success) quando atendido; o ícone muda de forma
 *   (círculo → check) e o leitor de tela ouve "atendido", então a cor nunca é o único sinal.
 * - Confirmação: avisa "As senhas não coincidem" (erro) ou "As senhas coincidem" (sucesso) depois que a pessoa digita.
 */

export type PasswordRule = { id: string; label: string; test: (v: string) => boolean };

export const regrasPadrao: PasswordRule[] = [
  { id: "tamanho", label: "8 caracteres ou mais", test: (v) => v.length >= 8 },
  { id: "caixa", label: "Maiúsculas e minúsculas", test: (v) => /[a-zà-ú]/.test(v) && /[A-ZÀ-Ú]/.test(v) },
  { id: "numero", label: "Pelo menos um número", test: (v) => /\d/.test(v) },
  { id: "simbolo", label: "Um símbolo especial", test: (v) => /[^A-Za-zÀ-ú0-9\s]/.test(v) },
];

export type PasswordTexts = {
  senha: string;
  confirmar: string;
  mostrar: string;
  ocultar: string;
  forca: string;
  niveis: [string, string, string, string, string];
  dicaTitulo: string;
  atendido: string;
  naoAtendido: string;
  naoCoincidem: string;
  coincidem: string;
};

export const textosPadrao: PasswordTexts = {
  senha: "Senha",
  confirmar: "Confirmar senha",
  mostrar: "Mostrar senha",
  ocultar: "Ocultar senha",
  forca: "Força da senha",
  niveis: ["—", "Fraca", "Razoável", "Boa", "Forte"],
  dicaTitulo: "Para criar sua senha, use:",
  atendido: "atendido",
  naoAtendido: "não atendido",
  naoCoincidem: "As senhas não coincidem",
  coincidem: "As senhas coincidem",
};

const inputCls =
  "w-full rounded-[10px] border bg-card py-2.5 pl-3 pr-11 text-[0.9375rem] text-foreground outline-none transition-all duration-150 placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary/60 disabled:cursor-not-allowed disabled:opacity-50";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> & {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  textos: Pick<PasswordTexts, "mostrar" | "ocultar">;
  invalido?: boolean;
  describedBy?: string;
};

/** Um campo de senha com o botão de exibir/ocultar. */
export function PasswordInput({ label, value, onValueChange, textos, invalido, describedBy, id, className, ...props }: InputProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const [visivel, setVisivel] = React.useState(false);
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="text-[0.875rem] font-semibold text-foreground">{label}</label>
      <div className="relative">
        <input
          id={inputId}
          type={visivel ? "text" : "password"}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          aria-invalid={invalido || undefined}
          aria-describedby={describedBy}
          spellCheck={false}
          autoCapitalize="none"
          className={cn(inputCls, invalido ? "border-[var(--error)] focus:ring-[var(--error)]/30" : "border-border hover:border-[var(--border-strong)]")}
          style={{ boxShadow: "var(--shadow-xs)" }}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          aria-pressed={visivel}
          aria-label={visivel ? textos.ocultar : textos.mostrar}
          aria-controls={inputId}
          className="absolute right-1.5 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[8px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {visivel ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
        </button>
      </div>
    </div>
  );
}

/** Força (0 a 4) = quantidade de requisitos atendidos, limitada a 4. */
export function forcaDaSenha(valor: string, regras: PasswordRule[] = regrasPadrao): number {
  if (!valor) return 0;
  return Math.min(4, regras.filter((r) => r.test(valor)).length);
}

export type PasswordConfirmProps = {
  senha: string;
  confirmacao: string;
  onSenhaChange: (v: string) => void;
  onConfirmacaoChange: (v: string) => void;
  regras?: PasswordRule[];
  textos?: Partial<PasswordTexts>;
  /** Esconde o campo de confirmação (uso como campo único de criação de senha). */
  semConfirmacao?: boolean;
  disabled?: boolean;
  className?: string;
};

/** Senha + confirmação, com força da senha, dicas com check e verificação de coincidência. */
export function PasswordConfirm({ senha, confirmacao, onSenhaChange, onConfirmacaoChange, regras = regrasPadrao, textos: tx, semConfirmacao = false, disabled, className }: PasswordConfirmProps) {
  const textos = { ...textosPadrao, ...tx };
  const base = React.useId();
  const forcaId = `${base}-forca`, dicasId = `${base}-dicas`, confId = `${base}-conf`;
  const forca = forcaDaSenha(senha, regras);
  const atendidas = regras.map((r) => r.test(senha));
  const mostrarConf = !semConfirmacao && confirmacao.length > 0;
  const coincidem = mostrarConf && confirmacao === senha;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-2">
        <PasswordInput
          label={textos.senha}
          value={senha}
          onValueChange={onSenhaChange}
          textos={textos}
          autoComplete="new-password"
          describedBy={`${forcaId} ${dicasId}`}
          disabled={disabled}
        />

        {/* Força da senha */}
        <div className="flex gap-1.5" aria-hidden>
          {[1, 2, 3, 4].map((n) => (
            <span key={n} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", n <= forca ? "bg-primary" : "bg-[var(--graphite-200)] dark:bg-[var(--graphite-700)]")} />
          ))}
        </div>
        <p id={forcaId} className="text-[0.8125rem] text-muted-foreground" aria-live="polite">
          {textos.forca}: <span className={cn("font-semibold", forca >= 4 ? "text-foreground" : "text-muted-foreground")}>{textos.niveis[forca]}</span>
        </p>

        {/* Dicas de preenchimento */}
        <div id={dicasId} className="rounded-[12px] border border-primary/20 bg-[var(--primary-muted)] p-4">
          <p className="mb-2 text-[0.8125rem] font-semibold text-foreground">{textos.dicaTitulo}</p>
          <ul className="flex flex-col gap-1.5">
            {regras.map((r, i) => (
              <li key={r.id} className={cn("flex items-center gap-2 text-[0.8125rem] transition-colors duration-200", atendidas[i] ? "text-foreground" : "text-muted-foreground")}>
                {atendidas[i] ? (
                  <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--success)] text-[var(--success-foreground,#fff)] animate-in zoom-in-50 duration-200"><Check className="h-3 w-3" strokeWidth={3} aria-hidden /></span>
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-muted-foreground/60" aria-hidden />
                )}
                <span>{r.label}</span>
                <span className="sr-only">, {atendidas[i] ? textos.atendido : textos.naoAtendido}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!semConfirmacao && (
        <div className="flex flex-col gap-1.5">
          <PasswordInput
            label={textos.confirmar}
            value={confirmacao}
            onValueChange={onConfirmacaoChange}
            textos={textos}
            autoComplete="new-password"
            invalido={mostrarConf && !coincidem}
            describedBy={confId}
            disabled={disabled}
          />
          <p id={confId} aria-live="polite" className="min-h-[1.25rem] text-[0.8125rem]">
            {mostrarConf && (coincidem ? (
              <span className="inline-flex items-center gap-1 text-foreground"><CheckCircle2 className="h-4 w-4 text-[var(--success)]" aria-hidden />{textos.coincidem}</span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[var(--error)]"><AlertCircle className="h-4 w-4" aria-hidden />{textos.naoCoincidem}</span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}

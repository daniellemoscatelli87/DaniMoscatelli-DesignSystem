import React, { useState, useEffect } from "react";

export type TokenRow = {
  name: string;
  description: string;
  light: string;
  dark?: string;
  isColor?: boolean;
};

export type TokenGroup = {
  group: string;
  tokens: TokenRow[];
};

function useDarkMode() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark"))
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

function Swatch({ value }: { value: string }) {
  if (value.toLowerCase() === "transparent") {
    return (
      <div
        className="h-4 w-4 rounded-[4px] border border-border shrink-0"
        style={{ background: "repeating-linear-gradient(45deg,#ccc 0,#ccc 2px,#fff 2px,#fff 6px)" }}
      />
    );
  }
  return (
    <div
      className="h-4 w-4 rounded-[4px] border border-black/10 shrink-0"
      style={{ background: value }}
    />
  );
}

function TokenRowItem({ token, isDark }: { token: TokenRow; isDark: boolean }) {
  const value = isDark ? (token.dark ?? token.light) : token.light;
  const hasDarkVariant = !!token.dark && token.dark !== token.light;

  return (
    <div className="grid grid-cols-[1fr_1.5fr_1fr] items-center gap-4 px-3.5 py-2.5 border-b border-border last:border-0">
      <code className="text-[0.75rem] font-mono text-primary truncate">{token.name}</code>
      <span className="text-[0.75rem] text-muted-foreground leading-tight">{token.description}</span>

      <div className="flex items-center gap-1.5 justify-end">
        {token.isColor && <Swatch value={value} />}
        <code className="text-[0.6875rem] font-mono text-foreground/70 whitespace-nowrap">{value}</code>
        {/* Dot indicator when a dark variant exists but isn't currently shown */}
        {hasDarkVariant && (
          <span
            title={isDark ? `Light: ${token.light}` : `Dark: ${token.dark}`}
            className="ml-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/30 shrink-0 cursor-help"
          />
        )}
      </div>
    </div>
  );
}

export function TokenTable({ groups }: { groups: TokenGroup[] }) {
  const isDark = useDarkMode();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grid grid-cols-[1fr_1.5fr_1fr] items-center gap-4 px-3.5 pb-2 border-b border-border">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground">Token</span>
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground">Usage</span>
        <div className="flex items-center gap-2 justify-end">
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground">
            Value
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-[4px] text-[0.5625rem] font-semibold uppercase tracking-wide bg-primary/10 text-primary">
            {isDark ? "Dark" : "Light"}
          </span>
        </div>
      </div>

      {groups.map(g => (
        <div key={g.group}>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.07em] text-muted-foreground/60 mb-2 px-1">
            {g.group}
          </p>
          <div className="rounded-[12px] border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-xs)" }}>
            {g.tokens.map(t => (
              <TokenRowItem key={t.name} token={t} isDark={isDark} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

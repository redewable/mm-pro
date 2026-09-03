"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

// Small design system for the dashboard. Everything is light-theme, large
// tap targets, and works on a phone.

export const inputClass =
  "w-full border border-gray-300 bg-white rounded-lg px-3.5 py-2.5 text-[15px] text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors disabled:bg-gray-50";

export function Field({
  label,
  help,
  children,
  htmlFor,
  className = "",
}: {
  label: string;
  help?: string;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-navy mb-1.5">
        {label}
      </label>
      {children}
      {help && <p className="text-xs text-slate mt-1.5 leading-snug">{help}</p>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={`${inputClass} leading-relaxed ${props.className ?? ""}`} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function Toggle({
  checked,
  onChange,
  label,
  help,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  help?: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none py-1">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors mt-0.5 ${checked ? "bg-green-600" : "bg-gray-300"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
      <span>
        <span className="block text-sm font-semibold text-navy">{label}</span>
        {help && <span className="block text-xs text-slate mt-0.5">{help}</span>}
      </span>
    </label>
  );
}

type BtnVariant = "primary" | "secondary" | "danger" | "ghost" | "gold";
const btnBase =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";
const btnVariants: Record<BtnVariant, string> = {
  primary: "bg-navy hover:bg-navy-light text-white",
  gold: "bg-gold hover:bg-gold-light text-navy",
  secondary: "bg-white border border-gray-300 hover:border-navy text-navy",
  danger: "bg-white border border-red-200 text-red-600 hover:bg-red-50",
  ghost: "text-slate hover:text-navy hover:bg-gray-100",
};
const btnSizes = { sm: "text-xs px-3 py-2", md: "text-sm px-4 py-2.5", lg: "text-base px-6 py-3" };

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: "sm" | "md" | "lg" }) {
  return <button type="button" {...props} className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`} />;
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: BtnVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`}>
      {children}
    </Link>
  );
}

export function ConfirmButton({
  onConfirm,
  children,
  confirmText = "Are you sure?",
  variant = "danger",
  size = "sm",
  className = "",
}: {
  onConfirm: () => void;
  children: ReactNode;
  confirmText?: string;
  variant?: BtnVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [arm, setArm] = useState(false);
  if (arm) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-xs text-red-600 font-medium">{confirmText}</span>
        <Button variant="danger" size={size} onClick={() => { setArm(false); onConfirm(); }}>
          Yes
        </Button>
        <Button variant="ghost" size={size} onClick={() => setArm(false)}>
          No
        </Button>
      </span>
    );
  }
  return (
    <Button variant={variant} size={size} className={className} onClick={() => setArm(true)}>
      {children}
    </Button>
  );
}

export function Card({ children, className = "", title, description, actions }: { children: ReactNode; className?: string; title?: string; description?: string; actions?: ReactNode }) {
  return (
    <section className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            {title && <h2 className="text-base font-bold text-navy">{title}</h2>}
            {description && <p className="text-sm text-slate mt-0.5">{description}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="px-5 sm:px-6 py-5">{children}</div>
    </section>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 sm:mb-8">
      {back && (
        <Link href={back.href} className="inline-flex items-center gap-1 text-sm text-slate hover:text-navy mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {back.label}
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">{title}</h1>
          {description && <p className="text-sm sm:text-[15px] text-slate mt-1 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 sm:flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export function Badge({ children, tone = "gray" }: { children: ReactNode; tone?: "gray" | "green" | "blue" | "amber" | "gold" | "red" }) {
  const tones = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-50 text-green-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    gold: "bg-gold/15 text-gold-dark",
    red: "bg-red-50 text-red-700",
  };
  return <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="text-center py-12 px-6 border-2 border-dashed border-gray-200 rounded-xl">
      <p className="font-semibold text-navy">{title}</p>
      {text && <p className="text-sm text-slate mt-1 max-w-sm mx-auto">{text}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

// Sticky save bar shown at the bottom of editors.
export function SaveBar({
  dirty,
  saving,
  onSave,
  onDiscard,
  savedAt,
  extra,
}: {
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onDiscard?: () => void;
  savedAt?: string | null;
  extra?: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 mt-8 px-4 sm:px-6 lg:px-8 py-3 bg-white/95 backdrop-blur border-t border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <p className="text-xs sm:text-sm text-slate truncate">
          {dirty ? (
            <span className="text-amber-700 font-medium">Unsaved changes</span>
          ) : savedAt ? (
            `Saved ${new Date(savedAt).toLocaleTimeString()}`
          ) : (
            "All changes saved"
          )}
        </p>
        <div className="flex items-center gap-2">
          {extra}
          {onDiscard && dirty && (
            <Button variant="ghost" size="md" onClick={onDiscard} disabled={saving}>
              Discard
            </Button>
          )}
          <Button variant="gold" size="md" onClick={onSave} disabled={!dirty || saving}>
            {saving ? "Saving…" : "Save & publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Grid({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) {
  const c = cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : cols === 2 ? "sm:grid-cols-2" : "";
  return <div className={`grid grid-cols-1 ${c} gap-4 sm:gap-5`}>{children}</div>;
}

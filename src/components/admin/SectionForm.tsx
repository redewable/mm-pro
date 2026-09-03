"use client";

import { useMemo } from "react";
import type { FieldDef } from "@/lib/content/sections";
import type { ImageRef, SiteContent } from "@/lib/content/types";
import { ICON_NAMES } from "@/components/Icon";
import Icon from "@/components/Icon";
import { ImageField } from "./MediaPicker";
import { SortableList } from "./SortableList";
import { StringListField } from "./StringListField";
import { Button, Field, Input, Select, Textarea, Toggle } from "./ui";
import { newId } from "@/lib/ids";

type D = Record<string, unknown>;
const isObj = (v: unknown): v is D => typeof v === "object" && v !== null && !Array.isArray(v);

export interface PickerSources {
  projects: SiteContent["projects"];
  videos: SiteContent["videos"];
  testimonials: SiteContent["testimonials"];
}

// Generic form generated from a section's field schema.
export function SectionForm({
  fields,
  data,
  onChange,
  sources,
  idPrefix,
}: {
  fields: FieldDef[];
  data: D;
  onChange: (next: D) => void;
  sources: PickerSources;
  idPrefix: string;
}) {
  const set = (key: string, v: unknown) => onChange({ ...data, [key]: v });
  return (
    <div className="space-y-5">
      {fields.map((f) => (
        <FieldControl key={f.key} f={f} value={data[f.key]} onChange={(v) => set(f.key, v)} sources={sources} id={`${idPrefix}-${f.key}`} />
      ))}
    </div>
  );
}

function FieldControl({
  f,
  value,
  onChange,
  sources,
  id,
}: {
  f: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  sources: PickerSources;
  id: string;
}) {
  switch (f.kind) {
    case "text":
      return (
        <Field label={f.label} help={f.help} htmlFor={id}>
          <Input id={id} value={typeof value === "string" ? value : ""} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );
    case "textarea":
      return (
        <Field label={f.label} help={f.help} htmlFor={id}>
          <Textarea id={id} value={typeof value === "string" ? value : ""} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} rows={5} />
        </Field>
      );
    case "number":
      return (
        <Field label={f.label} help={f.help} htmlFor={id}>
          <Input id={id} type="number" inputMode="numeric" value={typeof value === "number" ? value : 0} onChange={(e) => onChange(Number(e.target.value) || 0)} className="max-w-[10rem]" />
        </Field>
      );
    case "boolean":
      return <Toggle checked={Boolean(value)} onChange={onChange} label={f.label} help={f.help} />;
    case "select":
      return (
        <Field label={f.label} help={f.help} htmlFor={id}>
          <Select id={id} value={typeof value === "string" ? value : (f.options?.[0]?.value ?? "")} onChange={(e) => onChange(e.target.value)}>
            {f.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      );
    case "image": {
      const img: ImageRef = isObj(value) ? { url: String(value.url ?? ""), alt: String(value.alt ?? "") } : { url: "", alt: "" };
      return <ImageField label={f.label} help={f.help} value={img} onChange={onChange} />;
    }
    case "link": {
      const l = isObj(value) ? value : {};
      return (
        <fieldset>
          <legend className="block text-sm font-semibold text-navy mb-1.5">{f.label}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input placeholder="Button text" value={String(l.label ?? "")} onChange={(e) => onChange({ ...l, label: e.target.value })} aria-label={`${f.label} text`} />
            <Input placeholder="Link (e.g. /contact)" value={String(l.href ?? "")} onChange={(e) => onChange({ ...l, href: e.target.value })} aria-label={`${f.label} link`} />
          </div>
          {f.help && <p className="text-xs text-slate mt-1.5">{f.help}</p>}
        </fieldset>
      );
    }
    case "icon":
      return <IconPicker label={f.label} value={typeof value === "string" ? value : "sparkle"} onChange={onChange} />;
    case "project":
      return (
        <Field label={f.label} help={f.help} htmlFor={id}>
          <Select id={id} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)}>
            <option value="">— Automatic —</option>
            {sources.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
                {p.published ? "" : " (unpublished)"}
              </option>
            ))}
          </Select>
        </Field>
      );
    case "video":
      return (
        <Field label={f.label} help={f.help} htmlFor={id}>
          <Select id={id} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)}>
            <option value="">— Newest video —</option>
            {sources.videos.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
                {v.published ? "" : " (unpublished)"}
              </option>
            ))}
          </Select>
        </Field>
      );
    case "testimonial":
      return (
        <Field label={f.label} help={f.help} htmlFor={id}>
          <Select id={id} value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)}>
            <option value="">— Featured testimonial —</option>
            {sources.testimonials.map((t) => (
              <option key={t.id} value={t.id}>
                {t.author} — {t.quote.slice(0, 40)}…
              </option>
            ))}
          </Select>
        </Field>
      );
    case "string-list":
      return <StringListField label={f.label} help={f.help} value={Array.isArray(value) ? value.filter((x): x is string => typeof x === "string") : []} onChange={onChange} />;
    case "items":
      return <ItemsField f={f} value={Array.isArray(value) ? value.filter(isObj) : []} onChange={onChange} sources={sources} id={id} />;
    default:
      return null;
  }
}

function ItemsField({ f, value, onChange, sources, id }: { f: FieldDef; value: D[]; onChange: (v: D[]) => void; sources: PickerSources; id: string }) {
  // Attach stable ids for drag & drop without persisting them.
  const rows = useMemo(() => value.map((v, i) => ({ id: typeof v._id === "string" ? v._id : `${id}-${i}`, data: v })), [value, id]);
  const subFields = f.fields ?? [];
  const label = f.itemLabel ?? "Item";
  const titleOf = (d: D, i: number) => {
    const first = subFields.find((s) => s.kind === "text");
    const t = first ? d[first.key] : "";
    return typeof t === "string" && t ? t : `${label} ${i + 1}`;
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-navy">{f.label}</p>
        <span className="text-xs text-slate">{value.length}</span>
      </div>
      {rows.length > 0 && (
        <SortableList
          items={rows}
          onChange={(next) => onChange(next.map((n) => n.data))}
          className="space-y-3"
          render={(row, index, controls) => (
            <details className="border border-gray-200 rounded-lg bg-gray-50/60 group" open={value.length <= 3}>
              <summary className="flex items-center gap-2 px-3 py-2.5 cursor-pointer list-none select-none">
                {controls}
                <span className="flex-1 text-sm font-medium text-navy truncate">{titleOf(row.data, index)}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onChange(value.filter((_, i) => i !== index));
                  }}
                  className="p-1.5 text-slate hover:text-red-600"
                  aria-label={`Remove ${label}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <svg className="w-4 h-4 text-slate transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <div className="px-3 pb-4 pt-1 space-y-4 border-t border-gray-200 bg-white rounded-b-lg">
                {subFields.map((sf) => (
                  <FieldControl
                    key={sf.key}
                    f={sf}
                    value={row.data[sf.key]}
                    onChange={(v) => {
                      const next = [...value];
                      next[index] = { ...row.data, [sf.key]: v };
                      onChange(next);
                    }}
                    sources={sources}
                    id={`${row.id}-${sf.key}`}
                  />
                ))}
              </div>
            </details>
          )}
        />
      )}
      <Button
        variant="secondary"
        size="sm"
        className="mt-2"
        onClick={() => {
          const blank: D = { _id: newId("it") };
          for (const sf of subFields) {
            blank[sf.key] = sf.kind === "image" ? { url: "", alt: "" } : sf.kind === "link" ? { label: "", href: "" } : sf.kind === "boolean" ? false : sf.kind === "number" ? 0 : sf.kind === "icon" ? "sparkle" : sf.kind === "string-list" || sf.kind === "items" ? [] : "";
          }
          onChange([...value, blank]);
        }}
      >
        + Add {label.toLowerCase()}
      </Button>
    </div>
  );
}

export function IconPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="block text-sm font-semibold text-navy mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {ICON_NAMES.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            title={name}
            aria-label={name}
            aria-pressed={value === name}
            className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
              value === name ? "border-gold bg-gold/10 text-gold-dark" : "border-gray-200 text-slate hover:border-gray-400 hover:text-navy"
            }`}
          >
            <Icon name={name} className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
}

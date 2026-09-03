"use client";

import { useMemo } from "react";
import { SortableList } from "./SortableList";
import { Button, Input } from "./ui";

// Editable, reorderable list of short strings (scope bullets, keywords...).
export function StringListField({
  label,
  value,
  onChange,
  placeholder = "Add an item",
  help,
  addLabel = "Add",
}: {
  label?: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  help?: string;
  addLabel?: string;
}) {
  // Stable ids for dnd — derived from index but kept in a ref-like memo.
  const items = useMemo(() => value.map((text, i) => ({ id: `i${i}`, text })), [value]);

  return (
    <div>
      {label && <p className="block text-sm font-semibold text-navy mb-1.5">{label}</p>}
      {items.length > 0 && (
        <SortableList
          items={items}
          onChange={(next) => onChange(next.map((n) => n.text))}
          className="space-y-2 mb-2"
          render={(item, index, controls) => (
            <div className="flex items-center gap-1.5">
              {controls}
              <Input
                value={item.text}
                placeholder={placeholder}
                onChange={(e) => {
                  const next = [...value];
                  next[index] = e.target.value;
                  onChange(next);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const next = [...value];
                    next.splice(index + 1, 0, "");
                    onChange(next);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="p-2 text-slate hover:text-red-600 flex-shrink-0"
                aria-label="Remove"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          )}
        />
      )}
      <Button variant="secondary" size="sm" onClick={() => onChange([...value, ""])}>
        + {addLabel}
      </Button>
      {help && <p className="text-xs text-slate mt-1.5">{help}</p>}
    </div>
  );
}

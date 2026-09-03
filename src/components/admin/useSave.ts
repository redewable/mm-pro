"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "./Toast";
import type { ActionResult } from "@/app/admin/actions";

// Local editing state + save with toast feedback and "unsaved changes" guard.
export function useEditor<T>(initial: T, save: (value: T) => Promise<ActionResult>) {
  const [value, setValue] = useState<T>(initial);
  const [snapshot, setSnapshot] = useState<string>(() => JSON.stringify(initial));
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const { push } = useToast();
  const router = useRouter();

  const dirty = JSON.stringify(value) !== snapshot;

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const doSave = useCallback(
    async (override?: T) => {
      const v = override ?? value;
      setSaving(true);
      const res = await save(v);
      setSaving(false);
      if (res.ok) {
        setSnapshot(JSON.stringify(v));
        if (override) setValue(override);
        setSavedAt(res.savedAt);
        push("success", "Saved. The live site is updating.");
        router.refresh();
      } else {
        push("error", res.error);
      }
      return res;
    },
    [value, save, push, router]
  );

  const discard = useCallback(() => setValue(JSON.parse(snapshot) as T), [snapshot]);

  return { value, setValue, dirty, saving, savedAt, save: doSave, discard };
}

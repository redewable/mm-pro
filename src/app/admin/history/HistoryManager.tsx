"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { restoreVersionAction, revalidateSiteAction } from "@/app/admin/actions";
import { useToast } from "@/components/admin/Toast";
import { Button, Card, ConfirmButton, EmptyState, PageHeader } from "@/components/admin/ui";
import type { ContentVersion, ProviderName } from "@/lib/storage/types";

export default function HistoryManager({ versions, provider }: { versions: ContentVersion[]; provider: { name: ProviderName; productionReady: boolean; note: string } }) {
  const { push } = useToast();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function restore(id: string) {
    setBusy(id);
    const res = await restoreVersionAction(id);
    setBusy(null);
    if (res.ok) {
      push("success", "Restored. The site now shows that version.");
      router.refresh();
    } else push("error", res.error);
  }

  return (
    <div>
      <PageHeader
        title="Version History"
        actions={
          <Button
            variant="secondary"
            onClick={async () => {
              const r = await revalidateSiteAction();
              push(r.ok ? "success" : "error", r.ok ? "Live site refreshed." : r.error);
            }}
          >
            Refresh live site
          </Button>
        }
      />
      <Card className="mb-4 sm:mb-6">
        <p className="text-sm text-slate">
          <span className="font-semibold text-navy">Storage:</span> {provider.note}
        </p>
      </Card>
      {versions.length === 0 ? (
        <EmptyState title="No previous versions yet" text="Versions appear here after your first save." />
      ) : (
        <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {versions.map((v, i) => (
            <li key={v.id} className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy">{new Date(v.savedAt).toLocaleString()}</p>
                <p className="text-xs text-slate truncate">
                  {i === 0 ? "Most recent backup" : `${i + 1} saves ago`}
                  {v.size ? ` · ${Math.round(v.size / 1024)} KB` : ""}
                </p>
              </div>
              <ConfirmButton variant="secondary" onConfirm={() => restore(v.id)} confirmText="Replace the live site with this version?">
                {busy === v.id ? "Restoring…" : "Restore"}
              </ConfirmButton>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

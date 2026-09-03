"use client";

import { useState } from "react";
import { changePasswordAction, logoutAction } from "@/app/admin/actions";
import { useToast } from "@/components/admin/Toast";
import { Button, Card, Field, Input, PageHeader } from "@/components/admin/ui";

export default function AccountForm({ hasCustomPassword, envConfigured }: { hasCustomPassword: boolean; envConfigured: boolean }) {
  const { push } = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (next !== confirm) return push("error", "New passwords don't match.");
    setBusy(true);
    const res = await changePasswordAction(current, next);
    setBusy(false);
    if (res.ok) {
      push("success", "Password changed.");
      setCurrent("");
      setNext("");
      setConfirm("");
    } else push("error", res.error);
  }

  return (
    <div>
      <PageHeader title="Password" />
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <Card title="Change password" className="lg:col-span-2">
          <div className="space-y-4 max-w-md">
            <Field label="Current password" htmlFor="cur">
              <Input id="cur" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
            </Field>
            <Field label="New password" htmlFor="new" help="At least 8 characters.">
              <Input id="new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
            </Field>
            <Field label="Confirm new password" htmlFor="conf">
              <Input id="conf" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </Field>
            <Button variant="gold" onClick={submit} disabled={busy || !current || !next}>
              {busy ? "Saving…" : "Change password"}
            </Button>
          </div>
        </Card>
        <div className="space-y-4 sm:space-y-6">
          <Card title="Status">
            <p className="text-sm text-slate leading-relaxed">
              {hasCustomPassword
                ? "You're using a password set from this dashboard."
                : envConfigured
                  ? "You're using the ADMIN_PASSWORD from the hosting settings. Changing it here overrides that."
                  : "No password is configured. Set one now, or add ADMIN_PASSWORD in Vercel."}
            </p>
          </Card>
          <Card title="Sign out">
            <form action={logoutAction}>
              <Button variant="secondary" type="submit">Sign out of this device</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

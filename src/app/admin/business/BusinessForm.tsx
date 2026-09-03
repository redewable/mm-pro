"use client";

import { saveCollectionAction } from "@/app/admin/actions";
import { useEditor } from "@/components/admin/useSave";
import { StringListField } from "@/components/admin/StringListField";
import { Button, Card, Field, Grid, Input, PageHeader, SaveBar, Textarea } from "@/components/admin/ui";
import { newId } from "@/lib/ids";
import type { BusinessInfo } from "@/lib/content/types";

function toE164(display: string): string {
  const digits = display.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return display.startsWith("+") ? display : `+${digits}`;
}

export default function BusinessForm({ initial }: { initial: BusinessInfo }) {
  const ed = useEditor(initial, (v) => saveCollectionAction("business", { ...v, phoneE164: toE164(v.phone) }));
  const b = ed.value;
  const set = (patch: Partial<BusinessInfo>) => ed.setValue({ ...b, ...patch });
  const f = (key: keyof BusinessInfo, label: string, help?: string, type = "text") => (
    <Field label={label} help={help} htmlFor={`b-${key}`}>
      <Input id={`b-${key}`} type={type} value={String(b[key] ?? "")} onChange={(e) => set({ [key]: type === "number" ? Number(e.target.value) : e.target.value } as Partial<BusinessInfo>)} />
    </Field>
  );

  return (
    <div>
      <PageHeader title="Business Info" />
      <div className="space-y-4 sm:space-y-6">
        <Card title="Identity">
          <Grid>
            {f("name", "Business name")}
            {f("legalName", "Legal name", "If different from the display name.")}
            {f("tagline", "Tagline")}
            {f("foundedYear", "Founded (year)")}
            {f("founderName", "Owner name")}
            {f("founderTitle", "Owner title")}
          </Grid>
        </Card>
        <Card title="Contact">
          <Grid>
            {f("phone", "Phone (as displayed)", "e.g. (979) 587-3639. Tap-to-call is generated automatically.", "tel")}
            {f("email", "Public email", undefined, "email")}
            {f("formRecipient", "Form recipient email", "Contact and job applications are emailed here via FormSubmit. The first message to a new address triggers a one-time activation email.", "email")}
            {f("hours", "Hours", "e.g. Mon–Sat 7:00 AM – 6:00 PM")}
          </Grid>
        </Card>
        <Card title="Location & service area">
          <Grid>
            {f("addressLine", "Street address", "Optional. Leave blank to show city only.")}
            {f("city", "City")}
            {f("region", "State")}
            {f("postalCode", "ZIP")}
            {f("latitude", "Latitude", "Helps Google Maps / local SEO.", "number")}
            {f("longitude", "Longitude", undefined, "number")}
          </Grid>
          <div className="mt-5 space-y-5">
            {f("serviceAreaSummary", "Service area line", "Shown in the header bar and footer.")}
            <StringListField label="Service areas (counties / cities)" value={b.serviceAreas} onChange={(serviceAreas) => set({ serviceAreas })} addLabel="Add area" />
          </div>
        </Card>
        <Card title="Licensing">
          <Grid>
            {f("license", "License line")}
            {f("licenseIssuer", "Issued by")}
            {f("priceRange", "Price range", "$, $$, $$$ — used in Google structured data.")}
          </Grid>
        </Card>
        <Card title="Footer">
          <div className="space-y-5">
            <Field label="Footer blurb" htmlFor="b-footerBlurb">
              <Textarea id="b-footerBlurb" value={b.footerBlurb} onChange={(e) => set({ footerBlurb: e.target.value })} />
            </Field>
            {f("footerQuote", "Footer quote")}
          </div>
        </Card>
        <Card title="Social links" actions={<Button variant="secondary" size="sm" onClick={() => set({ socials: [...b.socials, { id: newId("soc"), platform: "Facebook", url: "" }] })}>+ Add</Button>}>
          <div className="space-y-2">
            {b.socials.map((s, i) => (
              <div key={s.id} className="grid grid-cols-[8rem_1fr_auto] sm:grid-cols-[10rem_1fr_auto] gap-2 items-center">
                <Input value={s.platform} placeholder="Facebook" onChange={(e) => set({ socials: b.socials.map((x, j) => (j === i ? { ...x, platform: e.target.value } : x)) })} aria-label="Platform" />
                <Input value={s.url} placeholder="https://…" onChange={(e) => set({ socials: b.socials.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)) })} aria-label="URL" />
                <button type="button" onClick={() => set({ socials: b.socials.filter((_, j) => j !== i) })} className="p-2 text-slate hover:text-red-600" aria-label="Remove">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
            {b.socials.length === 0 && <p className="text-sm text-slate">No social links yet.</p>}
            <p className="text-xs text-slate pt-1">Facebook, Instagram, YouTube and Google get an icon in the footer.</p>
          </div>
        </Card>
      </div>
      <SaveBar dirty={ed.dirty} saving={ed.saving} onSave={() => ed.save()} onDiscard={ed.discard} savedAt={ed.savedAt} />
    </div>
  );
}

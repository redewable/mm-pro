"use client";

import { useState } from "react";
import { saveCollectionAction } from "@/app/admin/actions";
import { useEditor } from "@/components/admin/useSave";
import { StringListField } from "@/components/admin/StringListField";
import { ImageField } from "@/components/admin/MediaPicker";
import { SortableList } from "@/components/admin/SortableList";
import { Button, Card, ConfirmButton, Field, Grid, Input, PageHeader, SaveBar, Textarea, Toggle } from "@/components/admin/ui";
import { newId } from "@/lib/ids";
import type { SeoSettings, TrackingSettings } from "@/lib/content/types";

type Both = { seo: SeoSettings; tracking: TrackingSettings };

export default function SeoForm({ seo, tracking, siteUrl }: { seo: SeoSettings; tracking: TrackingSettings; siteUrl: string }) {
  const ed = useEditor<Both>({ seo, tracking }, async (v) => {
    const a = await saveCollectionAction("seo", v.seo);
    if (!a.ok) return a;
    return saveCollectionAction("tracking", v.tracking);
  });
  const s = ed.value.seo;
  const t = ed.value.tracking;
  const setSeo = (patch: Partial<SeoSettings>) => ed.setValue({ ...ed.value, seo: { ...s, ...patch } });
  const setTrk = (patch: Partial<TrackingSettings>) => ed.setValue({ ...ed.value, tracking: { ...t, ...patch } });
  const [tab, setTab] = useState<"seo" | "tracking" | "ai">("seo");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  return (
    <div>
      <PageHeader title="SEO & Tracking" />

      <div className="flex gap-1 mb-5 border-b border-gray-200">
        {(
          [
            ["seo", "Search", "Search (SEO)"],
            ["tracking", "Ads & Analytics", "Google Ads & Analytics"],
            ["ai", "AI search", "AI search (LLMEO)"],
          ] as const
        ).map(([k, short, long]) => (
          <button key={k} type="button" onClick={() => setTab(k)} className={`px-3 sm:px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px whitespace-nowrap transition-colors ${tab === k ? "border-gold text-navy" : "border-transparent text-slate hover:text-navy"}`}>
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{long}</span>
          </button>
        ))}
      </div>

      {tab === "seo" && (
        <div className="space-y-4 sm:space-y-6">
          <Card title="Site-wide defaults">
            <div className="space-y-5">
              <Field label="Website address" htmlFor="siteUrl" help="Used for canonical links, sitemap and share previews.">
                <Input id="siteUrl" value={s.siteUrl} onChange={(e) => setSeo({ siteUrl: e.target.value.replace(/\/$/, "") })} />
              </Field>
              <Field label="Home page title" htmlFor="defaultTitle" help="Under ~60 characters. Put the main service + city first.">
                <Input id="defaultTitle" value={s.defaultTitle} onChange={(e) => setSeo({ defaultTitle: e.target.value })} maxLength={70} />
              </Field>
              <Field label="Title pattern for other pages" htmlFor="titleTemplate" help="%s is replaced by the page name.">
                <Input id="titleTemplate" value={s.titleTemplate} onChange={(e) => setSeo({ titleTemplate: e.target.value })} />
              </Field>
              <Field label="Default description" htmlFor="description" help="Under ~160 characters.">
                <Textarea id="description" value={s.description} onChange={(e) => setSeo({ description: e.target.value })} maxLength={200} />
              </Field>
              <StringListField label="Keywords" value={s.keywords} onChange={(keywords) => setSeo({ keywords })} placeholder="general contractor College Station TX" addLabel="Add keyword" help="Phrases people search for. These feed page metadata and the AI summary." />
              <ImageField label="Default share image" help="1200×630 works best. Used when a page has no image of its own." value={s.ogImage ?? { url: "", alt: "" }} onChange={(img) => setSeo({ ogImage: img.url ? img : undefined })} aspect="aspect-[1200/630]" />
            </div>
          </Card>
          <Card title="Verification" description="Paste the codes from Google Search Console and Bing Webmaster Tools (HTML tag method).">
            <Grid>
              <Field label="Google site verification" htmlFor="gsv">
                <Input id="gsv" value={s.googleSiteVerification} onChange={(e) => setSeo({ googleSiteVerification: e.target.value.trim() })} />
              </Field>
              <Field label="Bing site verification" htmlFor="bsv">
                <Input id="bsv" value={s.bingSiteVerification} onChange={(e) => setSeo({ bingSiteVerification: e.target.value.trim() })} />
              </Field>
              <Field label="X / Twitter handle" htmlFor="tw">
                <Input id="tw" value={s.twitterHandle} onChange={(e) => setSeo({ twitterHandle: e.target.value.trim() })} placeholder="@mmproconstruction" />
              </Field>
            </Grid>
          </Card>
          <Card title="Quick links">
            <ul className="text-sm text-slate space-y-1.5">
              <li><a className="text-navy font-semibold hover:text-gold" href={`${siteUrl}/sitemap.xml`} target="_blank" rel="noopener">Sitemap</a> — submit this in Google Search Console.</li>
              <li><a className="text-navy font-semibold hover:text-gold" href={`${siteUrl}/robots.txt`} target="_blank" rel="noopener">robots.txt</a></li>
              <li><a className="text-navy font-semibold hover:text-gold" href="https://search.google.com/search-console" target="_blank" rel="noopener">Google Search Console</a> · <a className="text-navy font-semibold hover:text-gold" href="https://business.google.com" target="_blank" rel="noopener">Google Business Profile</a> · <a className="text-navy font-semibold hover:text-gold" href="https://search.google.com/test/rich-results" target="_blank" rel="noopener">Rich results test</a></li>
            </ul>
          </Card>
        </div>
      )}

      {tab === "tracking" && (
        <div className="space-y-4 sm:space-y-6">
          <Card title="Google Ads" description="Conversions fire when someone submits the contact form, applies for a job, or taps a phone number.">
            <Grid>
              <Field label="Google Ads ID" htmlFor="ads" help="Looks like AW-123456789. Google Ads → Tools → Conversions → tag setup.">
                <Input id="ads" value={t.googleAdsId} onChange={(e) => setTrk({ googleAdsId: e.target.value.trim() })} placeholder="AW-123456789" />
              </Field>
              <div />
              <Field label="Form submission conversion label" htmlFor="adsForm" help="The part after the slash in the conversion snippet (send_to: 'AW-xxx/LABEL').">
                <Input id="adsForm" value={t.googleAdsFormConversionLabel} onChange={(e) => setTrk({ googleAdsFormConversionLabel: e.target.value.trim() })} placeholder="AbCdEfGhIj" />
              </Field>
              <Field label="Phone call conversion label" htmlFor="adsPhone">
                <Input id="adsPhone" value={t.googleAdsPhoneConversionLabel} onChange={(e) => setTrk({ googleAdsPhoneConversionLabel: e.target.value.trim() })} placeholder="KlMnOpQrSt" />
              </Field>
            </Grid>
          </Card>
          <Card title="Google Analytics & Tag Manager">
            <Grid>
              <Field label="GA4 Measurement ID" htmlFor="ga4" help="Looks like G-XXXXXXXXXX.">
                <Input id="ga4" value={t.ga4MeasurementId} onChange={(e) => setTrk({ ga4MeasurementId: e.target.value.trim() })} placeholder="G-XXXXXXXXXX" />
              </Field>
              <Field label="Google Tag Manager container" htmlFor="gtm" help="Optional. Looks like GTM-XXXXXXX. Use this if an agency manages tags.">
                <Input id="gtm" value={t.gtmContainerId} onChange={(e) => setTrk({ gtmContainerId: e.target.value.trim() })} placeholder="GTM-XXXXXXX" />
              </Field>
            </Grid>
          </Card>
          <Card title="Other pixels">
            <Grid>
              <Field label="Meta (Facebook) Pixel ID" htmlFor="pixel">
                <Input id="pixel" value={t.metaPixelId} onChange={(e) => setTrk({ metaPixelId: e.target.value.trim() })} />
              </Field>
              <Field label="Microsoft Clarity ID" htmlFor="clarity" help="Free heatmaps and session recordings.">
                <Input id="clarity" value={t.microsoftClarityId} onChange={(e) => setTrk({ microsoftClarityId: e.target.value.trim() })} />
              </Field>
            </Grid>
            <div className="mt-4">
              <Toggle checked={t.enabledInDev} onChange={(enabledInDev) => setTrk({ enabledInDev })} label="Also load tags on preview / local builds" help="Normally tags only load on the live site so test traffic doesn't pollute reports." />
            </div>
          </Card>
          <Card title="Events sent">
            <ul className="text-sm text-slate space-y-1.5">
              <li><code className="text-navy">generate_lead</code> — contact form submitted (also fires the Google Ads form conversion and Meta “Lead”).</li>
              <li><code className="text-navy">job_application</code> — careers form submitted.</li>
              <li><code className="text-navy">phone_call</code> — a phone number was tapped (fires the phone conversion + Meta “Contact”).</li>
            </ul>
          </Card>
        </div>
      )}

      {tab === "ai" && (
        <div className="space-y-4 sm:space-y-6">
          <Card title="AI assistants (ChatGPT, Perplexity, Claude, Gemini)" description="These tools read a plain-text summary at /llms.txt plus the structured data on every page.">
            <div className="space-y-5">
              <Toggle checked={s.allowAiCrawlers} onChange={(allowAiCrawlers) => setSeo({ allowAiCrawlers })} label="Allow AI crawlers" help="Recommended on, so the business shows up in AI answers about contractors in the Brazos Valley." />
              <Field label="Business summary for AI" htmlFor="llms" help="2–4 sentences in plain English: who, what, where, why choose you.">
                <Textarea id="llms" rows={5} value={s.llmsSummary} onChange={(e) => setSeo({ llmsSummary: e.target.value })} />
              </Field>
              <Field label="Extra notes" htmlFor="llmsExtra" help="Optional. Anything else an assistant should know (financing, warranties, typical timelines…).">
                <Textarea id="llmsExtra" rows={4} value={s.llmsExtra} onChange={(e) => setSeo({ llmsExtra: e.target.value })} />
              </Field>
              <p className="text-xs text-slate">
                Preview: <a className="text-navy font-semibold hover:text-gold" href="/llms.txt" target="_blank" rel="noopener">/llms.txt</a> · <a className="text-navy font-semibold hover:text-gold" href="/llms-full.txt" target="_blank" rel="noopener">/llms-full.txt</a>
              </p>
            </div>
          </Card>
          <Card
            title="Frequently asked questions"
            description="Published as FAQ structured data (rich results in Google) and used by the FAQ section on the Contact page."
            actions={
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const id = newId("faq");
                  setSeo({ faq: [...s.faq, { id, question: "", answer: "" }] });
                  setOpenFaq(id);
                }}
              >
                + Add question
              </Button>
            }
          >
            {s.faq.length === 0 ? (
              <p className="text-sm text-slate">No questions yet.</p>
            ) : (
              <SortableList
                items={s.faq}
                onChange={(faq) => setSeo({ faq })}
                className="space-y-2"
                render={(f, _i, controls) => {
                  const open = openFaq === f.id;
                  return (
                    <div className={`border rounded-lg ${open ? "border-gold" : "border-gray-200"}`}>
                      <div className="flex items-center gap-2 p-2.5">
                        {controls}
                        <button type="button" className="flex-1 text-left text-sm font-medium text-navy truncate" onClick={() => setOpenFaq(open ? null : f.id)}>
                          {f.question || "New question"}
                        </button>
                        <Button variant="ghost" size="sm" onClick={() => setOpenFaq(open ? null : f.id)}>{open ? "Close" : "Edit"}</Button>
                      </div>
                      {open && (
                        <div className="border-t border-gray-100 p-3 space-y-3">
                          <Input value={f.question} placeholder="Question" onChange={(e) => setSeo({ faq: s.faq.map((x) => (x.id === f.id ? { ...x, question: e.target.value } : x)) })} aria-label="Question" />
                          <Textarea value={f.answer} placeholder="Answer" onChange={(e) => setSeo({ faq: s.faq.map((x) => (x.id === f.id ? { ...x, answer: e.target.value } : x)) })} aria-label="Answer" />
                          <ConfirmButton onConfirm={() => setSeo({ faq: s.faq.filter((x) => x.id !== f.id) })} confirmText="Remove?">Remove</ConfirmButton>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            )}
          </Card>
        </div>
      )}

      <SaveBar dirty={ed.dirty} saving={ed.saving} onSave={() => ed.save()} onDiscard={ed.discard} savedAt={ed.savedAt} />
    </div>
  );
}

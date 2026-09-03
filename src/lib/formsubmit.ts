// Client-side FormSubmit.co submission helper.
//
// IMPORTANT: this must run in the BROWSER. FormSubmit sits behind Cloudflare
// bot protection which rejects server-to-server requests (403) — posting from
// a Next.js server action on Vercel does not work. The /ajax/ endpoint is
// CORS-enabled and designed for exactly this browser-side use.
//
// Contact inquiries and careers applications both go to Michael. The very
// first submission triggers an activation email to the recipient; once he
// clicks the activation link, every subsequent message arrives in his inbox.
// The recipient is editable from the dashboard (Business > Form recipient).
export const FORM_RECIPIENT = "mram@mmprocon.com";

export interface FormSubmitResult {
  success: boolean;
  message: string;
}

export async function sendToFormSubmit(
  payload: FormData,
  errorMessage: string,
  recipient: string = FORM_RECIPIENT
): Promise<FormSubmitResult> {
  const endpoint = `https://formsubmit.co/ajax/${recipient || FORM_RECIPIENT}`;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      body: payload,
      headers: { Accept: "application/json" },
    });

    // The ajax endpoint returns { success: "true"|"false", message: "..." }.
    const result = (await res.json().catch(() => null)) as {
      success?: string | boolean;
      message?: string;
    } | null;
    const delivered =
      res.ok && (result?.success === "true" || result?.success === true);

    if (!delivered) {
      console.error("FormSubmit error:", res.status, result);
      return { success: false, message: errorMessage };
    }

    return { success: true, message: "" };
  } catch (error) {
    console.error("FormSubmit submission error:", error);
    return { success: false, message: errorMessage };
  }
}

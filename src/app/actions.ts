"use server";

interface ContactFormState {
  success: boolean;
  message: string;
}

export interface ApplicationFormState {
  success: boolean;
  message: string;
}

const RESUME_MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const RESUME_ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
const RESUME_ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const service = formData.get("service") as string;
  const message = formData.get("message") as string;

  // Basic validation
  if (!name || !phone || !message) {
    return {
      success: false,
      message: "Please fill in all required fields.",
    };
  }

  // Send email via Resend (free tier: 100 emails/day)
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Fallback: log the submission (visible in Vercel function logs)
    console.log("=== NEW CONTACT FORM SUBMISSION ===");
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Email: ${email || "Not provided"}`);
    console.log(`Service: ${service || "Not specified"}`);
    console.log(`Message: ${message}`);
    console.log("===================================");

    return {
      success: true,
      message:
        "Message received! Michael will get back to you within 24 hours.",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "M&M Pro Website <onboarding@resend.dev>",
        to: ["bttbmgmt@gmail.com"],
        subject: `New Lead: ${name} — ${service || "General Inquiry"}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <table style="border-collapse:collapse;width:100%;max-width:600px;">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="tel:${phone}">${phone}</a></td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email || "Not provided"}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Service</td><td style="padding:8px;border-bottom:1px solid #eee;">${service || "Not specified"}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px;">${message.replace(/\n/g, "<br>")}</td></tr>
          </table>
          <p style="color:#888;font-size:12px;margin-top:20px;">Sent from mnmproconstruction.com contact form</p>
        `,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Resend API error:", errorBody);
      return {
        success: false,
        message: "Something went wrong. Please call us at (979) 587-3639.",
      };
    }

    return {
      success: true,
      message:
        "Message received! Michael will get back to you within 24 hours.",
    };
  } catch (error) {
    console.error("Form submission error:", error);
    return {
      success: false,
      message: "Something went wrong. Please call us at (979) 587-3639.",
    };
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function submitApplication(
  _prevState: ApplicationFormState,
  formData: FormData
): Promise<ApplicationFormState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() ?? "";
  const position = (formData.get("position") as string | null)?.trim() ?? "";
  const experience =
    (formData.get("experience") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";
  const resume = formData.get("resume");

  // Required: name, phone, position, experience
  if (!name || !phone || !position || !experience) {
    return {
      success: false,
      message:
        "Please fill in your name, phone, position, and a quick note about your experience.",
    };
  }

  // Resume validation (optional — applicants can apply without one, but if
  // included it must meet the constraints).
  let resumeAttachment: { filename: string; content: string } | null = null;

  if (resume instanceof File && resume.size > 0) {
    if (resume.size > RESUME_MAX_BYTES) {
      return {
        success: false,
        message: "Resume must be 5 MB or smaller.",
      };
    }

    const lowerName = resume.name.toLowerCase();
    const extensionOk = RESUME_ALLOWED_EXTENSIONS.some((ext) =>
      lowerName.endsWith(ext)
    );
    const typeOk = resume.type ? RESUME_ALLOWED_TYPES.has(resume.type) : false;

    if (!extensionOk && !typeOk) {
      return {
        success: false,
        message: "Resume must be a PDF, DOC, or DOCX file.",
      };
    }

    const buffer = Buffer.from(await resume.arrayBuffer());
    resumeAttachment = {
      filename: resume.name || "resume",
      content: buffer.toString("base64"),
    };
  }

  const apiKey = process.env.RESEND_API_KEY;

  // Fallback path — log and treat as received so the user gets confirmation.
  if (!apiKey) {
    console.log("=== NEW CAREERS APPLICATION ===");
    console.log(`Name: ${name}`);
    console.log(`Phone: ${phone}`);
    console.log(`Email: ${email || "Not provided"}`);
    console.log(`Position: ${position}`);
    console.log(`Experience: ${experience}`);
    console.log(`Message: ${message || "(none)"}`);
    console.log(
      `Resume: ${
        resumeAttachment ? resumeAttachment.filename : "Not attached"
      }`
    );
    console.log("================================");

    return {
      success: true,
      message:
        "Application received! Michael will review it and reach out if it's a fit.",
    };
  }

  try {
    const html = `
      <h2>New Careers Application</h2>
      <table style="border-collapse:collapse;width:100%;max-width:640px;font-family:Arial,sans-serif;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:140px;">Position</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(position)}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Phone</td><td style="padding:8px;border-bottom:1px solid #eee;"><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${
          email
            ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`
            : "Not provided"
        }</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;vertical-align:top;">Experience</td><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(experience).replace(/\n/g, "<br>")}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Anything Else</td><td style="padding:8px;">${
          message ? escapeHtml(message).replace(/\n/g, "<br>") : "(none)"
        }</td></tr>
      </table>
      <p style="color:#888;font-size:12px;margin-top:20px;font-family:Arial,sans-serif;">
        Resume: ${resumeAttachment ? resumeAttachment.filename + " (attached)" : "Applicant did not attach a resume."}<br>
        Sent from mnmproconstruction.com careers form
      </p>
    `;

    interface ResendBody {
      from: string;
      to: string[];
      subject: string;
      html: string;
      reply_to?: string;
      attachments?: { filename: string; content: string }[];
    }

    const body: ResendBody = {
      from: "M&M Pro Careers <onboarding@resend.dev>",
      to: ["mram@mmprocon.com"],
      subject: `New Application: ${name} — ${position}`,
      html,
    };

    if (email) body.reply_to = email;
    if (resumeAttachment) body.attachments = [resumeAttachment];

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Resend API error (application):", errorBody);
      return {
        success: false,
        message:
          "Something went wrong sending your application. Please call us at (979) 587-3639.",
      };
    }

    // Best-effort confirmation to the applicant. Failure here does not affect
    // the overall result — the application has already been delivered.
    if (email) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "M&M Pro Construction <onboarding@resend.dev>",
            to: [email],
            subject: "We got your application — M&M Pro Construction",
            html: `
              <div style="font-family:Arial,sans-serif;color:#1a2238;max-width:560px;">
                <p>Hi ${escapeHtml(name.split(" ")[0] || name)},</p>
                <p>Thanks for applying to M&amp;M Pro Construction for the <strong>${escapeHtml(position)}</strong> role. We received your application and Michael will personally review it.</p>
                <p>If your background looks like a fit, we'll reach out to set up a quick conversation. Either way, we appreciate the time you took to apply.</p>
                <p>If you need to add anything, just reply to this email.</p>
                <p style="margin-top:24px;">— Michael Ramirez<br>M&amp;M Pro Construction<br>(979) 587-3639</p>
              </div>
            `,
          }),
        });
      } catch (confirmErr) {
        console.error("Applicant confirmation send failed:", confirmErr);
      }
    }

    return {
      success: true,
      message:
        "Application received! Michael will review it and reach out if it's a fit.",
    };
  } catch (error) {
    console.error("Application submission error:", error);
    return {
      success: false,
      message:
        "Something went wrong sending your application. Please call us at (979) 587-3639.",
    };
  }
}

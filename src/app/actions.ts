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

// Contact inquiries and careers applications are forwarded to
// mram@mmprocon.com via FormSubmit.co. FormSubmit is free and requires no API
// key — it posts the form fields and any attachment as an email. The very
// first submission triggers an activation email to the recipient; once
// Michael clicks the activation link, every subsequent message arrives
// directly in his inbox.
const FORM_RECIPIENT = "mram@mmprocon.com";
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/${FORM_RECIPIENT}`;

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

  // Send email via FormSubmit.co (same setup as the careers form — free,
  // no API key, delivers straight to Michael's inbox).
  const payload = new FormData();
  payload.append("Name", name);
  payload.append("Phone", phone);
  payload.append("Email", email || "Not provided");
  payload.append("Service", service || "Not specified");
  payload.append("Message", message);

  // FormSubmit control fields (all prefixed with underscore).
  payload.append(
    "_subject",
    `New Lead: ${name} — ${service || "General Inquiry"}`
  );
  payload.append("_template", "table");
  payload.append("_captcha", "false");
  if (email) payload.append("_replyto", email);

  try {
    const res = await fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      body: payload,
      // FormSubmit responds with a 302 redirect to its default thanks page on
      // success. Following the redirect to a 200 lets us check res.ok cleanly.
      redirect: "follow",
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      console.error("FormSubmit error:", res.status, errorBody);
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
  let resumeFile: File | null = null;

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

    resumeFile = resume;
  }

  // Build a fresh FormData payload for FormSubmit. Field names with spaces
  // become the row labels in the email.
  const payload = new FormData();
  payload.append("Position", position);
  payload.append("Name", name);
  payload.append("Phone", phone);
  payload.append("Email", email || "Not provided");
  payload.append("Experience", experience);
  payload.append("Notes", message || "(none)");
  payload.append(
    "Resume",
    resumeFile ? `${resumeFile.name} (attached)` : "Not attached"
  );

  // FormSubmit control fields (all prefixed with underscore).
  payload.append("_subject", `New Application: ${name} — ${position}`);
  payload.append("_template", "table");
  payload.append("_captcha", "false");
  if (email) payload.append("_replyto", email);

  if (resumeFile) {
    payload.append("attachment", resumeFile, resumeFile.name);
  }

  try {
    const res = await fetch(FORMSUBMIT_ENDPOINT, {
      method: "POST",
      body: payload,
      // FormSubmit responds with a 302 redirect to its default thanks page on
      // success. Following the redirect to a 200 lets us check res.ok cleanly.
      redirect: "follow",
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      console.error("FormSubmit error:", res.status, errorBody);
      return {
        success: false,
        message:
          "Something went wrong sending your application. Please call us at (979) 587-3639.",
      };
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

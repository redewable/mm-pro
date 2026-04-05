"use server";

interface ContactFormState {
  success: boolean;
  message: string;
}

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

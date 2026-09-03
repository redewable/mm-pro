import { readContentUncached } from "@/lib/content/server";
import TestimonialsManager from "./TestimonialsManager";

export const metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  const c = await readContentUncached();
  return <TestimonialsManager initial={c.testimonials} />;
}

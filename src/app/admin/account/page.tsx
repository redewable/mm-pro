import { readContentUncached } from "@/lib/content/server";
import AccountForm from "./AccountForm";

export const metadata = { title: "Password" };

export default async function AccountPage() {
  const c = await readContentUncached();
  return <AccountForm hasCustomPassword={Boolean(c.auth.passwordHash)} envConfigured={Boolean(process.env.ADMIN_PASSWORD)} />;
}

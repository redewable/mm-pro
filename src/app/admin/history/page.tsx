import { getStorage, providerStatus } from "@/lib/storage";
import HistoryManager from "./HistoryManager";

export const metadata = { title: "Version History" };

export default async function HistoryPage() {
  const storage = await getStorage();
  const versions = await storage.listVersions(30).catch(() => []);
  return <HistoryManager versions={versions} provider={providerStatus()} />;
}

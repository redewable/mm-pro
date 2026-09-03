// Small id + slug helpers shared by server and client code.

export function newId(prefix = "id"): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
      : Math.random().toString(36).slice(2, 14);
  return `${prefix}_${rand}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function uniqueSlug(base: string, taken: string[], selfId?: string, ids?: string[]): string {
  const root = slugify(base) || "item";
  let candidate = root;
  let n = 2;
  const isTaken = (s: string) =>
    taken.some((t, i) => t === s && (!selfId || !ids || ids[i] !== selfId));
  while (isTaken(candidate)) {
    candidate = `${root}-${n++}`;
  }
  return candidate;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

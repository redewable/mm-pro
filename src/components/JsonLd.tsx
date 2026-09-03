// Renders one or more JSON-LD objects. Null entries are skipped.
export default function JsonLd({ data }: { data: (object | null | undefined)[] | object | null | undefined }) {
  const list = (Array.isArray(data) ? data : [data]).filter(Boolean) as object[];
  if (!list.length) return null;
  return (
    <>
      {list.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is safe to embed; escape "<" to be safe.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(obj).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}

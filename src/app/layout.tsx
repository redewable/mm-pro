import "./globals.css";

// Root layout is intentionally minimal: the public site shell lives in
// (site)/layout.tsx and the dashboard shell in admin/layout.tsx.
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}

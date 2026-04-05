import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gold rounded flex items-center justify-center">
                <span className="text-navy font-black text-xl">M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight leading-tight">
                  M&amp;M Pro
                </span>
                <span className="text-xs text-white/60 tracking-widest uppercase">
                  Construction
                </span>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Professional general contractor serving College Station, Bryan,
              and the Brazos Valley. Commercial build-outs, outdoor living,
              and custom lighting.
            </p>
            <p className="text-gold text-sm font-medium italic">
              &ldquo;God said, let there be light &mdash; we showed up.&rdquo;
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest uppercase text-gold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/services", label: "Services" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/testimonials", label: "Testimonials" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest uppercase text-gold mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {[
                "Commercial Build-Outs",
                "New Construction",
                "Outdoor Living Spaces",
                "Custom Lighting",
                "Remodeling & Renovation",
                "Concrete & Flatwork",
              ].map((service) => (
                <li key={service}>
                  <span className="text-white/60 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold tracking-widest uppercase text-gold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <a
                  href="tel:9795873639"
                  className="hover:text-gold transition-colors"
                >
                  (979) 587-3639
                </a>
              </li>
              <li>College Station, TX</li>
              <li>Brazos, Burleson &amp; Grimes County</li>
              <li className="pt-2">
                <span className="text-white/40 text-xs">
                  Licensed General Contractor &mdash; City of College Station
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} M&amp;M Pro Construction. All
            rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            General Contractor &bull; College Station, TX
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/mm-pro-logo.png"
                alt="M&M Pro Construction"
                width={36}
                height={36}
                className="w-9 h-9"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight leading-tight">
                  M&amp;M Pro
                </span>
                <span className="text-[10px] text-white/50 tracking-[0.2em] uppercase">
                  Construction
                </span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Professional general contractor serving College Station, Bryan,
              and the Brazos Valley. Commercial build-outs, outdoor living
              spaces, and custom lighting.
            </p>
            <p className="text-gold/80 text-sm italic">
              &ldquo;God said, let there be light &mdash; we showed up.&rdquo;
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-6">
              Company
            </h3>
            <ul className="space-y-4">
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
                    className="text-white/50 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-6">
              Services
            </h3>
            <ul className="space-y-4">
              {[
                "Commercial Build-Outs",
                "New Construction",
                "Outdoor Living Spaces",
                "Custom Lighting",
                "Remodeling & Renovation",
                "Concrete & Flatwork",
              ].map((service) => (
                <li key={service}>
                  <span className="text-white/50 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-white/30 mb-6">
              Contact
            </h3>
            <div className="space-y-4 text-sm">
              <a
                href="tel:9795873639"
                className="block text-white hover:text-gold transition-colors font-medium"
              >
                (979) 587-3639
              </a>
              <p className="text-white/50">College Station, TX</p>
              <p className="text-white/50">
                Brazos, Burleson &amp; Grimes County
              </p>
              <div className="pt-4 border-t border-white/10">
                <p className="text-white/30 text-xs">
                  Licensed General Contractor
                </p>
                <p className="text-white/30 text-xs">
                  City of College Station
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} M&amp;M Pro Construction. All
            rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            College Station, TX &bull; Brazos Valley
          </p>
        </div>
      </div>
    </footer>
  );
}

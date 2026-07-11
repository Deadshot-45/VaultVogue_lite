import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--gold-faint)] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4 pb-12 border-b border-[var(--gold-faint)]">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col items-start">
              <h3 className="font-cormorant text-2xl font-light tracking-[0.1em] text-[var(--brand-text)] leading-none">
                Vault-Vogue
              </h3>
              <span className="text-[7px] font-bold uppercase tracking-[0.45em] text-[var(--gold)] mt-0.5 leading-none">
                Maison
              </span>
            </Link>
            <div className="gold-divider" />
            <p className="text-xs leading-relaxed text-[var(--slogan-text)] max-w-xs pt-2">
              An editorial perspective on modern luxury. Curated collections crafted with natural fibers, structural silhouettes, and restrained details.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 className="section-label">Collections</h4>
            <ul className="mt-5 space-y-3 text-xs text-muted-foreground">
              <li>
                <Link href="/women" className="transition-colors hover:text-[var(--gold)] link-underline">Women's Collection</Link>
              </li>
              <li>
                <Link href="/men" className="transition-colors hover:text-[var(--gold)] link-underline">Men's Collection</Link>
              </li>
              <li>
                <Link href="/kids" className="transition-colors hover:text-[var(--gold)] link-underline">Kids' Collection</Link>
              </li>
              <li>
                <Link href="/cart" className="transition-colors hover:text-[var(--gold)] link-underline">Winter Edit</Link>
              </li>
            </ul>
          </div>

          {/* Client Care */}
          <div>
            <h4 className="section-label">Client Care</h4>
            <ul className="mt-5 space-y-3 text-xs text-muted-foreground">
              <li>
                <Link href="/shipping" className="transition-colors hover:text-[var(--gold)] link-underline">Complimentary Delivery</Link>
              </li>
              <li>
                <Link href="/returns" className="transition-colors hover:text-[var(--gold)] link-underline">Returns & Alterations</Link>
              </li>
              <li>
                <Link href="/contact-us" className="transition-colors hover:text-[var(--gold)] link-underline">Private Appointments</Link>
              </li>
              <li>
                <Link href="/faqs" className="transition-colors hover:text-[var(--gold)] link-underline">Maison FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Atelier locations */}
          <div>
            <h4 className="section-label">Atelier</h4>
            <ul className="mt-5 space-y-3 text-xs text-muted-foreground">
              <li className="text-[var(--brand-text)] font-medium">Paris — <span className="text-xs text-muted-foreground font-normal">Rue du Faubourg Saint-Honoré</span></li>
              <li className="text-[var(--brand-text)] font-medium">Milan — <span className="text-xs text-muted-foreground font-normal">Via Monte Napoleone</span></li>
              <li className="text-[var(--brand-text)] font-medium">New York — <span className="text-xs text-muted-foreground font-normal">Fifth Avenue</span></li>
              <li className="text-[var(--brand-text)] font-medium">Tokyo — <span className="text-xs text-muted-foreground font-normal">Ginza Ward</span></li>
            </ul>
          </div>

        </div>

        {/* Legal Bar & Socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 text-[11px] text-[var(--slogan-text)]">
          <p>&copy; {new Date().getFullYear()} Vault-Vogue Maison. All rights reserved.</p>

          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--gold)] transition-colors" aria-label="Instagram">
              <Instagram className="h-4.5 w-4.5" />
            </a>
            <a href="#" className="hover:text-[var(--gold)] transition-colors" aria-label="Facebook">
              <Facebook className="h-4.5 w-4.5" />
            </a>
            <a href="#" className="hover:text-[var(--gold)] transition-colors" aria-label="Twitter">
              <Twitter className="h-4.5 w-4.5" />
            </a>
            <a href="#" className="hover:text-[var(--gold)] transition-colors" aria-label="Youtube">
              <Youtube className="h-4.5 w-4.5" />
            </a>
          </div>

          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-[var(--gold)] transition-colors">Privacy Policy</Link>
            <span>&bull;</span>
            <Link href="/terms-and-conditions" className="hover:text-[var(--gold)] transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

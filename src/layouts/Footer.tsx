import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="sale-theme" style={{ borderTop: "1px solid var(--gold-faint)" }}>
      <div className="mx-auto w-full overflow-x-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3
              className="font-cormorant text-2xl font-medium tracking-wide text-foreground"
            >
              Vault Vogue
            </h3>
            <div className="gold-divider" />
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Premium fashion curated for modern lifestyles. Discover quality,
              comfort, and timeless style.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="section-label">Shop</h4>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/men" className="transition-colors duration-200 hover:text-foreground">Men</Link>
              </li>
              <li>
                <Link href="/women" className="transition-colors duration-200 hover:text-foreground">Women</Link>
              </li>
              <li>
                <Link href="/kids" className="transition-colors duration-200 hover:text-foreground">Kids</Link>
              </li>
              <li>
                <Link href="/sale" className="transition-colors duration-200 hover:text-foreground">Sale</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="section-label">Support</h4>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/contact-us" className="transition-colors duration-200 hover:text-foreground">Contact Us</Link>
              </li>
              <li>
                <Link href="/faqs" className="transition-colors duration-200 hover:text-foreground">FAQs</Link>
              </li>
              <li>
                <Link href="/returns" className="transition-colors duration-200 hover:text-foreground">Returns</Link>
              </li>
              <li>
                <Link href="/shipping" className="transition-colors duration-200 hover:text-foreground">Shipping</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="section-label">Legal</h4>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy-policy" className="transition-colors duration-200 hover:text-foreground">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="transition-colors duration-200 hover:text-foreground">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="transition-colors duration-200 hover:text-foreground">Refund Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="gold-divider-full mt-12" />
        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-sm text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} Vault Vogue. All rights reserved.</p>

          <div className="flex gap-5">
            <span className="cursor-pointer transition-colors duration-200 hover:text-foreground">
              <Instagram className="h-5 w-5" />
            </span>
            <span className="cursor-pointer transition-colors duration-200 hover:text-foreground">
              <Facebook className="h-5 w-5" />
            </span>
            <span className="cursor-pointer transition-colors duration-200 hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

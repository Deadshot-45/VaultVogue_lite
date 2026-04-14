import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-ring sale-theme">
      <div className="mx-auto w-full overflow-x-hidden px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-foreground">Vault Vogue</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Premium fashion curated for modern lifestyles. Discover quality,
              comfort, and timeless style.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold uppercase text-foreground">
              Shop
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="cursor-pointer hover:text-sale-red-600">
                <Link href={"/men"}>Men</Link>
              </li>
              <li className="cursor-pointer hover:text-sale-red-600">
                <Link href={"/women"}>Women</Link>
              </li>
              <li className="cursor-pointer hover:text-sale-red-600">
                <Link href={"/kids"}>Kids</Link>
              </li>
              <li className="cursor-pointer hover:text-sale-red-600">
                <Link href={"/sale"}>Sale</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold uppercase text-foreground">
              Support
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="cursor-pointer hover:text-sale-red-600">
                <Link href="/contact-us">Contact Us</Link>
              </li>
              <li className="cursor-pointer hover:text-sale-red-600">
                <Link href="/faqs">FAQs</Link>
              </li>
              <li className="cursor-pointer hover:text-sale-red-600">
                <Link href="/returns">Returns</Link>
              </li>
              <li className="cursor-pointer hover:text-sale-red-600">
                <Link href="/shipping">Shipping</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase text-foreground">
              Legal
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="cursor-pointer hover:text-sale-red-600">
                <Link href="/privacy-policy">Privacy Policy</Link>
              </li>
              <li className="cursor-pointer hover:text-sale-red-600">
                <Link href="/terms-and-conditions">Terms & Conditions</Link>
              </li>
              <li className="cursor-pointer hover:text-sale-red-600">
                <Link href="/refund-policy">Refund Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
          <p>
            (c) {new Date().getFullYear()} Vault Vogue. All rights reserved.
          </p>

          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-sale-red-600">
              <Instagram />
            </span>
            <span className="cursor-pointer hover:text-sale-red-600">
              <Facebook />
            </span>
            <span className="cursor-pointer hover:text-sale-red-600">
              <Twitter />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

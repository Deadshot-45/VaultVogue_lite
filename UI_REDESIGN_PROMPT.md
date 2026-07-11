# UI Redesign Prompt — StyleHub Luxury Maison

> A complete, production-ready prompt for redesigning a luxury fashion e-commerce site.
> Hand this to a developer or AI to reproduce the StyleHub redesign.

---

## The Prompt

**Project:** Redesign the UI for "StyleHub," a luxury fashion maison selling clothing and accessories for men, women, and kids. Build it as a fullstack Next.js application with PostgreSQL (Drizzle ORM) backend support. The design language is **quiet luxury** — editorial, restrained, and premium.

### 1. Design Vision

Create a **luxury minimal** shopping experience inspired by the world's most refined fashion houses. The aesthetic should feel like a Parisian atelier — warm cream backgrounds, gold accents, editorial serif typography, generous whitespace, and glassmorphic surfaces. Every interaction should feel deliberate and unhurried.

**Design principles:**
- **Editorial typography** — Montserrat with wide letter-spacing, light weights for headings, uppercase section labels
- **Quiet luxury palette** — warm gold (#8a6a42) accent on cream (#f5f0ea) backgrounds, never loud
- **Glassmorphism** — frosted surfaces with backdrop-blur for cards, header, and toasts
- **Restrained motion** — slow, smooth transitions (0.3s ease), subtle hover lifts, animated underlines
- **Dark mode** — full theme support with warm gold tones on near-black
- **Accessible** — semantic HTML, keyboard navigable, WCAG-compliant contrast
- **Type-safe** end to end with TypeScript

### 2. Design System (CSS Variables)

The design system uses CSS custom properties with OKLCH color space for perceptual uniformity. Both light and dark themes are defined.

**Light theme:**
```css
--background: oklch(1 0 0);           /* Pure white */
--foreground: oklch(0.145 0 0);       /* Near black */
--primary: oklch(0.205 0 0);          /* Dark */
--border: oklch(0.922 0 0);           /* Light gray */
--gold: #8a6a42;                       /* Brand gold */
--bg: #f5f0ea;                         /* Warm cream */
--brand-text: #2e1f0e;                /* Deep brown text */
--slogan-text: rgba(80, 55, 28, 0.55);/* Muted brown */
--gold-soft: rgba(138, 106, 66, 0.5); /* Semi-transparent gold */
--gold-faint: rgba(138, 106, 66, 0.12);/* Very light gold */
--gold-glow: rgba(138, 106, 66, 0.08);/* Glow effect */
--sale-red-500: oklch(0.637 0.237 25.331); /* Sale accent */
```

**Dark theme:**
```css
--background: oklch(0.145 0.02 25.326);  /* Warm near-black */
--foreground: oklch(0.985 0.01 25.326); /* Warm white */
--gold: #d4b796;                         /* Lighter gold for dark */
--bg: #0a0a08;                           /* Near black */
--brand-text: #e8d9c4;                   /* Cream text */
```

**Color roles:**
- **Gold** (`--gold`): Primary brand accent — CTAs, links, icons, hover states
- **Brand text** (`--brand-text`): Primary headings and body
- **Slogan text** (`--slogan-text`): Secondary/descriptive text (muted)
- **Sale red** (`--sale-red-500`): Discount badges and sale emphasis
- **Success** (`--success-500/600`): Positive confirmations
- **Background** (`--bg`): Warm cream surface for sections

### 3. Typography

- **Font family:** Montserrat (loaded via `next/font/google`)
- **Headings:** `font-serif`, weight 300 (light), tight letter-spacing (-0.02em), responsive scaling `clamp(2rem, 5vw, 3.25rem)`
- **Body:** Montserrat, weight 400, `--brand-text` color
- **Section labels:** 0.75rem, weight 500, 0.2em letter-spacing, uppercase, gold color
- **Buttons:** 0.875rem, weight 500, 0.04em letter-spacing

### 4. Component Utilities (in globals.css)

Define these reusable component classes:
- `.btn-primary` — solid gold button, Montserrat, hover lift + gold glow shadow
- `.btn-secondary` — gold-outlined button, fills with gold glow on hover
- `.btn-ghost` — minimal text button, gold glow background on hover
- `.card` — rounded glassmorphic card with gold-faint border, hover lift
- `.card-hover` — interactive card variant
- `.input-field` — Montserrat input with gold focus ring
- `.badge` — uppercase pill badge (gold/sale/new/success variants)
- `.section-title` — editorial heading with light weight
- `.section-subtitle` — muted descriptive text
- `.section-label` — uppercase tracked gold label
- `.gold-divider` / `.gold-divider-full` — thin gold line accents
- `.gradient-text-gold` — gold-to-brand gradient text
- `.glass` — frosted glass surface (light/dark adaptive)
- `.link-underline` — animated underline on hover
- `.product-card` — glassmorphic card with deep shadow
- `.no-scrollbar` — hidden scrollbar utility

### 5. Routes to Implement

| Route | Purpose |
|-------|---------|
| `/` | Storefront home — hero, categories, featured products, USPs, newsletter |
| `/men` | Men's collection — editorial header + product grid |
| `/women` | Women's collection — editorial header + product grid |
| `/kids` | Kids collection — editorial header + product grid |
| `/cart` | Shopping bag — line items, quantity controls, order summary |
| `/login` | Sign-in page — email/password, social login |
| `/register` | Sign-up page — registration form with terms |
| `/api/health` | Database health check endpoint |

### 6. Required Components

**Layout:**
- **Header** — sticky, glassmorphic. Logo with serif "STYLEHUB" + "Maison" subtitle, desktop search, theme toggle (light/dark), wishlist badge, cart badge, user dropdown, mobile hamburger, category nav with "Complimentary Shipping" label
- **Footer** — warm cream background, editorial intro with section-label, 4-column layout (brand, collections, client care, atelier), gold dividers, social icons, legal bar

**Homepage sections:**
- **HeroSection** — gold glow orbs, "Autumn/Winter Collection" badge, "The Art of Quiet Luxury" headline with gradient italic accent, gold divider, dual CTA, stats row with gold dividers, featured edit card with gold gradient
- **CategoryShowcase** — 3 large image cards (Men/Women/Kids) with gold overlays, hover zoom, editorial descriptions
- **FeaturedProducts** — section-label + title + gold divider, responsive grid of 6 ProductCards
- **Features** — cream background, 6 glassmorphic cards with gold icon circles that fill on hover
- **Newsletter** — gold-to-brand gradient section, glassmorphic email form, "Join the Maison" CTA

**Commerce:**
- **ProductCard** — glassmorphic `.product-card`, image with slow zoom, New/Sale badges, gold star ratings, price with strikethrough, wishlist heart toggle, gold add-to-cart button, "View Details" link

**Auth:**
- Login: card with section-label, gold divider, icon-adorned inputs, remember me, forgot password link, Google + Apple buttons, sign-up link
- Register: same editorial structure, name/email/password/confirm, terms checkbox with gold accent

**Cart:**
- Editorial header with gold divider
- Line items in glassmorphic cards with image, category label, name, size/color, price, quantity stepper, remove button
- Sticky order summary: subtotal, complimentary shipping, 8% tax, total, checkout button, complimentary shipping confirmation

### 7. Theme System

Implement a `ThemeProvider` context that:
- Reads stored theme from `localStorage` on mount
- Respects `prefers-color-scheme` for initial value
- Toggles `dark` class on `<html>` element
- Exposes `useTheme()` hook returning `{ theme, toggleTheme }`
- Header includes a Moon/Sun toggle button

### 8. Tech Stack

- **Framework:** Next.js 16+ with App Router
- **Styling:** Tailwind CSS 4 + `tw-animate-css`
- **Icons:** `lucide-react` (tree-shakeable)
- **Language:** TypeScript (strict, 0 errors)
- **Database:** PostgreSQL via Drizzle ORM
- **Images:** `next/image` with Unsplash URLs
- **Font:** Montserrat via `next/font/google`

### 9. Folder Structure

```
src/
  app/
    page.tsx              # Homepage
    layout.tsx            # Root layout (Montserrat font + ThemeProvider + Header/Footer)
    globals.css           # Full design system (theme + components + utilities)
    men/page.tsx
    women/page.tsx
    kids/page.tsx
    cart/page.tsx
    login/page.tsx
    register/page.tsx
    api/health/route.ts
  components/
    header.tsx            # Glassmorphic nav with theme toggle
    footer.tsx            # Editorial footer
    hero-section.tsx      # Luxury hero
    category-showcase.tsx # 3 category cards
    featured-products.tsx # Product grid
    product-card.tsx      # Glassmorphic product card
    features.tsx          # USP cards
    newsletter.tsx        # Email subscription
  context/
    theme-context.tsx     # ThemeProvider + useTheme hook
  db/
    index.ts
    schema.ts
```

### 10. Sample Product Data

Each category page renders 8 luxury products with elevated naming (e.g., "Cashmere Crew Knit," "Silk Slip Dress," "Heritage Wool Coat"). Prices in luxury range ($65–$1,100). Use Unsplash image URLs sized `?w=500&h=500&fit=crop`. Include varied `isNew` and `isSale` flags.

### 11. Acceptance Criteria

- [ ] All 7 pages render without errors
- [ ] Homepage contains all 5 sections (hero, categories, featured, features, newsletter)
- [ ] Header is sticky with glassmorphism and working theme toggle
- [ ] Dark mode persists across page reloads
- [ ] ProductCard shows rating, price, badges, and hover actions
- [ ] Cart page calculates subtotal, complimentary shipping, tax, and total
- [ ] Login and Register forms have icon-adorned inputs and editorial structure
- [ ] Montserrat font loads and applies across all components
- [ ] Gold accent color used consistently (no orange/slate from previous design)
- [ ] Fully responsive from 375px to 1536px+
- [ ] `npx next typegen` succeeds
- [ ] `tsc --noEmit` reports 0 errors
- [ ] `npm run build` succeeds
- [ ] `/api/health` returns `{"ok": true}`

### 12. Out of Scope (Future Work)

- Backend product CRUD
- Real authentication & session management
- Shopping cart state persistence (Context/Redux)
- Checkout & payment integration
- Search functionality
- Filtering & sorting logic
- Product detail pages
- Order management
- Admin dashboard
- Luxury toast notifications (CSS defined but not wired to Sonner)

---

## TL;DR (Short Version)

> Redesign a luxury fashion e-commerce site ("StyleHub Maison") in Next.js 16 + Tailwind CSS 4 + TypeScript. Use a quiet luxury design system: warm gold (#8a6a42) accent on cream (#f5f0ea) backgrounds, Montserrat font, editorial typography with uppercase section labels, glassmorphic cards, gold dividers, and full dark mode support via a ThemeProvider context. Build 7 pages (home, men, women, kids, cart, login, register) with a sticky glass header (including theme toggle), editorial footer, luxury hero, category showcase, featured product grid, reusable glassmorphic ProductCard, features section, and gradient newsletter. Install `lucide-react` and `tw-animate-css`. Use OKLCH color variables for theming. All builds and type checks must pass.

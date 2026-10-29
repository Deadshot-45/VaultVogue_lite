# Project Architecture

Vault Vogue uses the Next.js App Router. Route groups keep URL structure separate from layout concerns.

```text
src/
  app/                    # Routes, layouts, metadata, and route handlers
    (auth)/                # Authentication routes
    (shop)/                # Customer storefront routes
    admin/                 # Admin routes and protected layout
    seller/                # Seller portal routes and layout
  features/                # Product-domain modules
    admin/components/
    auth/components/
    checkout/components/
    products/components/
    seller/components/
    storefront/components/
  components/              # Cross-feature reusable UI
    feedback/              # Loading, error, search, and modal UI
    layout/                # Header, footer, transitions, and layout controls
    navigation/            # Shared navigation and sidebar components
    ui/                    # Design-system primitives
  lib/                     # Shared application logic
    services/              # API clients and server fetch helpers
    queries/               # React Query hooks
    store/                 # Redux setup and slices
    utility/               # Pure shared helpers and supporting types
  assets/                  # Product-owned static assets and data
  hooks/                   # Generic reusable React hooks
  types/                   # Cross-feature TypeScript types
  legacy/                  # Retained inactive legacy code; never imported by routes
```

## Naming

- Use lowercase kebab-case for new file names: `product-grid.tsx`, `use-cart.ts`.
- Name React components in PascalCase and hooks with a `use` prefix.
- Put a component inside `features/<domain>/components` when it belongs to one product area.
- Keep `components/ui` reserved for reusable, product-agnostic primitives.
- Keep fetch clients in `lib/services` and client-side request state in `lib/queries`.
- Keep route files thin: page composition belongs in feature components and data access belongs in `lib`.

## Route Rules

- Add customer-facing pages under `app/(shop)`.
- Add unauthenticated account flows under `app/(auth)`.
- Keep admin and seller layouts within their own route trees so guards and navigation remain isolated.
- Do not add a `src/pages` directory. The archived implementation was moved to `src/legacy/pages` so Next does not register duplicate Pages Router routes.

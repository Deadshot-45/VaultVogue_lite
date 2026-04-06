# Vault Vogue Lite

Vault Vogue Lite is a Next.js storefront built with TypeScript, Tailwind CSS, and the App Router.

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run start
```

## Vercel

This project is ready for Vercel as a standard Next.js app.

- Framework preset: `Next.js`
- Build command: `npm run build`
- Output is handled automatically by Next.js

## Notes

- The app uses the `src/app` directory for routing.
- Shared providers live in [`src/app/providers.tsx`](src/app/providers.tsx).
- The main storefront shell is in [`src/app/main-layout.tsx`](src/app/main-layout.tsx).

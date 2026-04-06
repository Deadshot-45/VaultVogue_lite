# Vault Vogue Lite

Vault Vogue Lite is a fashion storefront built with Next.js, TypeScript, Tailwind CSS, and the App Router. It includes shop pages, auth pages, product browsing, cart UI, and a reusable component structure for expanding the storefront.

## Features

- Next.js App Router structure
- Shop pages for home, men, women, kids, and cart
- Authentication pages for login and create account
- Shared layout and UI components
- Cart state and product browsing flow
- Tailwind CSS v4 styling
- React Query for server-state handling
- Radix UI-based component primitives

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- React Query
- Axios
- Radix UI
- Lucide and Tabler icons

## Getting Started

### Prerequisites

- Node.js 18 or newer
- `npm`, `pnpm`, or `yarn`

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

```text
src/
  app/              # App Router routes, layouts, and pages
  assets/           # Static images and content data
  components/       # Shared UI and feature components
  context/          # React context state
  hooks/            # Custom hooks
  layouts/          # Reusable layout pieces
  lib/              # API helpers, utilities, and query hooks
  pages/            # Home page sections and supporting components
```

## Main Routes

- `/` storefront home
- `/men`
- `/women`
- `/kids`
- `/carts`
- `/login`
- `/create-account`

## Notes

- Generated build output such as `.next/` is ignored and should not be committed.
- Shared providers are wired through `src/app/providers.tsx`.
- The main storefront shell is assembled in `src/app/main-layout.tsx`.

## Deployment

This project is ready to deploy as a standard Next.js application. On platforms like Vercel, use:

- Build command: `npm run build`
- Start command: `npm run start`


# StyleHub Developer Guide

## Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## Project Structure

```
StyleHub/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── health/          # Health check endpoint
│   │   ├── (pages)
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── men/             # Men's collection
│   │   │   ├── women/           # Women's collection
│   │   │   ├── kids/            # Kids collection
│   │   │   ├── cart/            # Shopping cart
│   │   │   ├── login/           # Sign in page
│   │   │   └── register/        # Sign up page
│   │   ├── layout.tsx           # Root layout with Header/Footer
│   │   └── globals.css          # Global styles & Tailwind
│   ├── components/
│   │   ├── header.tsx           # Navigation header
│   │   ├── footer.tsx           # Footer with links
│   │   ├── hero-section.tsx     # Homepage hero
│   │   ├── category-showcase.tsx # 3 category cards
│   │   ├── featured-products.tsx # Product grid
│   │   ├── product-card.tsx     # Reusable product card
│   │   ├── features.tsx         # USP features section
│   │   └── newsletter.tsx       # Email subscription
│   └── db/
│       ├── index.ts            # Database connection
│       └── schema.ts           # Drizzle ORM schema
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
└── drizzle.config.json
```

## Adding New Features

### Create a New Page
```tsx
// src/app/[route]/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title - StyleHub",
  description: "Page description",
};

export default function PageName() {
  return (
    <main className="min-h-screen bg-white">
      {/* Content */}
    </main>
  );
}
```

### Create a New Component
```tsx
// src/components/new-component.tsx
"use client";  // If using interactivity

import { useState } from "react";
import { SomeIcon } from "lucide-react";

export default function NewComponent() {
  return (
    <div className="your-classes">
      {/* Content */}
    </div>
  );
}
```

### Add Styling
- Use Tailwind utility classes directly
- For complex styles, add to `globals.css` under `@layer components`
- Custom animations go under `@layer utilities`

## Component API

### ProductCard
```tsx
<ProductCard
  id="1"
  name="Product Name"
  category="Men"
  price={49.99}
  originalPrice={79.99}           // Optional
  image="https://..."
  rating={5}                        // 1-5
  reviews={248}
  isNew={true}                      // Optional
  isSale={true}                     // Optional
/>
```

### Features Used

| Feature | Location | Status |
|---------|----------|--------|
| Product Browsing | /men, /women, /kids | ✓ Complete |
| Shopping Cart | /cart | ✓ Complete (UI) |
| User Auth | /login, /register | ✓ Complete (UI) |
| Search | Header | 🔲 Ready for backend |
| Wishlist | Header badge | 🔲 Ready for backend |
| Filters | Category pages | 🔲 Ready for backend |
| Checkout | - | 🔲 In progress |
| Product Details | - | 🔲 To implement |

## Database Integration (Drizzle ORM)

### Query Example
```tsx
// In a Server Component
import { db } from "@/db";
import { products } from "@/db/schema";

export default async function Page() {
  const items = await db.select().from(products).limit(10);
  return (/* ... */);
}
```

### Add New Table
1. Edit `src/db/schema.ts`
2. Run `npx drizzle-kit push` to apply changes
3. Import and use in components

## Styling Guidelines

### Use Predefined Classes
```tsx
// ✓ Good
<button className="btn-primary">Click</button>

// ✗ Avoid custom inline classes
<button className="px-6 py-3 bg-orange-500 text-white rounded-lg...">
```

### Responsive Design Pattern
```tsx
// Mobile-first approach
<div className="
  w-full                    // Mobile: full width
  md:w-1/2                  // Tablet: half width
  lg:w-1/3                  // Desktop: third width
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
">
```

### Common Tailwind Patterns
```tsx
// Sticky header
<header className="sticky top-0 z-50 ...">

// Center content
<div className="flex items-center justify-center">

// Gradient
<div className="bg-gradient-to-br from-blue-50 to-cyan-50">

// Truncate text
<p className="truncate">Long text...</p>

// Group hover
<div className="group hover:bg-slate-50">
  <span className="group-hover:text-orange-600">Text</span>
</div>
```

## Performance Tips

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Pages auto-split in App Router
3. **Server Components**: Use by default, only use "use client" when needed
4. **Lazy Loading**: Built-in with next/dynamic
5. **CSS**: Tailwind purges unused classes in production

## Environment Variables

### Required
```env
DATABASE_URL=postgresql://user:password@localhost:5432/app_db
```

### Optional
```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Testing

### Type Checking
```bash
npm run typecheck
```

### Build Test
```bash
npm run build
```

### Type Generation
```bash
npx next typegen
```

## Common Issues & Solutions

### Issue: Tailwind class not applied
**Solution**: 
- Check class name spelling
- Ensure class is in template string (not outside quotes)
- Rebuild project
- Check tailwind.config.ts content paths

### Issue: Image not showing
**Solution**:
- Ensure image path is correct
- Use absolute URLs for external images
- Check Next.js Image import

### Issue: Component not rendering
**Solution**:
- Check export statement (default vs named)
- Verify import path matches file location
- Check for syntax errors
- Review browser console for errors

## Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Self-Hosted
```bash
npm run build
npm start
```

### Environment Setup
- Set DATABASE_URL
- Set any API keys needed
- Configure NEXT_PUBLIC variables

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes following code style
3. Test: `npm run build` and `npm run typecheck`
4. Commit: `git commit -m "feat: description"`
5. Push: `git push origin feature/name`
6. Create Pull Request

## Code Style

- Use TypeScript for type safety
- Name exports clearly: `export default function ComponentName() { }`
- Use semantic HTML
- Add Tailwind classes in logical groups
- Comment complex logic
- Keep components small and focused

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [Drizzle ORM](https://orm.drizzle.team)

## Support

For issues or questions:
1. Check existing documentation
2. Review similar components
3. Test in isolated component
4. Check browser console for errors
5. Review TypeScript types

---

**Last Updated**: 2024
**Version**: 1.0.0

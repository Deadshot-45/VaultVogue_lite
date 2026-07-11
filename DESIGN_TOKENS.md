# StyleHub Design Tokens & Usage Guide

## Color System

### Primary Palette
```
Slate (Text & Backgrounds)
├── 50:   #f8fafc   (Lightest backgrounds)
├── 100:  #f1f5f9   (Hover states)
├── 200:  #e2e8f0   (Borders)
├── 600:  #475569   (Secondary text)
├── 700:  #334155   (Body text)
├── 900:  #0f172a   (Primary text & headings)
└── 950:  #020617   (Darkest)

Orange (Accent & CTAs)
├── 100:  #ffedd5   (Light backgrounds)
├── 500:  #f97316   (Primary accent)
├── 600:  #ea580c   (Hover state)
└── 700:  #c2410c   (Active state)

Semantic Colors
├── Green 600: #16a34a (Success messages)
├── Red 600:   #dc2626 (Error/delete)
├── Yellow 400: #facc15 (Star ratings)
└── Blue:      Used in category gradients
```

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Size Scale
```
xs:   12px / font-xs
sm:   14px / font-sm
base: 16px / text-base (default)
lg:   18px / text-lg
xl:   20px / text-xl
2xl:  24px / text-2xl
3xl:  30px / text-3xl
4xl:  36px / text-4xl
5xl:  48px / text-5xl
```

### Font Weights
```
Light:   300 (rare, only for placeholders)
Normal:  400 (body text)
Medium:  500 (labels, secondary headings)
Semibold: 600 (card titles, CTAs)
Bold:    700 (main headings)
Extrabold: 800 (hero titles)
```

## Spacing Scale (Tailwind Default)
```
0:    0
1:    4px
2:    8px
3:    12px
4:    16px (common for padding)
6:    24px
8:    32px (section padding)
12:   48px
16:   64px
24:   96px
32:   128px
```

## Component Sizing

### Buttons
```
Small:   px-3 py-1.5 text-sm
Default: px-6 py-3 text-base
Large:   px-8 py-4 text-lg
Full:    w-full
```

### Spacing
```
Section padding:     py-16 sm:py-24
Container max-width: max-w-7xl
Card padding:        p-6
Input height:        py-3
Icon size:           h-5 w-5 (default)
```

## Border Radius

```
sm:   rounded-md     (4px, for inputs)
md:   rounded-lg     (8px, for cards)
lg:   rounded-xl     (12px, for large elements)
xl:   rounded-2xl    (16px, hero sections)
full: rounded-full   (badges, circles)
```

## Shadows

### Elevation System
```
Default: shadow-sm       (subtle, cards)
Hover:   shadow-lg       (lifted, interactive)
Hero:    shadow-xl       (prominent)
Focus:   shadow-none +   (outline instead)
         ring-2 ring-orange-100
```

## Responsive Breakpoints

```
Mobile:     < 640px   (default)
Tablet:     640px-1023px (sm: and md:)
Desktop:    1024px+   (lg:)
Wide:       1536px+   (2xl:)
```

### Common Patterns
```jsx
// Two columns on mobile, three on tablet, four on desktop
className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"

// Full width on mobile, centered on desktop
className="w-full md:w-auto md:mx-auto"

// Hide on mobile, show on desktop
className="hidden md:block"
```

## Interactive States

### Buttons
```
Default:   bg-orange-500, text-white
Hover:     shadow-xl, scale-105, bg-orange-600
Active:    scale-95 (press down effect)
Disabled:  opacity-50, cursor-not-allowed
Focus:     ring-2 ring-orange-300
```

### Input Fields
```
Default:   border-slate-300, bg-white
Hover:     border-slate-400
Focus:     border-orange-500, ring-2 ring-orange-100
Error:     border-red-500, ring-red-100
Disabled:  bg-slate-50, cursor-not-allowed
```

### Cards
```
Default:   border-slate-200, shadow-sm
Hover:     border-orange-300, shadow-lg
Active:    scale-98
Focus:     ring-2 ring-orange-400
```

## Gradient Patterns

### Background Gradients
```
Hero:           from-orange-50 to-blue-50 (left to right)
Men Category:   from-blue-500 to-cyan-500
Women Category: from-pink-500 to-rose-500
Kids Category:  from-purple-500 to-pink-500
Features BG:    slate-950 (dark)
Newsletter:     from-orange-500 to-orange-600
```

### Text Gradients
```
// Logo/prominent text
background: linear-gradient(to-right, #0f172a, #f97316)
background-clip: text
color: transparent
```

## Spacing & Layout Patterns

### Section Structure
```jsx
<section className="py-16 sm:py-24 bg-white">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

### Grid Layouts
```jsx
// 2 columns (mobile) → 3 (tablet) → 4 (desktop)
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

// Flexible sidebar layout
<div className="grid gap-8 lg:grid-cols-3">
  <div className="lg:col-span-2">{/* Main */}</div>
  <div>{/* Sidebar */}</div>
</div>
```

## Animation Timing

### Default Durations
```
Fast:     duration-150 (input focus)
Normal:   duration-200 (hover effects)
Slow:     duration-300 (transitions)
Slowest:  duration-500 (complex animations)
```

### Easing
```
Default: ease (cubic-bezier(0.4, 0, 0.2, 1))
Linear:  ease-linear
In:      ease-in
Out:     ease-out
InOut:   ease-in-out
```

## Icon Guidelines

### Sizes & Usage
```
Navigation: h-5 w-5    (20px)
Buttons:    h-5 w-5    (20px)
Hero:       h-12 w-12  (48px)
Large:      h-16 w-16  (64px)
Card Badge: h-4 w-4    (16px)
```

### Stroke Width
```
Default:  stroke-width: 2
Thin:     stroke-width: 1.5
Thick:    stroke-width: 2.5
```

## Usage Examples

### Creating a New Button
```jsx
<button className="btn-primary">
  {/* content */}
</button>
```

### Creating a Product Card
```jsx
<div className="card card-hover">
  <div className="relative mb-4 h-64 overflow-hidden rounded-lg">
    {/* Product image */}
  </div>
  {/* Content */}
</div>
```

### Responsive Typography
```jsx
<h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
  {/* Large heading that scales */}
</h1>
```

### Color-Coded Sections
```jsx
<section className="bg-gradient-to-br from-blue-50 to-cyan-50">
  {/* Men's section */}
</section>

<section className="bg-gradient-to-br from-pink-50 to-rose-50">
  {/* Women's section */}
</section>
```

## Best Practices

1. **Consistency**: Always use defined color palette
2. **Hierarchy**: Use size and weight to establish visual hierarchy
3. **Spacing**: Use multiples of 4px for consistent spacing
4. **Contrast**: Ensure text contrast ratio > 4.5:1
5. **Responsiveness**: Always design mobile-first, then enhance
6. **Accessibility**: Use semantic colors for meaning
7. **Performance**: Prefer CSS over images where possible
8. **Maintenance**: Document custom utilities in globals.css

## Custom CSS Classes (in globals.css)

```css
.btn-primary          /* Orange gradient button */
.btn-secondary        /* Outlined button with orange hover */
.btn-ghost            /* Text button with subtle hover */
.card                 /* White card with border and shadow */
.card-hover           /* Makes card interactive */
.input-field          /* Styled input with focus state */
.badge                /* Orange badge component */
.section-title        /* 3xl bold heading */
.section-subtitle     /* Large subtitle text */
.gradient-text        /* Gradient text effect */
.blur-glass           /* Frosted glass effect */
.shine                /* Shimmer animation */
```

## Maintenance Notes

- All colors derive from Tailwind's default palette
- No hardcoded hex values in JSX (use Tailwind classes)
- CSS custom properties in :root for potential theme switching
- Animations defined in @layer utilities for easy customization
- Responsive prefixes used consistently (sm:, md:, lg:)

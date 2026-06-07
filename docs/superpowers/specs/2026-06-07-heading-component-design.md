# Heading Component Design

## Overview
Refactor `resources/js/components/typography/heading.tsx` to use CVA with 3 visual variants, responsive font sizes per heading level, and independent `as` tag override.

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"default" \| "subtle" \| "prominent"` | `"default"` | Visual style variant |
| `level` | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | required | Semantic heading level, also determines default font size |
| `as` | `"h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"` | falls back to `level` | Override rendered HTML tag |
| `className` | `string` | — | Additional classes merged via `cn()` |
| `children` | `React.ReactNode` | required | Heading content |

## Variants

### Visual Variants
- **default**: `font-bold tracking-tight` — standard bold heading
- **subtle**: `font-normal text-muted-foreground` — lighter weight, muted color
- **prominent**: `font-black tracking-tighter` — heaviest weight, tighter tracking

### Level-based Font Sizes (responsive)
| Level | Mobile | `md:` | `lg:` |
|-------|--------|-------|-------|
| 1 | `text-4xl` | `md:text-5xl` | `lg:text-6xl` |
| 2 | `text-3xl` | `md:text-4xl` | `lg:text-5xl` |
| 3 | `text-2xl` | `md:text-3xl` | — |
| 4 | `text-xl` | `md:text-2xl` | — |
| 5 | `text-lg` | `md:text-xl` | — |
| 6 | `text-base` | `md:text-lg` | — |

## Implementation
- Follow exact CVA pattern from `ui/button.tsx` (cva + VariantProps)
- Use `cn()` from `@/lib/utils`
- `as` prop uses a helper: `const Tag = as ?? (`h${level}`)`
- Export `headingVariants` for reuse if needed
- File stays in `resources/js/components/typography/heading.tsx`

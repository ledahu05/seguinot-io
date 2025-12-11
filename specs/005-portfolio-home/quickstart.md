# Quickstart: Portfolio Home - Quarto Game Showcase

**Branch**: `005-portfolio-home` | **Date**: 2025-12-11 | **Plan**: [plan.md](./plan.md)

## Implementation Order

1. **Constants file** - Define static content
2. **SkillTags component** - Render technology badges
3. **QuartoDescription component** - Render description text
4. **QuartoShowcase component** - Main section container
5. **Home page integration** - Add to routes/index.tsx
6. **Testing** - Unit tests for components

## File Creation Order

```text
1. app/lib/constants/quarto-showcase.ts     # Content data
2. app/components/quarto-showcase/SkillTags.tsx
3. app/components/quarto-showcase/QuartoDescription.tsx
4. app/components/quarto-showcase/QuartoShowcase.tsx
5. app/components/quarto-showcase/index.ts  # Barrel export
6. Update: app/routes/index.tsx             # Import and render
```

## Key Implementation Notes

### Animation Pattern

Follow existing section patterns:

```tsx
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: ANIMATION.PROJECT_SLIDE }}
>
```

### Link Components

Internal navigation uses TanStack Router:

```tsx
import { Link } from '@tanstack/react-router'

<Link to="/games/quarto" className="...">
  Play Now
</Link>
```

External links use standard anchor with security attributes:

```tsx
<a
  href="https://github.com/ledahu05/seguinot-io"
  target="_blank"
  rel="noopener noreferrer"
>
  View Source
</a>
```

### Accessibility Requirements

- Section has `id="quarto-showcase"` and `aria-label`
- Links have descriptive text (not "click here")
- Focus states visible (Tailwind `focus:ring-2 focus-visible:outline`)
- Buttons use semantic `<Link>` or `<a>` elements

### Responsive Layout

Mobile-first approach:

```tsx
// Container
className="px-4 py-16 sm:px-6 lg:px-8"

// Max width
className="mx-auto max-w-4xl"

// Text sizing
className="text-2xl sm:text-3xl lg:text-4xl"

// Button layout
className="flex flex-col sm:flex-row gap-4"
```

### Skill Tags

Use existing Shadcn Badge component:

```tsx
import { Badge } from '@/components/ui/badge'

{skillTags.map((tag) => (
  <Badge key={tag.label} variant="secondary">
    {tag.label}
  </Badge>
))}
```

## Testing Strategy

- **Unit tests**: Component rendering, link targets, accessibility attributes
- **No integration tests needed**: Static content only
- **Manual verification**: Visual appearance, responsive behavior, navigation

## Success Verification

After implementation, verify:

1. [ ] QuartoShowcase visible after Hero section
2. [ ] "Play Now" navigates to `/games/quarto`
3. [ ] GitHub link opens in new tab
4. [ ] Skill tags display correctly
5. [ ] Responsive on mobile (320px) to desktop (1920px)
6. [ ] Focus states visible on keyboard navigation
7. [ ] Animations trigger on scroll into view

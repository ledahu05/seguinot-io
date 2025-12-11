# Research: Portfolio Home - Quarto Game Showcase

**Branch**: `005-portfolio-home` | **Date**: 2025-12-11 | **Plan**: [plan.md](./plan.md)

## Clarifications Resolved

*No [NEEDS CLARIFICATION] markers were present in the specification.*

## Codebase Analysis

### Existing Component Patterns

The portfolio site follows a consistent component organization pattern:

```text
app/components/
├── hero/           # Hero section (3 files + barrel)
├── timeline/       # Timeline section (3 files + barrel)
├── skills/         # Skills section (3 files + barrel)
├── projects/       # Projects section (3 files + barrel)
├── contact/        # Contact section (3 files + barrel)
├── shared/         # Reusable components
└── ui/             # Shadcn UI primitives
```

Each section follows the same structure:
- Main container component (e.g., `Hero.tsx`, `ProjectShowcase.tsx`)
- Sub-components for content blocks
- Barrel export via `index.ts`

### Home Page Structure

Current `app/routes/index.tsx` layout:
1. `<Hero />` - Introduction with CTAs
2. `<Timeline />` - Work experience
3. `<SkillsGrid />` - Technical skills
4. `<ProjectShowcase />` - Featured projects
5. `<Contact />` - Contact information

**Insertion Point**: QuartoShowcase should be placed after Hero, before Timeline (per spec FR-008).

### Animation Patterns

All sections use Framer Motion with consistent patterns:
- `initial={{ opacity: 0, y: 20 }}`
- `whileInView={{ opacity: 1, y: 0 }}` or `animate={{ opacity: 1, y: 0 }}`
- `viewport={{ once: true }}`
- Duration from `ANIMATION` constants

### Styling Patterns

Sections use consistent Tailwind classes:
- Container: `px-4 py-16 sm:px-6 lg:px-8`
- Max width: `mx-auto max-w-6xl` or `max-w-4xl`
- Section IDs and aria-labels for accessibility
- Responsive text sizing: `text-3xl sm:text-4xl`

### Dependencies Available

From plan.md constitution check, all dependencies are already installed:
- Framer Motion (animations)
- Lucide React (icons for GitHub, Play)
- TanStack Router (Link component)
- Tailwind CSS (styling)
- Shadcn UI Badge (for skill tags)

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Component location | `app/components/quarto-showcase/` | Follows existing section pattern |
| Animation | Framer Motion `whileInView` | Matches other sections |
| Skill tags | Shadcn `Badge` component | Already used in codebase |
| External link | `target="_blank" rel="noopener"` | Security best practice |
| Internal link | TanStack Router `Link` | Consistent with app routing |

## No Open Questions

All specification requirements are clear and implementable with existing patterns.

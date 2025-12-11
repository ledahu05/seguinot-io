# Quickstart: Quarto Game Rules Page

**Feature**: 004-quarto-rules-page
**Date**: 2025-12-11

## Overview

This document provides a quick reference for implementing the Quarto Rules Page feature.

---

## Quick Links

| Document | Purpose |
|----------|---------|
| [spec.md](./spec.md) | Feature requirements and acceptance criteria |
| [plan.md](./plan.md) | Technical context and project structure |
| [research.md](./research.md) | Technical decisions and rationale |
| [data-model.md](./data-model.md) | TypeScript interfaces and data structures |

---

## Key Files to Create

### Route
```
app/routes/games/quarto/rules.tsx
```

### Components
```
app/features/quarto/components/rules/
├── RulesPage.tsx           # Main layout
├── PieceGrid.tsx           # 16-piece interactive grid
├── PieceTooltip.tsx        # Attribute tooltip
├── BoardWithOverlays.tsx   # Board + winning lines toggle
├── TurnAnimation.tsx       # Animated turn demo
├── ExampleBoard.tsx        # Win/non-win examples
└── index.ts                # Barrel export
```

### Hooks
```
app/features/quarto/hooks/useTurnAnimation.ts
```

### Data
```
app/features/quarto/components/rules/data/
├── exampleBoards.ts
├── winningLines.ts
└── turnAnimationSteps.ts
```

### Tests
```
tests/unit/quarto/rules/
├── PieceGrid.test.tsx
├── TurnAnimation.test.tsx
└── ExampleBoard.test.tsx
```

---

## Key Files to Modify

| File | Change |
|------|--------|
| `app/routes/games/quarto/index.tsx` | Add "How to Play" button linking to `/games/quarto/rules` |

---

## Reused Components (No Changes)

| Component | Location | Usage |
|-----------|----------|-------|
| `Piece3D` | `components/Piece3D.tsx` | Render pieces in grid and examples |
| `Board3D` | `components/Board3D.tsx` | Render board in examples |
| `useReducedMotion` | `hooks/useReducedMotion.ts` | Accessibility for animations |

---

## Implementation Order

1. **Static data files** - Define example boards, winning lines, animation steps
2. **PieceTooltip** - Simple tooltip component
3. **PieceGrid** - Grid of pieces with tooltips
4. **BoardWithOverlays** - Board with line toggle
5. **TurnAnimation** - Animated demo (most complex)
6. **ExampleBoard** - Reusable board with caption
7. **RulesPage** - Compose all sections
8. **Route** - Wire up `/games/quarto/rules`
9. **Menu update** - Add button to index page

---

## Testing Strategy

| Test Type | Focus |
|-----------|-------|
| Unit | PieceGrid hover states, TurnAnimation state transitions |
| Integration | Full page renders, navigation, interactions |
| Accessibility | Keyboard navigation, screen reader labels |

---

## Performance Checklist

- [ ] Lazy load 3D canvas with Suspense
- [ ] Code-split route file
- [ ] Respect `prefers-reduced-motion`
- [ ] Test Lighthouse score (target: 90+ mobile)

---

## Accessibility Checklist

- [ ] All pieces have ARIA labels
- [ ] Tooltips announce on focus
- [ ] Animation controls are keyboard accessible
- [ ] Toggle buttons have proper roles
- [ ] Focus management for modal-like interactions

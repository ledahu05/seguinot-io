# Data Model: Quarto Game Rules Page

**Feature**: 004-quarto-rules-page
**Date**: 2025-12-11

## Overview

This feature is a **stateless informational page** with no persistence requirements. All data is static configuration defined at build time. This document defines the TypeScript interfaces for component props and static data structures.

---

## Entities

### 1. Piece (Reused)

Already defined in `app/features/quarto/types/quarto.types.ts`:

```typescript
interface Piece {
  id: number;           // 0-15, binary encoding of attributes
  color: 'light' | 'dark';
  shape: 'round' | 'square';
  top: 'solid' | 'hollow';
  height: 'tall' | 'short';
}
```

**Usage**: Display all 16 pieces in the interactive grid.

---

### 2. ExampleBoardConfig (New)

Static configuration for example winning/non-winning boards.

```typescript
interface ExampleBoardConfig {
  /** Unique identifier for the example */
  id: string;

  /** Display title (e.g., "Clear Win") */
  title: string;

  /** Explanation caption (e.g., "All 4 pieces are SQUARE") */
  caption: string;

  /** Whether this represents a winning configuration */
  isWin: boolean;

  /** The shared attribute if isWin is true */
  sharedAttribute?: 'color' | 'shape' | 'top' | 'height';

  /** Board state: 16-element array, piece IDs (0-15) or null for empty */
  positions: (number | null)[];

  /** Position indices to highlight (the winning line if applicable) */
  highlightLine?: number[];
}
```

**Validation Rules**:
- `positions.length === 16`
- `highlightLine` values must be 0-15
- If `isWin === true`, `sharedAttribute` and `highlightLine` should be defined

---

### 3. TurnAnimationStep (New)

Represents a step in the turn demonstration animation.

```typescript
type TurnPhase = 'give' | 'place' | 'select';
type Player = 'A' | 'B';

interface TurnAnimationStep {
  /** Which player is active */
  activePlayer: Player;

  /** Current phase of the turn */
  phase: TurnPhase;

  /** Piece ID involved in this step */
  pieceId: number;

  /** Board position (0-15) for placement, null for selection */
  position: number | null;

  /** Duration of this step in milliseconds */
  duration: number;

  /** Caption text to display */
  caption: string;
}
```

**State Transitions**:
```
idle → give → place → select → give (opponent) → place → select → loop
```

---

### 4. WinningLineConfig (New)

Configuration for winning line overlay visualization.

```typescript
interface WinningLineConfig {
  /** Unique identifier */
  id: string;

  /** Display name (e.g., "Row 1", "Diagonal") */
  name: string;

  /** Category for grouping */
  category: 'row' | 'column' | 'diagonal';

  /** Board positions that form this line */
  positions: [number, number, number, number];

  /** SVG path data for overlay rendering */
  svgPath: string;
}
```

**Static Data** (10 lines total):
- 4 rows: positions [0-3], [4-7], [8-11], [12-15]
- 4 columns: positions [0,4,8,12], [1,5,9,13], [2,6,10,14], [3,7,11,15]
- 2 diagonals: positions [0,5,10,15], [3,6,9,12]

---

### 5. RulesSection (New)

Configuration for each section of the rules page.

```typescript
interface RulesSection {
  /** Section identifier for scroll anchoring */
  id: string;

  /** Section headline */
  title: string;

  /** Section content (static text) */
  content: string;

  /** Whether section has interactive elements */
  hasInteractive: boolean;
}
```

---

## Relationships

```
RulesPage
├── Header Section (static)
├── Pieces Section
│   └── PieceGrid
│       └── Piece[16] (reused type)
│           └── PieceTooltip
├── Board Section
│   └── BoardWithOverlays
│       └── WinningLineConfig[10]
├── Turn Section
│   └── TurnAnimation
│       └── TurnAnimationStep[]
├── Winning Section
│   └── ExampleBoard[3-4]
│       └── ExampleBoardConfig
├── Strategy Section (static)
└── Footer Section (static)
```

---

## Static Data Files

All static data will be co-located with components:

```
app/features/quarto/components/rules/
├── data/
│   ├── exampleBoards.ts      # ExampleBoardConfig[]
│   ├── winningLines.ts       # WinningLineConfig[]
│   ├── turnAnimationSteps.ts # TurnAnimationStep[]
│   └── sections.ts           # RulesSection[]
└── ...
```

---

## State Management

**No Redux required**. All state is local:

| State | Scope | Type |
|-------|-------|------|
| Hovered piece | PieceGrid | `useState<number \| null>` |
| Tooltip visible | PieceTooltip | `useState<boolean>` |
| Lines visible | BoardWithOverlays | `useState<boolean>` |
| Animation playing | TurnAnimation | `useState<boolean>` |
| Animation step | TurnAnimation | `useState<number>` |

---

## No Persistence

This feature has no:
- Database entities
- API calls
- Local storage
- Session state
- User-specific data

All data is static and defined at build time.

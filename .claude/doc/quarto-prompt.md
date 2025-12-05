# Quarto Game - Portfolio Feature Specification

## Project Overview

A 3D Quarto board game implementation for the portfolio website, showcasing advanced frontend development skills including real-time multiplayer, AI opponent, state management, and 3D graphics.

---

## Technical Stack

### Core Technologies
- **Framework**: TanStack Start (full-stack), TanStack Router (file-based routing)
- **UI**: React 19, TypeScript 5.x, Tailwind CSS v4, Shadcn UI
- **State Management**: Redux Toolkit (RTK)
- **3D Graphics**: React Three Fiber (R3F) + Drei
- **Animation**: Framer Motion (UI), React Spring (3D)
- **Real-time**: WebSocket (via TanStack Start server functions or native WS)
- **Validation**: Zod

### Architecture Decisions
- RTK for global game state (board, pieces, turns, game mode)
- TanStack Query for server state (matchmaking, leaderboard)
- React Three Fiber for 3D rendering
- WebSocket for real-time multiplayer sync

---

## Game Features

### Game Modes
1. **Local 2-Player**: Two players on the same device
2. **Online Multiplayer**: Real-time via WebSocket
3. **vs AI**: Single player against algorithm (Minimax with alpha-beta pruning)

### Core Mechanics
- 4x4 board with 16 unique pieces
- Piece attributes: Color (light/dark), Shape (round/square), Top (solid/hollow), Height (tall/short)
- Turn-based: Select piece for opponent → Opponent places → Opponent selects piece
- Win conditions: 4 pieces in a row/column/diagonal sharing at least one attribute
- Advanced mode: 2x2 square win condition

### UX Features
- Piece selection highlighting
- Valid placement indicators
- Turn indicator with player info
- Win detection with visual celebration
- Game history/replay
- Undo (local mode only)
- Sound effects (optional, mutable)

---

## AI Image Generation Prompts for BananaPro

> **Asset Directory**: `.claude/doc/images/` (dev) → `public/images/quarto/` (prod)
>
> **Generation Status**: ✅ ALL 13 IMAGES COMPLETE (A-M)

### 1. Game Board Design

**Prompt A - Full Board (Main Asset)**
- **Filename**: `board-isometric.png`
- **Use**: Main 3D reference, hero image
```
Isometric 3D game board for a Quarto strategy game. Elegant wooden 4x4 grid board with subtle wood grain texture, warm honey oak color. Each of the 16 squares has a slight circular indentation to hold pieces. Board sits on a sleek dark walnut pedestal base. Soft studio lighting with gentle shadows. Minimalist luxury aesthetic. Clean background, suitable for web game interface. High detail, photorealistic render style.
```

**Prompt B - Board Close-up (Detail)** ✅
- **Filename**: `board-texture-detail.png`
- **Use**: Wood texture reference for 3D materials
```
Extreme close-up macro shot of a luxury wooden game board surface. Focus on fine honey oak wood grain texture and one circular piece holder carved into the surface. Visible wood grain lines, subtle lacquer reflection, beveled edge detail. Warm amber wood tones. Product photography style, 4K quality, sharp focus on texture details.
```

**Prompt C - Board Top-down**
- **Filename**: `board-topdown.png`
- **Use**: Layout reference, 2D fallback
```
Top-down view of a 4x4 wooden Quarto game board on a dark marble surface. The board is empty, showing 16 circular indentations for pieces. Warm wooden tones contrasting with cool dark marble. Soft directional lighting creating elegant shadows. Minimal, sophisticated aesthetic suitable for a portfolio website. Clean, modern design.
```

---

### 2. Game Pieces Design

**Prompt D - Full Piece Set (All 16 pieces)** ✅
- **Filename**: `pieces-all-16.png`
- **Use**: Complete reference, style guide
```
Exactly 16 wooden game pieces for Quarto board game arranged in a 4x4 grid on white background. Row 1: 4 light maple pieces (tall cylinder solid, tall cylinder hollow, short cylinder solid, short cylinder hollow). Row 2: 4 light maple pieces (tall square solid, tall square hollow, short square solid, short square hollow). Row 3: 4 dark walnut pieces (tall cylinder solid, tall cylinder hollow, short cylinder solid, short cylinder hollow). Row 4: 4 dark walnut pieces (tall square solid, tall square hollow, short square solid, short square hollow). Tall pieces are 2x height of short pieces. Clear geometric shapes - cylinders and square columns only. Polished wood finish, soft studio lighting. Product catalog style, high detail render.
```

**Prompt E - Light Pieces Set (8 pieces)** ✅
- **Filename**: `pieces-light-set.png`
- **Use**: Light wood texture/material reference
```
Set of 8 light maple wood game pieces for Quarto on white background. Pure geometric shapes only - NO bowling pins, NO chess pawns. Four piece types arranged in 2 rows: Row 1: tall cylinder solid top, tall cylinder hollow top, tall square column solid top, tall square column hollow top. Row 2: short cylinder solid top, short cylinder hollow top, short square column solid top, short square column hollow top. Tall pieces are exactly 2x height of short. Smooth polished wood finish, warm natural lighting. Elegant minimalist product photography style. Clean geometric design.
```

**Prompt F - Dark Pieces Set (8 pieces)** ✅
- **Filename**: `pieces-dark-set.png`
- **Use**: Dark wood texture/material reference
```
Set of 8 dark walnut wood game pieces for Quarto on white background. Pure geometric shapes only - NO bowling pins, NO chess pawns. Four piece types arranged in 2 rows: Row 1: tall cylinder solid top, tall cylinder hollow top, tall square column solid top, tall square column hollow top. Row 2: short cylinder solid top, short cylinder hollow top, short square column solid top, short square column hollow top. Tall pieces are exactly 2x height of short. Rich dark wood grain visible, polished finish, soft warm lighting. Luxury product photography aesthetic. Clean geometric minimalist design.
```

**Prompt G - Single Piece Hero Shot**
- **Filename**: `piece-hero.png`
- **Use**: Marketing, loading screen, favicon source
```
Single tall cylindrical wooden game piece, light maple wood, hollowed concave top. Dramatic studio lighting highlighting the wood grain and the depth of the hollow top. Soft shadow beneath. Floating on dark gradient background. Luxury product photography, hero shot style. Ultra high detail.
```

**Prompt H - Pieces in Context**
- **Filename**: `game-in-progress.png`
- **Use**: Tutorial, preview, OG image
```
Close-up of a Quarto game in progress. Four wooden pieces placed on a honey oak board: one dark tall round solid, one light short square hollow, one dark short round hollow, one light tall square solid. Pieces casting soft shadows. Warm ambient lighting. Sophisticated game photography style.
```

---

### 3. UI Elements

**Prompt I - Piece Selection Tray**
- **Filename**: `ui-piece-tray.png`
- **Use**: UI design reference for piece selection panel
```
Elegant wooden tray holding Quarto game pieces. Two-tiered display with light pieces on top shelf, dark pieces on bottom shelf. Dark walnut tray with felt-lined compartments. Soft museum-style lighting. Clean background suitable for game UI overlay. Product display photography.
```

**Prompt J - Winner Celebration**
- **Filename**: `ui-victory-effect.png`
- **Use**: Win screen overlay, celebration animation reference
```
Abstract visualization of victory for a board game. Four glowing wooden pieces aligned diagonally, connected by a subtle golden light beam. Particles of light floating upward. Dark elegant background with soft bokeh. Celebratory but sophisticated mood. Suitable for game victory screen overlay.
```

**Prompt K - Game Logo/Title**
- **Filename**: `logo-quarto.png`
- **Use**: Title screen, branding, navigation
```
Elegant typography logo for "QUARTO" board game. Letters crafted from wood texture - alternating light maple and dark walnut wood grain. Minimalist modern font, clean lines. Subtle 3D depth and soft shadow. Dark background. Suitable for game title screen. High-end brand aesthetic.
```

---

### 4. Background/Environment

**Prompt L - Game Environment**
- **Filename**: `bg-environment.png`
- **Use**: Main game background (blurred)
```
Luxury game room environment for digital board game. Blurred background showing dark marble surface, soft ambient lighting, hints of bookshelves. Shallow depth of field focused on empty center area where game board would be placed. Moody sophisticated atmosphere. Warm accent lighting. Suitable for game UI background.
```

**Prompt M - Abstract Background**
- **Filename**: `bg-abstract.png`
- **Use**: Alternative background, modal overlays
```
Abstract minimalist background for strategy game interface. Subtle gradient from dark charcoal to warm brown. Gentle geometric patterns suggesting wood grain. Soft ambient glow in center. Clean, sophisticated, non-distracting. Suitable for game UI overlay background. 4K resolution.
```

---

## 3D Asset Specifications

For React Three Fiber implementation, the generated images will serve as:
1. **Texture references** for 3D models
2. **Style guides** for procedural geometry
3. **UI design references**

### Piece Geometry (Procedural)
```
Dimensions (relative units):
- Tall pieces: height = 2, Short pieces: height = 1
- Round pieces: radius = 0.4
- Square pieces: width = 0.7
- Hollow depth: 0.3 units
- Base radius/width: slightly larger for stability
```

### Board Geometry (Procedural)
```
- Grid: 4x4, cell size = 1 unit
- Board thickness: 0.3 units
- Cell indentation depth: 0.1 units
- Border width: 0.5 units
- Pedestal: 0.5 units below board
```

---

## Implementation Phases (SpecKit)

### Phase 1: Core Game Logic
- Redux Toolkit store setup
- Game state types and reducers
- Win condition detection
- Piece selection/placement logic
- Turn management

### Phase 2: 3D Visualization
- React Three Fiber setup
- Board component (procedural geometry)
- Piece components (16 variants)
- Camera controls (OrbitControls)
- Lighting setup
- Piece placement animations

### Phase 3: Local Multiplayer
- Player turn UI
- Piece selection from tray
- Board interaction (click to place)
- Win announcement
- New game/reset

### Phase 4: AI Opponent
- Minimax algorithm with alpha-beta pruning
- Difficulty levels (depth limiting)
- AI thinking indicator
- Move delay for UX

### Phase 5: Online Multiplayer
- WebSocket server setup
- Room/match creation
- Real-time state sync
- Reconnection handling
- Player presence

### Phase 6: Polish & UX
- Sound effects
- Enhanced animations
- Responsive design
- Accessibility
- Performance optimization

---

## File Structure (Proposed)

```
app/
├── routes/
│   └── games/
│       └── quarto/
│           ├── index.tsx          # Game entry/mode selection
│           ├── play.tsx           # Main game view
│           └── lobby.tsx          # Multiplayer lobby
├── features/
│   └── quarto/
│       ├── store/
│       │   ├── quartoSlice.ts     # RTK slice
│       │   └── selectors.ts
│       ├── components/
│       │   ├── Board3D.tsx
│       │   ├── Piece3D.tsx
│       │   ├── PieceTray.tsx
│       │   ├── GameStatus.tsx
│       │   └── GameControls.tsx
│       ├── hooks/
│       │   ├── useQuartoGame.ts
│       │   ├── useAI.ts
│       │   └── useMultiplayer.ts
│       ├── ai/
│       │   ├── minimax.ts
│       │   └── evaluation.ts
│       ├── types/
│       │   └── quarto.types.ts
│       └── utils/
│           ├── winDetection.ts
│           └── pieceAttributes.ts
```

---

## Success Metrics

- **Performance**: 60fps on mid-range devices
- **Load time**: < 3s initial load
- **Accessibility**: WCAG 2.1 AA compliant for UI elements
- **Mobile**: Fully responsive, touch-friendly
- **SEO**: Proper meta tags for portfolio showcase

---

## Next Steps

1. Run `/speckit.specify` with this document as input
2. Generate design assets using BananaPro prompts above
3. Follow SpecKit workflow for implementation planning
4. Iterative development through phases

---

## BananaPro Prompt Summary

| ID | Filename | Asset | Status |
|----|----------|-------|--------|
| A | `board-isometric.png` | Full Board | ✅ |
| B | `board-texture-detail.png` | Board Close-up | ✅ |
| C | `board-topdown.png` | Board Top-down | ✅ |
| D | `pieces-all-16.png` | All 16 Pieces | ✅ |
| E | `pieces-light-set.png` | Light Pieces | ✅ |
| F | `pieces-dark-set.png` | Dark Pieces | ✅ |
| G | `piece-hero.png` | Hero Piece | ✅ |
| H | `game-in-progress.png` | Game In Progress | ✅ |
| I | `ui-piece-tray.png` | Piece Tray | ✅ |
| J | `ui-victory-effect.png` | Victory Effect | ✅ |
| K | `logo-quarto.png` | Logo | ✅ |
| L | `bg-environment.png` | Environment | ✅ |
| M | `bg-abstract.png` | Abstract BG | ✅ |

### All Files Complete (`.claude/doc/images/`)
```
bg-abstract.png
bg-environment.png
board-isometric.png
board-texture-detail.png
board-topdown.png
game-in-progress.png
logo-quarto.png
piece-hero.png
pieces-all-16.png
pieces-dark-set.png
pieces-light-set.png
ui-piece-tray.png
ui-victory-effect.png
```

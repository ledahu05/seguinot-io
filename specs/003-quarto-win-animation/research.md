# Research: Quarto Win/Lose Celebration Animations (tsParticles)

**Feature**: 003-quarto-win-animation
**Date**: 2025-12-11 (Updated)
**Status**: Complete

## Executive Summary

Replace the existing custom canvas-based `FireworkCanvas.tsx` with `@tsparticles/fireworks` library per user request. The tsParticles approach provides superior visual effects through declarative configuration.

## Research Questions

### 1. Particle Animation Approach

**Question**: What's the best way to implement firework particle effects in a React/Three.js application?

**Decision**: Use `@tsparticles/fireworks` bundle with `@tsparticles/react` wrapper

**Rationale**:
- User explicitly dissatisfied with current custom canvas implementation
- tsParticles provides pre-built firework presets and effects
- Declarative JSON configuration vs imperative canvas code
- Built-in physics, collision detection, and burst effects
- Better visual quality out of the box
- Active maintenance and community support

**Alternatives Considered**:
- **Keep custom canvas implementation**: Rejected - User explicitly dissatisfied with visual quality
- **tsparticles-slim**: Rejected - Doesn't include fireworks-specific features (emitters, destroy, life updaters)
- **@tsparticles/preset-fireworks**: Considered - Requires more setup, less convenient than bundle
- **canvas-confetti**: Rejected - Simpler but lacks the full firework effect with rockets

### 2. Package Selection & Bundle Size

**Question**: What packages should we use and what's the bundle impact?

**Decision**: Use `@tsparticles/fireworks` bundle with `@tsparticles/react`

**Bundle Size Analysis**:
| Package | Unpacked | Est. Gzipped |
|---------|----------|--------------|
| @tsparticles/fireworks | 1.28 MB | ~35-50 KB |
| @tsparticles/react | ~50 KB | ~10 KB |
| **Total estimate** | ~1.4 MB | ~45-60 KB |

**Rationale**:
- The fireworks bundle includes all necessary features (emitters, destroy, life updaters)
- Pre-configured for firework effects
- Well-maintained (v3.9.1 as of Dec 2025)

**Constitution Impact**:
- VI. Minimal Dependencies: Adding ~45-60KB gzipped. **Justified** by user request and improved UX.
- V. Performance: Tree-shakeable, lazy-loadable. Will monitor FPS.

### 3. Animation Timing Control

**Question**: How to manage animation duration (5-10 seconds) with proper cleanup?

**Decision**: Existing `useWinAnimation` hook with setTimeout and cleanup (no changes needed)

**Rationale**:
- tsParticles doesn't have a built-in "animation complete" event
- External setTimeout provides reliable duration control
- Existing hook pattern works with new implementation
- Clean integration with Redux state

**Alternatives Considered**:
- **Web Animations API**: More complex, limited browser support for some features
- **Framer Motion AnimatePresence**: Good for enter/exit, but not duration-based sequences
- **tsParticles lifecycle events**: No reliable "done" event for fireworks preset

### 4. Defeat Animation Style

**Question**: What visual effect conveys defeat without being offensive or jarring?

**Decision**: Keep existing `DefeatOverlay.tsx` with custom canvas (no tsParticles needed)

**Rationale**:
- Current defeat animation (dark overlay + falling particles) is functional
- User only complained about firework quality, not defeat animation
- Keeps tsParticles dependency focused on win celebration
- Less code to change, lower risk

**Current Implementation** (unchanged):
- Overlay: `rgba(0, 0, 0, 0.6)` fading in over 500ms
- Particles: Gray/blue, falling downward with slight drift
- Text: "Opponent wins!" with Framer Motion fade-in

### 5. Reduced Motion Support

**Question**: How to handle users with prefers-reduced-motion preference?

**Decision**: No changes needed - existing `useReducedMotion` hook pattern works

**Rationale**:
- `WinCelebration.tsx` already checks `useReducedMotion`
- Shows static banner when reduced motion is preferred
- tsParticles component won't be rendered, avoiding any motion

**Existing Pattern** (unchanged):
```typescript
if (prefersReducedMotion) {
  return <StaticWinBanner />; // No particles, just text
}
return <TsParticlesFireworks {...props} />;
```

### 6. Auto-Detection Implementation (Unchanged)

**Question**: Where should automatic Quarto detection happen?

**Decision**: Already implemented in Redux reducer - no changes needed

**Existing Implementation**:
- `placePiece` reducer already calls `findWinningLine()`
- Sets `animation.status = 'playing'` when win detected
- No "Call Quarto" button exists in current implementation

### 7. Online Multiplayer Animation Sync (Unchanged)

**Question**: How to ensure winner sees fireworks and loser sees defeat?

**Decision**: Already implemented - no changes needed

**Existing Implementation**:
- PartyKit broadcasts `GAME_OVER` with winnerId
- Client compares `winnerId` to local `playerId`
- Animation type set in Redux based on comparison

## tsParticles Configuration

### React 19 Integration Pattern

```typescript
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFireworksBundle } from "@tsparticles/fireworks";

// Initialize once at app level or lazily
const initPromise = initParticlesEngine(async (engine) => {
  await loadFireworksBundle(engine);
});

// Component usage
export function TsParticlesFireworks({ isPlaying, onComplete, duration }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initPromise.then(() => setReady(true));
  }, []);

  if (!isPlaying || !ready) return null;

  return (
    <Particles
      id="fireworks"
      options={fireworksOptions}
    />
  );
}
```

### Fireworks Configuration Options

```typescript
const fireworksOptions = {
  fullScreen: { enable: false }, // Overlay mode
  background: { color: "transparent" },
  emitters: {
    direction: "top",
    life: { duration: 0.1, delay: 0.1 },
    rate: { delay: 0.15, quantity: 1 },
    size: { width: 100, height: 0 },
    position: { y: 100, x: 50 }
  },
  particles: {
    number: { value: 0 },
    destroy: {
      mode: "split",
      split: {
        count: 1,
        factor: { value: 0.333333 },
        rate: { value: 100 },
        particles: {
          color: { value: ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"] },
          number: { value: 0 },
          opacity: { value: { min: 0.1, max: 1 }, animation: { enable: true } },
          shape: { type: "circle" },
          size: { value: { min: 2, max: 3 } }
        }
      }
    },
    life: { count: 1, duration: { value: { min: 1, max: 2 } } },
    shape: { type: "line" },
    size: { value: { min: 0.1, max: 50 }, animation: { enable: true } },
    stroke: { color: { value: "#ffffff" }, width: 1 },
    rotate: { path: true },
    move: {
      enable: true,
      gravity: { enable: true, acceleration: 15 },
      speed: { min: 10, max: 20 },
      outModes: { default: "destroy", top: "none" }
    }
  }
};
```

### Available Customization Properties

| Property | Description | Range |
|----------|-------------|-------|
| `background` | Canvas background | CSS color / transparent |
| `brightness` | Particle brightness offset | -100 to 100 |
| `gravity` | Particle gravity | Number (default: 15) |
| `minHeight` | Min explosion height | Lower = higher on screen |
| `rate` | Explosion frequency | `{ delay, quantity }` |
| `saturation` | Color saturation | -100 to 100 |

## Performance Considerations

### tsParticles Performance

- **Built-in optimizations**: tsParticles handles particle pooling internally
- **Canvas rendering**: Uses requestAnimationFrame, optimized draw calls
- **Tree-shaking**: Using bundle means no unused code
- **Target**: 60fps on modern browsers

### Bundle Loading Strategy

- **Lazy load**: Only import tsParticles on game pages
- **Code splitting**: TanStack Router lazy routes handle this
- **Engine init**: Initialize once, reuse for multiple animations

```typescript
// Lazy import pattern
const TsParticlesFireworks = lazy(() =>
  import('./TsParticlesFireworks').then(mod => ({ default: mod.TsParticlesFireworks }))
);
```

## Files to Modify

### New Files
- `app/features/quarto/components/animations/TsParticlesFireworks.tsx` - tsParticles wrapper

### Modified Files
- `app/features/quarto/components/animations/WinCelebration.tsx` - Import new component
- `app/features/quarto/components/animations/index.ts` - Update exports
- `package.json` - Add `@tsparticles/react` and `@tsparticles/fireworks`

### Deleted Files (Optional)
- `app/features/quarto/components/animations/FireworkCanvas.tsx` - Replace with tsParticles

## Dependencies to Install

```bash
npm install @tsparticles/react @tsparticles/fireworks
```

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Bundle size exceeds budget | Medium | High | Lazy-load only on game pages |
| React 19 incompatibility | Low | High | Test thoroughly before merge |
| Performance issues on mobile | Medium | Medium | Monitor FPS, reduce particles if needed |
| Breaking change in tsParticles | Low | Medium | Pin exact version in package.json |

## Sources

- [tsParticles Official Documentation](https://particles.js.org/)
- [LogRocket: Firework Particle Effects in React](https://blog.logrocket.com/firework-particle-effects-react-app/)
- [tsParticles GitHub Repository](https://github.com/tsparticles/tsparticles)
- [@tsparticles/fireworks npm](https://www.npmjs.com/package/@tsparticles/fireworks)
- [@tsparticles/react npm](https://www.npmjs.com/package/@tsparticles/react)

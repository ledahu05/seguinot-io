# Feature Specification: Quarto Win/Lose Celebration Animations

**Feature Branch**: `003-quarto-win-animation`
**Created**: 2025-12-10
**Status**: Draft
**Input**: User description: "When a quarto is detected instead of displaying a button 'call quarto' I would like a firework animation that displays for 5 to 10 seconds and once it vanished the pieces that are composing the quarto should be highlighted. In multiplayer mode, the firework should be displayed only on the winner screen, another animation that illustrates defeat should be displayed on the loser screen."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Winner Celebration Animation (Priority: P1)

As a player who wins by achieving a Quarto, I want to see an exciting firework celebration animation so that my victory feels rewarding and memorable.

**Why this priority**: The firework animation is the core feature request. Without it, the feature has no value. This delivers the primary user experience improvement.

**Independent Test**: Can be fully tested by completing a Quarto in any game mode (local, AI, or online) and observing the celebration animation. Delivers immediate visual feedback for victory.

**Acceptance Scenarios**:

1. **Given** a game is in progress, **When** a player places a piece that creates a Quarto (4 pieces in a row sharing an attribute), **Then** a firework animation automatically begins playing immediately.
2. **Given** a Quarto has been detected, **When** the firework animation is playing, **Then** it continues for 5 to 10 seconds before gradually fading out.
3. **Given** the firework animation has finished, **When** the animation fades away, **Then** the four pieces that formed the Quarto become highlighted/emphasized on the board.
4. **Given** any game mode (local 2-player, vs AI, or online), **When** the winning player's screen shows the Quarto, **Then** the firework animation displays.

---

### User Story 2 - Defeat Animation for Online Multiplayer (Priority: P2)

As an online multiplayer player who loses, I want to see a distinct defeat animation (not fireworks) so that I understand I've lost without confusion about who won.

**Why this priority**: This is specifically for multiplayer differentiation. The core win animation (US1) works for all modes, but this adds multiplayer-specific polish for the losing player.

**Independent Test**: Can be tested by having two players in an online game, with one winning. The loser's screen shows defeat animation instead of fireworks.

**Acceptance Scenarios**:

1. **Given** an online multiplayer game, **When** the opponent completes a Quarto and wins, **Then** the losing player sees a defeat animation (not fireworks) on their screen.
2. **Given** an online multiplayer game where I lose, **When** the defeat animation plays, **Then** it is visually distinct from the winner's firework animation (e.g., dimming effect, falling particles, subdued visual).
3. **Given** the defeat animation has finished, **When** it fades away, **Then** the winning pieces are still highlighted on the board so the loser can see how they lost.

---

### User Story 3 - Automatic Quarto Detection (Priority: P1)

As a player, I want the game to automatically detect and announce a Quarto without requiring me to press a "Call Quarto" button, so the game flow feels more natural and celebratory.

**Why this priority**: This is a prerequisite for US1 - the current "Call Quarto" button behavior must be replaced with automatic detection to trigger the celebration animation.

**Independent Test**: Can be tested by placing a fourth piece that creates a Quarto alignment. The game should immediately recognize the win without user action.

**Acceptance Scenarios**:

1. **Given** three pieces with a shared attribute are aligned on the board, **When** a fourth piece with the same shared attribute is placed completing the line, **Then** the game automatically detects and announces the Quarto.
2. **Given** a piece is placed on the board, **When** it creates a Quarto, **Then** no "Call Quarto" button is required or displayed.
3. **Given** the game auto-detects a Quarto, **When** detection occurs, **Then** the celebration animation (US1) triggers immediately.

---

### Edge Cases

- What happens if a player places a piece that creates multiple Quartos simultaneously? (The system celebrates once for the win, highlighting all winning lines)
- What happens if network latency causes a delay in online mode? (Both players see their respective animations once the game state syncs)
- What happens if a player closes/refreshes during the animation? (Animation state is purely visual, game result is already determined)
- How does the animation work on low-performance devices? (Animation gracefully degrades, still showing the win state)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST automatically detect when a Quarto is formed (4 pieces in a line sharing at least one attribute) upon piece placement
- **FR-002**: System MUST NOT display or require a "Call Quarto" button for win detection
- **FR-003**: System MUST display a firework/celebration animation immediately when a Quarto is detected
- **FR-004**: Firework animation MUST play for a duration between 5 and 10 seconds
- **FR-005**: System MUST highlight the four winning pieces after the celebration animation completes
- **FR-006**: In online multiplayer mode, the winning player's screen MUST display the firework celebration animation
- **FR-007**: In online multiplayer mode, the losing player's screen MUST display a defeat animation (distinct from fireworks)
- **FR-008**: Defeat animation MUST be visually distinct and convey the sense of loss (not celebratory)
- **FR-009**: Both winner and loser screens MUST show the highlighted winning pieces after their respective animations complete
- **FR-010**: Animation MUST NOT block or interfere with viewing the final game state
- **FR-011**: System MUST support animation in all game modes: local 2-player, vs AI, and online multiplayer

### Key Entities

- **CelebrationAnimation**: Visual effect triggered on win detection; properties include duration (5-10s), type (firework/defeat), and associated winning pieces
- **WinningLine**: The four board positions and pieces that form the Quarto; used for post-animation highlighting
- **GameOutcome**: The result state including winner, winning line, and animation type to display for each connected player

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Quarto detection occurs within 100ms of piece placement (imperceptible delay to users)
- **SC-002**: 100% of Quarto wins display celebration animation without requiring user action
- **SC-003**: Celebration animation duration is consistent (5-10 seconds) across all game modes
- **SC-004**: Winning pieces are clearly identifiable (highlighted) after animation in 100% of games
- **SC-005**: In online multiplayer, winner sees fireworks and loser sees defeat animation with 100% accuracy
- **SC-006**: Animation renders smoothly at 30+ FPS on modern browsers
- **SC-007**: Users can clearly see the final board state and winning pieces after animations complete

## Assumptions

- The firework animation will be 2D overlay effects (particles, sparks) rather than 3D integrated into the game scene
- The defeat animation will be a subdued visual effect (e.g., screen dim, grayscale wash, or falling/fading effect) - not jarring or offensive
- Animation duration of 5-10 seconds means it will be variable or randomized within that range for visual interest
- The existing game logic for win detection will be leveraged; only the trigger mechanism changes (automatic vs button press)
- Highlight effect for winning pieces will use visual emphasis (glow, color change, or pulsing effect) that persists until a new game starts

## Out of Scope

- Sound effects for animations (can be added in a future iteration)
- Custom animation selection or settings
- Replay functionality for the winning moment
- Screenshot/share functionality of the win

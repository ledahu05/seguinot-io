---

Page Content (Top to Bottom)

Section 1: Header

- Title: "How to Play Quarto"
- Subtitle: "A 2-player strategy game • 10-20 minutes • Ages 6+"
- Visual: Decorative 3D piece or game board render

---

Section 2: The Pieces

Headline: "16 Unique Pieces"

Content:
Each piece has 4 characteristics. Every piece is unique - no two share all 4 traits.

| Characteristic | Options                      |
| -------------- | ---------------------------- |
| Color          | Light / Dark                 |
| Shape          | Round / Square               |
| Top            | Solid (dome) / Hollow (open) |
| Height         | Tall / Short                 |

Interactive Element:

- Display all 16 pieces in a 4x4 grid
- On hover/tap: Piece enlarges slightly, tooltip shows its 4 attributes (e.g., "Dark, Round, Hollow, Tall")
- Pieces can be rotated with drag to see 3D shape clearly

Why this matters: Players need to recognize shared attributes to win.

---

Section 3: The Board

Headline: "The 4x4 Board"

Content:
The game is played on a 4x4 grid. There are 10 possible winning lines:

- 4 rows (horizontal)
- 4 columns (vertical)
- 2 diagonals

Interactive Element:

- Empty 4x4 board visualization
- Toggle button: "Show winning lines" → overlays all 10 lines with subtle highlighting
- Lines animate in sequence or can be toggled individually

---

Section 4: The Turn (Core Mechanic)

Headline: "The Twist: You Don't Pick Your Own Piece"

Content:
This is what makes Quarto unique. Each turn has two parts:

1.  Place - Your opponent has given you a piece. Place it on any empty square.
2.  Choose - Pick a piece from the remaining pieces to give to your opponent.

Your opponent then places that piece and chooses one for you. Repeat until someone wins.

Key insight: The piece you play was chosen by your opponent. The piece you choose is played by your opponent.

Interactive Element:

- Animated loop showing 2-3 turns between two players
- Clear visual indicators:
    - Player A (blue) vs Player B (orange)
    - Arrow showing piece transfer between players
    - "Place" and "Choose" phase labels
- Playback controls: Play/Pause, Restart

---

Section 5: Winning

Headline: "How to Win"

Content:
Create a line of 4 pieces that share at least one attribute. The line can be horizontal, vertical, or diagonal.

Examples of winning lines:

- 4 pieces that are all Light (different shapes, heights, tops - doesn't matter)
- 4 pieces that are all Round
- 4 pieces that are all Tall
- 4 pieces that are all Hollow

Only one shared attribute is needed. The other 3 can all differ.

Interactive Element:

- Show 3-4 example boards with winning positions:
  a. Clear win - 4 square pieces in a row (highlight the shared "Square" trait)
  b. Subtle win - 4 visually different pieces that are all "Solid"
  c. Near-miss - 3 pieces share a trait, 4th breaks the pattern (label: "Not a win")
- Each example has a caption explaining what's shared (or why it's not a win)

---

Section 6: Strategy Tip (Brief)

Headline: "One Tip Before You Play"

Content:
Remember: you choose which piece your opponent must play. Before giving them a piece, ask yourself: "Can this piece complete a
winning line for them?"

---

Section 7: Footer / Call to Action

- Primary button: "Start Playing" → links to game mode selection
- Secondary link: "Keyboard Shortcuts" → opens existing KeyboardShortcutsHelp modal
- Back link: "← Back to Menu"

---

Entry Points

| From        | Access Method                                                      |
| ----------- | ------------------------------------------------------------------ |
| Main menu   | "How to Play" button (prominent placement)                         |
| In-game     | "?" icon in header → links to this page or shows condensed overlay |
| First visit | Optional prompt: "New to Quarto? Learn the rules"                  |

---

Visual Style Notes

- Reuse existing Piece3D component for all piece visualizations
- Keep text concise - let visuals do the heavy lifting
- Smooth scroll behavior between sections
- Responsive: works on mobile (pieces/board scale appropriately)
- Consistent with existing app design (Tailwind, existing color palette)

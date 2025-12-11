/**
 * Section content data for the rules page
 * @module features/quarto/components/rules/data/sections
 */

import type { RulesSection } from './types';

export const RULES_SECTIONS: RulesSection[] = [
  {
    id: 'header',
    title: 'How to Play Quarto',
    content: 'A 2-player strategy game • 10-20 minutes • Ages 6+',
    hasInteractive: false,
  },
  {
    id: 'pieces',
    title: '16 Unique Pieces',
    content: `Each piece has 4 characteristics. Every piece is unique - no two share all 4 traits.

**Color**: Light or Dark
**Shape**: Round or Square
**Top**: Solid (dome) or Hollow (open)
**Height**: Tall or Short

Hover over a piece to see its attributes!`,
    hasInteractive: true,
  },
  {
    id: 'board',
    title: 'The 4×4 Board',
    content: `The game is played on a 4×4 grid with 16 positions.

There are **10 possible winning lines**:
• 4 horizontal rows
• 4 vertical columns
• 2 diagonals

Toggle the overlay to see all winning lines.`,
    hasInteractive: true,
  },
  {
    id: 'turn',
    title: "The Twist: You Don't Pick Your Own Piece",
    content: `This is what makes Quarto unique! Each turn has two parts:

**1. Place** — Your opponent gave you a piece. Place it on any empty square.

**2. Choose** — Pick a piece from the remaining pieces to give to your opponent.

Your opponent then places that piece and chooses one for you. The key insight: **the piece you play was chosen by your opponent!**`,
    hasInteractive: true,
  },
  {
    id: 'winning',
    title: 'How to Win',
    content: `Create a line of 4 pieces that share **at least one attribute**.

The line can be horizontal, vertical, or diagonal. Only **ONE** shared attribute is needed — the other 3 can all differ!

Examples of winning lines:
• 4 pieces that are all **Light**
• 4 pieces that are all **Round**
• 4 pieces that are all **Tall**
• 4 pieces that are all **Hollow**`,
    hasInteractive: true,
  },
  {
    id: 'strategy',
    title: 'One Tip Before You Play',
    content: `Remember: you choose which piece your opponent must play.

Before giving them a piece, ask yourself: **"Can this piece complete a winning line for them?"**

Good luck!`,
    hasInteractive: false,
  },
  {
    id: 'footer',
    title: '',
    content: '',
    hasInteractive: false,
  },
];

/**
 * Get a section by ID
 */
export function getSectionById(id: string): RulesSection | undefined {
  return RULES_SECTIONS.find((section) => section.id === id);
}

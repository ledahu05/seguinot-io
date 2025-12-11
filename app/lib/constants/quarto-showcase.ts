// T001: Content constants for Quarto game showcase section

export interface SkillTag {
  /** Display label */
  label: string;
  /** Optional category for styling variation */
  category?: 'frontend' | 'graphics' | 'networking' | 'ai';
}

export interface QuartoShowcaseContent {
  /** Section title */
  title: string;

  /** Brief description (1-2 sentences) */
  description: string;

  /** Extended description for context */
  extendedDescription?: string;

  /** Skills/technologies demonstrated */
  skillTags: SkillTag[];

  /** Primary CTA text */
  ctaText: string;

  /** Route to Quarto game */
  gameRoute: string;

  /** GitHub repository URL */
  githubUrl: string;

  /** GitHub link text */
  githubText: string;
}

export const QUARTO_SHOWCASE_CONTENT: QuartoShowcaseContent = {
  title: 'Quarto Game',
  description:
    'An interactive 3D strategy board game built to demonstrate modern web development skills.',
  extendedDescription:
    'Challenge the AI, play locally with a friend, or compete online in real-time multiplayer matches.',
  skillTags: [
    { label: 'React', category: 'frontend' },
    { label: 'TypeScript', category: 'frontend' },
    { label: 'React Three Fiber', category: 'graphics' },
    { label: 'Real-time Multiplayer', category: 'networking' },
    { label: 'AI Opponent', category: 'ai' },
  ],
  ctaText: 'Play Now',
  gameRoute: '/games/quarto',
  githubUrl: 'https://github.com/ledahu05/seguinot-io',
  githubText: 'View Source',
};

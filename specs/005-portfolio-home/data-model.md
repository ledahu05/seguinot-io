# Data Model: Portfolio Home - Quarto Game Showcase

**Branch**: `005-portfolio-home` | **Date**: 2025-12-11 | **Plan**: [plan.md](./plan.md)

## Overview

This feature uses static content only - no dynamic data fetching or persistent storage required. The QuartoShowcase section displays hardcoded content defined in a constants file.

## Content Schema

### QuartoShowcaseContent

Static content configuration for the Quarto game showcase section.

```typescript
// app/lib/constants/quarto-showcase.ts

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
```

### Default Content Values

Based on spec.md assumptions:

```typescript
export const QUARTO_SHOWCASE_CONTENT: QuartoShowcaseContent = {
  title: 'Quarto Game',
  description: 'An interactive 3D strategy board game built to demonstrate modern web development skills.',
  extendedDescription: 'Challenge the AI, play locally with a friend, or compete online in real-time multiplayer matches.',
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
```

## Component Props

### QuartoShowcase

Main section component - no props required (uses static content).

```typescript
// No props - uses QUARTO_SHOWCASE_CONTENT internally
export function QuartoShowcase(): JSX.Element
```

### QuartoDescription

Description text sub-component.

```typescript
interface QuartoDescriptionProps {
  description: string;
  extendedDescription?: string;
}
```

### SkillTags

Technology badge list sub-component.

```typescript
interface SkillTagsProps {
  tags: SkillTag[];
}
```

## No External Data

- No API calls
- No data fetching
- No loading states
- No error handling for data
- Content is compile-time static

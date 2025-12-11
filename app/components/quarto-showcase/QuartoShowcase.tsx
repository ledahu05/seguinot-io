// T005-T015: QuartoShowcase main section component with animation, responsive styling, accessibility, GitHub link, and skill tags

'use client';

import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { Play, Github } from 'lucide-react';
import { QuartoDescription } from './QuartoDescription';
import { SkillTags } from './SkillTags';
import { QUARTO_SHOWCASE_CONTENT } from '@/lib/constants/quarto-showcase';
import { ANIMATION } from '@/lib/constants';

export function QuartoShowcase() {
  const {
    title,
    description,
    extendedDescription,
    skillTags,
    ctaText,
    gameRoute,
    githubUrl,
    githubText,
  } = QUARTO_SHOWCASE_CONTENT;

  return (
    <section
      id="quarto-showcase"
      aria-label="Quarto Game Project Showcase"
      className="px-4 py-16 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: ANIMATION.PROJECT_SLIDE }}
        className="mx-auto max-w-4xl text-center"
      >
        {/* Title */}
        <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{title}</h2>

        {/* Description */}
        <div className="mt-6">
          <QuartoDescription
            description={description}
            extendedDescription={extendedDescription}
          />
        </div>

        {/* Skill Tags */}
        <div className="mt-6">
          <SkillTags tags={skillTags} />
        </div>

        {/* Call to Action */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to={gameRoute}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-lg font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Play className="h-5 w-5" aria-hidden="true" />
            {ctaText}
          </Link>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-lg font-semibold transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Github className="h-5 w-5" aria-hidden="true" />
            {githubText}
          </a>
        </div>
      </motion.div>
    </section>
  );
}

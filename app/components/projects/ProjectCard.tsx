// T055 & T057 & T060: ProjectCard component with Challenge/Solution/Tech structure

'use client'

import { motion } from 'framer-motion'
import { ProjectScreenshots } from './ProjectScreenshots'
import type { ProjectWithScreenshots } from '@/lib/schemas/screenshot.schema'
import { ANIMATION } from '@/lib/constants'

interface ProjectCardProps {
  project: ProjectWithScreenshots
  onImageClick?: (screenshots: ProjectWithScreenshots['screenshots'], index: number) => void
  index: number
}

// T057: Derive Challenge and Solution from highlights
function deriveContent(highlights: string[]): {
  challenge: string
  solution: string
  impact: string[]
} {
  // First highlight often describes the challenge/context
  const challenge = highlights[0] || 'Building a modern web application'

  // Second highlight often describes the solution approach
  const solution = highlights[1] || 'Implemented using modern technologies'

  // Remaining highlights are impact/achievements
  const impact = highlights.slice(2, 5)

  return { challenge, solution, impact }
}

export function ProjectCard({ project, onImageClick, index }: ProjectCardProps) {
  const { challenge, solution, impact } = deriveContent(project.highlights)
  const hasScreenshots = project.screenshots.length > 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: ANIMATION.PROJECT_SLIDE,
        delay: index * 0.1,
      }}
      className="overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Header */}
      <div className="border-b bg-muted/30 p-4">
        <h3 className="text-xl font-semibold">{project.title}</h3>
        <p className="text-sm text-muted-foreground">
          {project.role} @ {project.company}
        </p>
        <p className="text-xs text-muted-foreground">
          {project.period.start} - {project.period.end}
        </p>
      </div>

      <div className="p-4">
        {/* Screenshots */}
        {hasScreenshots && (
          <div className="mb-6">
            <ProjectScreenshots
              screenshots={project.screenshots}
              onImageClick={(idx) => onImageClick?.(project.screenshots, idx)}
            />
          </div>
        )}

        {/* Challenge */}
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
            Challenge
          </h4>
          <p className="text-sm text-muted-foreground">{challenge}</p>
        </div>

        {/* Solution */}
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
            Solution
          </h4>
          <p className="text-sm text-muted-foreground">{solution}</p>
        </div>

        {/* Impact */}
        {impact.length > 0 && (
          <div className="mb-4">
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
              Impact
            </h4>
            <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
              {impact.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        {project.technologies.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-primary">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.article>
  )
}

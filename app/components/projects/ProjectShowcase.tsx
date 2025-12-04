// T054 & T059 & T062: ProjectShowcase container with lightbox integration

'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ProjectCard } from './ProjectCard'
import { Lightbox } from '@/components/shared/Lightbox'
import { getProjectsWithScreenshots } from '@/lib/data/cv-loader'
import { ANIMATION, FEATURED_PROJECTS } from '@/lib/constants'
import type { Screenshot } from '@/lib/schemas/screenshot.schema'

export function ProjectShowcase() {
  const allProjects = useMemo(() => getProjectsWithScreenshots(), [])

  // Filter to only show projects with screenshots (case studies)
  const featuredProjects = useMemo(() => {
    return allProjects.filter(
      (p) =>
        p.screenshots.length > 0 ||
        FEATURED_PROJECTS.includes(p.title as typeof FEATURED_PROJECTS[number])
    )
  }, [allProjects])

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxScreenshots, setLightboxScreenshots] = useState<Screenshot[]>(
    []
  )
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const handleImageClick = (screenshots: Screenshot[], index: number) => {
    setLightboxScreenshots(screenshots)
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <section id="projects" aria-label="Featured projects" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: ANIMATION.PROJECT_SLIDE }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Featured Projects</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Case studies showcasing challenges, solutions, and impact
          </p>
        </motion.div>

        {/* Project grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={project.title}
              project={project}
              onImageClick={handleImageClick}
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        screenshots={lightboxScreenshots}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </section>
  )
}

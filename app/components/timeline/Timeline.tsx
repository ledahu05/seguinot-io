// T037 & T042 & T046: Timeline container component with animation and responsive styling

'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TimelineEntry } from './TimelineEntry'
import { Lightbox } from '@/components/shared/Lightbox'
import { getProjectsWithScreenshots } from '@/lib/data/cv-loader'
import { ANIMATION } from '@/lib/constants'
import type { Screenshot } from '@/lib/schemas/screenshot.schema'

export function Timeline() {
  const projects = useMemo(() => getProjectsWithScreenshots(), [])

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

  const handleLightboxClose = () => {
    setLightboxOpen(false)
  }

  const handleLightboxNavigate = (index: number) => {
    setLightboxIndex(index)
  }

  return (
    <section id="timeline" aria-label="Work experience timeline" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: ANIMATION.TIMELINE_STAGGER }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Experience Timeline</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {projects.length} projects spanning 12+ years of frontend development
          </p>
        </motion.div>

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[5px] top-0 hidden h-full w-0.5 bg-border min-[407px]:block md:left-1/2 md:-translate-x-1/2" />

          {/* Timeline entries */}
          <div className="space-y-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: ANIMATION.TIMELINE_STAGGER,
                  delay: index * 0.1,
                }}
              >
                <TimelineEntry
                  project={project}
                  screenshots={project.screenshots}
                  onImageClick={handleImageClick}
                  isLeft={index % 2 === 1}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        screenshots={lightboxScreenshots}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={handleLightboxClose}
        onNavigate={handleLightboxNavigate}
      />
    </section>
  )
}

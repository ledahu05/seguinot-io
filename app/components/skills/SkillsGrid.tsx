// T047 & T050 & T053: SkillsGrid container with bento-box style layout

'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SkillCategory } from './SkillCategory'
import { getSkills } from '@/lib/data/cv-loader'
import { ANIMATION } from '@/lib/constants'

export function SkillsGrid() {
  const skills = useMemo(() => getSkills(), [])

  return (
    <section id="skills" aria-label="Technical skills" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: ANIMATION.SKILL_SCALE }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Tech Stack</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Technologies and tools I use to build high-quality applications
          </p>
        </motion.div>

        {/* Bento-box style asymmetric grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* First row: Languages (large) + Frontend (large) */}
          <div className="sm:col-span-1 lg:row-span-2">
            <SkillCategory
              name="Languages"
              skills={skills.Languages}
              index={0}
            />
          </div>
          <div className="sm:col-span-1 lg:col-span-2">
            <SkillCategory name="Frontend" skills={skills.Frontend} index={1} />
          </div>

          {/* Second row: Testing + Styling */}
          <div className="sm:col-span-1">
            <SkillCategory name="Testing" skills={skills.Testing} index={2} />
          </div>
          <div className="sm:col-span-1">
            <SkillCategory name="Styling" skills={skills.Styling} index={3} />
          </div>

          {/* Third row: Tools (large) + Cloud */}
          <div className="sm:col-span-2 lg:col-span-2">
            <SkillCategory name="Tools" skills={skills.Tools} index={4} />
          </div>
          <div className="sm:col-span-1">
            <SkillCategory
              name="Cloud & Infrastructure"
              skills={skills['Cloud & Infrastructure']}
              index={5}
            />
          </div>

          {/* Fourth row: Methodologies (full width) */}
          <div className="sm:col-span-2 lg:col-span-3">
            <SkillCategory
              name="Methodologies"
              skills={skills.Methodologies}
              index={6}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// T048 & T051: SkillCategory component with animation

'use client'

import { motion } from 'framer-motion'
import { SkillBadge } from './SkillBadge'
import { ANIMATION } from '@/lib/constants'

interface SkillCategoryProps {
  name: string
  skills: string[]
  index: number
}

export function SkillCategory({ name, skills, index }: SkillCategoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: ANIMATION.SKILL_SCALE,
        delay: index * 0.05,
      }}
      className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <h3 className="mb-4 text-lg font-semibold text-foreground">{name}</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillBadge key={skill} skill={skill} />
        ))}
      </div>
    </motion.div>
  )
}

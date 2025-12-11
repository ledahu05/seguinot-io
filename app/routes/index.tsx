// T035 & T045 & T052 & T061 & T070 & T007: Main portfolio page with sections

import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/hero/Hero'
import { QuartoShowcase } from '@/components/quarto-showcase'
import { Timeline } from '@/components/timeline/Timeline'
import { SkillsGrid } from '@/components/skills/SkillsGrid'
import { ProjectShowcase } from '@/components/projects/ProjectShowcase'
import { Contact } from '@/components/contact/Contact'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />

      {/* Quarto Game Showcase section */}
      <QuartoShowcase />

      {/* Timeline section */}
      <Timeline />

      {/* Skills Grid section */}
      <SkillsGrid />

      {/* Project Showcase section */}
      <ProjectShowcase />

      {/* Contact section */}
      <Contact />
    </main>
  )
}

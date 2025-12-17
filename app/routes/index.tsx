// T035 & T045 & T052 & T061 & T070 & T007: Main portfolio page with sections
// T009-T012: Homepage SEO with meta tags and JSON-LD

import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '@/components/hero/Hero'
import { QuartoShowcase } from '@/components/quarto-showcase'
import { Timeline } from '@/components/timeline/Timeline'
import { SkillsGrid } from '@/components/skills/SkillsGrid'
import { ProjectShowcase } from '@/components/projects/ProjectShowcase'
import { Contact } from '@/components/contact/Contact'
import {
  generatePageMeta,
  generatePersonSchema,
  generateWebSiteSchema,
  generateMultipleJsonLdScripts,
} from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () => {
    const pageMeta = generatePageMeta({
      title: 'Senior Frontend Developer',
      description:
        'Senior Frontend Developer with 12+ years of experience building enterprise-scale React/TypeScript applications. View my projects, skills, and professional experience.',
      path: '/',
      type: 'profile',
    })

    // Add JSON-LD structured data
    const personSchema = generatePersonSchema()
    const webSiteSchema = generateWebSiteSchema()

    return {
      ...pageMeta,
      scripts: generateMultipleJsonLdScripts([personSchema, webSiteSchema]),
    }
  },
  component: HomePage,
})

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

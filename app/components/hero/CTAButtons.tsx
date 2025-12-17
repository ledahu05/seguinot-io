// T032 & T033 & T037: CTAButtons component with smooth scroll and blog navigation

import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'

interface CTAButtonsProps {
  projectsId?: string
  contactId?: string
}

export function CTAButtons({
  projectsId = 'projects',
  contactId = 'contact',
}: CTAButtonsProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Button
        size="lg"
        onClick={() => scrollToSection(projectsId)}
        className="min-w-[160px]"
      >
        View Projects
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={() => scrollToSection(contactId)}
        className="min-w-[160px]"
      >
        Contact
      </Button>
      <Button variant="outline" size="lg" className="min-w-[160px]" asChild>
        <Link to="/blog" className="inline-flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Blog
        </Link>
      </Button>
    </div>
  )
}

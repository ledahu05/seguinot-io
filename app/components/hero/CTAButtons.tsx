// T032 & T033: CTAButtons component with smooth scroll functionality

import { Button } from '@/components/ui/button'

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
    </div>
  )
}

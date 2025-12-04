// T064: ContactInfo component displaying location

'use client'

import { MapPin } from 'lucide-react'

interface ContactInfoProps {
  location: string
}

export function ContactInfo({ location }: ContactInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Location</h3>
      <div className="flex items-center gap-3 text-muted-foreground">
        <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
        <span>{location}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        Available for remote work and collaboration across time zones
      </p>
    </div>
  )
}

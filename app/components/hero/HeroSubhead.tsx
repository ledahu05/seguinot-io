// T031: HeroSubhead component displaying summary from profile

interface HeroSubheadProps {
  summary: string
}

export function HeroSubhead({ summary }: HeroSubheadProps) {
  return (
    <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
      {summary}
    </p>
  )
}

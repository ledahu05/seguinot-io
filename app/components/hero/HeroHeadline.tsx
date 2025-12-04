// T030: HeroHeadline component displaying name and title

interface HeroHeadlineProps {
  name: string
  title: string
}

export function HeroHeadline({ name, title }: HeroHeadlineProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
        {name}
      </h1>
      <p className="text-xl font-medium text-muted-foreground sm:text-2xl md:text-3xl">
        {title}
      </p>
    </div>
  )
}

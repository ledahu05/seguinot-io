// T039: TimelineContent component for highlights/details

interface TimelineContentProps {
  highlights: string[]
  technologies: string[]
}

export function TimelineContent({
  highlights,
  technologies,
}: TimelineContentProps) {
  return (
    <div className="space-y-4">
      <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        {highlights.slice(0, 3).map((highlight, index) => (
          <li key={index} className="leading-relaxed">
            {highlight}
          </li>
        ))}
        {highlights.length > 3 && (
          <li className="text-muted-foreground/70">
            +{highlights.length - 3} more highlights...
          </li>
        )}
      </ul>

      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {technologies.slice(0, 6).map((tech, index) => (
            <span
              key={index}
              className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
            >
              {tech}
            </span>
          ))}
          {technologies.length > 6 && (
            <span className="rounded-md bg-secondary/50 px-2 py-1 text-xs text-muted-foreground">
              +{technologies.length - 6}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

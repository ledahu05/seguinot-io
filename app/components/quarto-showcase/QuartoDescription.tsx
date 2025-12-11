// T004: QuartoDescription component - description text for showcase section

interface QuartoDescriptionProps {
  description: string;
  extendedDescription?: string;
}

export function QuartoDescription({
  description,
  extendedDescription,
}: QuartoDescriptionProps) {
  return (
    <div className="space-y-4">
      <p className="text-lg text-muted-foreground sm:text-xl">{description}</p>
      {extendedDescription && (
        <p className="text-base text-muted-foreground">{extendedDescription}</p>
      )}
    </div>
  );
}

// T013: SkillTags component - technology badge list for showcase section

import { Badge } from '@/components/ui/badge';
import type { SkillTag } from '@/lib/constants/quarto-showcase';

interface SkillTagsProps {
  tags: SkillTag[];
}

export function SkillTags({ tags }: SkillTagsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {tags.map((tag) => (
        <Badge key={tag.label} variant="secondary" className="text-sm">
          {tag.label}
        </Badge>
      ))}
    </div>
  );
}

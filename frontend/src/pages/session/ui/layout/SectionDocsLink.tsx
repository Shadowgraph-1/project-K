import { Link } from "react-router-dom";

import { sessionPillOutline } from "@/pages/session/lib/session-styles";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

type SectionDocsLinkProps = {
  to: string;
  className?: string;
};

export function SectionDocsLink({ to, className }: SectionDocsLinkProps) {
  return (
    <Button
      asChild
      type="button"
      variant="outline"
      size="sm"
      className={cn(sessionPillOutline, "h-9 rounded-full px-4", className)}
    >
      <Link to={to}>Документация</Link>
    </Button>
  );
}
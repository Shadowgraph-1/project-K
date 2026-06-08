import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/ui/empty";

type EmptySessionProps = {
  titleName?: string;
  descriptionName?: string;
  action?: () => void;
  icon?: ReactNode;
  buttonName?: string;
};

export default function EmptySession({
  titleName,
  descriptionName,
  action,
  icon,
  buttonName,
}: EmptySessionProps) {
  return (
    <Empty className="session-empty-state">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle>{titleName}</EmptyTitle>
        <EmptyDescription>{descriptionName}</EmptyDescription>
      </EmptyHeader>
      {action && buttonName ? (
        <EmptyContent>
          <Button type="button" className="rounded-none" onClick={action}>
            {buttonName}
          </Button>
        </EmptyContent>
      ) : null}
    </Empty>
  );
}

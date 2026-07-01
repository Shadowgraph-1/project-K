import {
  SessionEmptyPage,
  type SessionEmptyAction,
  type SessionEmptySuggestion,
} from "./SessionEmptyPage";

type EmptySessionProps = {
  titleName?: string;
  descriptionName?: string;
  action?: () => void;
  buttonName?: string;
  className?: string;
  suggestions?: SessionEmptySuggestion[];
  secondaryAction?: SessionEmptyAction;
  footerAction?: SessionEmptyAction;
};

export default function EmptySession({
  titleName = "",
  descriptionName,
  action,
  buttonName,
  className,
  suggestions,
  secondaryAction,
  footerAction,
}: EmptySessionProps) {
  const resolvedFooter =
    footerAction ??
    (action && buttonName ? { label: buttonName, onClick: action } : undefined);

  return (
    <SessionEmptyPage
      title={titleName}
      description={descriptionName}
      suggestions={suggestions}
      footerAction={resolvedFooter}
      secondaryAction={secondaryAction}
      className={className}
    />
  );
}

export type { SessionEmptySuggestion, SessionEmptyAction };
export { SessionEmptyPage };

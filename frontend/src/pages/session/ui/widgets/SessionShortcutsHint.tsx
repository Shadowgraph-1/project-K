import { SESSION_SHORTCUTS } from "@/shared/config/session-shortcuts";
import { Kbd, KbdGroup } from "@/shared/ui/kbd";

export function SessionShortcutsHint() {
  return (
    <div className="px-2 py-1">
      <p className="mb-3 text-xs font-medium text-muted-foreground">
        Горячие клавиши
      </p>
      <ul className="flex flex-col gap-2.5 text-left">
        {SESSION_SHORTCUTS.map((shortcut) => (
          <li
            key={shortcut.label}
            className="flex items-center justify-between gap-4 text-sm text-foreground"
          >
            <span>{shortcut.label}</span>
            <KbdGroup>
              {shortcut.keys.map((key) => (
                <Kbd key={key}>{key}</Kbd>
              ))}
            </KbdGroup>
          </li>
        ))}
      </ul>
    </div>
  );
}

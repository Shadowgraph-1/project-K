import { HOME_DOCS_LINKS } from "@/shared/config/docs-links";
import { HeaderNavMenu } from "./HeaderNavMenu";

export function HeaderDocsMenu() {
  return (
    <HeaderNavMenu
      label="Документация"
      ariaLabel="Документация"
      items={HOME_DOCS_LINKS}
    />
  );
}
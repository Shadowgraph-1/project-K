import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { sessionToolbarIconButton } from "@/pages/session/lib/session-styles";

export const toolbarIslandIconButtonClass = cn(
  buttonVariants({ variant: "ghost", size: "icon-sm" }),
  "size-7 rounded-md",
  sessionToolbarIconButton,
);

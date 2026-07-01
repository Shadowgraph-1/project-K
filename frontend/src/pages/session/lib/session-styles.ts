export const sessionSurface =
  "rounded-2xl bg-muted/40 ring-1 ring-border/30 transition-[box-shadow,background-color] duration-200";

export const sessionSurfaceSm =
  "rounded-xl bg-muted/40 ring-1 ring-border/30 transition-[box-shadow,background-color] duration-200";

export const sessionField =
  "h-9 rounded-xl border-0 bg-muted/50 shadow-none ring-1 ring-border/35 focus-visible:ring-2 focus-visible:ring-foreground/10";

export const sessionPillOutline =
  "rounded-full border-0 bg-transparent ring-1 ring-border/45 hover:bg-muted/60";

export const sessionPageTitle =
  "text-2xl font-medium tracking-tight text-foreground";

export const sessionRowHover =
  "transition-colors hover:bg-background/45";

export const sessionMenuTrigger =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0";

/** Icon-only controls on muted/toolbar surfaces — keeps SVG readable vs bg-muted/40 */
export const sessionToolbarIconButton =
  "text-foreground hover:bg-muted/60 hover:text-foreground data-[state=open]:bg-muted/60 data-[state=open]:text-foreground";

export const sessionSidebarNavButton =
  "relative flex h-8 w-full items-center gap-2 overflow-hidden rounded-[10px] px-2 py-1.5 text-left text-[13px] font-medium text-sidebar-foreground/70 ring-inset transition-colors duration-200 hover:bg-foreground/5 hover:text-sidebar-foreground active:bg-foreground/5 active:text-sidebar-foreground data-active:bg-background data-active:text-sidebar-foreground data-active:font-medium dark:data-active:bg-muted/80 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate";

export const sessionSidebarGroupLabel =
  "h-8 shrink-0 px-2 py-1 text-[13px] font-medium normal-case tracking-normal text-sidebar-foreground";

export const sessionSidebarLogoButton =
  "flex size-8 items-center justify-center rounded-lg outline-none transition-colors hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring";
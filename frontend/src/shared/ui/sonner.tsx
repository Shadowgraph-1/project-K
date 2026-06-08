import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Loader2Icon } from "lucide-react"
import { cn } from "@/shared/lib/utils"

/**
 * Как в демо Sonner: без лида-иконки у success/error/info/warning — только [data-content] и кнопки.
 * Для loading/promise нужна иконка, иначе не отрисуется спиннер.
 */
const SONNER_ICONS: ToasterProps["icons"] = {
  success: null,
  error: null,
  warning: null,
  info: null,
  loading: (
    <Loader2Icon className="size-4 shrink-0 animate-spin" aria-hidden strokeWidth={2} />
  ),
}

const defaultToastClassNames: NonNullable<
  NonNullable<ToasterProps["toastOptions"]>["classNames"]
> = {
  toast:
    "cn-toast !gap-1.5 !p-4 !text-[13px] !leading-normal !shadow-[0px_4px_12px_rgba(0,0,0,0.1)] !items-center",
  title: "!font-medium !leading-snug !text-[13px]",
  description:
    "!mt-px !text-[13px] !leading-[1.45] !font-normal !text-foreground/80",
  content: "!flex !min-w-0 !flex-1 !flex-col !gap-0.5",
  actionButton: "!h-6 !min-h-6 shrink-0 rounded px-2 !text-xs !font-medium",
  cancelButton: "!h-6 !min-h-6 shrink-0 rounded px-2 !text-xs !font-medium",
  closeButton: "!size-5 [&_svg]:!size-3",
}

const toasterCssVars: React.CSSProperties = {
  "--normal-bg": "var(--popover)",
  "--normal-text": "var(--popover-foreground)",
  "--normal-border": "var(--border)",
  "--border-radius": "var(--radius)",
  "--width": "min(92vw, 356px)",
} as React.CSSProperties

const Toaster = (props: ToasterProps) => {
  const {
    toastOptions: userToastOptions,
    icons: userIcons,
    style: userStyle,
    className,
    gap,
    position,
    offset,
    richColors,
    ...rest
  } = props

  const u = userToastOptions?.classNames

  return (
    <Sonner
      {...rest}
      position={position ?? "bottom-right"}
      offset={offset ?? "20px"}
      richColors={richColors ?? false}
      theme="light"
      className={cn("toaster group", className)}
      gap={gap ?? 10}
      icons={{ ...SONNER_ICONS, ...userIcons }}
      style={{ ...toasterCssVars, ...(userStyle as React.CSSProperties) }}
      toastOptions={{
        ...userToastOptions,
        classNames: {
          toast: cn(defaultToastClassNames.toast, u?.toast),
          title: cn(defaultToastClassNames.title, u?.title),
          description: cn(defaultToastClassNames.description, u?.description),
          content: cn(defaultToastClassNames.content, u?.content),
          icon: cn(u?.icon),
          actionButton: cn(defaultToastClassNames.actionButton, u?.actionButton),
          cancelButton: cn(defaultToastClassNames.cancelButton, u?.cancelButton),
          closeButton: cn(defaultToastClassNames.closeButton, u?.closeButton),
        },
      }}
    />
  )
}

export { Toaster }

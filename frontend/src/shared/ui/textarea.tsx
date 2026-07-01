import * as React from "react"

import { cn } from "@/shared/lib/utils"
import {
  CharCountIndicator,
  charCountPadding,
} from "@/shared/ui/char-count-indicator"

type TextareaProps = React.ComponentProps<"textarea"> & {
  showCharCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      className,
      maxLength,
      value,
      defaultValue,
      onChange,
      showCharCount,
      ...props
    },
    ref,
  ) {
    const [internalLength, setInternalLength] = React.useState(
      () => String(defaultValue ?? "").length,
    )

    const withCharCount =
      maxLength !== undefined && showCharCount !== false
    const valueLength =
      value !== undefined ? String(value).length : internalLength

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setInternalLength(event.target.value.length)
      }
      onChange?.(event)
    }

    const textareaElement = (
      <textarea
        ref={ref}
        data-slot="textarea"
        maxLength={maxLength}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        className={cn(
          "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          withCharCount && maxLength && charCountPadding(maxLength),
          className,
        )}
        {...props}
      />
    )

    if (!withCharCount || !maxLength) {
      return textareaElement
    }

    return (
      <div className="relative w-full">
        {textareaElement}
        <CharCountIndicator
          valueLength={valueLength}
          maxLength={maxLength}
          align="top"
        />
      </div>
    )
  },
)

export { Textarea }

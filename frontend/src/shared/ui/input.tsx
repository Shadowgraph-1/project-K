import * as React from "react"

import { cn } from "@/shared/lib/utils"
import {
  CharCountIndicator,
  charCountPadding,
} from "@/shared/ui/char-count-indicator"

const NO_CHAR_COUNT_TYPES = new Set([
  "password",
  "email",
  "search",
  "number",
  "file",
  "hidden",
  "tel",
  "url",
  "date",
  "datetime-local",
  "time",
])

function shouldShowCharCount(
  type: string | undefined,
  maxLength: number | undefined,
  showCharCount: boolean | undefined,
) {
  if (showCharCount === false) return false
  if (showCharCount === true) return maxLength !== undefined
  if (maxLength === undefined) return false
  return !NO_CHAR_COUNT_TYPES.has(type ?? "text")
}

type InputProps = React.ComponentProps<"input"> & {
  showCharCount?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    type = "text",
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

  const withCharCount = shouldShowCharCount(type, maxLength, showCharCount)
  const valueLength =
    value !== undefined ? String(value).length : internalLength

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (value === undefined) {
      setInternalLength(event.target.value.length)
    }
    onChange?.(event)
  }

  const inputElement = (
    <input
      ref={ref}
      type={type}
      data-slot="input"
      maxLength={maxLength}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        withCharCount && maxLength && charCountPadding(maxLength),
        className,
      )}
      {...props}
    />
  )

  if (!withCharCount || !maxLength) {
    return inputElement
  }

  return (
    <div className="relative w-full">
      {inputElement}
      <CharCountIndicator
        valueLength={valueLength}
        maxLength={maxLength}
        align="center"
      />
    </div>
  )
})

export { Input }

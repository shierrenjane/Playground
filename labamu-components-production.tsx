/*
 * ============================================================
 * LABAMU COMPONENT LIBRARY — Production Components
 * Stack: Next.js + ShadCN + Tailwind + cva
 * Source: https://www.figma.com/design/tuNPIEke41XKWtJVmopMal
 * Last updated: 2026-03-16
 *
 * REQUIREMENTS:
 * 1. Import labamu-tokens.css: In app/globals.css: @import "./labamu-tokens.css"
 * 2. Extend Tailwind config: import { labamuTheme } from "./labamu-tailwind.config" then
 *    add to tailwind.config.ts: theme: { extend: labamuTheme }
 * In app/globals.css: @import './labamu-tokens.css';
 *
 * All tokens are registered in labamuTheme (labamu-tailwind.config.ts) and used as
 * named Tailwind utilities: bg-lb-brand, text-lb-on-surface, rounded-lb-sm, etc.
 * No arbitrary var(--lb-*) syntax — every token uses a named Tailwind class.
 *
 * CONTENTS:
 *  1.  MainBtn         — Primary/Secondary button (sm/md/lg/xl)
 *  2.  IconBtn         — Square icon-only button
 *  3.  CTAButton       — Inline text link button
 *  4.  Toggle          — On/Off toggle switch (big/small)
 *  5.  Checkbox        — 24×24px checkbox
 *  6.  RadioButton     — 24×24px radio
 *  7.  TextField       — Input field (outlined/filled, lg/md)
 *  8.  FieldDesktop    — Two-column desktop form row
 *  9.  DiscountField   — Discount type toggle + amount input
 * 10.  SearchBar       — Pill-shaped search input
 * 11.  StickyAction    — Sticky bottom action bar (mobile/tablet/desktop)
 * 12.  StickyHeader    — Sticky top page header
 * 13.  Snackbar        — Toast notification
 * 14.  Infobox         — Inline info/warning/error box
 * 15.  Tooltip         — Hover tooltip
 * 16.  PageIndicator   — Dot page indicator
 * 17.  Separator       — Horizontal divider (thin/thick)
 * 18.  StatusBadge     — Colored status pill
 * 19.  FilterPill      — Filter chip (outlined)
 * 20.  Tabs            — Horizontal tab navigation
 * 21.  Chip            — Selection chip
 * 22.  Dropdown        — Select dropdown (single/multi/searchable)
 * 23.  Table           — Data table with header/body/footer
 * 24.  Popup           — Modal/bottomsheet (mobile/tablet/desktop)
 * 25.  EmptyState      — Empty data state illustration
 * 26.  DesktopNavbar   — Desktop left sidebar navigation
 * 27.  BottomNavbar    — Mobile bottom navigation bar
 * ============================================================
 */


// ════════════════════════════════════════════════════════════
// TOKEN REFERENCE (defined in labamu-tokens.css)
// ════════════════════════════════════════════════════════════
//
//   --lb-font              Lato font family
//   --lb-fw-regular        400
//   --lb-fw-semibold       600
//   --lb-fw-bold           700
//
//   --lb-bg                Page background
//   --lb-surface           White surface
//   --lb-surface-grey      Light grey (disabled bg, search bg)
//   --lb-surface-grey-dark Darker grey
//   --lb-on-surface        Primary text
//   --lb-on-surface-2      Secondary text
//   --lb-on-surface-3      Tertiary / placeholder text
//   --lb-on-surface-rev    White text on dark bg
//   --lb-on-surface-blue   Link color
//   --lb-line-1            Light separator
//   --lb-line-2            Medium separator
//
//   --lb-brand             Brand blue
//   --lb-brand-on          Text on brand bg (white)
//   --lb-brand-light       Brand container lighter (hover secondary bg)
//   --lb-brand-dark        Brand container darker (selected chip bg)
//   --lb-brand-hover       Brand hover / pressed state
//
//   --lb-green / --lb-green-bg / --lb-green-text
//   --lb-yellow / --lb-yellow-bg / --lb-yellow-text
//   --lb-orange / --lb-orange-bg / --lb-orange-text
//   --lb-red / --lb-red-bg / --lb-red-text
//   --lb-grey / --lb-grey-bg / --lb-grey-text
//
//   --lb-r-btn             12px (large buttons, modals)
//   --lb-r-card            12px (cards)
//   --lb-r-input           10px (text fields, dropdowns)
//   --lb-r-sm              8px (small buttons, chips, icon btns)
//   --lb-r-xs              4px (badges)
//   --lb-r-pill            100px (chips, toggles, badges)
//
//   --lb-shadow            Box shadow
//
// Tailwind usage pattern:
//   bg-lb-brand   text-lb-on-surface   border-lb-line-1
//   rounded-lb-btn   font-lb
//   font-lb-bold   shadow-lb


// ════════════════════════════════════════════════════════════
// 1. MainBtn — components/ui/main-btn.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const mainBtnVariants = cva(
  [
    "inline-flex items-center justify-center",
    "font-lb",
    "border border-transparent",
    "cursor-pointer transition-all duration-150",
    "active:scale-[0.97] outline-none whitespace-nowrap",
    "disabled:cursor-not-allowed",
    "disabled:bg-lb-surface-grey disabled:text-lb-on-surface-3 disabled:border-transparent",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-lb-brand text-lb-brand-on",
          "hover:enabled:bg-lb-brand-hover",
        ],
        secondary: [
          "bg-lb-surface text-lb-brand",
          "border-lb-brand",
          "hover:enabled:bg-lb-brand-light",
          "disabled:border-lb-line-1",
        ],
      },
      size: {
        xl: "h-14 px-6 rounded-lb-btn text-[16px] font-lb-bold leading-[22px] tracking-[0.11px] gap-2",
        lg: "h-[50px] px-6 rounded-lb-btn text-[16px] font-lb-regular leading-[22px] tracking-[0.11px] gap-2",
        md: "h-11 px-6 rounded-lb-sm text-[16px] font-lb-regular leading-[22px] tracking-[0.11px] gap-2",
        sm: "h-8 px-3 rounded-lb-sm text-[14px] font-lb-regular leading-[20px] tracking-[0.0962px] gap-1.5",
      },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  }
)

export interface MainBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof mainBtnVariants> {
  label?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  indicator?: number | null
}

export const MainBtn = React.forwardRef<HTMLButtonElement, MainBtnProps>(
  ({ label = "Action", variant, size, leftIcon, rightIcon, indicator, className, ...props }, ref) => (
    <button ref={ref} className={cn(mainBtnVariants({ variant, size }), className)} {...props}>
      {leftIcon}
      {size === "sm" && indicator != null
        ? <span className="flex items-center gap-1"><strong className="font-lb-bold">{indicator}</strong><span>{label}</span></span>
        : <span>{label}</span>
      }
      {rightIcon}
    </button>
  )
)
MainBtn.displayName = "MainBtn"
export default MainBtn
*/


// ════════════════════════════════════════════════════════════
// 2. IconBtn — components/ui/icon-btn.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const iconBtnVariants = cva(
  [
    "inline-flex items-center justify-center",
    "border border-transparent cursor-pointer",
    "transition-all duration-150 active:scale-[0.97] outline-none",
    "disabled:cursor-not-allowed",
    "disabled:bg-lb-surface-grey disabled:text-lb-on-surface-3 disabled:border-transparent",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-lb-brand text-lb-brand-on",
          "hover:enabled:bg-lb-brand-hover",
        ],
        secondary: [
          "bg-lb-surface text-lb-brand border-lb-brand",
          "hover:enabled:bg-lb-brand-light",
          "disabled:border-lb-line-1",
        ],
      },
      size: {
        lg: "w-[50px] h-[50px] rounded-lb-btn",
        md: "w-11 h-11 rounded-lb-sm",
        sm: "w-8 h-8 rounded-lb-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  }
)

export interface IconBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconBtnVariants> {
  icon: React.ReactNode
}

export const IconBtn = React.forwardRef<HTMLButtonElement, IconBtnProps>(
  ({ icon, variant, size, className, ...props }, ref) => (
    <button ref={ref} className={cn(iconBtnVariants({ variant, size }), className)} {...props}>
      {icon}
    </button>
  )
)
IconBtn.displayName = "IconBtn"
export default IconBtn
*/


// ════════════════════════════════════════════════════════════
// 3. CTAButton — components/ui/cta-button.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  size?: "sm" | "md"
  destructive?: boolean
}

const ChevronIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ label, size = "md", destructive = false, className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center gap-0.5 bg-transparent border-none cursor-pointer py-2",
        "font-lb transition-colors duration-150",
        "disabled:text-lb-on-surface-3 disabled:cursor-not-allowed",
        destructive
          ? "text-lb-red hover:underline"
          : "text-lb-on-surface-blue hover:text-lb-brand-hover",
        size === "sm"
          ? "text-[12px] font-lb-regular leading-[18px] tracking-[0.0825px]"
          : "text-[14px] font-lb-bold leading-[20px] tracking-[0.0962px]",
        className
      )}
      {...props}
    >
      {!destructive && <ChevronIcon size={size === "sm" ? 16 : 18} />}
      <span>{label}</span>
      {!destructive && <ChevronIcon size={size === "sm" ? 16 : 18} />}
    </button>
  )
)
CTAButton.displayName = "CTAButton"
export default CTAButton
*/


// ════════════════════════════════════════════════════════════
// 4. Toggle — components/ui/toggle.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToggleProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: "big" | "small"
  className?: string
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked = false, onChange, disabled = false, size = "big", className }, ref) => {
    const isBig = size === "big"
    const trackBg = disabled
      ? checked ? "bg-lb-line-1" : "bg-lb-surface-grey"
      : checked ? "bg-lb-brand" : "bg-lb-bg"
    const knobTranslate = checked
      ? isBig ? "translate-x-[22px]" : "translate-x-[19px]"
      : "translate-x-[3px]"

    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          "relative rounded-lb-pill transition-colors duration-200",
          "focus-visible:ring-2 focus-visible:ring-lb-brand outline-none",
          isBig ? "w-[51px] h-[32px]" : "w-[40px] h-[24px]",
          trackBg,
          disabled && "cursor-not-allowed",
          className
        )}
      >
        <span className={cn(
          "absolute top-[3px] bg-lb-surface rounded-full",
          "shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-transform duration-200",
          isBig ? "w-[26px] h-[26px]" : "w-[18px] h-[18px]",
          knobTranslate
        )} />
      </button>
    )
  }
)
Toggle.displayName = "Toggle"
export default Toggle
*/


// ════════════════════════════════════════════════════════════
// 5. Checkbox — components/ui/checkbox.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps {
  checked?: boolean | "indeterminate"
  onChange?: (checked: boolean) => void
  disabled?: boolean
  label?: string
  className?: string
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked = false, onChange, disabled = false, label, className }, ref) => {
    const isChecked = checked === true
    const isIndeterminate = checked === "indeterminate"
    const filled = isChecked || isIndeterminate

    return (
      <label className={cn("inline-flex items-center gap-2", disabled ? "cursor-not-allowed" : "cursor-pointer", className)}>
        <button
          ref={ref}
          role="checkbox"
          aria-checked={isIndeterminate ? "mixed" : isChecked}
          disabled={disabled}
          onClick={() => !disabled && onChange?.(!isChecked)}
          className={cn(
            "w-6 h-6 rounded-lb-xs border flex items-center justify-center flex-shrink-0",
            "transition-colors duration-150 outline-none",
            "focus-visible:ring-2 focus-visible:ring-lb-brand-light",
            filled && !disabled
              ? "bg-lb-brand border-lb-brand"
              : disabled
              ? "bg-lb-surface-grey border-lb-line-1"
              : "bg-lb-surface border-lb-line-2"
          )}
        >
          {isChecked && (
            <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
              <path d="M1 5.5L5 9.5L13 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {isIndeterminate && (
            <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
              <path d="M1 1H9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        {label && (
          <span className="font-lb text-[14px] text-lb-on-surface leading-[20px] tracking-[0.0962px]">
            {label}
          </span>
        )}
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"
export default Checkbox
*/


// ════════════════════════════════════════════════════════════
// 6. RadioButton — components/ui/radio-button.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioButtonProps {
  checked?: boolean
  onChange?: () => void
  disabled?: boolean
  label?: string
  className?: string
}

export const RadioButton = React.forwardRef<HTMLButtonElement, RadioButtonProps>(
  ({ checked = false, onChange, disabled = false, label, className }, ref) => (
    <label className={cn("inline-flex items-center gap-2", disabled ? "cursor-not-allowed" : "cursor-pointer", className)}>
      <button
        ref={ref}
        role="radio"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange?.()}
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
          "transition-colors duration-150 outline-none",
          "focus-visible:ring-2 focus-visible:ring-lb-brand-light",
          checked && !disabled
            ? "bg-lb-brand border-lb-brand"
            : disabled
            ? "bg-lb-surface-grey border-lb-line-1"
            : "bg-lb-surface border-lb-line-2"
        )}
      >
        {checked && <span className="w-2.5 h-2.5 bg-lb-surface rounded-full" />}
      </button>
      {label && (
        <span className="font-lb text-[14px] text-lb-on-surface leading-[20px] tracking-[0.0962px]">
          {label}
        </span>
      )}
    </label>
  )
)
RadioButton.displayName = "RadioButton"
export default RadioButton
*/


// ════════════════════════════════════════════════════════════
// 7. TextField — components/ui/text-field.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textFieldVariants = cva(
  [
    "w-full font-lb rounded-lb-input border",
    "transition-all duration-200 outline-none",
    "placeholder:text-lb-on-surface-3 text-lb-on-surface",
  ],
  {
    variants: {
      variant: {
        outlined: [
          "bg-lb-surface border-lb-line-1",
          "hover:border-lb-line-2",
          "focus:border-lb-brand focus:shadow-[0_0_0_3px_theme(colors.lb-brand-light)]",
        ],
        filled: [
          "bg-lb-surface-grey border-lb-line-1",
          "hover:border-lb-line-2",
          "focus:border-lb-brand focus:bg-lb-surface focus:shadow-[0_0_0_3px_theme(colors.lb-brand-light)]",
        ],
      },
      size: {
        lg: "h-12 px-4 text-[16px] leading-[22px] tracking-[0.11px]",
        md: "h-10 px-3 text-[14px] leading-[20px] tracking-[0.0962px]",
      },
      state: {
        default:  "",
        error:    [
          "border-lb-red hover:border-lb-red",
          "focus:border-lb-red focus:shadow-[0_0_0_3px_theme(colors.lb-red-bg)]",
        ],
        success:  "border-lb-green hover:border-lb-green focus:border-lb-green",
        disabled: [
          "bg-lb-surface-grey border-lb-line-1",
          "text-lb-on-surface-3 cursor-not-allowed",
        ],
        readonly: "bg-lb-surface-grey border-lb-line-1 cursor-default",
      },
    },
    defaultVariants: { variant: "outlined", size: "lg", state: "default" },
  }
)

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof textFieldVariants> {
  label?: string
  required?: boolean
  helperText?: string
  errorText?: string
  successText?: string
  showCount?: boolean
  maxLength?: number
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  multiline?: boolean
  rows?: number
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({
    label, required, helperText, errorText, successText,
    showCount, maxLength, leftIcon, rightIcon, multiline, rows = 3,
    variant, size, state, className, value, ...props
  }, ref) => {
    const inputState = state || (errorText ? "error" : "default")
    const charCount = typeof value === "string" ? value.length : 0
    const leftPad = leftIcon ? (size === "md" ? "pl-10" : "pl-11") : ""
    const rightPad = rightIcon ? (size === "md" ? "pr-10" : "pr-11") : ""

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <div className="flex items-center gap-0.5">
            {required && (
              <span className="font-lb text-[14px] font-lb-bold text-lb-red">*</span>
            )}
            <span className="font-lb text-[12px] text-lb-on-surface leading-[18px] tracking-[0.0825px]">
              {label}
            </span>
          </div>
        )}
        <div className="relative">
          {leftIcon && (
            <span className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2",
              inputState === "disabled" ? "text-lb-on-surface-3" : "text-lb-on-surface-2"
            )}>
              {leftIcon}
            </span>
          )}
          {multiline ? (
            <textarea
              className={cn(
                textFieldVariants({ variant, size, state: inputState }),
                "h-auto resize-y py-3 min-h-24",
                leftPad, rightPad, className
              )}
              rows={rows}
              maxLength={maxLength}
              value={value}
              disabled={inputState === "disabled"}
              readOnly={inputState === "readonly"}
              {...(props as any)}
            />
          ) : (
            <input
              ref={ref}
              className={cn(textFieldVariants({ variant, size, state: inputState }), leftPad, rightPad, className)}
              maxLength={maxLength}
              value={value}
              disabled={inputState === "disabled"}
              readOnly={inputState === "readonly"}
              {...props}
            />
          )}
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lb-on-surface-2">
              {rightIcon}
            </span>
          )}
          {showCount && maxLength && (
            <span className={cn(
              "absolute right-3 top-3 font-lb text-[12px]",
              charCount > maxLength ? "text-lb-red" : "text-lb-on-surface-3"
            )}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        {(helperText || errorText || successText) && (
          <span className={cn(
            "font-lb text-[12px] leading-[18px] tracking-[0.0825px]",
            errorText ? "text-lb-red"
              : successText ? "text-lb-green-text"
              : "text-lb-on-surface-3"
          )}>
            {errorText || successText || helperText}
          </span>
        )}
      </div>
    )
  }
)
TextField.displayName = "TextField"
export default TextField
*/


// ════════════════════════════════════════════════════════════
// 8. FieldDesktop — components/ui/field-desktop.tsx
// ════════════════════════════════════════════════════════════
/*
import * as React from "react"
import { cn } from "@/lib/utils"

export const FieldDesktopRow: React.FC<{
  label: string
  required?: boolean
  helperText?: string
  children: React.ReactNode
  className?: string
}> = ({ label, required, helperText, children, className }) => (
  <div className={cn("flex gap-11 items-start", className)}>
    <div className="w-[240px] flex-shrink-0 flex flex-col gap-1 pt-3">
      <div className="flex items-center gap-0.5">
        {required && (
          <span className="font-lb text-[14px] font-lb-bold text-lb-red">*</span>
        )}
        <span className="font-lb text-[14px] text-lb-on-surface leading-[20px] tracking-[0.0962px]">
          {label}
        </span>
      </div>
      {helperText && (
        <span className="font-lb text-[12px] text-lb-on-surface-2 leading-[18px] italic">
          {helperText}
        </span>
      )}
    </div>
    <div className="w-[552px] flex-shrink-0">{children}</div>
  </div>
)

export const FieldDesktop: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn("flex flex-col gap-5", className)}>{children}</div>
)
*/


// ════════════════════════════════════════════════════════════
// 9. DiscountField — components/ui/discount-field.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export const DiscountField: React.FC<{
  type?: "percent" | "nominal"
  onTypeChange?: (type: "percent" | "nominal") => void
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  error?: boolean
  errorText?: string
  className?: string
}> = ({ type = "percent", onTypeChange, value = "", onChange, disabled, error, errorText, className }) => (
  <div className={cn("flex flex-col gap-1", className)}>
    <div className="flex gap-2 items-center">
      <div className={cn(
        "flex p-1 border rounded-lb-input h-[46px] flex-shrink-0",
        disabled ? "border-lb-line-1" : "border-lb-brand"
      )}>
        {(["percent", "nominal"] as const).map((t) => (
          <button
            key={t}
            disabled={disabled}
            onClick={() => !disabled && onTypeChange?.(t)}
            className={cn(
              "px-3 rounded-lb-sm font-lb text-[14px]",
              "font-lb-regular transition-colors duration-150 h-full border-none cursor-pointer",
              type === t
                ? disabled
                  ? "bg-lb-surface-grey text-lb-on-surface-3"
                  : "bg-lb-brand text-lb-brand-on"
                : disabled
                ? "bg-transparent text-lb-on-surface-3"
                : "bg-transparent text-lb-brand"
            )}
          >
            {t === "percent" ? "%" : "Rp"}
          </button>
        ))}
      </div>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder="0"
        className={cn(
          "flex-1 h-[46px] px-3 rounded-lb-input border",
          "font-lb text-[14px] text-lb-on-surface",
          "outline-none transition-all duration-200",
          error
            ? "border-lb-red focus:border-lb-red focus:shadow-[0_0_0_3px_theme(colors.lb-red-bg)]"
            : "border-lb-line-1 hover:border-lb-line-2 focus:border-lb-brand focus:shadow-[0_0_0_3px_theme(colors.lb-brand-light)]",
          disabled && "bg-lb-surface-grey text-lb-on-surface-3 cursor-not-allowed"
        )}
      />
    </div>
    {errorText && (
      <span className="font-lb text-[12px] text-lb-red">{errorText}</span>
    )}
  </div>
)
export default DiscountField
*/


// ════════════════════════════════════════════════════════════
// 10. SearchBar — components/ui/search-bar.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export const SearchBar = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <div className={cn("relative", className)}>
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-lb-on-surface-3 w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <input
        ref={ref}
        type="text"
        className="h-10 pl-10 pr-4 w-full rounded-lb-pill bg-lb-surface-grey border-none font-lb text-[14px] text-lb-on-surface placeholder:text-lb-on-surface-3 outline-none transition-all duration-200 focus:bg-lb-surface focus:border-2 focus:border-lb-brand"
        {...props}
      />
    </div>
  )
)
SearchBar.displayName = "SearchBar"
export default SearchBar
*/


// ════════════════════════════════════════════════════════════
// 11. StickyAction — components/ui/sticky-action.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export const StickyAction: React.FC<{
  platform?: "mobile" | "tablet" | "desktop"
  hasScroll?: boolean
  primaryAction?: { label: string; onClick: () => void; disabled?: boolean; size?: "md" | "lg" }
  secondaryAction?: { label: string; onClick: () => void; disabled?: boolean }
  iconAction?: { icon: React.ReactNode; onClick: () => void }
  destructiveAction?: { label: string; onClick: () => void }
  subtotal?: { label: string; amount: string }
  className?: string
}> = ({ platform = "mobile", hasScroll = false, primaryAction, secondaryAction, iconAction, destructiveAction, subtotal, className }) => {
  const showBg = platform !== "mobile" || hasScroll
  return (
    <div className={cn(
      "sticky bottom-0 z-[100]",
      showBg && "bg-lb-surface border-t border-lb-line-1 shadow-lb",
      platform === "mobile"  && "px-4 py-3 flex flex-col gap-2",
      platform === "tablet"  && "px-5 py-3 flex justify-between items-center gap-4",
      platform === "desktop" && "px-6 py-3 flex justify-between items-center gap-6",
      className
    )}>
      {platform !== "desktop" && (
        <div className="flex items-center gap-2 ml-auto">
          {iconAction && (
            <button
              onClick={iconAction.onClick}
              className="w-11 h-11 flex items-center justify-center rounded-lb-sm border border-lb-brand bg-lb-surface text-lb-brand hover:bg-lb-brand-light transition-colors duration-150 cursor-pointer flex-shrink-0"
            >
              {iconAction.icon}
            </button>
          )}
          {subtotal && platform === "tablet" && (
            <div className="flex flex-col gap-0.5 mr-auto">
              <span className="font-lb text-[10px] text-lb-on-surface-2 leading-[16px]">{subtotal.label}</span>
              <span className="font-lb text-[16px] font-lb-bold text-lb-on-surface">{subtotal.amount}</span>
            </div>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              disabled={secondaryAction.disabled}
              className="h-11 px-6 rounded-lb-sm border border-lb-brand bg-lb-surface text-lb-brand font-lb text-[16px] font-lb-regular hover:enabled:bg-lb-brand-light disabled:bg-lb-surface-grey disabled:text-lb-on-surface-3 disabled:border-lb-line-1 transition-colors duration-150 cursor-pointer"
            >
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              className="h-11 px-6 rounded-lb-sm bg-lb-brand text-lb-brand-on font-lb text-[16px] font-lb-regular hover:enabled:bg-lb-brand-hover disabled:bg-lb-surface-grey disabled:text-lb-on-surface-3 transition-colors duration-150 border-none cursor-pointer"
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      )}

      {platform === "desktop" && (
        <>
          {destructiveAction && (
            <button
              onClick={destructiveAction.onClick}
              className="font-lb text-[14px] font-lb-bold text-lb-red bg-transparent border-none cursor-pointer hover:underline"
            >
              {destructiveAction.label}
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                disabled={secondaryAction.disabled}
                className="h-[50px] px-6 rounded-lb-btn border border-lb-brand bg-lb-surface text-lb-brand font-lb text-[16px] font-lb-regular hover:enabled:bg-lb-brand-light disabled:opacity-50 transition-colors duration-150 cursor-pointer"
              >
                {secondaryAction.label}
              </button>
            )}
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                className="h-[50px] px-6 rounded-lb-btn bg-lb-brand text-lb-brand-on font-lb text-[16px] font-lb-regular hover:enabled:bg-lb-brand-hover disabled:bg-lb-surface-grey disabled:text-lb-on-surface-3 transition-colors duration-150 border-none cursor-pointer"
              >
                {primaryAction.label}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
export default StickyAction
*/


// ════════════════════════════════════════════════════════════
// 12. StickyHeader — components/ui/sticky-header.tsx
// ════════════════════════════════════════════════════════════
/*
import * as React from "react"
import { cn } from "@/lib/utils"

export const StickyHeader: React.FC<{
  title: string
  onBack?: () => void
  rightAction?: React.ReactNode
  className?: string
}> = ({ title, onBack, rightAction, className }) => (
  <div className={cn(
    "sticky top-0 z-[100] h-14 px-4 flex items-center gap-3",
    "bg-lb-surface border-b border-lb-line-1",
    "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
    className
  )}>
    {onBack && (
      <button
        onClick={onBack}
        className="w-10 h-10 flex items-center justify-center rounded-lb-sm border-none bg-transparent text-lb-on-surface cursor-pointer hover:bg-lb-surface-grey transition-colors duration-150"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    )}
    <h1 className="flex-1 font-lb text-[18px] font-lb-bold text-lb-on-surface leading-[26px] tracking-[0.1238px] truncate">
      {title}
    </h1>
    {rightAction}
  </div>
)
export default StickyHeader
*/


// ════════════════════════════════════════════════════════════
// 13. Snackbar — components/ui/snackbar.tsx
// ════════════════════════════════════════════════════════════
/*
 * Behavior (from skill [13]):
 * - position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%)
 * - z-index: 500
 * - border-radius: radius-small (8px) — NOT radius-card (12px)
 * - Entrance animation: slide up + fade in (lb-snack-in)
 * - Auto-dismiss: caller controls via setTimeout (typically 3500ms)
 * - Variants: default (dark), success (green), error (red), warning (orange)
 * - Optional action button (brand blue text) and/or close button
 *
 * Usage pattern:
 *   const [snack, setSnack] = useState<SnackbarProps | null>(null)
 *   const toast = (msg, variant?) => {
 *     setSnack({ message: msg, variant })
 *     setTimeout(() => setSnack(null), 3500)
 *   }
 *   {snack && <Snackbar {...snack} onClose={() => setSnack(null)} />}
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const snackbarVariants = cva(
  [
    // Fixed positioning — always centered at bottom
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-[500]",
    "flex items-center gap-3 px-4 py-3",
    // radius-small (8px), NOT radius-card (12px)
    "rounded-lb-sm",
    "shadow-lb",
    "font-lb text-[14px] leading-[20px]",
    "min-w-[280px] max-w-[400px]",
    // Entrance animation
    "animate-lb-snack-in",
  ],
  {
    variants: {
      variant: {
        default: "bg-lb-on-surface text-lb-on-surface-rev",
        success: "bg-lb-green text-white",
        error:   "bg-lb-red-bg   text-lb-red-text   border border-lb-red",
        warning: "bg-lb-orange-bg text-lb-orange-text border border-lb-orange",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

// Add this keyframe to your global CSS / tailwind config:
// @keyframes lb-snack-in { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

export interface SnackbarProps extends VariantProps<typeof snackbarVariants> {
  message: string
  action?: { label: string; onClick: () => void }
  onClose?: () => void
  className?: string
}

export const Snackbar: React.FC<SnackbarProps> = ({ message, variant, action, onClose, className }) => (
  <div className={cn(snackbarVariants({ variant }), className)}>
    <span className="flex-1">{message}</span>
    {action && (
      <button
        onClick={action.onClick}
        className="font-lb-bold text-lb-brand bg-transparent border-none cursor-pointer hover:underline whitespace-nowrap font-lb text-[14px]"
      >
        {action.label}
      </button>
    )}
    {onClose && (
      <button
        onClick={onClose}
        className="opacity-60 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer text-inherit"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    )}
  </div>
)
export default Snackbar
*/



// ════════════════════════════════════════════════════════════
// 14. Infobox — components/ui/infobox.tsx
// ════════════════════════════════════════════════════════════
/*
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const infoboxVariants = cva(
  "flex items-start gap-3 p-3 rounded-lb-card border font-lb text-[12px] leading-[18px] tracking-[0.0825px]",
  {
    variants: {
      variant: {
        info:    "bg-lb-brand-light border-lb-brand  text-lb-brand-hover",
        success: "bg-lb-green-bg    border-lb-green  text-lb-green-text",
        warning: "bg-lb-orange-bg   border-lb-orange text-lb-orange-text",
        error:   "bg-lb-red-bg      border-lb-red    text-lb-red-text",
      },
    },
    defaultVariants: { variant: "info" },
  }
)

export const Infobox: React.FC<VariantProps<typeof infoboxVariants> & { message: string; className?: string }> = ({ message, variant, className }) => (
  <div className={cn(infoboxVariants({ variant }), className)}>
    <svg className="w-4 h-4 flex-shrink-0 mt-px" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
    <span>{message}</span>
  </div>
)
export default Infobox
*/


// ════════════════════════════════════════════════════════════
// 15. Tooltip — components/ui/tooltip.tsx
// ════════════════════════════════════════════════════════════
/*
import * as React from "react"
import { cn } from "@/lib/utils"

export const Tooltip: React.FC<{
  content: string
  children: React.ReactNode
  placement?: "top" | "bottom"
  className?: string
}> = ({ content, children, placement = "top", className }) => (
  <div className={cn("relative inline-flex group", className)}>
    {children}
    <div className={cn(
      "absolute z-50 px-3 py-2 rounded-lb-sm",
      "bg-lb-on-surface text-lb-on-surface-rev",
      "font-lb text-[12px] leading-[18px] whitespace-nowrap",
      "shadow-lb opacity-0 pointer-events-none",
      "group-hover:opacity-100 transition-opacity duration-150",
      placement === "top"
        ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
        : "top-full mt-2 left-1/2 -translate-x-1/2"
    )}>
      {content}
    </div>
  </div>
)
export default Tooltip
*/


// ════════════════════════════════════════════════════════════
// 16. PageIndicator — components/ui/page-indicator.tsx
// ════════════════════════════════════════════════════════════
/*
import * as React from "react"
import { cn } from "@/lib/utils"

export const PageIndicator: React.FC<{
  count: number
  active: number
  variant?: "dark" | "light"
  className?: string
}> = ({ count, active, variant = "dark", className }) => (
  <div className={cn("flex items-center gap-1.5", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
        style={{
          // Dot opacity uses inline style — token values for rgba can't use var() reliably in rgba()
          backgroundColor: i === active
            ? variant === "dark" ? "rgba(40,40,40,0.40)" : "rgba(255,255,255,1.0)"
            : variant === "dark" ? "rgba(40,40,40,0.10)" : "rgba(255,255,255,0.30)"
        }}
      />
    ))}
  </div>
)
export default PageIndicator
*/


// ════════════════════════════════════════════════════════════
// 17. Separator — components/ui/separator.tsx
// ════════════════════════════════════════════════════════════
/*
import * as React from "react"
import { cn } from "@/lib/utils"

export const Separator: React.FC<{ variant?: "thin" | "thick"; className?: string }> = ({ variant = "thin", className }) => (
  <div className={cn(
    "w-full",
    variant === "thin" ? "h-px bg-lb-line-1" : "h-1 bg-lb-surface-grey",
    className
  )} />
)
export default Separator
*/


// ════════════════════════════════════════════════════════════
// 18. StatusBadge — components/ui/status-badge.tsx
// ════════════════════════════════════════════════════════════
/*
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1 px-2 py-0.5 rounded-lb-pill font-lb text-[12px] font-lb-bold leading-[18px] tracking-[0.0825px] whitespace-nowrap",
  {
    variants: {
      variant: {
        grey:   "bg-lb-grey-bg   text-lb-grey-text",
        green:  "bg-lb-green-bg  text-lb-green-text",
        yellow: "bg-lb-yellow-bg text-lb-yellow-text",
        orange: "bg-lb-orange-bg text-lb-orange-text",
        red:    "bg-lb-red-bg    text-lb-red-text",
        blue:   "bg-lb-brand-dark text-lb-brand-hover",
      },
    },
    defaultVariants: { variant: "grey" },
  }
)

export const StatusBadge: React.FC<VariantProps<typeof statusBadgeVariants> & { label: string; dot?: boolean; className?: string }> = ({ label, variant, dot = true, className }) => (
  <span className={cn(statusBadgeVariants({ variant }), className)}>
    {dot && <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />}
    {label}
  </span>
)
export default StatusBadge
*/


// ════════════════════════════════════════════════════════════
// 19. FilterPill — components/ui/filter-pill.tsx
// ════════════════════════════════════════════════════════════
/*
 * FilterPill opens a FilterDesktop panel (274px card) — NOT a general Dropdown.
 * Panel anatomy:
 *   - Header: title (bold 14px) + "Hapus Filter" CTA (red 12px, shown only when active)
 *   - Search bar: grey bg, left icon, radius-small (8px)
 *   - Radio rows: 20×20 radio circle + label 12px, full-width clickable rows
 *   - Optional "not found" text when search yields no results
 * Behavior:
 *   - Pill: radius-small (8px), NOT pill (100px). Border turns brand-blue when active.
 *   - Chevron inside pill rotates 180° when panel is open.
 *   - Click outside closes panel. Click another FilterPill closes current one.
 *   - "Hapus Filter" resets to the "all"/empty value and closes panel.
 */
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface FilterOption {
  value: string
  label: string
}

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="16" height="16" viewBox="0 0 16 16" fill="none"
    className={cn("flex-shrink-0 transition-transform duration-200", open && "rotate-180")}
  >
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SearchIcon = () => (
  <svg className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-lb-on-surface-3 pointer-events-none" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M12 12l-2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

const RadioIcon = ({ selected }: { selected: boolean }) => (
  <span className={cn(
    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-150",
    selected ? "border-lb-brand" : "border-lb-line-2"
  )}>
    {selected && <span className="w-2.5 h-2.5 rounded-full bg-lb-brand" />}
  </span>
)

export const FilterPill: React.FC<{
  /** Panel title shown inside the dropdown panel */
  label: string
  /** Currently selected value. Pass empty string or "all" for no selection. */
  value: string
  /** All options available in the panel */
  options: FilterOption[]
  onChange: (value: string) => void
  /** Value that represents "no filter / show all" — defaults to "all" */
  allValue?: string
  /** Show search bar inside panel — defaults to true */
  searchable?: boolean
  className?: string
}> = ({
  label, value, options, onChange,
  allValue = "all", searchable = true, className
}) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const ref = React.useRef<HTMLDivElement>(null)

  const isActive = value !== allValue && value !== ""

  const displayLabel = isActive
    ? (options.find(o => o.value === value)?.label ?? label)
    : label

  // Close on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filtered = searchable
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  const handleOpen = () => {
    setSearch("")
    setOpen(o => !o)
  }

  const handleSelect = (v: string) => {
    onChange(v)
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(allValue)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      {/* Pill trigger — radius-small (8px), NOT pill (100px) */}
      <button
        onClick={handleOpen}
        className={cn(
          "inline-flex items-center gap-1 py-1.5 px-2 rounded-lb-sm border",
          "font-lb text-[12px] font-lb-regular",
          "bg-lb-surface cursor-pointer whitespace-nowrap transition-all duration-150",
          isActive
            ? "border-lb-brand text-lb-brand"
            : "border-lb-on-surface-3 text-lb-on-surface-3 hover:border-lb-line-2",
          className
        )}
      >
        {displayLabel}
        <ChevronIcon open={open} />
      </button>

      {/* FilterDesktop panel — 274px card with elevation, NOT the general lb-dd-panel */}
      {open && (
        <div className={cn(
          "absolute top-[calc(100%+6px)] left-0 z-[300]",
          "w-[274px] bg-lb-surface border border-lb-line-2",
          "rounded-lb-card shadow-lb-filter",
          "p-5 flex flex-col gap-3"
        )}>
          {/* Header: title + "Hapus Filter" (only when active) */}
          <div className="flex items-center justify-between flex-shrink-0">
            <span className="font-lb text-[14px] font-lb-bold text-lb-on-surface leading-[20px]">
              {label}
            </span>
            {isActive && (
              <button
                onClick={handleClear}
                className="font-lb text-[12px] font-lb-regular text-lb-red bg-transparent border-none cursor-pointer leading-[18px] p-0 whitespace-nowrap hover:underline"
              >
                Hapus Filter
              </button>
            )}
          </div>

          {/* Search bar */}
          {searchable && (
            <div className="relative flex-shrink-0">
              <SearchIcon />
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari..."
                className={cn(
                  "w-full h-9 pl-8 pr-3 rounded-lb-sm",
                  "bg-lb-surface-grey border-none",
                  "font-lb text-[14px] text-lb-on-surface",
                  "placeholder:text-lb-on-surface-3 outline-none"
                )}
              />
            </div>
          )}

          {/* Radio option rows */}
          <div className="flex flex-col flex-shrink-0">
            {filtered.length === 0 ? (
              <p className="font-lb text-[14px] text-lb-on-surface-2 leading-[20px] py-2">
                "{search}" tidak ditemukan, coba cari kata kunci lain.
              </p>
            ) : (
              filtered.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className="flex items-center gap-3 py-2 bg-transparent border-none cursor-pointer text-left w-full"
                >
                  <RadioIcon selected={value === opt.value} />
                  <span className="font-lb text-[12px] font-lb-regular text-lb-on-surface leading-[18px]">
                    {opt.label}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
export default FilterPill
*/


// ════════════════════════════════════════════════════════════
// 20. Tabs — components/ui/tabs.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface Tab { id: string; label: string; count?: number }

export const Tabs: React.FC<{
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
  className?: string
}> = ({ tabs, activeTab, onChange, className }) => (
  <div className={cn("flex border-b border-lb-line-1 overflow-x-auto", className)}>
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab
      return (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative flex items-center gap-1.5 px-4 h-11 flex-shrink-0",
            "font-lb text-[14px] leading-[20px] tracking-[0.0962px]",
            "border-none bg-transparent cursor-pointer transition-colors duration-150",
            isActive
              ? "text-lb-brand font-lb-bold"
              : "text-lb-on-surface-2 font-lb-regular hover:text-lb-on-surface"
          )}
        >
          {tab.label}
          {tab.count != null && (
            <span className={cn(
              "text-[12px] font-lb-bold px-1.5 py-0.5 rounded-lb-pill",
              isActive ? "bg-lb-brand-dark text-lb-brand" : "bg-lb-grey-bg text-lb-grey-text"
            )}>
              {tab.count}
            </span>
          )}
          {isActive && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-lb-brand rounded-t-full" />}
        </button>
      )
    })}
  </div>
)
export default Tabs
*/


// ════════════════════════════════════════════════════════════
// 21. Chip — components/ui/chip.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export const Chip: React.FC<{
  label: string
  selected?: boolean
  onSelect?: () => void
  onRemove?: () => void
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
}> = ({ label, selected, onSelect, onRemove, icon, disabled, className }) => (
  <button
    onClick={() => !disabled && onSelect?.()}
    disabled={disabled}
    className={cn(
      "inline-flex items-center gap-1.5 h-8 px-3 rounded-lb-pill border",
      "font-lb text-[12px] font-lb-bold leading-[18px] tracking-[0.0825px]",
      "cursor-pointer transition-all duration-150",
      selected
        ? "bg-lb-brand-dark border-lb-brand text-lb-brand"
        : "bg-lb-surface border-lb-line-1 text-lb-on-surface hover:border-lb-line-2",
      disabled && "bg-lb-surface-grey border-lb-line-1 text-lb-on-surface-3 cursor-not-allowed",
      className
    )}
  >
    {icon}
    <span>{label}</span>
    {onRemove && selected && (
      <span
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-lb-brand-light transition-colors"
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M6 2L2 6M2 2l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </span>
    )}
  </button>
)
export default Chip
*/


// ════════════════════════════════════════════════════════════
// 22. Dropdown — components/ui/dropdown.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface DropdownOption { value: string; label: string; disabled?: boolean }

export const Dropdown: React.FC<{
  options: DropdownOption[]
  value?: string | string[]
  onChange?: (value: string | string[]) => void
  placeholder?: string
  multi?: boolean
  searchable?: boolean
  disabled?: boolean
  error?: boolean
  errorText?: string
  label?: string
  required?: boolean
  className?: string
}> = ({
  options, value, onChange, placeholder = "Pilih...", multi = false,
  searchable = false, disabled = false, error = false, errorText, label, required, className
}) => {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const isSelected = (v: string) => multi ? (value as string[] || []).includes(v) : value === v
  const displayValue = multi
    ? (value as string[] || []).length > 1 ? `${(value as string[]).length} dipilih`
      : options.find(o => o.value === (value as string[])?.[0])?.label || ""
    : options.find(o => o.value === value)?.label || ""

  const filtered = searchable
    ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  const handleSelect = (v: string) => {
    if (multi) {
      const arr = value as string[] || []
      onChange?.(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v])
    } else {
      onChange?.(v); setOpen(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-1 w-full", className)} ref={ref}>
      {label && (
        <div className="flex items-center gap-0.5">
          {required && <span className="font-lb text-[14px] font-lb-bold text-lb-red">*</span>}
          <span className="font-lb text-[12px] text-lb-on-surface leading-[18px]">{label}</span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          className={cn(
            "w-full min-h-10 px-3 pr-10 py-2.5 rounded-lb-sm border text-left",
            "font-lb text-[14px] leading-[20px] tracking-[0.0962px]",
            "transition-colors duration-150 outline-none cursor-pointer",
            open        ? "border-lb-brand bg-lb-surface text-lb-on-surface"
            : error     ? "border-lb-red   bg-lb-surface text-lb-on-surface"
            :              "border-lb-line-1 bg-lb-surface text-lb-on-surface hover:border-lb-line-2",
            disabled && "bg-lb-surface-grey text-lb-on-surface-3 cursor-not-allowed border-lb-line-1",
            !displayValue && "text-lb-on-surface-3"
          )}
        >
          {displayValue || placeholder}
          <svg
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-transform duration-200",
              open ? "rotate-180 text-lb-brand" : "text-lb-on-surface"
            )}
            viewBox="0 0 20 20" fill="none"
          >
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {open && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-[1000] bg-lb-surface border border-lb-line-2 rounded-lb-sm shadow-lb-filter p-1 max-h-[300px] overflow-y-auto">
            {searchable && (
              <div className="relative mb-1">
                <input
                  autoFocus
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari..."
                  className="w-full h-9 pl-9 pr-3 rounded-lb-sm border border-lb-line-1 font-lb text-[14px] outline-none focus:border-lb-brand text-lb-on-surface placeholder:text-lb-on-surface-3"
                />
                <svg className="absolute left-2.5 top-2.5 w-4 h-4 text-lb-on-surface-3" viewBox="0 0 16 16" fill="none">
                  <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            {filtered.length === 0 && (
              <p className="text-center text-[12px] text-lb-on-surface-3 py-3 font-lb">Kata kunci tidak ditemukan</p>
            )}
            {filtered.map(opt => (
              <button
                key={opt.value}
                disabled={opt.disabled}
                onClick={() => !opt.disabled && handleSelect(opt.value)}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lb-sm min-h-10",
                  "font-lb text-[14px] leading-[20px] tracking-[0.0962px] text-left",
                  "border-none cursor-pointer transition-colors duration-[120ms]",
                  isSelected(opt.value)
                    ? "bg-lb-brand-dark text-lb-brand font-lb-bold"
                    : "bg-transparent text-lb-on-surface font-lb-regular hover:bg-lb-surface-grey",
                  opt.disabled && "text-lb-on-surface-3 cursor-not-allowed"
                )}
              >
                {multi && (
                  <span className={cn(
                    "w-6 h-6 rounded-lb-xs border flex items-center justify-center flex-shrink-0 transition-colors",
                    isSelected(opt.value)
                      ? "bg-lb-brand border-lb-brand"
                      : "bg-lb-surface border-lb-line-2"
                  )}>
                    {isSelected(opt.value) && (
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <path d="M1 4.5L4 7.5L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                )}
                <span className="flex-1">{opt.label}</span>
                {!multi && isSelected(opt.value) && (
                  <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                    <path d="M1 6L5.5 10.5L14 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {errorText && <span className="font-lb text-[12px] text-lb-red">{errorText}</span>}
    </div>
  )
}
export default Dropdown
*/


// ════════════════════════════════════════════════════════════
// 23. Table — components/ui/table.tsx
// ════════════════════════════════════════════════════════════
/*
 * Behavior (from skill [23]):
 * - Parent MUST set an explicit height (e.g. height: calc(100vh - 64px)).
 *   Without explicit height the table cannot flex correctly.
 * - .lb-table-wrap is a flex-col with overflow:hidden (clips border-radius).
 * - Toolbar and footer: flex: 0 0 auto — never scroll.
 * - Scroll body: overflow: auto only. No flex:1 unless parent has explicit height.
 * - <thead> is sticky top:0. NO box-shadow on thead.
 * - Horizontal scroll: inside scroll body only. Shadow on right sticky col when scrollLeft > 0.
 * - Empty state: rendered in <tr><td colSpan={n}> — footer still renders below.
 * - Pagination: individual page number buttons (lb-pg-btn pattern), not just prev/next.
 * - Footer height: 60px.
 * - No border-right on individual cells (skill CSS has no border-r per cell).
 */
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TableColumn<T> {
  key: keyof T
  header: string
  width?: number
  align?: "left" | "right" | "center"
  sticky?: "left" | "right"
  render?: (value: T[keyof T], row: T) => React.ReactNode
}

export function Table<T extends { id: string | number }>({
  columns, data, loading, onRowClick,
  totalRows = 0, page = 1, perPage = 20, onPageChange,
  toolbar, emptyState, className
}: {
  columns: TableColumn<T>[]
  data: T[]
  loading?: boolean
  onRowClick?: (row: T) => void
  totalRows?: number
  page?: number
  perPage?: number
  onPageChange?: (page: number) => void
  toolbar?: React.ReactNode
  /** Custom empty state node rendered inside tbody when data is empty */
  emptyState?: React.ReactNode
  className?: string
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = React.useState(false)
  const totalPages = Math.ceil(totalRows / perPage)

  const handleScroll = () => {
    setScrolled((scrollRef.current?.scrollLeft ?? 0) > 0)
  }

  const stickyBg = "bg-lb-surface"

  // Page numbers to show (max 7 slots: prev, up to 5 nums, next)
  const pageNums = React.useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const delta = 2
    const range: (number | "...")[] = []
    let prev: number | null = null
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        if (prev !== null && i - prev > 1) range.push("...")
        range.push(i)
        prev = i
      }
    }
    return range
  }, [page, totalPages])

  return (
    <div className={cn(
      "flex flex-col bg-lb-surface border border-lb-line-1",
      "rounded-lb-card overflow-hidden",
      // ⚠️ height must be set by parent. Add min-h-0 to allow flex shrinking.
      "min-h-0",
      className
    )}>
      {/* Toolbar — flex: none, never scrolls */}
      {toolbar && (
        <div className="flex-none min-h-14 px-5 py-3 border-b border-lb-line-2 flex items-center justify-between gap-3 bg-lb-surface">
          {toolbar}
        </div>
      )}

      {/* Scroll body — overflow: auto only, no flex:1 (parent sets height) */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="overflow-auto"
      >
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-20 bg-lb-surface">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    "h-[49px] px-4 font-lb text-[14px]",
                    "font-lb-bold text-lb-on-surface leading-[20px]",
                    "whitespace-nowrap border-b border-lb-line-2 bg-lb-surface",
                    col.align === "right"  && "text-right",
                    col.align === "center" && "text-center",
                    !col.align             && "text-left",
                    col.sticky === "left"  && `sticky left-0 z-[22] ${stickyBg}`,
                    col.sticky === "right" && `sticky right-0 z-[22] ${stickyBg}`,
                    col.sticky === "right" && scrolled && "shadow-lb-sticky-col"
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-lb-on-surface-3 font-lb text-[14px]">
                  Memuat...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  {emptyState ?? (
                    <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
                      <p className="font-lb text-[14px] text-lb-on-surface-2">Tidak ada data</p>
                    </div>
                  )}
                </td>
              </tr>
            ) : data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "transition-colors duration-[120ms]",
                  onRowClick && "cursor-pointer hover:bg-lb-brand-light"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn(
                      "h-[49px] px-4 font-lb text-[14px]",
                      "text-lb-on-surface leading-[20px] bg-lb-surface",
                      "border-b border-lb-line-1",
                      col.align === "right"  && "text-right",
                      col.align === "center" && "text-center",
                      !col.align             && "text-left",
                      col.sticky === "left"  && `sticky left-0 z-[21] ${stickyBg}`,
                      col.sticky === "right" && `sticky right-0 z-[21] ${stickyBg}`,
                      col.sticky === "right" && scrolled && "shadow-lb-sticky-col"
                    )}
                  >
                    {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer — flex: none, height 60px, border-top */}
      <div className="flex-none h-[60px] px-5 border-t border-lb-line-1 flex items-center justify-between bg-lb-surface">
        <span className="font-lb text-[12px] text-lb-on-surface-2">
          {totalRows} total data
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            {/* Prev */}
            <button
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className={cn(
                "w-[30px] h-[30px] rounded-lb-sm flex items-center justify-center",
                "font-lb text-[14px] border transition-colors duration-[120ms] cursor-pointer",
                page <= 1
                  ? "bg-lb-surface-grey text-lb-on-surface-3 border-transparent cursor-not-allowed"
                  : "bg-lb-surface border-lb-brand text-lb-on-surface hover:bg-lb-surface-grey"
              )}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Page numbers */}
            {pageNums.map((n, i) =>
              n === "..." ? (
                <span key={`ellipsis-${i}`} className="w-[30px] h-[30px] flex items-center justify-center font-lb text-[14px] text-lb-on-surface-2">…</span>
              ) : (
                <button
                  key={n}
                  onClick={() => onPageChange?.(n as number)}
                  className={cn(
                    "w-[30px] h-[30px] rounded-lb-sm flex items-center justify-center",
                    "font-lb text-[14px] border-none transition-colors duration-[120ms] cursor-pointer",
                    n === page
                      ? "bg-lb-brand text-lb-brand-on"
                      : "bg-transparent text-lb-on-surface hover:bg-lb-surface-grey"
                  )}
                >
                  {n}
                </button>
              )
            )}

            {/* Next */}
            <button
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className={cn(
                "w-[30px] h-[30px] rounded-lb-sm flex items-center justify-center",
                "font-lb text-[14px] border transition-colors duration-[120ms] cursor-pointer",
                page >= totalPages
                  ? "bg-lb-surface-grey text-lb-on-surface-3 border-transparent cursor-not-allowed"
                  : "bg-lb-surface border-lb-brand text-lb-on-surface hover:bg-lb-surface-grey"
              )}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
export default Table
*/


// ════════════════════════════════════════════════════════════
// 24. Popup — components/ui/popup.tsx
// ════════════════════════════════════════════════════════════
/*
 * Behavior (from skill [24]):
 * - Header: padding 24px 24px 0 (NO bottom padding — body's 16px top pad provides gap).
 * - Body: padding 16px 24px. ONLY body scrolls. Header + footer are flex-shrink-0.
 * - Footer: padding 16px 24px. Both buttons flex:1. Border-top separator.
 * - Mobile: drag handle ABOVE header (not inside it), modal slides from bottom (items-end).
 * - text-align on header:
 *     Confirmation/alert modals  → center (DEFAULT, no prop needed)
 *     Form modals (with inputs)  → left   (pass align="left")
 * - Close (×) button: absolute top-4 right-4 inside the header div.
 * - Body scroll lock on open via document.body.style.overflow = "hidden".
 * - Destructive primary button: caller passes primaryAction.destructive=true to get red styling.
 */
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export const Popup: React.FC<{
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  platform?: "mobile" | "tablet" | "desktop"
  /** Header text alignment.
   *  - "center" (default): confirmation/alert modals
   *  - "left": form modals with input fields */
  align?: "center" | "left"
  primaryAction?: { label: string; onClick: () => void; disabled?: boolean; destructive?: boolean }
  secondaryAction?: { label: string; onClick: () => void }
  children?: React.ReactNode
  className?: string
}> = ({
  open, onClose, title, description,
  platform = "mobile", align = "center",
  primaryAction, secondaryAction, children, className
}) => {
  // Body scroll lock
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  if (!open) return null

  const panelClass = {
    mobile:  "w-full rounded-t-3xl rounded-b-none max-h-[680px]",
    tablet:  "w-[480px] rounded-lb-card max-h-[90vh]",
    desktop: "w-[560px] rounded-lb-card max-h-[90vh]",
  }[platform]

  return (
    <div className={cn(
      "fixed inset-0 z-[200] flex justify-center",
      platform === "mobile" ? "items-end" : "items-center"
    )}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Panel */}
      <div className={cn(
        "relative bg-lb-surface shadow-lb flex flex-col overflow-hidden",
        panelClass, className
      )}>
        {/* Mobile drag handle — ABOVE header, outside header div */}
        {platform === "mobile" && (
          <div className="w-10 h-1 rounded-lb-pill bg-lb-line-2 mx-auto mt-2 flex-shrink-0" />
        )}

        {/* Header — padding: 24px 24px 0. NO bottom padding. flex-shrink-0. */}
        {(title || description) && (
          <div
            className={cn(
              "relative px-6 pt-6 flex-shrink-0",
              align === "left" ? "text-left" : "text-center"
            )}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-lb-on-surface hover:bg-lb-surface-grey transition-colors bg-transparent border-none cursor-pointer rounded-full"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            {title && (
              <h2 className="font-lb text-[20px] font-lb-bold text-lb-on-surface leading-[30px] tracking-[0.1375px] m-0">
                {title}
              </h2>
            )}
            {description && (
              <p className="font-lb text-[14px] text-lb-on-surface-2 leading-[20px] tracking-[0.0962px] mt-2 mb-0">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Body — ONLY this scrolls. padding: 16px 24px. */}
        {children && (
          <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
            {children}
          </div>
        )}

        {/* Footer — flex-shrink-0, padding 16px 24px, border-top, both buttons flex:1 */}
        {(primaryAction || secondaryAction) && (
          <div className="px-6 py-4 border-t border-lb-line-1 bg-lb-surface flex gap-3 flex-shrink-0">
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className="flex-1 h-[50px] rounded-lb-btn border border-lb-brand bg-lb-surface text-lb-brand font-lb text-[16px] font-lb-regular hover:bg-lb-brand-light transition-colors duration-150 cursor-pointer"
              >
                {secondaryAction.label}
              </button>
            )}
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                className={cn(
                  "flex-1 h-[50px] rounded-lb-btn",
                  "font-lb text-[16px] font-lb-regular",
                  "transition-colors duration-150 border-none cursor-pointer",
                  primaryAction.destructive
                    ? "bg-lb-red text-white hover:enabled:opacity-90 disabled:bg-lb-surface-grey disabled:text-lb-on-surface-3"
                    : "bg-lb-brand text-lb-brand-on hover:enabled:bg-lb-brand-hover disabled:bg-lb-surface-grey disabled:text-lb-on-surface-3"
                )}
              >
                {primaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default Popup
*/


// ════════════════════════════════════════════════════════════
// 25. EmptyState — components/ui/empty-state.tsx
// ════════════════════════════════════════════════════════════
/*
import * as React from "react"
import { cn } from "@/lib/utils"

export const EmptyState: React.FC<{
  illustration?: React.ReactNode
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
  className?: string
}> = ({ illustration, title, description, action, className }) => (
  <div className={cn("flex flex-col items-center justify-center gap-4 py-16 px-6 text-center", className)}>
    {illustration && <div className="w-40 h-40 flex items-center justify-center">{illustration}</div>}
    <div className="flex flex-col gap-2">
      <h3 className="font-lb text-[18px] font-lb-bold text-lb-on-surface leading-[26px] tracking-[0.1238px] m-0">
        {title}
      </h3>
      {description && (
        <p className="font-lb text-[14px] text-lb-on-surface-2 leading-[20px] tracking-[0.0962px] max-w-[280px] m-0">
          {description}
        </p>
      )}
    </div>
    {action && (
      <button
        onClick={action.onClick}
        className="h-11 px-6 rounded-lb-sm bg-lb-brand text-lb-brand-on font-lb text-[16px] font-lb-regular hover:bg-lb-brand-hover transition-colors duration-150 border-none cursor-pointer"
      >
        {action.label}
      </button>
    )}
  </div>
)
export default EmptyState
*/


// ════════════════════════════════════════════════════════════
// 26. DesktopNavbar — components/ui/desktop-navbar.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  children?: { id: string; label: string }[]
}

export const DesktopNavbar: React.FC<{
  items: NavItem[]
  activeId: string
  onNavigate: (id: string) => void
  logo?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}> = ({ items, activeId, onNavigate, logo, footer, className }) => {
  const [expanded, setExpanded] = React.useState<string[]>([])
  const isActive = (id: string) => id === activeId
  const hasActiveChild = (item: NavItem) => item.children?.some(c => isActive(c.id))

  return (
    <aside className={cn("w-[240px] h-full flex-shrink-0 bg-lb-surface border-r border-lb-line-1 flex flex-col", className)}>
      <div className="h-16 px-4 flex items-center">{logo}</div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
        {items.map((item) => {
          const parentActive = isActive(item.id) || hasActiveChild(item)
          const isExpanded = expanded.includes(item.id) || !!hasActiveChild(item)

          return (
            <div key={item.id}>
              <button
                onClick={() => item.children
                  ? setExpanded(prev => prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id])
                  : onNavigate(item.id)
                }
                className={cn(
                  "relative w-full h-12 flex items-center gap-3 px-3 rounded-lb-sm",
                  "font-lb text-[14px] leading-[20px] tracking-[0.0962px]",
                  "border-none cursor-pointer transition-colors duration-150 text-left",
                  parentActive
                    ? "bg-lb-brand-light text-lb-brand font-lb-bold"
                    : "bg-transparent text-lb-on-surface font-lb-regular hover:bg-lb-surface-grey"
                )}
              >
                {parentActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-lb-brand rounded-r-full" />
                )}
                <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.children && (
                  <svg className={cn("w-4 h-4 transition-transform duration-200", isExpanded && "rotate-180")} viewBox="0 0 16 16" fill="none">
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              {item.children && (
                <div className={cn("overflow-hidden transition-all duration-300", isExpanded ? "max-h-[400px]" : "max-h-0")}>
                  {item.children.map(child => (
                    <button
                      key={child.id}
                      onClick={() => onNavigate(child.id)}
                      className={cn(
                        "w-full h-10 flex items-center pl-11 pr-3 rounded-lb-sm",
                        "font-lb text-[14px] leading-[20px] tracking-[0.0962px]",
                        "border-none cursor-pointer transition-colors duration-150 text-left",
                        isActive(child.id)
                          ? "text-lb-brand font-lb-bold bg-lb-brand-light"
                          : "text-lb-on-surface font-lb-regular hover:bg-lb-surface-grey"
                      )}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      {footer && <div className="border-t border-lb-line-1 p-3">{footer}</div>}
    </aside>
  )
}
export default DesktopNavbar
*/


// ════════════════════════════════════════════════════════════
// 27. BottomNavbar — components/ui/bottom-navbar.tsx
// ════════════════════════════════════════════════════════════
/*
"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export interface BottomNavItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: number
}

export const BottomNavbar: React.FC<{
  items: BottomNavItem[]
  activeId: string
  onNavigate: (id: string) => void
  className?: string
}> = ({ items, activeId, onNavigate, className }) => (
  <nav className={cn(
    "fixed bottom-0 left-0 right-0 z-[100] flex",
    "bg-lb-surface border-t border-lb-line-1 shadow-lb",
    className
  )}>
    {items.map((item) => {
      const active = item.id === activeId
      return (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2 h-16 border-none bg-transparent cursor-pointer transition-colors duration-150"
        >
          <div className="relative">
            <span className={cn("w-6 h-6 flex items-center justify-center", active ? "text-lb-brand" : "text-lb-on-surface-3")}>
              {item.icon}
            </span>
            {item.badge != null && item.badge > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-lb-red text-lb-on-surface-rev text-[10px] font-lb-bold rounded-lb-pill flex items-center justify-center font-lb">
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            )}
          </div>
          <span className={cn(
            "font-lb text-[10px] leading-[16px] tracking-[0.0688px]",
            active ? "text-lb-brand font-lb-bold" : "text-lb-on-surface-3 font-lb-regular"
          )}>
            {item.label}
          </span>
        </button>
      )
    })}
  </nav>
)
export default BottomNavbar
*/

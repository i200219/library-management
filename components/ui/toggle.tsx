"use client"

import * as React from "react"
import { Switch } from "./switch"
import { cn } from "@/lib/utils"

interface ToggleProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export function Toggle({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  className
}: ToggleProps) {
  return (
    <div className={cn(
      "settings-toggle-container",
      disabled && "opacity-50 pointer-events-none",
      className
    )}>
      <div className="settings-toggle-content">
        <label
          htmlFor={id}
          className="settings-toggle-label"
        >
          {label}
        </label>
        {description && (
          <p className="settings-toggle-description">
            {description}
          </p>
        )}
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="shrink-0"
      />
    </div>
  )
}
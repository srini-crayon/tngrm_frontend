"use client"

import type React from "react"

import { Button } from "./ui/button"
import { Loader2, CheckCircle2 } from "lucide-react"

interface PrimaryButtonProps {
  state: "default" | "loading" | "success"
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  successText?: string
}

export function PrimaryButton({ state, onClick, disabled, children, successText }: PrimaryButtonProps) {
  if (state === "loading") {
    return (
      <Button disabled className="h-11 w-full rounded-lg bg-black text-white hover:bg-black">
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    )
  }

  if (state === "success") {
    return (
      <Button disabled className="h-11 w-full rounded-lg bg-black text-white hover:bg-black">
        <CheckCircle2 className="mr-2 h-5 w-5" />
        {successText || "SUCCESS"}
      </Button>
    )
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`h-11 w-full rounded-lg ${
        disabled ? "bg-gray-200 text-gray-400 hover:bg-gray-200" : "bg-black text-white hover:bg-black/90"
      }`}
    >
      {children}
    </Button>
  )
}

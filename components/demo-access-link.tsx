"use client"

import { ComponentPropsWithoutRef, ReactNode, useCallback, MouseEvent } from "react"
import { useAuthStore } from "../lib/store/auth.store"
import { useModal } from "../hooks/use-modal"

type AuthRole = "client" | "reseller" | "isv"

interface DemoAccessLinkProps extends Omit<ComponentPropsWithoutRef<"a">, "href" | "children"> {
  href: string
  children: ReactNode
  promptRole?: AuthRole
  promptMode?: "login" | "signup"
}

export function DemoAccessLink({
  href,
  children,
  promptRole = "client",
  promptMode = "login",
  target = "_blank",
  rel,
  onClick,
  ...props
}: DemoAccessLinkProps) {
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()

  const handleClick: ComponentPropsWithoutRef<"a">["onClick"] = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!isAuthenticated) {
        event.preventDefault()
        openModal("auth", { mode: promptMode, role: promptRole })
        return
      }

      if (onClick) {
        onClick(event)
      }
    },
    [isAuthenticated, onClick, openModal, promptMode, promptRole]
  )

  return (
    <a
      href={href}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  )
}



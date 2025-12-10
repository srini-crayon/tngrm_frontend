"use client"

import { usePathname } from "next/navigation"
import { Footer } from "./footer"

export function ConditionalFooter() {
  const pathname = usePathname()
  
  // Hide footer on agents chat page
  if (pathname === "/agents/chat") {
    return null
  }
  
  return <Footer />
}

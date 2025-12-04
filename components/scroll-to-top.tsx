"use client"

import { useLayoutEffect } from "react"

export default function ScrollToTop() {
  useLayoutEffect(() => {
    const prev = typeof window !== 'undefined' && 'scrollRestoration' in window.history
      ? window.history.scrollRestoration
      : undefined

    try {
      if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual'
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    } catch {
      // no-op
    }

    return () => {
      try {
        if (prev !== undefined && typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
          window.history.scrollRestoration = prev as typeof window.history.scrollRestoration
        }
      } catch {
        // no-op
      }
    }
  }, [])

  return null
}



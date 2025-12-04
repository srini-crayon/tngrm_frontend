"use client"

import { useModal } from "../hooks/use-modal"
import { useEffect, useRef } from "react"
import { useAuthStore } from "../lib/store/auth.store"
import { Lock } from "lucide-react"

interface ISVPartnerButtonProps {
  demoLink?: string
}

export function ISVPartnerButton({ demoLink }: ISVPartnerButtonProps) {
  const { openModal } = useModal()
  const { isAuthenticated } = useAuthStore()
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Rotate gradient animation for button
  useEffect(() => {
    const element = buttonRef.current
    if (!element) return

    let angle = 0
    const rotateGradient = () => {
      angle = (angle + 1) % 360
      element.style.setProperty("--gradient-angle", `${angle}deg`)
      requestAnimationFrame(rotateGradient)
    }

    rotateGradient()
  }, [])

  const handleClick = () => {
    if (!isAuthenticated) {
      openModal("auth", { mode: "login", role: "client" })
      return
    }

    if (demoLink) {
      window.open(demoLink, "_blank", "noopener,noreferrer")
    }
  }

  const isDisabled = !isAuthenticated

  return (
    <div>
      <button
        ref={buttonRef}
        onClick={handleClick}
        disabled={isDisabled}
        className={`border-gradient relative text-white rounded-[4px] px-[28px] transition-all ${
          isDisabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{
          display: "flex",
          height: "48px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontSize: "14px",
          lineHeight: "normal",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          position: "relative",
          padding: "20px 28px",
          boxShadow: "0 0 20px rgba(255, 109, 27, 0.3), 0 0 40px rgba(75, 138, 255, 0.2), 0 0 60px rgba(107, 95, 255, 0.1)",
          "--gradient-angle": "0deg",
          border: "none",
          outline: "none",
        } as React.CSSProperties & { "--gradient-angle"?: string }}
      >
        {/* Icon and Text */}
        <div style={{ 
          position: "relative", 
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          {!isAuthenticated && <Lock size={16} style={{ color: "#FFF" }} />}
          <span style={{ 
            color: "#FFF",
            textAlign: "center",
            fontFamily: "Poppins",
            fontSize: "14px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "normal",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}>
            TRY IT NOW
          </span>
        </div>
      </button>
    </div>
  )
}


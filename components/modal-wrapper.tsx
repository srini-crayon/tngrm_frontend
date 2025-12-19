"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { Button } from "./ui/button"
import Image from "next/image"

interface ModalWrapperProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  showOverlay?: boolean
  onOverlayAction?: () => void
  showLoginOverlay?: boolean
  onLoginOverlayAction?: () => void
}

export function ModalWrapper({ isOpen, onClose, children, showOverlay = false, onOverlayAction, showLoginOverlay = false, onLoginOverlayAction }: ModalWrapperProps) {
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden"
      
      // Scroll to top to ensure modal is visible
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      // Ensure modal is visible in viewport
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'center'
          })
        }
      }, 100)

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose()
      }

      document.addEventListener("keydown", handleEscape)
      return () => {
        document.body.style.overflow = "unset"
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen || !mounted) return null

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
      }}>
        {/* Outer container with pattern background - extends 10px beyond inner content */}
        <div
          ref={modalRef}
          className="relative max-h-[85vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "540px",
            maxWidth: "540px",
            minWidth: "540px",
            padding: "10px",
            backgroundImage: "url('/Pattern_login_back.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "repeat",
            position: "relative",
            zIndex: 10000,
            visibility: "visible",
            display: "block",
            borderRadius: "0px",
          }}
        >
          {/* Inner container with white background */}
          <div className="relative w-full h-full bg-white flex flex-col max-h-[calc(85vh-20px)]" style={{ borderRadius: "0px" }}>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 h-8 w-8 rounded-full z-10" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
            <div className="overflow-y-auto p-8" style={{ maxHeight: "calc(85vh - 80px)" }}>
              {children}
            </div>
          </div>
        </div>
        
        {/* Overlay component below modal */}
        {showOverlay && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              marginTop: "10px",
              marginBottom: "20px",
              width: "540px",
              maxWidth: "540px",
              minWidth: "540px",
              height: "62px",
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10001,
              borderRadius: "0px",
              flexShrink: 0,
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              width: "100%",
              padding: "0 16px",
              justifyContent: "center",
            }}>
              <p style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "-0.4px",
                color: "#181818",
                margin: 0,
              }}>
                Already onboard<span style={{ color: "#65717C", fontWeight: 400 }}> and have a existing account?</span>
              </p>
              <button
                onClick={onOverlayAction}
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: "4px",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0.5px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  textTransform: "uppercase",
                  color: "#181818",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  padding: "0 24px",
                  minWidth: "120px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#181818"
                  e.currentTarget.style.color = "#FFFFFF"
                  e.currentTarget.style.borderColor = "#181818"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#F9FAFB"
                  e.currentTarget.style.color = "#181818"
                  e.currentTarget.style.borderColor = "#E5E7EB"
                }}
              >
                Login
              </button>
            </div>
          </div>
        )}
        
        {/* Login overlay component below modal */}
        {showLoginOverlay && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              marginTop: "10px",
              marginBottom: "20px",
              width: "540px",
              maxWidth: "540px",
              minWidth: "540px",
              height: "62px",
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10001,
              borderRadius: "0px",
              flexShrink: 0,
            }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              width: "100%",
              padding: "0 16px",
              justifyContent: "center",
            }}>
              <p style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "-0.4px",
                color: "#181818",
                margin: 0,
              }}>
                New to Tangram AI? <span style={{ color: "#65717C", fontWeight: 400 }}>Create an account</span>
              </p>
              <button
                onClick={onLoginOverlayAction}
                style={{
                  backgroundColor: "#F9FAFB",
                  border: "1px solid #E5E7EB",
                  borderRadius: "4px",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "100%",
                  letterSpacing: "0.5px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  textTransform: "uppercase",
                  color: "#181818",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s",
                  padding: "0 24px",
                  minWidth: "120px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#181818"
                  e.currentTarget.style.color = "#FFFFFF"
                  e.currentTarget.style.borderColor = "#181818"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#F9FAFB"
                  e.currentTarget.style.color = "#181818"
                  e.currentTarget.style.borderColor = "#E5E7EB"
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

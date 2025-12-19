"use client"

import { Button } from "./ui/button"
import Image from "next/image"

interface ContactSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactSuccessModal({ isOpen, onClose }: ContactSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white shadow-2xl overflow-hidden flex flex-col"
        style={{
          width: "1020px",
          height: "584px",
          borderRadius: "12px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="flex flex-col items-center justify-center px-6 py-12" style={{ position: "relative" }}>
          {/* Success Icon */}
          <div className="mb-8 flex justify-center" style={{ zIndex: 10, position: "relative" }}>
            <Image 
              src="/sucess_logo.png" 
              alt="Success" 
              width={308} 
              height={229}
              className="object-contain"
            />
            {/* Title - positioned close to logo */}
            <h1 
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "26px",
                lineHeight: "130%",
                letterSpacing: "0px",
                verticalAlign: "middle",
                color: "#00092C",
                margin: 0,
                textAlign: "center",
                position: "absolute",
                bottom: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 20,
                whiteSpace: "nowrap",
              }}
            >
              Contact Request Submitted Successfully!
            </h1>
          </div>

          {/* Description */}
          <p 
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "150%",
              letterSpacing: "0px",
              textAlign: "center",
              verticalAlign: "middle",
              color: "#00092C",
              margin: 0,
              marginBottom: "32px",
              maxWidth: "600px",
            }}
          >
            Thank you for contacting us! We have received your message and will get back to you soon.
          </p>

          {/* Close Button */}
          <Button 
            onClick={onClose} 
            size="lg"
            style={{
              width: "200px",
              height: "44px",
              borderRadius: "4px",
              gap: "8px",
              paddingTop: "6px",
              paddingRight: "12px",
              paddingBottom: "6px",
              paddingLeft: "12px",
              background: "#181818",
              fontFamily: "Inter, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "150%",
              letterSpacing: "0%",
              textAlign: "center",
              verticalAlign: "middle",
              color: "#FFFFFF",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}


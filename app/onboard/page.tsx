"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { ArrowLeft, Upload, FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CustomOnboardModal } from "../../components/custom-onboard-modal"
import { UploadAgentModal } from "../../components/upload-agent-modal"

export default function OnboardPage() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState<"upload" | "custom" | null>(null)
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  const handleNext = () => {
    if (selectedOption === "custom") {
      setIsCustomModalOpen(true)
    } else if (selectedOption === "upload") {
      setIsUploadModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="w-full px-8 md:px-12 lg:px-16 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Side - Illustration */}
          <div className="flex items-center justify-center">
            <Image
              src="/person-with-laptop-and-ai-robot-high-fiving-illust.png"
              alt="Onboard Your AI Agents"
              width={530}
              height={400}
              className="object-contain"
            />
          </div>

          {/* Right Side - Content */}
          <div className="flex flex-col justify-center">
            <h1 
              className="mb-4"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "32px",
                lineHeight: "130%",
                letterSpacing: "0px",
                verticalAlign: "middle",
                color: "#00092C",
              }}
            >
              Onboard Your AI Agents
            </h1>
            <p 
              className="mb-8"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "150%",
                letterSpacing: "0px",
                verticalAlign: "middle",
                color: "#00092C",
                width: "414px",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              Reseller with us to showcase your AI solutions to our enterprise clients.
            </p>

            {/* Options */}
            <div className="space-y-4">
              {/* Upload File Option */}
              <button
                onClick={() => setSelectedOption("upload")}
                className="text-left transition-all bg-white"
                style={{
                  width: "414px",
                  height: "94px",
                  borderRadius: "2px",
                  border: selectedOption === "upload" ? "1.5px solid #004BEC" : "1px solid #E5E7EB",
                  padding: "24px",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0"
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "32px",
                      border: selectedOption === "upload" ? "1px solid #004BEC" : "1px solid #E5E7EB",
                      background: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedOption === "upload" && (
                      <div 
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#004BEC",
                        }}
                      />
                    )}
                  </div>
                  <div 
                    className="flex-1 flex flex-col"
                    style={{
                      width: "304px",
                      height: "59px",
                      gap: "4px",
                    }}
                  >
                    <h3 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0px",
                        color: "#111827",
                        margin: 0,
                      }}
                    >
                      Upload File
                    </h3>
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "11px",
                        lineHeight: "150%",
                        letterSpacing: "0px",
                        color: "#6B7280",
                        margin: 0,
                      }}
                    >
                      Bulk upload multiple agents, CSV/Excel format supported, Quick and efficient
                    </p>
                  </div>
                  <div 
                    className="flex shrink-0 items-center justify-center"
                    style={{
                      width: "28px",
                      height: "28px",
                    }}
                  >
                    <Image 
                      src={selectedOption === "upload" ? "/FileArrowUp_update.png" : "/FileArrowUp.png"} 
                      alt="Upload" 
                      width={28} 
                      height={28}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              </button>

              {/* Custom Onboard Option */}
              <button
                onClick={() => setSelectedOption("custom")}
                className="text-left transition-all bg-white"
                style={{
                  width: "414px",
                  height: "94px",
                  borderRadius: "2px",
                  border: selectedOption === "custom" ? "1.5px solid #004BEC" : "1px solid #E5E7EB",
                  padding: "24px",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0"
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "32px",
                      border: selectedOption === "custom" ? "1px solid #004BEC" : "1px solid #E5E7EB",
                      background: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedOption === "custom" && (
                      <div 
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#004BEC",
                        }}
                      />
                    )}
                  </div>
                  <div 
                    className="flex-1 flex flex-col"
                    style={{
                      width: "304px",
                      height: "59px",
                      gap: "4px",
                    }}
                  >
                    <h3 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0px",
                        color: "#111827",
                        margin: 0,
                      }}
                    >
                      Custom Onboard
                    </h3>
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "11px",
                        lineHeight: "150%",
                        letterSpacing: "0px",
                        color: "#6B7280",
                        margin: 0,
                      }}
                    >
                      Step-by-step guidance, Validation and suggestions, Perfect for single agents
                    </p>
                  </div>
                  <div 
                    className="flex shrink-0 items-center justify-center"
                    style={{
                      width: "28px",
                      height: "28px",
                    }}
                  >
                    <Image 
                      src={selectedOption === "custom" ? "/Textbox_update.png" : "/Textbox.png"} 
                      alt="Custom Onboard" 
                      width={28} 
                      height={28}
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              </button>
            </div>

            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className="mt-8"
              style={{
                width: "82px",
                height: "38px",
                borderRadius: "4px",
                backgroundColor: "#000000",
                color: "#FFFFFF",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                verticalAlign: "middle",
                border: "none",
                cursor: selectedOption ? "pointer" : "not-allowed",
                opacity: selectedOption ? 1 : 0.5,
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Custom Onboard Modal */}
      <CustomOnboardModal 
        isOpen={isCustomModalOpen} 
        onClose={() => {
          setIsCustomModalOpen(false)
          setSelectedOption(null)
        }} 
      />

      {/* Upload Agent Modal */}
      <UploadAgentModal 
        isOpen={isUploadModalOpen} 
        onClose={() => {
          setIsUploadModalOpen(false)
          setSelectedOption(null)
        }} 
      />
    </div>
  )
}

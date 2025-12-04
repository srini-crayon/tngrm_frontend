"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ArrowLeft, ArrowRight, RotateCw, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { UploadSuccessModal } from "./upload-success-modal"

type UploadState = "idle" | "uploading" | "success" | "error" | "validation-error"

interface UploadedFile {
  name: string
  size: number
  state: UploadState
  errorMessage?: string
  missingColumns?: string[]
}

interface UploadAgentModalProps {
  isOpen: boolean
  onClose: () => void
}

const REQUIRED_COLUMNS = [
  "Asset Type",
  "By Persona",
  "Product Name",
  "Docs",
  "Demo Preview",
  "By Capability",
  "By Value",
  "Demo Link",
  "Description",
]

export function UploadAgentModal({ isOpen, onClose }: UploadAgentModalProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const handleBack = () => {
    onClose()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleFileUpload = (file: File) => {
    // Validate file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]

    if (!validTypes.includes(file.type) && !file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
      setUploadedFile({
        name: file.name,
        size: file.size,
        state: "error",
        errorMessage: "Invalid file format. Please upload CSV or Excel file.",
      })
      return
    }

    // Validate file size (25MB max)
    if (file.size > 25 * 1024 * 1024) {
      setUploadedFile({
        name: file.name,
        size: file.size,
        state: "error",
        errorMessage: "File size exceeds 25MB limit.",
      })
      return
    }

    // Start upload
    setUploadedFile({
      name: file.name,
      size: file.size,
      state: "uploading",
    })

    // Simulate upload process
    setTimeout(() => {
      // Randomly simulate different outcomes for demo
      const random = Math.random()

      if (random < 0.33) {
        // Upload error
        setUploadedFile({
          name: file.name,
          size: file.size,
          state: "error",
          errorMessage: "Error while uploading",
        })
      } else if (random < 0.66) {
        // Validation error
        setUploadedFile({
          name: file.name,
          size: file.size,
          state: "validation-error",
          errorMessage: "Please add the missing details such as Asset Type and Demo link and upload the file again",
          missingColumns: ["Asset Type", "Demo Link"],
        })
      } else {
        // Success
        setUploadedFile({
          name: file.name,
          size: file.size,
          state: "success",
        })
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 5000)
      }
    }, 2000)
  }

  const handleRetry = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleDelete = () => {
    setUploadedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDownload = () => {
    // Simulate file download
    alert("Downloading file...")
  }

  const handleUploadAndProcess = () => {
    if (uploadedFile?.state === "success") {
      onClose()
      setIsSuccessModalOpen(true)
    }
  }

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + "MB"
  }

  if (!isOpen && !isSuccessModalOpen) return null

  return (
    <>
      {isOpen && (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <button
              onClick={handleBack}
              className="flex items-center"
              style={{
                width: "45px",
                height: "24px",
                borderRadius: "4px",
                gap: "4px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "11px",
                lineHeight: "150%",
                letterSpacing: "0px",
                color: "#6B7280",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <ArrowLeft className="h-4 w-4" style={{ color: "#6B7280" }} />
              Back
            </button>
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
              }}
            >
              Upload Agent Data
            </h1>
            <p 
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "150%",
                letterSpacing: "0px",
                verticalAlign: "middle",
                color: "#00092C",
                margin: 0,
                marginTop: "4px",
              }}
            >
              Upload a CSV or Excel file with your agent information.
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-lg border-2 border-dashed p-16 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-gray-300 bg-white"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center">
                <Image 
                  src="/Cloud_upload_blue.png" 
                  alt="Upload" 
                  width={32} 
                  height={32}
                  className="object-contain"
                />
              </div>

              <div>
                <p 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "150%",
                    letterSpacing: "0%",
                    textAlign: "center",
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  Drag & drop files or{" "}
                  <button 
                    onClick={() => fileInputRef.current?.click()} 
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "16px",
                      lineHeight: "150%",
                      letterSpacing: "0%",
                      textAlign: "center",
                      verticalAlign: "middle",
                      color: "#004BEC",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                  >
                    Choose files
                  </button>
                </p>
                <p 
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "12px",
                    lineHeight: "150%",
                    letterSpacing: "0%",
                    textAlign: "center",
                    color: "#6B7280",
                    margin: 0,
                    marginTop: "4px",
                  }}
                >
                  Supports PDF,Word document file (max. 25MB file size)
                </p>
              </div>
            </div>
          </div>

          {/* File Added Section */}
          {uploadedFile && (
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-medium">File added</h3>

              <div className="rounded-lg bg-white p-4">
                <div className="flex items-center gap-4">
                  {/* File Icon */}
                  <div 
                    className="flex shrink-0 items-center justify-center"
                    style={{
                      width: "47.80487060546875px",
                      height: "47.80488204956055px",
                      position: "relative",
                      top: "-5.95px",
                      left: "-5.94px",
                    }}
                  >
                    <Image 
                      src="/csv-vector-icon 1.png" 
                      alt="CSV file" 
                      width={24} 
                      height={24}
                      className="object-contain"
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3" style={{ marginTop: "-4px" }}>
                      {uploadedFile.state === "validation-error" || uploadedFile.state === "error" ? (
                        <>
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500">
                            <span className="text-sm font-bold text-white">!</span>
                          </div>
                          <span className="text-sm text-red-600">{uploadedFile.errorMessage}</span>
                        </>
                      ) : (
                        <span 
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "100%",
                            letterSpacing: "0%",
                            color: "#111827",
                          }}
                        >
                          {uploadedFile.name}
                        </span>
                      )}

                      {uploadedFile.state === "success" && (
                        <>
                          <span className="text-sm text-muted-foreground">•</span>
                          <button 
                            onClick={handleDownload}
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 500,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "100%",
                              letterSpacing: "0%",
                              color: "#004BEC",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              textDecoration: "none",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                          >
                            Download
                          </button>
                          <span className="text-sm text-muted-foreground">•</span>
                          <button 
                            onClick={handleDelete}
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 500,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "100%",
                              letterSpacing: "0%",
                              color: "#EF4444",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              padding: 0,
                              textDecoration: "none",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                          >
                            Delete
                          </button>
                        </>
                      )}

                      {uploadedFile.state === "error" && (
                        <>
                          <span className="text-sm text-muted-foreground">•</span>
                          <button
                            onClick={handleRetry}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <RotateCw className="h-3 w-3" />
                            Retry
                          </button>
                        </>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {uploadedFile.state === "uploading" && (
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full w-2/3 animate-pulse bg-primary" />
                      </div>
                    )}

                    {(uploadedFile.state === "error" || uploadedFile.state === "validation-error") && (
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full w-full bg-red-500" />
                      </div>
                    )}
                  </div>

                  {/* File Size */}
                  <span className="text-sm text-muted-foreground">{formatFileSize(uploadedFile.size)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Required Columns */}
          {!uploadedFile && (
            <div className="mt-8">
              <h3 
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "150%",
                  letterSpacing: "0%",
                  color: "#111827",
                  margin: 0,
                  marginBottom: "16px",
                }}
              >
                Required columns
              </h3>
              <div className="flex flex-wrap gap-2">
                {REQUIRED_COLUMNS.map((column) => (
                  <Badge 
                    key={column} 
                    variant="outline"
                    style={{
                      width: "auto",
                      minWidth: "fit-content",
                      height: "40px",
                      borderRadius: "4px",
                      gap: "8px",
                      borderWidth: "1px",
                      padding: "8px",
                      background: "#F9FAFB",
                      border: "1px solid #E5E7EB",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "100%",
                      letterSpacing: "0%",
                      color: "#161616",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {column}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Upload & Process Button */}
          <div className="mt-8 flex items-center">
            <Button
              onClick={handleUploadAndProcess}
              disabled={!uploadedFile || uploadedFile.state !== "success"}
              size="lg"
              className="bg-[#1F2937] text-white hover:bg-[#374151] disabled:bg-gray-300 disabled:text-gray-500"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "20px",
                padding: "10px 20px",
                borderRadius: "6px",
              }}
            >
              Upload & Process
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 rounded-lg bg-gray-900 px-6 py-4 text-white shadow-lg">
              <span className="text-sm">Onboarding agent details file has been uploaded successfully</span>
              <button onClick={() => setShowSuccessToast(false)} className="text-white/70 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
      )}

      {/* Success Modal */}
      <UploadSuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
      />
    </>
  )
}


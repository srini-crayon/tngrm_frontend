"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { ArrowLeft, ArrowRight, RotateCw, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { UploadSuccessModal } from "./upload-success-modal"
import { useAuthStore } from "../lib/store/auth.store"
import { getAuthHeaders, createApiUrl, endpoints } from "../lib/api/config"

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

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain", // Allow .txt files as per API sample
    ]

    if (!validTypes.includes(file.type) && !file.name.endsWith(".csv") && !file.name.endsWith(".xlsx") && !file.name.endsWith(".txt")) {
      setUploadedFile({
        name: file.name,
        size: file.size,
        state: "error",
        errorMessage: "Invalid file format. Please upload CSV, Excel, or text file.",
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

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('dry_run', 'false')

      // Get token from auth store and validate
      const authState = useAuthStore.getState()
      let token = authState.token
      
      // Validate token if present
      if (token) {
        try {
          const { isTokenExpired } = await import('../lib/utils/token')
          if (isTokenExpired(token)) {
            console.warn('Token expired, user needs to re-login')
            authState.logout()
            setUploadedFile({
              name: file.name,
              size: file.size,
              state: "error",
              errorMessage: "Your session has expired. Please log in again.",
            })
            return
          }
        } catch (error) {
          console.warn('Error validating token:', error)
        }
      }
      
      // Get auth headers with token
      const authHeaders = getAuthHeaders(token, {
        'accept': 'application/json',
        // Don't set Content-Type - let browser set it with boundary for multipart
      })

      // Make API call to bulk upload endpoint
      const bulkUploadUrl = createApiUrl(endpoints.admin.bulkUpload)
      const response = await fetch(bulkUploadUrl, {
        method: 'POST',
        headers: authHeaders,
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Success - show success message
        setUploadedFile({
          name: file.name,
          size: file.size,
          state: "success",
        })
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 5000)
      } else {
        // Handle API error
        const errorMessage = data.message || data.error || "Error while uploading file. Please try again."
        setUploadedFile({
          name: file.name,
          size: file.size,
          state: "error",
          errorMessage: errorMessage,
        })
      }
    } catch (error: any) {
      // Handle network or other errors
      console.error('Upload error:', error)
      setUploadedFile({
        name: file.name,
        size: file.size,
        state: "error",
        errorMessage: error.message || "Network error. Please check your connection and try again.",
      })
    }
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
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-6 animate-in fade-in duration-300 overflow-y-auto scrollbar-hide"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-top-4 duration-300 my-4"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #FAFBFC 100%)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Header with gradient background */}
        <div 
          className="px-6 py-5 flex items-start justify-between relative"
          style={{
            background: "linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <div className="flex flex-col gap-2">
            <button
              onClick={handleBack}
              className="flex items-center mb-1"
              style={{
                width: "auto",
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
              className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: "28px",
                lineHeight: "130%",
                letterSpacing: "-0.5px",
                margin: 0,
              }}
            >
              Upload Agent Data
            </h1>
            <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
              Upload a CSV or Excel file with your agent information.
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all duration-200 group"
            style={{
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F3F4F6"
              e.currentTarget.style.borderColor = "#E5E7EB"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
              e.currentTarget.style.borderColor = "transparent"
            }}
          >
            <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ backgroundColor: "#FFFFFF" }}>
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
              accept=".csv,.xlsx,.xls,.txt"
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
                  Supports CSV, Excel, or text files (max. 25MB file size)
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


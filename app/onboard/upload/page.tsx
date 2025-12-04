"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { ArrowLeft, ArrowRight, CloudUpload, FileSpreadsheet, RotateCw, X } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type UploadState = "idle" | "uploading" | "success" | "error" | "validation-error"

interface UploadedFile {
  name: string
  size: number
  state: UploadState
  errorMessage?: string
  missingColumns?: string[]
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

export default function UploadAgentDataPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

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
      router.push("/onboard/success")
    }
  }

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + "MB"
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

          <div className="mt-4 flex items-center gap-2 text-sm">
            <Link href="/agents" className="text-primary hover:underline">
              Agents
            </Link>
            <span className="text-muted-foreground">&gt;</span>
            <span className="text-muted-foreground">Upload Agent Data</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold">Upload Agent Data</h1>
          <p className="mt-2 text-muted-foreground">Upload a CSV or Excel file with your agent information</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-[1280px] px-6 py-12">
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
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CloudUpload className="h-8 w-8 text-primary" />
            </div>

            <div>
              <p className="text-lg">
                Drag & drop files or{" "}
                <button onClick={() => fileInputRef.current?.click()} className="text-primary hover:underline">
                  Choose files
                </button>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Supports CSV, Excel format (max. 25MB file size)</p>
            </div>
          </div>
        </div>

        {/* File Added Section */}
        {uploadedFile && (
          <div className="mt-8">
            <h3 className="mb-4 text-sm font-medium">File added</h3>

            <div className="rounded-lg border bg-white p-4">
              <div className="flex items-center gap-4">
                {/* File Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-500">
                  <FileSpreadsheet className="h-6 w-6 text-white" />
                </div>

                {/* File Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {uploadedFile.state === "validation-error" || uploadedFile.state === "error" ? (
                      <>
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-yellow-500">
                          <span className="text-sm font-bold text-white">!</span>
                        </div>
                        <span className="text-sm text-red-600">{uploadedFile.errorMessage}</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium">{uploadedFile.name}</span>
                    )}

                    {uploadedFile.state === "success" && (
                      <>
                        <span className="text-sm text-muted-foreground">•</span>
                        <button onClick={handleDownload} className="text-sm text-primary hover:underline">
                          Download
                        </button>
                        <span className="text-sm text-muted-foreground">•</span>
                        <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">
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

                  {uploadedFile.state === "success" && (
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                      <div className="h-full w-full bg-green-500" />
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
            <h3 className="mb-4 text-sm font-medium">Required columns</h3>
            <div className="flex flex-wrap gap-2">
              {REQUIRED_COLUMNS.map((column) => (
                <Badge key={column} variant="outline" className="px-3 py-1.5 text-sm">
                  {column}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Upload & Process Button */}
        <Button
          onClick={handleUploadAndProcess}
          disabled={!uploadedFile || uploadedFile.state !== "success"}
          size="lg"
          className="mt-8 bg-black text-white hover:bg-black/90 disabled:bg-gray-300"
        >
          Upload & Process
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
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
  )
}

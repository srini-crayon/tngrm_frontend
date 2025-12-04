"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { X, Download } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface FilePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filePath: string
}

export function FilePreviewDialog({ open, onOpenChange, filePath }: FilePreviewDialogProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fileUrl, setFileUrl] = useState<string>("")
  const [downloadUrl, setDownloadUrl] = useState<string>("")
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!open || !filePath) return

    setLoading(true)
    setError(null)

    const fetchFileUrl = async () => {
      try {
        // Extract the key from full S3 URLs
        let pathToUse = filePath
        
        // If it's a full S3 URL, extract the key
        if (filePath.startsWith('https://agentsstore.s3.us-east-1.amazonaws.com/')) {
          pathToUse = filePath.replace('https://agentsstore.s3.us-east-1.amazonaws.com/', '')
        } else if (filePath.startsWith('http://agentsstore.s3.us-east-1.amazonaws.com/')) {
          pathToUse = filePath.replace('http://agentsstore.s3.us-east-1.amazonaws.com/', '')
        }
        // For other URLs, use them directly
        else if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
          setFileUrl(filePath)
          setDownloadUrl(filePath)
          setLoading(false)
          return
        }
        
        // Use the API to get the presigned URL
        const response = await fetch(`/api/file-preview?path=${encodeURIComponent(pathToUse)}`)

        const contentType = response.headers.get('Content-Type') || ''

        if (!response.ok) {
          if (contentType.includes('application/json')) {
            const data = await response.json()
            throw new Error(data.error || 'Failed to load file')
          }
          throw new Error('Failed to load file')
        }

        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current)
          objectUrlRef.current = null
        }

        const blob = await response.blob()
        const objectUrl = URL.createObjectURL(blob)

        objectUrlRef.current = objectUrl

        setFileUrl(objectUrl)
        setDownloadUrl(`/api/file-preview?path=${encodeURIComponent(pathToUse)}&download=1`)
        setLoading(false)
      } catch (err: any) {
        setError(err.message || 'Failed to load file preview')
        setLoading(false)
      }
    }

    fetchFileUrl()
  }, [open, filePath])

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const isPdf = filePath.toLowerCase().endsWith('.pdf')
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(filePath)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-white">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">File Preview</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="w-full h-[calc(90vh-80px)] flex items-center justify-center bg-gray-50 overflow-hidden">
          {loading && (
            <div className="text-gray-500">Loading preview...</div>
          )}
          
          {error && (
            <div className="text-red-600 p-4 text-center">
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="mt-4"
              >
                <Download className="h-4 w-4 mr-2" />
                Download File
              </Button>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {isPdf && (
                <iframe
                  src={fileUrl}
                  className="w-full h-full border-0"
                  title="PDF Preview"
                  onError={() => setError("Failed to load PDF preview")}
                />
              )}
              
              {isImage && (
                <div className="w-full h-full flex items-center justify-center p-8 overflow-auto">
                  <img
                    src={fileUrl}
                    alt="Preview"
                    className="max-w-full max-h-full object-contain"
                    onError={() => setError("Failed to load image preview")}
                  />
                </div>
              )}
              
              {!isPdf && !isImage && (
                <div className="text-center p-8">
                  <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download File
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


"use client"

import React, { useState, useMemo } from "react"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { ChevronLeft, ChevronRight, X, Play, Image as ImageIcon } from "lucide-react"
import { cn } from "../lib/utils"

interface DemoPreviewGalleryProps {
  demoPreview: string
  className?: string
}

interface MediaItem {
  url: string
  type: 'image' | 'video'
  id: string
}

export function DemoPreviewGallery({ demoPreview, className }: DemoPreviewGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Parse comma-separated URLs and categorize them
  const mediaItems: MediaItem[] = useMemo(() => {
    if (!demoPreview || demoPreview === "na" || demoPreview.trim() === "") {
      return []
    }

    return demoPreview.split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0)
      .map((url, index) => {
        const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(url)
        return {
          url,
          type: isVideo ? 'video' as const : 'image' as const,
          id: `media-${index}`
        }
      })
  }, [demoPreview])

  const images = mediaItems.filter(item => item.type === 'image')
  const videos = mediaItems.filter(item => item.type === 'video')

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (mediaItems.length === 0) {
    return (
      <div className={cn("flex items-center justify-center p-8 text-gray-500", className)}>
        <div className="text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p className="text-sm">No demo previews available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Images Grid */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Images ({images.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {images.map((item, index) => (
              <div
                key={item.id}
                className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-100 aspect-video"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={item.url}
                  alt={`Demo preview ${index + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `
                      <div class="flex items-center justify-center h-full text-gray-400">
                        <div class="text-center">
                          <svg class="mx-auto h-8 w-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <p class="text-xs">Failed to load</p>
                        </div>
                      </div>
                    `
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Grid */}
      {videos.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Videos ({videos.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {videos.map((item, index) => (
              <div
                key={item.id}
                className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-100 aspect-video"
              >
                <video
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  onError={(e) => {
                    const target = e.target as HTMLVideoElement
                    target.style.display = 'none'
                    target.parentElement!.innerHTML = `
                      <div class="flex items-center justify-center h-full text-gray-400">
                        <div class="text-center">
                          <svg class="mx-auto h-8 w-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                          <p class="text-xs">Failed to load</p>
                        </div>
                      </div>
                    `
                  }}
                >
                  <source src={item.url} type="video/mp4" />
                  <source src={item.url} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Demo Preview {currentIndex + 1} of {images.length}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeLightbox}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative p-4">
            {images.length > 0 && (
              <>
                <div className="relative">
                  <img
                    src={images[currentIndex]?.url}
                    alt={`Demo preview ${currentIndex + 1}`}
                    className="w-full h-auto max-h-[70vh] object-contain mx-auto rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = `
                        <div class="flex items-center justify-center h-64 text-gray-400">
                          <div class="text-center">
                            <svg class="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p>Failed to load image</p>
                          </div>
                        </div>
                      `
                    }}
                  />
                  
                  {/* Navigation arrows */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={nextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                {/* Thumbnail navigation */}
                {images.length > 1 && (
                  <div className="flex justify-center gap-2 mt-4 overflow-x-auto">
                    {images.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentIndex(index)}
                        className={cn(
                          "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                          index === currentIndex
                            ? "border-blue-500"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        <img
                          src={item.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

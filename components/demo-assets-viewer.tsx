"use client"

/**
 * DemoAssetsViewer Component
 * 
 * Displays demo images for agents using image URLs from S3 bucket (agentsstore).
 * 
 * Features:
 * - Uses asset_url from demo_assets array as primary source
 * - Responsive gallery/carousel format with thumbnails
 * - Fallback handling for missing or invalid image URLs
 * - Server-side proxy for S3 images (no presigned URLs needed)
 * - Maintains design consistency with other image preview sections
 * 
 * Security:
 * - No AWS credentials exposed in frontend
 * - All S3 images fetched via server-side proxy (/api/image-proxy)
 * - Backend manages all AWS SDK interactions securely
 */

import { useState, useMemo, useEffect } from "react"
import clsx from "clsx"
import { AspectRatio } from "./ui/aspect-ratio"
import { Button } from "./ui/button"
import { Minimize2, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react"

type DemoAsset = { 
  demo_asset_link?: string
  demo_link?: string
  asset_url?: string // Primary field for S3 image URLs
  asset_file_path?: string
  demo_asset_name?: string // Used for alphabetical sorting
  demo_asset_type?: string
  demo_asset_id?: string
}

type DemoAssetsViewerProps = {
  assets: DemoAsset[]
  className?: string
  demoPreview?: string // Comma-separated URLs from demo_preview field
}

// S3 Configuration
const S3_BUCKET_NAME = 'agentsstore'
const S3_REGION = 'us-east-1'

/**
 * Normalizes and validates image URLs
 * Handles both S3 URLs and other URL formats
 * Uses server-side proxy to fetch S3 images (no presigned URLs needed)
 */
function normalizeImageUrl(url: string): string {
  if (!url || !url.trim()) return ""
  
  const trimmedUrl = url.trim()
  
  // If it's already a full URL (http/https)
  if (trimmedUrl.startsWith('https://') || trimmedUrl.startsWith('http://')) {
    // If it's an S3 URL, route through our server-side proxy
    if (trimmedUrl.includes('.s3.') || trimmedUrl.includes('amazonaws.com')) {
      // Encode the URL properly and use our proxy
      // Use encodeURIComponent to handle special characters in URLs
      try {
        const encodedUrl = encodeURIComponent(trimmedUrl)
        return `/api/image-proxy?url=${encodedUrl}`
      } catch (e) {
        console.error('Failed to encode URL:', trimmedUrl, e)
        // Fallback: return the URL as-is if encoding fails
        return trimmedUrl
      }
    }
    // Other full URLs (GitHub, CDN, etc.) - use directly
    return trimmedUrl
  }
  
  // If it's a relative path or S3 key, construct S3 URL first, then proxy
  let s3Url: string
  if (trimmedUrl.startsWith('/')) {
    // Remove leading slash and construct S3 URL
    const key = trimmedUrl.substring(1)
    s3Url = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${key}`
  } else {
    // Assume it's an S3 key without leading slash
    s3Url = `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${trimmedUrl}`
  }
  
  // Route through server-side proxy (no presigned URL needed)
  const encodedUrl = encodeURIComponent(s3Url)
  return `/api/image-proxy?url=${encodedUrl}`
}

export default function DemoAssetsViewer({ assets, className, demoPreview }: DemoAssetsViewerProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [imageLoading, setImageLoading] = useState<Set<string>>(new Set())
  
  // Reset errors when demoPreview or assets change
  useEffect(() => {
    setImageErrors(new Set())
  }, [demoPreview, assets])
  
  const normalized = useMemo(() => {
    const urls: string[] = []
    const addedUrls = new Set<string>() // Track added URLs to avoid duplicates
    
    // First, process assets array - sort alphabetically by demo_asset_name
    // Sort assets alphabetically by demo_asset_name before processing
    const sortedAssets = [...(assets || [])].sort((a, b) => {
      const nameA = (a.demo_asset_name || '').toLowerCase()
      const nameB = (b.demo_asset_name || '').toLowerCase()
      return nameA.localeCompare(nameB)
    })
    
    sortedAssets.forEach(a => {
      // Priority: asset_url (primary) > asset_file_path > demo_asset_link > demo_link
      // Using asset_url as the primary source for demo images from S3
      let url = a.asset_url || a.asset_file_path || a.demo_asset_link || a.demo_link || ""
      
      if (url) {
        url = normalizeImageUrl(url)
        
        // Convert GitHub raw URLs to jsDelivr CDN to avoid rate limits
        if (url.startsWith('https://raw.githubusercontent.com/')) {
          // Convert: https://raw.githubusercontent.com/user/repo/branch/path
          // To: https://cdn.jsdelivr.net/gh/user/repo@branch/path
          url = url.replace(
            'https://raw.githubusercontent.com/',
            'https://cdn.jsdelivr.net/gh/'
          ).replace('/main/', '@main/').replace('/master/', '@master/')
        }
        
        // Only add if not already in the list (avoid duplicates)
        if (url && !addedUrls.has(url)) {
          urls.push(url)
          addedUrls.add(url)
        }
      }
    })
    
    // Then, process demo_preview if provided (comma-separated URLs)
    // These are added after sorted assets since they don't have demo_asset_name
    if (demoPreview) {
      const rawUrls = demoPreview.split(',').map(url => url.trim()).filter(url => !!url)
      const previewUrls = rawUrls.map(url => normalizeImageUrl(url)).filter(url => !!url)
      
      console.log('Processing demo_preview:', demoPreview)
      console.log('Raw URLs from demo_preview:', rawUrls)
      console.log('Normalized preview URLs:', previewUrls)
      
      previewUrls.forEach(url => {
        // Only add if not already in the list (avoid duplicates)
        if (url && !addedUrls.has(url)) {
          urls.push(url)
          addedUrls.add(url)
        }
      })
    }
    
    console.log('All normalized URLs:', urls)
    
    // Return all valid URLs - images will load directly from S3 (CORS is fixed)
    return urls
      .map(url => ({ url }))
      .filter(a => !!a.url)
  }, [assets, demoPreview])
  
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOverlayOpen, setIsOverlayOpen] = useState(false)
  
  // Navigation functions for expanded view
  const goToPrevious = () => {
    if (normalized.length > 0) {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : normalized.length - 1))
    }
  }
  
  const goToNext = () => {
    if (normalized.length > 0) {
      setSelectedIndex((prev) => (prev < normalized.length - 1 ? prev + 1 : 0))
    }
  }
  
  // Handle keyboard navigation in expanded view
  useEffect(() => {
    if (!isOverlayOpen) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (normalized.length > 0) {
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : normalized.length - 1))
        }
      } else if (e.key === 'ArrowRight') {
        if (normalized.length > 0) {
          setSelectedIndex((prev) => (prev < normalized.length - 1 ? prev + 1 : 0))
        }
      } else if (e.key === 'Escape') {
        setIsOverlayOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOverlayOpen, normalized.length])

  const selected = normalized[selectedIndex]
  const selectedUrl = selected?.url || ""
  const isVideo = /\.mp4($|\?)/i.test(selectedUrl)
  
  // Handle image load errors
  const handleImageError = (url: string) => {
    console.error('Failed to load image:', url)
    setImageErrors(prev => new Set(prev).add(url))
    setImageLoading(prev => {
      const next = new Set(prev)
      next.delete(url)
      return next
    })
  }
  
  const handleImageLoad = (url: string) => {
    setImageLoading(prev => {
      const next = new Set(prev)
      next.delete(url)
      return next
    })
  }
  
  const handleImageLoadStart = (url: string) => {
    setImageLoading(prev => new Set(prev).add(url))
  }

  return (
    <div className={clsx("w-full", className)}>
      {/* Large viewer */}
      <section 
        className="flex items-center justify-center overflow-hidden bg-black cursor-zoom-in p-2 w-full max-w-[716px]" 
        style={{ 
          borderRadius: '0px',
          backgroundImage: 'url(/img/agentimgbg.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          aspectRatio: '716 / 402.75',
          boxShadow: 'none',
          border: '1px solid #E5E7EB',
        }}
        onClick={() => selectedUrl && setIsOverlayOpen(true)}
        title={selectedUrl ? "Click to expand" : undefined}
      >
            {selectedUrl ? (
              isVideo ? (
                <video
                  src={selectedUrl}
                  className="object-contain w-full h-full"
                  style={{ 
                    borderRadius: '0px',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                  }}
                  controls
                  autoPlay
                  muted
                  playsInline
                  onError={() => handleImageError(selectedUrl)}
                />
              ) : imageErrors.has(selectedUrl) ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                  <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm font-medium mb-1">Failed to load image</p>
                  <p className="text-xs text-center opacity-75 mb-2">
                    {selectedUrl.includes('/api/image-proxy') 
                      ? 'The image proxy may be experiencing issues. Please check the server logs.'
                      : 'Image may not be accessible or the URL is invalid.'}
                  </p>
                  <p className="text-xs opacity-50 break-all px-2 text-center font-mono">
                    {selectedUrl.length > 80 ? `${selectedUrl.substring(0, 80)}...` : selectedUrl}
                  </p>
                  <button
                    onClick={() => {
                      // Try reloading the image
                      setImageErrors(prev => {
                        const next = new Set(prev)
                        next.delete(selectedUrl)
                        return next
                      })
                      // Force reload by updating the key
                      const img = document.querySelector(`img[src="${selectedUrl}"]`) as HTMLImageElement
                      if (img) {
                        img.src = selectedUrl + '?retry=' + Date.now()
                      }
                    }}
                    className="mt-3 text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {imageLoading.has(selectedUrl) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedUrl}
                    alt={assets[selectedIndex]?.demo_asset_name || "Demo asset"}
                    className="object-contain w-full h-full"
                    style={{ 
                      borderRadius: '0px',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: 'auto',
                      height: 'auto',
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      const failedUrl = target.src || selectedUrl
                      console.error('Image load error for:', failedUrl, e)
                      console.error('Error details:', {
                        url: failedUrl,
                        naturalWidth: target.naturalWidth,
                        naturalHeight: target.naturalHeight,
                        complete: target.complete,
                        src: target.src,
                        currentSrc: target.currentSrc
                      })
                      handleImageError(failedUrl)
                    }}
                    onLoad={(e) => {
                      console.log('Image loaded successfully:', selectedUrl)
                      handleImageLoad(selectedUrl)
                    }}
                    onLoadStart={() => {
                      console.log('Image load started:', selectedUrl)
                      handleImageLoadStart(selectedUrl)
                    }}
                    loading="eager"
                  />
                </>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-muted-foreground">No demo previews available</p>
              </div>
            )}
      </section>

      {/* Thumbnails */}
      {normalized.length > 1 && (
        <div className="mt-4 flex items-center gap-3 overflow-x-auto">
          {normalized.map((a, i) => {
            const url = a.url || ""
            const vid = /\.mp4($|\?)/i.test(url)
            return (
              <button
                key={(url || "asset") + i}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={clsx("h-20 w-28 flex-shrink-0 overflow-hidden bg-white cursor-pointer relative",
                  i === selectedIndex ? "ring-2 ring-black" : "opacity-90 hover:opacity-100",
                  imageErrors.has(url) && "bg-gray-100"
                )}
                style={{ borderRadius: '0px', boxShadow: 'none', border: 'none' }}
                aria-label={`Preview ${i + 1}`}
              >
                {vid ? (
                  <video 
                    src={url} 
                    className="h-full w-full object-cover" 
                    style={{ borderRadius: '0px' }}
                    muted 
                    playsInline
                    onError={() => handleImageError(url)}
                  />
                ) : imageErrors.has(url) ? (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100" style={{ borderRadius: '0px' }}>
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={url} 
                    alt={assets[i]?.demo_asset_name || `Demo asset ${i + 1}`}
                    className="h-full w-full object-cover"
                    style={{ borderRadius: '0px' }}
                    onError={() => handleImageError(url)}
                    onLoad={() => handleImageLoad(url)}
                    loading="lazy"
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Overlay dialog - Centered with white background */}
      {isOverlayOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-4 animate-in fade-in duration-300 overflow-y-auto scrollbar-hide"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(8px)",
          }}
          onClick={() => setIsOverlayOpen(false)}
        >
          <div 
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-top-4 duration-300 my-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="relative w-full flex items-center justify-center overflow-hidden flex-1" style={{ minHeight: '80vh' }}>
            {/* Left Navigation Button */}
            {normalized.length > 1 && (
              <Button
                size="icon"
                variant="outline"
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-full shadow-lg transition-all hover:scale-110"
                aria-label="Previous image"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-6 w-6 text-gray-900" />
              </Button>
            )}
            
            {/* Right Navigation Button */}
            {normalized.length > 1 && (
              <Button
                size="icon"
                variant="outline"
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-12 w-12 bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-full shadow-lg transition-all hover:scale-110"
                aria-label="Next image"
                onClick={goToNext}
              >
                <ChevronRight className="h-6 w-6 text-gray-900" />
              </Button>
            )}
            
            {/* Overlay controls: minimize + close */}
            <div className="absolute right-2 top-2 z-20 flex items-center gap-2">
              <Button 
                size="icon" 
                variant="outline" 
                className="h-9 w-9 bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-lg shadow-sm" 
                aria-label="Minimize" 
                onClick={() => setIsOverlayOpen(false)}
              >
                <Minimize2 className="h-4 w-4 text-gray-900" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="h-9 w-9 bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-lg shadow-sm" 
                aria-label="Close" 
                onClick={() => setIsOverlayOpen(false)}
              >
                <X className="h-4 w-4 text-gray-900" />
              </Button>
            </div>
            
            {/* Image counter */}
            {normalized.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-full shadow-md">
                <span className="text-xs font-medium text-gray-900">
                  {selectedIndex + 1} / {normalized.length}
                </span>
              </div>
            )}
            {selectedUrl && (/\.mp4($|\?)/i.test(selectedUrl) ? (
              <div className="w-full h-full flex items-center justify-center px-16">
                <video 
                  src={selectedUrl} 
                  className="max-h-full max-w-full w-auto h-auto object-contain" 
                  style={{ borderRadius: '0px' }}
                  controls 
                  autoPlay 
                  muted 
                  playsInline
                  onError={() => handleImageError(selectedUrl)}
                />
              </div>
            ) : imageErrors.has(selectedUrl) ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400" style={{ borderRadius: '0px' }}>
                <svg className="h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium">Failed to load image</p>
                <p className="text-xs mt-2 opacity-75 max-w-md text-center">
                  The image from S3 bucket could not be loaded. Please check if the image URL is correct and accessible.
                </p>
                <p className="text-xs mt-1 opacity-50 text-center font-mono">
                  URL: {selectedUrl.substring(0, 60)}...
                </p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center px-16">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={selectedUrl} 
                  alt="expanded" 
                  className="max-h-full max-w-full w-auto h-auto object-contain"
                  style={{ borderRadius: '0px' }}
                  onError={(e) => {
                    console.error('Expanded image load error for:', selectedUrl, e)
                    handleImageError(selectedUrl)
                  }}
                  onLoad={() => {
                    console.log('Expanded image loaded successfully:', selectedUrl)
                    handleImageLoad(selectedUrl)
                  }}
                />
              </div>
            ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



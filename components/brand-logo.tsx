"use client"

import Image from "next/image"
import { getBrandConfig } from "../lib/brand"

interface BrandLogoProps {
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function BrandLogo({ 
  width = 120, 
  height = 32, 
  className = "object-contain",
  priority = false 
}: BrandLogoProps) {
  const config = getBrandConfig()
  
  return (
    <Image
      src={config.logo}
      alt={config.altText}
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  )
}

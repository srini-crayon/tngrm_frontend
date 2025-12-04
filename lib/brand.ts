'use client'
// Brand configuration for whitelabel functionality
import { useState, useEffect } from 'react'

export type Brand = 'tangram' | 'redington'

export interface BrandConfig {
  name: string
  logo: string
  altText: string
  primaryColor?: string
  secondaryColor?: string
}

export const brandConfigs: Record<Brand, BrandConfig> = {
  tangram: {
    name: 'Tangram AI',
    logo: '/tangram_log.png',
    altText: 'Tangram AI logo',
    primaryColor: '#000000',
    secondaryColor: '#6366f1'
  },
  redington: {
    name: 'Redington',
    logo: '/redington.JPG',
    altText: 'Redington logo',
    primaryColor: '#1f2937',
    secondaryColor: '#3b82f6'
  }
}

// Get current brand - you can modify this logic based on your needs
// Options: environment variable, subdomain, user preference, etc.
export function getCurrentBrand(): Brand {
  // Option 1: Environment variable (recommended for deployment)
  const envBrand = process.env.NEXT_PUBLIC_BRAND as Brand
  if (envBrand && brandConfigs[envBrand]) {
    return envBrand
  }
  
  // Option 2: Subdomain detection (for multi-tenant setups)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    if (hostname.includes('redington')) {
      return 'redington'
    }
    if (hostname.includes('tangram')) {
      return 'tangram'
    }
  }
  
  // Default fallback
  return 'tangram'
}

// Get brand configuration
export function getBrandConfig(): BrandConfig {
  const brand = getCurrentBrand()
  return brandConfigs[brand]
}

// Hook for React components
export function useBrand() {
  const [brand, setBrand] = useState<Brand>('tangram')
  const [config, setConfig] = useState<BrandConfig>(brandConfigs.tangram)
  
  useEffect(() => {
    const currentBrand = getCurrentBrand()
    setBrand(currentBrand)
    setConfig(brandConfigs[currentBrand])
  }, [])
  
  return { brand, config }
}

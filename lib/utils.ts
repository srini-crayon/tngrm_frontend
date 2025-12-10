import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Consistent date formatting to avoid hydration mismatches
export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

export function formatDateTime(date: Date = new Date()): string {
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
}

// Convert agent name to URL-friendly slug (preserves spaces as shown in URL)
export function slugifyAgentName(name: string): string {
  if (!name) return ''
  return name
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces, hyphens, and word chars
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
}

// Convert slug back to agent name format (for display)
export function deslugifyAgentName(slug: string): string {
  return slug
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

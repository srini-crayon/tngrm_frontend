// Token utility functions for managing JWT tokens

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('auth-token')
  } catch (e) {
    console.error('Error accessing localStorage:', e)
    return null
  }
}

export const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('auth-token', token)
  } catch (e) {
    console.error('Error setting localStorage:', e)
  }
}

export const removeStoredToken = (): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem('auth-token')
  } catch (e) {
    console.error('Error removing from localStorage:', e)
  }
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch {
    return true
  }
}

export const getTokenPayload = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

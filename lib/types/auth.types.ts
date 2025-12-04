export type UserRole = 'admin' | 'isv' | 'reseller' | 'client'

export interface User {
  auth_id: string
  user_id: string
  email: string
  role: UserRole
}

// API Request Types
export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  role: 'isv' | 'reseller' | 'client'
  // ISV fields
  isv_name?: string
  isv_registered_name?: string
  isv_address?: string
  isv_domain?: string
  isv_mob_no?: string
  isv_country_code?: string
  isv_mou?: string // base64 or file data
  // Reseller fields
  reseller_name?: string
  reseller_registered_name?: string
  reseller_address?: string
  reseller_domain?: string
  reseller_mob_no?: string
  reseller_country_code?: string
  reseller_whitelisted_domain?: string
  reseller_logo?: string // base64 or file data
  // Client fields
  client_name?: string
  client_company?: string
  client_mob_no?: string
}

// API Response Types
export interface LoginResponse {
  success: boolean
  message?: string
  user?: User
  redirect?: string
}

export interface SignupResponse {
  success: boolean
  message: string
  user_id: string
  role: string
  redirect: string
}

export interface ApiError {
  message: string
  status?: number
  code?: string
}

// Form Data Types for Components
export interface ClientSignupForm {
  email: string
  password: string
  name: string
  company: string
  contactNumber: string
}

export interface ResellerSignupForm {
  email: string
  password: string
  name: string
  registeredName: string
  registeredAddress: string
  domain: string
  contactNumber: string
  whitelistedDomain: string
}

export interface ISVSignupForm {
  email: string
  password: string
  name: string
  registeredName: string
  registeredAddress: string
  domain: string
  contactNumber: string
  whitelistedDomain: string
}

// Auth Store State
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  redirectUrl: string | null
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<{ success: boolean; redirect?: string }>
  signup: (data: SignupRequest) => Promise<{ success: boolean; message?: string; redirect?: string }>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
}

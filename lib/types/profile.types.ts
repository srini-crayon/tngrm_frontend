// Profile types for different user roles

export interface ClientProfile {
  client_id: string
  name: string
  email: string
  company: string
  contact_number: string
  created_at?: string
  updated_at?: string
}

export interface ISVProfile {
  isv_id: string
  name: string
  position: string
  registered_name: string
  registered_address: string
  domain: string
  contact_number: string
  mou_file_path?: string
  logo_file_path?: string
  created_at?: string
  updated_at?: string
}

export interface ResellerProfile {
  reseller_id: string
  name: string
  position: string
  registered_name: string
  registered_address: string
  domain: string
  contact_number: string
  logo_file_path?: string
  created_at?: string
  updated_at?: string
}

export interface ClientProfileUpdate {
  name?: string
  company?: string
  contact_number?: string
}

export interface ISVProfileUpdate {
  name?: string
  position?: string
  registered_name?: string
  registered_address?: string
  domain?: string
  contact_number?: string
}

export interface ResellerProfileUpdate {
  name?: string
  position?: string
  registered_name?: string
  registered_address?: string
  domain?: string
  contact_number?: string
}

export interface ProfileApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export type UserProfile = ClientProfile | ISVProfile | ResellerProfile
export type ProfileUpdate = ClientProfileUpdate | ISVProfileUpdate | ResellerProfileUpdate

import { 
  ClientProfile, 
  ISVProfile, 
  ResellerProfile, 
  ClientProfileUpdate, 
  ISVProfileUpdate, 
  ResellerProfileUpdate,
  ProfileApiResponse 
} from '../types/profile.types'
import { getAuthHeaders } from './config'
import { useAuthStore } from '../store/auth.store'

const API_BASE_URL = 'https://agents-store.onrender.com'

export class ProfileService {
  private static getToken(): string | null {
    // Get token from auth store
    if (typeof window !== 'undefined') {
      const state = useAuthStore.getState()
      const token = state.token
      
      // Validate token if present
      if (token) {
        try {
          const { isTokenExpired } = require('../utils/token')
          if (isTokenExpired(token)) {
            console.warn('Token expired, clearing auth state')
            state.logout()
            return null
          }
        } catch (error) {
          console.warn('Error validating token:', error)
        }
      }
      
      return token
    }
    return null
  }
  // Client Profile Methods
  static async fetchClientProfile(clientId: string): Promise<ClientProfile> {
    const token = this.getToken()
    const headers = getAuthHeaders(token, {
      'Content-Type': 'application/json',
    })
    
    const response = await fetch(`${API_BASE_URL}/api/client/profile/${clientId}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch client profile: ${response.status}`)
    }

    const data = await response.json()
    
    // The API returns { success: true, client: {...} } structure
    // We need to map the client object to our ClientProfile interface
    if (data.success && data.client) {
      return {
        client_id: data.client.client_id,
        name: data.client.client_name || '',
        email: data.client.client_email_no || '',
        company: data.client.client_company || '',
        contact_number: data.client.client_mob_no ? `+91 ${data.client.client_mob_no}` : '',
        created_at: undefined,
        updated_at: undefined,
      }
    }
    
    throw new Error('Client data not found in response')
  }

  static async updateClientProfile(clientId: string, updateData: ClientProfileUpdate): Promise<ClientProfile> {
    const token = this.getToken()
    const headers = getAuthHeaders(token, {
      'Content-Type': 'application/json',
    })
    
    const response = await fetch(`${API_BASE_URL}/api/client/profile/${clientId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error(`Failed to update client profile: ${response.status}`)
    }

    const data: ProfileApiResponse<ClientProfile> = await response.json()
    return data.data
  }

  // ISV Profile Methods
  static async fetchISVProfile(isvId: string): Promise<ISVProfile> {
    const token = this.getToken()
    const headers = getAuthHeaders(token, {
      'Content-Type': 'application/json',
    })
    
    const response = await fetch(`${API_BASE_URL}/api/isv/profile/${isvId}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ISV profile: ${response.status}`)
    }

    const data = await response.json()
    
    // The API returns { isv: {...}, agents: [...] } structure
    // We need to map the isv object to our ISVProfile interface
    if (data.isv) {
      return {
        isv_id: data.isv.isv_id,
        name: data.isv.isv_name || '',
        position: '', // Not provided in API
        registered_name: data.isv.isv_name || '',
        registered_address: data.isv.isv_address || '',
        domain: data.isv.isv_domain || '',
        contact_number: data.isv.isv_mob_no || '',
        mou_file_path: data.isv.mou_file_path === 'na' ? undefined : data.isv.mou_file_path,
        logo_file_path: undefined, // Not provided in API
        created_at: undefined,
        updated_at: undefined,
      }
    }
    
    throw new Error('ISV data not found in response')
  }

  static async updateISVProfile(isvId: string, updateData: ISVProfileUpdate): Promise<ISVProfile> {
    const token = this.getToken()
    const headers = getAuthHeaders(token, {
      'Content-Type': 'application/json',
    })
    
    const response = await fetch(`${API_BASE_URL}/api/isv/profile/${isvId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error(`Failed to update ISV profile: ${response.status}`)
    }

    const data: ProfileApiResponse<ISVProfile> = await response.json()
    return data.data
  }

  // Reseller Profile Methods
  static async fetchResellerProfile(resellerId: string): Promise<ResellerProfile> {
    const token = this.getToken()
    const headers = getAuthHeaders(token, {
      'Content-Type': 'application/json',
    })
    
    const response = await fetch(`${API_BASE_URL}/api/reseller/profile/${resellerId}`, {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch reseller profile: ${response.status}`)
    }

    const data = await response.json()
    
    // The API returns { reseller: {...}, statistics: {...} } structure
    // We need to map the reseller object to our ResellerProfile interface
    if (data.reseller) {
      return {
        reseller_id: data.reseller.reseller_id,
        name: data.reseller.reseller_name || '',
        position: '', // Not provided in API
        registered_name: data.reseller.reseller_name || '',
        registered_address: data.reseller.reseller_address || '',
        domain: data.reseller.reseller_domain === 'na' ? '' : data.reseller.reseller_domain,
        contact_number: data.reseller.reseller_mob_no === 'na' ? '' : data.reseller.reseller_mob_no,
        logo_file_path: undefined, // Not provided in API
        created_at: undefined,
        updated_at: undefined,
      }
    }
    
    throw new Error('Reseller data not found in response')
  }

  static async updateResellerProfile(resellerId: string, updateData: ResellerProfileUpdate): Promise<ResellerProfile> {
    const token = this.getToken()
    const headers = getAuthHeaders(token, {
      'Content-Type': 'application/json',
    })
    
    const response = await fetch(`${API_BASE_URL}/api/reseller/profile/${resellerId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updateData),
    })

    if (!response.ok) {
      throw new Error(`Failed to update reseller profile: ${response.status}`)
    }

    const data: ProfileApiResponse<ResellerProfile> = await response.json()
    return data.data
  }

  // File Upload Methods (for ISV and Reseller)
  static async uploadFile(file: File, type: 'mou' | 'logo', userId: string): Promise<string> {
    const token = this.getToken()
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    formData.append('user_id', userId)

    const headers = getAuthHeaders(token, {
      // Don't set Content-Type - let browser set it with boundary for multipart
    })

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.status}`)
    }

    const data = await response.json()
    return data.file_path
  }

  // File Download Methods
  static getFileDownloadUrl(filePath: string): string {
    return `${API_BASE_URL}${filePath}`
  }
}

import { createApiUrl, createFormData, endpoints } from './config'
import type {
  AgentAPIResponse,
  ISVAPIResponse,
  ResellerAPIResponse,
  UpdateAgentRequest,
  UpdateISVRequest,
  UpdateResellerRequest,
  ApiError,
} from '../types/admin.types'

class AdminService {
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'PUT' = 'GET',
    data?: Record<string, any>
  ): Promise<T> {
    try {
      const url = createApiUrl(endpoint)
      
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        credentials: 'include', // Include cookies for session management
        mode: 'cors',
      }

      if (data && method === 'PUT') {
        options.body = createFormData(data)
      }

      console.log(`Admin API ${method} request to:`, url)
      if (data) console.log('Request data:', data)

      const response = await fetch(url, options)
      
      console.log('Response status:', response.status)

      const result = await response.json()
      console.log('Response data:', result)

      if (!response.ok) {
        let errorMessage = result.message || `HTTP ${response.status}: ${response.statusText}`
        
        if (response.status === 401) {
          errorMessage = "Unauthorized. Please log in as admin."
        } else if (response.status === 403) {
          errorMessage = "Access denied. Admin privileges required."
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later."
        } else if (response.status === 422) {
          errorMessage = "Invalid data provided. Please check all fields."
        } else if (response.status === 404) {
          errorMessage = "Resource not found."
        }
        
        throw {
          message: errorMessage,
          status: response.status,
          code: result.code,
        } as ApiError
      }

      return result
    } catch (error) {
      console.error('Admin API request error:', error)
      
      if ((error as ApiError).message) {
        throw error
      }
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0,
          code: 'NETWORK_ERROR',
        } as ApiError
      }
      throw error
    }
  }

  // Agent Management
  async fetchAgents(): Promise<AgentAPIResponse[]> {
    const response = await this.makeRequest<any>(endpoints.admin.agents, 'GET')
    // The response might be wrapped in a data property or be an array directly
    return Array.isArray(response) ? response : (response.data || response.agents || [])
  }

  async updateAgent(agentId: string, data: UpdateAgentRequest): Promise<any> {
    return this.makeRequest<any>(endpoints.admin.updateAgent(agentId), 'PUT', data)
  }

  // ISV Management
  async fetchISVs(): Promise<ISVAPIResponse[]> {
    const response = await this.makeRequest<any>(endpoints.admin.isvs, 'GET')
    return Array.isArray(response) ? response : (response.data || response.isvs || [])
  }

  async updateISV(isvId: string, data: UpdateISVRequest): Promise<any> {
    return this.makeRequest<any>(endpoints.admin.updateIsv(isvId), 'PUT', data)
  }

  // Reseller Management
  async fetchResellers(): Promise<ResellerAPIResponse[]> {
    const response = await this.makeRequest<any>(endpoints.admin.resellers, 'GET')
    return Array.isArray(response) ? response : (response.data || response.resellers || [])
  }

  async updateReseller(resellerId: string, data: UpdateResellerRequest): Promise<any> {
    return this.makeRequest<any>(endpoints.admin.updateReseller(resellerId), 'PUT', data)
  }
}

export const adminService = new AdminService()


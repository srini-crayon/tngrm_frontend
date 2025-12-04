import { createApiUrl } from './config'
import type { AgentOnboardRequest, AgentOnboardResponse, ApiError } from '../types/agent.types'

class AgentService {
  private async makeRequest<T>(
    endpoint: string,
    data: AgentOnboardRequest,
    method: 'POST' = 'POST'
  ): Promise<T> {
    try {
      const url = createApiUrl(endpoint)
      const formData = new FormData()

      // Add all text fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Handle file arrays (demo_files)
          if (key === 'demo_files' && Array.isArray(value) && value.length > 0) {
            value.forEach((file: File) => {
              formData.append('demo_files[]', file)
            })
          }
          // Handle single file (readme_file)
          else if (key === 'readme_file' && value instanceof File) {
            formData.append('readme_file', value)
          }
          // Handle regular text fields (including empty strings)
          else if (typeof value === 'string') {
            formData.append(key, value)
          }
        }
      })

      console.log('Making agent request to:', url)
      // Fix for Safari: use Array.from safely
      try {
        const formDataKeys = Array.from(formData.keys())
        console.log('Request data keys:', formDataKeys)
      } catch (e) {
        console.log('Request data keys: [unable to log in Safari]')
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',
          // Don't set Content-Type - let browser set it with boundary for multipart
        },
        body: formData,
        credentials: 'include',
        mode: 'cors',
      })

      console.log('Response status:', response.status)
      // Fix for Safari: safely convert headers to object
      try {
        const headersObj = Object.fromEntries(response.headers.entries())
        console.log('Response headers:', headersObj)
      } catch (e) {
        console.log('Response headers: [unable to log in Safari]')
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        console.error('Non-JSON response received:', textResponse.substring(0, 200))
        throw {
          message: `Server returned non-JSON response. Status: ${response.status}`,
          status: response.status,
          code: 'INVALID_RESPONSE',
        } as ApiError
      }

      const result = await response.json()
      console.log('Response data:', result)

      if (!response.ok) {
        let errorMessage = result.message || `HTTP ${response.status}: ${response.statusText}`
        
        if (response.status === 500) {
          errorMessage = "Server error. Please try again or contact support."
        } else if (response.status === 422) {
          errorMessage = "Invalid data provided. Please check all fields and try again."
        } else if (response.status === 0) {
          errorMessage = "Network error. Please check your internet connection and try again."
        }
        
        throw {
          message: errorMessage,
          status: response.status,
          code: result.code,
        } as ApiError
      }

      return result
    } catch (error) {
      console.error('Agent request error:', error)
      
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

  async onboardAgent(data: AgentOnboardRequest): Promise<AgentOnboardResponse> {
    return this.makeRequest<AgentOnboardResponse>('/api/agent/onboard', data)
  }

  async updateAgent(agentId: string, formData: FormData): Promise<any> {
    try {
      const url = createApiUrl(`/api/agents/${agentId}`)
      
      console.log(`Agent API PUT request to:`, url)

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          // Don't set Content-Type - let browser set it with boundary for multipart
        },
        body: formData,
        credentials: 'include',
        mode: 'cors',
      })

      console.log('Response status:', response.status)

      const result = await response.json()
      console.log('Response data:', result)

      if (!response.ok) {
        let errorMessage = result.message || `HTTP ${response.status}: ${response.statusText}`
        
        if (response.status === 401) {
          errorMessage = "Unauthorized. Please log in again."
        } else if (response.status === 403) {
          errorMessage = "Access denied. You don't have permission to update this agent."
        } else if (response.status === 500) {
          errorMessage = "Server error. Please try again later."
        } else if (response.status === 422) {
          errorMessage = "Invalid data provided. Please check all fields."
        } else if (response.status === 404) {
          errorMessage = "Agent not found."
        }
        
        throw {
          message: errorMessage,
          status: response.status,
          code: result.code,
        } as ApiError
      }

      return result
    } catch (error) {
      console.error('Agent API request error:', error)
      
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
}

export const agentService = new AgentService()

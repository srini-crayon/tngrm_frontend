import { createApiUrl, createFormData } from './config'
import type { LoginRequest, SignupRequest, LoginResponse, SignupResponse, ApiError } from '../types/auth.types'

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    data: Record<string, any>,
    method: 'POST' = 'POST'
  ): Promise<T> {
    try {
      const url = createApiUrl(endpoint)
      const formData = createFormData(data)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: formData,
        credentials: 'include', // Include cookies for session management
        mode: 'cors', // Explicitly set CORS mode
      })

      const result = await response.json()

      if (!response.ok) {
        // Try to get more detailed error information
        let errorMessage = result.message || `HTTP ${response.status}: ${response.statusText}`
        
        // Handle specific error cases
        if (response.status === 500) {
          errorMessage = "Server error. This might be due to duplicate email or invalid data. Please try with different information."
        } else if (response.status === 422) {
          errorMessage = "Invalid data provided. Please check all fields and try again."
        } else if (response.status === 409) {
          errorMessage = "Email already exists. Please use a different email address."
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

  async login(email: string, password: string): Promise<LoginResponse> {
    const loginData: LoginRequest = { email, password }
    return this.makeRequest<LoginResponse>('/api/auth/login', loginData)
  }

  async signup(data: SignupRequest): Promise<SignupResponse> {
    return this.makeRequest<SignupResponse>('/api/auth/signup', data)
  }

  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await fetch(createApiUrl('/api/health'))
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      throw new Error('Backend service is unavailable')
    }
  }
}

export const authService = new AuthService()

// Agent onboarding types
export interface DemoAsset {
  asset_type: string
  asset_name: string
  link: string
}

export interface DeploymentOption {
  service_provider: string
  service_name: string
  deployment_type: string
  cloud_region: string
  capability: string
}

export interface AgentFormData {
  // Step 1: Basic Information
  agent_name: string
  asset_type: string
  description: string
  by_value: string // Value Proposition
  features: string[] // Key Features (multi-select)
  tags: string[] // Tags (multi-select)
  
  // Step 2: Capabilities & Target Audience
  capabilities: string[]
  by_persona: string[] // Target Personas
  
  // Step 3: Business Value & ROI
  businessValues: string[]
  roi: string
  
  // Step 4: Demo & Documentation
  demo_link: string
  demo_assets: DemoAsset[]
  sdk_details: string
  swagger_details: string
  
  // Step 5: Technical Details
  sample_input: string
  sample_output: string
  security_details: string
  related_files: string
  deployments: DeploymentOption[]
}

// API Request/Response types
export interface AgentOnboardRequest {
  agent_name: string
  asset_type: string
  by_persona: string
  by_value: string
  description: string
  features: string
  roi: string
  tags: string
  demo_link: string
  isv_id: string
  capabilities: string
  demo_assets: string
  sdk_details: string
  swagger_details: string
  sample_input: string
  sample_output: string
  security_details: string
  related_files: string
  deployments: string
  // File upload fields (will be handled as FormData)
  demo_files?: File[]
  readme_file?: File
}

export interface AgentOnboardResponse {
  success: boolean
  message: string
  agent_id?: string
}

export interface ApiError {
  message: string
  status?: number
  code?: string
}

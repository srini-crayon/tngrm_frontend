"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { ArrowLeft, ArrowRight, Check, ChevronRight, X, Upload, FileText, Image as ImageIcon, Code, Megaphone, TrendingUp, Users, DollarSign, Headphones, BarChart3, FolderKanban, Briefcase, Package, Palette, Search, MessageSquare, Video, Mic, Sparkles, Zap, Brain } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "../lib/utils"
import { MultiSelectInput } from "./multi-select-input"
import { DropdownWithCustom } from "./dropdown-with-custom"
import { useAuthStore } from "../lib/store/auth.store"
import { OnboardAgentPreview } from "./onboard-agent-preview"

type Step = 1 | 2 | 3 | 4 | 5

// Predefined options for multi-select fields
const tagOptions = [
  "AI/ML", "Automation", "Productivity", "Analytics", "Integration", 
  "Cloud", "Enterprise", "Open Source", "Machine Learning", "Deep Learning",
  "Natural Language Processing", "Computer Vision", "Robotics", "IoT"
]

const targetPersonaOptions = [
  "Developer", "Marketing Professional", "Sales Professional", "HR Professional",
  "Finance Professional", "Customer Service Representative", "Data Analyst",
  "Project Manager", "Executive", "Product Manager", "Designer", "Researcher"
]

// Icon mapping for Target Personas
const personaIconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  "Developer": Code,
  "Marketing Professional": Megaphone,
  "Sales Professional": TrendingUp,
  "HR Professional": Users,
  "Finance Professional": DollarSign,
  "Customer Service Representative": Headphones,
  "Data Analyst": BarChart3,
  "Project Manager": FolderKanban,
  "Executive": Briefcase,
  "Product Manager": Package,
  "Designer": Palette,
  "Researcher": Search,
}

// Icon mapping for Core Capabilities
const capabilityIconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  "Conversational AI & Advisory": MessageSquare,
  "Document Processing & Analysis": FileText,
  "Image Processing": ImageIcon,
  "Video Processing": Video,
  "Voice & Meetings": Mic,
  "Data Analysis & Insights": BarChart3,
  "Content Generation": Sparkles,
  "Process Automation": Zap,
  "Predictive Analytics": TrendingUp,
  "Machine Learning": Brain,
}

const keyFeatureOptions = [
  "Real-time Processing", "Multi-language Support", "API Integration", 
  "Customizable Workflows", "Advanced Analytics", "Enterprise Security",
  "Auto-scaling", "Mobile Ready", "Cloud Native", "On-premise Deployment"
]

const capabilityOptions = [
  "Conversational AI & Advisory", "Document Processing & Analysis", "Image Processing",
  "Video Processing", "Voice & Meetings", "Data Analysis & Insights", 
  "Content Generation", "Process Automation", "Predictive Analytics", "Machine Learning"
]

// Dropdown options
const agentTypeOptions = ["Agent", "Solution", "Platform", "Tool", "Service"]
const valuePropositionOptions = ["Analytics", "Customer Experience", "Data", "Productivity"]

const serviceProviderOptions = ["AWS", "Azure", "GCP", "Open-Source", "SaaS"]

const bundledAgentOptions = [
  "Text Analyzer", "Image Processor", "Voice Recognition", "Data Extractor",
  "Content Generator", "Sentiment Analyzer", "Document Parser", "Chat Assistant",
  "Translation Agent", "Summarization Agent", "Question Answering", "Entity Extractor"
]

const serviceNameOptions = [
  "ABBYY FlexiCapture", "Amazon Athena", "Amazon Chime SDK Amazon Transcribe",
  "Amazon Comprehend", "Amazon EMR", "Amazon Kendra", "Amazon Kinesis Video Streams",
  "Amazon Lex", "Amazon Polly", "Amazon Redshift", "Amazon Rekognition Video",
  "Amazon Textract", "Amazon Transcribe", "Anthropic Claude", "Apache Spark",
  "AssemblyAI", "Azure AI Bot Service", "Azure AI Document Intelligence",
  "Azure AI Search", "Azure AI Speech", "Azure AI Video Indexer",
  "Azure Communication Services", "Azure Databricks", "Azure Media Services",
  "Azure OpenAI Service", "Azure Synapse Analytics", "BigQuery", "Botpress",
  "Camelot", "Cloud Speech-to-Text", "Cloud Video Intelligence API",
  "Coqui STT", "Dask", "Databricks (non-AWS)", "Dataproc", "DeepDoctection",
  "Deepgram Video API", "Detectron2", "Dialogflow", "Diffbot", "DocMind AI",
  "DocQuery", "Docling", "Document AI", "Excalibur", "GPT-4 Open-Source Variants",
  "Google Meet", "Grobid", "Haystack", "Import.io", "LangChain", "LayoutLMv3",
  "Media CDN", "MediaPipe", "Milvus", "OpenAI GPT APIs", "OpenAI Whisper (open-source variant)",
  "OpenAssistant", "OpenCV", "OpenSemanticSearch", "Pandas", "Pinecone",
  "PyTorchVideo", "Qdrant", "Rasa", "Rev.ai", "Rossum", "Snowflake (multi-cloud)",
  "TableFormer", "Tesseract OCR", "Vaex", "Vertex AI Search and Conversation",
  "Vosk", "Weaviate", "Zubtitle"
]
const deploymentTypeOptions = ["Cloud", "On-Prem", "Hybrid", "Edge", "Serverless"]

// Capability interface
interface Capability {
  by_capability_id: string
  by_capability: string
}

// Form data interface
interface AgentFormData {
  // Tab 1: Agent Details
  agentName: string
  agentDescription: string
  agentType: string
  tags: string[]
  bundledAgents: string[]
  targetPersonas: string[]
  keyFeatures: string
  valueProposition: string
  roiInformation: string
  demoLink: string
  
  // Tab 2: Capabilities - store both ID and name
  coreCapabilities: string[] // Store capability IDs
  coreCapabilityMap: Record<string, string> // Map capability ID to name
  
  // Tab 3: Demo Assets
  demoLinks: string[]
  bulkFiles: FileWithPreview[]
  
  // Tab 4: Documentation
  sdkDetails: string
  apiDocumentation: string
  sampleInput: string
  sampleOutput: string
  securityDetails: string
  readmeFile: File | null
  additionalRelatedFiles: string[]
  deploymentOptions: DeploymentOption[]
}

interface FileWithPreview {
  file: File
  name: string
  size: number
  type: string
  previewUrl?: string
}

interface DeploymentOption {
  serviceProvider: string
  serviceName: string
  deploymentType: string
  cloudRegion: string
  capability: string
  capabilityId?: string // Store capability ID for reference
}

// API response interface for deployments
interface DeploymentApiResponse {
  capability_id: string
  capability_name: string
  options: Array<{
    service_provider: string
    service_name: string
    deployment: string
    cloud_region: string
  }>
}

interface CustomOnboardModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CustomOnboardModal({ isOpen, onClose }: CustomOnboardModalProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [capabilities, setCapabilities] = useState<Capability[]>([])
  const [isLoadingCapabilities, setIsLoadingCapabilities] = useState(false)
  const [loadingDeployments, setLoadingDeployments] = useState<Record<string, boolean>>({})
  const [deploymentData, setDeploymentData] = useState<Record<string, DeploymentApiResponse>>({})
  const bulkFileInputRef = useRef<HTMLInputElement>(null)
  const readmeFileInputRef = useRef<HTMLInputElement>(null)
  const [newDemoLink, setNewDemoLink] = useState("")
  const [newAdditionalLink, setNewAdditionalLink] = useState("")
  
  // Function to fetch deployments for a specific capability
  const fetchDeploymentsForCapability = async (capabilityId: string, capabilityName: string) => {
    setLoadingDeployments(prev => ({ ...prev, [capabilityId]: true }))
    
    try {
      const apiUrl = process.env.NODE_ENV === 'development'
        ? `http://localhost:8000/api/capabilities/${capabilityId}/deployments`
        : `/api/capabilities/${capabilityId}/deployments`
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch deployments: ${response.status}`)
      }
      
      const data: DeploymentApiResponse = await response.json()
      
      // Store deployment data
      setDeploymentData(prev => ({
        ...prev,
        [capabilityId]: data,
      }))
      
      // Auto-populate deployment options
      if (data.options && data.options.length > 0) {
        const newDeploymentOptions: DeploymentOption[] = data.options.map(option => ({
          serviceProvider: option.service_provider,
          serviceName: option.service_name,
          deploymentType: option.deployment,
          cloudRegion: option.cloud_region,
          capability: capabilityName,
          capabilityId: capabilityId,
        }))
        
        // Add new options, avoiding duplicates
        setFormData(prev => {
          const existingOptions = prev.deploymentOptions
          const existingKeys = new Set(
            existingOptions.map(opt => 
              `${opt.capabilityId}-${opt.serviceProvider}-${opt.serviceName}-${opt.deploymentType}`
            )
          )
          
          const uniqueNewOptions = newDeploymentOptions.filter(opt => {
            const key = `${opt.capabilityId}-${opt.serviceProvider}-${opt.serviceName}-${opt.deploymentType}`
            return !existingKeys.has(key)
          })
          
          return {
            ...prev,
            deploymentOptions: [...existingOptions, ...uniqueNewOptions],
          }
        })
      }
    } catch (error) {
      console.error(`Error fetching deployments for capability ${capabilityId}:`, error)
    } finally {
      setLoadingDeployments(prev => ({ ...prev, [capabilityId]: false }))
    }
  }
  
  // Fetch capabilities from API
  useEffect(() => {
    const fetchCapabilities = async () => {
      setIsLoadingCapabilities(true)
      try {
        // Determine API URL - use localhost:8000 for local dev, or proxy for production
        const apiUrl = process.env.NODE_ENV === 'development' 
          ? 'http://localhost:8000/api/capabilities'
          : '/api/capabilities'
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch capabilities: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Extract unique capabilities (deduplicate by capability name)
        // Keep the first occurrence of each unique capability name
        const uniqueCapabilitiesMap = new Map<string, Capability>()
        
        if (data.capabilities && Array.isArray(data.capabilities)) {
          data.capabilities.forEach((cap: Capability) => {
            // Use capability name as key to ensure uniqueness
            // If duplicate name exists, keep the first one
            if (!uniqueCapabilitiesMap.has(cap.by_capability)) {
              uniqueCapabilitiesMap.set(cap.by_capability, cap)
            }
          })
        }
        
        const uniqueCapabilities = Array.from(uniqueCapabilitiesMap.values())
        // Sort by capability name for better UX
        uniqueCapabilities.sort((a, b) => a.by_capability.localeCompare(b.by_capability))
        setCapabilities(uniqueCapabilities)
      } catch (error) {
        console.error('Error fetching capabilities:', error)
        // Fallback to hardcoded capabilities if API fails
        setCapabilities([
          { by_capability_id: "capa_001", by_capability: "Conversational AI & Advisory" },
          { by_capability_id: "capa_002", by_capability: "Document Processing & Analysis" },
          { by_capability_id: "capa_003", by_capability: "Image Processing" },
          { by_capability_id: "capa_004", by_capability: "Video Processing" },
          { by_capability_id: "capa_005", by_capability: "Voice & Meetings" },
          { by_capability_id: "capa_006", by_capability: "Data Analysis & Insights" },
          { by_capability_id: "capa_007", by_capability: "Content Generation" },
          { by_capability_id: "capa_008", by_capability: "Process Automation" },
          { by_capability_id: "capa_009", by_capability: "Predictive Analytics" },
          { by_capability_id: "capa_010", by_capability: "Machine Learning" },
        ])
      } finally {
        setIsLoadingCapabilities(false)
      }
    }
    
    if (isOpen) {
      fetchCapabilities()
    }
  }, [isOpen])
  
  // Add smooth step transitions
  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => setIsAnimating(false), 300)
    return () => clearTimeout(timer)
  }, [currentStep])
  
  const [formData, setFormData] = useState<AgentFormData>({
    // Tab 1: Agent Details
    agentName: "",
    agentDescription: "",
    agentType: "",
    tags: [],
    bundledAgents: [],
    targetPersonas: [],
    keyFeatures: "",
    valueProposition: "",
    roiInformation: "",
    demoLink: "",
    
    // Tab 2: Capabilities
    coreCapabilities: [], // Store capability IDs
    coreCapabilityMap: {}, // Map capability ID to name
    
    // Tab 3: Demo Assets
    demoLinks: [],
    bulkFiles: [],
    
    // Tab 4: Documentation
    sdkDetails: "",
    apiDocumentation: "",
    sampleInput: "",
    sampleOutput: "",
    securityDetails: "",
    readmeFile: null,
    additionalRelatedFiles: [],
    deploymentOptions: [],
  })

  const steps = [
    { number: 1, title: "Agent Details", label: "Agent Details" },
    { number: 2, title: "Capabilities", label: "Capabilities" },
    { number: 3, title: "Demo Assets", label: "Demo Assets" },
    { number: 4, title: "Documentation", label: "Documentation" },
    { number: 5, title: "Preview & Submit", label: "Preview & Submit" },
  ]

  const handleNext = async () => {
    if (currentStep < 5) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep((currentStep + 1) as Step)
      }, 150)
    } else {
      // Submit the form
      await handleSubmit()
    }
  }
  
  const handleBack = () => {
    if (currentStep > 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep((currentStep - 1) as Step)
      }, 150)
    } else {
      onClose()
    }
  }
  
  const handleTabClick = (stepNumber: number) => {
    if (stepNumber !== currentStep && stepNumber <= currentStep) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(stepNumber as Step)
      }, 150)
    }
  }

  // Form validation function
  const validateForm = (): string[] => {
    const errors: string[] = []

    // Required fields validation
    if (!formData.agentName.trim()) {
      errors.push("Agent name is required")
    }
    // URL validation
    const urlRegex = /^https?:\/\/.+\..+/
    if (formData.apiDocumentation && !urlRegex.test(formData.apiDocumentation)) {
      errors.push("API documentation must be a valid URL")
    }
    if (formData.demoLink && !urlRegex.test(formData.demoLink)) {
      errors.push("Demo link must be a valid URL")
    }

    return errors
  }

  const handleSubmit = async () => {
    if (!user?.user_id) {
      setSubmitError("You must be logged in to onboard an agent")
      return
    }

    // Validate form before submission
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setSubmitError(validationErrors.join(". "))
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Convert form data to API format
      const apiData = {
        agent_name: formData.agentName,
        asset_type: formData.agentType,
        description: formData.agentDescription,
        by_value: formData.valueProposition,
        tags: formData.tags.length > 0 ? formData.tags.join(", ") : "",
        by_persona: formData.targetPersonas.length > 0 ? formData.targetPersonas.join(", ") : "",
        features: formData.keyFeatures || "",
        roi: formData.roiInformation,
        demo_link: formData.demoLink,
        capabilities: formData.coreCapabilities.length > 0 
          ? formData.coreCapabilities.map(id => formData.coreCapabilityMap[id] || id).join(", ") 
          : "",
        capability_ids: formData.coreCapabilities.length > 0 ? formData.coreCapabilities.join(", ") : "",
        demo_assets: formData.demoLinks.length > 0 ? formData.demoLinks.join(", ") : "",
        sdk_details: formData.sdkDetails,
        swagger_details: formData.apiDocumentation,
        sample_input: formData.sampleInput,
        sample_output: formData.sampleOutput,
        security_details: formData.securityDetails,
        related_files: formData.additionalRelatedFiles.length > 0 ? formData.additionalRelatedFiles.join(", ") : "",
        deployments: JSON.stringify(formData.deploymentOptions),
        isv_id: user.user_id,
        // Add file uploads
        demo_files: formData.bulkFiles.length > 0 ? formData.bulkFiles.map(f => f.file) : undefined,
        readme_file: formData.readmeFile ?? undefined,
      }

      // Import agent service and make API call
      const { agentService } = await import("../lib/api/agent.service")
      const response = await agentService.onboardAgent(apiData)
      
      console.log("Agent onboarded successfully:", response)
      
      // Close modal and redirect to success page
      onClose()
      router.push("/onboard/success")
    } catch (error: any) {
      console.error("Error submitting agent:", error)
      setSubmitError(error.message || "An unexpected error occurred while submitting the agent")
    } finally {
      setIsSubmitting(false)
    }
  }


  // File handling functions
  const handleFileUpload = (file: File, type: 'readme') => {
    setFormData(prev => ({ ...prev, readmeFile: file }))
  }

  const handleBulkFileUpload = (files: FileList) => {
    const newFiles: FileWithPreview[] = Array.from(files).map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }))
    
    setFormData(prev => ({ 
      ...prev, 
      bulkFiles: [...prev.bulkFiles, ...newFiles] 
    }))
  }

  const removeBulkFile = (index: number) => {
    setFormData(prev => {
      const newFiles = [...prev.bulkFiles]
      const removedFile = newFiles[index]
      if (removedFile.previewUrl) {
        URL.revokeObjectURL(removedFile.previewUrl)
      }
      newFiles.splice(index, 1)
      return { ...prev, bulkFiles: newFiles }
    })
  }

  const addDemoLink = () => {
    if (newDemoLink.trim()) {
      setFormData(prev => ({ ...prev, demoLinks: [...prev.demoLinks, newDemoLink.trim()] }))
      setNewDemoLink("")
    }
  }

  const updateDemoLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      demoLinks: prev.demoLinks.map((link, i) => i === index ? value : link)
    }))
  }

  const removeDemoLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      demoLinks: prev.demoLinks.filter((_, i) => i !== index)
    }))
  }

  const addAdditionalLink = () => {
    if (newAdditionalLink.trim()) {
      setFormData(prev => ({ ...prev, additionalRelatedFiles: [...prev.additionalRelatedFiles, newAdditionalLink.trim()] }))
      setNewAdditionalLink("")
    }
  }

  const updateAdditionalLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      additionalRelatedFiles: prev.additionalRelatedFiles.map((link, i) => i === index ? value : link)
    }))
  }

  const removeAdditionalLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalRelatedFiles: prev.additionalRelatedFiles.filter((_, i) => i !== index)
    }))
  }

  const addDeploymentOption = () => {
    setFormData(prev => ({
      ...prev,
      deploymentOptions: [...prev.deploymentOptions, {
        serviceProvider: "",
        serviceName: "",
        deploymentType: "",
        cloudRegion: "",
        capability: ""
      }]
    }))
  }

  const updateDeploymentOption = (index: number, field: keyof DeploymentOption, value: string) => {
    setFormData(prev => ({
      ...prev,
      deploymentOptions: prev.deploymentOptions.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }))
  }

  const removeDeploymentOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deploymentOptions: prev.deploymentOptions.filter((_, i) => i !== index)
    }))
  }

  if (!isOpen) return null

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-6 animate-in fade-in duration-300 overflow-y-auto scrollbar-hide"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-top-4 duration-300 my-4"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #FAFBFC 100%)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
        }}
      >
        {/* Header with gradient background */}
        <div 
          className="px-6 py-5 flex items-start justify-between relative"
          style={{
            background: "linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          <div className="flex flex-col gap-2">
            <h1 
              className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: "28px",
                lineHeight: "130%",
                letterSpacing: "-0.5px",
                margin: 0,
              }}
            >
              Onboard a new agent
            </h1>
            <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
              Step {currentStep} of {steps.length} • {Math.round(progressPercentage)}% complete
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-all duration-200 group"
            style={{
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F3F4F6"
              e.currentTarget.style.borderColor = "#E5E7EB"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
              e.currentTarget.style.borderColor = "transparent"
            }}
          >
            <X className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </button>
        </div>

        {/* Enhanced Progress Steps with animated progress bar */}
        <div 
          className="relative"
          style={{
            width: "100%",
            padding: "0 42px",
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* Animated progress bar */}
          <div 
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
            style={{
              width: `${progressPercentage}%`,
              boxShadow: "0 0 8px rgba(0, 75, 236, 0.4)",
            }}
          />
          
          <div className="flex items-center justify-between w-full py-4">
            {steps.map((step, index) => {
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number
              
              return (
                <div 
                  key={step.number} 
                  className="flex items-center flex-1 group"
                  style={{
                    position: "relative",
                  }}
                >
                  {index > 0 && (
                    <div
                      className="mr-3 transition-all duration-300"
                      style={{
                        width: "32px",
                        height: "2px",
                        backgroundColor: isCompleted ? "#004BEC" : "#E5E7EB",
                        borderRadius: "2px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  )}
                  <button
                    onClick={() => handleTabClick(step.number)}
                    className="flex items-center gap-3 transition-all duration-200"
                    style={{
                      minWidth: "fit-content",
                    }}
                  >
                    {/* Step indicator circle */}
                    <div
                      className="flex items-center justify-center rounded-full transition-all duration-300"
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: isActive 
                          ? "#004BEC" 
                          : isCompleted 
                            ? "#10B981" 
                            : "#F3F4F6",
                        border: isActive ? "2px solid #004BEC" : "2px solid transparent",
                        boxShadow: isActive 
                          ? "0 0 0 4px rgba(0, 75, 236, 0.1)" 
                          : "none",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {isCompleted ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <span
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 600,
                            fontSize: "13px",
                            color: isActive ? "#FFFFFF" : "#6B7280",
                          }}
                        >
                          {step.number}
                        </span>
                      )}
                    </div>
                    
                    <div className="hidden md:block">
                      <div 
                        className="transition-all duration-200"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: isActive ? 600 : 400,
                          fontSize: "13px",
                          lineHeight: "150%",
                          color: isActive 
                            ? "#004BEC" 
                            : isCompleted 
                              ? "#10B981" 
                              : "#6B7280",
                          textAlign: "left",
                          transition: "all 0.2s",
                        }}
                      >
                        Step {step.number}
                      </div>
                      <div
                        className="transition-all duration-200"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: isActive ? 600 : 500,
                          fontSize: "14px",
                          lineHeight: "150%",
                          color: isActive 
                            ? "#004BEC" 
                            : isCompleted 
                              ? "#059669" 
                              : "#9CA3AF",
                          whiteSpace: "nowrap",
                          textAlign: "left",
                          marginTop: "2px",
                        }}
                      >
                        {step.label}
                      </div>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form Content - Scrollable with smooth transitions */}
        <div 
          className="flex-1 overflow-y-auto relative scrollbar-hide"
          style={{
            paddingLeft: "42px",
            paddingRight: "42px",
            paddingTop: "32px",
            paddingBottom: "32px",
            background: "linear-gradient(to bottom, #FFFFFF 0%, #FAFBFC 100%)",
            scrollbarWidth: "none", /* Firefox */
            msOverflowStyle: "none", /* IE and Edge */
          }}
        >
          <div className="mx-auto max-w-none">
            {/* Step transition animation wrapper */}
            <div
              key={currentStep}
              className="animate-in fade-in slide-in-from-right-4 duration-300"
              style={{
                animation: "fadeInSlide 0.3s ease-out",
              }}
            >
            {/* Tab 1: Agent Details */}
            {currentStep === 1 && (
              <div>
                <div className="space-y-6">
                  {/* 1. Agent Name */}
                  <div>
                    <Label 
                      htmlFor="agentName"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: "#111827",
                      }}
                    >
                      Agent Name <span style={{ color: "#111827" }}>*</span>
                    </Label>
                    <Input
                      id="agentName"
                      placeholder="Enter your product name."
                      value={formData.agentName}
                      onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                      className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{
                        width: "100%",
                        maxWidth: "940px",
                        height: "48px",
                        minWidth: "240px",
                        borderRadius: "8px",
                        paddingTop: "12px",
                        paddingRight: "16px",
                        paddingBottom: "12px",
                        paddingLeft: "16px",
                        border: "1.5px solid #E5E7EB",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "150%",
                        color: "#111827",
                        backgroundColor: "#FFFFFF",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#004BEC"
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 75, 236, 0.1)"
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#E5E7EB"
                        e.currentTarget.style.boxShadow = "none"
                      }}
                    />
                  </div>

                  {/* 2. Agent Description */}
                  <div>
                    <Label 
                      htmlFor="agentDescription"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: "#111827",
                      }}
                    >
                      Agent Description <span style={{ color: "#111827" }}>*</span>
                    </Label>
                    <Textarea
                      id="agentDescription"
                      placeholder="Add description about your agent."
                      value={formData.agentDescription}
                      onChange={(e) => setFormData({ ...formData, agentDescription: e.target.value })}
                      className="mt-2 min-h-[120px]"
                      style={{
                        width: "100%",
                        maxWidth: "940px",
                        minWidth: "240px",
                        borderRadius: "4px",
                        paddingTop: "11px",
                        paddingRight: "16px",
                        paddingBottom: "11px",
                        paddingLeft: "16px",
                        border: "1px solid #E5E7EB",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        verticalAlign: "middle",
                        color: "#6B7280",
                      }}
                    />
                  </div>

                  {/* 3. Key Features */}
                  <div>
                    <Label 
                      htmlFor="keyFeatures"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: "#111827",
                      }}
                    >
                      Key Features <span style={{ color: "#111827" }}>*</span>
                    </Label>
                    <Input
                      id="keyFeatures"
                      placeholder="Add agent key features. Add multiple using [;] comma separated"
                      value={formData.keyFeatures}
                      onChange={(e) => setFormData({ ...formData, keyFeatures: e.target.value })}
                      className="mt-2"
                      style={{
                        width: "940px",
                        minWidth: "240px",
                        height: "44px",
                        borderRadius: "4px",
                        paddingTop: "11px",
                        paddingRight: "16px",
                        paddingBottom: "11px",
                        paddingLeft: "16px",
                        border: "1px solid #E5E7EB",
                        borderTop: "1px solid #E5E7EB",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        verticalAlign: "middle",
                        color: "#6B7280",
                      }}
                    />
                  </div>

                  {/* 4. ROI Information */}
                  <div>
                    <Label 
                      htmlFor="roiInformation"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: "#111827",
                      }}
                    >
                      ROI Information <span style={{ color: "#111827" }}>*</span>
                    </Label>
                    <Textarea
                      id="roiInformation"
                      placeholder="Add ROI of your agent. Add multiple ROI using [;] comma separated"
                      value={formData.roiInformation}
                      onChange={(e) => setFormData({ ...formData, roiInformation: e.target.value })}
                      className="mt-2"
                      style={{
                        width: "940px",
                        height: "97px",
                        minWidth: "240px",
                        borderRadius: "4px",
                        paddingTop: "11px",
                        paddingRight: "16px",
                        paddingBottom: "11px",
                        paddingLeft: "16px",
                        border: "1px solid #E5E7EB",
                        borderTop: "1px solid #E5E7EB",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        verticalAlign: "middle",
                        color: "#6B7280",
                      }}
                    />
                  </div>

                  {/* 5, 6. Agent Type and Value Proposition - Side by Side */}
                  <div className="flex flex-col md:flex-row" style={{ gap: "40px" }}>
                    <div>
                      <DropdownWithCustom
                        label="Agent Type"
                        value={formData.agentType}
                        onChange={(value) => setFormData({ ...formData, agentType: value })}
                        options={agentTypeOptions}
                        placeholder="Select agent asset type"
                        required
                      />
                    </div>

                    <div>
                      <DropdownWithCustom
                        label="Value Proposition"
                        value={formData.valueProposition}
                        onChange={(value) => setFormData({ ...formData, valueProposition: value })}
                        options={valuePropositionOptions}
                        placeholder="Select agent asset type"
                        required
                      />
                    </div>
                  </div>

                  {/* 7. Tags and Bundled Agent - Side by Side */}
                  <div className="flex flex-col md:flex-row" style={{ gap: "40px" }}>
                    <div>
                      <MultiSelectInput
                        label="Tags"
                        value={formData.tags}
                        onChange={(value) => setFormData({ ...formData, tags: value })}
                        options={tagOptions}
                        placeholder="Select agent asset type"
                        required
                      />
                    </div>

                    <div>
                      <MultiSelectInput
                        label="Bundled agent"
                        value={formData.bundledAgents}
                        onChange={(value) => setFormData({ ...formData, bundledAgents: value })}
                        options={bundledAgentOptions}
                        placeholder="Select one or more micro agents used in building"
                        required
                      />
                    </div>
                  </div>

                  {/* 8. Target Personas */}
                  <div className="space-y-2">
                    <Label 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: "#111827",
                      }}
                    >
                      Target Personas <span style={{ color: "#111827" }}>*</span>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {targetPersonaOptions.map((persona) => {
                        const isSelected = formData.targetPersonas.includes(persona)
                        const IconComponent = personaIconMap[persona] || Users
                        return (
                          <button
                            key={persona}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setFormData({
                                  ...formData,
                                  targetPersonas: formData.targetPersonas.filter(p => p !== persona)
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  targetPersonas: [...formData.targetPersonas, persona]
                                })
                              }
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 500,
                              fontSize: "14px",
                              lineHeight: "150%",
                              border: isSelected ? "2px solid #004BEC" : "1.5px solid #E5E7EB",
                              backgroundColor: isSelected ? "#E6EDFD" : "#FFFFFF",
                              color: isSelected ? "#004BEC" : "#6B7280",
                              cursor: "pointer",
                              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                              boxShadow: isSelected ? "0 2px 8px rgba(0, 75, 236, 0.15)" : "none",
                            }}
                            onMouseEnter={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = "#004BEC"
                                e.currentTarget.style.backgroundColor = "#F0F5FF"
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = "#E5E7EB"
                                e.currentTarget.style.backgroundColor = "#FFFFFF"
                              }
                            }}
                          >
                            <IconComponent className="h-4 w-4 shrink-0" />
                            <span>{persona}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 9. Agent Demo link */}
                  <div>
                    <Label 
                      htmlFor="demoLink"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: "#111827",
                      }}
                    >
                      Agent Demo link <span style={{ color: "#111827" }}>*</span>
                    </Label>
                    <Input
                      id="demoLink"
                      placeholder="Enter your product name."
                      value={formData.demoLink}
                      onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                      className="mt-2"
                      style={{
                        width: "863px",
                        minWidth: "240px",
                        height: "44px",
                        borderRadius: "4px",
                        paddingTop: "11px",
                        paddingRight: "16px",
                        paddingBottom: "11px",
                        paddingLeft: "16px",
                        border: "1px solid #E5E7EB",
                        borderTop: "1px solid #E5E7EB",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        verticalAlign: "middle",
                        color: "#6B7280",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Capabilities */}
            {currentStep === 2 && (
              <div>
                <div className="space-y-6">
                  {/* Core Capabilities */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label 
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0%",
                          color: "#111827",
                        }}
                      >
                        Core Capabilities
                      </Label>
                      {isLoadingCapabilities && (
                        <span className="text-xs text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                          Loading capabilities...
                        </span>
                      )}
                    </div>
                    {isLoadingCapabilities ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {capabilities.map((capability) => {
                          const isSelected = formData.coreCapabilities.includes(capability.by_capability_id)
                          const IconComponent = capabilityIconMap[capability.by_capability] || BarChart3
                          return (
                            <button
                              key={capability.by_capability_id}
                              type="button"
                              onClick={async () => {
                                if (isSelected) {
                                  // Remove capability
                                  const newCapabilities = formData.coreCapabilities.filter(
                                    id => id !== capability.by_capability_id
                                  )
                                  const newMap = { ...formData.coreCapabilityMap }
                                  delete newMap[capability.by_capability_id]
                                  
                                  // Remove deployment options for this capability
                                  const newDeploymentOptions = formData.deploymentOptions.filter(
                                    opt => opt.capabilityId !== capability.by_capability_id
                                  )
                                  
                                  setFormData({
                                    ...formData,
                                    coreCapabilities: newCapabilities,
                                    coreCapabilityMap: newMap,
                                    deploymentOptions: newDeploymentOptions,
                                  })
                                  
                                  // Remove deployment data
                                  const newDeploymentData = { ...deploymentData }
                                  delete newDeploymentData[capability.by_capability_id]
                                  setDeploymentData(newDeploymentData)
                                } else {
                                  // Add capability
                                  setFormData({
                                    ...formData,
                                    coreCapabilities: [...formData.coreCapabilities, capability.by_capability_id],
                                    coreCapabilityMap: {
                                      ...formData.coreCapabilityMap,
                                      [capability.by_capability_id]: capability.by_capability,
                                    },
                                  })
                                  
                                  // Fetch deployments for this capability
                                  await fetchDeploymentsForCapability(capability.by_capability_id, capability.by_capability)
                                }
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 500,
                                fontSize: "14px",
                                lineHeight: "150%",
                                border: isSelected ? "2px solid #004BEC" : "1.5px solid #E5E7EB",
                                backgroundColor: isSelected ? "#E6EDFD" : "#FFFFFF",
                                color: isSelected ? "#004BEC" : "#6B7280",
                                cursor: "pointer",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                boxShadow: isSelected ? "0 2px 8px rgba(0, 75, 236, 0.15)" : "none",
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.borderColor = "#004BEC"
                                  e.currentTarget.style.backgroundColor = "#F0F5FF"
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.borderColor = "#E5E7EB"
                                  e.currentTarget.style.backgroundColor = "#FFFFFF"
                                }
                              }}
                            >
                              <IconComponent className="h-4 w-4 shrink-0" />
                              <span>{capability.by_capability}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                    {capabilities.length === 0 && !isLoadingCapabilities && (
                      <p className="text-sm text-gray-500 py-4" style={{ fontFamily: "Inter, sans-serif" }}>
                        No capabilities available. Please try again later.
                      </p>
                    )}
                  </div>

                  {/* Deployment Options */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Label
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "150%",
                            letterSpacing: "0%",
                            color: "#111827",
                          }}
                        >
                          Deployment Options
                        </Label>
                        <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
                          Automatically populated based on selected capabilities
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addDeploymentOption}
                        className="text-green-600 border-green-600 hover:bg-green-50 transition-all duration-200"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 500,
                        }}
                      >
                        + Add Manual Option
                      </Button>
                    </div>

                    {/* Loading states for capabilities */}
                    {formData.coreCapabilities.some(id => loadingDeployments[id]) && (
                      <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                          <span className="text-sm text-blue-700" style={{ fontFamily: "Inter, sans-serif" }}>
                            Loading deployment options...
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Group deployments by capability */}
                    {(() => {
                      const groupedByCapability = formData.deploymentOptions.reduce((acc, option, index) => {
                        const key = option.capabilityId || option.capability || 'other'
                        if (!acc[key]) {
                          acc[key] = {
                            capabilityName: option.capability || 'Other',
                            capabilityId: option.capabilityId,
                            options: [],
                          }
                        }
                        acc[key].options.push({ option, index })
                        return acc
                      }, {} as Record<string, { capabilityName: string; capabilityId?: string; options: Array<{ option: DeploymentOption; index: number }> }>)

                      const groups = Object.entries(groupedByCapability)

                      if (groups.length === 0) {
                        return (
                          <div className="text-center py-8 text-gray-500 rounded-lg border-2 border-dashed border-gray-200">
                            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px" }}>
                              No deployment options yet. Select capabilities above to auto-populate options.
                            </p>
                          </div>
                        )
                      }

                      return (
                        <div className="space-y-6">
                          {groups.map(([key, group]) => (
                            <div
                              key={key}
                              className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-all duration-200 hover:shadow-md"
                              style={{
                                borderLeft: "4px solid #004BEC",
                              }}
                            >
                              {/* Capability Header */}
                              <div
                                className="px-4 py-3 flex items-center justify-between"
                                style={{
                                  background: "linear-gradient(135deg, #F0F5FF 0%, #E6EDFD 100%)",
                                  borderBottom: "1px solid #E5E7EB",
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                  <h4
                                    className="font-semibold"
                                    style={{
                                      fontFamily: "Poppins, sans-serif",
                                      fontSize: "15px",
                                      color: "#111827",
                                    }}
                                  >
                                    {group.capabilityName}
                                  </h4>
                                  <span
                                    className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700"
                                    style={{ fontFamily: "Inter, sans-serif" }}
                                  >
                                    {group.options.length} {group.options.length === 1 ? 'option' : 'options'}
                                  </span>
                                </div>
                              </div>

                              {/* Deployment Options for this capability */}
                              <div className="p-4 space-y-3">
                                {group.options.map(({ option, index }) => (
                                  <div
                                    key={index}
                                    className="rounded-lg border border-gray-200 p-4 bg-gray-50 hover:bg-white transition-all duration-200 hover:shadow-sm"
                                  >
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="px-2 py-1 rounded text-xs font-medium"
                                          style={{
                                            fontFamily: "Inter, sans-serif",
                                            backgroundColor: option.serviceProvider === "AWS" ? "#FF9900" :
                                                          option.serviceProvider === "Azure" ? "#0078D4" :
                                                          option.serviceProvider === "GCP" ? "#4285F4" :
                                                          option.serviceProvider === "Open-Source" ? "#28A745" :
                                                          "#6B7280",
                                            color: "#FFFFFF",
                                          }}
                                        >
                                          {option.serviceProvider}
                                        </div>
                                        <h5
                                          className="font-medium"
                                          style={{
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: "14px",
                                            color: "#111827",
                                          }}
                                        >
                                          {option.serviceName || "Service Name"}
                                        </h5>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeDeploymentOption(index)}
                                        className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8 w-8"
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                      <div>
                                        <Label
                                          className="text-xs text-gray-500 mb-1 block"
                                          style={{ fontFamily: "Inter, sans-serif" }}
                                        >
                                          Deployment Type
                                        </Label>
                                        <div className="px-3 py-2 rounded-md bg-white border border-gray-200 text-sm font-medium text-gray-900">
                                          {option.deploymentType || "N/A"}
                                        </div>
                                      </div>
                                      <div>
                                        <Label
                                          className="text-xs text-gray-500 mb-1 block"
                                          style={{ fontFamily: "Inter, sans-serif" }}
                                        >
                                          Cloud Region
                                        </Label>
                                        <div className="px-3 py-2 rounded-md bg-white border border-gray-200 text-sm font-medium text-gray-900">
                                          {option.cloudRegion || "N/A"}
                                        </div>
                                      </div>
                                      <div>
                                        <Label
                                          className="text-xs text-gray-500 mb-1 block"
                                          style={{ fontFamily: "Inter, sans-serif" }}
                                        >
                                          Capability
                                        </Label>
                                        <div className="px-3 py-2 rounded-md bg-white border border-gray-200 text-sm font-medium text-gray-900">
                                          {option.capability || "N/A"}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Editable fields (hidden by default, can be made editable if needed) */}
                                    <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <DropdownWithCustom
                                        label="Service Provider"
                                        value={option.serviceProvider}
                                        onChange={(value) => updateDeploymentOption(index, 'serviceProvider', value)}
                                        options={serviceProviderOptions}
                                        placeholder="Service Provider"
                                      />
                                      <DropdownWithCustom
                                        label="Service Name"
                                        value={option.serviceName}
                                        onChange={(value) => updateDeploymentOption(index, 'serviceName', value)}
                                        options={serviceNameOptions}
                                        placeholder="Service Name"
                                      />
                                      <DropdownWithCustom
                                        label="Deployment Type"
                                        value={option.deploymentType}
                                        onChange={(value) => updateDeploymentOption(index, 'deploymentType', value)}
                                        options={deploymentTypeOptions}
                                        placeholder="Deployment Type"
                                      />
                                      <div>
                                        <Label
                                          htmlFor={`cloudRegion-${index}`}
                                          style={{
                                            fontFamily: "Poppins, sans-serif",
                                            fontWeight: 500,
                                            fontSize: "13px",
                                            color: "#111827",
                                            marginBottom: "4px",
                                            display: "block",
                                          }}
                                        >
                                          Cloud Region
                                        </Label>
                                        <Input
                                          id={`cloudRegion-${index}`}
                                          placeholder="e.g., us-east-1, eu-west-1"
                                          value={option.cloudRegion}
                                          onChange={(e) => updateDeploymentOption(index, 'cloudRegion', e.target.value)}
                                          className="mt-1"
                                          style={{
                                            width: "100%",
                                            height: "40px",
                                            borderRadius: "6px",
                                            padding: "8px 12px",
                                            border: "1.5px solid #E5E7EB",
                                            fontFamily: "Inter, sans-serif",
                                            fontSize: "13px",
                                            transition: "all 0.2s",
                                          }}
                                          onFocus={(e) => {
                                            e.currentTarget.style.borderColor = "#004BEC"
                                            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 75, 236, 0.1)"
                                          }}
                                          onBlur={(e) => {
                                            e.currentTarget.style.borderColor = "#E5E7EB"
                                            e.currentTarget.style.boxShadow = "none"
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    })()}

                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Demo Assets */}
            {currentStep === 3 && (
              <div>
                <div className="space-y-8">
                  {/* Demo preview URLs */}
                  <div>
                    <div 
                      className="flex items-center justify-between mb-2"
                      style={{
                        width: "937px",
                      }}
                    >
                      <Label
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0%",
                          color: "#111827",
                          margin: 0,
                        }}
                      >
                        Demo preview URLs (youtube, video, etc)
                      </Label>
                      <Button
                        type="button"
                        onClick={addDemoLink}
                        disabled={!newDemoLink.trim()}
                        style={{
                          width: "96.99999950526576px",
                          height: "23.99999987759153px",
                          borderRadius: "4px",
                          paddingLeft: "6px",
                          paddingRight: "12px",
                          paddingTop: "0px",
                          paddingBottom: "0px",
                          backgroundColor: "#E6EDFD",
                          color: "#003CBD",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0%",
                          textAlign: "center",
                          border: "none",
                          whiteSpace: "nowrap",
                          cursor: newDemoLink.trim() ? "pointer" : "not-allowed",
                          opacity: 1,
                          transform: "rotate(-0.28deg)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        + Add Url
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {formData.demoLinks.map((link, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder="https://"
                            value={link}
                            onChange={(e) => updateDemoLink(index, e.target.value)}
                            className="flex-1"
                            style={{
                              width: "100%",
                              maxWidth: "940px",
                              minWidth: "240px",
                              height: "44px",
                              borderRadius: "4px",
                              paddingTop: "11px",
                              paddingRight: "16px",
                              paddingBottom: "11px",
                              paddingLeft: "16px",
                              border: "1px solid #E5E7EB",
                              borderTop: "1px solid #E5E7EB",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "150%",
                              letterSpacing: "0%",
                              verticalAlign: "middle",
                              color: link ? "#111827" : "#6B7280",
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDemoLink(index)}
                            className="text-red-600 hover:text-red-800 h-10 w-10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Input
                        placeholder="https://"
                        value={newDemoLink}
                        onChange={(e) => setNewDemoLink(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addDemoLink()
                          }
                        }}
                        style={{
                          width: "937px",
                          minWidth: "240px",
                          height: "44px",
                          borderRadius: "4px",
                          paddingTop: "11px",
                          paddingRight: "16px",
                          paddingBottom: "11px",
                          paddingLeft: "16px",
                          border: "1px solid #E5E7EB",
                          borderTop: "1px solid #E5E7EB",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#6B7280",
                        }}
                      />
                    </div>
                  </div>

                  {/* Agent Demo preview Assets (File Upload) */}
                  <div>
                    <Label
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: "#111827",
                        margin: 0,
                      }}
                    >
                      Agent Demo preview Assets (Images, Video, etc)
                    </Label>
                    <div className="mt-2">
                      <input
                        ref={bulkFileInputRef}
                        type="file"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files
                          if (files) handleBulkFileUpload(files)
                        }}
                        className="hidden"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                      />
                      <div
                        onClick={() => bulkFileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          e.currentTarget.style.borderColor = "#004BEC"
                          e.currentTarget.style.backgroundColor = "#E6EDFD"
                          e.currentTarget.style.borderWidth = "3px"
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E5E7EB"
                          e.currentTarget.style.backgroundColor = "#FAFBFC"
                          e.currentTarget.style.borderWidth = "2px"
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const files = e.dataTransfer.files
                          if (files) handleBulkFileUpload(files)
                          e.currentTarget.style.borderColor = "#E5E7EB"
                          e.currentTarget.style.backgroundColor = "#FAFBFC"
                          e.currentTarget.style.borderWidth = "2px"
                        }}
                        style={{
                          width: "100%",
                          maxWidth: "940px",
                          minWidth: "240px",
                          minHeight: "200px",
                          border: "2px dashed #E5E7EB",
                          borderRadius: "12px",
                          padding: "40px 20px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          backgroundColor: "#FAFBFC",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#004BEC"
                          e.currentTarget.style.backgroundColor = "#F0F5FF"
                          e.currentTarget.style.borderWidth = "2.5px"
                          e.currentTarget.style.transform = "scale(1.01)"
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 75, 236, 0.1)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E5E7EB"
                          e.currentTarget.style.backgroundColor = "#FAFBFC"
                          e.currentTarget.style.borderWidth = "2px"
                          e.currentTarget.style.transform = "scale(1)"
                          e.currentTarget.style.boxShadow = "none"
                        }}
                      >
                        <Image
                          src="/cloud-upload.png"
                          alt="Upload"
                          width={48}
                          height={48}
                          className="mb-4 transition-transform duration-200 hover:scale-110"
                          style={{
                            width: "48px",
                            height: "48px",
                          }}
                          unoptimized
                        />
                        <p 
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 500,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "150%",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "#111827",
                            marginBottom: "4px",
                          }}
                        >
                          Drag & drop files or{" "}
                          <span
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 500,
                              fontStyle: "normal",
                              fontSize: "16px",
                              lineHeight: "150%",
                              letterSpacing: "0%",
                              textAlign: "center",
                              verticalAlign: "middle",
                              color: "#004BEC",
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                          >
                            Choose files
                          </span>
                        </p>
                        <p
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "12px",
                            lineHeight: "150%",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "#6B7280",
                            marginTop: "8px",
                          }}
                        >
                          Supports PDF, Word document file (max. 25MB file size)
                        </p>
                      </div>
                    </div>

                    {/* File Preview */}
                    {formData.bulkFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <Label 
                          className="text-sm font-medium"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "150%",
                            letterSpacing: "0%",
                            color: "#111827",
                          }}
                        >
                          Uploaded Files
                        </Label>
                        <div className="grid gap-2">
                          {formData.bulkFiles.map((fileWithPreview, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
                            >
                              {fileWithPreview.previewUrl ? (
                                <img
                                  src={fileWithPreview.previewUrl}
                                  alt={fileWithPreview.name}
                                  className="h-8 w-8 rounded object-cover"
                                />
                              ) : (
                                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                                  {fileWithPreview.type.startsWith('image/') ? (
                                    <ImageIcon className="h-4 w-4 text-gray-600" />
                                  ) : (
                                    <FileText className="h-4 w-4 text-gray-600" />
                                  )}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {fileWithPreview.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(fileWithPreview.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBulkFile(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Documentation */}
            {currentStep === 4 && (
              <div>
                <div className="space-y-6">
                  <div>
                    <Label 
                      htmlFor="sdkDetails"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: "#111827",
                      }}
                    >
                      SDK Details
                    </Label>
                    <Textarea
                      id="sdkDetails"
                      placeholder="SDK installation and usage instructions"
                      value={formData.sdkDetails}
                      onChange={(e) => setFormData({ ...formData, sdkDetails: e.target.value })}
                      className="mt-2"
                      style={{
                        width: "940px",
                        height: "97px",
                        minWidth: "240px",
                        borderRadius: "4px",
                        paddingTop: "11px",
                        paddingRight: "16px",
                        paddingBottom: "11px",
                        paddingLeft: "16px",
                        border: "1px solid #E5E7EB",
                        borderTop: "1px solid #E5E7EB",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        verticalAlign: "middle",
                        color: "#6B7280",
                      }}
                    />
                  </div>

                  <div>
                    <Label 
                      htmlFor="apiDocumentation"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: "#111827",
                      }}
                    >
                      API Documentation (Swagger)
                    </Label>
                    <Input
                      id="apiDocumentation"
                      placeholder="https://your-swagger-docs.com"
                      value={formData.apiDocumentation}
                      onChange={(e) => setFormData({ ...formData, apiDocumentation: e.target.value })}
                      className="mt-2"
                      style={{
                        width: "937px",
                        minWidth: "240px",
                        height: "44px",
                        borderRadius: "4px",
                        paddingTop: "11px",
                        paddingRight: "16px",
                        paddingBottom: "11px",
                        paddingLeft: "16px",
                        border: "1px solid #E5E7EB",
                        borderTop: "1px solid #E5E7EB",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        verticalAlign: "middle",
                        color: "#6B7280",
                      }}
                    />
                  </div>

                  <div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    style={{
                      width: "940px",
                      height: "130px",
                      opacity: 1,
                    }}
                  >
                    <div>
                      <Label 
                        htmlFor="sampleInput"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0%",
                          color: "#111827",
                        }}
                      >
                        Sample Input
                      </Label>
                      <Textarea
                        id="sampleInput"
                        placeholder="Example input data"
                        value={formData.sampleInput}
                        onChange={(e) => setFormData({ ...formData, sampleInput: e.target.value })}
                        className="mt-2"
                        style={{
                          width: "450px",
                          height: "97px",
                          minWidth: "240px",
                          borderRadius: "4px",
                          paddingTop: "11px",
                          paddingRight: "16px",
                          paddingBottom: "11px",
                          paddingLeft: "16px",
                          border: "1px solid #E5E7EB",
                          borderTop: "1px solid #E5E7EB",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#6B7280",
                        }}
                      />
                    </div>

                    <div>
                      <Label 
                        htmlFor="sampleOutput"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0%",
                          color: "#111827",
                        }}
                      >
                        Sample Output
                      </Label>
                      <Textarea
                        id="sampleOutput"
                        placeholder="Example output data"
                        value={formData.sampleOutput}
                        onChange={(e) => setFormData({ ...formData, sampleOutput: e.target.value })}
                        className="mt-2"
                        style={{
                          width: "450px",
                          height: "97px",
                          minWidth: "240px",
                          borderRadius: "4px",
                          paddingTop: "11px",
                          paddingRight: "16px",
                          paddingBottom: "11px",
                          paddingLeft: "16px",
                          border: "1px solid #E5E7EB",
                          borderTop: "1px solid #E5E7EB",
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#6B7280",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label 
                      htmlFor="securityDetails"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: "#111827",
                      }}
                    >
                      Security Details
                    </Label>
                    <Textarea
                      id="securityDetails"
                      placeholder="Security considerations and best practices"
                      value={formData.securityDetails}
                      onChange={(e) => setFormData({ ...formData, securityDetails: e.target.value })}
                      className="mt-2"
                      style={{
                        width: "940px",
                        height: "97px",
                        minWidth: "240px",
                        borderRadius: "4px",
                        paddingTop: "11px",
                        paddingRight: "16px",
                        paddingBottom: "11px",
                        paddingLeft: "16px",
                        border: "1px solid #E5E7EB",
                        borderTop: "1px solid #E5E7EB",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        verticalAlign: "middle",
                        color: "#6B7280",
                      }}
                    />
                  </div>

                  {/* README File Upload */}
                  <div>
                    <Label
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: "#111827",
                      }}
                    >
                      README File Upload
                    </Label>
                    <div className="mt-2">
                      <input
                        ref={readmeFileInputRef}
                        type="file"
                        accept=".md,.txt,.pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, 'readme')
                        }}
                        className="hidden"
                      />
                      <div
                        onClick={() => readmeFileInputRef.current?.click()}
                        style={{
                          width: "100%",
                          maxWidth: "940px",
                          minWidth: "240px",
                          minHeight: "200px",
                          border: "2px dashed #E5E7EB",
                          borderRadius: "12px",
                          padding: "40px 20px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          backgroundColor: "#FAFBFC",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#004BEC"
                          e.currentTarget.style.backgroundColor = "#F0F5FF"
                          e.currentTarget.style.borderWidth = "2.5px"
                          e.currentTarget.style.transform = "scale(1.01)"
                          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 75, 236, 0.1)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E5E7EB"
                          e.currentTarget.style.backgroundColor = "#FAFBFC"
                          e.currentTarget.style.borderWidth = "2px"
                          e.currentTarget.style.transform = "scale(1)"
                          e.currentTarget.style.boxShadow = "none"
                        }}
                      >
                        <Image
                          src="/cloud-upload.png"
                          alt="Upload"
                          width={48}
                          height={48}
                          className="mb-4 transition-transform duration-200 hover:scale-110"
                          style={{
                            width: "48px",
                            height: "48px",
                          }}
                          unoptimized
                        />
                        <p 
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 600,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "150%",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "#111827",
                            marginBottom: "4px",
                          }}
                        >
                          {formData.readmeFile ? formData.readmeFile.name : "Click to upload README file"}
                        </p>
                        <p
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "12px",
                            lineHeight: "150%",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "#6B7280",
                            marginTop: "8px",
                          }}
                        >
                          Upload a README file to help users understand how to use your agent. Supports markdown, Text,<br />
                          pdf ,Word document file (max. 10MB file size)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Related Files (Links) */}
                  <div>
                    <div 
                      className="flex items-center justify-between mb-2"
                      style={{
                        width: "937px",
                      }}
                    >
                      <Label
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0%",
                          color: "#111827",
                          margin: 0,
                        }}
                      >
                        Additional Related Files (Links)
                      </Label>
                      <Button
                        type="button"
                        onClick={addAdditionalLink}
                        disabled={!newAdditionalLink.trim()}
                        style={{
                          width: "96.99999950526576px",
                          height: "23.99999987759153px",
                          borderRadius: "4px",
                          paddingLeft: "6px",
                          paddingRight: "12px",
                          paddingTop: "0px",
                          paddingBottom: "0px",
                          backgroundColor: "#E6EDFD",
                          color: "#003CBD",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 500,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0%",
                          textAlign: "center",
                          border: "none",
                          whiteSpace: "nowrap",
                          cursor: newAdditionalLink.trim() ? "pointer" : "not-allowed",
                          opacity: 1,
                          transform: "rotate(-0.28deg)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        + Add Url
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {formData.additionalRelatedFiles.map((link, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input
                            placeholder="https://"
                            value={link}
                            onChange={(e) => updateAdditionalLink(index, e.target.value)}
                            className="flex-1"
                            style={{
                              width: "100%",
                              maxWidth: "940px",
                              minWidth: "240px",
                              height: "44px",
                              borderRadius: "4px",
                              paddingTop: "11px",
                              paddingRight: "16px",
                              paddingBottom: "11px",
                              paddingLeft: "16px",
                              border: "1px solid #E5E7EB",
                              borderTop: "1px solid #E5E7EB",
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "150%",
                              letterSpacing: "0%",
                              verticalAlign: "middle",
                              color: link ? "#111827" : "#6B7280",
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAdditionalLink(index)}
                            className="text-red-600 hover:text-red-800 h-10 w-10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Input
                        placeholder="https://"
                        value={newAdditionalLink}
                        onChange={(e) => setNewAdditionalLink(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addAdditionalLink()
                          }
                        }}
                        style={{
                          width: "100%",
                          maxWidth: "940px",
                          minWidth: "240px",
                          height: "44px",
                          borderRadius: "4px",
                          paddingTop: "11px",
                          paddingRight: "16px",
                          paddingBottom: "11px",
                          paddingLeft: "16px",
                          border: "1px solid #E5E7EB",
                          borderTop: "1px solid #E5E7EB",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "150%",
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: newAdditionalLink ? "#111827" : "#6B7280",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Review & Submit */}
            {currentStep === 5 && (
              <div>
                <h2 className="mb-2 text-3xl font-bold">Preview & Submit</h2>
                <p className="mb-8 text-muted-foreground">Preview your agent before submitting</p>

                {submitError && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}

                <OnboardAgentPreview formData={formData} />
              </div>
            )}

            </div>
          </div>
          
          {/* Navigation Buttons with enhanced styling */}
          <div 
            className="sticky bottom-0 mt-12 flex justify-between items-center py-4 border-t border-gray-100"
            style={{
              background: "linear-gradient(to top, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)",
              backdropFilter: "blur(10px)",
              marginLeft: "-42px",
              marginRight: "-42px",
              paddingLeft: "42px",
              paddingRight: "42px",
            }}
          >
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50"
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                color: "#6B7280",
                border: "1px solid #E5E7EB",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#D1D5DB"
                e.currentTarget.style.color = "#374151"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E5E7EB"
                e.currentTarget.style.color = "#6B7280"
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              {currentStep === 1 ? "Cancel" : "Previous"}
            </button>
            
            <Button 
              onClick={handleNext} 
              disabled={isSubmitting}
              className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                minWidth: "200px",
                height: "48px",
                borderRadius: "8px",
                padding: "12px 24px",
                background: isSubmitting 
                  ? "#9CA3AF" 
                  : "linear-gradient(135deg, #181818 0%, #000000 100%)",
                color: "#FFFFFF",
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                border: "none",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: isSubmitting 
                  ? "none" 
                  : "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)"
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  {currentStep === 5 ? "Submit Agent" : "Continue"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


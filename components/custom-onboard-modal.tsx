"use client"

import { useState, useRef } from "react"
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

// Form data interface
interface FormData {
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
  
  // Tab 2: Capabilities
  coreCapabilities: string[]
  
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
  const bulkFileInputRef = useRef<HTMLInputElement>(null)
  const readmeFileInputRef = useRef<HTMLInputElement>(null)
  const [newDemoLink, setNewDemoLink] = useState("")
  const [newAdditionalLink, setNewAdditionalLink] = useState("")
  
  const [formData, setFormData] = useState<FormData>({
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
    coreCapabilities: [],
    
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
      setCurrentStep((currentStep + 1) as Step)
    } else {
      // Submit the form
      await handleSubmit()
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
        capabilities: formData.coreCapabilities.length > 0 ? formData.coreCapabilities.join(", ") : "",
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

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step)
    } else {
      onClose()
    }
  }

  const handleTabClick = (stepNumber: number) => {
    setCurrentStep(stepNumber as Step)
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <button
              onClick={handleBack}
              className="flex items-center"
              style={{
                width: "45px",
                height: "24px",
                borderRadius: "4px",
                gap: "4px",
                fontFamily: "Inter, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "11px",
                lineHeight: "150%",
                letterSpacing: "0px",
                color: "#6B7280",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <ArrowLeft className="h-4 w-4" style={{ color: "#6B7280" }} />
              Back
            </button>
            <h1 
              style={{
                width: "288px",
                height: "34px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "26px",
                lineHeight: "130%",
                letterSpacing: "0px",
                verticalAlign: "middle",
                color: "#00092C",
                margin: 0,
              }}
            >
              Onboard a new agent
            </h1>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Progress Steps */}
        <div 
          style={{
            width: "100%",
            height: "48px",
            padding: "0 42px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            borderBottom: "1px solid #EBEBED",
            marginBottom: "5px",
          }}
        >
          <div className="flex items-center justify-between w-full">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className="flex items-center flex-1"
                style={{
                  height: "48px",
                }}
              >
                {index > 0 && (
                  <div
                    className="mr-2"
                    style={{
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ChevronRight
                      className="text-gray-400"
                      style={{ width: "24px", height: "24px" }}
                    />
                  </div>
                )}
                <button
                  onClick={() => handleTabClick(step.number)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  style={{
                    height: "48px",
                    minWidth: "fit-content",
                  }}
                >
                  <div className="hidden md:block">
                    <div 
                      style={{
                        height: "21px",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: currentStep === step.number ? "#004BEC" : "#6B7280",
                        textAlign: "left",
                      }}
                    >
                      Step {step.number}
                    </div>
                    <div
                      style={{
                        height: "21px",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "150%",
                        letterSpacing: "0%",
                        color: currentStep === step.number ? "#004BEC" : "#9CA3AF",
                        whiteSpace: "nowrap",
                        borderBottom: currentStep === step.number ? "2px solid #004BEC" : "none",
                        paddingBottom: currentStep === step.number ? "2px" : "0",
                        display: "inline-block",
                        textAlign: "left",
                        position: "relative",
                        top: "1px",
                      }}
                    >
                      {step.label}
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div 
          className="flex-1 overflow-y-auto"
          style={{
            paddingLeft: "42px",
            paddingRight: "42px",
            paddingTop: "32px",
            paddingBottom: "32px",
          }}
        >
          <div className="mx-auto max-w-none">
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
                      className="mt-2"
                      style={{
                        width: "100%",
                        maxWidth: "940px",
                        height: "44px",
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
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "150%",
                              letterSpacing: "0%",
                              border: isSelected ? "1px solid #004BEC" : "1px solid #E5E7EB",
                              backgroundColor: isSelected ? "#E6EDFD" : "#FFFFFF",
                              color: isSelected ? "#004BEC" : "#6B7280",
                              cursor: "pointer",
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
                    <div className="flex flex-wrap gap-2">
                      {capabilityOptions.map((capability) => {
                        const isSelected = formData.coreCapabilities.includes(capability)
                        const IconComponent = capabilityIconMap[capability] || BarChart3
                        return (
                          <button
                            key={capability}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setFormData({
                                  ...formData,
                                  coreCapabilities: formData.coreCapabilities.filter(c => c !== capability)
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  coreCapabilities: [...formData.coreCapabilities, capability]
                                })
                              }
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              fontStyle: "normal",
                              fontSize: "14px",
                              lineHeight: "150%",
                              letterSpacing: "0%",
                              border: isSelected ? "1px solid #004BEC" : "1px solid #E5E7EB",
                              backgroundColor: isSelected ? "#E6EDFD" : "#FFFFFF",
                              color: isSelected ? "#004BEC" : "#6B7280",
                              cursor: "pointer",
                            }}
                          >
                            <IconComponent className="h-4 w-4 shrink-0" />
                            <span>{capability}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Deployment Options */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
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
                        Deployment Options
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addDeploymentOption}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        + Add Deployment Option
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {formData.deploymentOptions.map((option, index) => (
                        <div key={index} className="rounded-lg border border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Deployment Option {index + 1}</h4>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeDeploymentOption(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DropdownWithCustom
                              label="Service Provider"
                              value={option.serviceProvider}
                              onChange={(value) => updateDeploymentOption(index, 'serviceProvider', value)}
                              options={serviceProviderOptions}
                              placeholder="e.g., AWS, Azure, Google Cloud"
                            />

                            <DropdownWithCustom
                              label="Service Name"
                              value={option.serviceName}
                              onChange={(value) => updateDeploymentOption(index, 'serviceName', value)}
                              options={serviceNameOptions}
                              placeholder="Service name"
                            />

                            <DropdownWithCustom
                              label="Deployment Type"
                              value={option.deploymentType}
                              onChange={(value) => updateDeploymentOption(index, 'deploymentType', value)}
                              options={deploymentTypeOptions}
                              placeholder="e.g., Docker, Kubernetes"
                            />

                            <div>
                              <Label 
                                htmlFor={`cloudRegion-${index}`}
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
                                Cloud Region
                              </Label>
                              <Input
                                id={`cloudRegion-${index}`}
                                placeholder="e.g., us-east-1, eu-west-1"
                                value={option.cloudRegion}
                                onChange={(e) => updateDeploymentOption(index, 'cloudRegion', e.target.value)}
                                className="mt-2"
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

                            <div className="md:col-span-2">
                              <Label 
                                htmlFor={`capability-${index}`}
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
                                Capability
                              </Label>
                              <Input
                                id={`capability-${index}`}
                                placeholder="Related capability"
                                value={option.capability}
                                onChange={(e) => updateDeploymentOption(index, 'capability', e.target.value)}
                                className="mt-2"
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
                      ))}

                      {formData.deploymentOptions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>No deployment options added yet</p>
                          <p className="text-sm">Click "Add Deployment Option" to get started</p>
                        </div>
                      )}
                    </div>
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
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          const files = e.dataTransfer.files
                          if (files) handleBulkFileUpload(files)
                        }}
                        style={{
                          width: "100%",
                          maxWidth: "940px",
                          minWidth: "240px",
                          minHeight: "200px",
                          border: "2px dashed #E5E7EB",
                          borderRadius: "4px",
                          padding: "40px 20px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          backgroundColor: "#FFFFFF",
                          transition: "border-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#004BEC"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E5E7EB"
                        }}
                      >
                        <Image
                          src="/cloud-upload.png"
                          alt="Upload"
                          width={48}
                          height={48}
                          className="mb-4"
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
                          borderRadius: "4px",
                          padding: "40px 20px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          backgroundColor: "#FFFFFF",
                          transition: "border-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "#004BEC"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "#E5E7EB"
                        }}
                      >
                        <Image
                          src="/cloud-upload.png"
                          alt="Upload"
                          width={48}
                          height={48}
                          className="mb-4"
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

            {/* Navigation Buttons */}
            <div className="mt-12 flex justify-start">
              <Button 
                onClick={handleNext} 
                disabled={isSubmitting}
                style={{
                  width: "217.8447265625px",
                  height: "44px",
                  borderRadius: "4px",
                  paddingTop: "6px",
                  paddingRight: "12px",
                  paddingBottom: "6px",
                  paddingLeft: "12px",
                  backgroundColor: "#181818",
                  color: "#FFFFFF",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "150%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  verticalAlign: "middle",
                  border: "none",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.5 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isSubmitting ? "Submitting..." : currentStep === 5 ? "Submit Agent" : "Next"}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


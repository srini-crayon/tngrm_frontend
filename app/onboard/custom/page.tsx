"use client"

import { useState, useRef } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Label } from "../../../components/ui/label"
import { ArrowLeft, ArrowRight, Check, ChevronRight, X, Upload, FileText, Image as ImageIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "../../../lib/utils"
import { MultiSelectInput } from "../../../components/multi-select-input"
import { DropdownWithCustom } from "../../../components/dropdown-with-custom"
import { useAuthStore } from "../../../lib/store/auth.store"
import { OnboardAgentPreview } from "../../../components/onboard-agent-preview"

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
  targetPersonas: string[]
  keyFeatures: string[]
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
  additionalRelatedFiles: string
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

export default function CustomOnboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const bulkFileInputRef = useRef<HTMLInputElement>(null)
  const readmeFileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState<FormData>({
    // Tab 1: Agent Details
    agentName: "",
    agentDescription: "",
    agentType: "",
    tags: [],
    targetPersonas: [],
    keyFeatures: [],
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
    additionalRelatedFiles: "",
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
        features: formData.keyFeatures.length > 0 ? formData.keyFeatures.join(", ") : "",
        roi: formData.roiInformation,
        demo_link: formData.demoLink,
        capabilities: formData.coreCapabilities.length > 0 ? formData.coreCapabilities.join(", ") : "",
        demo_assets: formData.demoLinks.length > 0 ? formData.demoLinks.join(", ") : "",
        sdk_details: formData.sdkDetails,
        swagger_details: formData.apiDocumentation,
        sample_input: formData.sampleInput,
        sample_output: formData.sampleOutput,
        security_details: formData.securityDetails,
        related_files: formData.additionalRelatedFiles,
        deployments: JSON.stringify(formData.deploymentOptions),
        isv_id: user.user_id,
        // Add file uploads
        demo_files: formData.bulkFiles.length > 0 ? formData.bulkFiles.map(f => f.file) : undefined,
        readme_file: formData.readmeFile ?? undefined,
      }

      // Import agent service and make API call
      const { agentService } = await import("../../../lib/api/agent.service")
      const response = await agentService.onboardAgent(apiData)
      
      console.log("Agent onboarded successfully:", response)
      
      // Redirect to success page
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
      router.back()
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
    setFormData(prev => ({ ...prev, demoLinks: [...prev.demoLinks, ""] }))
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="w-full px-8 md:px-12 lg:px-16 py-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-primary hover:underline cursor-pointer">Agents</span>
              <span>/</span>
              <span>Custom Onboard Agent</span>
            </div>
            <h1 className="text-2xl font-bold">Onboard New Agent</h1>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b bg-gray-50">
        <div className="w-full px-8 md:px-12 lg:px-16 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-1 items-center">
                <button
                  onClick={() => handleTabClick(step.number)}
                  className="flex flex-1 items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                      currentStep === step.number
                        ? "bg-primary text-white"
                        : currentStep > step.number
                          ? "bg-primary text-white"
                          : "bg-gray-200 text-gray-600",
                    )}
                  >
                    {currentStep > step.number ? <Check className="h-4 w-4" /> : step.number}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-xs text-muted-foreground">Step {step.number}</div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        currentStep === step.number ? "text-primary" : "text-gray-600",
                      )}
                    >
                      {step.label}
                    </div>
                  </div>
                </button>
                {index < steps.length - 1 && (
                  <div className="mx-4 flex items-center">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className={`mx-auto ${currentStep === 5 ? 'max-w-none' : 'max-w-3xl'}`}>
          {/* Tab 1: Agent Details */}
          {currentStep === 1 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Agent Details</h2>
              <p className="mb-8 text-muted-foreground">Let's start with the basics about your AI agent</p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="agentName">
                    Agent Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="agentName"
                    placeholder="Enter your agent name"
                    value={formData.agentName}
                    onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="agentDescription">Agent Description</Label>
                  <Textarea
                    id="agentDescription"
                    placeholder="Detailed description of your agent"
                    value={formData.agentDescription}
                    onChange={(e) => setFormData({ ...formData, agentDescription: e.target.value })}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <DropdownWithCustom
                  label="Agent Type"
                  value={formData.agentType}
                  onChange={(value) => setFormData({ ...formData, agentType: value })}
                  options={agentTypeOptions}
                  placeholder="Select agent type"
                />

                <MultiSelectInput
                  label="Tags"
                  value={formData.tags}
                  onChange={(value) => setFormData({ ...formData, tags: value })}
                  options={tagOptions}
                  placeholder="Select or add tags"
                />

                <MultiSelectInput
                  label="Target Personas"
                  value={formData.targetPersonas}
                  onChange={(value) => setFormData({ ...formData, targetPersonas: value })}
                  options={targetPersonaOptions}
                  placeholder="Select target personas"
                />

                <MultiSelectInput
                  label="Key Features"
                  value={formData.keyFeatures}
                  onChange={(value) => setFormData({ ...formData, keyFeatures: value })}
                  options={keyFeatureOptions}
                  placeholder="Select key features"
                />

                <DropdownWithCustom
                  label="Value Proposition"
                  value={formData.valueProposition}
                  onChange={(value) => setFormData({ ...formData, valueProposition: value })}
                  options={valuePropositionOptions}
                  placeholder="Select value proposition"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="roiInformation">
                      ROI Information
                    </Label>
                    <Input
                      id="roiInformation"
                      placeholder="Expected ROI or benefits"
                      value={formData.roiInformation}
                      onChange={(e) => setFormData({ ...formData, roiInformation: e.target.value })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="demoLink">
                      Demo Link
                    </Label>
                    <Input
                      id="demoLink"
                      placeholder="https://your-demo-link.com"
                      value={formData.demoLink}
                      onChange={(e) => setFormData({ ...formData, demoLink: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab 2: Capabilities */}
          {currentStep === 2 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Capabilities</h2>
              <p className="mb-8 text-muted-foreground">What can your AI agent do and what technical features does it offer?</p>

              <div className="space-y-6">
                <MultiSelectInput
                  label="Core Capabilities"
                  value={formData.coreCapabilities}
                  onChange={(value) => setFormData({ ...formData, coreCapabilities: value })}
                  options={capabilityOptions}
                  placeholder="Select core capabilities"
                />

              </div>
            </div>
          )}

          {/* Tab 3: Demo Assets */}
          {currentStep === 3 && (
            <div>
              <h2 className="mb-2 text-3xl font-bold">Demo Assets</h2>
              <p className="mb-8 text-muted-foreground">Provide demo links and upload demo files</p>

              <div className="space-y-6">
                {/* Demo Links */}
                <div>
                  <Label>Demo Links</Label>
                  <div className="mt-2 space-y-3">
                    {formData.demoLinks.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="https://your-demo-link.com"
                          value={link}
                          onChange={(e) => updateDemoLink(index, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeDemoLink(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addDemoLink}
                      className="w-full"
                    >
                      + Add Link
                    </Button>
                  </div>
                </div>

                {/* Bulk File Upload */}
                <div>
                  <Label>Bulk File Upload</Label>
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
                    />
                    <button
                      type="button"
                      onClick={() => bulkFileInputRef.current?.click()}
                      className="w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors"
                    >
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Click to upload multiple files (max 50MB each)</p>
                    </button>
                  </div>

                  {/* File Preview */}
                  {formData.bulkFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <Label className="text-sm font-medium">Uploaded Files</Label>
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
              <h2 className="mb-2 text-3xl font-bold">Documentation</h2>
              <p className="mb-8 text-muted-foreground">Provide technical documentation and deployment information</p>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="sdkDetails">SDK Details</Label>
                  <Textarea
                    id="sdkDetails"
                    placeholder="SDK installation and usage instructions"
                    value={formData.sdkDetails}
                    onChange={(e) => setFormData({ ...formData, sdkDetails: e.target.value })}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <div>
                  <Label htmlFor="apiDocumentation">API Documentation (Swagger)</Label>
                  <Input
                    id="apiDocumentation"
                    placeholder="https://your-swagger-docs.com"
                    value={formData.apiDocumentation}
                    onChange={(e) => setFormData({ ...formData, apiDocumentation: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="sampleInput">Sample Input</Label>
                    <Textarea
                      id="sampleInput"
                      placeholder="Example input data"
                      value={formData.sampleInput}
                      onChange={(e) => setFormData({ ...formData, sampleInput: e.target.value })}
                      className="mt-2 min-h-[120px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sampleOutput">Sample Output</Label>
                    <Textarea
                      id="sampleOutput"
                      placeholder="Example output data"
                      value={formData.sampleOutput}
                      onChange={(e) => setFormData({ ...formData, sampleOutput: e.target.value })}
                      className="mt-2 min-h-[120px]"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="securityDetails">Security Details</Label>
                  <Textarea
                    id="securityDetails"
                    placeholder="Security considerations and best practices"
                    value={formData.securityDetails}
                    onChange={(e) => setFormData({ ...formData, securityDetails: e.target.value })}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                {/* README File Upload */}
                <div>
                  <Label>README File Upload</Label>
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
                    <button
                      type="button"
                      onClick={() => readmeFileInputRef.current?.click()}
                      className="w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors"
                    >
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        {formData.readmeFile ? formData.readmeFile.name : "Click to upload README file"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Markdown, Text, PDF, DOC, DOCX (max 10MB)
                      </p>
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="additionalRelatedFiles">
                    Additional Related Files (Links)
                  </Label>
                  <Textarea
                    id="additionalRelatedFiles"
                    placeholder="Links to additional documentation, guides, or resources (separate from uploaded files)"
                    value={formData.additionalRelatedFiles}
                    onChange={(e) => setFormData({ ...formData, additionalRelatedFiles: e.target.value })}
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                {/* Deployment Options */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label>Deployment Options</Label>
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
                            <Label htmlFor={`cloudRegion-${index}`}>
                              Cloud Region
                            </Label>
                            <Input
                              id={`cloudRegion-${index}`}
                              placeholder="e.g., us-east-1, eu-west-1"
                              value={option.cloudRegion}
                              onChange={(e) => updateDeploymentOption(index, 'cloudRegion', e.target.value)}
                              className="mt-2"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Label htmlFor={`capability-${index}`}>
                              Capability
                            </Label>
                            <Input
                              id={`capability-${index}`}
                              placeholder="Related capability"
                              value={option.capability}
                              onChange={(e) => updateDeploymentOption(index, 'capability', e.target.value)}
                              className="mt-2"
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
          <div className="mt-12 flex justify-between">
            <Button 
              onClick={handleBack} 
              variant="outline"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <Button 
              onClick={handleNext} 
              size="lg" 
              className="bg-black text-white hover:bg-black/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : currentStep === 5 ? "Submit Agent" : "Next"}
              {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

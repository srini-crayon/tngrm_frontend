"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent } from "./ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { CheckCircle, XCircle, ExternalLink, MapPin, Phone, Mail, Globe, Save, Pencil, Upload, X, Plus, FileText } from "lucide-react"
import ReadMore from "./read-more"
import CollapsibleList from "./collapsible-list"
import DemoAssetsViewer from "./demo-assets-viewer"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { useToast } from "../hooks/use-toast"
import { agentService } from "../lib/api/agent.service"
import type { AgentAPIResponse } from "../lib/types/admin.types"
import { DemoAccessLink } from "./demo-access-link"
import { DocumentationSection } from "./documentation-section"

// Types for the full agent details API response
type AgentDetailApiResponse = {
  agent?: {
    agent_id: string
    agent_name?: string
    description?: string
    by_persona?: string
    by_value?: string
    asset_type?: string
    demo_link?: string
    demo_preview?: string
    features?: string
    roi?: string
    tags?: string
    by_capability?: string
    service_provider?: string
  }
  capabilities?: Array<{ serial_id?: string; by_capability?: string }>
  deployments?: Array<{
    by_capability_id?: string
    service_id?: string
    by_capability?: string
    service_provider?: string
    service_name?: string
    deployment?: string
    cloud_region?: string
    deployment_id?: string
    capability_name?: string
  }>
  demo_assets?: Array<{ demo_asset_link?: string; demo_link?: string }>
  documentation?: Array<{ 
    agent_id?: string
    sdk_details?: string
    swagger_details?: string
    sample_input?: string
    sample_output?: string
    security_details?: string
    related_files?: string
    doc_id?: string
  }>
  isv_info?: { 
    isv_id?: string
    isv_name?: string
    isv_address?: string
    isv_domain?: string
    isv_mob_no?: string
    isv_email_no?: string
    mou_file_path?: string
    admin_approved?: string
  }
}

interface AgentPreviewModalProps {
  agent: AgentAPIResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove?: (agent: AgentAPIResponse) => void
  onReject?: () => void
  isEditMode?: boolean
  onSave?: () => void
}

export function AgentPreviewModal({
  agent,
  open,
  onOpenChange,
  onApprove,
  onReject,
  isEditMode = false,
  onSave,
}: AgentPreviewModalProps) {
  const { toast } = useToast()
  const [agentDetails, setAgentDetails] = useState<AgentDetailApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // File upload refs
  const bulkFileInputRef = useRef<HTMLInputElement>(null)
  const readmeFileInputRef = useRef<HTMLInputElement>(null)
  
  // File types
  interface FileWithPreview {
    file: File
    name: string
    size: number
    type: string
    previewUrl?: string
  }
  
  // Form state for editing
  const [formData, setFormData] = useState({
    agent_name: '',
    asset_type: '',
    description: '',
    by_persona: '',
    by_value: '',
    features: '',
    tags: '',
    roi: '',
    demo_link: '',
    demo_links: [] as string[],
    capabilities: [] as string[],
    sdk_details: '',
    swagger_details: '',
    sample_input: '',
    sample_output: '',
    security_details: '',
    related_files: '',
    deploymentOptions: [] as Array<{
      serviceProvider: string
      serviceName: string
      deploymentType: string
      cloudRegion: string
      capability: string
    }>,
    bulkFiles: [] as FileWithPreview[],
    readmeFile: null as File | null,
  })

  // Fetch full agent details when modal opens
  useEffect(() => {
    if (open && agent.agent_id) {
      fetchAgentDetails(agent.agent_id)
    }
  }, [open, agent.agent_id])

  // Initialize form data when agent details are loaded
  useEffect(() => {
    if (agentDetails?.agent && isEditMode) {
      const agentData = agentDetails.agent
      setFormData({
        agent_name: agentData.agent_name || '',
        asset_type: agentData.asset_type || '',
        description: agentData.description || '',
        by_persona: agentData.by_persona || '',
        by_value: agentData.by_value || '',
        features: agentData.features || '',
        tags: agentData.tags || '',
        roi: agentData.roi || '',
        demo_link: agentData.demo_link || '',
        demo_links: agentDetails.demo_assets?.map(a => a.demo_link || a.demo_asset_link).filter((link): link is string => Boolean(link)) || [],
        capabilities: agentDetails.capabilities?.map(c => c.by_capability || '').filter((cap): cap is string => Boolean(cap)) || [],
        sdk_details: agentDetails.documentation?.[0]?.sdk_details || '',
        swagger_details: agentDetails.documentation?.[0]?.swagger_details || '',
        sample_input: agentDetails.documentation?.[0]?.sample_input || '',
        sample_output: agentDetails.documentation?.[0]?.sample_output || '',
        security_details: agentDetails.documentation?.[0]?.security_details || '',
        related_files: agentDetails.documentation?.[0]?.related_files || '',
        deploymentOptions: agentDetails.deployments?.map(d => ({
          serviceProvider: d.service_provider || '',
          serviceName: d.service_name || '',
          deploymentType: d.deployment || '',
          cloudRegion: d.cloud_region || '',
          capability: d.by_capability || d.capability_name || '',
        })) || [],
        bulkFiles: [],
        readmeFile: null,
      })
    }
  }, [agentDetails, isEditMode])

  const fetchAgentDetails = async (agentId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/agents/${agentId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch agent details: ${response.statusText}`)
      }
      const data = await response.json()
      setAgentDetails(data)
    } catch (err: any) {
      console.error('Error fetching agent details:', err)
      setError(err.message || 'Failed to fetch agent details')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (approved: "yes" | "no") => {
    if (approved === "yes") {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      )
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <XCircle className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    )
  }

  const ExpandableAddress = ({ address }: { address: string }) => {
    const [expanded, setExpanded] = useState(false)
    const words = address.split(/\s+/)
    const needsToggle = words.length > 8
    const preview = needsToggle ? words.slice(0, 8).join(" ") + "…" : address

    return (
      <div className="text-sm text-muted-foreground">
        <div style={{ whiteSpace: 'pre-line' }}>
          {expanded ? address : preview}
        </div>
        {needsToggle && (
          <button
            type="button"
            onClick={() => setExpanded(v => !v)}
            className="mt-1 inline-block text-[14px] font-medium"
            style={{ color: "#155EEF" }}
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>
    )
  }

  // Use agent details if available, otherwise fall back to admin agent data
  const agentData = agentDetails?.agent || agent
  const capabilities = agentDetails?.capabilities || []
  const deployments = agentDetails?.deployments || []
  const demoAssets = agentDetails?.demo_assets || []
  const documentation = agentDetails?.documentation?.[0] || {}
  const isvInfo = agentDetails?.isv_info || {}

  // File handling functions
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

  const handleReadmeFileUpload = (file: File) => {
    setFormData(prev => ({ ...prev, readmeFile: file }))
  }

  const addDemoLink = () => {
    setFormData(prev => ({ ...prev, demo_links: [...prev.demo_links, ""] }))
  }

  const updateDemoLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      demo_links: prev.demo_links.map((link, i) => i === index ? value : link)
    }))
  }

  const removeDemoLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      demo_links: prev.demo_links.filter((_, i) => i !== index)
    }))
  }

  const addCapability = () => {
    setFormData(prev => ({ ...prev, capabilities: [...prev.capabilities, ""] }))
  }

  const updateCapability = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.map((cap, i) => i === index ? value : cap)
    }))
  }

  const removeCapability = (index: number) => {
    setFormData(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter((_, i) => i !== index)
    }))
  }

  // Handle save
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const formDataObj = new FormData()

      // Add all text fields
      formDataObj.append('agent_name', formData.agent_name || '')
      formDataObj.append('asset_type', formData.asset_type || '')
      formDataObj.append('description', formData.description || '')
      formDataObj.append('by_persona', formData.by_persona || '')
      formDataObj.append('by_value', formData.by_value || '')
      formDataObj.append('features', formData.features || '')
      formDataObj.append('tags', formData.tags || '')
      formDataObj.append('roi', formData.roi || '')
      formDataObj.append('demo_link', formData.demo_link || '')
      formDataObj.append('demo_assets', formData.demo_links.join(',') || '')
      formDataObj.append('capabilities', formData.capabilities.join(',') || '')
      formDataObj.append('sdk_details', formData.sdk_details || '')
      formDataObj.append('swagger_details', formData.swagger_details || '')
      formDataObj.append('sample_input', formData.sample_input || '')
      formDataObj.append('sample_output', formData.sample_output || '')
      formDataObj.append('security_details', formData.security_details || '')
      formDataObj.append('related_files', formData.related_files || '')
      formDataObj.append('deployments', JSON.stringify(formData.deploymentOptions))
      formDataObj.append('isv_id', agent.isv_id || '')

      // Add file uploads
      if (formData.bulkFiles.length > 0) {
        formData.bulkFiles.forEach((fileWithPreview) => {
          formDataObj.append('demo_files', fileWithPreview.file)
        })
      }

      if (formData.readmeFile) {
        formDataObj.append('readme_file', formData.readmeFile)
      }

      const response = await agentService.updateAgent(agent.agent_id, formDataObj)
      
      toast({
        title: "Success",
        description: response.message || "Agent updated successfully.",
      })
      
      // Refresh agent details
      await fetchAgentDetails(agent.agent_id)
      
      // Call onSave callback if provided
      if (onSave) {
        onSave()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update agent. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Parse comma-separated strings into arrays - use form data if in edit mode
  const getDisplayData = () => {
    if (isEditMode) {
      return {
        categories: formData.tags ? formData.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
        personas: formData.by_persona ? formData.by_persona.split(',').map(s => s.trim()).filter(Boolean) : [],
        valueProps: formData.by_value ? formData.by_value.split(',').map(s => s.trim()).filter(Boolean) : [],
        features: formData.features ? formData.features.split(',').map(s => s.trim()).filter(Boolean) : [],
      }
    }
    return {
      categories: agentData.tags ? agentData.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      personas: agentData.by_persona ? agentData.by_persona.split(',').map(s => s.trim()).filter(Boolean) : [],
      valueProps: agentData.by_value ? agentData.by_value.split(',').map(s => s.trim()).filter(Boolean) : [],
      features: agentData.features ? agentData.features.split(',').map(s => s.trim()).filter(Boolean) : [],
    }
  }

  const { categories, personas, valueProps, features } = getDisplayData()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none !w-[95vw] !h-[95vh] !p-0 overflow-hidden !top-[50%] !left-[50%] !translate-x-[-50%] !translate-y-[-50%] !rounded-lg">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditMode && (
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 px-3 py-1">
                    <Pencil className="h-3 w-3 mr-1.5" />
                    Edit Mode
                  </Badge>
                </div>
              )}
              {isEditMode ? (
                <>
                  <Input
                    value={formData.agent_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, agent_name: e.target.value }))}
                    className="text-4xl font-bold mb-2 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                    placeholder="Enter agent name"
                  />
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                    <span>Agent ID: {agentData.agent_id}</span>
                    {isvInfo.isv_name && <span>ISV: {isvInfo.isv_name}</span>}
                  </div>
                </>
              ) : (
                <>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {agentData.agent_name || 'Unnamed Agent'}
                  </DialogTitle>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                    <span>Agent ID: {agentData.agent_id}</span>
                    {isvInfo.isv_name && <span>ISV: {isvInfo.isv_name}</span>}
                  </div>
                  <div className="mt-2">
                    {getStatusBadge(agent.admin_approved)}
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-8 md:px-12 lg:px-16 py-6 bg-white">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-gray-600">Loading agent details...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => fetchAgentDetails(agent.agent_id)}>
                Retry
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Left Column - Main Content */}
              <div>
                {/* Description */}
                <div className="mb-8">
                  <h2 className="mb-3 text-lg font-semibold">Description</h2>
                  {isEditMode ? (
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[120px] border focus:border-blue-500 focus:ring-blue-500 resize-y"
                      placeholder="Enter agent description..."
                    />
                  ) : (
                    <ReadMore 
                      text={agentData.description || 'No description provided'} 
                      className="mb-6"
                    />
                  )}
                </div>

                {/* Metadata */}
                <div className="mb-8 space-y-3">
                  {/* Categories/Tags */}
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-sm text-[#111827] whitespace-nowrap min-w-[130px]">Categories :</span>
                    {isEditMode ? (
                      <Input
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        className="flex-1 border focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., AI, Automation, Analytics (comma-separated)"
                      />
                    ) : categories.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No categories</p>
                    )}
                  </div>

                  {/* Target Personas */}
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-sm text-[#111827] whitespace-nowrap min-w-[130px]">Target Personas :</span>
                    {isEditMode ? (
                      <Input
                        value={formData.by_persona}
                        onChange={(e) => setFormData(prev => ({ ...prev, by_persona: e.target.value }))}
                        className="flex-1 border focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Developer, Manager, Executive (comma-separated)"
                      />
                    ) : personas.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {personas.map((persona, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {persona}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No personas</p>
                    )}
                  </div>

                  {/* Value Propositions */}
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-sm text-[#111827] whitespace-nowrap min-w-[130px]">Value Propositions :</span>
                    {isEditMode ? (
                      <Input
                        value={formData.by_value}
                        onChange={(e) => setFormData(prev => ({ ...prev, by_value: e.target.value }))}
                        className="flex-1 border focus:border-blue-500 focus:ring-blue-500"
                        placeholder="e.g., Cost Savings, Efficiency, Innovation (comma-separated)"
                      />
                    ) : valueProps.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {valueProps.map((value, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {value}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No value propositions</p>
                    )}
                  </div>

                  {/* Capabilities */}
                  <div className="flex items-start gap-3">
                    <span className="font-semibold text-sm text-[#111827] whitespace-nowrap min-w-[130px]">Capabilities :</span>
                    {isEditMode ? (
                      <div className="flex-1 space-y-2">
                        {formData.capabilities.map((cap, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={cap}
                              onChange={(e) => updateCapability(index, e.target.value)}
                              className="flex-1 border focus:border-blue-500 focus:ring-blue-500"
                              placeholder="Enter capability"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeCapability(index)}
                              className="h-9 w-9"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCapability}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Capability
                        </Button>
                      </div>
                    ) : capabilities.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {capabilities.map((cap, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            {typeof cap === 'object' ? (cap.by_capability || '') : cap}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No capabilities</p>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="features" className="w-full mt-[100px]">
                  {agentData.demo_link && (
                    <div className="mb-6 flex justify-center">
                      {isEditMode ? (
                        <div className="w-full">
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Demo Link</label>
                          <Input
                            value={formData.demo_link}
                            onChange={(e) => setFormData(prev => ({ ...prev, demo_link: e.target.value }))}
                            className="border focus:border-blue-500 focus:ring-blue-500"
                            placeholder="https://example.com/demo"
                          />
                        </div>
                      ) : (
                        <a
                          href={agentData.demo_link}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            width: 120.2935791015625,
                            height: 43.510398864746094,
                            maxWidth: 363.41,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 4,
                            borderWidth: 2,
                            borderStyle: 'solid',
                            borderImage: 'linear-gradient(98.05deg, #E2118E 5.32%, #AAF2FF 27.12%, #1576FF 99.78%) 1',
                            borderImageSlice: 1,
                            borderRadius: 4,
                            paddingTop: 13.26,
                            paddingRight: 17.34,
                            paddingBottom: 13.26,
                            paddingLeft: 17.34,
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                            fontSize: 14,
                            lineHeight: '100%',
                            letterSpacing: '0.5px',
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            backgroundColor: '#000',
                            color: '#fff',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          TRY IT NOW
                        </a>
                      )}
                    </div>
                  )}
                  <TabsList className="w-full justify-start bg-transparent p-0 gap-6 h-12 rounded-none border-0">
                    <TabsTrigger value="features">Features</TabsTrigger>
                    <TabsTrigger value="roi">ROI</TabsTrigger>
                    <TabsTrigger value="deployment">Deployment</TabsTrigger>
                    <TabsTrigger value="docs">Docs</TabsTrigger>
                  </TabsList>
                  <div className="h-px bg-gray-200 -mx-6" />
                  <TabsContent value="features" className="mt-6">
                    {isEditMode ? (
                      <div>
                        <Textarea
                          value={formData.features}
                          onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                          className="min-h-[120px] border focus:border-blue-500 focus:ring-blue-500 resize-y"
                          placeholder="Enter features (one per line or separated by semicolons)"
                        />
                        <p className="text-xs text-gray-500 mt-2">Separate multiple features with semicolons or new lines</p>
                      </div>
                    ) : features.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {features.map((feature, i) => (
                          <li key={i} className="leading-relaxed">{feature}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">Features information is not available for this agent.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="roi" className="mt-6">
                    {isEditMode ? (
                      <Textarea
                        value={formData.roi}
                        onChange={(e) => setFormData(prev => ({ ...prev, roi: e.target.value }))}
                        className="min-h-[120px] border focus:border-blue-500 focus:ring-blue-500 resize-y"
                        placeholder="Enter ROI information (one per line or separated by colons)"
                      />
                    ) : agentData.roi && agentData.roi !== "na" ? (
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        {agentData.roi
                          .replace(/\\n/g, '\n')
                          .split(/[:\n]+/)
                          .map(s => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, ''))
                          .filter(Boolean)
                          .map((item, i) => (
                            <li key={i} className="leading-relaxed">{item}</li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">ROI information is not available for this agent.</p>
                    )}
                  </TabsContent>

                  <TabsContent value="deployment" className="mt-6">
                    {(!agentDetails?.deployments || agentDetails.deployments.length === 0) ? (
                      <p className="text-muted-foreground">No deployment information available.</p>
                    ) : (
                      <div className="w-full">
                        {(() => {
                          const groups: Record<string, typeof agentDetails.deployments> = {}
                          for (const d of (agentDetails.deployments || [])) {
                            const key = d?.service_provider || 'Other'
                            if (!groups[key]) groups[key] = []
                            groups[key].push(d)
                          }
                          const entries = Object.entries(groups)
                          return (
                            <Accordion type="multiple" className="w-full rounded-md border">
                              {entries.map(([provider, items]) => (
                                <AccordionItem key={provider} value={provider} className="px-4">
                                  <AccordionTrigger className="text-sm font-semibold">
                                    {provider}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <div className="grid gap-3 md:grid-cols-2">
                                      {items.map((d, idx) => (
                                        <div key={(d?.service_id || provider) + idx} className="rounded-lg border bg-white p-4">
                                          <div className="mb-1 text-sm font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                            {d?.service_name || 'Service'}
                                          </div>
                                          <div className="mb-3 text-xs text-[#344054]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '150%' }}>
                                            {d?.by_capability || d?.capability_name || 'Capability'}
                                          </div>
                                          <div className="flex flex-wrap items-center gap-2">
                                            <Badge variant="outline">{d?.deployment || 'Cloud/On-Prem'}</Badge>
                                            <Badge variant="default">{d?.cloud_region || 'Regions'}</Badge>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          )
                        })()}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="docs" className="mt-6">
                    {isEditMode ? (
                      <div className="space-y-5">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">SDK Details</label>
                          <Textarea
                            value={formData.sdk_details}
                            onChange={(e) => setFormData(prev => ({ ...prev, sdk_details: e.target.value }))}
                            className="min-h-[100px] border focus:border-blue-500 focus:ring-blue-500 resize-y"
                            placeholder="Enter SDK details and integration instructions..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">API Documentation</label>
                          <Textarea
                            value={formData.swagger_details}
                            onChange={(e) => setFormData(prev => ({ ...prev, swagger_details: e.target.value }))}
                            className="min-h-[100px] border focus:border-blue-500 focus:ring-blue-500 resize-y"
                            placeholder="Enter API documentation URL or details..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Sample Input</label>
                          <Textarea
                            value={formData.sample_input}
                            onChange={(e) => setFormData(prev => ({ ...prev, sample_input: e.target.value }))}
                            className="min-h-[100px] font-mono text-sm border focus:border-blue-500 focus:ring-blue-500 resize-y bg-gray-50"
                            placeholder="Enter sample input (JSON, code, etc.)"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Sample Output</label>
                          <Textarea
                            value={formData.sample_output}
                            onChange={(e) => setFormData(prev => ({ ...prev, sample_output: e.target.value }))}
                            className="min-h-[100px] font-mono text-sm border focus:border-blue-500 focus:ring-blue-500 resize-y bg-gray-50"
                            placeholder="Enter sample output (JSON, code, etc.)"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Security Details</label>
                          <Textarea
                            value={formData.security_details}
                            onChange={(e) => setFormData(prev => ({ ...prev, security_details: e.target.value }))}
                            className="min-h-[100px] border focus:border-blue-500 focus:ring-blue-500 resize-y"
                            placeholder="Enter security details and compliance information..."
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Related Files (Links)</label>
                          <Textarea
                            value={formData.related_files}
                            onChange={(e) => setFormData(prev => ({ ...prev, related_files: e.target.value }))}
                            className="min-h-[100px] border focus:border-blue-500 focus:ring-blue-500 resize-y"
                            placeholder="Links to additional documentation, guides, or resources"
                          />
                        </div>
                        <div>
                          <Label>README File Upload</Label>
                          <div className="mt-2">
                            <input
                              ref={readmeFileInputRef}
                              type="file"
                              accept=".md,.txt,.pdf,.doc,.docx"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleReadmeFileUpload(file)
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
                      </div>
                    ) : agentDetails?.documentation && agentDetails.documentation.length > 0 && agentDetails.documentation[0] ? (
                      <DocumentationSection documentation={agentDetails.documentation[0]} />
                    ) : (
                      <p className="text-muted-foreground">Documentation is not available for this agent.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Right Column - Demo Assets */}
              <div className="space-y-6 pr-6 lg:pr-8">
                {/* Demo Assets */}
                {isEditMode ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Demo Assets</h3>
                    
                    {/* Demo Links */}
                    <div>
                      <Label>Demo Links (URLs)</Label>
                      <div className="mt-2 space-y-2">
                        {formData.demo_links.map((link, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={link}
                              onChange={(e) => updateDemoLink(index, e.target.value)}
                              className="flex-1 border focus:border-blue-500 focus:ring-blue-500"
                              placeholder="https://example.com/demo"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeDemoLink(index)}
                              className="h-9 w-9"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addDemoLink}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Demo Link
                        </Button>
                      </div>
                    </div>

                    {/* File Upload */}
                    <div>
                      <Label>Upload Demo Assets (Files)</Label>
                      <div className="mt-2">
                        <input
                          ref={bulkFileInputRef}
                          type="file"
                          multiple
                          accept="image/*,video/*,.pdf,.doc,.docx"
                          onChange={(e) => {
                            if (e.target.files) handleBulkFileUpload(e.target.files)
                          }}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => bulkFileInputRef.current?.click()}
                          className="w-full rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-gray-400 transition-colors"
                        >
                          <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload demo assets
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Images, Videos, PDF, DOC, DOCX (max 10MB each)
                          </p>
                        </button>
                      </div>
                      
                      {formData.bulkFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
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
                                <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{fileWithPreview.name}</p>
                                <p className="text-xs text-gray-500">{(fileWithPreview.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeBulkFile(index)}
                                className="h-8 w-8"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  demoAssets.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Assets</h3>
                      <DemoAssetsViewer assets={demoAssets} />
                    </div>
                  )
                )}

                {/* Demo Link */}
                {agentData.demo_link && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Link</h3>
                    <DemoAccessLink
                      href={agentData.demo_link}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Demo
                    </DemoAccessLink>
                  </div>
                )}

                {/* ISV Information - Only show in view mode, not in edit mode */}
                {!isEditMode && isvInfo.isv_name && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">ISV Information</h3>
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900">{isvInfo.isv_name}</h4>
                            <p className="text-sm text-gray-600">ISV ID: {isvInfo.isv_id}</p>
                          </div>
                          
                          {isvInfo.isv_address && (
                            <div>
                              <div className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                                <ExpandableAddress address={isvInfo.isv_address} />
                              </div>
                            </div>
                          )}
                          
                          {isvInfo.isv_mob_no && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{isvInfo.isv_mob_no}</span>
                            </div>
                          )}
                          
                          {isvInfo.isv_email_no && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{isvInfo.isv_email_no}</span>
                            </div>
                          )}
                          
                          {isvInfo.isv_domain && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-400" />
                              <a
                                href={`https://${isvInfo.isv_domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                {isvInfo.isv_domain}
                              </a>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className={`px-6 py-4 border-t flex justify-between items-center ${isEditMode ? 'bg-blue-50/50 border-blue-200' : 'bg-gray-50'}`}>
          {isEditMode ? (
            <>
              <div className="text-sm text-gray-600">
                <p className="font-medium">Editing Agent Details</p>
                <p className="text-xs">Make your changes and click Save to update</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSaving}
                  className="min-w-[100px]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
              {onReject && (
                <Button
                  variant="destructive"
                  onClick={onReject}
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              )}
              {onApprove && (
                <Button
                  onClick={() => onApprove(agent)}
                  className="gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

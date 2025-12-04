"use client"

import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent } from "./ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { ExternalLink } from "lucide-react"
import ReadMore from "./read-more"
import CollapsibleList from "./collapsible-list"
import DemoAssetsViewer from "./demo-assets-viewer"

// Import the FormData interface from the onboard page
interface FormData {
  // Tab 1: Agent Details
  agentName: string
  agentDescription: string
  agentType: string
  tags: string[]
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

interface OnboardAgentPreviewProps {
  formData: FormData
}

export function OnboardAgentPreview({ formData }: OnboardAgentPreviewProps) {
  // Transform demo assets data for DemoAssetsViewer
  const demoAssets = [
    ...formData.demoLinks.map(link => ({ demo_link: link })),
    ...formData.bulkFiles
      .filter(f => f.previewUrl)
      .map(f => ({ demo_link: f.previewUrl }))
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full max-w-none">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900">
              {formData.agentName || 'Unnamed Agent'}
            </h3>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
              <span>Agent Type: {formData.agentType || 'Not specified'}</span>
              <span>Value Proposition: {formData.valueProposition || 'Not specified'}</span>
            </div>
            <div className="mt-2">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                Draft
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <ReadMore 
                text={formData.agentDescription || 'No description provided'} 
                className="text-gray-700"
              />
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              {/* Tags */}
              {formData.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Personas */}
              {formData.targetPersonas.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Target Personas</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.targetPersonas.map((persona, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {persona}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Value Propositions */}
              {formData.valueProposition && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Value Propositions</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {formData.valueProposition}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="roi">ROI</TabsTrigger>
                <TabsTrigger value="deployment">Deployment</TabsTrigger>
                <TabsTrigger value="docs">Docs</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Key Features</h4>
                    {formData.keyFeatures.trim() ? (
                      <CollapsibleList items={formData.keyFeatures.split(/[;,]|\n/).map(f => f.trim()).filter(f => f.length > 0)} />
                    ) : (
                      <p className="text-gray-500 italic">No features specified</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="roi" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">ROI Information</h4>
                    {formData.roiInformation ? (
                      <ReadMore text={formData.roiInformation} className="text-gray-700" />
                    ) : (
                      <p className="text-gray-500 italic">No ROI information provided</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deployment" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Deployment Options</h4>
                    {formData.deploymentOptions.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {formData.deploymentOptions.map((option, index) => (
                          <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-sm">
                              {option.serviceProvider} - {option.serviceName}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-gray-600">
                              <div className="space-y-2">
                                <p><strong>Service Provider:</strong> {option.serviceProvider}</p>
                                <p><strong>Service Name:</strong> {option.serviceName}</p>
                                <p><strong>Deployment Type:</strong> {option.deploymentType}</p>
                                <p><strong>Cloud Region:</strong> {option.cloudRegion}</p>
                                <p><strong>Capability:</strong> {option.capability}</p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <p className="text-gray-500 italic">No deployment options available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="docs" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {formData.sdkDetails && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">SDK Details</h5>
                          <ReadMore text={formData.sdkDetails} className="text-gray-600" />
                        </div>
                      )}
                      {formData.apiDocumentation && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">API Documentation</h5>
                          <a
                            href={formData.apiDocumentation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {formData.apiDocumentation}
                          </a>
                        </div>
                      )}
                      {formData.sampleInput && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Sample Input</h5>
                          <div className="bg-gray-50 rounded-lg p-3 text-sm font-mono text-gray-800">
                            {formData.sampleInput}
                          </div>
                        </div>
                      )}
                      {formData.sampleOutput && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Sample Output</h5>
                          <div className="bg-gray-50 rounded-lg p-3 text-sm font-mono text-gray-800">
                            {formData.sampleOutput}
                          </div>
                        </div>
                      )}
                      {formData.securityDetails && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Security Details</h5>
                          <ReadMore text={formData.securityDetails} className="text-gray-600" />
                        </div>
                      )}
                      {formData.additionalRelatedFiles && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Additional Related Files</h5>
                          <ReadMore text={formData.additionalRelatedFiles} className="text-gray-600" />
                        </div>
                      )}
                      {!formData.sdkDetails && !formData.apiDocumentation && 
                       !formData.sampleInput && !formData.sampleOutput && 
                       !formData.securityDetails && !formData.additionalRelatedFiles && (
                        <p className="text-gray-500 italic">No documentation available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Demo Assets and Additional Info */}
          <div className="space-y-6 lg:col-span-1">
            {/* Demo Assets */}
            {demoAssets.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Assets</h3>
                <DemoAssetsViewer assets={demoAssets} />
              </div>
            )}

            {/* Demo Link */}
            {formData.demoLink && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Link</h3>
                <a
                  href={formData.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Demo
                </a>
              </div>
            )}

            {/* Core Capabilities */}
            {formData.coreCapabilities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.coreCapabilities.map((capability, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded Files Summary */}
            {formData.bulkFiles.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
                <div className="space-y-2">
                  {formData.bulkFiles.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      <span className="font-medium">{file.name}</span>
                      <span className="text-gray-500 ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* README File */}
            {formData.readmeFile && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">README File</h3>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{formData.readmeFile.name}</span>
                  <span className="text-gray-500 ml-2">({(formData.readmeFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

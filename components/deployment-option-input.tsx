"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Trash2, Plus } from "lucide-react"
import type { DeploymentOption } from "../lib/types/agent.types"

// Dropdown options
const serviceProviderOptions = ["AWS", "Azure", "GCP", "Open-Source", "SaaS"]

const serviceNameOptions = [
  "ABBYY FlexiCapture",
  "Amazon Athena",
  "Amazon Chime SDK Amazon Transcribe",
  "Amazon Comprehend",
  "Amazon EMR",
  "Amazon Kendra",
  "Amazon Kinesis Video Streams",
  "Amazon Lex",
  "Amazon Polly",
  "Amazon Redshift",
  "Amazon Rekognition Video",
  "Amazon Textract",
  "Amazon Transcribe",
  "Anthropic Claude",
  "Apache Spark",
  "AssemblyAI",
  "Azure AI Bot Service",
  "Azure AI Document Intelligence",
  "Azure AI Search",
  "Azure AI Speech",
  "Azure AI Video Indexer",
  "Azure Communication Services",
  "Azure Databricks",
  "Azure Media Services",
  "Azure OpenAI Service",
  "Azure Synapse Analytics",
  "BigQuery",
  "Botpress",
  "Camelot",
  "Cloud Speech-to-Text",
  "Cloud Video Intelligence API",
  "Coqui STT",
  "Dask",
  "Databricks (non-AWS)",
  "Dataproc",
  "DeepDoctection",
  "Deepgram Video API",
  "Detectron2",
  "Dialogflow",
  "Diffbot",
  "DocMind AI",
  "DocQuery",
  "Docling",
  "Document AI",
  "Excalibur",
  "GPT-4 Open-Source Variants",
  "Google Meet",
  "Grobid",
  "Haystack",
  "Import.io",
  "LangChain",
  "LayoutLMv3",
  "Media CDN",
  "MediaPipe",
  "Milvus",
  "OpenAI GPT APIs",
  "OpenAI Whisper (open-source variant)",
  "OpenAssistant",
  "OpenCV",
  "OpenSemanticSearch",
  "Pandas",
  "Pinecone",
  "PyTorchVideo",
  "Qdrant",
  "Rasa",
  "Rev.ai",
  "Rossum",
  "Snowflake (multi-cloud)",
  "TableFormer",
  "Tesseract OCR",
  "Vaex",
  "Vertex AI Search and Conversation",
  "Vosk",
  "Weaviate",
  "Zubtitle"
]

const deploymentTypeOptions = ["Cloud", "On-Prem"]

interface DeploymentOptionInputProps {
  deployments: DeploymentOption[]
  onChange: (deployments: DeploymentOption[]) => void
}

export function DeploymentOptionInput({ deployments, onChange }: DeploymentOptionInputProps) {
  const addDeployment = () => {
    onChange([...deployments, { 
      service_provider: "", 
      service_name: "", 
      deployment_type: "", 
      cloud_region: "", 
      capability: "" 
    }])
  }

  const removeDeployment = (index: number) => {
    onChange(deployments.filter((_, i) => i !== index))
  }

  const updateDeployment = (index: number, field: keyof DeploymentOption, value: string) => {
    const updated = [...deployments]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Deployment Options</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDeployment}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Deployment Option
        </Button>
      </div>

      {deployments.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500">No deployment options added yet</p>
          <p className="text-xs text-gray-400">Click "Add Deployment Option" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deployments.map((deployment, index) => (
            <div key={index} className="rounded-lg border bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Deployment Option {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDeployment(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor={`service-provider-${index}`} className="text-xs">Service Provider</Label>
                  <Select
                    value={deployment.service_provider}
                    onValueChange={(value) => updateDeployment(index, "service_provider", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select service provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceProviderOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor={`service-name-${index}`} className="text-xs">Service Name</Label>
                  <Select
                    value={deployment.service_name}
                    onValueChange={(value) => updateDeployment(index, "service_name", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select service name" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceNameOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor={`deployment-type-${index}`} className="text-xs">Deployment Type</Label>
                  <Select
                    value={deployment.deployment_type}
                    onValueChange={(value) => updateDeployment(index, "deployment_type", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select deployment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {deploymentTypeOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor={`cloud-region-${index}`} className="text-xs">Cloud Region</Label>
                  <Input
                    id={`cloud-region-${index}`}
                    placeholder="e.g., us-east-1, eu-west-1"
                    value={deployment.cloud_region}
                    onChange={(e) => updateDeployment(index, "cloud_region", e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="md:col-span-2 lg:col-span-1">
                  <Label htmlFor={`capability-${index}`} className="text-xs">Capability</Label>
                  <Input
                    id={`capability-${index}`}
                    placeholder="Related capability"
                    value={deployment.capability}
                    onChange={(e) => updateDeployment(index, "capability", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

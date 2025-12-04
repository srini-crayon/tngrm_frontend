"use client"

import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { Separator } from "./ui/separator"
import { DemoPreviewGallery } from "./demo-preview-gallery"
import { ExternalLink, CheckCircle, XCircle } from "lucide-react"
import type { AgentAPIResponse } from "../lib/types/admin.types"
import { DemoAccessLink } from "./demo-access-link"

interface AgentDetailsDrawerProps {
  agent: AgentAPIResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (agent: AgentAPIResponse) => void | Promise<void>
  onReject: () => void
}

export function AgentDetailsDrawer({
  agent,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: AgentDetailsDrawerProps) {
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto pt-2 pb-2">
        <SheetHeader className="space-y-1 ">
          <div className="flex items-start justify-between">
            <div>
              <SheetTitle className="text-2xl">{agent.agent_name}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Agent ID: {agent.agent_id} | ISV ID: {agent.isv_id}
              </p>
              <div className="mt-2">
                {getStatusBadge(agent.admin_approved)}
              </div>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="mb-6 text-base font-semibold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Basic Information
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Asset Type</label>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                    {agent.asset_type || (
                      <span className="text-gray-400 italic">Not specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Value Proposition</label>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                    {agent.by_value || (
                      <span className="text-gray-400 italic">Not specified</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Agent Description</label>
                <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 min-h-[100px] whitespace-pre-wrap">
                  {agent.description || (
                    <span className="text-gray-400 italic">No description provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Tags */}
          {agent.tags && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-6 text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Tags
              </h3>
              <div className="flex flex-wrap gap-3">
                {agent.tags.split(',').map((tag, index) => (
                  <Badge key={index} variant="secondary" className="gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 border-purple-200">
                    <span className="text-base">🏷️</span>
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Target Personas */}
          {agent.by_persona && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-6 text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Target Personas
              </h3>
              <div className="flex flex-wrap gap-3">
                {agent.by_persona.split(',').map((persona, index) => (
                  <Badge key={index} variant="secondary" className="gap-2 px-3 py-1.5 bg-green-50 text-green-700 border-green-200">
                    <span className="text-base">👨‍💻</span>
                    {persona.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {agent.features && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-6 text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Features
              </h3>
              <div className="flex flex-wrap gap-3">
                {agent.features.split(',').map((feature, index) => (
                  <Badge key={index} variant="secondary" className="gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 border-orange-200">
                    <span className="text-base">⚡</span>
                    {feature.trim()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-8" />

          {/* ROI Information */}
          {agent.roi && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-6 text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                ROI Information
              </h3>
              <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                {agent.roi}
              </div>
            </div>
          )}

          {/* Demo Link */}
          {agent.demo_link && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-6 text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Demo Link
              </h3>
              <div className="flex items-center gap-2">
                <DemoAccessLink
                  href={agent.demo_link}
                  className="text-blue-600 hover:text-blue-800 underline flex items-center gap-2 font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  {agent.demo_link}
                </DemoAccessLink>
              </div>
            </div>
          )}

          {/* Demo Preview Gallery */}
          {agent.demo_preview && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-6 text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                Demo Preview
              </h3>
              <DemoPreviewGallery demoPreview={agent.demo_preview} />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3 px-2 pb-2">
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onReject}>
            Reject
          </Button>
          <Button className="flex-1 bg-black hover:bg-black/90" onClick={() => onApprove(agent)}>
            Approve Agent
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

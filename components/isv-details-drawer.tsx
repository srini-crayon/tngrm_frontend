"use client"

import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Separator } from "./ui/separator"
import { FileText, CheckCircle, XCircle, Edit, Users } from "lucide-react"
import type { ISVAPIResponse } from "../lib/types/admin.types"

interface ISVDetailsModalProps {
  isv: ISVAPIResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (isv: ISVAPIResponse) => void | Promise<void>
  onReject: () => void
  onEdit: () => void
}

export function ISVDetailsModal({
  isv,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onEdit,
}: ISVDetailsModalProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="space-y-1">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{isv.isv_name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                ISV ID: {isv.isv_id}
              </p>
              <div className="mt-2">
                {getStatusBadge(isv.admin_approved)}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              onClick={onEdit}
            >
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-6">
          <div className="space-y-8">
            {/* Agent Statistics - Prominently displayed */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="mb-4 text-base font-semibold text-blue-900 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Agent Statistics
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl font-bold text-blue-900 mb-1">{isv.agent_count}</div>
                  <div className="text-sm text-blue-700 font-medium">Total Agents</div>
                </div>
                <div className="text-center bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-1">{isv.approved_agent_count}</div>
                  <div className="text-sm text-green-700 font-medium">Approved Agents</div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-6 text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Contact Information
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                    {isv.isv_email_no || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Mobile Number</label>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                    {isv.isv_mob_no || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Company Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="mb-6 text-base font-semibold text-gray-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Company Information
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Domain</label>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                    {isv.isv_domain || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 min-h-[100px] whitespace-pre-wrap">
                    {isv.isv_address || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* MOU File */}
            {isv.mou_file_path && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h3 className="mb-6 text-base font-semibold text-gray-900 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  MOU Document
                </h3>
                <div className="flex items-center justify-between bg-gray-50 rounded-lg border border-gray-200 px-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500 shadow-sm">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 block">
                        {isv.mou_file_path.split('/').pop() || "mou.pdf"}
                      </span>
                      <span className="text-xs text-gray-500">Document file</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    onClick={() => window.open(isv.mou_file_path, '_blank')}
                  >
                    View Document
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onReject}>
            Reject
          </Button>
          <Button className="bg-black hover:bg-black/90" onClick={() => onApprove(isv)}>
            Approve ISV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

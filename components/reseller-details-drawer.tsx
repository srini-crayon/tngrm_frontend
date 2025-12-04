"use client"

import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Separator } from "./ui/separator"
import { ImageIcon, CheckCircle, XCircle, Edit } from "lucide-react"
import type { ResellerAPIResponse } from "../lib/types/admin.types"

interface ResellerDetailsModalProps {
  reseller: ResellerAPIResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: (reseller: ResellerAPIResponse) => void | Promise<void>
  onReject: () => void
  onEdit: () => void
}

export function ResellerDetailsModal({
  reseller,
  open,
  onOpenChange,
  onApprove,
  onReject,
  onEdit,
}: ResellerDetailsModalProps) {
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
              <DialogTitle className="text-2xl">{reseller.reseller_name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Reseller ID: {reseller.reseller_id}
              </p>
              <div className="mt-2">
                {getStatusBadge(reseller.admin_approved)}
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
                    {reseller.reseller_email_no || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Mobile Number</label>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                    {reseller.reseller_mob_no || (
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
                    {reseller.reseller_domain || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Whitelisted Domain</label>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900">
                    {reseller.whitelisted_domain || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                  <div className="bg-gray-50 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-900 min-h-[100px] whitespace-pre-wrap">
                    {reseller.reseller_address || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={onReject}>
            Reject
          </Button>
          <Button className="bg-black hover:bg-black/90" onClick={() => onApprove(reseller)}>
            Approve Reseller
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

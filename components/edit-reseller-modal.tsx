"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useToast } from "../hooks/use-toast"
import { adminService } from "../lib/api/admin.service"
import type { ResellerAPIResponse, UpdateResellerRequest } from "../lib/types/admin.types"

interface EditResellerModalProps {
  reseller: ResellerAPIResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditResellerModal({ reseller, open, onOpenChange, onSuccess }: EditResellerModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    reseller_name: "",
    reseller_email_no: "",
    reseller_address: "",
    reseller_domain: "",
    reseller_mob_no: "",
    whitelisted_domain: "",
    admin_approved: "no" as "yes" | "no"
  })

  // Initialize form data when modal opens
  useEffect(() => {
    if (open && reseller) {
      setFormData({
        reseller_name: reseller.reseller_name || "",
        reseller_email_no: reseller.reseller_email_no || "",
        reseller_address: reseller.reseller_address || "",
        reseller_domain: reseller.reseller_domain || "",
        reseller_mob_no: reseller.reseller_mob_no || "",
        whitelisted_domain: reseller.whitelisted_domain || "",
        admin_approved: reseller.admin_approved || "no"
      })
    }
  }, [open, reseller])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.reseller_name.trim() || !formData.reseller_email_no.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and Email are required fields.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const updateData: UpdateResellerRequest = {
        reseller_name: formData.reseller_name.trim(),
        reseller_email: formData.reseller_email_no.trim(),
        reseller_address: formData.reseller_address.trim() || undefined,
        reseller_domain: formData.reseller_domain.trim() || undefined,
        reseller_mob_no: formData.reseller_mob_no.trim() || undefined,
        whitelisted_domain: formData.whitelisted_domain.trim() || undefined,
        admin_approved: formData.admin_approved
      }

      await adminService.updateReseller(reseller.reseller_id, updateData)
      
      toast({
        title: "Success",
        description: "Reseller updated successfully."
      })
      
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update Reseller. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Reseller: {reseller.reseller_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reseller_name">
                  Reseller Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="reseller_name"
                  value={formData.reseller_name}
                  onChange={(e) => handleInputChange("reseller_name", e.target.value)}
                  placeholder="Enter reseller name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="reseller_email_no">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="reseller_email_no"
                  type="email"
                  value={formData.reseller_email_no}
                  onChange={(e) => handleInputChange("reseller_email_no", e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reseller_mob_no">Mobile Number</Label>
              <Input
                id="reseller_mob_no"
                type="tel"
                value={formData.reseller_mob_no}
                onChange={(e) => handleInputChange("reseller_mob_no", e.target.value)}
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Company Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reseller_domain">Domain</Label>
                <Input
                  id="reseller_domain"
                  value={formData.reseller_domain}
                  onChange={(e) => handleInputChange("reseller_domain", e.target.value)}
                  placeholder="Enter domain"
                />
              </div>

              <div>
                <Label htmlFor="whitelisted_domain">Whitelisted Domain</Label>
                <Input
                  id="whitelisted_domain"
                  value={formData.whitelisted_domain}
                  onChange={(e) => handleInputChange("whitelisted_domain", e.target.value)}
                  placeholder="Enter whitelisted domain"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reseller_address">Address</Label>
              <Textarea
                id="reseller_address"
                value={formData.reseller_address}
                onChange={(e) => handleInputChange("reseller_address", e.target.value)}
                placeholder="Enter company address"
                rows={3}
              />
            </div>
          </div>

          {/* Approval Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Approval Status</h3>
            
            <div>
              <Label htmlFor="admin_approved">Admin Approval</Label>
              <Select
                value={formData.admin_approved}
                onValueChange={(value: "yes" | "no") => handleInputChange("admin_approved", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Approved</SelectItem>
                  <SelectItem value="no">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-black hover:bg-black/90"
            >
              {isLoading ? "Updating..." : "Update Reseller"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

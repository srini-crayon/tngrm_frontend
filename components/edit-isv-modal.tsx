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
import type { ISVAPIResponse, UpdateISVRequest } from "../lib/types/admin.types"

interface EditISVModalProps {
  isv: ISVAPIResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditISVModal({ isv, open, onOpenChange, onSuccess }: EditISVModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    isv_name: "",
    isv_email_no: "",
    isv_address: "",
    isv_domain: "",
    isv_mob_no: "",
    admin_approved: "no" as "yes" | "no"
  })

  // Initialize form data when modal opens
  useEffect(() => {
    if (open && isv) {
      setFormData({
        isv_name: isv.isv_name || "",
        isv_email_no: isv.isv_email_no || "",
        isv_address: isv.isv_address || "",
        isv_domain: isv.isv_domain || "",
        isv_mob_no: isv.isv_mob_no || "",
        admin_approved: isv.admin_approved || "no"
      })
    }
  }, [open, isv])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.isv_name.trim() || !formData.isv_email_no.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and Email are required fields.",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      const updateData: UpdateISVRequest = {
        isv_name: formData.isv_name.trim(),
        isv_email: formData.isv_email_no.trim(),
        isv_address: formData.isv_address.trim() || undefined,
        isv_domain: formData.isv_domain.trim() || undefined,
        isv_mob_no: formData.isv_mob_no.trim() || undefined,
        admin_approved: formData.admin_approved
      }

      await adminService.updateISV(isv.isv_id, updateData)
      
      toast({
        title: "Success",
        description: "ISV updated successfully."
      })
      
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update ISV. Please try again.",
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
          <DialogTitle>Edit ISV: {isv.isv_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="isv_name">
                  ISV Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="isv_name"
                  value={formData.isv_name}
                  onChange={(e) => handleInputChange("isv_name", e.target.value)}
                  placeholder="Enter ISV name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="isv_email_no">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="isv_email_no"
                  type="email"
                  value={formData.isv_email_no}
                  onChange={(e) => handleInputChange("isv_email_no", e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="isv_mob_no">Mobile Number</Label>
              <Input
                id="isv_mob_no"
                type="tel"
                value={formData.isv_mob_no}
                onChange={(e) => handleInputChange("isv_mob_no", e.target.value)}
                placeholder="Enter mobile number"
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Company Information</h3>
            
            <div>
              <Label htmlFor="isv_domain">Domain</Label>
              <Input
                id="isv_domain"
                value={formData.isv_domain}
                onChange={(e) => handleInputChange("isv_domain", e.target.value)}
                placeholder="Enter domain"
              />
            </div>

            <div>
              <Label htmlFor="isv_address">Address</Label>
              <Textarea
                id="isv_address"
                value={formData.isv_address}
                onChange={(e) => handleInputChange("isv_address", e.target.value)}
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
              {isLoading ? "Updating..." : "Update ISV"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

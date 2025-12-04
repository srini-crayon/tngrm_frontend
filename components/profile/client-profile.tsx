"use client"

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card } from '../ui/card'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { ProfileService } from '../../lib/api/profile.service'
import { ClientProfile, ClientProfileUpdate } from '../../lib/types/profile.types'
import { useToast } from '../../hooks/use-toast'
import { Edit, Save, X, Lock } from 'lucide-react'

interface ClientProfileComponentProps {
  clientId: string
}

export function ClientProfileComponent({ clientId }: ClientProfileComponentProps) {
  const [profile, setProfile] = useState<ClientProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState<ClientProfileUpdate>({
    name: '',
    company: '',
    contact_number: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [clientId])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await ProfileService.fetchClientProfile(clientId)
      setProfile(data)
      setFormData({
        name: data.name || '',
        company: data.company || '',
        contact_number: data.contact_number || '',
      })
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const updatedProfile = await ProfileService.updateClientProfile(clientId, formData)
      setProfile(updatedProfile)
      setIsEditing(false)
      toast({
        description: "Profile updated successfully",
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        company: profile.company || '',
        contact_number: profile.contact_number || '',
      })
    }
    setIsEditing(false)
  }

  const getInitials = (name: string) => {
    if (!name) return 'CL'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchProfile}>Try Again</Button>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <p className="text-sm text-gray-600">Home &gt; View Profile</p>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Personal Details</h1>
          <p className="text-gray-600">Account Information for the enterprise users</p>
        </div>
        <Button variant="ghost" size="sm">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Avatar */}
      <div className="flex justify-center mb-8">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="bg-green-100 text-green-800 text-2xl font-bold">
            {getInitials(profile.name || 'Client')}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Profile Form */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
              />
            ) : (
              <Input value={profile.name || ''} readOnly className="bg-gray-50" />
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              value={profile.email || ''} 
              readOnly 
              className="bg-gray-50" 
            />
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="company">Company</Label>
            {isEditing ? (
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company Name"
              />
            ) : (
              <Input value={profile.company || ''} readOnly className="bg-gray-50" />
            )}
          </div>

          {/* Contact Number */}
          <div>
            <Label htmlFor="contact_number">Contact Number</Label>
            {isEditing ? (
              <Input
                id="contact_number"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                placeholder="+91 9876543210"
              />
            ) : (
              <Input value={profile.contact_number || ''} readOnly className="bg-gray-50" />
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password"
                type="password"
                value="************" 
                readOnly 
                className="bg-gray-50 pr-10" 
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2 text-blue-600 hover:text-blue-700"
              >
                Reset Password
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

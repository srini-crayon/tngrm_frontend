"use client"

import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { ProfileService } from '../../lib/api/profile.service'
import { ClientProfile, ClientProfileUpdate } from '../../lib/types/profile.types'
import { useToast } from '../../hooks/use-toast'
import { Edit, Save } from 'lucide-react'

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

  // Mock preferred tech stack - this would come from the profile data
  const preferredTechStack = ['AWS', 'Azure']

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Personal Details</h1>
        <p className="text-gray-600">Account Information for the individual users</p>
      </div>

      {/* Profile Form */}
      <div className="space-y-6">
        {/* Avatar - Above Name */}
        <div className="flex justify-start">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="bg-yellow-400 text-white text-2xl font-bold">
              {getInitials(profile.name || 'Client')}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Name */}
        <div>
          <Label htmlFor="name" className="text-gray-900 font-medium mb-2 block">Name</Label>
            {isEditing ? (
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
                className="bg-white border-gray-300"
              />
            ) : (
              <Input 
                value={profile.name || ''} 
                readOnly 
                className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed" 
              />
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-gray-900 font-medium mb-2 block">Email</Label>
            <Input 
              id="email"
              value={profile.email || ''} 
              readOnly 
              className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed" 
            />
          </div>

          {/* Company */}
          <div>
            <Label htmlFor="company" className="text-gray-900 font-medium mb-2 block">Company</Label>
            {isEditing ? (
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company Name"
                className="bg-white border-gray-300"
              />
            ) : (
              <Input 
                value={profile.company || ''} 
                readOnly 
                className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed" 
              />
            )}
          </div>

          {/* Contact Number */}
          <div>
            <Label htmlFor="contact_number" className="text-gray-900 font-medium mb-2 block">Contact Number</Label>
            {isEditing ? (
              <Input
                id="contact_number"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                placeholder="+91 9876543210"
                className="bg-white border-gray-300"
              />
            ) : (
              <Input 
                value={profile.contact_number || ''} 
                readOnly 
                className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed" 
              />
            )}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-gray-900 font-medium mb-2 block">Password</Label>
            <Input 
              id="password"
              type="password"
              value="************" 
              readOnly 
              className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed" 
            />
            <Link 
              href="/auth/reset-password" 
              className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
            >
              Reset Password
            </Link>
          </div>

          {/* Preferred Text Stack */}
          <div>
            <Label className="text-gray-900 font-medium mb-2 block">Preferred Text Stack</Label>
            <div className="flex gap-2 flex-wrap">
              {preferredTechStack.map((stack) => (
                <span
                  key={stack}
                  className="px-3 py-1 bg-gray-50 border border-gray-200 rounded text-gray-700 text-sm"
                >
                  {stack}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isEditing ? (
              <>
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-gray-800 hover:bg-gray-900 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-gray-800 hover:bg-gray-900 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            )}
          </div>
      </div>
    </div>
  )
}

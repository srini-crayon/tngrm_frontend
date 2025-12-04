"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../lib/store/auth.store'
import { useToast } from '../../hooks/use-toast'
import { ClientProfileComponent } from '../../components/profile/client-profile'
import { ISVProfileComponent } from '../../components/profile/isv-profile'
import { ResellerProfileComponent } from '../../components/profile/reseller-profile'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { toast } = useToast()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuthAndRole = () => {
      if (!isAuthenticated || !user) {
        router.push('/auth/login')
        return
      }

      // Admin users don't have a profile page - redirect to home
      if (user.role === 'admin') {
        toast({
          description: "Admin users don't have a profile page.",
          variant: "destructive",
        })
        router.push('/')
        return
      }

      // Allow Client, ISV, and Reseller users to access profile
      setIsCheckingAuth(false)
    }

    // Add a small delay to ensure Zustand store is hydrated
    const timer = setTimeout(checkAuthAndRole, 100)
    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router, toast])

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">User not found</p>
      </div>
    )
  }

  // Render appropriate profile component based on user role
  const renderProfileComponent = () => {
    switch (user.role) {
      case 'client':
        return <ClientProfileComponent clientId={user.user_id} />
      case 'isv':
        return <ISVProfileComponent isvId={user.user_id} />
      case 'reseller':
        return <ResellerProfileComponent resellerId={user.user_id} />
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">Invalid user role</p>
          </div>
        )
    }
  }

  return (
    <div className="w-full px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
      {renderProfileComponent()}
    </div>
  )
}

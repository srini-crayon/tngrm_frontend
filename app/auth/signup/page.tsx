"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useModal } from "../../../hooks/use-modal"

export default function SignupPage() {
  const router = useRouter()
  const { openModal } = useModal()

  useEffect(() => {
    // Open the unified modal with signup mode and client role
    openModal("auth", { mode: "signup", role: "client" })
    // Redirect to home page
    router.push("/")
  }, [openModal, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Sign Up...</h1>
        <p className="text-gray-600">Please wait while we redirect you to the sign up page.</p>
      </div>
    </div>
  )
}

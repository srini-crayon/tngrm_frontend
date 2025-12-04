"use client"

import { Button } from "../../../components/ui/button"
import { Check } from "lucide-react"
import { useRouter } from "next/navigation"

export default function OnboardSuccessPage() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full px-8 md:px-12 lg:px-16 text-center max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-green-500">
            <Check className="h-16 w-16 text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="mb-4 text-4xl font-bold">Agents Onboarded Successfully!</h1>
        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          A new agent has been successfully created and submitted for approval. You will be notified once the approval
          process is complete.
        </p>

        {/* Next Button */}
        <Button onClick={() => router.push("/")} size="lg" className="bg-black text-white hover:bg-black/90">
          Next
        </Button>
      </div>
    </div>
  )
}

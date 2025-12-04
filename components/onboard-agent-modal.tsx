"use client"

import { ModalWrapper } from "./modal-wrapper"
import { useModal } from "../hooks/use-modal"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface OnboardAgentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OnboardAgentModal({ isOpen, onClose }: OnboardAgentModalProps) {
  const { authRole } = useModal()
  const router = useRouter()

  const content = {
    vendor: {
      title: "Welcome to ISV Platform",
      subtitle:
        "You haven't onboard any agents yet. Reseller with us to showcase your AI solutions to our enterprise clients.",
    },
    reseller: {
      title: "Welcome to Reseller Platform",
      subtitle:
        "You haven't onboarded any agents yet. Start partnering and showcase AI solutions to enterprise clients.",
    },
  }

  const currentContent = authRole === "isv" ? content.vendor : content.reseller

  const handleOnboard = () => {
    onClose()
    router.push("/onboard")
  }

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose}>
      <div className="max-w-[640px] text-center">
        {/* Illustration */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/person-with-laptop-and-ai-robot-high-fiving-illust.png"
            alt="Onboard illustration"
            width={300}
            height={220}
            className="object-contain"
          />
        </div>

        <h2 className="mb-4 text-2xl font-bold text-gray-900">{currentContent.title}</h2>
        <p className="mb-8 text-sm leading-relaxed text-gray-600">{currentContent.subtitle}</p>
        <div>
        <Button
          onClick={handleOnboard}
          size="lg"
          className="mb-4 w-full max-w-xs bg-black text-white hover:bg-black/90"
        >
          Onboard Agent
        </Button>

        
        </div>
        <button onClick={onClose} className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline">
          I'll do it later
        </button>
      </div>
    </ModalWrapper>
  )
}

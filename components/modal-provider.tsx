"use client"

import { UnifiedAuthModal } from "./unified-auth-modal"
import { OnboardAgentModal } from "./onboard-agent-modal"
import { useModal } from "../hooks/use-modal"

export function ModalProvider() {
  const { activeModal, authMode, authRole, closeModal } = useModal()

  return (
    <>
      <UnifiedAuthModal 
        isOpen={activeModal === "auth"} 
        onClose={closeModal}
        initialMode={authMode}
        initialRole={authRole}
      />
      <OnboardAgentModal isOpen={activeModal === "onboard-agent"} onClose={closeModal} />
    </>
  )
}

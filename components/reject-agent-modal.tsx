"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import type { AgentAPIResponse } from "../lib/types/admin.types"

interface RejectAgentModalProps {
  agent: AgentAPIResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onReject: (agent: AgentAPIResponse, reason: string) => void | Promise<void>
}

export function RejectAgentModal({
  agent,
  open,
  onOpenChange,
  onReject,
}: RejectAgentModalProps) {
  const [reason, setReason] = useState("")

  const handleSubmit = () => {
    if (reason.trim()) {
      onReject(agent, reason)
      setReason("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Reject this Agent</DialogTitle>
          <p className="text-sm text-muted-foreground">Mention the reason for rejecting Agent Name: {agent.agent_name}</p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium">Reason</label>
            <Textarea
              placeholder="Enter your Reasons"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1.5 min-h-[120px] resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSubmit} className="bg-black hover:bg-black/90 px-8">
            SUBMIT
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

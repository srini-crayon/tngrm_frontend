"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { useAuthStore } from "../../lib/store/auth.store"
import { useToast } from "../../hooks/use-toast"
import ChatDialog from "../../components/chat-dialog"
import { AgentPreviewModal } from "../../components/agent-preview-modal"
import { EditAgentModal } from "../../components/edit-agent-modal"

type Agent = {
  agent_id: string
  admin_approved: string
  isv_id: string
  asset_type?: string
  by_persona?: string
  by_value?: string
  agent_name: string
  demo_link?: string
  description?: string
  tags?: string
  demo_preview?: string
  updated_at?: string
}

type ApiResponse = {
  isv: {
    isv_id: string
    isv_name: string
    isv_address?: string
    isv_email_no?: string
    admin_approved?: string
  }
  agents: Agent[]
  statistics: {
    total_agents: number
    approved_agents: number
    total_capabilities: number
    isv_approved: boolean
  }
}

const statusStyle: Record<string, string> = {
  Approved: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Rejected: "bg-red-100 text-red-700",
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ApiResponse | null>(null)
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all")
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  // Debug log when chatOpen changes
  useEffect(() => {
    console.log('Dashboard - chatOpen state changed:', chatOpen)
  }, [chatOpen])

  // Authentication and role check
  useEffect(() => {
    const checkAuthAndRole = () => {
      if (!isAuthenticated || !user) {
        router.push('/auth/login')
        return
      }

      if (user.role === 'admin') {
        router.push('/admin')
        return
      }

      if (user.role === 'reseller') {
        toast({
          description: "Dashboard is not available for resellers.",
          variant: "destructive",
        })
        router.push('/')
        return
      }

      // Allow ISV and client users to access dashboard
      setIsCheckingAuth(false)
    }

    checkAuthAndRole()
  }, [isAuthenticated, user, router, toast])

  // Get ISV ID from user
  const isvId = user?.user_id || null

  useEffect(() => {
    if (isCheckingAuth || !isvId) return
    
    let abort = false
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`https://agents-store.onrender.com/api/isv/profile/${isvId}`, { cache: "no-store" })
        if (!res.ok) throw new Error(`Failed to load ISV profile: ${res.status}`)
        const json: ApiResponse = await res.json()
        if (!abort) setData(json)
      } catch (e: any) {
        if (!abort) setError(e?.message || "Something went wrong")
      } finally {
        if (!abort) setLoading(false)
      }
    }
    fetchData()
    return () => {
      abort = true
    }
  }, [isCheckingAuth, isvId])

  function toStatus(s: string): "Approved" | "Pending" | "Rejected" {
    const v = (s || "").toLowerCase()
    if (v === "yes" || v === "approved") return "Approved"
    if (v === "pending") return "Pending"
    return "Rejected"
  }

  const agents = data?.agents || []
  const counts = useMemo(() => {
    const c = { all: agents.length, approved: 0, pending: 0, rejected: 0 }
    for (const a of agents) {
      const s = toStatus(a.admin_approved)
      if (s === "Approved") c.approved++
      else if (s === "Pending") c.pending++
      else c.rejected++
    }
    return c
  }, [agents])

  const filteredAgents = useMemo(() => {
    if (filter === "all") return agents
    return agents.filter((a) => {
      const s = toStatus(a.admin_approved)
      return (
        (filter === "approved" && s === "Approved") ||
        (filter === "pending" && s === "Pending") ||
        (filter === "rejected" && s === "Rejected")
      )
    })
  }, [agents, filter])

  return (
    <div className="w-full px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20">
      {isCheckingAuth ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying access...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Agent Details</h1>
              <p className="text-base text-gray-600">
                {data?.isv?.isv_name ? `${data.isv.isv_name} - ` : ''}ISVs with us to showcase your AI solutions to our enterprise clients.
              </p>
            </div>
            <div>
              <Button 
                className="bg-black text-white hover:bg-black/90"
                onClick={() => {
                  router.push('/onboard')
                }}
              >
                ONBOARD AGENT
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end mb-6">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All ({counts.all})
            </Button>
            <Button variant={filter === "approved" ? "default" : "outline"} size="sm" onClick={() => setFilter("approved")}>
              Approved ({counts.approved})
            </Button>
            <Button variant={filter === "pending" ? "default" : "outline"} size="sm" onClick={() => setFilter("pending")}>
              Pending ({counts.pending})
            </Button>
            <Button variant={filter === "rejected" ? "default" : "outline"} size="sm" onClick={() => setFilter("rejected")}>
              Rejected ({counts.rejected})
            </Button>
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4">
              {error && (
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              {loading && (
                <div className="mb-3 text-sm text-gray-600">Loading...</div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S. No</TableHead>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((a, idx) => {
                    const status = toStatus(a.admin_approved)
                    return (
                      <TableRow key={a.agent_id}>
                        <TableCell>{idx + 1}</TableCell>
                        <TableCell className="font-medium">{a.agent_name}</TableCell>
                        <TableCell>{a.asset_type || "-"}</TableCell>
                        
                        <TableCell>
                          <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${statusStyle[status]}`}>
                            {status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                router.push(`/agents/${a.agent_id}`)
                              }}
                            >
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedAgent(a)
                                setEditModalOpen(true)
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {/* Chat Dialog */}
      <ChatDialog 
        open={chatOpen} 
        onOpenChange={setChatOpen} 
        initialMode="create"
      />

      {/* Agent View Modal */}
      {selectedAgent && (
        <AgentPreviewModal
          agent={{
            agent_id: selectedAgent.agent_id,
            agent_name: selectedAgent.agent_name,
            asset_type: selectedAgent.asset_type || '',
            isv_id: selectedAgent.isv_id,
            by_persona: selectedAgent.by_persona || '',
            by_value: selectedAgent.by_value || '',
            demo_link: selectedAgent.demo_link || '',
            demo_preview: selectedAgent.demo_preview || '',
            description: selectedAgent.description || '',
            features: '',
            tags: selectedAgent.tags || '',
            roi: '',
            admin_approved: (selectedAgent.admin_approved === 'yes' ? 'yes' : 'no') as 'yes' | 'no',
            is_approved: selectedAgent.admin_approved === 'yes',
          }}
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          onApprove={() => {}}
          onReject={() => {}}
        />
      )}

      {/* Agent Edit Modal */}
      {selectedAgent && (
        <EditAgentModal
          agent={{
            agent_id: selectedAgent.agent_id,
            agent_name: selectedAgent.agent_name,
            asset_type: selectedAgent.asset_type || '',
            isv_id: selectedAgent.isv_id,
            by_persona: selectedAgent.by_persona || '',
            by_value: selectedAgent.by_value || '',
            demo_link: selectedAgent.demo_link || '',
            demo_preview: selectedAgent.demo_preview || '',
            description: selectedAgent.description || '',
            features: '',
            tags: selectedAgent.tags || '',
            roi: '',
            admin_approved: (selectedAgent.admin_approved === 'yes' ? 'yes' : 'no') as 'yes' | 'no',
            is_approved: selectedAgent.admin_approved === 'yes',
          }}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSave={() => {
            // Refresh agent list after successful save
            if (isvId) {
              fetch(`https://agents-store.onrender.com/api/isv/profile/${isvId}`, { cache: "no-store" })
                .then(res => res.json())
                .then(json => setData(json))
                .catch(e => setError(e?.message || "Failed to refresh"))
            }
            setEditModalOpen(false)
          }}
        />
      )}
    </div>
  )
}


 

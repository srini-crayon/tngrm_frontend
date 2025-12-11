"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { useAuthStore } from "../../lib/store/auth.store"
import { useToast } from "../../hooks/use-toast"
import ChatDialog from "../../components/chat-dialog"
import { AgentPreviewModal } from "../../components/agent-preview-modal"
import { EditAgentModal } from "../../components/edit-agent-modal"
import { Search, MoreVertical } from "lucide-react"
import { getAuthHeaders } from "../../lib/api/config"

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
  Approved: "bg-green-100 text-black",
  Pending: "bg-yellow-100 text-black",
  Rejected: "bg-red-100 text-black",
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
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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

    // Add a small delay to ensure Zustand store is hydrated from localStorage
    // This prevents redirect to login on page refresh when user is actually authenticated
    const timer = setTimeout(checkAuthAndRole, 100)
    
    return () => clearTimeout(timer)
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
        
        // Get token from auth store
        const token = useAuthStore.getState().token
        const headers = getAuthHeaders(token, {
          'Content-Type': 'application/json',
        })
        
        const res = await fetch(`https://agents-store.onrender.com/api/isv/profile/${isvId}`, {
          cache: "no-store",
          headers,
        })
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
    if (v === "no" || v === "rejected" || v === "reject") return "Rejected"
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
    let filtered = agents
    
    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((a) => {
        const s = toStatus(a.admin_approved)
        return (
          (filter === "approved" && s === "Approved") ||
          (filter === "pending" && s === "Pending") ||
          (filter === "rejected" && s === "Rejected")
        )
      })
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((a) =>
        a.agent_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return filtered
  }, [agents, filter, searchQuery])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAgents = filteredAgents.slice(startIndex, endIndex)
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedAgents.map(a => a.agent_id)))
    } else {
      setSelectedRows(new Set())
    }
  }
  
  const handleSelectRow = (agentId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(agentId)
    } else {
      newSelected.delete(agentId)
    }
    setSelectedRows(newSelected)
  }

  return (
    <div 
      className="w-full px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20 min-h-screen"
      style={{
        background: 'radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFF 100%)',
        width: '100%'
      }}
    >
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
                ISVs with us to showcase your AI solutions to our enterprise clients.
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

          {/* Status Filters and Search */}
          <div className="flex items-end justify-between gap-4 mb-6">
            {/* Status Tabs */}
            <div className="flex items-end gap-6 border-b border-gray-200">
              <button
                onClick={() => setFilter("all")}
                className={`pb-2 px-1 text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                All ({counts.all})
              </button>
              <button
                onClick={() => setFilter("approved")}
                className={`pb-2 px-1 text-sm font-medium transition-colors ${
                  filter === "approved"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Approved({counts.approved})
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`pb-2 px-1 text-sm font-medium transition-colors ${
                  filter === "rejected"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Rejected({counts.rejected})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`pb-2 px-1 text-sm font-medium transition-colors ${
                  filter === "pending"
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Pending({counts.pending})
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-md border-gray-300"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="overflow-x-auto">
              {error && (
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 m-4">
                  {error}
                </div>
              )}
              {loading && (
                <div className="mb-3 text-sm text-gray-600 p-4">Loading...</div>
              )}
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === paginatedAgents.length && paginatedAgents.length > 0 && paginatedAgents.every(a => selectedRows.has(a.agent_id))}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded"
                        style={{
                          accentColor: '#E5E7EB',
                          borderColor: '#E5E7EB'
                        }}
                      />
                    </TableHead>
                    <TableHead className="font-medium w-16">S. No</TableHead>
                    <TableHead className="font-medium min-w-[200px]">Agent Name</TableHead>
                    <TableHead className="font-medium min-w-[120px]">Asset Type</TableHead>
                    <TableHead className="font-medium w-32">Status</TableHead>
                    <TableHead className="font-medium w-16 text-right"></TableHead>
                    <TableHead className="font-medium w-16 text-right"></TableHead>
                    <TableHead className="w-12 text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAgents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No agents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedAgents.map((a, idx) => {
                      const status = toStatus(a.admin_approved)
                      return (
                        <TableRow key={a.agent_id} className="border-b border-gray-100">
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedRows.has(a.agent_id)}
                              onChange={(e) => handleSelectRow(a.agent_id, e.target.checked)}
                              className="rounded"
                              style={{
                                accentColor: '#E5E7EB',
                                borderColor: '#E5E7EB'
                              }}
                            />
                          </TableCell>
                          <TableCell className="w-16">{startIndex + idx + 1}</TableCell>
                          <TableCell className="font-medium min-w-[200px]">{a.agent_name}</TableCell>
                          <TableCell className="min-w-[120px]">{a.asset_type || "-"}</TableCell>
                          <TableCell className="w-32">
                            <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium w-full ${statusStyle[status]}`}>
                              {status}
                            </span>
                          </TableCell>
                          <TableCell className="p-1 w-16 text-right">
                            <button
                              onClick={() => {
                                router.push(`/agents/${a.agent_id}`)
                              }}
                              className="text-blue-600 hover:text-blue-700 hover:underline text-sm"
                            >
                              View
                            </button>
                          </TableCell>
                          <TableCell className="p-1 w-16 text-right">
                            <button
                              onClick={() => {
                                setSelectedAgent(a)
                                setEditModalOpen(true)
                              }}
                              className="text-blue-600 hover:text-blue-700 hover:underline text-sm"
                            >
                              Edit
                            </button>
                          </TableCell>
                          <TableCell className="p-1 w-12 text-right">
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 px-2">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredAgents.length)} of {filteredAgents.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="min-w-[40px]"
                          >
                            {page}
                          </Button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2">...</span>
                      }
                      return null
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
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
              const token = useAuthStore.getState().token
              const headers = getAuthHeaders(token, {
                'Content-Type': 'application/json',
              })
              
              fetch(`https://agents-store.onrender.com/api/isv/profile/${isvId}`, {
                cache: "no-store",
                headers,
              })
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


 

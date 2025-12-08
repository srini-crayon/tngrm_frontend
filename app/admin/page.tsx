"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog"
import { Search, SlidersHorizontal, MoreVertical, Eye, Edit, CheckCircle, XCircle, Trash2, ExternalLink, MessageSquare, Users, User, Mail, Building2, Phone, Calendar, UserCircle } from "lucide-react"
import { AgentPreviewModal } from "../../components/agent-preview-modal"
import { EditAgentModal } from "../../components/edit-agent-modal"
import { RejectAgentModal } from "../../components/reject-agent-modal"
import { ISVDetailsModal } from "../../components/isv-details-modal"
import { RejectISVModal } from "../../components/reject-isv-modal"
import { ResellerDetailsModal } from "../../components/reseller-details-modal"
import { RejectResellerModal } from "../../components/reject-reseller-modal"
import { EditISVModal } from "../../components/edit-isv-modal"
import { EditResellerModal } from "../../components/edit-reseller-modal"
import { useToast } from "../../hooks/use-toast"
import { Toaster } from "../../components/ui/toaster"
import { adminService } from "../../lib/api/admin.service"
import { useAuthStore } from "../../lib/store/auth.store"
import type { AgentAPIResponse, ISVAPIResponse, ResellerAPIResponse } from "../../lib/types/admin.types"

type TabType = "agents" | "isvs" | "resellers" | "enquiries"

export default function AdminPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabType>("agents")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // API Data
  const [agents, setAgents] = useState<AgentAPIResponse[]>([])
  const [isvs, setISVs] = useState<ISVAPIResponse[]>([])
  const [resellers, setResellers] = useState<ResellerAPIResponse[]>([])
  const [enquiries, setEnquiries] = useState<any[]>([])

  // Enquiry filter states
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<"all" | "new" | "read">("all")
  const [enquiryUserTypeFilter, setEnquiryUserTypeFilter] = useState<string>("all")

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">("all")
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>("all")

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Multi-select States
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set())
  const [selectedISVs, setSelectedISVs] = useState<Set<string>>(new Set())
  const [selectedResellers, setSelectedResellers] = useState<Set<string>>(new Set())
  const [selectedEnquiries, setSelectedEnquiries] = useState<Set<string>>(new Set())

  // Authentication and Role Check
  useEffect(() => {
    const checkAuthAndRole = () => {
      console.log('Auth check - isAuthenticated:', isAuthenticated)
      console.log('Auth check - user:', user)
      console.log('Auth check - user role:', user?.role)
      
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, redirecting to login')
        // User is not authenticated, redirect to login
        router.push('/auth/login')
        return
      }

      if (user.role !== 'admin') {
        console.log('User is not admin, redirecting to home')
        // User is authenticated but not an admin, redirect to home
        toast({
          description: "Access denied. Admin privileges required.",
          variant: "destructive",
        })
        router.push('/')
        return
      }

      console.log('User is admin, allowing access')
      // User is authenticated and is an admin, allow access
      setIsCheckingAuth(false)
    }

    // Add a small delay to ensure Zustand store is hydrated from localStorage
    const timer = setTimeout(checkAuthAndRole, 100)
    
    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router, toast])

  // Modal States
  const [selectedAgent, setSelectedAgent] = useState<AgentAPIResponse | null>(null)
  const [selectedISV, setSelectedISV] = useState<ISVAPIResponse | null>(null)
  const [selectedReseller, setSelectedReseller] = useState<ResellerAPIResponse | null>(null)

  // Drawer States
  const [agentDetailsOpen, setAgentDetailsOpen] = useState(false)
  const [isvModalOpen, setISVModalOpen] = useState(false)
  const [resellerModalOpen, setResellerModalOpen] = useState(false)

  // Modal States
  const [rejectAgentModalOpen, setRejectAgentModalOpen] = useState(false)
  const [rejectISVModalOpen, setRejectISVModalOpen] = useState(false)
  const [rejectResellerModalOpen, setRejectResellerModalOpen] = useState(false)
  const [editISVModalOpen, setEditISVModalOpen] = useState(false)
  const [editResellerModalOpen, setEditResellerModalOpen] = useState(false)
  const [editAgentModalOpen, setEditAgentModalOpen] = useState(false)
  
  // Message modal state for enquiries
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<{name: string, message: string, email?: string} | null>(null)
  
  const handleShowMessage = (enquiry: any) => {
    setSelectedMessage({
      name: enquiry.full_name || 'Unknown',
      message: enquiry.message || 'No message provided',
      email: enquiry.email
    })
    setMessageModalOpen(true)
  }

  // Fetch functions
  const fetchAgents = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError(null)
    try {
      const apiAgents = await adminService.fetchAgents()
      setAgents(apiAgents)
    } catch (err: any) {
      console.error('Error fetching agents:', err)
      setError(err.message || 'Failed to fetch agents')
      if (showLoading) {
        toast({
          description: err.message || 'Failed to fetch agents',
          variant: "destructive",
        })
      }
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  const fetchISVs = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError(null)
    try {
      const apiISVs = await adminService.fetchISVs()
      setISVs(apiISVs)
    } catch (err: any) {
      console.error('Error fetching ISVs:', err)
      setError(err.message || 'Failed to fetch ISVs')
      if (showLoading) {
        toast({
          description: err.message || 'Failed to fetch ISVs',
          variant: "destructive",
        })
      }
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  const fetchResellers = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError(null)
    try {
      const apiResellers = await adminService.fetchResellers()
      setResellers(apiResellers)
    } catch (err: any) {
      console.error('Error fetching resellers:', err)
      setError(err.message || 'Failed to fetch resellers')
      if (showLoading) {
        toast({
          description: err.message || 'Failed to fetch resellers',
          variant: "destructive",
        })
      }
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  const fetchEnquiries = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('https://agents-store.onrender.com/api/enquiries', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.enquiries) {
          setEnquiries(data.enquiries)
        }
      } else {
        throw new Error('Failed to fetch enquiries')
      }
    } catch (err: any) {
      console.error('Error fetching enquiries:', err)
      setError(err.message || 'Failed to fetch enquiries')
      if (showLoading) {
        toast({
          description: err.message || 'Failed to fetch enquiries',
          variant: "destructive",
        })
      }
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  // Fetch all data on initial load (after auth check) - without loading state
  useEffect(() => {
    if (!isCheckingAuth) {
      // Fetch all data in parallel to show counts immediately (without showing loading state)
      Promise.all([
        fetchAgents(false),
        fetchISVs(false),
        fetchResellers(false),
        fetchEnquiries(false)
      ]).catch(err => {
        console.error('Error fetching initial data:', err)
      })
    }
  }, [isCheckingAuth])

  // Fetch data when tab changes (for refreshing) - with loading state
  useEffect(() => {
    if (!isCheckingAuth) {
      if (activeTab === "agents") {
        fetchAgents(true)
      } else if (activeTab === "isvs") {
        fetchISVs(true)
      } else if (activeTab === "resellers") {
        fetchResellers(true)
      } else if (activeTab === "enquiries") {
        fetchEnquiries(true)
      }
    }
  }, [activeTab, isCheckingAuth])

  // Filter functions with useMemo
  const filteredAgents = useMemo(() => {
    let filtered = agents

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(agent =>
        agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.asset_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.isv_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(agent =>
        statusFilter === "approved" ? agent.admin_approved === "yes" : agent.admin_approved === "no"
      )
    }

    // Asset type filter
    if (assetTypeFilter !== "all") {
      filtered = filtered.filter(agent => agent.asset_type === assetTypeFilter)
    }

    return filtered
  }, [agents, searchTerm, statusFilter, assetTypeFilter])

  const filteredISVs = useMemo(() => {
    let filtered = isvs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(isv =>
        isv.isv_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        isv.isv_email_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        isv.isv_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(isv =>
        statusFilter === "approved" ? isv.admin_approved === "yes" : isv.admin_approved === "no"
      )
    }

    return filtered
  }, [isvs, searchTerm, statusFilter])

  const filteredResellers = useMemo(() => {
    let filtered = resellers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(reseller =>
        reseller.reseller_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reseller.reseller_email_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reseller.reseller_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(reseller =>
        statusFilter === "approved" ? reseller.admin_approved === "yes" : reseller.admin_approved === "no"
      )
    }

    return filtered
  }, [resellers, searchTerm, statusFilter])

  const filteredEnquiries = useMemo(() => {
    let filtered = enquiries

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(enquiry =>
        enquiry.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.message?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (enquiryStatusFilter !== "all") {
      filtered = filtered.filter(enquiry =>
        enquiryStatusFilter === "new" ? enquiry.status === "new" : enquiry.status !== "new"
      )
    }

    // User type filter
    if (enquiryUserTypeFilter !== "all") {
      filtered = filtered.filter(enquiry => enquiry.user_type === enquiryUserTypeFilter)
    }

    return filtered
  }, [enquiries, searchTerm, enquiryStatusFilter, enquiryUserTypeFilter])

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, assetTypeFilter, enquiryStatusFilter, enquiryUserTypeFilter, activeTab])

  // Pagination calculations
  const getPaginatedData = (data: any[]) => {
    const totalPages = Math.ceil(data.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = data.slice(startIndex, endIndex)
    return { paginatedData, totalPages, startIndex, endIndex }
  }

  const agentsPagination = getPaginatedData(filteredAgents)
  const isvsPagination = getPaginatedData(filteredISVs)
  const resellersPagination = getPaginatedData(filteredResellers)
  const enquiriesPagination = getPaginatedData(filteredEnquiries)

  // Multi-select handlers
  const handleSelectAllAgents = (checked: boolean) => {
    if (checked) {
      setSelectedAgents(new Set(agentsPagination.paginatedData.map(a => a.agent_id)))
    } else {
      setSelectedAgents(new Set())
    }
  }

  const handleSelectAgent = (agentId: string, checked: boolean) => {
    const newSelected = new Set(selectedAgents)
    if (checked) {
      newSelected.add(agentId)
    } else {
      newSelected.delete(agentId)
    }
    setSelectedAgents(newSelected)
  }

  const handleSelectAllISVs = (checked: boolean) => {
    if (checked) {
      setSelectedISVs(new Set(isvsPagination.paginatedData.map(i => i.isv_id)))
    } else {
      setSelectedISVs(new Set())
    }
  }

  const handleSelectISV = (isvId: string, checked: boolean) => {
    const newSelected = new Set(selectedISVs)
    if (checked) {
      newSelected.add(isvId)
    } else {
      newSelected.delete(isvId)
    }
    setSelectedISVs(newSelected)
  }

  const handleSelectAllResellers = (checked: boolean) => {
    if (checked) {
      setSelectedResellers(new Set(resellersPagination.paginatedData.map(r => r.reseller_id)))
    } else {
      setSelectedResellers(new Set())
    }
  }

  const handleSelectReseller = (resellerId: string, checked: boolean) => {
    const newSelected = new Set(selectedResellers)
    if (checked) {
      newSelected.add(resellerId)
    } else {
      newSelected.delete(resellerId)
    }
    setSelectedResellers(newSelected)
  }

  const handleSelectAllEnquiries = (checked: boolean) => {
    if (checked) {
      setSelectedEnquiries(new Set(enquiriesPagination.paginatedData.map(e => e.enquiry_id)))
    } else {
      setSelectedEnquiries(new Set())
    }
  }

  const handleSelectEnquiry = (enquiryId: string, checked: boolean) => {
    const newSelected = new Set(selectedEnquiries)
    if (checked) {
      newSelected.add(enquiryId)
    } else {
      newSelected.delete(enquiryId)
    }
    setSelectedEnquiries(newSelected)
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    
    return formatDate(dateString)
  }

  // Action handlers
  const handleApproveAgent = async (agent: AgentAPIResponse) => {
    try {
      await adminService.updateAgent(agent.agent_id, { admin_approved: "yes" })
      setAgentDetailsOpen(false)
      await fetchAgents()
      toast({
        description: `${agent.agent_name} has been approved successfully.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to approve agent",
        variant: "destructive",
      })
    }
  }

  const handleRejectAgent = async (agent: AgentAPIResponse, reason: string) => {
    try {
      await adminService.updateAgent(agent.agent_id, { admin_approved: "no" })
      setRejectAgentModalOpen(false)
      setAgentDetailsOpen(false)
      await fetchAgents()
      toast({
        description: `${agent.agent_name} has been rejected.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to reject agent",
        variant: "destructive",
      })
    }
  }

  const handleApproveISV = async (isv: ISVAPIResponse) => {
    try {
      await adminService.updateISV(isv.isv_id, { 
        isv_name: isv.isv_name,
        isv_email: isv.isv_email_no,
        admin_approved: "yes" 
      })
      setISVModalOpen(false)
      await fetchISVs()
      toast({
        description: `${isv.isv_name} has been approved successfully.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to approve ISV",
        variant: "destructive",
      })
    }
  }

  const handleRejectISV = async (isv: ISVAPIResponse, reason: string) => {
    try {
      await adminService.updateISV(isv.isv_id, { 
        isv_name: isv.isv_name,
        isv_email: isv.isv_email_no,
        admin_approved: "no" 
      })
      setRejectISVModalOpen(false)
      setISVModalOpen(false)
      await fetchISVs()
      toast({
        description: `${isv.isv_name} has been rejected.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to reject ISV",
        variant: "destructive",
      })
    }
  }

  const handleApproveReseller = async (reseller: ResellerAPIResponse) => {
    try {
      await adminService.updateReseller(reseller.reseller_id, { 
        reseller_name: reseller.reseller_name,
        reseller_email: reseller.reseller_email_no,
        admin_approved: "yes" 
      })
      setResellerModalOpen(false)
      await fetchResellers()
      toast({
        description: `${reseller.reseller_name} has been approved successfully.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to approve reseller",
        variant: "destructive",
      })
    }
  }

  const handleRejectReseller = async (reseller: ResellerAPIResponse, reason: string) => {
    try {
      await adminService.updateReseller(reseller.reseller_id, { 
        reseller_name: reseller.reseller_name,
        reseller_email: reseller.reseller_email_no,
        admin_approved: "no" 
      })
      setRejectResellerModalOpen(false)
      setResellerModalOpen(false)
      await fetchResellers()
      toast({
        description: `${reseller.reseller_name} has been rejected.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to reject reseller",
        variant: "destructive",
      })
    }
  }

  const handleEditISV = () => {
    setISVModalOpen(false)
    setEditISVModalOpen(true)
  }

  const handleEditReseller = () => {
    setResellerModalOpen(false)
    setEditResellerModalOpen(true)
  }

  const handleEditSuccess = () => {
    if (activeTab === "isvs") {
      fetchISVs()
    } else if (activeTab === "resellers") {
      fetchResellers()
    }
  }

  // Get unique asset types for filter
  const getAssetTypes = () => {
    const types = [...new Set(agents.map(agent => agent.asset_type).filter(Boolean))]
    return types
  }

  const getStatusBadge = (approved: "yes" | "no") => {
    if (approved === "yes") {
      return (
        <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-black">
          Approved
        </span>
      )
    }
    return (
      <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium bg-yellow-100 text-black">
        Pending
      </span>
    )
  }

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'radial-gradient(100% 100% at 50% 0%, #FFFEDA 0%, #FFF 100%)',
          width: '100%'
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="w-full px-8 md:px-12 lg:px-16 py-12 md:py-16 lg:py-20 min-h-screen"
      style={{
        background: 'radial-gradient(100% 100% at 50% 0%, #FFFEDA 0%, #FFF 100%)',
        width: '100%'
      }}
    >
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-base text-gray-600">
            Manage agents, ISVs, and resellers
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "agents", label: "Agents", icon: MessageSquare, count: agents.length },
                { id: "isvs", label: "ISVs", icon: Users, count: isvs.length },
                { id: "resellers", label: "Resellers", icon: User, count: resellers.length },
                { id: "enquiries", label: "Enquiries", icon: Mail, count: enquiries.length },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                    <span className="text-xs font-normal opacity-70">({tab.count})</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Status: {statusFilter === "all" ? "All" : statusFilter === "approved" ? "Approved" : "Pending"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("approved")}>Approved</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Asset Type Filter (only for agents) */}
            {activeTab === "agents" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Asset Type: {assetTypeFilter === "all" ? "All" : assetTypeFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setAssetTypeFilter("all")}>All</DropdownMenuItem>
                  {getAssetTypes().map((type) => (
                    <DropdownMenuItem key={type} onClick={() => setAssetTypeFilter(type)}>
                      {type}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Enquiry Status Filter (only for enquiries) */}
            {activeTab === "enquiries" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Status: {enquiryStatusFilter === "all" ? "All" : enquiryStatusFilter === "new" ? "New" : "Read"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setEnquiryStatusFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnquiryStatusFilter("new")}>New</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnquiryStatusFilter("read")}>Read</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Enquiry User Type Filter (only for enquiries) */}
            {activeTab === "enquiries" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    User Type: {enquiryUserTypeFilter === "all" ? "All" : enquiryUserTypeFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("client")}>Client</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("isv")}>ISV</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("reseller")}>Reseller</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("anonymous")}>Anonymous</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setAssetTypeFilter("all")
                setEnquiryStatusFilter("all")
                setEnquiryUserTypeFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => {
              if (activeTab === "agents") fetchAgents()
              else if (activeTab === "isvs") fetchISVs()
              else if (activeTab === "resellers") fetchResellers()
              else if (activeTab === "enquiries") fetchEnquiries()
            }}>
              Retry
            </Button>
          </div>
        ) : (
          <React.Fragment>
            {/* Agents Table */}
            {activeTab === "agents" && (
              <div className="mt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedAgents.size === agentsPagination.paginatedData.length && agentsPagination.paginatedData.length > 0 && agentsPagination.paginatedData.every(a => selectedAgents.has(a.agent_id))}
                            onChange={(e) => handleSelectAllAgents(e.target.checked)}
                            className="rounded"
                            style={{
                              accentColor: '#E5E7EB',
                              borderColor: '#E5E7EB'
                            }}
                          />
                        </TableHead>
                        <TableHead className="font-medium w-16">S. No</TableHead>
                        <TableHead className="font-medium min-w-[120px]">Agent ID</TableHead>
                        <TableHead className="font-medium min-w-[200px]">Agent Name</TableHead>
                        <TableHead className="font-medium min-w-[120px]">Asset Type</TableHead>
                        <TableHead className="font-medium min-w-[120px]">ISV ID</TableHead>
                        <TableHead className="font-medium w-32">Status</TableHead>
                        <TableHead className="font-medium w-20 text-right"></TableHead>
                        <TableHead className="font-medium w-20 text-right"></TableHead>
                        <TableHead className="w-12 text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agentsPagination.paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                            No agents found
                          </TableCell>
                        </TableRow>
                      ) : (
                        agentsPagination.paginatedData.map((agent, idx) => (
                          <TableRow key={agent.agent_id} className="border-b border-gray-100">
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedAgents.has(agent.agent_id)}
                                onChange={(e) => handleSelectAgent(agent.agent_id, e.target.checked)}
                                className="rounded"
                                style={{
                                  accentColor: '#E5E7EB',
                                  borderColor: '#E5E7EB'
                                }}
                              />
                            </TableCell>
                            <TableCell className="w-16">{agentsPagination.startIndex + idx + 1}</TableCell>
                            <TableCell className="min-w-[120px] text-sm text-gray-900">{agent.agent_id}</TableCell>
                            <TableCell className="font-medium min-w-[200px] text-sm text-gray-900">{agent.agent_name}</TableCell>
                            <TableCell className="min-w-[120px] text-sm text-gray-900">{agent.asset_type || "-"}</TableCell>
                            <TableCell className="min-w-[120px] text-sm text-gray-900">{agent.isv_id}</TableCell>
                            <TableCell className="w-32">
                              {getStatusBadge(agent.admin_approved)}
                            </TableCell>
                            <TableCell className="p-1 w-20 text-right">
                              <button
                                onClick={() => handleApproveAgent(agent)}
                                className="text-green-600 hover:text-green-700 hover:underline text-sm"
                              >
                                Approve
                              </button>
                            </TableCell>
                            <TableCell className="p-1 w-20 text-right">
                              <button
                                onClick={() => {
                                  setSelectedAgent(agent)
                                  setRejectAgentModalOpen(true)
                                }}
                                className="text-red-600 hover:text-red-700 hover:underline text-sm"
                              >
                                Reject
                              </button>
                            </TableCell>
                            <TableCell className="p-1 w-12 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      router.push(`/agents/${agent.agent_id}`)
                                    }}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedAgent(agent)
                                      setEditAgentModalOpen(true)
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination */}
                {agentsPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 px-2">
                    <div className="text-sm text-gray-600">
                      Showing {agentsPagination.startIndex + 1} to {Math.min(agentsPagination.endIndex, filteredAgents.length)} of {filteredAgents.length} results
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
                        {Array.from({ length: agentsPagination.totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === agentsPagination.totalPages ||
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
                        onClick={() => setCurrentPage(prev => Math.min(agentsPagination.totalPages, prev + 1))}
                        disabled={currentPage === agentsPagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ISVs Table */}
            {activeTab === "isvs" && (
              <div className="mt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedISVs.size === isvsPagination.paginatedData.length && isvsPagination.paginatedData.length > 0 && isvsPagination.paginatedData.every(i => selectedISVs.has(i.isv_id))}
                            onChange={(e) => handleSelectAllISVs(e.target.checked)}
                            className="rounded"
                            style={{
                              accentColor: '#E5E7EB',
                              borderColor: '#E5E7EB'
                            }}
                          />
                        </TableHead>
                        <TableHead className="font-medium w-16">S. No</TableHead>
                        <TableHead className="font-medium min-w-[120px]">ISV ID</TableHead>
                        <TableHead className="font-medium min-w-[200px]">ISV Name</TableHead>
                        <TableHead className="font-medium min-w-[180px]">Email</TableHead>
                        <TableHead className="font-medium min-w-[100px]">Agents</TableHead>
                        <TableHead className="font-medium min-w-[150px]">Domain</TableHead>
                        <TableHead className="font-medium w-32">Status</TableHead>
                        <TableHead className="font-medium w-20 text-right"></TableHead>
                        <TableHead className="font-medium w-20 text-right"></TableHead>
                        <TableHead className="w-12 text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isvsPagination.paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                            No ISVs found
                          </TableCell>
                        </TableRow>
                      ) : (
                        isvsPagination.paginatedData.map((isv, idx) => (
                          <TableRow key={isv.isv_id} className="border-b border-gray-100">
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedISVs.has(isv.isv_id)}
                                onChange={(e) => handleSelectISV(isv.isv_id, e.target.checked)}
                                className="rounded"
                                style={{
                                  accentColor: '#E5E7EB',
                                  borderColor: '#E5E7EB'
                                }}
                              />
                            </TableCell>
                            <TableCell className="w-16">{isvsPagination.startIndex + idx + 1}</TableCell>
                            <TableCell className="min-w-[120px] text-sm text-gray-900">{isv.isv_id}</TableCell>
                            <TableCell className="font-medium min-w-[200px] text-sm text-gray-900">{isv.isv_name}</TableCell>
                            <TableCell className="min-w-[180px] text-sm text-gray-900">{isv.isv_email_no}</TableCell>
                            <TableCell className="min-w-[100px] text-sm text-gray-900">
                              <span className="font-medium">{isv.approved_agent_count}</span>
                              <span className="text-gray-500">/{isv.agent_count}</span>
                            </TableCell>
                            <TableCell className="min-w-[150px] text-sm text-gray-900">{isv.isv_domain}</TableCell>
                            <TableCell className="w-32">
                              {getStatusBadge(isv.admin_approved)}
                            </TableCell>
                            <TableCell className="p-1 w-20 text-right">
                              <button
                                onClick={() => handleApproveISV(isv)}
                                className="text-green-600 hover:text-green-700 hover:underline text-sm"
                              >
                                Approve
                              </button>
                            </TableCell>
                            <TableCell className="p-1 w-20 text-right">
                              <button
                                onClick={() => {
                                  setSelectedISV(isv)
                                  setRejectISVModalOpen(true)
                                }}
                                className="text-red-600 hover:text-red-700 hover:underline text-sm"
                              >
                                Reject
                              </button>
                            </TableCell>
                            <TableCell className="p-1 w-12 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedISV(isv)
                                      setISVModalOpen(true)
                                    }}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedISV(isv)
                                      handleEditISV()
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination */}
                {isvsPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 px-2">
                    <div className="text-sm text-gray-600">
                      Showing {isvsPagination.startIndex + 1} to {Math.min(isvsPagination.endIndex, filteredISVs.length)} of {filteredISVs.length} results
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
                        {Array.from({ length: isvsPagination.totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === isvsPagination.totalPages ||
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
                        onClick={() => setCurrentPage(prev => Math.min(isvsPagination.totalPages, prev + 1))}
                        disabled={currentPage === isvsPagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Resellers Table */}
            {activeTab === "resellers" && (
              <div className="mt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedResellers.size === resellersPagination.paginatedData.length && resellersPagination.paginatedData.length > 0 && resellersPagination.paginatedData.every(r => selectedResellers.has(r.reseller_id))}
                            onChange={(e) => handleSelectAllResellers(e.target.checked)}
                            className="rounded"
                            style={{
                              accentColor: '#E5E7EB',
                              borderColor: '#E5E7EB'
                            }}
                          />
                        </TableHead>
                        <TableHead className="font-medium w-16">S. No</TableHead>
                        <TableHead className="font-medium min-w-[120px]">Reseller ID</TableHead>
                        <TableHead className="font-medium min-w-[200px]">Reseller Name</TableHead>
                        <TableHead className="font-medium min-w-[180px]">Email</TableHead>
                        <TableHead className="font-medium min-w-[180px]">Whitelisted Domain</TableHead>
                        <TableHead className="font-medium w-32">Status</TableHead>
                        <TableHead className="font-medium w-20 text-right"></TableHead>
                        <TableHead className="font-medium w-20 text-right"></TableHead>
                        <TableHead className="w-12 text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resellersPagination.paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                            No resellers found
                          </TableCell>
                        </TableRow>
                      ) : (
                        resellersPagination.paginatedData.map((reseller, idx) => (
                          <TableRow key={reseller.reseller_id} className="border-b border-gray-100">
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedResellers.has(reseller.reseller_id)}
                                onChange={(e) => handleSelectReseller(reseller.reseller_id, e.target.checked)}
                                className="rounded"
                                style={{
                                  accentColor: '#E5E7EB',
                                  borderColor: '#E5E7EB'
                                }}
                              />
                            </TableCell>
                            <TableCell className="w-16">{resellersPagination.startIndex + idx + 1}</TableCell>
                            <TableCell className="min-w-[120px] text-sm text-gray-900">{reseller.reseller_id}</TableCell>
                            <TableCell className="font-medium min-w-[200px] text-sm text-gray-900">{reseller.reseller_name}</TableCell>
                            <TableCell className="min-w-[180px] text-sm text-gray-900">{reseller.reseller_email_no}</TableCell>
                            <TableCell className="min-w-[180px] text-sm text-gray-900">{reseller.whitelisted_domain}</TableCell>
                            <TableCell className="w-32">
                              {getStatusBadge(reseller.admin_approved)}
                            </TableCell>
                            <TableCell className="p-1 w-20 text-right">
                              <button
                                onClick={() => handleApproveReseller(reseller)}
                                className="text-green-600 hover:text-green-700 hover:underline text-sm"
                              >
                                Approve
                              </button>
                            </TableCell>
                            <TableCell className="p-1 w-20 text-right">
                              <button
                                onClick={() => {
                                  setSelectedReseller(reseller)
                                  setRejectResellerModalOpen(true)
                                }}
                                className="text-red-600 hover:text-red-700 hover:underline text-sm"
                              >
                                Reject
                              </button>
                            </TableCell>
                            <TableCell className="p-1 w-12 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical className="h-4 w-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedReseller(reseller)
                                      setResellerModalOpen(true)
                                    }}
                                  >
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setSelectedReseller(reseller)
                                      handleEditReseller()
                                    }}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination */}
                {resellersPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 px-2">
                    <div className="text-sm text-gray-600">
                      Showing {resellersPagination.startIndex + 1} to {Math.min(resellersPagination.endIndex, filteredResellers.length)} of {filteredResellers.length} results
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
                        {Array.from({ length: resellersPagination.totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === resellersPagination.totalPages ||
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
                        onClick={() => setCurrentPage(prev => Math.min(resellersPagination.totalPages, prev + 1))}
                        disabled={currentPage === resellersPagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enquiries Table */}
            {activeTab === "enquiries" && (
              <div className="mt-4">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="w-12">
                          <input
                            type="checkbox"
                            checked={selectedEnquiries.size === enquiriesPagination.paginatedData.length && enquiriesPagination.paginatedData.length > 0 && enquiriesPagination.paginatedData.every(e => selectedEnquiries.has(e.enquiry_id))}
                            onChange={(e) => handleSelectAllEnquiries(e.target.checked)}
                            className="rounded"
                            style={{
                              accentColor: '#E5E7EB',
                              borderColor: '#E5E7EB'
                            }}
                          />
                        </TableHead>
                        <TableHead className="font-medium w-16">S. No</TableHead>
                        <TableHead className="font-medium min-w-[150px]">Name</TableHead>
                        <TableHead className="font-medium min-w-[150px]">Company</TableHead>
                        <TableHead className="font-medium min-w-[180px]">Email</TableHead>
                        <TableHead className="font-medium min-w-[120px]">Phone</TableHead>
                        <TableHead className="font-medium min-w-[100px]">User Type</TableHead>
                        <TableHead className="font-medium w-32">Status</TableHead>
                        <TableHead className="font-medium min-w-[120px]">Date</TableHead>
                        <TableHead className="font-medium min-w-[200px]">Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enquiriesPagination.paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                            No enquiries found
                          </TableCell>
                        </TableRow>
                      ) : (
                        enquiriesPagination.paginatedData.map((enquiry, idx) => {
                          return (
                            <TableRow 
                              key={enquiry.enquiry_id}
                              className={`border-b border-gray-100 cursor-pointer transition-colors ${enquiry.status === 'new' ? 'bg-blue-50/30' : ''}`}
                              onClick={() => handleShowMessage(enquiry)}
                            >
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  checked={selectedEnquiries.has(enquiry.enquiry_id)}
                                  onChange={(e) => handleSelectEnquiry(enquiry.enquiry_id, e.target.checked)}
                                  className="rounded"
                                  style={{
                                    accentColor: '#E5E7EB',
                                    borderColor: '#E5E7EB'
                                  }}
                                />
                              </TableCell>
                              <TableCell className="w-16">{enquiriesPagination.startIndex + idx + 1}</TableCell>
                              <TableCell className="font-medium min-w-[150px] text-sm text-gray-900">
                                {enquiry.full_name || 'Unknown'}
                              </TableCell>
                              <TableCell className="min-w-[150px] text-sm text-gray-900">
                                {enquiry.company_name || '-'}
                              </TableCell>
                              <TableCell className="min-w-[180px] text-sm text-gray-900 truncate max-w-[180px]">
                                {enquiry.email || '-'}
                              </TableCell>
                              <TableCell className="min-w-[120px] text-sm text-gray-900">
                                {enquiry.phone || '-'}
                              </TableCell>
                              <TableCell className="min-w-[100px]">
                                {enquiry.user_type && enquiry.user_type !== 'anonymous' ? (
                                  <Badge variant="outline" className="text-xs">
                                    {enquiry.user_type.toUpperCase()}
                                  </Badge>
                                ) : (
                                  <span className="text-sm text-gray-400">Anonymous</span>
                                )}
                              </TableCell>
                              <TableCell className="w-32">
                                {enquiry.status === 'new' ? (
                                  <Badge variant="default" className="bg-blue-600 text-white text-xs">
                                    New
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">
                                    Read
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="min-w-[120px] text-sm text-gray-500">
                                {getRelativeTime(enquiry.created_at)}
                              </TableCell>
                              <TableCell className="min-w-[200px]" onClick={(e) => e.stopPropagation()}>
                                <div className="text-sm text-gray-700 line-clamp-2">
                                  {enquiry.message ? (
                                    enquiry.message.length > 100 ? (
                                      <>
                                        {enquiry.message.substring(0, 100)}...
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleShowMessage(enquiry)
                                          }}
                                          className="text-blue-600 hover:text-blue-700 hover:underline text-sm ml-1"
                                        >
                                          more
                                        </button>
                                      </>
                                    ) : (
                                      enquiry.message
                                    )
                                  ) : (
                                    'No message provided'
                                  )}
                                </div>
                              </TableCell>
                              </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination */}
                {enquiriesPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 px-2">
                    <div className="text-sm text-gray-600">
                      Showing {enquiriesPagination.startIndex + 1} to {Math.min(enquiriesPagination.endIndex, filteredEnquiries.length)} of {filteredEnquiries.length} results
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
                        {Array.from({ length: enquiriesPagination.totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === enquiriesPagination.totalPages ||
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
                        onClick={() => setCurrentPage(prev => Math.min(enquiriesPagination.totalPages, prev + 1))}
                        disabled={currentPage === enquiriesPagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        )}
      </div>

      {/* Modals and Drawers */}
      {selectedAgent && (
        <>
          <AgentPreviewModal
            agent={selectedAgent}
            open={agentDetailsOpen}
            onOpenChange={setAgentDetailsOpen}
            onApprove={handleApproveAgent}
            onReject={() => setRejectAgentModalOpen(true)}
          />
          <EditAgentModal
            agent={selectedAgent}
            open={editAgentModalOpen}
            onOpenChange={setEditAgentModalOpen}
            onSave={() => {
              // Refresh agent list after successful save
              fetchAgents()
              setEditAgentModalOpen(false)
            }}
          />
          <RejectAgentModal
            agent={selectedAgent}
            open={rejectAgentModalOpen}
            onOpenChange={setRejectAgentModalOpen}
            onReject={handleRejectAgent}
          />
        </>
      )}

      {selectedISV && (
        <>
          <ISVDetailsModal
            isv={selectedISV}
            open={isvModalOpen}
            onOpenChange={setISVModalOpen}
            onApprove={handleApproveISV}
            onReject={() => setRejectISVModalOpen(true)}
            onEdit={handleEditISV}
          />
          <RejectISVModal
            isv={selectedISV}
            open={rejectISVModalOpen}
            onOpenChange={setRejectISVModalOpen}
            onReject={handleRejectISV}
          />
          <EditISVModal
            isv={selectedISV}
            open={editISVModalOpen}
            onOpenChange={setEditISVModalOpen}
            onSuccess={handleEditSuccess}
          />
        </>
      )}

      {selectedReseller && (
        <>
          <ResellerDetailsModal
            reseller={selectedReseller}
            open={resellerModalOpen}
            onOpenChange={setResellerModalOpen}
            onApprove={handleApproveReseller}
            onReject={() => setRejectResellerModalOpen(true)}
            onEdit={handleEditReseller}
          />
          <RejectResellerModal
            reseller={selectedReseller}
            open={rejectResellerModalOpen}
            onOpenChange={setRejectResellerModalOpen}
            onReject={handleRejectReseller}
          />
          <EditResellerModal
            reseller={selectedReseller}
            open={editResellerModalOpen}
            onOpenChange={setEditResellerModalOpen}
            onSuccess={handleEditSuccess}
          />
        </>
      )}

      {/* Message Modal for Enquiries */}
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
            {selectedMessage?.email && (
              <DialogDescription>
                {selectedMessage.email}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-50 border rounded-lg p-4 md:p-6 max-h-[60vh] overflow-y-auto">
              <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedMessage?.message || 'No message provided'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
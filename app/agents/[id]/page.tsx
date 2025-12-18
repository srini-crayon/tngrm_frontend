import Link from "next/link"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Card, CardContent } from "../../../components/ui/card"
import { ChevronLeft, ChevronRight, Code, Lock, ExternalLink, FileText } from "lucide-react"
import DemoAssetsViewer from "../../../components/demo-assets-viewer"
import ReadMore from "../../../components/read-more"
import CollapsibleList from "../../../components/collapsible-list"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion"
import { readFileSync } from "fs"
import { join } from "path"
import ScrollToTop from "../../../components/scroll-to-top"
import { DocumentationSection } from "../../../components/documentation-section"
import { DemoAccessLink } from "../../../components/demo-access-link"
import { AgentIcon } from "../../../components/agent-icon"
import { ISVPartnerButton } from "../../../components/isv-partner-button"
import { RelatedAgentsSidebar } from "../../../components/related-agents-sidebar"

type AgentDetailApiResponse = {
  agent?: {
    agent_id: string
    agent_name?: string
    description?: string
    by_persona?: string
    by_value?: string
    asset_type?: string
    demo_link?: string
    demo_preview?: string
    features?: string
    roi?: string
    tags?: string
    by_capability?: string
    service_provider?: string
  }
  capabilities?: Array<{ serial_id?: string; by_capability?: string }>
  deployments?: Array<{
    by_capability_id?: string
    service_id?: string
    by_capability?: string
    service_provider?: string
    service_name?: string
    deployment?: string
    cloud_region?: string
    deployment_id?: string
    capability_name?: string
  }>
  demo_assets?: Array<{
    demo_asset_link?: string
    demo_link?: string
    asset_url?: string
    asset_file_path?: string
    demo_asset_name?: string
    demo_asset_type?: string
    demo_asset_id?: string
  }>
  documentation?: Array<{
    agent_id?: string
    sdk_details?: string
    swagger_details?: string
    sample_input?: string
    sample_output?: string
    security_details?: string
    related_files?: string
    doc_id?: string
  }>
  isv_info?: {
    isv_id?: string
    isv_name?: string
    isv_address?: string
    isv_domain?: string
    isv_mob_no?: string
    isv_email_no?: string
    mou_file_path?: string
    admin_approved?: string
  }
}

type BundledAgentsResponse = {
  success: boolean
  data?: {
    agent_id: string
    agent_name: string
    created_at: string
    bundled_agents?: Array<{
      agent_id: string
      agent_name: string
      description?: string
      demo_preview?: string
      admin_approved?: string
      isv_id?: string
      asset_type?: string
      by_persona?: string
      by_value?: string
      demo_link?: string
      features?: string
      roi?: string
      tags?: string
      agents_ordering?: string | number
      created_at?: string
    }>
  }
}

type SimilarAgentsResponse = {
  agent_id: string
  similar_agents?: Array<{
    agent_id: string
    agent_name: string
    description?: string
    demo_preview?: string
    admin_approved?: string
    isv_id?: string
    asset_type?: string
    by_persona?: string
    by_value?: string
    demo_link?: string
    features?: string
    roi?: string
    tags?: string
    agents_ordering?: string | number
    created_at?: string
  }>
}

async function fetchAgentDetail(agentId: string) {
  try {
    const res = await fetch(`https://agents-store.onrender.com/api/agents/${agentId}`, { cache: "no-store" })
    if (!res.ok) throw new Error(`Failed to fetch agent ${agentId}: ${res.status}`)
    const data: AgentDetailApiResponse = await res.json()
    // Check if agent is approved before returning
    if (data?.agent) {
      // Fetch agent list to check approval status
      const agentsRes = await fetch("https://agents-store.onrender.com/api/agents", { cache: "no-store" })
      if (agentsRes.ok) {
        const agentsData = await agentsRes.json()
        const agentInList = agentsData?.agents?.find((a: any) => a.agent_id === agentId)
        // Only return data if agent is approved
        if (agentInList?.admin_approved === "yes") {
          return data
        }
      }
    }
    // Return null if not approved or not found
    return null
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return null
  }
}

async function fetchBundledAgents(agentId: string) {
  try {
    // Fetch bundled agents from the API
    const res = await fetch(`https://agents-store.onrender.com/api/agents/${agentId}/bundled`, { cache: "no-store" })
    if (res.ok) {
      const data: BundledAgentsResponse = await res.json()
      // eslint-disable-next-line no-console
      console.log('Bundled Agents API Response:', JSON.stringify(data, null, 2))
      
      // Check if response has bundled_agents array
      if (data?.success && data?.data?.bundled_agents && Array.isArray(data.data.bundled_agents) && data.data.bundled_agents.length > 0) {
        // Map bundled_agents directly to the format needed by RelatedAgentsSidebar
        const bundledAgents = data.data.bundled_agents
          .map((agent) => ({
            agent_id: agent.agent_id,
            agent_name: agent.agent_name || 'Agent',
            description: agent.description || 'Agent description',
            demo_preview: agent.demo_preview || '',
          }))
        return bundledAgents
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Bundled agents API error:', err)
  }

  // Return null if no bundled agents found or empty list
  return null
}

async function fetchSimilarAgents(agentId: string) {
  try {
    // Fetch similar agents from the API as fallback
    const res = await fetch(`https://agents-store.onrender.com/api/agents/${agentId}/similar?limit=4`, { cache: "no-store" })
    if (res.ok) {
      const data: SimilarAgentsResponse = await res.json()
      // eslint-disable-next-line no-console
      console.log('Similar Agents API Response:', JSON.stringify(data, null, 2))
      
      // Check if response has similar_agents array
      if (data?.similar_agents && Array.isArray(data.similar_agents) && data.similar_agents.length > 0) {
        // Map similar_agents to the format needed by RelatedAgentsSidebar
        const similarAgents = data.similar_agents
          .map((agent) => ({
            agent_id: agent.agent_id,
            agent_name: agent.agent_name || 'Agent',
            description: agent.description || 'Agent description',
            demo_preview: agent.demo_preview || '',
          }))
        return similarAgents
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Similar agents API error:', err)
  }

  // Return null if no similar agents found or empty list
  return null
}

function readReadmeFile(): string {
  try {
    const readmePath = join(process.cwd(), 'README.md')
    return readFileSync(readmePath, 'utf8')
  } catch (err) {
    console.error('Error reading README.md:', err)
    return '# Documentation\n\nDocumentation content is not available at this time.'
  }
}

function formatCodeBlock(content: string): string {
  // Enhanced markdown formatter
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text'
      return `<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto border"><code class="language-${language}">${code.trim()}</code></pre>`
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Lists
    .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^(?!<[h|l])/gm, '<p class="mb-4">')
    .replace(/(?<!>)$/gm, '</p>')
}

export default async function AgentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchAgentDetail(id)

  // If agent doesn't exist or is not approved, show error and redirect
  if (!data || !data.agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
        <p className="text-muted-foreground mb-6">This agent is not available or not approved yet.</p>
        <Link href="/agents" className="inline-flex items-center text-blue-600">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Agents
        </Link>
      </div>
    )
  }

  const agent = data.agent
  const readmeContent = readReadmeFile()

  const title = agent?.agent_name || "Business Representative"
  const description = agent?.description ||
    `Whether you're nurturing inbound leads, answering marketing inquiries, or booking meetings, this tool
                  streamlines engagement and ensures no opportunity slips through the cracks.`
  const categories = data.capabilities?.map((c) => c.by_capability || "").filter(Boolean) || ["Marketing"]
  const personas = agent?.by_persona ? [agent.by_persona] : ["Executives (CXO)"]
  const valueProps = agent?.by_value ? [agent.by_value] : ["Productivity"]
  const worksWith = data.deployments?.slice(0, 1).map((d) => d.service_name || "").filter(Boolean) || ["OpenAI GPT-4o"]

  // Compute next agent id and names (server-side) to enable Next Agent navigation
  let nextAgentId: string | null = null
  let prevAgentId: string | null = null
  let nextAgentName: string | null = null
  let prevAgentName: string | null = null
  let relatedAgents: any[] = []
  let agentsSource: 'bundled' | 'similar' | null = null
  try {
    const agentsRes = await fetch("https://agents-store.onrender.com/api/agents", { cache: "no-store" })
    if (agentsRes.ok) {
      const agentsJson = await agentsRes.json()
      const approvedAgents = (agentsJson?.agents || [])
        .filter((a: any) => a?.admin_approved === "yes")
        .filter((a: any) => a?.agent_id)

      if (approvedAgents.length > 0) {
        const idx = Math.max(0, approvedAgents.findIndex((a: any) => a?.agent_id === id))
        const nextIdx = idx >= 0 ? (idx + 1) % approvedAgents.length : 0
        const prevIdx = idx >= 0 ? (idx - 1 + approvedAgents.length) % approvedAgents.length : 0

        const nextAgent = approvedAgents[nextIdx]
        const prevAgent = approvedAgents[prevIdx]

        nextAgentId = nextAgent?.agent_id || null
        prevAgentId = prevAgent?.agent_id || null
        nextAgentName = nextAgent?.agent_name || null
        prevAgentName = prevAgent?.agent_name || null

        // Fetch bundled agents first, then fallback to similar agents
        const bundledAgents = await fetchBundledAgents(id)
        if (bundledAgents && bundledAgents.length > 0) {
          relatedAgents = bundledAgents
          agentsSource = 'bundled'
        } else {
          // Fallback: Fetch similar agents if bundled agents is empty
          const similarAgents = await fetchSimilarAgents(id)
          if (similarAgents && similarAgents.length > 0) {
            relatedAgents = similarAgents
            agentsSource = 'similar'
          }
        }
        // If no bundled agents or similar agents, relatedAgents remains empty array
        // RelatedAgentsSidebar component will handle empty state by returning null
      }
    }
  } catch {
    // ignore - keep nextAgentId null
  }
  return (
    <>
      <ScrollToTop />
      {/* Main Content */}
      <section className="relative py-12">
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '360px',
            background: 'radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFF 100%)',
            zIndex: -1,
          }}
        />
        <div className="w-full px-8 md:px-12 lg:px-16 mx-auto" style={{ maxWidth: "1407px" }}>
          <div className="flex flex-col lg:flex-row gap-12 items-start w-full">
            <div style={{ flex: '0 0 40%', maxWidth: '40%' }}>
              <Link
                href="/agents"
                className="inline-flex items-center mb-4"
                style={{
                  color: '#091917',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '150%',
                }}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Back to Agent Store
              </Link>
              <h1
                className="mb-2"
                style={{
                  color: 'var(--Interface-Color-Primary-900, #091917)',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '52px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '54px',
                }}
              >
                {title}
              </h1>
              <div className="mt-2 space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <span
                    style={{
                      color: '#091917',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: 'normal',
                    }}
                  >
                    Agent
                  </span>
                  <span
                    style={{
                      color: '#E3E3E3',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: 'normal',
                    }}
                  >
                    |
                  </span>
                  <span
                    style={{
                      color: '#091917',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: 'normal',
                    }}
                  >
                    Built by :
                  </span>
                  {data?.isv_info?.isv_domain ? (
                    <a
                      href={data.isv_info.isv_domain.startsWith('http') ? data.isv_info.isv_domain : `https://${data.isv_info.isv_domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#155EEF',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: 'normal',
                        textDecoration: 'none',
                      }}
                      className="hover:underline"
                    >
                      {data?.isv_info?.isv_name || 'Crayon Data India Pvt Ltd'}
                    </a>
                  ) : (
                    <span
                      style={{
                        color: '#155EEF',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        lineHeight: 'normal',
                      }}
                    >
                      {data?.isv_info?.isv_name || 'Crayon Data India Pvt Ltd'}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <div
                  style={{
                    color: '#344054',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '140%',
                    maxWidth: '582px',
                  }}
                >
                  <ReadMore text={description.replace(/\\n/g, '\n')} className="mb-6" />
                </div>
              </div>

              <div className="mb-8 space-y-3">
                <div className="flex items-start gap-3">
                  <span
                    className="whitespace-nowrap min-w-[130px]"
                    style={{
                      color: '#101828',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: 'normal',
                    }}
                  >
                    Categories :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c, i) => (
                      <Badge key={i} variant="default" className="text-xs rounded-[4px]">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span
                    className="whitespace-nowrap min-w-[130px]"
                    style={{
                      color: '#101828',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: 'normal',
                    }}
                  >
                    Tags :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(agent?.tags ? agent.tags.split(',').map(t => t.trim()).filter(Boolean) : []).map((t, i) => (
                      <Badge key={i} variant="default" className="text-xs rounded-[4px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span
                    className="whitespace-nowrap min-w-[130px]"
                    style={{
                      color: '#101828',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: 'normal',
                    }}
                  >
                    Target Personas :
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {personas.map((p, i) => (
                      <Badge key={i} variant="default" className="text-xs rounded-[4px]">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span
                    className="whitespace-nowrap min-w-[130px]"
                    style={{
                      color: '#101828',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: 'normal',
                    }}
                  >
                    Value Propositions:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {valueProps.map((v, i) => (
                      <Badge key={i} variant="default" className="text-xs rounded-[4px]">
                        {v}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Image Container */}
            <div style={{ flex: '0 0 60%', maxWidth: '60%' }} className="w-full">
              {((data?.demo_assets && data.demo_assets.length > 0) || data?.agent?.demo_preview) && (
                <DemoAssetsViewer
                  assets={data.demo_assets || []}
                  demoPreview={data?.agent?.demo_preview}
                />
              )}
            </div>
          </div>
          <div style={{ marginTop: '42px', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <ISVPartnerButton demoLink={data?.agent?.demo_link} />
          </div>
        </div>
      </section>

      {/* Features, ROI, Deployment, Docs Section */}
      <section className="relative py-12 px-8 md:px-12 lg:px-16" style={{ overflowX: "hidden" }}>
        <div className="w-full mx-auto" style={{ maxWidth: "1407px" }}>
          <div className="flex gap-8 items-start justify-center">
            <div className="flex-1" style={{ maxWidth: '740px' }}>
              <Tabs defaultValue="features" className="w-full">
                <TabsList className="relative flex gap-8 justify-start bg-transparent p-0 h-auto rounded-none" style={{ borderBottom: "none", marginBottom: "8px" }}>
                  <TabsTrigger
                    value="features"
                    className="relative pb-2 bg-transparent border-0 rounded-none data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent h-auto shadow-none data-[state=active]:shadow-none text-left"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#344054",
                      padding: "8px",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "none",
                      textAlign: "left",
                    }}
                  >
                    Features
                  </TabsTrigger>
                  <TabsTrigger
                    value="roi"
                    className="relative pb-2 bg-transparent border-0 rounded-none data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent h-auto shadow-none data-[state=active]:shadow-none text-left"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#344054",
                      padding: "8px",
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "none",
                      textAlign: "left",
                    }}
                  >
                    ROI
                  </TabsTrigger>
                  {data?.deployments && data.deployments.length > 0 && (
                    <TabsTrigger
                      value="deployment"
                      className="relative pb-2 bg-transparent border-0 rounded-none data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent h-auto shadow-none data-[state=active]:shadow-none text-left"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#344054",
                        padding: "8px",
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                        transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "none",
                        textAlign: "left",
                      }}
                    >
                      Deployment
                    </TabsTrigger>
                  )}
                  {data?.documentation && data.documentation.length > 0 && data.documentation[0] && (
                    (() => {
                      const doc = data.documentation[0]
                      const hasContent = doc.sdk_details || doc.swagger_details || doc.sample_input || doc.sample_output || doc.security_details || doc.related_files
                      return hasContent ? (
                        <TabsTrigger
                          value="docs"
                          className="relative pb-2 bg-transparent border-0 rounded-none data-[state=active]:bg-transparent data-[state=inactive]:bg-transparent h-auto shadow-none data-[state=active]:shadow-none text-left"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "#344054",
                            padding: "8px",
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            boxShadow: "none",
                            textAlign: "left",
                          }}
                        >
                          Docs
                        </TabsTrigger>
                      ) : null
                    })()
                  )}
                </TabsList>
                <TabsContent value="features" style={{ marginTop: "8px" }}>
                  {agent?.features && agent.features !== "na" ? (
                    (() => {
                      const items = agent.features
                        .replace(/\\n/g, '\n')
                        .split(/[;\n]+/)
                        .map(s => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, ''))
                        .filter(Boolean)

                      // Split into Scope (first items) and Instructions (numbered items or remaining)
                      const scopeItems = items.filter((item, idx) => {
                        // If item starts with a number, it's likely an instruction
                        return !/^\d+\./.test(item.trim())
                      })
                      const instructionItems = items.filter((item) => {
                        return /^\d+\./.test(item.trim())
                      }).map(item => item.replace(/^\d+\.\s*/, '').trim())

                      return (
                        <div>
                          {scopeItems.length > 0 && (
                            <div style={{ maxWidth: '640px', marginBottom: '8px' }}>
                              <h3
                                style={{
                                  fontFamily: 'Poppins, sans-serif',
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  color: '#101828',
                                  marginBottom: '8px',
                                }}
                              >
                                Scope
                              </h3>
                              <ul
                                style={{
                                  fontFamily: 'Poppins, sans-serif',
                                  fontSize: '14px',
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  color: '#344054',
                                  lineHeight: '150%',
                                  listStyle: 'disc',
                                  paddingLeft: '21px',
                                }}
                                className="space-y-0"
                              >
                                {scopeItems.map((it, i) => (
                                  <li key={i} style={{ marginBottom: i < scopeItems.length - 1 ? '8px' : '0' }}>
                                    {it}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {instructionItems.length > 0 && (
                            <div>
                              <h3
                                style={{
                                  fontFamily: 'Inter, sans-serif',
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  color: '#101828',
                                  marginBottom: '8px',
                                }}
                              >
                                Instructions
                              </h3>
                              <ol
                                style={{
                                  fontFamily: 'Inter, sans-serif',
                                  fontSize: '14px',
                                  fontWeight: 400,
                                  color: '#344054',
                                  lineHeight: '1.5',
                                  listStyle: 'decimal',
                                  paddingLeft: '21px',
                                }}
                                className="space-y-0"
                              >
                                {instructionItems.map((it, i) => (
                                  <li key={i} style={{ marginBottom: i < instructionItems.length - 1 ? '0' : '0' }}>
                                    {it}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {scopeItems.length === 0 && instructionItems.length === 0 && (
                            <ul
                              style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '14px',
                                fontWeight: 400,
                                color: '#344054',
                                lineHeight: '1.5',
                                listStyle: 'disc',
                                paddingLeft: '21px',
                              }}
                              className="space-y-0"
                            >
                              {items.map((it, i) => (
                                <li key={i} style={{ marginBottom: i < items.length - 1 ? '0' : '0' }}>
                                  {it}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )
                    })()
                  ) : (
                    <p className="text-muted-foreground">Features information is not available for this agent.</p>
                  )}
                </TabsContent>
                <TabsContent value="roi" className="mt-6">
                  {agent?.roi && agent.roi !== "na" ? (
                    (() => {
                      const items = agent.roi
                        .replace(/\\n/g, '\n')
                        .split(/[;\n]+/)
                        .map(s => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, ''))
                        .filter(Boolean)
                      return (
                        <ul
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#344054',
                            lineHeight: '1.5',
                            listStyle: 'disc',
                            paddingLeft: '21px',
                          }}
                          className="space-y-0"
                        >
                          {items.map((it, i) => (
                            <li key={i} style={{ marginBottom: i < items.length - 1 ? '0' : '0' }}>
                              {it}
                            </li>
                          ))}
                        </ul>
                      )
                    })()
                  ) : (
                    <p
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        color: '#6B7280',
                      }}
                    >
                      ROI information is not available for this agent.
                    </p>
                  )}
                </TabsContent>
                {data?.deployments && data.deployments.length > 0 && (
                  <TabsContent value="deployment" className="mt-6">
                    {(() => {
                      const groups: Record<string, typeof data.deployments> = {}
                      for (const d of (data?.deployments || [])) {
                        const key = d?.service_provider || 'Other'
                        if (!groups[key]) groups[key] = []
                        groups[key].push(d)
                      }
                      const entries = Object.entries(groups)
                      return (
                        <Accordion type="multiple" className="w-full rounded-md border">
                          {entries.map(([provider, items]) => (
                            <AccordionItem key={provider} value={provider} className="px-4">
                              <AccordionTrigger className="text-sm font-semibold">
                                {provider}
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="grid gap-3 md:grid-cols-2">
                                  {items.map((d, idx) => (
                                    <div key={(d?.service_id || provider) + idx} className="rounded-lg border bg-white p-4">
                                      <div className="mb-1 text-sm font-semibold text-[#101828]" style={{ fontFamily: 'Inter, sans-serif' }}>
                                        {d?.service_name || 'Service'}
                                      </div>
                                      <div className="mb-3 text-xs text-[#344054]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '150%' }}>
                                        {d?.by_capability || d?.capability_name || 'Capability'}
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="outline">{d?.deployment || 'Cloud/On-Prem'}</Badge>
                                        <Badge variant="default">{d?.cloud_region || 'Regions'}</Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      )
                    })()}
                  </TabsContent>
                )}
                {data?.documentation && data.documentation.length > 0 && data.documentation[0] && (
                  (() => {
                    const doc = data.documentation[0]
                    const hasContent = doc.sdk_details || doc.swagger_details || doc.sample_input || doc.sample_output || doc.security_details || doc.related_files
                    return hasContent ? (
                      <TabsContent value="docs" className="mt-6">
                        <DocumentationSection documentation={doc} />
                      </TabsContent>
                    ) : null
                  })()
                )}
              </Tabs>
            </div>

            {/* Sidebar - Independent of tabs, always visible to maintain layout */}
            <div className="flex-shrink-0" style={{ minWidth: '490px', width: 'fit-content', maxWidth: '490px', marginTop: '30px', marginRight: '100px' }}>
              {relatedAgents.length > 0 ? (
                <div className="w-full bg-white rounded-xl shadow-md border border-gray-200">
                  <RelatedAgentsSidebar
                    relatedAgents={relatedAgents}
                    agentName={agent?.agent_name}
                    agentsSource={agentsSource}
                  />
                </div>
              ) : (
                <div style={{ minWidth: '490px', width: 'fit-content', maxWidth: '600px', height: '1px' }} aria-hidden="true" />
              )}
            </div>

          </div>

          <div className="mt-10 flex items-center justify-between w-full">
            {prevAgentId ? (
              <Link href={`/agents/${prevAgentId}`} className="inline-flex items-center gap-2 text-blue-600">
                <ChevronLeft className="h-4 w-4" />
                <span className="font-medium">
                  {prevAgentName || "Previous agent"}
                </span>
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 text-gray-400 cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
                <span className="font-medium">Previous agent</span>
              </span>
            )}

            {nextAgentId ? (
              <Link href={`/agents/${nextAgentId}`} className="inline-flex items-center gap-2 text-blue-600 ml-auto">
                <span className="font-medium">
                  {nextAgentName || "Next agent"}
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span className="inline-flex items-center gap-2 text-gray-400 cursor-not-allowed ml-auto">
                <span className="font-medium">Next agent</span>
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </div>
        </div>
      </section>

    </>
  )
}

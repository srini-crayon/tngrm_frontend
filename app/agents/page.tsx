"use client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { AgentSearchChat } from "../../components/agent-search-chat";
import { AgentCard } from "../../components/agent-card";
import ChatDialog from "../../components/chat-dialog";
import { Search } from "lucide-react";
import { VoiceInputControls } from "../../components/voice-input-controls";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useChatStore } from "../../lib/store/chat.store";

// Fallback mock data (minimal) in case the API fails
const fallbackAgents = [
  {
    id: "intelligent-image-analyzer",
    title: "Intelligent Image Analyzer",
    description:
      "Simplifies insurance claim assessment with AI during the insurance claims. By analyzing uploaded images, it identifies affected parts, retrieves repair costs from a database, and generates a detailed damage report.",
    badges: [{ label: "Image Processing", variant: "default" as const }],
    tags: ["CRM", "Claims", "Insurance"],
    capabilities: ["Document Intelligence"],
    providers: ["AWS"],
    deploymentType: "Solution",
    persona: "Operations Teams",
    assetType: "Solution",
  },
];

type Agent = {
  id: string;
  title: string;
  description: string;
  badges: { label: string; variant: "default" }[];
  tags: string[];
  capabilities: string[];
  providers: string[];
  deploymentType: string;
  persona: string;
  assetType: string;
  agents_ordering?: number;
  demoPreview?: string;
};

type ApiAgent = {
  agent_id: string;
  agent_name: string;
  description: string;
  tags: string | null;
  by_value?: string | null;
  by_capability?: string | null;
  service_provider?: string | null;
  asset_type?: string | null;
  by_persona?: string | null;
  admin_approved?: string | null;
  agents_ordering?: string | number | null;
};

async function fetchAgents() {
  try {
    const res = await fetch("https://agents-store.onrender.com/api/agents", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`);
    const data = await res.json();
    // Map API response to AgentCard props
    const apiAgents: ApiAgent[] = data?.agents || [];
    // Filter to only show approved agents
    return apiAgents
      .filter(a => a.admin_approved === "yes")
      .map((a) => ({
      id: a.agent_id,
      title: a.agent_name,
      description: a.description,
      // API `tags` may be a comma-separated string; convert to array
      tags: a.tags
        ? a.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
        : [],
      badges: [
        { label: (a as any).by_value || "", variant: "default" as const },
      ],
      capabilities: a.by_capability ? a.by_capability.split(",").map(c => c.trim()).filter(Boolean) : [],
      providers: a.service_provider ? a.service_provider.split(",").map(p => p.trim()).filter(Boolean) : [],
      deploymentType: a.asset_type || "",
      persona: a.by_persona || "",
      assetType: a.asset_type || "",
    }));
  } catch (err) {
    // On any error return fallback
    // eslint-disable-next-line no-console
    console.error(err);
    return fallbackAgents;
  }
}

export default function AgentLibraryPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("All");
  const [capabilityFilter, setCapabilityFilter] = useState<string>("All");
  const [deploymentFilter, setDeploymentFilter] = useState<string>("All");
  const [personaFilter, setPersonaFilter] = useState<string>("All");
  const [createChatOpen, setCreateChatOpen] = useState(false);
  const PAGE_SIZE = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [aiCurrentPage, setAiCurrentPage] = useState(1);
  
  const searchParams = useSearchParams();
  const { messages } = useChatStore();
  const agentIdFromUrl = searchParams.get('agentId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://agents-store.onrender.com/api/agents", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`);
        const data = await res.json();
        
        const apiAgents: ApiAgent[] = data?.agents || [];
        const mappedAgents = apiAgents
          .filter(a => a.admin_approved === "yes") // Only show approved agents
          .map((a) => {
            // Parse agents_ordering - handle "na", null, undefined, or numeric string
            let ordering: number | undefined;
            if (a.agents_ordering !== null && a.agents_ordering !== undefined && a.agents_ordering !== "na") {
              const parsed = typeof a.agents_ordering === 'number' 
                ? a.agents_ordering 
                : parseInt(String(a.agents_ordering), 10);
              ordering = isNaN(parsed) ? undefined : parsed;
            }
            
            // Parse demo_preview to get first image URL
            // Format: "url1,JPG,url2,JPG,..." or "url1,url2,..."
            const demoPreviewUrls = (a as any).demo_preview 
              ? (a as any).demo_preview
                  .split(",")
                  .map((item: string) => item.trim())
                  .filter((item: string) => {
                    // Filter out non-URL items (like "JPG", "PNG", etc.) and keep only URLs
                    return item && (item.startsWith("http://") || item.startsWith("https://"));
                  })
              : [];
            const firstPreviewImage = demoPreviewUrls.length > 0 ? demoPreviewUrls[0] : undefined;
            
            return {
              id: a.agent_id,
              title: a.agent_name,
              description: a.description,
              tags: a.tags
                ? a.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [],
              badges: [
                { label: (a as any).by_value || "", variant: "default" as const },
              ],
              // Add new fields for filtering
              capabilities: a.by_capability ? a.by_capability.split(",").map(c => c.trim()).filter(Boolean) : [],
              providers: a.service_provider ? a.service_provider.split(",").map(p => p.trim()).filter(Boolean) : [],
              deploymentType: a.asset_type || "",
              persona: a.by_persona || "",
              assetType: a.asset_type || "",
              agents_ordering: ordering,
              demoPreview: firstPreviewImage,
            };
          })
          // Sort by agents_ordering: numeric values first (ascending), then undefined/null/"na" at the end
          .sort((a, b) => {
            const aOrder = a.agents_ordering ?? Number.MAX_SAFE_INTEGER;
            const bOrder = b.agents_ordering ?? Number.MAX_SAFE_INTEGER;
            return aOrder - bOrder;
          });
        
        setAgents(mappedAgents.length > 0 ? mappedAgents : fallbackAgents);
      } catch (err) {
        console.error(err);
        setError("Failed to load agents");
        setAgents(fallbackAgents);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);


  const allCapabilities = useMemo(() => {
    const capabilities = new Set<string>();
    agents.forEach(agent => {
      agent.capabilities.forEach(capability => capabilities.add(capability));
    });
    return Array.from(capabilities).sort();
  }, [agents]);

  const allProviders = useMemo(() => {
    const providers = new Set<string>();
    agents.forEach(agent => {
      agent.providers.forEach(provider => providers.add(provider));
    });
    return Array.from(providers).sort();
  }, [agents]);

  const allDeploymentTypes = useMemo(() => {
    const types = new Set<string>();
    agents.forEach(agent => {
      if (agent.deploymentType) types.add(agent.deploymentType);
    });
    return Array.from(types).sort();
  }, [agents]);

  const allPersonas = useMemo(() => {
    const personas = new Set<string>();
    agents.forEach(agent => {
      if (agent.persona) personas.add(agent.persona);
    });
    return Array.from(personas).sort();
  }, [agents]);

  // Get AI searched agent IDs from the latest chat message
  const aiSearchedAgentIds = useMemo(() => {
    // Find the most recent assistant message with filteredAgentIds
    const latestMessageWithAgents = messages
      .filter(msg => msg.role === "assistant" && msg.filteredAgentIds && msg.filteredAgentIds.length > 0)
      .slice(-1)[0];
    
    return latestMessageWithAgents?.filteredAgentIds || null;
  }, [messages]);

  // Helper function to apply manual filters to agents
  const applyManualFilters = (agentList: Agent[]) => {
    let filtered = agentList;
    
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(agent => 
        agent.title.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.tags.some(tag => tag.toLowerCase().includes(q)) ||
        agent.capabilities.some(cap => cap.toLowerCase().includes(q)) ||
        agent.providers.some(prov => prov.toLowerCase().includes(q))
      );
    }
    
    if (providerFilter !== "All") {
      filtered = filtered.filter(agent => 
        agent.providers.includes(providerFilter)
      );
    }
    
    if (capabilityFilter !== "All") {
      filtered = filtered.filter(agent => 
        agent.capabilities.includes(capabilityFilter)
      );
    }
    
    if (deploymentFilter !== "All") {
      filtered = filtered.filter(agent => 
        agent.deploymentType === deploymentFilter
      );
    }
    
    if (personaFilter !== "All") {
      filtered = filtered.filter(agent => 
        agent.persona === personaFilter
      );
    }
    
    return filtered;
  };

  // AI searched agents (filtered by manual filters)
  const aiSearchedAgents = useMemo(() => {
    if (!aiSearchedAgentIds) return [];
    
    const aiAgents = agents.filter(agent => aiSearchedAgentIds.includes(agent.id));
    const filtered = applyManualFilters(aiAgents);
    // Sort by agents_ordering to maintain order
    return filtered.sort((a, b) => {
      const aOrder = a.agents_ordering ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.agents_ordering ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });
  }, [agents, aiSearchedAgentIds, search, providerFilter, capabilityFilter, deploymentFilter, personaFilter]);

  // All agents (filtered by manual filters)
  const allFilteredAgents = useMemo(() => {
    // Filter by agent ID from URL parameter (highest priority)
    if (agentIdFromUrl) {
      return agents.filter(agent => agent.id === agentIdFromUrl);
    }
    
    const filtered = applyManualFilters(agents);
    // Sort by agents_ordering (already sorted in fetchData, but re-sort after filtering to maintain order)
    return filtered.sort((a, b) => {
      const aOrder = a.agents_ordering ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.agents_ordering ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder;
    });
  }, [agents, search, providerFilter, capabilityFilter, deploymentFilter, personaFilter, agentIdFromUrl]);

  const aiTotalPages = Math.max(1, Math.ceil(aiSearchedAgents.length / PAGE_SIZE));
  const totalPages = Math.max(1, Math.ceil(allFilteredAgents.length / PAGE_SIZE));

  const paginatedAiAgents = useMemo(() => {
    const start = (aiCurrentPage - 1) * PAGE_SIZE;
    return aiSearchedAgents.slice(start, start + PAGE_SIZE);
  }, [aiSearchedAgents, aiCurrentPage, PAGE_SIZE]);

  const paginatedAgents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return allFilteredAgents.slice(start, start + PAGE_SIZE);
  }, [allFilteredAgents, currentPage, PAGE_SIZE]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, providerFilter, capabilityFilter, deploymentFilter, personaFilter, agentIdFromUrl]);

  useEffect(() => {
    setAiCurrentPage(1);
  }, [aiSearchedAgentIds, search, providerFilter, capabilityFilter, deploymentFilter, personaFilter]);

  useEffect(() => {
    const maxPages = Math.max(1, Math.ceil(allFilteredAgents.length / PAGE_SIZE));
    if (currentPage > maxPages) {
      setCurrentPage(maxPages);
    }
  }, [allFilteredAgents.length, currentPage, PAGE_SIZE]);

  useEffect(() => {
    const maxPages = Math.max(1, Math.ceil(aiSearchedAgents.length / PAGE_SIZE));
    if (aiCurrentPage > maxPages) {
      setAiCurrentPage(maxPages);
    }
  }, [aiSearchedAgents.length, aiCurrentPage, PAGE_SIZE]);

  const renderPaginationControls = (
    current: number,
    total: number,
    onChange: (page: number) => void
  ) => {
    if (total <= 1) return null;
    const pages = Array.from({ length: total }, (_, idx) => idx + 1);
    return (
      <div className="mt-10 flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(Math.max(1, current - 1))}
            disabled={current === 1}
            className="px-4 py-2"
          >
            Previous
          </Button>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onChange(page)}
              className={`h-9 w-9 rounded-full border text-sm font-medium transition-all ${
                page === current
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(Math.min(total, current + 1))}
            disabled={current === total}
            className="px-4 py-2"
          >
            Next
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Page {current} of {total}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col relative">
      {/* Top radial gradient banner fixed to top (no whitespace) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: "100%",
          height: "360px",
          top: 0,
          left: 0,
          background: "radial-gradient(100% 100% at 50% 0%, #FED1E6 0%, #FFFFFF 100%)",
          opacity: 1,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
      {/* Hero Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <span 
                className="inline-block"
                style={{
                  width: "115px",
                  height: "32px",
                  borderRadius: "50px",
                  paddingTop: "4px",
                  paddingRight: "16px",
                  paddingBottom: "4px",
                  paddingLeft: "16px",
                  gap: "8px",
                  opacity: 1,
                  transform: "rotate(-0.28deg)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#F472B6",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "140%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: "#BD0159",
                }}
              >
                Agent Store
              </span>
            </div>

            <h1 className="mb-4 text-center">
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "52px",
                  lineHeight: "54px",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: "#091917",
                  display: "inline-block",
                }}
              >
                The One-Stop Store.
              </span>
            </h1>
            <p
              className="mb-4 text-center"
              style={{
                fontFamily: "Poppins, Inter, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#091917",
              }}
            >
              Discover.Try. Deploy.
            </p>

            <p 
              className="mx-auto mb-8 max-w-2xl text-center"
              style={{
                fontFamily: "Poppins, Inter, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                color: "#374151",
              }}
            >
              Start referring or integrating agents from Tangram.ai store with your clients today to unlock new revenue opportunities, accelerate growth, and deliver intelligent AI solutions at scale.
            </p>

            {/* Centered search bar under subheader */}
            <div className="flex w-full justify-center mb-16">
              <div className="w-full max-w-5xl">
                {/* reuse same search-chat as home */}
                <AgentSearchChat />
              </div>
            </div>

            {/* Category tags - Two Row Scrolling */}
            <div className="mb-12 mx-auto max-w-5xl overflow-hidden">
              {(() => {
                // Get unique agent names from API for first row
                const agentNames = [...new Set(agents.map(agent => agent.title))].slice(0, 20); // Limit to 20 unique names
                const iconColors = ["#7DD3FC", "#3B82F6", "#FCD34D", "#1E40AF", "#FDE047", "#F472B6", "#A855F7", "#FB923C", "#14B8A6"];
                const iconTypes = ["circle", "triangle", "square"];

                // Create agent name tags for first row
                const agentNameTags = agentNames.map((name, idx) => ({
                  text: name,
                  icon: iconTypes[idx % iconTypes.length] as "circle" | "triangle" | "square",
                  color: iconColors[idx % iconColors.length],
                }));

                // Capability tags for second row
                const tagDefinitions = [
                  { icon: "circle", color: "#7DD3FC", text: "Conversational AI & Advisory", capability: "Conversational AI & Advisory" },
                  { icon: "triangle", color: "#3B82F6", text: "Document Passing & Analysis", capability: "Document Passing & Analysis" },
                  { icon: "square", color: "#FCD34D", text: "Image processing", capability: "Image processing" },
                  { icon: "circle", color: "#1E40AF", text: "Video Processing", capability: "Video Processing" },
                  { icon: "triangle", color: "#FDE047", text: "Voice and Meeting", capability: "Voice and Meeting" },
                  { icon: "square", color: "#F472B6", text: "Data Analysis and Insights", capability: "Data Analysis and Insights" },
                  { icon: "circle", color: "#A855F7", text: "Content generation", capability: "Content generation" },
                  { icon: "triangle", color: "#FB923C", text: "Process Automation", capability: "Process Automation" },
                  { icon: "square", color: "#14B8A6", text: "Data Transformation", capability: "Data Transformation" },
                ];

                // Find matching capability from API or use the tag's capability name
                const findMatchingCapability = (tagCapability: string) => {
                  // First try exact match
                  if (allCapabilities.includes(tagCapability)) {
                    return tagCapability;
                  }
                  // Try case-insensitive match
                  const lowerTag = tagCapability.toLowerCase();
                  const match = allCapabilities.find(cap => cap.toLowerCase() === lowerTag);
                  if (match) return match;
                  // Try partial match
                  const partialMatch = allCapabilities.find(cap => 
                    cap.toLowerCase().includes(lowerTag) || lowerTag.includes(cap.toLowerCase())
                  );
                  return partialMatch || tagCapability;
                };

                const renderAgentNameTag = (tag: { text: string; icon: "circle" | "triangle" | "square"; color: string }, key: string) => {
                  return (
                    <button
                      key={key}
                      className="flex items-center bg-white whitespace-nowrap shrink-0 shadow-sm cursor-pointer transition-all hover:shadow-md"
                      style={{
                        height: "32px",
                        paddingTop: "5.5px",
                        paddingRight: "9px",
                        paddingBottom: "6.5px",
                        paddingLeft: "9px",
                        gap: "5px",
                        borderRadius: "999px",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: "#E5E7EB",
                        backgroundColor: "#FFFFFF",
                      }}
                    >
                      {tag.icon === "circle" && <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: tag.color }}></div>}
                      {tag.icon === "triangle" && <div className="h-3 w-3 shrink-0" style={{ backgroundColor: tag.color, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>}
                      {tag.icon === "square" && <div className="h-3 w-3 rounded shrink-0" style={{ backgroundColor: tag.color }}></div>}
                      <span style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "20px",
                        letterSpacing: "0%",
                        verticalAlign: "middle",
                        color: "#344054",
                      }}>
                        {tag.text}
                      </span>
                    </button>
                  );
                };

                const renderCapabilityTag = (tag: typeof tagDefinitions[0], key: string) => {
                  const matchingCapability = findMatchingCapability(tag.capability);
                  const isSelected = capabilityFilter === matchingCapability;
                  return (
                    <button
                      key={key}
                      onClick={() => setCapabilityFilter(isSelected ? "All" : matchingCapability)}
                      className="flex items-center bg-white whitespace-nowrap shrink-0 shadow-sm cursor-pointer transition-all hover:shadow-md"
                      style={{
                        height: "32px",
                        paddingTop: "5.5px",
                        paddingRight: "9px",
                        paddingBottom: "6.5px",
                        paddingLeft: "9px",
                        gap: "5px",
                        borderRadius: "999px",
                        borderWidth: "1px",
                        borderStyle: "solid",
                        borderColor: isSelected ? "#3B82F6" : "#E5E7EB",
                        backgroundColor: isSelected ? "#EFF6FF" : "#FFFFFF",
                      }}
                    >
                      {tag.icon === "circle" && <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: tag.color }}></div>}
                      {tag.icon === "triangle" && <div className="h-3 w-3 shrink-0" style={{ backgroundColor: tag.color, clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}></div>}
                      {tag.icon === "square" && <div className="h-3 w-3 rounded shrink-0" style={{ backgroundColor: tag.color }}></div>}
                      <span style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "20px",
                        letterSpacing: "0%",
                        verticalAlign: "middle",
                        color: isSelected ? "#3B82F6" : "#344054",
                      }}>
                        {tag.text}
                      </span>
                    </button>
                  );
                };

                // Duplicate items multiple times for seamless scrolling
                const duplicatedAgentNames = [...agentNameTags, ...agentNameTags, ...agentNameTags];
                const duplicatedCapabilityTags = [...tagDefinitions, ...tagDefinitions, ...tagDefinitions];

                return (
                  <div className="flex flex-col gap-3">
                    {/* First Row - Left to Right - Agent Names from API */}
                    <div className="overflow-hidden relative">
                      <div className="flex gap-3 animate-scroll-tags" style={{ width: "fit-content", animationDuration: "120s" }}>
                        {duplicatedAgentNames.map((tag, idx) => renderAgentNameTag(tag, `row1-${idx}`))}
                      </div>
                    </div>
                    {/* Second Row - Right to Left - Capability Tags */}
                    <div className="overflow-hidden relative">
                      <div className="flex gap-3 animate-scroll-tags-reverse" style={{ width: "fit-content", animationDuration: "100s" }}>
                        {duplicatedCapabilityTags.map((tag, idx) => renderCapabilityTag(tag, `row2-${idx}`))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>


            {/* Enterprise Partners Row */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="text-sm font-medium">Our Enterprise AI Partners</div>
              <div className="flex items-center gap-6">
                <img
                  src="/crayon_bw.png"
                  alt="crayon"
                  width={113}
                  height={24}
                  className="bg-transparent object-contain grayscale opacity-80"
                  style={{ transform: "rotate(0deg)" }}
                />
                <img
                  src="/veehive_bw.png"
                  alt="veehive"
                  width={113}
                  height={24}
                  className="bg-transparent object-contain grayscale opacity-80"
                  style={{ transform: "rotate(0deg)" }}
                />
                <img
                  src="/mozak_bw.png"
                  alt="mozak"
                  width={113}
                  height={24}
                  className="bg-transparent object-contain grayscale opacity-80"
                  style={{ transform: "rotate(0deg)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Search + Filters Bar with Home search chat */}
      <section className="bg-white w-full">
        {/* Additional Filters */}
        <div 
          className="w-full"
          style={{
            width: "100%",
          }}
        >
          <div 
            className="flex flex-col lg:flex-row gap-4 items-center w-full"
            style={{
              width: "100%",
              height: "64px",
              backgroundColor: "#FFFFFF",
              borderTop: "1px solid #DFDFDF",
              borderBottom: "1px solid #DFDFDF",
              borderLeft: "none",
              borderRight: "none",
              paddingLeft: "60px",
              paddingRight: "120px",
            }}
          >
            {/* Quick Search Input */}
            <div className="relative w-full lg:basis-[60%]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Quick search by name, tags, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-28 py-2 w-full border-0 shadow-none focus-visible:ring-0"
                style={{
                  border: "none",
                  boxShadow: "none",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                  color: "#667085",
                }}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInputControls
                  value={search}
                  onValueChange={setSearch}
                  buttonVariant="ghost"
                  compact
                  ariaLabel="Use voice search"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-nowrap gap-1 items-center w-full lg:basis-[40%] lg:justify-end lg:pl-4">
              <select
                className="bg-white"
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                style={{
                  width: "110px",
                  height: "20px",
                  borderTop: "none",
                  borderBottom: "none",
                  borderLeft: "1px solid #DFDFDF",
                  borderRadius: "0",
                  padding: "0 8px",
                  color: "#344054",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  appearance: "none",
                  backgroundImage: "url('/Down_arow.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                  backgroundSize: "12px 12px",
                  paddingRight: "2px",
                }}
              >
                <option value="All">By Provider</option>
                {allProviders.map(provider => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
              <select
                className="bg-white"
                value={capabilityFilter}
                onChange={(e) => setCapabilityFilter(e.target.value)}
                style={{
                  width: "125px",
                  height: "20px",
                  borderTop: "none",
                  borderBottom: "none",
                  borderRadius: "0",
                  padding: "0 8px",
                  color: "#344054",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  appearance: "none",
                  backgroundImage: "url('/Down_arow.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                  backgroundSize: "12px 12px",
                  paddingRight: "2px",
                }}
              >
                <option value="All">By Capability</option>
                {allCapabilities.map(capability => (
                  <option key={capability} value={capability}>{capability}</option>
                ))}
              </select>
              <select
                className="bg-white"
                value={deploymentFilter}
                onChange={(e) => setDeploymentFilter(e.target.value)}
                style={{
                  width: "130px",
                  height: "20px",
                  borderTop: "none",
                  borderBottom: "none",
                  borderRadius: "0",
                  padding: "0 8px",
                  color: "#344054",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  appearance: "none",
                  backgroundImage: "url('/Down_arow.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                  backgroundSize: "12px 12px",
                  paddingRight: "2px",
                }}
              >
                <option value="All">By Asset Type</option>
                {allDeploymentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                className="bg-white"
                value={personaFilter}
                onChange={(e) => setPersonaFilter(e.target.value)}
                style={{
                  width: "110px",
                  height: "20px",
                  borderTop: "none",
                  borderBottom: "none",
                  borderRadius: "0",
                  padding: "0 8px",
                  color: "#344054",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  appearance: "none",
                  backgroundImage: "url('/Down_arow.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                  backgroundSize: "12px 12px",
                  paddingRight: "2px",
                }}
              >
                <option value="All">By Persona</option>
                {allPersonas.map(persona => (
                  <option key={persona} value={persona}>{persona}</option>
                ))}
              </select>
              
              {/* Clear All Filters Button */}
              {(() => {
                const hasActiveFilters = 
                  providerFilter !== "All" ||
                  capabilityFilter !== "All" ||
                  deploymentFilter !== "All" ||
                  personaFilter !== "All" ||
                  search !== "";
                
                if (!hasActiveFilters) return null;
                
                return (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setProviderFilter("All");
                      setCapabilityFilter("All");
                      setDeploymentFilter("All");
                      setPersonaFilter("All");
                      setSearch("");
                    }}
                    className="text-xs px-3 py-2 border-gray-300 hover:bg-gray-50"
                  >
                    Clear All
                  </Button>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Agent Grid */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="w-full mx-auto" style={{ maxWidth: "auto", paddingLeft: "70px", paddingRight: "70px" }}>
          {loading && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">Loading agents...</div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-12">
              <div className="text-red-600">{error}</div>
            </div>
          )}
          
          {!loading && !error && (
            <>
              {/* AI Search Results Section */}
              {aiSearchedAgentIds && aiSearchedAgentIds.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Search Results</h2>
                      <p className="text-sm text-muted-foreground">
                        Showing {aiSearchedAgents.length} of {aiSearchedAgentIds.length} AI-recommended agents
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Clear the chat to remove AI search results
                        const { clearChat } = useChatStore.getState();
                        clearChat();
                      }}
                      className="text-xs px-3 py-2"
                    >
                      Clear AI Search
                    </Button>
                  </div>
                  
                <div 
                  className="grid"
                  style={{
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "60px 40px",
                  }}
                >
                  {paginatedAiAgents.map((agent) => (
                    <AgentCard key={agent.id} {...agent} assetType={agent.assetType} demoPreview={agent.demoPreview} />
                  ))}
                </div>

                  {aiSearchedAgents.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground">No AI-recommended agents match your current filters.</div>
                    </div>
                  )}

                  {aiTotalPages > 1 && renderPaginationControls(aiCurrentPage, aiTotalPages, setAiCurrentPage)}
                </div>
              )}

              {/* All Agents Section */}
              <div className={aiSearchedAgentIds && aiSearchedAgentIds.length > 0 ? "border-t pt-12" : ""}>
                <div 
                  className="grid"
                  style={{
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "60px 40px",
                  }}
                >
                  {paginatedAgents.map((agent) => (
                    <AgentCard key={agent.id} {...agent} assetType={agent.assetType} demoPreview={agent.demoPreview} />
                  ))}
                </div>

                {allFilteredAgents.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">No agents found matching your criteria.</div>
                  </div>
                )}

                {totalPages > 1 && renderPaginationControls(currentPage, totalPages, setCurrentPage)}
              </div>
              
              {/* Customization prompt */}
              <div 
                className="relative mx-auto"
                style={{
                  width: "1272px",
                  height: "420px",
                  marginTop: "293px",
                  backgroundImage: "url('/Frame 13.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div 
                  className="text-center rounded-xl p-8 relative z-10"
                  style={{
                    width: "1232px",
                    height: "380px",
                    background: "linear-gradient(180deg, #E0F2FE 0%, #F0F9FF 100%)",
                    border: "2px dashed #D1D5DB",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  
                  {/* Enquire Now Button */}
                <div className="mb-6">
                  <button 
                    aria-label="Enquire Now"
                    style={{
                      width: "100px",
                      height: "28px",
                      padding: "5.8px 8px 6.79px 8px",
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "12px",
                      fontWeight: 500,
                      fontStyle: "normal",
                      lineHeight: "14.4px",
                      letterSpacing: "0%",
                      textAlign: "center",
                      verticalAlign: "middle",
                      color: "#0B2B70",
                      background: "#D0DFF7",
                      backdropFilter: "blur(6px)",
                      border: "none",
                      borderRadius: "20px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      outline: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxSizing: "border-box",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#c0d5f5";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#D0DFF7";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = "2px solid #0B2B70";
                      e.currentTarget.style.outlineOffset = "2px";
                      e.currentTarget.style.boxShadow = "0 0 0 4px rgba(11, 43, 112, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = "none";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                    onClick={() => window.location.href = "/contact"}
                  >
                    Enquire Now
                  </button>
                </div>

                {/* Main Title */}
                <h3 
                  className="mb-4"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontStyle: "normal",
                    fontSize: "32px",
                    lineHeight: "44.8px",
                    letterSpacing: "-0.64px",
                    textAlign: "center",
                    verticalAlign: "middle",
                    background: "linear-gradient(270deg, #0082C0 0%, #3B60AF 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    margin: "0 0 12px 0",
                    maxWidth: "100%",
                  }}
                >
                  Want a Custom Workflow?
                </h3>

                {/* Descriptive Paragraph */}
                <p 
                  className="mb-6 max-w-2xl mx-auto"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "24px",
                    letterSpacing: "0%",
                    textAlign: "center",
                    verticalAlign: "middle",
                    color: "#4B5563",
                    margin: "0 0 32px 0",
                    maxWidth: "720px",
                  }}
                >
                  Tangram agents can be chained into complete, composable solutions. Tell us what outcome you want — we'll build the right flow.
                </p>

                {/* Talk to a Solution Architect Button */}
                <div>
                  <button
                    aria-label="Talk to a Solution Architect"
                    style={{
                      height: "44px",
                      padding: "0 24px",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#FFFFFF",
                      background: "#0b0b0b",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      boxShadow: "0 6px 18px rgba(11, 11, 11, 0.25)",
                      transition: "all 0.2s ease",
                      outline: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxSizing: "border-box",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(11, 11, 11, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 6px 18px rgba(11, 11, 11, 0.25)";
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.background = "#000000";
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.background = "#0b0b0b";
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = "2px solid #0b0b0b";
                      e.currentTarget.style.outlineOffset = "2px";
                      e.currentTarget.style.boxShadow = "0 0 0 4px rgba(11, 11, 11, 0.2), 0 6px 18px rgba(11, 11, 11, 0.25)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = "none";
                      e.currentTarget.style.boxShadow = "0 6px 18px rgba(11, 11, 11, 0.25)";
                    }}
                    onClick={() => window.location.href = "/contact"}
                  >
                    Talk to a Solution Architect
                  </button>
                </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Create Agent Chat Dialog */}
      <ChatDialog 
        open={createChatOpen} 
        onOpenChange={setCreateChatOpen} 
        initialMode="create"
      />
    </div>
  );
}


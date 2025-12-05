"use client";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { AgentSearchChat } from "../../components/agent-search-chat";
import { AgentCard } from "../../components/agent-card";
import { AgentCardSkeleton } from "../../components/agent-card-skeleton";
import ChatDialog from "../../components/chat-dialog";
import { Search, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useChatStore } from "../../lib/store/chat.store";
import { useModal } from "../../hooks/use-modal";

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
  const { openModal } = useModal();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [agentSearchChatValue, setAgentSearchChatValue] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("All");
  const [capabilityFilter, setCapabilityFilter] = useState<string>("All");
  const [deploymentFilter, setDeploymentFilter] = useState<string>("Agent");
  const [personaFilter, setPersonaFilter] = useState<string>("All");
  const [createChatOpen, setCreateChatOpen] = useState(false);
  const [selectedDeploymentType, setSelectedDeploymentType] = useState<string>("Agent");
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const tabsContainerRef = useRef<HTMLDivElement>(null);
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
        
        // Set default deployment type to "Agent" if it exists, otherwise first available type
        if (mappedAgents.length > 0) {
          const deploymentTypes = new Set<string>();
          mappedAgents.forEach(agent => {
            if (agent.deploymentType) deploymentTypes.add(agent.deploymentType);
          });
          const sortedTypes = Array.from(deploymentTypes).sort();
          const defaultType = sortedTypes.includes("Agent") ? "Agent" : (sortedTypes[0] || "");
          if (defaultType) {
            setSelectedDeploymentType(defaultType);
            setDeploymentFilter(defaultType);
          }
        }
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

  // Scroll animations with IntersectionObserver - Optimized for performance
  useEffect(() => {
    // Use requestIdleCallback for better performance, fallback to setTimeout
    const scheduleObservation = (callback: () => void) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback, { timeout: 200 });
      } else {
        setTimeout(callback, 100);
      }
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px", // Trigger earlier for smoother experience
    };

    const observer = new IntersectionObserver((entries) => {
      // Use requestAnimationFrame for smooth animations
      requestAnimationFrame(() => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Handle different animation types
            if (entry.target.classList.contains("fade-in-section")) {
              entry.target.classList.add("fade-in-visible");
            } else if (entry.target.classList.contains("slide-in-left")) {
              entry.target.classList.add("slide-in-visible");
            } else if (entry.target.classList.contains("slide-in-right")) {
              entry.target.classList.add("slide-in-visible");
            } else if (entry.target.classList.contains("scale-in")) {
              entry.target.classList.add("scale-in-visible");
            } else if (entry.target.classList.contains("fade-in-blur")) {
              entry.target.classList.add("fade-in-blur-visible");
            } else if (entry.target.classList.contains("stagger-item")) {
              entry.target.classList.add("stagger-visible");
            }
            // Unobserve after animation to improve performance
            observer.unobserve(entry.target);
          }
        });
      });
    }, observerOptions);

    // Function to observe all animated elements
    const observeElements = () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      );
      animatedElements.forEach((el) => observer.observe(el));
    };

    // Observe elements after DOM is ready
    scheduleObservation(observeElements);

    return () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      );
      animatedElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
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

  // Calculate counts for each deployment type
  const deploymentTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allDeploymentTypes.forEach(type => {
      counts[type] = agents.filter(agent => agent.deploymentType === type).length;
    });
    return counts;
  }, [agents, allDeploymentTypes]);

  // Update indicator position when selected deployment type changes
  useEffect(() => {
    if (!tabsContainerRef.current || !selectedDeploymentType) {
      setIndicatorStyle(null);
      return;
    }

    const tabElement = tabRefs.current.get(selectedDeploymentType);
    if (!tabElement) {
      setIndicatorStyle(null);
      return;
    }

    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      if (!tabsContainerRef.current || !tabElement) return;
      
      const containerRect = tabsContainerRef.current.getBoundingClientRect();
      const tabRect = tabElement.getBoundingClientRect();
      
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [selectedDeploymentType, allDeploymentTypes]);

  // Update deployment filter when segment is selected
  useEffect(() => {
    if (selectedDeploymentType) {
      setDeploymentFilter(selectedDeploymentType);
    }
  }, [selectedDeploymentType]);

  // Sync selected segment when deployment filter changes from dropdown
  useEffect(() => {
    if (deploymentFilter !== "All" && allDeploymentTypes.includes(deploymentFilter)) {
      setSelectedDeploymentType(deploymentFilter);
    }
  }, [deploymentFilter, allDeploymentTypes]);

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
    
    if (deploymentFilter && deploymentFilter !== "All") {
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
      <div className="mt-16 flex items-center justify-center gap-2">
        <button
          onClick={() => onChange(Math.max(1, current - 1))}
          disabled={current === 1}
          className="text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors px-2"
          style={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Previous
        </button>
        <div className="flex items-center gap-1">
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => onChange(page)}
              className={`text-sm px-2 py-1 min-w-[32px] transition-colors ${
                page === current
                  ? "text-gray-900 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{
                fontFamily: "Poppins, sans-serif",
              }}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          onClick={() => onChange(Math.min(total, current + 1))}
          disabled={current === total}
          className="text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors px-2"
          style={{
            fontFamily: "Poppins, sans-serif",
          }}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col relative" style={{ scrollBehavior: "smooth" }}>
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
      <section className="pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-16 lg:pb-20 fade-in-section" style={{ transform: "translateZ(0)", willChange: "scroll-position", contain: "layout style paint" }}>
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <span 
                className="inline-block scale-in"
                style={{
                  width: "115px",
                  height: "32px",
                  borderRadius: "50px",
                  padding: "4px 16px",
                  gap: "8px",
                  opacity: 1,
                  transform: "rotate(0.282deg)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#FFD0E6",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "140%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: "#BD0159",
                  willChange: "transform",
                }}
              >
                Agent Store
              </span>
            </div>

            <h1 className="mb-4 text-center fade-in-blur">
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
                  willChange: "opacity, transform, filter",
                }}
              >
                The One-Stop Store.
              </span>
            </h1>
            <p
              className="mb-2 text-center fade-in-section"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "24px",
                textAlign: "center",
                color: "#091917",
                willChange: "opacity, transform",
              }}
            >
              Discover.Try. Deploy.
            </p>

            <p 
              className="mx-auto mb-8 max-w-2xl text-center fade-in-section"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "24px",
                textAlign: "center",
                color: "#091917",
                willChange: "opacity, transform",
              }}
            >
              Start referring or integrating agents from Tangram.ai store with your clients today to unlock new revenue opportunities, accelerate growth, and deliver intelligent AI solutions at scale.
            </p>

            {/* Centered search bar under subheader */}
            <div className="flex w-full justify-center mb-0 scale-in">
              <div className="w-full max-w-5xl" style={{ willChange: "transform" }}>
                {/* reuse same search-chat as home */}
                <AgentSearchChat 
                  externalValue={agentSearchChatValue}
                  onExternalValueChange={setAgentSearchChatValue}
                />
              </div>
            </div>

            {/* Category tags - Two Row Scrolling */}
            <div className="mb-4 mx-auto max-w-5xl overflow-hidden fade-in-section" style={{ minHeight: "80px", willChange: "opacity, transform" }}>
              {(() => {
                // Get unique agent names from API for first row
                const agentNames = [...new Set(agents.map(agent => agent.title))].slice(0, 20); // Limit to 20 unique names
                const iconColors = ["#7DD3FC", "#3B82F6", "#FCD34D", "#1E40AF", "#FDE047", "#F472B6", "#A855F7", "#FB923C", "#14B8A6"];
                const iconTypes = ["circle", "triangle", "square"];

                // Create agent name tags for first row
                // Use placeholder tags if no agents loaded yet to prevent layout shift
                const agentNameTags = agentNames.length > 0 
                  ? agentNames.map((name, idx) => ({
                      text: name,
                      icon: iconTypes[idx % iconTypes.length] as "circle" | "triangle" | "square",
                      color: iconColors[idx % iconColors.length],
                    }))
                  : [
                      // Placeholder tags to maintain layout until agents load
                      { text: "Agent 1", icon: "circle" as const, color: "#E5E7EB" },
                      { text: "Agent 2", icon: "triangle" as const, color: "#E5E7EB" },
                      { text: "Agent 3", icon: "square" as const, color: "#E5E7EB" },
                    ];

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
                      onClick={() => setAgentSearchChatValue(tag.text)}
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
                      onClick={() => {
                        setAgentSearchChatValue(tag.text);
                        // Also set the filter
                        setCapabilityFilter(isSelected ? "All" : matchingCapability);
                      }}
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
                  <div className="flex flex-col gap-3" style={{ minHeight: "80px" }}>
                    {/* First Row - Left to Right - Agent Names from API */}
                    <div className="overflow-hidden relative" style={{ height: "44px", minHeight: "44px" }}>
                      <div className="flex gap-3 animate-scroll-tags" style={{ width: "fit-content", animationDuration: "240s" }}>
                        {duplicatedAgentNames.map((tag, idx) => renderAgentNameTag(tag, `row1-${idx}`))}
                      </div>
                    </div>
                    {/* Second Row - Right to Left - Capability Tags */}
                    <div className="overflow-hidden relative" style={{ height: "44px", minHeight: "44px" }}>
                      <div className="flex gap-3 animate-scroll-tags-reverse" style={{ width: "fit-content", animationDuration: "200s" }}>
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
        {/* Deployment Type Segment Tabs */}
        {allDeploymentTypes.length > 0 && (
          <div 
            className="w-full flex justify-center"
            style={{
              paddingTop: "32px",
              paddingBottom: "32px",
              paddingLeft: "60px",
              paddingRight: "120px",
              backgroundColor: "#FFFFFF",
            }}
          >
            <div 
              ref={tabsContainerRef}
              className="relative flex gap-8 border-b border-gray-200 flex-wrap justify-center" 
              style={{ 
                borderBottom: "1px solid #E5E7EB", 
                position: "relative",
              }}
            >
              {/* Animated sliding indicator */}
              {indicatorStyle && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "-1px",
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`,
                    height: "2px",
                    backgroundColor: "#000",
                    transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    willChange: "left, width",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    pointerEvents: "none",
                  }}
                />
              )}
              
              {/* Deployment type tabs */}
              {allDeploymentTypes.map((type) => {
                const count = deploymentTypeCounts[type] || 0;
                const isSelected = selectedDeploymentType === type;
                
                return (
                  <button
                    key={type}
                    ref={(el) => {
                      if (el) {
                        tabRefs.current.set(type, el);
                      } else {
                        tabRefs.current.delete(type);
                      }
                    }}
                    onClick={() => setSelectedDeploymentType(type)}
                    className="relative pb-2 px-4"
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? "#000" : "#344054",
                      paddingBottom: "8px",
                      whiteSpace: "nowrap",
                      opacity: 1,
                      cursor: "pointer",
                      display: "inline-block",
                      visibility: "visible",
                      transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      willChange: "transform",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "translateZ(0)",
                    }}
                  >
                    {type} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Additional Filters */}
        <div 
          className="w-full"
          style={{
            width: "100%",
          }}
        >
          <div 
            className="flex flex-col lg:flex-row gap-4 items-center mx-auto"
            style={{
              width: "100%",
              maxWidth: "1360px",
              height: "64px",
              backgroundColor: "#FFFFFF",
              borderTop: "none",
              borderBottom: "1px solid #DFDFDF",
              borderLeft: "none",
              borderRight: "none",
              paddingLeft: "8px",
              paddingRight: "8px",
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
                className="pl-10 pr-4 py-2 w-full border-0 shadow-none focus-visible:ring-0"
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
            </div>
            
            {/* Filters */}
            <div className="flex flex-nowrap items-center justify-end w-full lg:basis-[40%] lg:pl-4 gap-2 lg:gap-6">
              <div className="relative inline-flex items-center" style={{ borderLeft: "1px solid #DFDFDF", paddingLeft: "32px", paddingRight: "0px" }}>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    color: "#344054",
                    marginRight: "4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {providerFilter === "All" ? "Provider" : providerFilter}
                </span>
                <ChevronDown 
                  className="pointer-events-none"
                  style={{
                    width: "16px",
                    height: "16px",
                    color: "#344054",
                  }}
                />
                <select
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                >
                  <option value="All">Provider</option>
                  {allProviders.map(provider => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))}
                </select>
              </div>
              <div className="relative inline-flex items-center" style={{ paddingLeft: "8px" }}>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    color: "#344054",
                    marginRight: "4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {capabilityFilter === "All" ? "Capability" : capabilityFilter}
                </span>
                <ChevronDown 
                  className="pointer-events-none"
                  style={{
                    width: "16px",
                    height: "16px",
                    color: "#344054",
                  }}
                />
                <select
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  value={capabilityFilter}
                  onChange={(e) => setCapabilityFilter(e.target.value)}
                >
                  <option value="All">Capability</option>
                  {allCapabilities.map(capability => (
                    <option key={capability} value={capability}>{capability}</option>
                  ))}
                </select>
              </div>
              <div className="relative inline-flex items-center" style={{ paddingLeft: "8px" }}>
                <span
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    color: "#344054",
                    marginRight: "4px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {personaFilter === "All" ? "Persona" : personaFilter}
                </span>
                <ChevronDown 
                  className="pointer-events-none"
                  style={{
                    width: "16px",
                    height: "16px",
                    color: "#344054",
                  }}
                />
                <select
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  value={personaFilter}
                  onChange={(e) => setPersonaFilter(e.target.value)}
                >
                  <option value="All">Persona</option>
                  {allPersonas.map(persona => (
                    <option key={persona} value={persona}>{persona}</option>
                  ))}
                </select>
              </div>
              
              {/* Clear All Filters Button */}
              {(() => {
                const hasActiveFilters = 
                  providerFilter !== "All" ||
                  capabilityFilter !== "All" ||
                  personaFilter !== "All" ||
                  search !== "";
                
                if (!hasActiveFilters) return null;
                
                return (
                  <button
                    onClick={() => {
                      setProviderFilter("All");
                      setCapabilityFilter("All");
                      setDeploymentFilter("Agent");
                      setSelectedDeploymentType("Agent");
                      setPersonaFilter("All");
                      setSearch("");
                    }}
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      color: "#344054",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      textDecoration: "underline",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.7";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    Clear All
                  </button>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "12px", paddingRight: "12px", marginTop: "28px" }}>
          {loading && (
            <div 
              className="grid gap-4 md:gap-6 lg:gap-10"
              style={{
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              {Array.from({ length: 9 }).map((_, index) => (
                <AgentCardSkeleton key={index} />
              ))}
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
                  className="grid gap-4 md:gap-6 lg:gap-10"
                  style={{
                    gridTemplateColumns: "repeat(3, 1fr)",
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
                  className="grid gap-4 md:gap-6 lg:gap-10"
                  style={{
                    gridTemplateColumns: "repeat(3, 1fr)",
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
            </>
          )}
        </div>
      </section>

      {/* Custom Services CTA Section */}
      <section
        className="py-10 px-4 md:py-[50px] md:px-5 lg:py-20 lg:px-0"
        style={{
          width: "100%",
          background: "#FFFFFF",
          position: "relative",
          margin: "0 auto",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          boxSizing: "border-box",
          overflow: "visible",
          display: "block",
          visibility: "visible",
          minHeight: "400px",
        }}
      >
        {/* Pattern Background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundImage: "url('/img/bgpattern.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "contain",
            opacity: 1,
            zIndex: 0,
            pointerEvents: "none",
            width: "100%",
            maxWidth: "1356px",
            height: "100%",
          }}
        />
        
        {/* Outer Container */}
        <div
          className="p-10 px-6 md:p-[60px] md:px-8 lg:p-[70px] lg:px-12"
          style={{
            width: "100%",
            maxWidth: "1232px",
            margin: "0 auto",
            position: "relative",
            border: "none",
            borderRadius: 0,
            background: "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            boxSizing: "border-box",
            zIndex: 1,
            opacity: 1,
            visibility: "visible",
          }}
        >
          {/* Header Section */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              width: "100%",
              marginBottom: "32px",
              boxSizing: "border-box",
              position: "relative",
              zIndex: 2,
            }}
          >
            {/* Top Pill Badge */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "auto",
                height: "28px",
                minWidth: "fit-content",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  padding: "5.8px 8px 6.79px 8px",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "12px",
                  fontWeight: 500,
                  fontStyle: "normal",
                  lineHeight: "14.4px",
                  letterSpacing: "0%",
                  textAlign: "center",
                  verticalAlign: "middle",
                  color: "#0b2b70",
                  background: "#d0dff7",
                  backdropFilter: "blur(3px)",
                  WebkitBackdropFilter: "blur(3px)",
                  border: "none",
                  borderRadius: "20px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
              >
                Enquire Now
              </div>
            </div>

            {/* Main Heading */}
            <h1
              className="md:text-[28px] md:leading-[39.2px] md:tracking-[-0.56px] md:px-20 md:whitespace-normal text-[24px] leading-[33.6px] tracking-[-0.48px] px-4 whitespace-normal lg:text-[32px] lg:leading-[44.8px] lg:tracking-[-0.64px] lg:px-[165px] lg:pl-[171.34px] lg:whitespace-nowrap"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                textAlign: "center",
                verticalAlign: "middle",
                background: "linear-gradient(to left, #0082c0 0%, #3b60af 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "#0082c0",
                margin: 0,
                width: "100%",
                maxWidth: "100%",
                overflow: "visible",
                boxSizing: "border-box",
              }}
            >
              Want a Custom Workflow?
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm leading-[21px] md:text-[15px] md:leading-[22.5px] lg:text-base lg:leading-6"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#6b7280",
                margin: 0,
                width: "100%",
                maxWidth: "880px",
                position: "relative",
              }}
            >
              Tangram agents can be chained into complete, composable solutions. Tell us what outcome you want — we'll build the right flow.
            </p>
          </div>

          {/* Button Group */}
          <div
            className="flex-col gap-3 w-full md:flex-row md:gap-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 0,
              boxSizing: "border-box",
              position: "relative",
              zIndex: 2,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                position: "relative",
                background: "rgba(121, 133, 171, 0.05)",
                borderRadius: "4px",
                padding: "2px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: "-2px",
                  background: "rgba(121, 133, 171, 0.05)",
                  borderRadius: "4px",
                  filter: "blur(7.5px)",
                  zIndex: -1,
                }}
              />
              <button
                onClick={() => openModal("auth", { mode: "signup", role: "client" })}
                style={{
                  position: "relative",
                  height: "44px",
                  padding: "0 28px",
                  zIndex: 1,
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "21px",
                  letterSpacing: "0%",
                  color: "#FFFFFF",
                  background: "black",
                  border: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                  boxSizing: "border-box",
                  borderRadius: "4px",
                  textDecoration: "none",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Talk to Solution Architect
              </button>
            </div>
          </div>
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


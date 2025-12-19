"use client";

import { Button } from "../../components/ui/button";
import { AgentSearchChat } from "../../components/agent-search-chat";
import { AgentCard } from "../../components/agent-card";
import { ModelCard } from "../../components/model-card";
import { AgentCardSkeleton } from "../../components/agent-card-skeleton";
import { ChevronDown, Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  valueProposition?: string;
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

type Model = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  demoPreview?: string;
};

type ApiModel = {
  model_id?: string;
  id?: string;
  model_name?: string;
  name?: string;
  blog_title?: string;
  preview_text?: string;
  tag_line?: string;
  long_description?: string;
  description?: string;
  model_icon?: string;
  model_type_1?: string;
  model_type_2?: string;
  training_data_1?: string;
  training_data_2?: string;
  training_data_3?: string;
  training_data_4?: string;
  tags?: string | null;
  demo_preview?: string | null;
  admin_approved?: string | null;
  [key: string]: any;
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
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [agentSearchChatValue, setAgentSearchChatValue] = useState("");
  const [providerFilter, setProviderFilter] = useState<string>("All");
  const [capabilityFilter, setCapabilityFilter] = useState<string>("All");
  const [deploymentFilter, setDeploymentFilter] = useState<string>("All");
  const [personaFilter, setPersonaFilter] = useState<string>("All");
  const [selectedCapability, setSelectedCapability] = useState<string>("All");
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const [aiCurrentPage, setAiCurrentPage] = useState(1);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { messages, clearChat } = useChatStore();
  const agentIdFromUrl = searchParams.get('agentId');
  
  // Check if we should redirect to chat route
  useEffect(() => {
    if (searchParams.get('chat') === 'true') {
      router.replace('/agents/chat');
    }
  }, [searchParams, router]);

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
              valueProposition: (a as any).by_value || "",
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
        
        // Set default capability to "All"
        setSelectedCapability("All");
        setCapabilityFilter("All");
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

  // Fetch models
  useEffect(() => {
    const fetchModels = async () => {
      try {
        setModelsLoading(true);
        const res = await fetch("https://agents-store.onrender.com/api/models", {
          cache: "no-store",
        });
        if (!res.ok) {
          console.warn(`Failed to fetch models: ${res.status}`);
          setModels([]);
          return;
        }
        const data = await res.json();
        
        // Handle API response structure: { success: true, data: [...] }
        const apiModels: ApiModel[] = data?.data || data?.models || data || [];
        const mappedModels = apiModels
          .filter((m: ApiModel) => !m.admin_approved || m.admin_approved === "yes") // Only show approved models if field exists
          .map((m: ApiModel) => {
            const modelId = m.model_id || m.id || "";
            const modelName = m.blog_title || m.model_name || m.name || "";
            
            // Use preview_text or tag_line for description, fallback to long_description or description
            const description = m.preview_text || m.tag_line || m.long_description || m.description || "";
            
            // Use model_icon for preview image, fallback to demo_preview
            let previewImage: string | undefined = undefined;
            if (m.model_icon) {
              previewImage = m.model_icon;
            } else if (m.demo_preview) {
              const demoPreviewUrls = m.demo_preview
                .split(",")
                .map((item: string) => item.trim())
                .filter((item: string) => {
                  return item && (item.startsWith("http://") || item.startsWith("https://"));
                });
              previewImage = demoPreviewUrls.length > 0 ? demoPreviewUrls[0] : undefined;
            }
            
            // Extract tags from model_type fields and training_data fields
            const tags: string[] = [];
            if (m.model_type_1) tags.push(m.model_type_1);
            if (m.model_type_2) tags.push(m.model_type_2);
            if (m.training_data_1) tags.push(m.training_data_1);
            if (m.training_data_2) tags.push(m.training_data_2);
            if (m.training_data_3) tags.push(m.training_data_3);
            if (m.training_data_4) tags.push(m.training_data_4);
            
            // Also add tags from tags field if it exists
            if (m.tags) {
              const additionalTags = m.tags
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean);
              tags.push(...additionalTags);
            }
            
            return {
              id: modelId,
              title: modelName,
              description: description,
              tags: tags,
              demoPreview: previewImage,
            };
          })
          .filter((m: Model) => m.id && m.title); // Filter out invalid models
        
        setModels(mappedModels);
      } catch (err) {
        console.error("Error fetching models:", err);
        setModels([]);
      } finally {
        setModelsLoading(false);
      }
    };
    
    fetchModels();
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
    const values = new Set<string>();
    agents.forEach(agent => {
      if (agent.valueProposition) {
        values.add(agent.valueProposition);
      }
    });
    return Array.from(values).sort();
  }, [agents]);

  // Calculate counts for each value proposition
  const capabilityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allCapabilities.forEach(value => {
      counts[value] = agents.filter(agent => 
        agent.valueProposition === value
      ).length;
    });
    return counts;
  }, [agents, allCapabilities]);

  const allProviders = useMemo(() => {
    const providers = new Set<string>();
    agents.forEach(agent => {
      agent.providers.forEach(provider => providers.add(provider));
    });
    return Array.from(providers).sort();
  }, [agents]);

  // Update indicator position when selected capability changes
  useEffect(() => {
    if (!tabsContainerRef.current || !selectedCapability) {
      setIndicatorStyle(null);
      return;
    }

    const tabElement = tabRefs.current.get(selectedCapability);
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
  }, [selectedCapability, allCapabilities]);

  // Calculate grey line width to span all tabs
  const [greyLineStyle, setGreyLineStyle] = useState<{ left: number; width: number } | null>(null);
  
  useEffect(() => {
    if (!tabsContainerRef.current) {
      setGreyLineStyle(null);
      return;
    }

    const timer = setTimeout(() => {
      if (!tabsContainerRef.current) return;
      
      const containerRect = tabsContainerRef.current.getBoundingClientRect();
      const allTab = tabRefs.current.get("All");
      const lastTab = allCapabilities.length > 0 
        ? tabRefs.current.get(allCapabilities[allCapabilities.length - 1])
        : allTab;
      
      if (allTab && lastTab) {
        const firstRect = allTab.getBoundingClientRect();
        const lastRect = lastTab.getBoundingClientRect();
        
        setGreyLineStyle({
          left: firstRect.left - containerRect.left,
          width: (lastRect.right - firstRect.left),
        });
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [allCapabilities]);

  const allPersonas = useMemo(() => {
    const personas = new Set<string>();
    agents.forEach(agent => {
      if (agent.persona) personas.add(agent.persona);
    });
    return Array.from(personas).sort();
  }, [agents]);

  // Filter options based on selected value proposition
  const filteredProviders = useMemo(() => {
    if (selectedCapability === "All" || !selectedCapability) return allProviders;
    const providers = new Set<string>();
    agents
      .filter(agent => agent.valueProposition === selectedCapability)
      .forEach(agent => {
        agent.providers.forEach(provider => providers.add(provider));
      });
    return Array.from(providers).sort();
  }, [agents, selectedCapability, allProviders]);

  const filteredPersonas = useMemo(() => {
    if (selectedCapability === "All" || !selectedCapability) return allPersonas;
    const personas = new Set<string>();
    agents
      .filter(agent => agent.valueProposition === selectedCapability)
      .forEach(agent => {
        if (agent.persona) personas.add(agent.persona);
      });
    return Array.from(personas).sort();
  }, [agents, selectedCapability, allPersonas]);

  // Update capability filter when segment is selected and reset filters if needed
  useEffect(() => {
    if (selectedCapability) {
      setCapabilityFilter(selectedCapability === "All" ? "All" : selectedCapability);
      
      // Reset filters if they're not available for the new capability
      if (!filteredProviders.includes(providerFilter) && providerFilter !== "All") {
        setProviderFilter("All");
      }
      if (!filteredPersonas.includes(personaFilter) && personaFilter !== "All") {
        setPersonaFilter("All");
      }
    }
  }, [selectedCapability, filteredProviders, filteredPersonas, providerFilter, personaFilter]);

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
        agent.valueProposition === capabilityFilter
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

  // Helper function to apply manual filters to models
  const applyModelFilters = (modelList: Model[]) => {
    let filtered = modelList;
    
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(model => 
        model.title.toLowerCase().includes(q) ||
        model.description.toLowerCase().includes(q) ||
        model.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    
    // Note: Models don't have provider, capability, or persona filters
    // But we keep the function structure for consistency
    
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

  // Filtered models
  const filteredModels = useMemo(() => {
    return applyModelFilters(models);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [models, search]);

  const modelsTotalPages = Math.max(1, Math.ceil(filteredModels.length / PAGE_SIZE));
  const [modelsCurrentPage, setModelsCurrentPage] = useState(1);

  const paginatedModels = useMemo(() => {
    const start = (modelsCurrentPage - 1) * PAGE_SIZE;
    return filteredModels.slice(start, start + PAGE_SIZE);
  }, [filteredModels, modelsCurrentPage, PAGE_SIZE]);

  useEffect(() => {
    setModelsCurrentPage(1);
  }, [search, selectedCapability]);

  useEffect(() => {
    const maxPages = Math.max(1, Math.ceil(filteredModels.length / PAGE_SIZE));
    if (modelsCurrentPage > maxPages) {
      setModelsCurrentPage(maxPages);
    }
  }, [filteredModels.length, modelsCurrentPage, PAGE_SIZE]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, providerFilter, capabilityFilter, deploymentFilter, personaFilter, agentIdFromUrl, selectedCapability]);

  useEffect(() => {
    setAiCurrentPage(1);
  }, [aiSearchedAgentIds, search, providerFilter, capabilityFilter, deploymentFilter, personaFilter, selectedCapability]);

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

  // Handle entering chat mode
  const handleEnterChat = (message: string) => {
    // Navigate to chat route
    if (message.trim()) {
      // Store message in sessionStorage to send after navigation
      sessionStorage.setItem('pendingChatMessage', message.trim());
    }
    router.push('/agents/chat');
  }

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
      <>
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
          <section className="fade-in-section" style={{ transform: "translateZ(0)", willChange: "scroll-position", contain: "layout style paint", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
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

            <h1 className="mb-3 text-center fade-in-blur">
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
                The One-Stop Agent Store.
              </span>
            </h1>
            <p
              className="text-center fade-in-section"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "24px",
                textAlign: "center",
                color: "#091917",
                willChange: "opacity, transform",
                marginBottom: "64px",
              }}
            >
              Discover.Try. Deploy.
            </p>

            {/* Search bar */}
            <div className="flex w-full justify-center scale-in mb-8">
              <div className="w-full max-w-5xl" style={{ willChange: "transform" }}>
                <AgentSearchChat 
                  externalValue={agentSearchChatValue}
                  onExternalValueChange={setAgentSearchChatValue}
                  onEnterChat={handleEnterChat}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Unified Search + Filters Bar with Home search chat */}
      <section className="bg-white w-full">
        {/* AI Search Results Section */}
        {aiSearchedAgentIds && aiSearchedAgentIds.length > 0 && (
          <div className="w-full" style={{ backgroundColor: "#F8F8F8", paddingTop: "32px", paddingBottom: "32px" }}>
            <div className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "12px", paddingRight: "12px" }}>
              <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Search Results</h2>
                  <p className="text-sm text-muted-foreground">
                    Showing {aiSearchedAgents.length} of {aiSearchedAgentIds.length} AI-recommended agents
                  </p>
                </div>
                <button
                  onClick={() => {
                    // Clear the chat to remove AI search results
                    const { clearChat } = useChatStore.getState();
                    clearChat();
                  }}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    color: "#344054",
                    background: "transparent",
                    border: "1px solid #E5E7EB",
                    borderRadius: "4px",
                    cursor: "pointer",
                    padding: "8px 16px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#344054";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E5E7EB";
                  }}
                >
                  Clear AI Search
                </button>
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
            </div>
          </div>
        )}

        {/* Capability Tabs Section - Centered */}
        <div 
          className="w-full"
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            paddingTop: "40px",
            paddingBottom: "20px",
          }}
        >
          <div className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "12px", paddingRight: "12px" }}>
            {/* Capability Segment Tabs - Centered */}
            {allCapabilities.length > 0 && (
              <div className="relative w-full flex justify-center items-center">
                <div 
                  ref={tabsContainerRef}
                  className="relative flex gap-8 flex-wrap justify-center" 
                  style={{ 
                    position: "relative",
                  }}
                >
                  {/* Base grey line - always visible under all tabs */}
                  {greyLineStyle && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-1px",
                        left: `${greyLineStyle.left}px`,
                        width: `${greyLineStyle.width}px`,
                        height: "2px",
                        backgroundColor: "#E5E7EB",
                        pointerEvents: "none",
                        zIndex: 0,
                      }}
                    />
                  )}
                  
                  {/* Animated sliding black indicator - overlaps grey line */}
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
                        zIndex: 1,
                      }}
                    />
                  )}
                  
                  {/* All option */}
                  <button
                    key="All"
                    ref={(el) => {
                      if (el) {
                        tabRefs.current.set("All", el);
                      } else {
                        tabRefs.current.delete("All");
                      }
                    }}
                    onClick={() => setSelectedCapability("All")}
                    className="relative pb-2 px-4"
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontWeight: selectedCapability === "All" ? 600 : 500,
                      color: selectedCapability === "All" ? "#000" : "#344054",
                      paddingBottom: "12px",
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
                    All ({agents.length})
                  </button>
                  
                  {/* Capability tabs */}
                  {allCapabilities.map((capability) => {
                    const count = capabilityCounts[capability] || 0;
                    const isSelected = selectedCapability === capability;
                    
                    return (
                      <button
                        key={capability}
                        ref={(el) => {
                          if (el) {
                            tabRefs.current.set(capability, el);
                          } else {
                            tabRefs.current.delete(capability);
                          }
                        }}
                        onClick={() => setSelectedCapability(capability)}
                        className="relative pb-2 px-4"
                        style={{
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontWeight: isSelected ? 600 : 500,
                          color: isSelected ? "#000" : "#344054",
                          paddingBottom: "12px",
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
                        {capability} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar Section - Full Width with Filter Integrated */}
        <div 
          className="w-full"
          style={{
            width: "100%",
            backgroundColor: "#FFFFFF",
            paddingTop: "20px",
            paddingBottom: "24px",
          }}
        >
          <div className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "12px", paddingRight: "12px" }}>
            <div className="w-full relative">
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
                style={{
                  zIndex: 1,
                  color: "#9CA3AF",
                }}
              />
                <input
                  type="text"
                  placeholder="Search over 100+ Agents and Solutions Available"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 140px 12px 40px",
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    border: "none",
                    borderBottom: "1px solid #E5E7EB",
                    borderRadius: "0",
                    outline: "none",
                    transition: "border-color 0.2s",
                    backgroundColor: "transparent",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderBottomColor = "#000";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderBottomColor = "#E5E7EB";
                  }}
                />
              {/* Filter Button - Inside Search Bar */}
              <button
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                style={{
                  position: "absolute",
                  right: "4px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  color: "#344054",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  height: "36px",
                  transition: "all 0.2s",
                  borderRadius: "6px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#F9FAFB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div style={{ position: "relative", display: "inline-flex" }}>
                  <Filter className="h-4 w-4" />
                  {(providerFilter !== "All" || capabilityFilter !== "All" || personaFilter !== "All" || search !== "") && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-2px",
                        right: "-2px",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#EF4444",
                        border: "1px solid #FFFFFF",
                      }}
                    />
                  )}
                </div>
                <span>Filters</span>
                <ChevronDown 
                  className="h-4 w-4 transition-transform duration-200"
                  style={{
                    transform: isFilterPanelOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        <div 
          className="w-full overflow-hidden transition-all duration-300 ease-in-out"
          style={{
            maxHeight: isFilterPanelOpen ? "1000px" : "0px",
            paddingTop: isFilterPanelOpen ? "24px" : "0px",
            paddingBottom: isFilterPanelOpen ? "24px" : "0px",
            opacity: isFilterPanelOpen ? 1 : 0,
          }}
        >
          {isFilterPanelOpen && (
            <div className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "12px", paddingRight: "12px" }}>
              <div 
                className="flex flex-col gap-6 rounded-lg"
                style={{
                  backgroundColor: "#F8F8F8",
                  padding: "24px",
                  border: "none",
                }}
              >
                {/* Provider Filter */}
                <div className="flex flex-col gap-3">
                  <label
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#344054",
                    }}
                  >
                    Provider
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setProviderFilter("All")}
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "16px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: providerFilter === "All" ? "#000" : "#FFFFFF",
                        color: providerFilter === "All" ? "#FFFFFF" : "#344054",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (providerFilter !== "All") {
                          e.currentTarget.style.backgroundColor = "#F9FAFB";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (providerFilter !== "All") {
                          e.currentTarget.style.backgroundColor = "#FFFFFF";
                        }
                      }}
                    >
                      All
                    </button>
                    {filteredProviders.map(provider => (
                      <button
                        key={provider}
                        onClick={() => setProviderFilter(provider)}
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "14px",
                          padding: "6px 12px",
                          borderRadius: "16px",
                          border: "1px solid #E5E7EB",
                          backgroundColor: providerFilter === provider ? "#000" : "#FFFFFF",
                          color: providerFilter === provider ? "#FFFFFF" : "#344054",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (providerFilter !== provider) {
                            e.currentTarget.style.backgroundColor = "#F9FAFB";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (providerFilter !== provider) {
                            e.currentTarget.style.backgroundColor = "#FFFFFF";
                          }
                        }}
                      >
                        {provider}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Capability Filter */}
                <div className="flex flex-col gap-3">
                  <label
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#344054",
                    }}
                  >
                    Capability
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCapabilityFilter("All")}
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "16px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: capabilityFilter === "All" ? "#000" : "#FFFFFF",
                        color: capabilityFilter === "All" ? "#FFFFFF" : "#344054",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (capabilityFilter !== "All") {
                          e.currentTarget.style.backgroundColor = "#F9FAFB";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (capabilityFilter !== "All") {
                          e.currentTarget.style.backgroundColor = "#FFFFFF";
                        }
                      }}
                    >
                      All
                    </button>
                    {allCapabilities.map(capability => (
                      <button
                        key={capability}
                        onClick={() => setCapabilityFilter(capability)}
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "14px",
                          padding: "6px 12px",
                          borderRadius: "16px",
                          border: "1px solid #E5E7EB",
                          backgroundColor: capabilityFilter === capability ? "#000" : "#FFFFFF",
                          color: capabilityFilter === capability ? "#FFFFFF" : "#344054",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (capabilityFilter !== capability) {
                            e.currentTarget.style.backgroundColor = "#F9FAFB";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (capabilityFilter !== capability) {
                            e.currentTarget.style.backgroundColor = "#FFFFFF";
                          }
                        }}
                      >
                        {capability}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Persona Filter */}
                <div className="flex flex-col gap-3">
                  <label
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#344054",
                    }}
                  >
                    Persona
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setPersonaFilter("All")}
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "16px",
                        border: "1px solid #E5E7EB",
                        backgroundColor: personaFilter === "All" ? "#000" : "#FFFFFF",
                        color: personaFilter === "All" ? "#FFFFFF" : "#344054",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (personaFilter !== "All") {
                          e.currentTarget.style.backgroundColor = "#F9FAFB";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (personaFilter !== "All") {
                          e.currentTarget.style.backgroundColor = "#FFFFFF";
                        }
                      }}
                    >
                      All
                    </button>
                    {filteredPersonas.map(persona => (
                      <button
                        key={persona}
                        onClick={() => setPersonaFilter(persona)}
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "14px",
                          padding: "6px 12px",
                          borderRadius: "16px",
                          border: "1px solid #E5E7EB",
                          backgroundColor: personaFilter === persona ? "#000" : "#FFFFFF",
                          color: personaFilter === persona ? "#FFFFFF" : "#344054",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (personaFilter !== persona) {
                            e.currentTarget.style.backgroundColor = "#F9FAFB";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (personaFilter !== persona) {
                            e.currentTarget.style.backgroundColor = "#FFFFFF";
                          }
                        }}
                      >
                        {persona}
                      </button>
                    ))}
                  </div>
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
                        setSelectedCapability("All");
                        setDeploymentFilter("All");
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
          )}
        </div>

        {/* Agent Grid */}
        <div className="w-full mx-auto" style={{ maxWidth: "1360px", paddingLeft: "12px", paddingRight: "12px" }}>
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
      </>
    </div>
  );
}


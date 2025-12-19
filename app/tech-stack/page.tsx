"use client"

import { useEffect, useMemo, useState, useRef } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { DeploymentCard } from "../../components/deployment-card"
import Image from "next/image"
import Link from "next/link"
import { Search, ChevronDown, Cloud as CloudIcon, X } from "lucide-react"
import Head from "next/head"
import { useModal } from "../../hooks/use-modal"

type Capability = {
  by_capability_id: string
  by_capability: string
}

type GroupedDeployment = {
  service_provider: string
  by_capability: string
  services: { 
    service_name: string
    deployment: string
    cloud_region: string
    description?: string
    capability_name?: string
    service_id?: string
  }[]
  deployments: string[]
  cloud_regions: string[]
  description?: string
}

export default function TechStackPage() {
  const { openModal } = useModal()
  const [capabilities, setCapabilities] = useState<Capability[]>([])
  const [grouped, setGrouped] = useState<GroupedDeployment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [regionFilter, setRegionFilter] = useState<string>("All")
  const [capabilityFilter, setCapabilityFilter] = useState<string>("All")
  const [expandedWhyItWorks, setExpandedWhyItWorks] = useState<number | null>(1)
  const [countersStarted, setCountersStarted] = useState(false)
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const [count3, setCount3] = useState(0)
  const [count4, setCount4] = useState(0)
  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; width: number } | null>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const tabsContainerRef = useRef<HTMLDivElement>(null)

  const whyItWorksData = [
    {
      id: 1,
      number: "1.",
      title: "Plug-and-Play Agents",
      description: "Start with just one agent — for a specific use case like credit card recommendation, offer personalization, or churn prevention\n\nDeploy a bundle of agents to power complete customer journeys.",
      image: "/img/dep1.svg",
    },
    {
      id: 2,
      number: "2.",
      title: "Ready-to-Use Solutions",
      description: "Launch with pre-built solutions that combine agents + UI + logic — for use cases like hyper-personalization, product intelligence, and CX automation\n\nConfigure, localize, and go live in under 30 days.",
      image: "/img/dep2.svg",
    },
    {
      id: 3,
      number: "3.",
      title: "API-First Architecture",
      description: "All agents are accessible via secure APIs.\n\nIntegrate into your apps, data pipelines, CRMs, or customer portals.",
      image: "/img/dep3.svg",
    },
  ]

  const providerLogo = (provider: string) => {
    if (!provider) return null
    const p = provider.toLowerCase().trim()
    if (p.includes("aws") || p.includes("amazon")) return "/img/deployment logo/image 7.svg"
    if (p.includes("azure") || p.includes("microsoft")) return "/img/deployment logo/image 8.svg"
    if (p.includes("gcp") || p.includes("google") || p.includes("google cloud")) return "/img/deployment logo/image 9.svg"
    if (p.includes("open-source") || p.includes("opensource") || p.includes("open source")) return "/img/deployment logo/image 10.svg"
    if (p.includes("saas") || p.includes("software as a service")) return "/img/deployment logo/image 11.svg"
    return null
  }

  // Counter animation effect
  useEffect(() => {
    if (!countersStarted) return

    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    // Counter 1: 100+
    const target1 = 100
    let current1 = 0
    const increment1 = target1 / steps
    const timer1 = setInterval(() => {
      current1 += increment1
      if (current1 >= target1) {
        setCount1(target1)
        clearInterval(timer1)
      } else {
        setCount1(Math.floor(current1))
      }
    }, stepDuration)

    // Counter 2: 15
    const target2 = 15
    let current2 = 0
    const increment2 = target2 / steps
    const timer2 = setInterval(() => {
      current2 += increment2
      if (current2 >= target2) {
        setCount2(target2)
        clearInterval(timer2)
      } else {
        setCount2(Math.floor(current2))
      }
    }, stepDuration)

    // Counter 3: 118
    const target3 = 118
    let current3 = 0
    const increment3 = target3 / steps
    const timer3 = setInterval(() => {
      current3 += increment3
      if (current3 >= target3) {
        setCount3(target3)
        clearInterval(timer3)
      } else {
        setCount3(Math.floor(current3))
      }
    }, stepDuration)

    // Counter 4: 3
    const target4 = 3
    let current4 = 0
    const increment4 = target4 / steps
    const timer4 = setInterval(() => {
      current4 += increment4
      if (current4 >= target4) {
        setCount4(target4)
        clearInterval(timer4)
      } else {
        setCount4(Math.floor(current4))
      }
    }, stepDuration)

    return () => {
      clearInterval(timer1)
      clearInterval(timer2)
      clearInterval(timer3)
      clearInterval(timer4)
    }
  }, [countersStarted])

  // IntersectionObserver to trigger counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersStarted) {
            setCountersStarted(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    const statsSection = document.getElementById("stats-section")
    if (statsSection) {
      observer.observe(statsSection)
    }

    return () => {
      if (statsSection) {
        observer.unobserve(statsSection)
      }
    }
  }, [countersStarted])

  useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch("https://agents-store.onrender.com/api/capabilities", {
          headers: { accept: "application/json" },
          signal: controller.signal,
        })
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const json = await res.json()
        setCapabilities(json.capabilities || [])
        setGrouped(json.grouped_deployments || [])
      } catch (e: any) {
        if (e.name !== "AbortError") setError(e.message || "Failed to load capabilities")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => controller.abort()
  }, [])

  // Optimize scroll performance with passive listeners
  useEffect(() => {
    const handleScroll = () => {
      // Scroll handling optimized with requestAnimationFrame
      requestAnimationFrame(() => {
        // Any scroll-based logic here
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotate gradient animation for button
  useEffect(() => {
    const element = document.querySelector(".border-gradient") as HTMLElement;
    if (!element) return;

    let angle = 0;
    let animationFrameId: number;
    
    const rotateGradient = () => {
      angle = (angle + 1) % 360;
      element.style.setProperty("--gradient-angle", `${angle}deg`);
      animationFrameId = requestAnimationFrame(rotateGradient);
    };

    rotateGradient();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Scroll animations with IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
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
        }
      });
    }, observerOptions);

    // Function to observe all animated elements
    const observeElements = () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      );
      animatedElements.forEach((el) => {
        // Check if element is already in viewport
        const rect = el.getBoundingClientRect();
        const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInViewport) {
          // If already in viewport, trigger animation immediately
          if (el.classList.contains("fade-in-section")) {
            el.classList.add("fade-in-visible");
          } else if (el.classList.contains("slide-in-left")) {
            el.classList.add("slide-in-visible");
          } else if (el.classList.contains("slide-in-right")) {
            el.classList.add("slide-in-visible");
          } else if (el.classList.contains("scale-in")) {
            el.classList.add("scale-in-visible");
          } else if (el.classList.contains("fade-in-blur")) {
            el.classList.add("fade-in-blur-visible");
          } else if (el.classList.contains("stagger-item")) {
            el.classList.add("stagger-visible");
          }
        } else {
          // Only observe if not already visible
          if (!el.classList.contains("fade-in-visible") && 
              !el.classList.contains("slide-in-visible") && 
              !el.classList.contains("scale-in-visible") && 
              !el.classList.contains("fade-in-blur-visible") && 
              !el.classList.contains("stagger-visible")) {
            observer.observe(el);
          }
        }
      });
    };

    // Initial observation
    observeElements();

    // Re-observe when data changes (for dynamically loaded cards)
    // Use multiple timeouts to catch cards that load at different times
    const timeoutId1 = setTimeout(() => {
      observeElements();
    }, 100);
    const timeoutId2 = setTimeout(() => {
      observeElements();
    }, 500);
    const timeoutId3 = setTimeout(() => {
      observeElements();
    }, 1000);

    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      );
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, [grouped, loading])

  const providers = useMemo(() => Array.from(new Set(grouped.map(g => g.service_provider))), [grouped])
  const capabilityOptions = useMemo(
    () => Array.from(new Set(capabilities.map(c => c.by_capability))).sort(),
    [capabilities]
  )
  const regionOptions = useMemo(() => {
    const allRegions = new Set<string>()
    grouped.forEach(item => {
      if (item.cloud_regions && item.cloud_regions.length > 0) {
        item.cloud_regions.forEach(region => allRegions.add(region))
      }
    })
    return Array.from(allRegions).sort()
  }, [grouped])

  // Count items per provider (count all services, not just grouped items)
  const providerCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    grouped.forEach(item => {
      const provider = item.service_provider
      counts[provider] = (counts[provider] || 0) + (item.services?.length || 0)
    })
    return counts
  }, [grouped])
  
  // Flatten grouped deployments to individual service cards
  const flattenedServices = useMemo(() => {
    return grouped.flatMap(item => 
      (item.services || []).map(service => ({
        ...item,
        service: service,
        service_name: service.service_name,
        deployment: service.deployment,
        cloud_region: service.cloud_region,
      }))
    )
  }, [grouped])

  // Set AWS as default selected provider
  useEffect(() => {
    if (providers.length > 0 && !selectedProvider) {
      // Find AWS provider (case-insensitive)
      const awsProvider = providers.find(p => p.toLowerCase().includes("aws"))
      if (awsProvider) {
        setSelectedProvider(awsProvider)
      } else if (providers.length > 0) {
        // Fallback to first provider if AWS not found
        setSelectedProvider(providers[0])
      }
    }
  }, [providers, selectedProvider])

  // Update indicator position when selected provider changes
  useEffect(() => {
    const updateIndicatorPosition = () => {
      if (selectedProvider && tabRefs.current.has(selectedProvider) && tabsContainerRef.current) {
        const selectedTab = tabRefs.current.get(selectedProvider)
        const container = tabsContainerRef.current
        
        if (selectedTab && container) {
          // Use requestAnimationFrame for smooth updates
          requestAnimationFrame(() => {
            const containerRect = container.getBoundingClientRect()
            const tabRect = selectedTab.getBoundingClientRect()
            const left = tabRect.left - containerRect.left
            const width = tabRect.width
            
            setIndicatorStyle({ left, width })
          })
        }
      }
    }
    
    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      updateIndicatorPosition()
    }, 0)
    
    // Update indicator on window resize
    const handleResize = () => {
      updateIndicatorPosition()
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [selectedProvider, providers])

  const filtered = useMemo(() => {
    // Filter flattened services
    let filtered = flattenedServices
    
    // Filter by region
    if (regionFilter !== "All") {
      filtered = filtered.filter(item => 
        item.cloud_regions && item.cloud_regions.some(region => region === regionFilter) ||
        item.cloud_region === regionFilter
      )
    }
    
    // Filter by capability
    if (capabilityFilter !== "All") {
      filtered = filtered.filter(item => item.by_capability === capabilityFilter)
    }
    
    // Filter by search
    if (search.trim()) {
    const q = search.toLowerCase()
      filtered = filtered.filter(item => 
        item.service_name?.toLowerCase().includes(q)
      )
    }
    
    return filtered
  }, [flattenedServices, regionFilter, capabilityFilter, search])

  return (
    <>
      <Head>
        <title>Deployment Option - Tangram AI</title>
        <meta name="description" content="Choose your preferred platform and deployment model for AI agents" />
      </Head>
      <div className="flex flex-col min-h-screen" style={{ willChange: "scroll-position", transform: "translateZ(0)" }}>
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden min-h-[90vh] fade-in-section" style={{ willChange: "transform", transform: "translateZ(0)" }}>
        {/* Top radial gradient banner */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            background: "radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFFFFF 100%)",
            opacity: 1,
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
        <div className="w-full px-8 md:px-12 lg:px-16 pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-20 lg:pb-24 relative text-center">
            {/* Badge */}
              <span 
                className="inline-block"
                style={{
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
                  backgroundColor: "#CCCCFF",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "140%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: "#2910A7",
                  marginBottom: "14px",
                  whiteSpace: "nowrap",
                }}
              >
                Deployment
              </span>

            {/* Main Title */}
          <h1 
            className="mb-4 text-center fade-in-blur"
                style={{
              fontFamily: "Poppins",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "52px",
                  lineHeight: "54px",
                  textAlign: "center",
              color: "var(--Interface-Color-Primary-900, #091917)",
              marginBottom: "18px",
                }}
              >
                Deploy Tangram
            </h1>

            {/* Subtitle */}
            <p
              className="text-center"
              style={{
                fontFamily: "Poppins",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "24px",
                textAlign: "center",
                color: "var(--Interface-Color-Primary-900, #091917)",
                marginBottom: "6px",
              }}
            >
              Fast. Flexible. Proven.
            </p>

            {/* Description */}
            <p 
              className="mx-auto max-w-2xl text-center"
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "24px",
                textAlign: "center",
                color: "var(--Interface-Color-Primary-900, #091917)",
              }}
            >
              From sandbox to scale — we've done it all. Tangram is enterprise-ready — every agent is built for real-world deployment with full integration, governance, and ROI tracking.
            </p>
            
            {/* Scroll Down Animation */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-10">
              <span 
                className="text-xs mb-2"
                style={{
                  fontFamily: "Poppins",
                  fontSize: "12px",
                  color: "#6B7280",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Scroll
              </span>
              <div 
                className="scroll-indicator"
                style={{
                  cursor: "pointer",
                }}
                onClick={() => {
                  const nextSection = document.querySelector('.fade-in-section')
                  if (nextSection) {
                    nextSection.scrollIntoView({ behavior: "smooth" })
                  }
                }}
              >
                <ChevronDown 
                  size={24}
                  style={{
                    color: "#6B7280",
                  }}
                />
        </div>
            </div>
        </div>
      </section>

      {/* Why it Works Section */}
      <section className="pt-0 pb-8 md:pb-12 lg:pb-16 min-h-[80vh] bg-white fade-in-section" style={{ willChange: "transform", transform: "translateZ(0)", display: "block", visibility: "visible" }}>
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div style={{ marginBottom: "48px" }}>
              <h2
                className="text-balance fade-in-blur"
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "28px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                  background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                How it works: Modular, API-First Deployment
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {/* Left Side - Accordion */}
              <div className="flex flex-col slide-in-left" style={{ maxWidth: "584px", width: "100%" }}>
                {whyItWorksData.map((item, index) => {
                  const isExpanded = expandedWhyItWorks === item.id;
                  const isLast = index === whyItWorksData.length - 1;
                  return (
                    <div key={item.id} className={index > 0 ? "border-t" : ""} style={{ borderColor: "#D1D6DB" }}>
                      <button
                        onClick={() => setExpandedWhyItWorks(isExpanded ? null : item.id)}
                        className="w-full flex items-center justify-start px-2 py-6 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          paddingTop: "24px",
                          paddingBottom: isLast ? "12px" : "24px",
                        }}
                      >
                        <h3 
                          style={{
                            color: "#161D26",
                            fontFamily: "Poppins",
                            fontSize: "17.4px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "23.99px",
                          }}
                        >
                          {item.title}
                        </h3>
                      </button>
                      <div 
                        className="overflow-hidden transition-all duration-300 ease-in-out"
                        style={{
                          maxHeight: isExpanded ? "500px" : "0",
                          opacity: isExpanded ? 1 : 0,
                        }}
                      >
                        <div className="px-2" style={{ paddingBottom: isLast ? "12px" : "24px" }}>
                          <p style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "1.5",
                            color: "#34414e",
                            whiteSpace: "pre-line",
                          }}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Side - Image */}
              <div className="flex items-start justify-center slide-in-right">
                <div className="relative">
                  <Image
                    src={expandedWhyItWorks 
                      ? whyItWorksData.find(item => item.id === expandedWhyItWorks)?.image || "/img/catalystwhy1.svg"
                      : whyItWorksData[0]?.image || "/img/catalystwhy1.svg"
                    }
                    alt="How it Works Diagram"
                    width={600}
                    height={565}
                    className="object-contain transition-opacity duration-300"
                    style={{
                      width: "600px",
                      maxWidth: "100%",
                      height: "auto",
                    }}
                    key={expandedWhyItWorks || 1}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pick Your Tech Stack Section */}
      <section className="fade-in-section py-16 md:py-20 lg:py-24" style={{ 
        willChange: "transform", 
        transform: "translateZ(0)",
        background: "#F8F8F8",
        display: "block",
        visibility: "visible",
      }}>
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-8">
              <h2
                className="fade-in-blur"
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "28px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "39.2px",
                  letterSpacing: "-0.56px",
                  background: "linear-gradient(270deg, #F05283 0%, #8F2B8C 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "8px",
                }}
              >
                Pick Your Tech Stack
              </h2>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "24px",
                  textAlign: "center",
                  color: "#111827",
                  maxWidth: "800px",
                  margin: "0 auto",
                  marginBottom: "72px",
                }}
              >
                Deploy on your preferred cloud platform with enterprise-grade security<br />
                We support all major service providers to work seamlessly with your existing infrastructure
              </p>
            </div>

            {/* Provider Tabs */}
            {providers.length > 0 && (
              <div className="flex justify-center mb-8" style={{ display: "flex", visibility: "visible" }}>
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
                  
                  {providers.map((provider) => {
                    const count = providerCounts[provider] || 0
                    const isSelected = selectedProvider === provider
                    
                    // Format provider name for display
                    const getProviderDisplayName = (provider: string) => {
                      const p = provider.toLowerCase()
                      if (p.includes("aws")) return "AWS"
                      if (p.includes("azure") || p.includes("microsoft")) return "Azure"
                      if (p.includes("gcp") || p.includes("google") || p.includes("google cloud")) return "GCP"
                      if (p.includes("open-source") || p.includes("opensource") || p.includes("open source")) return "Open Source"
                      if (p.includes("saas")) return "SaaS"
                      return provider
                    }
                    
                    const displayName = getProviderDisplayName(provider)
                    
                    return (
                      <button
                        key={provider}
                        ref={(el) => {
                          if (el) {
                            tabRefs.current.set(provider, el)
                          } else {
                            tabRefs.current.delete(provider)
                          }
                        }}
                        onClick={() => setSelectedProvider(provider)}
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
                        {displayName} ({count})
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deployment options"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg"
                  style={{
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    color: "#667085",
                  }}
              />
          </div>
              <div className="hidden md:block h-8 w-px bg-gray-200"></div>
              <div className="flex" style={{ gap: "24px" }}>
                <div className="relative inline-flex items-center">
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      color: "#344054",
                      marginRight: "4px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {regionFilter === "All" ? "By Region" : regionFilter}
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
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                  >
                    <option value="All">By Region</option>
                    {regionOptions.map(region => (
                      <option key={region} value={region}>{region}</option>
                ))}
              </select>
                </div>
                <div className="relative inline-flex items-center">
                  <span
                    style={{
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      color: "#344054",
                      marginRight: "4px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {capabilityFilter === "All" ? "By Capability" : capabilityFilter}
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
                    <option value="All">By Capability</option>
                {capabilityOptions.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {/* Clear Filter Button - appears when filters are active */}
            {(search.trim() || regionFilter !== "All" || capabilityFilter !== "All") && (
              <div className="hidden md:block h-8 w-px bg-gray-200"></div>
            )}
            {(search.trim() || regionFilter !== "All" || capabilityFilter !== "All") && (
              <button
                onClick={() => {
                  setSearch("")
                  setRegionFilter("All")
                  setCapabilityFilter("All")
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-gray-50"
                style={{
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  color: "#344054",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
                <span>Clear filters</span>
              </button>
            )}
          </div>
        </div>

            {/* Deployment Cards Grid - Grouped by Provider */}
            {(selectedProvider ? [selectedProvider] : providers).map((provider) => {
              const providerCards = filtered.filter(item => item.service_provider === provider)
              if (providerCards.length === 0) return null
              
              // Format provider name for display
              const getProviderDisplayName = (provider: string) => {
                const p = provider.toLowerCase()
                if (p.includes("aws")) return "AWS"
                if (p.includes("azure")) return "Azure"
                if (p.includes("gcp") || p.includes("google")) return "GCP"
                if (p.includes("open-source") || p.includes("opensource") || p.includes("open source")) return "Open Source"
                if (p.includes("saas")) return "SaaS"
                return provider
              }
              
              return (
                <div key={provider} className="mb-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {providerCards.map((item, idx) => {
                      // Get regions from cloud_regions array or from service cloud_region
                      const regions = item.cloud_regions && item.cloud_regions.length > 0 
                        ? item.cloud_regions 
                        : (item.cloud_region ? item.cloud_region.split(", ") : [])
                      
                      // Get deployment type from service or deployments array
                      const deploymentTypes = item.deployments && item.deployments.length > 0
                        ? item.deployments
                        : (item.deployment ? [item.deployment] : [])
                      
                      return (
                      <div
                        key={`${provider}-${idx}-${item.service_name}`}
                        className="bg-white rounded-lg p-6 transition-all duration-300 cursor-pointer group"
                        style={{
                          opacity: 1,
                          visibility: "visible",
                          display: "block",
                          boxShadow: "none",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "0px 8px 10px -6px rgba(16, 24, 40, 0.1), 0px 20px 25px -5px rgba(16, 24, 40, 0.1)"
                          e.currentTarget.style.transform = "translateY(-2px)"
                          // Remove grayscale filter on hover
                          const logoImg = e.currentTarget.querySelector('.logo-image') as HTMLImageElement
                          if (logoImg) {
                            logoImg.style.filter = "grayscale(0%)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none"
                          e.currentTarget.style.transform = "translateY(0)"
                          // Restore grayscale filter on leave
                          const logoImg = e.currentTarget.querySelector('.logo-image') as HTMLImageElement
                          if (logoImg) {
                            logoImg.style.filter = "grayscale(100%)"
                          }
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3
                            style={{
                              fontFamily: "Poppins",
                              fontSize: "16px",
                              fontWeight: 600,
                              color: "#101828",
                              margin: 0,
                            }}
                          >
                            {item.service_name || "Service Name"}
                          </h3>
                          {providerLogo(item.service_provider) && (
                            <div className="w-12 h-6 flex items-center justify-center">
                              <img
                                src={providerLogo(item.service_provider)!}
                                alt={item.service_provider}
                                className="logo-image object-contain transition-all duration-300 max-w-full max-h-full"
                                style={{
                                  filter: "grayscale(100%)",
                                  width: "48px",
                                  height: "24px",
                                }}
                              />
            </div>
          )}
            </div>
                        <div className="space-y-3 border-t border-gray-200 pt-3">
                          {regions.length > 0 && (
                            <div className="flex items-center gap-3">
                              <span
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: "14px",
                                  fontWeight: 400,
                                  color: "#344054",
                                }}
                              >
                                Regions :
                              </span>
                              <div className="flex gap-2 flex-wrap">
                                {regions.slice(0, 3).map((region, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 rounded border border-gray-200 bg-white"
                                    style={{
                                      fontFamily: "Poppins",
                                      fontSize: "14px",
                                      fontWeight: 500,
                                      color: "#344054",
                                    }}
                                  >
                                    {region}
                                  </span>
                                ))}
                                {regions.length > 3 && (
                                  <span
                                    className="px-2 py-1 rounded border border-gray-200 bg-white"
                                    style={{
                                      fontFamily: "Poppins",
                                      fontSize: "14px",
                                      fontWeight: 500,
                                      color: "#344054",
                                    }}
                                  >
                                    +{regions.length - 3}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          {deploymentTypes.length > 0 && (
                      <div className="flex items-center gap-3">
                              <span
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: "14px",
                                  fontWeight: 400,
                                  color: "#344054",
                                }}
                              >
                                Deployment Type :
                              </span>
                              <div className="flex gap-2 flex-wrap">
                                {deploymentTypes.slice(0, 2).map((deployment, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 rounded border border-gray-200 bg-white"
                                    style={{
                                      fontFamily: "Poppins",
                                      fontSize: "14px",
                                      fontWeight: 500,
                                      color: "#344054",
                                    }}
                                  >
                                    {deployment}
                                  </span>
                                ))}
                                {deploymentTypes.length > 2 && (
                                  <span
                                    className="px-2 py-1 rounded border border-gray-200 bg-white"
                                    style={{
                                      fontFamily: "Poppins",
                                      fontSize: "14px",
                                      fontWeight: 500,
                                      color: "#344054",
                                    }}
                                  >
                                    +{deploymentTypes.length - 2}
                                  </span>
                                )}
                            </div>
                            </div>
                          )}
                          {item.by_capability && (
                            <div className="flex items-center gap-3">
                              <span
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: "14px",
                                  fontWeight: 400,
                                  color: "#344054",
                                }}
                              >
                                Capability :
                              </span>
                              <span
                                className="px-2 py-1 rounded border border-gray-200 bg-white"
                                style={{
                                  fontFamily: "Poppins",
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  color: "#344054",
                                }}
                              >
                                {item.by_capability}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )})}
                  </div>
                            </div>
                          )
            })}

          </div>
        </div>
      </section>

      {/* Pilot to Production in 3 Phases Section */}
      <section className="fade-in-section bg-white py-16 md:py-20 lg:py-24" style={{ willChange: "transform", transform: "translateZ(0)" }}>
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="max-w-[1100px] mx-auto flex flex-col items-center gap-[42px]">
            {/* Heading */}
            <div className="w-full flex flex-col items-center">
              <h2
                className="fade-in-blur"
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "32px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                  background: "linear-gradient(90deg, #7E0034 0%, #D9045B 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Pilot to Production in 3 Phases
              </h2>
            </div>

            {/* Three Phase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[28px] w-full items-stretch" style={{ maxWidth: "1100px" }}>
              {/* Phase 01 - Labs — Validate */}
              <div
                className="bg-white rounded-[24px] overflow-hidden relative flex flex-col stagger-item"
                style={{
                  width: "100%",
                  maxWidth: "352px",
                  border: "1px solid #E4E4E7",
                }}
              >
                {/* Gradient Background */}
                <div
                  style={{
                    background: "linear-gradient(180deg, #fed1e6 0%, #ffffff 100%)",
                    padding: "50px 50px 20px 50px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        fontSize: "20px",
                        lineHeight: "26px",
                        color: "#e84f7f",
                        letterSpacing: "-0.8px",
                        margin: 0,
                      }}
                    >
                      Phase
                    </p>
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        fontSize: "100px",
                        lineHeight: "130px",
                        letterSpacing: "-4px",
                        background: "linear-gradient(0deg, rgba(240, 82, 131, 0) 0%, #F05283 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                        margin: 0,
                        marginTop: "-8px",
                      }}
                    >
                      01
                          </p>
          </div>
          </div>
                {/* Content */}
                <div style={{ 
                  padding: "8px 24px 24px 24px", 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "8px",
                  alignItems: "flex-start",
                  alignSelf: "stretch",
                }}>
                  <h3
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "27px",
                      margin: 0,
                    }}
                  >
                    Labs — Validate
                  </h3>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "21px",
                      color: "#4B5563",
                      margin: 0,
                    }}
                  >
                    Rapid experiments, live testing, and user feedback loops to de-risk adoption.
                  </p>
          </div>
        </div>
                    
              {/* Phase 02 - Foundry — Build */}
              <div
                className="bg-white rounded-[24px] overflow-hidden relative flex flex-col stagger-item"
                style={{
                  width: "100%",
                  maxWidth: "352px",
                  border: "1px solid #E4E4E7",
                }}
              >
                {/* Gradient Background */}
                <div
                  style={{
                    background: "linear-gradient(180deg, #e5e5ff 0%, #ffffff 100%)",
                    padding: "50px 50px 20px 50px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        fontSize: "20px",
                        lineHeight: "26px",
                        color: "#2f5199",
                        letterSpacing: "-0.8px",
                        margin: 0,
                      }}
                    >
                      Phase
                    </p>
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        fontSize: "100px",
                        lineHeight: "130px",
                        letterSpacing: "-4px",
                        background: "linear-gradient(0deg, rgba(59, 96, 175, 0) 0%, #3B60AF 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                        margin: 0,
                        marginTop: "-8px",
                      }}
                    >
                      02
                    </p>
            </div>
          </div>
                {/* Content */}
                <div style={{ 
                  padding: "8px 24px 24px 24px", 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "8px",
                  alignItems: "flex-start",
                  alignSelf: "stretch",
                }}>
                  <h3
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "27px",
                      margin: 0,
                    }}
                  >
                    Foundry — Build
                  </h3>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "21px",
                      color: "#4B5563",
                      margin: 0,
                    }}
                  >
                    Assemble your agents into a full-fledged solution. Plug into systems, customize, and test.
                  </p>
        </div>
          </div>

              {/* Phase 03 - Factory — Scale */}
              <div
                className="bg-white rounded-[24px] overflow-hidden relative flex flex-col stagger-item"
                style={{
                  width: "100%",
                  maxWidth: "352px",
                  border: "1px solid #E4E4E7",
                }}
              >
                {/* Gradient Background */}
                <div
                  style={{
                    background: "linear-gradient(180deg, rgba(255, 156, 68, 0.21) 0%, #ffffff 100%)",
                    padding: "50px 50px 20px 50px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        fontSize: "20px",
                        lineHeight: "26px",
                        color: "#e37b20",
                        letterSpacing: "-0.8px",
                        margin: 0,
                      }}
                    >
                      Phase
                    </p>
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        fontSize: "100px",
                        lineHeight: "130px",
                        letterSpacing: "-4px",
                        background: "linear-gradient(0deg, rgba(255, 146, 49, 0) 0%, #FF9231 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                        margin: 0,
                        marginTop: "-8px",
                      }}
                    >
                      03
                    </p>
          </div>
                  </div>
                {/* Content */}
                <div style={{ 
                  padding: "8px 24px 24px 24px", 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "8px",
                  alignItems: "flex-start",
                  alignSelf: "stretch",
                }}>
                  <h3
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "27px",
                      margin: 0,
                    }}
                  >
                    Factory — Scale
                  </h3>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "21px",
                      color: "#4B5563",
                      margin: 0,
                    }}
                  >
                    Roll out across teams, geographies, or customer segments — with tracking, governance, and impact dashboards.
                  </p>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* We've Already Deployed Section */}
      <section id="stats-section" className="fade-in-section bg-white py-16 md:py-20 lg:py-24" style={{ willChange: "transform", transform: "translateZ(0)" }}>
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="max-w-[1100px] mx-auto flex flex-col items-center gap-[42px]">
            {/* Heading */}
            <div className="w-full flex flex-col items-center">
              <h2
                className="fade-in-blur"
                style={{
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "32px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                  background: "linear-gradient(90deg, #002E84 0%, #1157D9 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                We've Already Deployed…
              </h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 w-full items-start" style={{ maxWidth: "1100px" }}>
              {/* Stat 1 */}
              <div
                className="p-6 border-r border-gray-200 lg:border-r stagger-item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7.935px",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "40px",
                    lineHeight: "60px",
                    letterSpacing: "-0.4px",
                    color: "#181818",
                    margin: 0,
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  {count1}+
                </div>
                <div style={{ width: "100%", maxWidth: "309px" }}>
                  <p
                    style={{
                      color: "#65717C",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      margin: 0,
                    }}
                  >
                    agents across 3 continents
                  </p>
                </div>
              </div>

              {/* Stat 2 */}
              <div
                className="p-6 border-r border-gray-200 md:border-r lg:border-r stagger-item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7.935px",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "40px",
                    lineHeight: "60px",
                    letterSpacing: "-0.4px",
                    color: "#181818",
                    margin: 0,
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  {count2}
                </div>
                <div style={{ width: "100%", maxWidth: "309px" }}>
                  <p
                    style={{
                      color: "#65717C",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      margin: 0,
                    }}
                  >
                    solutions across BFSI and commerce
                  </p>
                </div>
              </div>

              {/* Stat 3 */}
              <div
                className="p-6 border-r border-gray-200 lg:border-r stagger-item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7.935px",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "40px",
                    lineHeight: "60px",
                    letterSpacing: "-0.4px",
                    color: "#181818",
                    margin: 0,
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  {count3}
                </div>
                <div style={{ width: "100%", maxWidth: "309px" }}>
                  <p
                    style={{
                      color: "#65717C",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      margin: 0,
                    }}
                  >
                    agents evolved from 7 years of enterprise-scale AI (maya.ai)
                  </p>
                </div>
              </div>

              {/* Stat 4 */}
              <div
                className="p-6 stagger-item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "7.935px",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "40px",
                    lineHeight: "60px",
                    letterSpacing: "-0.4px",
                    color: "#181818",
                    margin: 0,
                    minHeight: "60px",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  {count4}
                </div>
                <div style={{ width: "100%", maxWidth: "309px" }}>
                  <p
                    style={{
                      color: "#65717C",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "150%",
                      letterSpacing: "-0.4px",
                      margin: 0,
                    }}
                  >
                    signed PoCs moving into production scale
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Want to deploy Tangram at your enterprise? Section */}
      <section className="fade-in-section" style={{ 
        width: "100%",
        background: "transparent",
        position: "relative",
        padding: "80px 0",
        margin: "0 auto",
        textRendering: "optimizeLegibility",
        WebkitFontSmoothing: "antialiased",
        boxSizing: "border-box",
        overflow: "hidden",
      }}>
        <div style={{
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
        }} />
        <div style={{
          width: "100%",
          maxWidth: "1232px",
          margin: "0 auto",
          position: "relative",
          border: "none",
          borderRadius: 0,
          background: "transparent",
          padding: "70px 48px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          boxSizing: "border-box",
          zIndex: 1,
        }}>
          {/* Header Section */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            width: "100%",
            marginBottom: "32px",
            boxSizing: "border-box",
          }}>
            {/* Main Heading */}
            <h1 className="fade-in-blur" style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "32px",
              lineHeight: "44.8px",
              letterSpacing: "-0.64px",
              textAlign: "center",
              verticalAlign: "middle",
              background: "linear-gradient(to left, #0082c0 0%, #3b60af 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              margin: 0,
              width: "100%",
              maxWidth: "100%",
              padding: "0 16px",
              boxSizing: "border-box",
            }}>
              Want to deploy Tangram at your enterprise?
            </h1>

            {/* Subtitle */}
            <p style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0%",
              textAlign: "center",
              verticalAlign: "middle",
              color: "#6b7280",
              margin: 0,
              width: "100%",
              maxWidth: "548px",
              position: "relative",
            }}>
              Get in touch and learn how tangram.ai can help you unlock the full potential of Gen AI for your business.
            </p>
          </div>

          {/* Button Group */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "24px",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 0,
            width: "100%",
            boxSizing: "border-box",
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
              height: "48px",
              position: "relative",
              background: "rgba(121, 133, 171, 0.05)",
              borderRadius: "4px",
              padding: "20px 28px",
              boxSizing: "border-box",
              flexShrink: 0,
              minWidth: "123px",
            }}>
              <a
                href="/contact"
                style={{
                  position: "absolute",
                  left: "2px",
                  top: "2px",
                  width: "123px",
                  height: "44px",
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
                onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
                onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
              >
                Talk to us
              </a>
            </div>
            <a
              href="/agents"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "44px",
                padding: "16px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "21px",
                letterSpacing: "0%",
                color: "#111827",
                background: "transparent",
                border: "1px solid #222222",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                outline: "none",
                textDecoration: "none",
                whiteSpace: "nowrap",
                boxSizing: "border-box",
                position: "relative",
                minWidth: "fit-content",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0, 0, 0, 0.04)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              Start with a pilot
            </a>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}

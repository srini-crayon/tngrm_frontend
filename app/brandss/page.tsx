"use client"

import Image from "next/image"
import React, { useState, useEffect, useRef, useMemo } from "react"
import type { ReactNode } from "react"

// MegaTrends Component
interface Trend {
  index: string
  tag: string
  title: string
  shiftTitle: string
  shiftBody: string
  extraLabel: string
  extraBody: string
  accentColor: string
}

const defaultTrends: Trend[] = [
  {
    index: "01",
    tag: "Consumer",
    title: "Zebra Striping",
    shiftTitle: "THE SHIFT",
    shiftBody: "Consumers are no longer strictly 'drinkers' or 'non-drinkers'... switching between full-strength and 0.0% options within the same night.",
    extraLabel: "THE PARADOX",
    extraBody: "Total volume may be flat/down, but 'Value per Liter' is rising due to premiumisation.",
    accentColor: "pink",
  },
  {
    index: "02",
    tag: "Technology",
    title: "CO-Pilots to Agents",
    shiftTitle: "THE SHIFT",
    shiftBody: "The 'iron curtain' between distributors and retailers is crumbling. Bar owners now demand the same hyper-personalized experience they get as consumers on Amazon.",
    extraLabel: "THE CIO VIEW",
    extraBody: "Budget is moving from 'Knowledge Management' to 'Action Management' (booking stock, reconciling invoices).",
    accentColor: "blue",
  },
  {
    index: "03",
    tag: "Channel",
    title: "B2b2c Convergence",
    shiftTitle: "THE SHIFT",
    shiftBody: "The 'Iron Curtain' between distributors and retailers is crumbling. Bar owners now demand the same hyper-personalized experience they get as consumers on Amazon.",
    extraLabel: "THE CIO VIEW",
    extraBody: "Most FMCG B2B portals are currently just glorified Excel sheets.",
    accentColor: "orange",
  },
  {
    index: "04",
    tag: "Operational",
    title: "From Asset - Heave to Data-rich",
    shiftTitle: "THE SHIFT",
    shiftBody: "The 'Iron Curtain' between distributors and retailers is crumbling. Bar owners now demand the same hyper-personalized experience they get as consumers on Amazon.",
    extraLabel: "THE CIO VIEW",
    extraBody: "Most FMCG B2B portals are currently just glorified Excel sheets.",
    accentColor: "teal",
  },
]

function MegaTrends({ trends = defaultTrends }: { trends?: Trend[] }) {
  const getAccentColorClasses = (color: string) => {
    switch (color) {
      case "pink":
        return {
          numberGradient: "linear-gradient(0deg, rgba(240, 82, 131, 0) 0%, #F05283 100%)",
          tag: "bg-pink-100 text-pink-700 hover:bg-pink-200",
        }
      case "blue":
        return {
          numberGradient: "linear-gradient(0deg, rgba(0, 129, 197, 0) 0%, #0081C5 100%)",
          tag: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
        }
      case "orange":
        return {
          numberGradient: "linear-gradient(0deg, rgba(245, 137, 31, 0) 0%, #F5891F 100%)",
          tag: "bg-orange-100 text-orange-700 hover:bg-orange-200",
        }
      case "teal":
        return {
          numberGradient: "linear-gradient(0deg, rgba(4, 171, 139, 0) 0%, #04AB8B 100%)",
          tag: "bg-teal-100 text-teal-700 hover:bg-teal-200",
        }
      default:
        return {
          numberGradient: "linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, #000000 100%)",
          tag: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        }
    }
  }

  return (
    <section
      className="w-full py-16 px-8 md:px-20 lg:px-20 bg-white"
      style={{
        minHeight: "650px",
      }}
      aria-label="Mega Trends section"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "28px",
              lineHeight: "33.6px",
              letterSpacing: "-0.56px",
              textAlign: "center",
              verticalAlign: "middle",
              background: "linear-gradient(270deg, #FF9231 0%, #F05283 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              marginBottom: "4px",
            }}
          >
            Mega Trends
          </h2>
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0%",
              textAlign: "center",
              verticalAlign: "middle",
              color: "#111827",
            }}
          >
            Four converging forces reshaping the beverage industry landscape
          </p>
        </div>

        {/* Cards Grid - Aligned with hero section boundaries */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between gap-6 md:gap-8"
          role="list"
          aria-label="Mega trends cards"
        >
          {trends.map((trend, idx) => {
            const colors = getAccentColorClasses(trend.accentColor)
            return (
              <div
                key={idx}
                role="listitem"
                className="bg-white card-hover flex-shrink-0 cursor-pointer"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  width: "290px",
                  height: "auto",
                  borderRadius: "24px",
                  border: "1px solid #E4E4E7",
                  padding: "28px 36px",
                  maxWidth: "100%",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)"
                  e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                  e.currentTarget.style.borderColor = "#D1D5DB"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.borderColor = "#E4E4E7"
                }}
              >
                {/* Card Header - Number and Tag */}
                <div className="flex justify-between items-start mb-4">
                  {/* Large Index Number */}
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "64px",
                      lineHeight: "64px",
                      letterSpacing: "-4px",
                      verticalAlign: "middle",
                      background: colors.numberGradient,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    {trend.index}
                  </span>
                  {/* Pill Tag */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${colors.tag} transition-colors`}
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {trend.tag}
                  </span>
                </div>

                {/* Card Title */}
                <div
                  style={{
                    minHeight: "45px",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "21px",
                      lineHeight: "120%",
                      letterSpacing: "0%",
                      color: "#111827",
                      margin: 0,
                    }}
                  >
                    {trend.title}
                  </h3>
                </div>

                {/* THE SHIFT Section */}
                <div className="mb-5">
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#111827",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    {trend.shiftTitle}
                  </p>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      color: "#4B5563",
                    }}
                  >
                    {trend.shiftBody}
                  </p>
                </div>

                {/* Extra Section (THE PARADOX or THE CIO VIEW) */}
                <div>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#111827",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                    }}
                  >
                    {trend.extraLabel}
                  </p>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      color: "#4B5563",
                    }}
                  >
                    {trend.extraBody}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Scroll Animation Hook
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return { ref, isVisible }
}

// Animated Section Component
function AnimatedSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export default function BrandssPage() {
  return (
    <div className="min-h-screen bg-white">
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .button-hover {
          transition: all 0.2s ease;
        }

        .button-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .image-hover {
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .image-hover:hover {
          transform: scale(1.05);
        }
      `}</style>
      {/* Hero Section */}
      <section
        className="w-full py-20 px-8 md:px-20 lg:px-20"
        style={{
          background: "radial-gradient(100% 100% at 50% 0%, #DDFFED 0%, #FFFFFF 100%)",
          minHeight: "360px",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            {/* Left Side - Content */}
            <div className="flex-1 flex flex-col justify-center space-y-6 lg:space-y-8">
              {/* Logos Section - Crayon and Heineken */}
              <div 
                className="flex items-center gap-4 mb-4"
                style={{
                  width: "913px",
                  maxWidth: "100%",
                }}
              >
                <Image
                  src="/img/crayondata-20logo.png"
                  alt="Crayon Data"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
                <div className="h-8 w-px bg-gray-300" />
                <Image
                  src="/img/heinekenlogo.png"
                  alt="Heineken"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </div>

              {/* Main Headline - Heineken with Gradient */}
              <h1
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(48px, 8vw, 100px)",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  background: "linear-gradient(90deg, #04AB8B 0%, #0081C5 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: 0,
                }}
              >
                Heineken
              </h1>

              {/* Sub-headline */}
              <h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(32px, 5vw, 64px)",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#091917",
                  margin: 0,
                }}
              >
                AI Growth Opportunities
              </h2>

              {/* Subtitle */}
              <p
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "36px",
                  lineHeight: "100%",
                  letterSpacing: "0%",
                  color: "#65717C",
                  marginTop: "28px",
                }}
              >
                Strategic proposal for Heineken APAC
              </p>
            </div>

            {/* Right Side - Bottle Image */}
            <div className="flex-1 flex items-start justify-center lg:justify-end">
              <div
                className="relative"
                style={{
                  width: "378px",
                  height: "469px",
                  mixBlendMode: "darken",
                  marginTop: "clamp(60px, 10vw, 120px)",
                  opacity: 1,
                }}
              >
                <Image
                  src="/img/henkin_logo.png"
                  alt="Heineken Bottle"
                  width={378}
                  height={469}
                  className="w-full h-full object-contain image-hover fade-in"
                  style={{
                    opacity: 1,
                    animationDelay: "0.3s",
                  }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mega Trends Section */}
      <AnimatedSection delay={0.1}>
        <MegaTrends />
      </AnimatedSection>

      {/* Agentic Opportunities Section */}
      <AnimatedSection delay={0.2}>
        <AgenticOpportunities />
      </AnimatedSection>

      {/* Our Agents Spotlight Section */}
      <AnimatedSection delay={0.3}>
        <AgentsSpotlight />
      </AnimatedSection>

      {/* Want to deploy Tangram section */}
      <AnimatedSection delay={0.4}>
      <section className="w-full py-20 px-8 md:px-16 lg:px-20" style={{ 
        marginTop:"40px",
        marginBottom:"40px",
        width: "100%",
        height: "548px",
        opacity: 1,
        position: "relative",
        background: "#FFFFFF",
        // margin: "0 auto",
        textRendering: "optimizeLegibility",
        WebkitFontSmoothing: "antialiased",
        boxSizing: "border-box",
        overflow: "hidden",
        zIndex: 1,
        maxWidth: "100%",
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
        <div className="max-w-7xl mx-auto" style={{
          position: "relative",
          border: "none",
          borderRadius: 0,
          background: "transparent",
          padding: "70px clamp(24px, 4vw, 48px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          boxSizing: "border-box",
          zIndex: 2,
          minHeight: "200px",
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
            <h1 style={{
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
              Get in touch and learn how tangram.ai can  help you <br/>unlock the full potential of Gen AI for your business.
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
              minWidth: "135px",
            }}>
              {/* Shadow element */}
              <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "139px",
                height: "48px",
                opacity: 1,
                paddingTop: "20px",
                paddingRight: "28px",
                paddingBottom: "20px",
                paddingLeft: "28px",
                background: "#0081C500",
                zIndex: 0,
                boxSizing: "border-box",
              }} />
              <a
                href="/agents"
                style={{
                  position: "absolute",
                  left: "2px",
                  top: "2px",
                  width: "135px",
                  height: "44px",
                  opacity: 1,
                  borderRadius: "12px",
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
                  textDecoration: "none",
                  cursor: "pointer",
                  pointerEvents: "auto",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9"
                  e.currentTarget.style.transform = "translateY(-2px)"
                  e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1"
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "none"
                }}
              >
                Agent Store 
              </a>
            </div>
            <a
              href="/ai-catalyst"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "135px",
                height: "44px",
                opacity: 1,
                borderRadius: "12px",
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
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                outline: "none",
                textDecoration: "none",
                whiteSpace: "nowrap",
                boxSizing: "border-box",
                position: "relative",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.04)"
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                e.currentTarget.style.borderColor = "#000000"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = "none"
                e.currentTarget.style.borderColor = "#222222"
              }}
            >
              AI Catalyst
            </a>
          </div>
        </div>
      </section>
      </AnimatedSection>
    </div>
  )
}

// Agent type for Spotlight
type SpotlightAgent = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  demoPreview?: string;
};

// Our Agents Spotlight Component
function AgentsSpotlight() {
  const [agents, setAgents] = useState<SpotlightAgent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://agents-store.onrender.com/api/agents", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`);
        const data = await res.json();
        const apiAgents = data?.agents || [];
        
        // Filter approved agents and map to SpotlightAgent format
        const mappedAgents: SpotlightAgent[] = apiAgents
          .filter((a: any) => a.admin_approved === "yes")
          .map((a: any) => {
            // Parse demo_preview to get first image URL
            const demoPreviewUrls = a.demo_preview 
              ? a.demo_preview
                  .split(",")
                  .map((item: string) => item.trim())
                  .filter((item: string) => {
                    return item && (item.startsWith("http://") || item.startsWith("https://"));
                  })
              : [];
            const firstPreviewImage = demoPreviewUrls.length > 0 ? demoPreviewUrls[0] : undefined;

            // Determine category based on by_value or asset_type
            let category = "Consumer Experience";
            if (a.by_value) {
              if (a.by_value.toLowerCase().includes("data") || a.by_value.toLowerCase().includes("accelerator")) {
                category = "Data Accelerator";
              } else if (a.by_value.toLowerCase().includes("productivity") || a.by_value.toLowerCase().includes("enterprise")) {
                category = "Enterprise Productivity";
              }
            } else if (a.asset_type) {
              if (a.asset_type.toLowerCase().includes("data")) {
                category = "Data Accelerator";
              } else if (a.asset_type.toLowerCase().includes("productivity")) {
                category = "Enterprise Productivity";
              }
            }

            return {
              id: a.agent_id,
              title: a.agent_name,
              description: a.description || "",
              tags: a.tags
                ? a.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
                : [],
              category,
              demoPreview: firstPreviewImage,
            };
          });

        setAgents(mappedAgents);
      } catch (err) {
        console.error("Error fetching agents:", err);
        // Fallback to empty array or default agents
        setAgents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((prev) => {
      if (prev === 0) {
        // Wrap to the end
        const maxIndex = Math.max(0, agents.length - 2);
        return maxIndex;
      }
      return Math.max(0, prev - 2);
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, agents.length - 2);
      if (prev >= maxIndex) {
        // Wrap to the beginning
        return 0;
      }
      return Math.min(maxIndex, prev + 2);
    });
  };

  // Get current agents to display (2 at a time)
  const currentAgents = agents.slice(currentIndex, currentIndex + 2);
  const hasAgents = agents.length > 0;
  // Allow navigation if there are more than 2 agents (wraps around)
  const canNavigate = hasAgents && agents.length > 2;

  // Helper function to get category styling
  const getCategoryStyle = (category: string) => {
    if (category === "Data Accelerator") {
      return {
        border: "1px solid #F9DBAF",
        background: "#FEF3C7",
        color: "#B93815",
      };
    } else if (category === "Enterprise Productivity") {
      return {
        border: "1px solid #B2DDFF",
        background: "#E0F2FE",
        color: "#1077D7",
      };
    }
    return {
      border: "1px solid #B2DDFF",
      background: "#E0F2FE",
      color: "#1077D7",
    };
  };

  if (loading) {
    return (
      <section
        className="w-full py-20 px-8 md:px-16 lg:px-20"
        style={{
          width: "auto",
          height: "937px",
          opacity: 1,
          left: "2px",
          position: "relative",
          background: "linear-gradient(180deg, #FFFFFF 0%, #C3DCF0 76.44%, #FAFAFA 100%)",
          maxWidth: "100%",
        }}
        aria-label="Our Agents Spotlight"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-full">
            <p style={{ fontFamily: "Poppins, sans-serif", color: "#091917" }}>Loading agents...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="w-full py-20 px-8 md:px-16 lg:px-20"
      style={{
        width: "auto",
        height: "937px",
        opacity: 1,
        left: "2px",
        position: "relative",
        background: "linear-gradient(180deg, #FFFFFF 0%, #C3DCF0 76.44%, #FAFAFA 100%)",
        maxWidth: "100%",
      }}
      aria-label="Our Agents Spotlight"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12">
          <div className="flex-1 mb-6 md:mb-0">
            <h2
              className="mb-4"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "42px",
                lineHeight: "54px",
                letterSpacing: "0%",
                textAlign: "left",
                color: "#091917",
              }}
            >
              Our Agents Spotlight
            </h2>
            <p
              className="max-w-2xl"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0px",
                textAlign: "left",
                verticalAlign: "middle",
                color: "#091917",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Check out the latest AI agent templates designed for real-world enterprise use cases.
            </p>
          </div>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={!canNavigate}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous agents"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 15 L7 10 L12 5" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={!canNavigate}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next agents"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 5 L13 10 L8 15" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Agent Cards Grid */}
        {hasAgents ? (
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Agent Card 1 - Large Card */}
            {currentAgents[0] && (
              <div 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full md:w-[70%] card-hover" 
                style={{ 
                  paddingTop: "25px",
                  paddingLeft:"10px",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.01)"
                  e.currentTarget.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)"
                  e.currentTarget.style.borderColor = "#D1D5DB"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)"
                  e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                  e.currentTarget.style.borderColor = "#E5E7EB"
                }}
                onClick={() => window.location.href = `/agents/${currentAgents[0].id}`}
              >
                {/* Category Tag */}
                <div className="mb-4" style={{ paddingLeft: "20px" }}>
                  <span
                    className="inline-block fade-in"
                    style={{
                      opacity: 1,
                      borderRadius: "16324px",
                      paddingTop: "2.04px",
                      paddingRight: "8.71px",
                      paddingBottom: "2.04px",
                      paddingLeft: "8.71px",
                      ...getCategoryStyle(currentAgents[0].category),
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "15.93px",
                      letterSpacing: "-0.33px",
                      verticalAlign: "middle",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      animation: "fadeIn 0.6s ease-out 0.2s both",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)"
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    {currentAgents[0].category}
                  </span>
                </div>

                {/* Content Grid - Text on left, Visualization on right */}
                <div 
                  className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-6"
                  style={{
                    width: "calc(100% - 8.5px)",
                    height: "416.1804504394531px",
                    opacity: 1,
                    borderRadius: "12.26px",
                    paddingLeft: "28px",
                    marginBottom: "-8.5px",
                  }}
                >
                  {/* Left Column - Text Content */}
                  <div className="flex flex-col">
                    {/* Agent Name */}
                    <h3
                      className="mb-3 fade-in-up"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontSize: "24px",
                        lineHeight: "31.86px",
                        letterSpacing: "-0.49px",
                        verticalAlign: "middle",
                        color: "#181818",
                        animation: "fadeInUp 0.6s ease-out 0.3s both",
                      }}
                    >
                      {currentAgents[0].title}
                    </h3>

                    {/* Description */}
                    <p
                      className="mb-4 fade-in-up"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontSize: "14px",
                        lineHeight: "21.45px",
                        letterSpacing: "-0.33px",
                        verticalAlign: "middle",
                        color: "#65717C",
                        animation: "fadeInUp 0.6s ease-out 0.4s both",
                      }}
                    >
                      {currentAgents[0].description}
                    </p>

                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-2">
                      {currentAgents[0].tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-block"
                          style={{
                            opacity: 1,
                            borderRadius: "16324px",
                            paddingTop: "2.04px",
                            paddingRight: "8.71px",
                            paddingBottom: "2.04px",
                            paddingLeft: "8.71px",
                            border: "1px solid #D9E0E3",
                            background: "#FFFFFF4D",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontSize: "12.3px",
                            lineHeight: "15.93px",
                            letterSpacing: "-0.33px",
                            verticalAlign: "middle",
                            color: "#65717C",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                            animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"
                            e.currentTarget.style.background = "#FFFFFF80"
                            e.currentTarget.style.borderColor = "#9CA3AF"
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0) scale(1)"
                            e.currentTarget.style.background = "#FFFFFF4D"
                            e.currentTarget.style.borderColor = "#D9E0E3"
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {currentAgents[0].tags.length > 3 && (
                        <span
                          className="inline-block"
                          style={{
                            opacity: 1,
                            borderRadius: "16324px",
                            paddingTop: "2.04px",
                            paddingRight: "8.71px",
                            paddingBottom: "2.04px",
                            paddingLeft: "8.71px",
                            border: "1px solid #D9E0E3",
                            background: "#FFFFFF4D",
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontSize: "12.3px",
                            lineHeight: "15.93px",
                            letterSpacing: "-0.33px",
                            verticalAlign: "middle",
                            color: "#65717C",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          +{currentAgents[0].tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Visual Representation */}
                  <div
                    className="relative rounded-xl overflow-hidden border border-blue-100"
                    style={{
                      width: "357.44000244140625px",
                      height: "399.6400146484375px",
                      opacity: 1,
                      background: "#C0DAEF",
                      backgroundSize: "20px 20px",
                      paddingTop: "8.5px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {/* Agent preview image or default */}
                    {currentAgents[0].demoPreview ? (
                      <Image
                        src={currentAgents[0].demoPreview}
                        alt={currentAgents[0].title}
                        width={322}
                        height={321}
                        className="absolute image-hover"
                        style={{
                          width: "calc(100% + 50px - 35px)",
                          height: "321px",
                          opacity: 1,
                          top: "78.32px",
                          left: "35px",
                          bottom: "0",
                          objectFit: "cover",
                          borderTopLeftRadius: "40px",
                          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)"
                          e.currentTarget.style.filter = "brightness(1.1)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)"
                          e.currentTarget.style.filter = "brightness(1)"
                        }}
                      />
                    ) : (
                      <Image
                        src="/agent_spotlight.png"
                        alt="Agent visualization"
                        width={322}
                        height={321}
                        className="absolute image-hover"
                        style={{
                          width: "calc(100% + 50px - 35px)",
                          height: "321px",
                          opacity: 1,
                          top: "78.32px",
                          left: "35px",
                          bottom: "0",
                          objectFit: "cover",
                          borderTopLeftRadius: "40px",
                          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)"
                          e.currentTarget.style.filter = "brightness(1.1)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)"
                          e.currentTarget.style.filter = "brightness(1)"
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Agent Card 2 - Small Card */}
            {currentAgents[1] && (
              <div 
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 w-full md:w-[40%] card-hover"
                style={{
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.01)"
                  e.currentTarget.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)"
                  e.currentTarget.style.borderColor = "#D1D5DB"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)"
                  e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)"
                  e.currentTarget.style.borderColor = "#E5E7EB"
                }}
                onClick={() => window.location.href = `/agents/${currentAgents[1].id}`}
              >
                {/* Category Tag */}
                <div className="mb-4">
                  <span
                    className="inline-block fade-in"
                    style={{
                      opacity: 1,
                      borderRadius: "16324px",
                      paddingTop: "2.04px",
                      paddingRight: "8.71px",
                      paddingBottom: "2.04px",
                      paddingLeft: "8.71px",
                      ...getCategoryStyle(currentAgents[1].category),
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "15.93px",
                      letterSpacing: "-0.33px",
                      verticalAlign: "middle",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                      animation: "fadeIn 0.6s ease-out 0.2s both",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)"
                      e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)"
                      e.currentTarget.style.boxShadow = "none"
                    }}
                  >
                    {currentAgents[1].category}
                  </span>
                </div>

                {/* Agent Name */}
                <h3
                  className="mb-3 fade-in-up"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "24px",
                    lineHeight: "31.86px",
                    letterSpacing: "-0.49px",
                    verticalAlign: "middle",
                    color: "#181818",
                    animation: "fadeInUp 0.6s ease-out 0.3s both",
                  }}
                >
                  {currentAgents[1].title}
                </h3>

                {/* Description */}
                <p
                  className="mb-4 fade-in-up"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: "14px",
                    lineHeight: "21.45px",
                    letterSpacing: "-0.33px",
                    verticalAlign: "middle",
                    color: "#65717C",
                    animation: "fadeInUp 0.6s ease-out 0.4s both",
                  }}
                >
                  {currentAgents[1].description}
                </p>

                {/* Category Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentAgents[1].tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-block"
                      style={{
                        opacity: 1,
                        borderRadius: "16324px",
                        paddingTop: "2.04px",
                        paddingRight: "8.71px",
                        paddingBottom: "2.04px",
                        paddingLeft: "8.71px",
                        border: "1px solid #D9E0E3",
                        background: "#FFFFFF4D",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontSize: "12.3px",
                        lineHeight: "15.93px",
                        letterSpacing: "-0.33px",
                        verticalAlign: "middle",
                        color: "#65717C",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px) scale(1.05)"
                        e.currentTarget.style.background = "#FFFFFF80"
                        e.currentTarget.style.borderColor = "#9CA3AF"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)"
                        e.currentTarget.style.background = "#FFFFFF4D"
                        e.currentTarget.style.borderColor = "#D9E0E3"
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  {currentAgents[1].tags.length > 3 && (
                    <span
                      className="inline-block"
                      style={{
                        opacity: 1,
                        borderRadius: "16324px",
                        paddingTop: "2.04px",
                        paddingRight: "8.71px",
                        paddingBottom: "2.04px",
                        paddingLeft: "8.71px",
                        border: "1px solid #D9E0E3",
                        background: "#FFFFFF4D",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontSize: "12.3px",
                        lineHeight: "15.93px",
                        letterSpacing: "-0.33px",
                        verticalAlign: "middle",
                        color: "#65717C",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      +{currentAgents[1].tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p style={{ fontFamily: "Poppins, sans-serif", color: "#091917" }}>No agents available</p>
          </div>
        )}

        {/* CTA Section */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            width: "1053.93701171875px",
            height: "96.53140258789062px",
            opacity: 1,
            position: "relative",
            borderRadius: "12.26px",
            paddingTop: "24.51px",
            paddingRight: "24.5px",
            paddingBottom: "24.51px",
            paddingLeft: "24.5px",
            background: "#FFFFFF66",
            maxWidth: "100%",
            margin: "0 auto",
          }}
        >
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "31.86px",
              letterSpacing: "-0.49px",
              verticalAlign: "middle",
              color: "#181818",
            }}
          >
            Explore all 100+ agents and solutions
          </p>
          <button
            className="uppercase transition-all duration-200 hover:opacity-90"
            style={{
              width: "230.68060302734375px",
              height: "47.510398864746094px",
              maxWidth: "1053.95px",
              opacity: 1,
              borderRadius: "4.09px",
              paddingTop: "12.26px",
              paddingRight: "16.34px",
              paddingBottom: "12.26px",
              paddingLeft: "16.34px",
              gap: "4.08px",
              backgroundColor: "#181818",
              border: "1px solid #181818",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "21px",
              letterSpacing: "0%",
              verticalAlign: "middle",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            GO TO AGENT MARKETPLACE
          </button>
        </div>
      </div>
    </section>
  )
}

// Agentic Opportunities Component
interface AgentContent {
  label: string
  title: string
  opportunity: string
  solution: string[]
  businessImpact: string
  marketValidation: string
}

interface FilterData {
  [key: string]: AgentContent
}

interface PillData {
  [key: string]: AgentContent
}

const ALL_PILLS = [
  "Retailer App + Agentic Personalization Layer",
  "E-Commerce PDP Agent",
  "IoT-Enabled Smart Tap + Experience Agent",
  "Heineken Digital Universe App (D2C)",
]

function AgenticOpportunities({ initialFilter = "CONSUMER EXPERIENCE" }: { initialFilter?: string }) {
  const [activeFilter, setActiveFilter] = useState(initialFilter)
  const [selectedPills, setSelectedPills] = useState<string[]>([])
  const [activePill, setActivePill] = useState<string>("")

  // Agent content data for each filter
  const agentData: FilterData = {
    "CONSUMER EXPERIENCE": {
      label: "AGENT 1",
      title: "Retailer App + Agentic Personalization Layer",
      opportunity: "Retailers rely on distributors. Heineken has no direct visibility into retailer-level demand, assortment, or motivation. No personalization.",
      solution: [
        "Personalized SKU recommendations",
        "Auto-generated order quantities based on neighborhood trends",
        "Offers personalized to each store",
        "Automated notifications, creatives, and micro-campaigns",
      ],
      businessImpact: "Increase total throughput, improves visibility of on-premise, strengthen retailer loyalty, enables precise push of Heineken O",
      marketValidation: "Works with existing distributor margin structures. Used successfully by Coke Buddy, Unilever, P&G",
    },
    "ENTERPRISE PRODUCTIVITY": {
      label: "AGENT 2",
      title: "Enterprise Productivity Agent",
      opportunity: "Internal teams spend significant time on repetitive tasks and data management, reducing focus on strategic initiatives.",
      solution: [
        "Automated report generation and distribution",
        "Intelligent document processing and summarization",
        "Workflow automation for common processes",
        "AI-powered meeting notes and action items",
      ],
      businessImpact: "Reduce operational overhead, free up team capacity for strategic work, improve decision-making speed",
      marketValidation: "Proven ROI in similar FMCG organizations. Adopted by leading enterprises in beverage industry",
    },
    "DATA ACCELERATOR": {
      label: "AGENT 3",
      title: "Data Accelerator Agent",
      opportunity: "Data silos and manual data processing limit real-time insights and decision-making capabilities across the organization.",
      solution: [
        "Automated data pipeline orchestration",
        "Real-time data quality monitoring and alerts",
        "Intelligent data transformation and enrichment",
        "Self-service analytics and reporting",
      ],
      businessImpact: "Accelerate time-to-insight, improve data quality, enable data-driven decision making at scale",
      marketValidation: "Industry-standard approach used by data-forward organizations. Validated in production environments",
    },
  }

  // Pill-specific content data based on reference screenshot
  const pillData: PillData = {
    "Retailer App + Agentic Personalization Layer": {
      label: "AGENT 2",
      title: "Retailer App + Agentic Personalisation Layer",
      opportunity: "Retailers rely on distributors. Heineken has no direct visibility into retailer-level demand, assortment, or motivation. No personalization.",
      solution: [
        "Personalized SKU recommendations",
        "Auto-generated order quantities based on neighborhood trends",
        "Offers personalized to each store",
        "Automated notifications, creatives, and micro-campaigns",
      ],
      businessImpact: "Increases retail throughput, improves visibility of demand, strengthens retailer loyalty, enables precise push of Heineken O",
      marketValidation: "Works without disrupting distributor margin structure. Used successfully by Coke Buddy, Unilever, P&G",
    },
    "E-Commerce PDP Agent": {
      label: "AGENT 1",
      title: "E-Commerce PDP Agent",
      opportunity: "E-commerce platforms lack personalized product discovery and recommendation capabilities for beverage consumers.",
      solution: [
        "AI-powered product recommendations",
        "Personalized search and discovery",
        "Dynamic pricing optimization",
        "Cross-sell and upsell automation",
      ],
      businessImpact: "Increases conversion rates, improves customer engagement, drives higher average order value",
      marketValidation: "Proven in e-commerce platforms. Used by leading retail brands",
    },
    "IoT-Enabled Smart Tap + Experience Agent": {
      label: "AGENT 3",
      title: "IoT-Enabled Smart Tap + Experience Agent",
      opportunity: "Smart tap systems generate data but lack intelligent insights and personalized experiences for consumers.",
      solution: [
        "Real-time consumption analytics",
        "Personalized pour recommendations",
        "Smart inventory management",
        "Consumer engagement through mobile app",
      ],
      businessImpact: "Optimizes inventory, enhances consumer experience, provides data-driven insights for venue operators",
      marketValidation: "IoT solutions validated in hospitality industry. Growing adoption in smart venues",
    },
    "Heineken Digital Universe App (D2C)": {
      label: "AGENT 4",
      title: "Heineken Digital Universe App (D2C)",
      opportunity: "Direct-to-consumer channels need intelligent agents to provide personalized experiences and drive engagement.",
      solution: [
        "Personalized content recommendations",
        "AI-powered customer support",
        "Loyalty program optimization",
        "Predictive ordering and delivery",
      ],
      businessImpact: "Increases customer lifetime value, improves retention, enables direct consumer relationships",
      marketValidation: "D2C models proven successful. Used by beverage brands globally",
    },
  }

  const filters = ["CONSUMER EXPERIENCE", "ENTERPRISE PRODUCTIVITY", "DATA ACCELERATOR"]
  
  // Get unselected pills
  const unselectedPills = useMemo(() => {
    return ALL_PILLS.filter(pill => !selectedPills.includes(pill))
  }, [selectedPills])
  
  // Use pill data if a pill is selected, otherwise use filter data
  const currentContent = pillData[activePill] || agentData[activeFilter] || agentData["CONSUMER EXPERIENCE"]

  const handlePillClick = (pill: string) => {
    // If pill is not already selected, add it to selected pills
    if (!selectedPills.includes(pill)) {
      setSelectedPills([...selectedPills, pill])
    }
    // Set as active pill (for content display)
    setActivePill(pill)
  }

  return (
    <section
      className="w-full py-16 px-8 md:px-20 lg:px-20 bg-[#fbfbfc]"
      aria-labelledby="agentic-opportunities-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2
            id="agentic-opportunities-heading"
            className="mx-auto"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "28px",
              lineHeight: "100%",
              letterSpacing: "0px",
              textAlign: "center",
              verticalAlign: "middle",
              background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              width: "313px",
              height: "42px",
              marginBottom: "-4px",
            }}
          >
            Agentic Opportunities
          </h2>
          <p
            className="mb-8 mx-auto"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "24px",
              letterSpacing: "0%",
              textAlign: "center",
              color: "#111827",
              width: "790px",
              height: "48px",
              maxWidth: "100%",
            }}
          >
            To unlock growth, we've organized the opportunity landscape into three clear, CEO-aligned buckets...
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-12" role="tablist" aria-label="Filter opportunities">
            {filters.map((filter) => (
              <button
                key={filter}
                role="tab"
                aria-selected={activeFilter === filter}
                aria-controls={`agent-content-${filter.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-[#181818] text-white shadow-md"
                    : "bg-white text-[#6b6b7a] border border-[#D9E0E3] hover:border-[#181818]"
                }`}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: activeFilter === filter ? 500 : 400,
                  fontStyle: "normal",
                  fontSize: activeFilter === filter ? "16px" : "14px",
                  lineHeight: activeFilter === filter ? "100%" : "normal",
                  letterSpacing: activeFilter === filter ? "0px" : "normal",
                  verticalAlign: activeFilter === filter ? "middle" : "normal",
                  textTransform: activeFilter === filter ? "uppercase" : "none",
                  color: activeFilter === filter ? "#FFFFFF" : "#6b6b7a",
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-8 lg:gap-6">
          {/* Left: Selected Pills (all selected pills in horizontal row) */}
          {selectedPills.length > 0 && (
            <div className="hidden lg:flex flex-row items-center justify-center gap-3 lg:gap-4">
              {selectedPills.map((pill) => (
                <div
                  key={pill}
                  onClick={() => handlePillClick(pill)}
                  className="border border-[#e6e6ea] p-0 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer flex items-center justify-center"
                  style={{
                    width: "60px",
                    height: "505px",
                    borderRadius: "16px",
                    opacity: 1,
                    background: activePill === pill 
                      ? "linear-gradient(213.47deg, #FFBAFD 31.16%, #FFFFFF 79.17%)"
                      : "linear-gradient(213.47deg, #FFAD87 31.16%, #FFFFFF 79.17%)",
                    fontFamily: "Poppins, sans-serif",
                  }}
                  aria-label={pill}
                >
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "24px",
                      lineHeight: "120%",
                      letterSpacing: "-0.49px",
                      verticalAlign: "middle",
                      color: "#181818",
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                      transform: "rotate(180deg)",
                      display: "inline-block",
                      height: "481px",
                    }}
                  >
                    {pill}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Center: Main Content Card */}
          <div
            id={`agent-content-${activeFilter.toLowerCase().replace(/\s+/g, "-")}`}
            role="tabpanel"
            className="rounded-2xl border border-[#e6e6ea] p-7 md:p-9 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden"
            style={{
              fontFamily: "Poppins, sans-serif",
              background: "linear-gradient(239.28deg, #FED1E6 2.61%, #FFFFFF 47.78%)",
            }}
          >
            <div className="relative z-10">
              {/* Agent Label */}
              <span
                className="inline-block mb-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "12px",
                  lineHeight: "140%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: "#F05283",
                  width: "78.99999959707212px",
                  height: "31.999999836788707px",
                  transform: "rotate(-0.28deg)",
                  opacity: 1,
                  borderRadius: "4px",
                  paddingTop: "4px",
                  paddingRight: "16px",
                  paddingBottom: "4px",
                  paddingLeft: "16px",
                  gap: "8px",
                  background: "#FFEBF1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentContent.label}
              </span>

              {/* Card Title */}
              <h3
                className="mb-6"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "24px",
                  lineHeight: "31.86px",
                  letterSpacing: "-0.49px",
                  verticalAlign: "middle",
                  color: "#181818",
                  width: "511px",
                  height: "32px",
                  maxWidth: "100%",
                }}
              >
                {currentContent.title}
              </h3>

              {/* OPPORTUNITY, SOLUTION, and BUSINESS IMPACT Sections - Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-[#e6e6ea]">
                {/* Left Column: OPPORTUNITY and BUSINESS IMPACT */}
                <div className="flex flex-col gap-6">
                  {/* OPPORTUNITY Section */}
                  <div>
                    <div className="flex items-center gap-0 mb-2">
                      <div
                        className="flex items-center justify-center rounded"
                        style={{
                          width: "24px",
                          height: "24px",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="6" stroke="#F05283" strokeWidth="1.5" fill="none"/>
                          <circle cx="7" cy="7" r="3" fill="#F05283"/>
                        </svg>
                      </div>
                      <p
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "21px",
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#111827",
                          textTransform: "uppercase",
                          margin: 0,
                        }}
                      >
                        OPPORTUNITY
                      </p>
                    </div>
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "21.45px",
                        letterSpacing: "-0.33px",
                        verticalAlign: "middle",
                        color: "#65717C",
                        marginLeft: "8px",
                      }}
                    >
                      {currentContent.opportunity}
                    </p>
                  </div>

                  {/* BUSINESS IMPACT Section */}
                  <div>
                    <div className="flex items-center gap-0 mb-2">
                      <div
                        className="flex items-center justify-center rounded"
                        style={{
                          width: "24px",
                          height: "24px",
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2 10 L4 6 L7 8 L10 4 L12 6" stroke="#10B981" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 4 L12 4 L12 6" stroke="#10B981" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <p
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "21px",
                          letterSpacing: "0%",
                          verticalAlign: "middle",
                          color: "#111827",
                          textTransform: "uppercase",
                          margin: 0,
                        }}
                      >
                        BUSINESS IMPACT
                      </p>
                    </div>
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "21.45px",
                        letterSpacing: "-0.33px",
                        verticalAlign: "middle",
                        color: "#65717C",
                        marginLeft: "8px",
                      }}
                    >
                      {currentContent.businessImpact}
                    </p>
                  </div>
                </div>

                {/* Right Column: SOLUTION Section */}
                <div>
                  <div className="flex items-center gap-0 mb-3">
                    <div
                      className="flex items-center justify-center rounded"
                      style={{
                        width: "24px",
                        height: "24px",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 2 L9 6 L13 7 L9 8 L7 12 L5 8 L1 7 L5 6 Z" fill="#3B82F6"/>
                      </svg>
                    </div>
                    <p
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "21px",
                        letterSpacing: "0%",
                        verticalAlign: "middle",
                        color: "#111827",
                        textTransform: "uppercase",
                        margin: 0,
                      }}
                    >
                      SOLUTION
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {currentContent.solution.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "14px",
                          lineHeight: "21.45px",
                          letterSpacing: "-0.33px",
                          verticalAlign: "middle",
                          color: "#65717C",
                          marginLeft: "8px",
                        }}
                      >
                        <span className="mr-2 text-[#6b2bb2]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* MARKET VALIDATION Section */}
              <div>
                <div className="flex items-center gap-0 mb-2">
                  <div
                    className="flex items-center justify-center rounded"
                    style={{
                      width: "24px",
                      height: "24px",
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 2 L8 5 L11 6 L8 7 L7 10 L6 7 L3 6 L6 5 Z" fill="#F59E0B"/>
                      <circle cx="7" cy="7" r="1.5" fill="#F59E0B"/>
                    </svg>
                  </div>
                  <p
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#111827",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    MARKET VALIDATION
                  </p>
                </div>
                <p
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "14px",
                    lineHeight: "21.45px",
                    letterSpacing: "-0.33px",
                    verticalAlign: "middle",
                    color: "#65717C",
                    marginLeft: "8px",
                  }}
                >
                  {currentContent.marketValidation}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Unselected Pills */}
          <div className="flex flex-row items-center justify-end gap-3 lg:gap-4 lg:ml-auto">
            {unselectedPills.map((pill, idx) => {
              return (
                <div
                  key={pill}
                  onClick={() => handlePillClick(pill)}
                  className="border border-[#e6e6ea] p-0 transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer flex items-center justify-center"
                  style={{
                    width: "60px",
                    height: "505px",
                    borderRadius: "16px",
                    opacity: 1,
                    background: "linear-gradient(213.47deg, #FFAD87 31.16%, #FFFFFF 79.17%)",
                    fontFamily: "Poppins, sans-serif",
                  }}
                  aria-label={pill}
                >
                  <span
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "24px",
                      lineHeight: "120%",
                      letterSpacing: "-0.49px",
                      verticalAlign: "middle",
                      color: "#181818",
                      writingMode: "vertical-rl",
                      textOrientation: "mixed",
                      transform: "rotate(180deg)",
                      display: "inline-block",
                      height: "481px",
                    }}
                  >
                    {pill}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}


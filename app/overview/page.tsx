"use client"

import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import {
  ArrowRight,
  Target,
  Users,
  Zap,
  Globe,
  Building2,
  Handshake,
  Package,
  Shield,
  Code2,
  Network,
  Hammer,
  Play,
  TrendingUp,
  AlertCircle,
  Search,
  CheckCircle,
  TrendingDown,
  Sparkles,
  Rocket,
  BarChart3,
} from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import Link from "next/link"

export default function OverviewPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <main className="min-h-screen">
      <HeroSection />
      <MarketNeedSection />
      <PropositionSection />
      <UserJourneysAndImpactSection />
      <OutcomesSection />
      <StrategySection />
      <CTASection />
    </main>
  )
}

// Hero Section
function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-6 py-12 overflow-hidden bg-white">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-40 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background: "radial-gradient(80.73% 80.73% at 80% 20%, #7935F4 0%, #9A4681 49.5%, #614BDB 96.87%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div
        className={`max-w-4xl mx-auto text-center transition-all duration-1000 relative z-10 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-balance leading-[1.1]">
            <span className="gradient-text">Discover the AI Agents Store</span>
          </h1>
          <p className="text-base md:text-lg text-foreground/70 max-w-2xl mx-auto text-balance leading-relaxed">
            A growing white-labelled catalogue of <b> 100+ </b> GenAI agents that helps enterprises explore, demo and deploy trusted AI built for speed, safety, and scale.
          </p>
          <div className="pt-2">
            <Button
              size="default"
              className="text-sm px-6 py-5 rounded-full bg-gradient-to-r from-[#7935F4] to-[#614BDB] text-white hover:opacity-90 transition-all hover:scale-105 hover:shadow-2xl animate-pulse-subtle"
              asChild
            >
              <Link href="/">
                Visit the Store
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

// Market Need Section
function MarketNeedSection() {
  const painPoints = [
    {
      stakeholder: "Enterprises",
      icon: Building2,
      challenge: "Want GenAI but face confusion and risk",
      painPoints: "Unverified tools, unclear ROI, compliance gaps",
      color: "#7935F4",
    },
    {
      stakeholder: "ISVs",
      icon: Code2,
      challenge: "Build innovative AI but lack reach",
      painPoints: "Hard to standardize, validate, and scale distribution",
      color: "#9A4681",
    },
    {
      stakeholder: "Resellers/Partners",
      icon: Handshake,
      challenge: "Have networks but lack demo-ready AI",
      painPoints: "No ready-to-sell repository, limited ISV visibility",
      color: "#614BDB",
    },
  ]

  const ecosystemStats = [
    { icon: AlertCircle, label: "Fragmented Discovery", color: "#7935F4" },
    { icon: Search, label: "No Unified Channel", color: "#9A4681" },
    { icon: TrendingDown, label: "Slow Adoption", color: "#614BDB" },
  ]

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-balance">
            <span className="gradient-text">Gen AI is the next platform shift</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
          Thousands of AI agents emerging globally, but no trusted channel for discovery, trial, and safe deployment.
          </p>
        </div>

        <div className="flex justify-center gap-6 mb-10 animate-on-scroll">
          {ecosystemStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="flex flex-col items-center gap-2 group cursor-default">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg animate-pulse-subtle"
                  style={{
                    background: stat.color,
                    animationDelay: `${index * 200}ms`,
                  }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-xs font-medium text-center max-w-[100px]">{stat.label}</p>
              </div>
            )
          })}
        </div>

        <div className="mb-10 animate-on-scroll">
          
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {painPoints.map((item, index) => {
            const Icon = item.icon
            return (
              <Card
                key={index}
                className="p-5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-on-scroll border-2 group cursor-default"
                style={{
                  animationDelay: `${index * 150}ms`,
                  borderColor: item.color,
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110"
                      style={{ background: item.color }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-semibold text-balance">{item.stakeholder}</h3>
                  </div>
                  <p className="text-sm text-foreground/70 leading-relaxed">{item.challenge}</p>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.painPoints}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-10 text-center animate-on-scroll">
          <p className="text-sm md:text-base font-medium max-w-3xl mx-auto text-balance">
            The <span className="gradient-text font-semibold">AI Agents Store</span> unifies the ecosystem — one digital
            catalogue for AI agents
          </p>
        </div>
      </div>
    </section>
  )
}

// Proposition Section
function PropositionSection() {
  const goals = [
    {
      icon: Target,
      text: "Enable enterprises to explore verified agents aligned with their needs.",
      color: "#7935F4",
    },
    {
      icon: Users,
      text: "Help ISVs onboard their agents easily and reach enterprise buyers.",
      color: "#9A4681",
    },
    {
      icon: Zap,
      text: "Equip partners with ready-to-demo AI offerings to enhance client conversations.",
      color: "#614BDB",
    },
    {
      icon: Globe,
      text: "Empower distributors to orchestrate adoption across regions.",
      color: "#7935F4",
    },
  ]

  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#614BDB]/10 rounded-full blur-3xl animate-float" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-balance">
            <span className="gradient-text">The Agent Store unlocks this future</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            It's a single, trusted platform where enterprises can discover, demo, and deploy AI agents - quickly, safely, and at scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {goals.map((goal, index) => {
            const Icon = goal.icon
            return (
              <Card
                key={index}
                className="p-5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-on-scroll group cursor-default"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                    style={{ background: goal.color }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm leading-relaxed pt-1">{goal.text}</p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// User Journeys & Impact Section
function UserJourneysAndImpactSection() {
  const [activeTab, setActiveTab] = useState("enterprise")

  const enterpriseFlow = [
    { step: "Landing Page", icon: Globe, desc: "Sign In / Sign Up" },
    { step: "AI Chat Discovery", icon: Sparkles, desc: "Describe business needs via chat assistant" },
    { step: "View Agent Details", icon: Search, desc: "Overview, features, ROI, docs" },
    { step: "Request Demo", icon: Target, desc: "Contact ISV or schedule demo" },
    { step: "Build Custom", icon: Hammer, desc: "Redirect to Catalyst Labs for custom builds" },
  ]

  const partnerFlow = [
    { step: "Register", icon: Users, desc: "Register & get admin approval" },
    { step: "Domain Whitelisting", icon: Shield, desc: "Access control setup" },
    { step: "Access Catalogue", icon: Package, desc: "View whitelisted agent catalogue" },
    { step: "Share Demos", icon: Network, desc: "Preview & share demo links with clients" },
    { step: "Track Engagement", icon: BarChart3, desc: "Monitor demo analytics" },
  ]

  const isvFlow = [
    { step: "Register & Upload", icon: Building2, desc: "Submit business details, MOU & branding assets" },
    { step: "Onboarding Approval", icon: CheckCircle, desc: "Submit for admin approval" },
    { step: "Add Agent Info", icon: Sparkles, desc: "Overview, features, ROI, deployment options" },
    { step: "Admin Review", icon: Shield, desc: "Submit for final approval" },
    { step: "Go Live", icon: Rocket, desc: "Agent listed publicly" },
  ]

  const adminFlow = [
    { step: "Dashboard", icon: BarChart3, desc: "Login to admin dashboard" },
    { step: "Review Requests", icon: Search, desc: "Review new ISV/Partner requests" },
    { step: "Approve/Reject", icon: CheckCircle, desc: "Approve or reject onboarding" },
    { step: "Validate Agents", icon: Shield, desc: "Validate agent submissions" },
    { step: "Monitor Analytics", icon: TrendingUp, desc: "Track traffic, leads, and performance" },
  ]

  const enterpriseBenefits = [
    { icon: Search, text: "Discover agents by use case, industry, or function" },
    { icon: Zap, text: "Request demos instantly via guided chat" },
    { icon: CheckCircle, text: "Access verified solutions with clear ROI" },
  ]

  const partnerBenefits = [
    { icon: Package, text: "Access ready-to-demo AI agents" },
    { icon: Target, text: "Co-brand for industry-specific solutions" },
    { icon: TrendingUp, text: "Unlock new revenue streams" },
  ]

  const isvBenefits = [
    { icon: Sparkles, text: "Easy onboarding - AI auto-generates listings" },
    { icon: Network, text: "Gain enterprise visibility through distribution" },
    { icon: BarChart3, text: "Access performance analytics and demo leads" },
  ]

  const adminBenefits = [
    { icon: Globe, text: "Orchestrate AI adoption through one unified store" },
    { icon: Rocket, text: "Drive ecosystem growth via co-marketing" },
    { icon: TrendingUp, text: "Build long-term recurring AI distribution model" },
  ]

  const flows = [
    {
      id: "enterprise",
      label: "Enterprise",
      icon: Building2,
      flow: enterpriseFlow,
      benefits: enterpriseBenefits,
      color: "#7935F4",
      endState: "Enterprise gets matched with a suitable AI agent, schedules a demo, or initiates a build request.",
    },
    {
      id: "partner",
      label: "Reseller/Partner",
      icon: Handshake,
      flow: partnerFlow,
      benefits: partnerBenefits,
      color: "#9A4681",
      endState: "Reseller ready to use marketplace for GTM; generates leads and client demo conversions.",
    },
    {
      id: "isv",
      label: "ISV",
      icon: Package,
      flow: isvFlow,
      benefits: isvBenefits,
      color: "#614BDB",
      endState: "Agent gets approved and listed publicly, discoverable by resellers and clients.",
    },
    {
      id: "admin",
      label: "Admin (Distributor)",
      icon: Shield,
      flow: adminFlow,
      benefits: adminBenefits,
      color: "#7935F4",
      endState: "Ensures quality control, manages ecosystem integrity, and oversees engagement metrics.",
    },
  ]

  return (
    <section className="py-16 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-balance">
            <span className="gradient-text">Built for the entire ecosystem</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            Modular. Intelligent. Enterprise-ready. With the Agent Store, you don't need months of engineering - you can discover, demo, and deploy instantly.
          </p>
        </div>

        <Tabs defaultValue="enterprise" className="w-full animate-on-scroll" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {flows.map((flow) => {
              const Icon = flow.icon
              return (
                <TabsTrigger
                  key={flow.id}
                  value={flow.id}
                  className="flex items-center gap-2 transition-all duration-300 data-[state=active]:scale-105"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{flow.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {flows.map((flow) => (
            <TabsContent key={flow.id} value={flow.id} className="mt-0 space-y-6">
              {/* Journey Flow */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="gradient-text">Journey</span>
                </h3>
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {flow.flow.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={index}
                        className="relative animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Card className="p-4 hover:shadow-xl transition-all duration-300 h-full hover:-translate-y-1 group cursor-default">
                          <div className="space-y-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                              style={{ background: flow.color }}
                            >
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-center">
                              <h4 className="text-sm font-semibold mb-1 text-balance">{item.step}</h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                          </div>
                        </Card>
                        {index < flow.flow.length - 1 && (
                          <div className="hidden lg:block absolute top-1/2 -right-1.5 transform -translate-y-1/2 z-10">
                            <ArrowRight className="w-3 h-3 text-muted-foreground animate-pulse-subtle" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                <Card className="mt-4 p-4 bg-secondary/50 animate-fade-in" style={{ animationDelay: "500ms" }}>
                  <div className="flex items-start gap-3">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: flow.color }}
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        End State
                      </p>
                      <p className="text-sm leading-relaxed">{flow.endState}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Value & Impact */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="gradient-text">Value & Impact</span>
                </h3>
                <Card className="p-5 hover:shadow-xl transition-all duration-300 animate-fade-in">
                  <ul className="space-y-3">
                    {flow.benefits.map((benefit, idx) => {
                      const BenefitIcon = benefit.icon
                      return (
                        <li
                          key={idx}
                          className="flex items-start gap-3 group/item hover:translate-x-1 transition-transform duration-200"
                        >
                          <div
                            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover/item:scale-110"
                            style={{ background: flow.color }}
                          >
                            <BenefitIcon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm leading-relaxed pt-1">{benefit.text}</span>
                        </li>
                      )
                    })}
                  </ul>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}

// Outcomes Section with Animated Counters
function OutcomesSection() {
  const kpis = [
    {
      metric: "ISVs Onboarded",
      target: "10+",
      targetNumber: 10,
      subtitle: "verified ISVs",
      color: "#7935F4",
    },
    {
      metric: "Agents Published",
      target: "100+",
      targetNumber: 100,
      subtitle: "standardized agent listings",
      color: "#9A4681",
    },
    {
      metric: "Enterprise Leads",
      target: "1000+",
      targetNumber: 1000,
      subtitle: "qualified demo requests",
      color: "#614BDB",
    },
    {
      metric: "Reseller Conversions",
      target: ">15%",
      targetNumber: 15,
      subtitle: "demo-to-sale conversion rate",
      color: "#7935F4",
      isPercentage: true,
    },
    {
      metric: "Platform Engagement",
      target: "3+ min",
      targetNumber: 3,
      subtitle: "average session time",
      color: "#9A4681",
      suffix: " min",
    },
    {
      metric: "Brand Presence",
      target: "100%",
      targetNumber: 100,
      subtitle: "consistent visibility across assets",
      color: "#614BDB",
      isPercentage: true,
    },
  ]

  return (
    <section className="py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#7935F4]/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-[#9A4681]/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-balance">
            <span className="gradient-text">Expected Outcomes</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            Target metrics for Q3 - Q4 2025
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, index) => (
            <AnimatedKPICard key={index} kpi={kpi} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AnimatedKPICard({ kpi, index }: { kpi: any; index: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.3 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000
    const steps = 60
    const increment = kpi.targetNumber / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= kpi.targetNumber) {
        setCount(kpi.targetNumber)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [isVisible, kpi.targetNumber])

  const displayValue = kpi.isPercentage ? `${count}%` : kpi.suffix ? `${count}${kpi.suffix}` : `${count}+`

  return (
    <Card
      ref={cardRef}
      className="p-5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 animate-on-scroll relative overflow-hidden group cursor-default"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className="absolute top-0 right-0 w-20 h-20 opacity-10 transition-all duration-500 group-hover:scale-150"
        style={{
          background: `radial-gradient(circle at top right, ${kpi.color}, transparent)`,
        }}
      />
      <div className="space-y-2 relative">
        <div
          className="text-2xl font-bold inline-block transition-all duration-300 group-hover:scale-110"
          style={{ color: kpi.color }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>
        <h3 className="text-sm font-semibold text-balance">{kpi.metric}</h3>
        <p
          className="text-2xl font-bold transition-all duration-300 group-hover:scale-110"
          style={{ color: kpi.color }}
        >
          {isVisible ? displayValue : "0"}
        </p>
        <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>
      </div>
    </Card>
  )
}

// Strategy Section
function StrategySection() {
  const phases = [
    {
      phase: "Build",
      icon: Hammer,
      timeline: "Oct 2025",
      objective: "Design, develop, and operationalize the store MVP",
      color: "#7935F4",
    },
    {
      phase: "Operate",
      icon: Play,
      timeline: "Nov 2025 to Jan 2026",
      objective: "Test workflows, onboard ISVs, validate reseller engagement",
      color: "#9A4681",
    },
    {
      phase: "Scale",
      icon: TrendingUp,
      timeline: "Jan 2026 +",
      objective: "Continuous AI innovation, analytics, co-marketing, and growth",
      color: "#614BDB",
    },
  ]

  return (
    <section className="py-16 px-6 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-balance">
            <span className="gradient-text">The ecosystem is growing - Fast</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            The Build-Operate-Scale Framework
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {phases.map((item, index) => {
            const Icon = item.icon
            return (
              <Card
                key={index}
                className="p-5 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-on-scroll relative overflow-hidden group cursor-default"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-2"
                  style={{ background: item.color }}
                />
                <div className="space-y-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{ background: item.color }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">{item.phase}</h3>
                  <div className="space-y-2 pt-1">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Timeline</p>
                      <p className="text-sm font-medium">{item.timeline}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ownership</p>
                      <p className="text-sm font-medium">Distributor</p>
                    </div>
                    <div className="pt-1">
                      <p className="text-xs text-foreground/70 leading-relaxed">{item.objective}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="mt-10 animate-on-scroll">
          <Card className="p-6 bg-gradient-to-br from-secondary/50 to-background border-2 hover:shadow-2xl transition-all duration-500">
            <div className="space-y-5">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  <span className="gradient-text">Platform Partnership</span>
                </h3>
                <p className="text-sm text-muted-foreground">Redington-led platform powered by Crayon Data</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Technology Partner Role */}
                <Card
                  className="p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-default border-2"
                  style={{ borderColor: "#7935F4" }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                        style={{ background: "#7935F4" }}
                      >
                        <Code2 className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-sm font-semibold">Technology Partner</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-foreground/70">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#7935F4" }} />
                        <span>Builds & operates Tangram Store infrastructure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#7935F4" }} />
                        <span>Provides AI Catalyst services for agent deployments</span>
                      </li>
                    </ul>
                  </div>
                </Card>

                {/* ISV Role */}
                <Card
                  className="p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-default border-2"
                  style={{ borderColor: "#9A4681" }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                        style={{ background: "#9A4681" }}
                      >
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="text-sm font-semibold">ISV Partner</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-foreground/70">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#9A4681" }} />
                        <span>Lists tangram.ai agent suite in the marketplace</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: "#9A4681" }} />
                        <span>Showcased alongside other verified vendors</span>
                      </li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section
      id="cta"
      className="py-20 px-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #7935F4 0%, #9A4681 50%, #614BDB 100%)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent animate-gradient" />

      <div
        className={`max-w-3xl mx-auto text-center relative z-10 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-balance text-white">
          Ready to Transform AI Distribution?
        </h2>
        <p className="text-base md:text-lg mb-8 text-white/90 text-balance leading-relaxed">
          Join us in building the future of AI adoption. The AI Agents Store is your gateway to connecting enterprises,
          ISVs, and partners in one unified ecosystem.
        </p>
        <Button
          size="default"
          className="text-sm px-6 py-5 rounded-full bg-white text-foreground hover:bg-white/90 transition-all hover:scale-110 hover:shadow-2xl animate-pulse-subtle"
          asChild
        >
          <Link href="/">
            Visit the Store
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}

"use client"

import { useRef } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ChevronRight } from "lucide-react"

export default function BrandsPage() {
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({})

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        id="introduction"
        ref={(el) => (sectionsRef.current["introduction"] = el)}
        className="pt-12 pb-20 px-8 md:px-12 lg:px-16 animated-gradient-bg"
      >
        <div className="max-w-7xl mx-auto">
          {/* Logos Section */}
          <div className="flex items-center gap-4" style={{ marginBottom: "36px" }}>
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

          {/* Title Section - Left Aligned */}
          <div className="text-left">
            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-bold mb-2 leading-tight"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              <span
                style={{
                  background: "linear-gradient(to right, #1e40af 0%, #06b6d4 50%, #10b981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Heineken
              </span>
            </h1>
            <h2
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
              style={{ fontFamily: "Poppins, sans-serif", color: "#374151" }}
            >
              AI Growth Opportunities
            </h2>
            <p
              className="text-xl md:text-2xl text-gray-500 font-normal"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Strategic proposal for Heineken APAC
            </p>
          </div>
        </div>
      </section>

      {/* Mega Trends Section */}
      <section
        id="mega-trends"
        ref={(el) => (sectionsRef.current["mega-trends"] = el)}
        className="py-20 px-8 md:px-12 lg:px-16"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-semibold mb-4 text-center"
            style={{ fontFamily: "Poppins, sans-serif", color: "#091917" }}
          >
            Mega Trends
          </h2>
          <p
            className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Four converging forces reshaping the beverage industry landscape
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "The Consumer: 'Zebra Striping'",
                shift: "Consumers are no longer strictly 'drinkers' or 'non-drinkers.' They are switching between full-strength and 0.0% options within the same night.",
                paradox: "Total volume may be flat/down, but 'Value per Liter' is rising due to premiumisation.",
              },
              {
                title: "Technology: From Co-pilots to Agents",
                shift: "2024 was the era of humans chatting with AI (Co-pilots). 2025 is the era of Agentic AI - autonomous systems that talk to each other to execute tasks.",
                paradox: "Budget is moving from 'Knowledge Management' (finding files) to 'Action Management' (booking stock, reconciling invoices).",
              },
              {
                title: "The Channel: B2B2C Convergence",
                shift: "The 'Iron Curtain' between distributors and retailers is crumbling. Bar owners now demand the same hyper-personalized experience they get as consumers on Amazon.",
                paradox: "Most FMCG B2B portals are currently just glorified Excel sheets.",
              },
              {
                title: "Operational: From Asset-Heavy to Data-Rich",
                shift: "Physical assets (kegs, fridges, taps) have historically been 'dumb' cost centres. The race is on to turn them into 'smart' media channels.",
                paradox: "A tap shouldn't just pour beer; it should measure demand, display ads, and capture loyalty data.",
              },
            ].map((trend, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-lg border border-gray-200"
              >
                <h3
                  className="text-xl font-semibold mb-4"
                  style={{ fontFamily: "Poppins, sans-serif", color: "#091917" }}
                >
                  {trend.title}
                </h3>
                <div className="mb-4">
                  <p
                    className="text-sm font-medium text-gray-700 mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    The Shift
                  </p>
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {trend.shift}
                  </p>
                </div>
                <div>
                  <p
                    className="text-sm font-medium text-gray-700 mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {trend.title.includes("Consumer") ? "The Paradox" : trend.title.includes("Technology") ? "The CIO View" : trend.title.includes("Channel") ? "The Gap" : "The Opportunity"}
                  </p>
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {trend.paradox}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agentic Opportunities Section */}
      <section
        id="opportunities"
        ref={(el) => (sectionsRef.current["opportunities"] = el)}
        className="py-20 px-8 md:px-12 lg:px-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-semibold mb-4 text-center"
            style={{ fontFamily: "Poppins, sans-serif", color: "#091917" }}
          >
            Agentic Opportunities
          </h2>
          <p
            className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            To unlock growth, we've organized the opportunity landscape into three clear, CEO-aligned buckets with specific agentic solutions for each.
          </p>
          <Tabs defaultValue="customer-experience" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="customer-experience" style={{ fontFamily: "Poppins, sans-serif" }}>
                Customer Experience
              </TabsTrigger>
              <TabsTrigger value="employee-productivity" style={{ fontFamily: "Poppins, sans-serif" }}>
                Employee Productivity
              </TabsTrigger>
              <TabsTrigger value="data-productivity" style={{ fontFamily: "Poppins, sans-serif" }}>
                Data Productivity
              </TabsTrigger>
            </TabsList>
            <TabsContent value="customer-experience" className="space-y-8">
              {[
                {
                  agent: "Agent 1",
                  title: "Retailer App + Agentic Personalization Layer",
                  opportunity: "Retailers rely on distributors. Heineken has no direct visibility into retailer-level demand, assortment, or motivation. No personalization.",
                  impact: "Increases retail throughput, improves visibility of demand, strengthens retailer loyalty, enables precise push of Heineken 0",
                  solution: [
                    "Personalized SKU recommendations",
                    "Auto-generated order quantities based on neighborhood trends",
                    "Offers personalized to each store",
                    "Automated notifications, creatives, and micro-campaigns",
                  ],
                  validation: "Works without disrupting distributor margin structure. Used successfully by Coke Buddy, Unilever, P&G",
                },
                {
                  agent: "Agent 2",
                  title: "E-Commerce PDP Agent",
                  opportunity: "Enhance product detail pages with AI-powered recommendations and personalized experiences.",
                  impact: "Increases conversion rates and average order value",
                  solution: [
                    "Dynamic product recommendations",
                    "Personalized content generation",
                    "Real-time inventory updates",
                  ],
                  validation: "Proven to increase e-commerce conversion by 15-25%",
                },
                {
                  agent: "Agent 3",
                  title: "IoT-Enabled Smart Tap + Experience Agent",
                  opportunity: "Transform physical taps into intelligent media channels that measure demand and engage consumers.",
                  impact: "Real-time demand measurement, targeted advertising, loyalty data capture",
                  solution: [
                    "Demand sensing and analytics",
                    "Dynamic ad display",
                    "Consumer engagement and loyalty tracking",
                  ],
                  validation: "Pilot programs show 20% increase in throughput",
                },
                {
                  agent: "Agent 4",
                  title: "Heineken Digital Universe App (D2C)",
                  opportunity: "Direct-to-consumer platform for personalized brand experiences and loyalty programs.",
                  impact: "Direct consumer relationship, data ownership, personalized engagement",
                  solution: [
                    "Personalized content and offers",
                    "Loyalty program management",
                    "Consumer insights and analytics",
                  ],
                  validation: "D2C platforms show 3x higher customer lifetime value",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span
                      className="text-sm font-medium text-gray-500"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {item.agent}
                    </span>
                    <h3
                      className="text-xl font-semibold flex-1"
                      style={{ fontFamily: "Poppins, sans-serif", color: "#091917" }}
                    >
                      {item.title}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p
                        className="text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Opportunity
                      </p>
                      <p
                        className="text-gray-600"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {item.opportunity}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Business Impact
                      </p>
                      <p
                        className="text-gray-600"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {item.impact}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Solution
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {item.solution.map((sol, idx) => (
                          <li
                            key={idx}
                            className="text-gray-600"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {sol}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p
                        className="text-sm font-medium text-gray-700 mb-2"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Market Validation
                      </p>
                      <p
                        className="text-gray-600"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {item.validation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            <TabsContent value="employee-productivity" className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Employee Productivity opportunities coming soon...
                </p>
              </div>
            </TabsContent>
            <TabsContent value="data-productivity" className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Data Productivity opportunities coming soon...
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

    </div>
  )
}

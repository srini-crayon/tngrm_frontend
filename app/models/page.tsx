"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useModal } from "../../hooks/use-modal";

// Mock data matching the Figma design
const modelData = {
  id: "card-recommender-model",
  title: "Card Recommender Model",
  icon: "💳", // Pink stacked cards icon
  builtBy: "Crayon Data",
  builtByLink: "https://crayondata.com",
  tagline: "Personalizes credit card recommendations to drive acquisition and relevance.",
  description: "A customer-facing recommendation engine that analyzes demographics, transaction history, and existing card features to suggest the most relevant credit card. Designed to enhance acquisition conversion rates while aligning with user lifestyle and preferences.",
  modelType: ["Tabular", "Lightweight model"],
  trainingData: ["Proprietary banking data", "Demographics", "Card Attributes", "Transaction Behavior"],
  compatibleAgents: [
    { name: "Credit Card Advisor", icon: "💳" },
    { name: "New Customer Onboarding Assistant", icon: "👤" }
  ],
  deploymentMode: ["API access", "Embedded in agent flows", "Real-time"],
  evaluationMetrics: ["Top-1/Top-3 Accuracy", "Uplift in Conversion", "Precision @K"]
};

export default function ModelsPage() {
  const { openModal } = useModal();

  return (
    <div className="flex flex-col relative min-h-screen bg-white">
      {/* Main Content */}
      <section 
        className="relative py-12"
        style={{
          position: "relative",
        }}
      >
        {/* Top radial gradient background */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "100%",
            height: "360px",
            top: 0,
            left: 0,
            background: "radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFF 100%)",
            opacity: 1,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        <div className="w-full px-8 md:px-12 lg:px-16 mx-auto" style={{ maxWidth: "1407px", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <Link 
            href="/agents" 
            className="inline-flex items-center mb-6"
            style={{
              color: '#6B7280',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '150%',
            }}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Agent Store
          </Link>

          {/* Model Title Section */}
          <div className="mb-6">
            {/* Model Icon */}
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "8px",
                background: "#FED1E6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "32px",
                marginBottom: "16px",
              }}
            >
              {modelData.icon}
            </div>

            {/* Title and Metadata */}
            <div>
              <h1 
                style={{
                  color: 'var(--Interface-Color-Primary-900, #091917)',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '52px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '54px',
                  letterSpacing: '-1.04px',
                  marginBottom: '8px',
                }}
              >
                {modelData.title}
              </h1>
              
              <div className="flex items-center gap-2 mb-3">
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
                  Model
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
                  Built by
                </span>
                <a
                  href={modelData.builtByLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#155EEF',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: 'normal',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                >
                  {modelData.builtBy}
                </a>
              </div>

              <p
                style={{
                  color: '#6B7280',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '20px',
                }}
              >
                {modelData.tagline}
              </p>
            </div>
          </div>

          {/* Model Description Section */}
          <div className="mb-8">
            <h2
              style={{
                color: '#091917',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 'normal',
                marginBottom: '12px',
              }}
            >
              Model Description
            </h2>
            <p
              style={{
                color: '#091917',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '24px',
                maxWidth: '800px',
              }}
            >
              {modelData.description}
            </p>
          </div>

          {/* Model Type Section */}
          <div className="mb-8">
            <h2
              style={{
                color: '#091917',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 'normal',
                marginBottom: '12px',
              }}
            >
              Model Type
            </h2>
            <div className="flex flex-wrap gap-2">
              {modelData.modelType.map((type, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#F3F4F6',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '20px',
                    color: '#091917',
                  }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Training Data Section */}
          <div className="mb-8">
            <h2
              style={{
                color: '#091917',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 'normal',
                marginBottom: '12px',
              }}
            >
              Training Data
            </h2>
            <div className="flex flex-wrap gap-2">
              {modelData.trainingData.map((data, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#F3F4F6',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '20px',
                    color: '#091917',
                  }}
                >
                  {data}
                </span>
              ))}
            </div>
          </div>

          {/* Compatible Agents Section */}
          <div className="mb-8">
            <h2
              style={{
                color: '#091917',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 'normal',
                marginBottom: '12px',
              }}
            >
              Compatible Agents
            </h2>
            <div className="flex flex-wrap gap-4">
              {modelData.compatibleAgents.map((agent, idx) => (
                <div
                  key={idx}
                  style={{
                    width: '351px',
                    height: '81px',
                    flexShrink: 0,
                    borderRadius: '16px',
                    background: '#F9FAFB',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      background: idx === 0 ? '#FED1E6' : '#E9D5FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0,
                    }}
                  >
                    {agent.icon}
                  </div>
                  <span
                    style={{
                      color: '#091917',
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '20px',
                    }}
                  >
                    {agent.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Mode Section */}
          <div className="mb-8">
            <h2
              style={{
                color: '#091917',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 'normal',
                marginBottom: '12px',
              }}
            >
              Deployment Mode
            </h2>
            <div className="flex flex-wrap gap-2">
              {modelData.deploymentMode.map((mode, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#F3F4F6',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '20px',
                    color: '#091917',
                  }}
                >
                  {mode}
                </span>
              ))}
            </div>
          </div>

          {/* Evaluation Metrics Section */}
          <div className="mb-12">
            <h2
              style={{
                color: '#091917',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '18px',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: 'normal',
                marginBottom: '12px',
              }}
            >
              Evaluation Metrics
            </h2>
            <div className="flex flex-wrap gap-2">
              {modelData.evaluationMetrics.map((metric, idx) => (
                <span
                  key={idx}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#F3F4F6',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: '20px',
                    color: '#091917',
                  }}
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>
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
    </div>
  );
}

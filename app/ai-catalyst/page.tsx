"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { useModal } from "../../hooks/use-modal";
import { 
  Search, 
  Settings, 
  Layers, 
  Rocket,
  CheckCircle2,
  Plus,
  X
} from "lucide-react";

export default function AICatalystPage() {
  const { openModal } = useModal();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedWhyItWorks, setExpandedWhyItWorks] = useState<number | null>(1);

  const whyItWorksData = [
    {
      id: 1,
      number: "01.",
      title: "100+ Prebuilt Agents",
      description: "No blank-slate consulting. Hit the ground running with ready-to-use AI solutions.",
    },
    {
      id: 2,
      number: "02.",
      title: "Tangram Platform",
      description: "Accelerate deployment and reduce costs with streamlined infrastructure.",
    },
    {
      id: 3,
      number: "03.",
      title: "Expert-led",
      description: "Delivered by AI, product, and data science teams who understand your goals",
    },
    {
      id: 4,
      number: "04.",
      title: "Measurable Impact",
      description: "Track ROI, user adoption, and tangible business outcomes.",
    },
  ];

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

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
      ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
    );

    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen" style={{ willChange: "scroll-position" }}>
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden min-h-[90vh]" style={{ willChange: "transform", transform: "translateZ(0)" }}>
        {/* Top radial gradient banner */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            background: "radial-gradient(100% 100% at 50% 0%, #FFFEDA 0%, #FFF 100%)",
            opacity: 1,
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
        <div className="w-full px-8 md:px-12 lg:px-16 py-12 md:py-20 lg:py-24 relative text-center">
            {/* Badge */}
              <span 
                className="inline-block scale-in"
                style={{
                  display: "inline-flex",
                  transform: "rotate(0.282deg)",
                  padding: "4px 16px",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "8px",
                  borderRadius: "50px",
                  background: "#FFEEC5",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "140%",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: "#7F5A00",
                  marginBottom: "14px",
                  willChange: "transform",
                }}
              >
                AI Catalyst
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
              willChange: "opacity, transform, filter",
                }}
              >
                From Idea to Impact — Fast
            </h1>

            {/* Subtitle */}
            <p
              className="text-center fade-in-section"
              style={{
                fontFamily: "Poppins",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "24px",
                textAlign: "center",
                color: "var(--Interface-Color-Primary-900, #091917)",
                marginBottom: "6px",
                willChange: "opacity, transform",
              }}
            >
              Built for enterprise teams who are ready to stop experimenting and start executing.
            </p>

            {/* Description */}
            <p 
              className="mx-auto max-w-2xl text-center fade-in-section"
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "24px",
                textAlign: "center",
                color: "var(--Interface-Color-Primary-900, #091917)",
                marginBottom: "46px",
                willChange: "opacity, transform",
              }}
            >
              Whether you're just exploring GenAI or scaling real deployments — Catalyst meets you where you are, and gets you to where you need to go.
            </p>

            {/* Image */}
          <div className="flex justify-center mt-8 scale-in">
            <Image
              src="/img/catalysts.svg"
              alt="AI Catalyst Process Diagram"
              width={500}
              height={500}
              className="object-contain max-w-full h-auto transition-all duration-500 hover:scale-105 hover:drop-shadow-lg"
              style={{
                maxWidth: "500px",
                height: "auto",
                willChange: "transform",
              }}
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* Introducing AI CATALYST Section */}
      <section className="pt-0 md:pt-2 lg:pt-4 pb-12 md:pb-16 lg:pb-20 bg-white fade-in-section" style={{ willChange: "transform", transform: "translateZ(0)" }}>
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-8">
              <h2
                className="fade-in-blur"
                style={{
                  fontFamily: "Poppins",
                  fontSize: "28px",
                  fontWeight: 600,
                  lineHeight: "33.6px",
                  letterSpacing: "-0.56px",
                  textAlign: "center",
                  background: "linear-gradient(270deg, #FF9231 0%, #F05283 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "16px",
                }}
              >
                Introducing AI CATALYST
              </h2>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "24px",
                  textAlign: "center",
                  color: "var(--Interface-Color-Primary-900, #091917)",
                  marginBottom: "8px",
                }}
              >
                Modular agents. Real data. Expert-led delivery. From whiteboard to working product — in weeks, not months
              </p>
              <p
                style={{
                  fontFamily: "Poppins",
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "24px",
                  textAlign: "center",
                  color: "var(--Interface-Color-Primary-900, #091917)",
                  maxWidth: "913px",
                  margin: "0 auto",
                }}
              >
                Because turning GenAI ambition into enterprise impact needs more than tech — it needs traction. With tngrm.ai as your GenAI platform and AI Catalyst as your services engine, we bridge the gap between ideas and outcomes — fast, flexibly, and at scale.
              </p>
            </div>

            {/* Three Track Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              {/* Labs Card */}
              <div className="bg-white border border-[#E4E4E7] rounded-[4px] overflow-hidden">
                <div
                  className="h-[341px] flex items-end justify-center pb-0 pt-[50px] px-[50px]"
                  style={{
                    background: "linear-gradient(to bottom, rgba(240, 82, 131, 0.21), #FFFFFF)",
                  }}
                >
                  <div className="relative w-[286px] h-[291px]">
                    <Image
                      src="https://www.figma.com/api/mcp/asset/ae9a57a8-0413-4cf5-9a75-bf5bef926ef0"
                      alt="Labs"
                      fill
                      className="object-contain rounded-tl-[16px] rounded-tr-[16px]"
                    />
                  </div>
          </div>
                <div className="p-6 space-y-2">
                  <h3
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fontSize: "18px",
                      lineHeight: "27px",
                      color: "#111827",
                    }}
                  >
                    Labs
                  </h3>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "21px",
                      color: "#6B7280",
                    }}
                  >
                    Discover high-impact use cases and get working prototypes in 2 weeks — perfect for early-stage exploration.
                  </p>
                </div>
              </div>

              {/* Foundry Card */}
              <div className="bg-white border border-[#E4E4E7] rounded-[4px] overflow-hidden">
                <div
                  className="h-[341px] flex items-end justify-center pb-0 pt-[50px] px-[50px]"
                  style={{
                    background: "linear-gradient(to bottom, rgba(59, 96, 175, 0.21), #FFFFFF)",
                  }}
                >
                  <div className="relative w-[286px] h-[291px]">
                    <Image
                      src="https://www.figma.com/api/mcp/asset/5daf3d3f-be18-4775-8ebe-1d388a5942bf"
                      alt="Foundry"
                      fill
                      className="object-contain rounded-tl-[16px] rounded-tr-[16px]"
                    />
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fontSize: "18px",
                      lineHeight: "27px",
                      color: "#111827",
                    }}
                  >
                    Foundry
                  </h3>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "21px",
                      color: "#6B7280",
                    }}
                  >
                    Build pilots on your data systems and go live in real environments — ideal for fast, secure deployments.
                  </p>
                </div>
            </div>

              {/* Factory Card */}
              <div className="bg-white border border-[#E4E4E7] rounded-[4px] overflow-hidden">
                <div
                  className="h-[342px] flex items-end justify-center pb-0 pt-[50px] px-[50px]"
                  style={{
                    background: "linear-gradient(to bottom, rgba(255, 196, 50, 0.21), #FFFFFF)",
                  }}
                >
                  <div className="relative w-[282px] h-[292px]">
                    <Image
                      src="https://www.figma.com/api/mcp/asset/8e57fd80-15f8-4270-b9bf-2cbb434ce2d4"
                      alt="Factory"
                      fill
                      className="object-contain rounded-tl-[16px] rounded-tr-[16px]"
                    />
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 500,
                      fontSize: "18px",
                      lineHeight: "27px",
                      color: "#111827",
                    }}
                  >
                    Factory
                  </h3>
                  <p
                    style={{
                      fontFamily: "Poppins",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "21px",
                      color: "#6B7280",
                    }}
                  >
                    Build pilots on your data systems and go live in real environments — ideal for fast, secure deployments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for? Section */}
      <section className="py-16 md:py-20 lg:py-24 fade-in-section" style={{ display: "block", visibility: "visible", background: "linear-gradient(180deg, #FFF 0%, #FFFFF7 76.44%, #FAFAFA 100%)", willChange: "transform", transform: "translateZ(0)" }}>
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <h2 
              className="mb-2 text-balance fade-in-blur"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "28px",
                lineHeight: "39.2px",
                letterSpacing: "-0.56px",
                textAlign: "center",
                verticalAlign: "middle",
                background: "linear-gradient(to left, #f05283, #8f2b8c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Who is it for?
            </h2>
            <p 
              className="mb-12"
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
              Find. Try. Pick. Launch.
            </p>

            {/* Process Cards */}
            <div className="relative mx-auto flex justify-center items-center" style={{ width: "100%", padding: "0 16px", maxWidth: "100vw", display: "block", visibility: "visible" }}>
              <div className="flex flex-wrap md:flex-nowrap justify-center items-stretch relative mx-auto" style={{ width: "100%", maxWidth: "min(calc(100vw - 32px), 1220px)", gap: "clamp(8px, 2vw, 24px)", display: "flex", visibility: "visible" }}>
                {/* Card 1: Find Your Use Case */}
                <div className="relative z-10 flex-shrink-0 flex-1 stagger-item">
                  <div 
                    className="bg-white border flex flex-col justify-center items-start h-full"
                    style={{
                      borderRadius: "24px",
                      borderWidth: "1px",
                      borderColor: "#E4E4E7",
                      borderStyle: "solid",
                      padding: "24px 24px",
                      maxWidth: "256px",
                    }}
                  >
                    <div className="flex flex-col items-start gap-4">
                      <div 
                        className="relative inline-flex items-start justify-start"
                        style={{
                          width: "80px",
                          height: "80px",
                        }}
                      >
                        <Image 
                          src="/img/Group 1171280425.png" 
                          alt="Find Your Use Case" 
                          width={80} 
                          height={80}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div 
                          style={{
                            color: "#111827",
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "normal",
                            textAlign: "left",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            maxWidth: "208px",
                          }}
                        >
                          Enterprises with big AI goals, but no clear roadmap
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Try an agent */}
                <div className="relative z-10 flex-shrink-0 flex-1 stagger-item">
                  <div 
                    className="bg-white border flex flex-col justify-center items-start h-full"
                    style={{
                      borderRadius: "24px",
                      borderWidth: "1px",
                      borderColor: "#E4E4E7",
                      borderStyle: "solid",
                      padding: "24px 24px",
                      maxWidth: "256px",
                    }}
                  >
                    <div className="flex flex-col items-start gap-4">
                      <div 
                        className="relative inline-flex items-start justify-start"
                        style={{
                          width: "80px",
                          height: "80px",
                        }}
                      >
                        <Image 
                          src="/img/Group 1171280425-1.png" 
                          alt="Try an agent" 
                          width={80} 
                          height={80}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div 
                          style={{
                            color: "#111827",
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "normal",
                            textAlign: "left",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            maxWidth: "208px",
                          }}
                        >
                          Leaders who need proof of value before going all-in
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3: Pick your stack */}
                <div className="relative z-10 flex-shrink-0 flex-1 stagger-item">
                  <div 
                    className="bg-white border flex flex-col justify-center items-start h-full"
                    style={{
                      borderRadius: "24px",
                      borderWidth: "1px",
                      borderColor: "#E4E4E7",
                      borderStyle: "solid",
                      padding: "24px 24px",
                      maxWidth: "256px",
                    }}
                  >
                    <div className="flex flex-col items-start gap-4">
                      <div 
                        className="relative inline-flex items-start justify-start"
                        style={{
                          width: "80px",
                          height: "80px",
                        }}
                      >
                        <Image 
                          src="/img/Group 1171280426.png" 
                          alt="Pick your stack" 
                          width={80} 
                          height={80}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div 
                          style={{
                            color: "#111827",
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "normal",
                            textAlign: "left",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            maxWidth: "208px",
                          }}
                        >
                          Teams stuck at POC purgatory
                        </div>
                      </div>
                    </div>
                  </div>
            </div>

                {/* Card 4: Launch your trial */}
                <div className="relative z-10 flex-shrink-0 flex-1 stagger-item">
                  <div 
                    className="bg-white border flex flex-col justify-center items-start h-full"
                    style={{
                      borderRadius: "24px",
                      borderWidth: "1px",
                      borderColor: "#E4E4E7",
                      borderStyle: "solid",
                      padding: "24px 24px",
                      maxWidth: "256px",
                    }}
                  >
                    <div className="flex flex-col items-start gap-4">
                      <div 
                        className="relative inline-flex items-start justify-start"
                        style={{
                          width: "80px",
                          height: "80px",
                        }}
                      >
                        <Image 
                          src="/img/Group 1171280435.png" 
                          alt="Launch your trial" 
                          width={80} 
                          height={80}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div 
                          style={{
                            color: "#111827",
                            fontFamily: "Poppins",
                            fontSize: "14px",
                            fontStyle: "normal",
                            fontWeight: 500,
                            lineHeight: "normal",
                            textAlign: "left",
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            maxWidth: "208px",
                          }}
                        >
                          Anyone who wants GenAI that works inside your real world
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Each track is tailored Section */}
      <section className="pt-16 md:pt-20 lg:pt-24 pb-12 md:pb-16 lg:pb-20 bg-white fade-in-section" style={{ willChange: "transform", transform: "translateZ(0)" }}>
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2
                className="fade-in-blur"
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
                  marginBottom: "6px",
                }}
              >
                Each track is tailored to where you are in your AI journey
              </h2>
              <p
                style={{
                  color: "#111827",
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "24px",
                  maxWidth: "913px",
                  margin: "0 auto",
                }}
              >
                Because turning GenAI ambition into enterprise impact needs more than tech — it needs traction. With tngrm.ai as your GenAI platform and AI Catalyst as your services engine, we bridge the gap between ideas and outcomes — fast, flexibly, and at scale.
              </p>
            </div>

            {/* Three Detailed Track Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Labs Track */}
              <div className="relative bg-white overflow-hidden" style={{ minHeight: "404px", maxWidth: "411px" }}>
                {/* Background Image */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url('/img/catalystcardbg.svg')",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100%",
                    willChange: "transform",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                />
                <div className="relative" style={{ padding: "40px" }}>
                  <div className="mb-4">
                    <span
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "64px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "64px",
                        letterSpacing: "-4px",
                        background: "linear-gradient(0deg, rgba(240, 82, 131, 0.00) 0%, #F05283 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      01
                    </span>
                  </div>
                  <h3
                    style={{
                      color: "#101828",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "normal",
                      marginBottom: "12px",
                    }}
                  >
                    From Idea to Working Prototype
            </h3>
                  <p
                    style={{
                      color: "#344054",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "140%",
                      marginBottom: "16px",
                    }}
                  >
                    Quick sprints to explore use cases, validate ideas, and show early wins.
                  </p>
                  <ul className="space-y-2 mb-4" style={{ listStyle: "none", padding: 0 }}>
                    {["Ideation workshops", "Tangram agent configuration", "Data feasibility check", "ROI framing"].map((item, idx) => (
                      <li
                        key={idx}
                        style={{
                          color: "#344054",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "140%",
                        }}
                      >
                        • {item}
                      </li>
                    ))}
                  </ul>
                  <p
                    style={{
                      color: "#000",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "190%",
                    }}
                  >
                    2 weeks | 📍 Low-commitment, high-impact
                  </p>
          </div>
              </div>

              {/* Foundry Track */}
              <div className="relative bg-white overflow-hidden scale-in" style={{ minHeight: "404px", maxWidth: "411px" }}>
                {/* Background Image */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url('/img/catalystcardbg.svg')",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100%",
                    willChange: "transform",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                />
                <div className="relative" style={{ padding: "40px" }}>
                  <div className="mb-4">
                    <span
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "64px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "64px",
                        letterSpacing: "-4px",
                        background: "linear-gradient(0deg, rgba(59, 96, 175, 0.00) 0%, #3B60AF 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      02
                    </span>
                  </div>
                  <h3
                    style={{
                      color: "#101828",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "normal",
                      marginBottom: "12px",
                    }}
                  >
                    From Prototype to Pilot
                  </h3>
                  <p
                    style={{
                      color: "#344054",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "140%",
                      marginBottom: "16px",
                    }}
                  >
                    Build secure, customized workflows that plug into your data and systems.
                  </p>
                  <ul className="space-y-2 mb-4" style={{ listStyle: "none", padding: 0 }}>
                    {["Custom agent workflows", "Real-time data integrations", "Human-in-loop controls", "Pilot dashboards & feedback"].map((item, idx) => (
                      <li
                        key={idx}
                        style={{
                          color: "#344054",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "140%",
                        }}
                      >
                        • {item}
                      </li>
                    ))}
                  </ul>
                  <p
                    style={{
                      color: "#000",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "190%",
                    }}
                  >
                    4–6 weeks | 📍 Tangram meets your tech stack
                  </p>
            </div>
              </div>

              {/* Factory Track */}
              <div className="relative bg-white overflow-hidden scale-in" style={{ minHeight: "404px", maxWidth: "411px" }}>
                {/* Background Image */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: "url('/img/catalystcardbg.svg')",
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100%",
                    willChange: "transform",
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                  }}
                />
                <div className="relative" style={{ padding: "40px" }}>
                  <div className="mb-4">
                    <span
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "64px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "64px",
                        letterSpacing: "-4px",
                        background: "linear-gradient(0deg, rgba(255, 146, 49, 0.00) 0%, #FF9231 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      03
                    </span>
            </div>
                  <h3
                    style={{
                      color: "#101828",
                      fontFamily: "Poppins",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 600,
                      lineHeight: "normal",
                      marginBottom: "12px",
                    }}
                  >
                    From Pilot to Production
                  </h3>
                  <p
                    style={{
                      color: "#344054",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "140%",
                      marginBottom: "16px",
                    }}
                  >
                    Enterprise-grade deployments that scale — with security, analytics, and impact tracking.
                  </p>
                  <ul className="space-y-2 mb-4" style={{ listStyle: "none", padding: 0 }}>
                    {["Full-stack implementation", "Governance and compliance", "Agent performance monitoring", "Ongoing support + updates"].map((item, idx) => (
                      <li
                        key={idx}
                        style={{
                          color: "#344054",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "140%",
                        }}
                      >
                        • {item}
                      </li>
                    ))}
                  </ul>
                  <p
                    style={{
                      color: "#000",
                      fontFamily: "Poppins",
                      fontSize: "14px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "190%",
                    }}
                  >
                    6–10 weeks | 📍 Built for scale
                  </p>
            </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why it Works Section */}
      <section className="py-16 md:py-20 lg:py-24 min-h-[80vh] bg-white fade-in-section" style={{ willChange: "transform", transform: "translateZ(0)" }}>
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
                  background: "linear-gradient(90deg, #002E84 0%, #1157D9 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "6px",
                }}
              >
                Why it Works
              </h2>
              <p 
                style={{
                  color: "#111827",
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "24px",
                }}
              >
                Find. Try. Pick. Launch.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {/* Left Side - Accordion */}
              <div className="flex flex-col" style={{ maxWidth: "584px", width: "100%" }}>
                {whyItWorksData.map((item, index) => {
                  const isExpanded = expandedWhyItWorks === item.id;
                  return (
                    <div key={item.id} className={index > 0 ? "border-t" : ""} style={{ borderColor: "#D1D6DB" }}>
                      <button
                        onClick={() => setExpandedWhyItWorks(isExpanded ? null : item.id)}
                        className="w-full flex items-center justify-start px-2 py-6 cursor-pointer hover:opacity-80 transition-opacity"
                        style={{
                          paddingTop: "24px",
                          paddingBottom: "24px",
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
                        <div className="px-2 pb-6">
                          <p style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontSize: "16px",
                            lineHeight: "1.5",
                            color: "#34414e",
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
              <div className="flex items-start justify-center">
                <div className="relative">
                  <Image
                    src="/img/catalystwhy1.svg"
                    alt="Why it Works Diagram"
                    width={480}
                    height={452}
                    className="object-contain transition-opacity duration-300"
                    style={{
                      width: "480px",
                      height: "452px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Services CTA Section */}
      <section
        className="py-10 px-4 md:py-[50px] md:px-5 lg:py-20 lg:px-0 fade-in-section"
        style={{
          width: "100%",
          background: "transparent",
          position: "relative",
          margin: "0 auto",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          boxSizing: "border-box",
          overflow: "hidden",
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
            }}
          >
            {/* Top Pill Badge */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                width: "auto",
                height: "28px",
                minWidth: "fit-content",
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
                Custom Services
              </div>
            </div>

            {/* Main Heading */}
            <h1
              className="md:text-[28px] md:leading-[39.2px] md:tracking-[-0.56px] md:px-20 md:whitespace-normal text-[24px] leading-[33.6px] tracking-[-0.48px] px-4 whitespace-normal lg:text-[32px] lg:leading-[44.8px] lg:tracking-[-0.64px] lg:px-[165px] lg:pl-[171.34px] lg:whitespace-nowrap fade-in-blur"
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
                color: "transparent",
                margin: 0,
                width: "100%",
                maxWidth: "100%",
                overflow: "visible",
                boxSizing: "border-box",
              }}
            >
              Need something more? We've got you covered
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
              Our team of experts can work with you to design custom solutions tailored to your exact needs and objectives. From specialized analytics to bespoke integrations, we'll create a solution that's perfect for your business.
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
            }}
          >
            <div
              className="w-full md:w-auto"
              style={{
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
                className="w-full md:w-[123px]"
                style={{
                  position: "absolute",
                  left: "2px",
                  top: "2px",
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                }}
              >
                Talk to us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

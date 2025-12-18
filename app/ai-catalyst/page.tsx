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
                Introducing AI CATALYST
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
              Catalyst — The Engine That Delivers Outcomes
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
              Catalyst is Crayon's services and execution model — built to help clients unlock value from Tangram quickly and at scale. It brings together and giving you a structured yet flexible path to success.
            </p>

            {/* Flow Image */}
            <div className="flex justify-center mt-8 mb-12 scale-in">
              <div
                className="object-contain max-w-full h-auto"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              >
                <Image
                  src="/img/flow.svg"
                  alt="Flow diagram"
                  width={602}
                  height={89}
                  className="object-contain"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              </div>
            </div>

            {/* Three Track Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-7xl mx-auto">
              {/* Labs Card */}
              <div className="flip-card scale-in" style={{ height: "500px" }}>
                <div className="flip-card-inner">
                  {/* Front Face */}
                  <div className="flip-card-front bg-white border border-[#E4E4E7] rounded-[4px] overflow-hidden h-full">
                    <div
                      className="h-[341px] flex items-end justify-center pb-0 pt-[50px] px-[50px]"
                      style={{
                        background: "linear-gradient(to bottom, rgba(240, 82, 131, 0.21), #FFFFFF)",
                      }}
                    >
                      <div className="relative w-[286px] h-[291px]">
                        <Image
                          src="Labs.png"
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
                  {/* Back Face */}
                  <div className="flip-card-back bg-white overflow-hidden h-full relative" style={{
                    borderRadius: "4px",
                    border: "1px solid #E4E4E7",
                    background: "radial-gradient(58.46% 58.46% at 50% 108.46%, #FBD5E1 0%, #FFF 100%)",
                  }}>
                    <div className="p-6 h-full flex flex-col">
                      <h3
                        style={{
                          color: "#ED407B",
                          textAlign: "center",
                          fontFamily: "Poppins",
                          fontSize: "24px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "27px",
                          marginBottom: "24px",
                        }}
                      >
                        LABS.
                      </h3>
                      <div className="flex-1 space-y-6">
                        <div>
                          <h4
                            style={{
                              color: "#111827",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "18px",
                              fontStyle: "normal",
                              fontWeight: 500,
                              lineHeight: "27px",
                              marginBottom: "8px",
                            }}
                          >
                            Purpose
                          </h4>
                          <p
                            style={{
                              color: "#091917",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "15px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "21px",
                            }}
                          >
                            Discover & Validate Opportunities
                          </p>
                        </div>
                        <div className="border-t border-dotted border-[#D1D5DB]" style={{ borderStyle: "dotted" }}></div>
                        <div>
                          <h4
                            style={{
                              color: "#111827",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "18px",
                              fontStyle: "normal",
                              fontWeight: 500,
                              lineHeight: "27px",
                              marginBottom: "8px",
                            }}
                          >
                            What we do together
                          </h4>
                          <p
                            style={{
                              color: "#091917",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "15px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "21px",
                            }}
                          >
                            Identify your high-impact GenAI use cases and run rapid pilots to test value.
                          </p>
                        </div>
                        <div className="border-t border-dotted border-[#D1D5DB]" style={{ borderStyle: "dotted" }}></div>
                        <div>
                          <h4
                            style={{
                              color: "#111827",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "18px",
                              fontStyle: "normal",
                              fontWeight: 500,
                              lineHeight: "27px",
                              marginBottom: "8px",
                            }}
                          >
                            Your Outcome
                          </h4>
                          <p
                            style={{
                              color: "#091917",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "15px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "21px",
                            }}
                          >
                            Clear, validated roadmap for GenAI adoption.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Foundry Card */}
              <div className="flip-card scale-in" style={{ height: "500px" }}>
                <div className="flip-card-inner">
                  {/* Front Face */}
                  <div className="flip-card-front bg-white border border-[#E4E4E7] rounded-[4px] overflow-hidden h-full">
                    <div
                      className="h-[341px] flex items-end justify-center pb-0 pt-[50px] px-[50px]"
                      style={{
                        background: "linear-gradient(to bottom, rgba(59, 96, 175, 0.21), #FFFFFF)",
                      }}
                    >
                      <div className="relative w-[286px] h-[291px]">
                        <Image
                          src="Foundary.png"
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
                  {/* Back Face */}
                  <div className="flip-card-back bg-white overflow-hidden h-full relative" style={{
                    borderRadius: "4px",
                    border: "1px solid #E4E4E7",
                    background: "radial-gradient(58.46% 58.46% at 50% 108.46%, rgba(59, 96, 175, 0.15) 0%, #FFF 100%)",
                  }}>
                    <div className="p-6 h-full flex flex-col">
                      <h3
                        style={{
                          color: "#3B60AF",
                          textAlign: "center",
                          fontFamily: "Poppins",
                          fontSize: "24px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "27px",
                          marginBottom: "24px",
                        }}
                      >
                        Foundry.
                      </h3>
                      <div className="flex-1 space-y-6">
                        <div>
                          <h4
                            style={{
                              color: "#111827",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "18px",
                              fontStyle: "normal",
                              fontWeight: 500,
                              lineHeight: "27px",
                              marginBottom: "8px",
                            }}
                          >
                            Purpose
                          </h4>
                          <p
                            style={{
                              color: "#091917",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "15px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "21px",
                            }}
                          >
                            Build & Integrate Solutions
                          </p>
                        </div>
                        <div className="border-t border-dotted border-[#D1D5DB]" style={{ borderStyle: "dotted" }}></div>
                        <div>
                          <h4
                            style={{
                              color: "#111827",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "18px",
                              fontStyle: "normal",
                              fontWeight: 500,
                              lineHeight: "27px",
                              marginBottom: "8px",
                            }}
                          >
                            What we do together
                          </h4>
                          <p
                            style={{
                              color: "#091917",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "15px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "21px",
                            }}
                          >
                            Design, test, and deploy AI with Tangram's modular components.
                          </p>
                        </div>
                        <div className="border-t border-dotted border-[#D1D5DB]" style={{ borderStyle: "dotted" }}></div>
                        <div>
                          <h4
                            style={{
                              color: "#111827",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "18px",
                              fontStyle: "normal",
                              fontWeight: 500,
                              lineHeight: "27px",
                              marginBottom: "8px",
                            }}
                          >
                            Your Outcome
                          </h4>
                          <p
                            style={{
                              color: "#091917",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "15px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "21px",
                            }}
                          >
                            Proven prototypes and working solutions in real use.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Factory Card */}
              <div className="flip-card scale-in" style={{ height: "500px" }}>
                <div className="flip-card-inner">
                  {/* Front Face */}
                  <div className="flip-card-front bg-white border border-[#E4E4E7] rounded-[4px] overflow-hidden h-full">
                    <div
                      className="h-[342px] flex items-end justify-center pb-0 pt-[50px] px-[50px]"
                      style={{
                        background: "linear-gradient(to bottom, rgba(255, 196, 50, 0.21), #FFFFFF)",
                      }}
                    >
                      <div className="relative w-[282px] h-[292px]">
                        <Image
                          src="Factory.png"
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
                  {/* Back Face */}
                  <div className="flip-card-back bg-white overflow-hidden h-full relative" style={{
                    borderRadius: "4px",
                    border: "1px solid #E4E4E7",
                    background: "radial-gradient(58.46% 58.46% at 50% 108.46%, rgba(255, 196, 50, 0.2) 0%, #FFF 100%)",
                  }}>
                    <div className="p-6 h-full flex flex-col">
                      <h3
                        style={{
                          color: "#FF9231",
                          textAlign: "center",
                          fontFamily: "Poppins",
                          fontSize: "24px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "27px",
                          marginBottom: "24px",
                        }}
                      >
                        Factory.
                      </h3>
                      <div className="flex-1 space-y-6">
                        <div>
                          <h4
                            style={{
                              color: "#111827",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "18px",
                              fontStyle: "normal",
                              fontWeight: 500,
                              lineHeight: "27px",
                              marginBottom: "8px",
                            }}
                          >
                            Purpose
                          </h4>
                          <p
                            style={{
                              color: "#091917",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "15px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "21px",
                            }}
                          >
                            Scale & Govern Enterprise AI
                          </p>
                        </div>
                        <div className="border-t border-dotted border-[#D1D5DB]" style={{ borderStyle: "dotted" }}></div>
                        <div>
                          <h4
                            style={{
                              color: "#111827",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "18px",
                              fontStyle: "normal",
                              fontWeight: 500,
                              lineHeight: "27px",
                              marginBottom: "8px",
                            }}
                          >
                            What we do together
                          </h4>
                          <p
                            style={{
                              color: "#091917",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "15px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "21px",
                            }}
                          >
                            Securely scale deployments, enforce governance, and build repeatable frameworks
                          </p>
                        </div>
                        <div className="border-t border-dotted border-[#D1D5DB]" style={{ borderStyle: "dotted" }}></div>
                        <div>
                          <h4
                            style={{
                              color: "#111827",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "18px",
                              fontStyle: "normal",
                              fontWeight: 500,
                              lineHeight: "27px",
                              marginBottom: "8px",
                            }}
                          >
                            Your Outcome
                          </h4>
                          <p
                            style={{
                              color: "#091917",
                              textAlign: "center",
                              fontFamily: "Poppins",
                              fontSize: "15px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "21px",
                            }}
                          >
                            Enterprise-grade, measurable business impact.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Start Anywhere, Scale Everywhere Section */}
      <section className="py-16 md:py-20 lg:py-24 fade-in-section" style={{ background: "linear-gradient(180deg, #FFF 0%, #FFFFF7 76.44%, #FAFAFA 100%)" }}>
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto text-center">
            <h2 
              className="text-balance fade-in-blur"
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
                marginBottom: "6px",
              }}
            >
              Start Anywhere, Scale Everywhere
            </h2>
            <p 
              style={{
                display: "flex",
                width: "680.673px",
                height: "24px",
                flexDirection: "column",
                justifyContent: "center",
                color: "#111827",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "24px",
                margin: "0 auto",
                marginBottom: "0px",
              }}
            >
              Every enterprise's GenAI journey is unique
            </p>
            <p 
              style={{
                display: "flex",
                width: "680.673px",
                height: "24px",
                flexDirection: "column",
                justifyContent: "center",
                color: "#091917",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "24px",
                margin: "0 auto",
                marginBottom: "58px",
              }}
            >
              With Catalyst, you can start where you are — and scale as you go:
            </p>

            {/* Three Stage Cards */}
            <div className="flex flex-col md:flex-row items-center justify-center" style={{ maxWidth: "716px", margin: "0 auto", gap: "48px", marginBottom: "58px" }}>
              {/* Stage 1: Labs */}
              <div className="flex flex-col items-center stagger-item" style={{ maxWidth: "206px", width: "100%" }}>
                <div 
                  className="flex items-center justify-center mb-6"
                  style={{ background: "transparent" }}
                >
                  <div className="relative" style={{ width: "60px", height: "60px", maxWidth: "60px" }}>
                    <Image
                      src="/img/labs-ico.svg"
                      alt="Labs"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <p
                  style={{
                    color: "#111827",
                    textAlign: "center",
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "normal",
                  }}
                >
                  Begin in <span style={{ fontWeight: 600 }}>Labs</span> to explore new opportunities.
                </p>
              </div>

              {/* Stage 2: Foundry */}
              <div className="flex flex-col items-center stagger-item" style={{ maxWidth: "206px", width: "100%" }}>
                <div 
                  className="flex items-center justify-center mb-6"
                  style={{ background: "transparent" }}
                >
                  <div className="relative" style={{ width: "60px", height: "60px", maxWidth: "60px" }}>
                    <Image
                      src="/img/foundry-ico.svg"
                      alt="Foundry"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <p
                  style={{
                    color: "#111827",
                    textAlign: "center",
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "normal",
                  }}
                >
                  Move into <span style={{ fontWeight: 600 }}>Foundry</span> to bring solutions to life.
                </p>
              </div>

              {/* Stage 3: Factory */}
              <div className="flex flex-col items-center stagger-item" style={{ maxWidth: "206px", width: "100%" }}>
                <div 
                  className="flex items-center justify-center mb-6"
                  style={{ background: "transparent" }}
                >
                  <div className="relative" style={{ width: "60px", height: "60px", maxWidth: "60px" }}>
                    <Image
                      src="/img/factory-ico.svg"
                      alt="Factory"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <p
                  style={{
                    color: "#111827",
                    textAlign: "center",
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "normal",
                  }}
                >
                  Expand through <span style={{ fontWeight: 600 }}>Factory</span> to scale with governance and consistency.
                </p>
              </div>
            </div>

            {/* Concluding Statement */}
            <p 
              className="max-w-3xl mx-auto"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#111827",
                marginTop: "58px",
              }}
            >
              Each stage connects seamlessly through the <strong>Tangram.ai platform</strong> — ensuring speed, safety, and repeatability across your AI initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* From Idea to Impact — Your Journey with Crayon Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-white fade-in-section">
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
                  marginBottom: "8px",
                }}
              >
                From Idea to Impact — Your Journey with Crayon
              </h2>
              <p
                className="mx-auto"
                style={{
                  color: "#091917",
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "24px",
                  maxWidth: "560px",
                }}
              >
                Whether you're exploring, building, or scaling, Crayon Data helps you move from <span style={{ fontWeight: 500 }}>possibility</span> → <span style={{ fontWeight: 500 }}>prototype</span> → <span style={{ fontWeight: 500 }}>production</span>.
              </p>
            </div>

            {/* Four Journey Stage Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Discovery Card */}
              <div className="stagger-item">
                <div className="bg-white border border-[#E4E4E7] rounded-lg p-6 h-full relative">
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "28px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "normal",
                        background: "linear-gradient(0deg, rgba(57, 79, 161, 0.00) -28.57%, #394FA1 75%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Discovery
                    </h3>
                    <div className="relative" style={{ width: "48px", height: "48px" }}>
                      <Image
                        src="/img/Compass.svg"
                        alt="Discovery"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4
                        style={{
                          color: "#111827",
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "normal",
                          marginBottom: "4px",
                        }}
                      >
                        Format
                      </h4>
                      <p
                        style={{
                          color: "#4B5563",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        Online or in-person
                      </p>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: "#111827",
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "normal",
                          marginBottom: "4px",
                        }}
                      >
                        Focus
                      </h4>
                      <p
                        style={{
                          color: "#4B5563",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        Understand goals, challenges and data landscape
                      </p>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: "#111827",
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "normal",
                          marginBottom: "4px",
                        }}
                      >
                        What You Get
                      </h4>
                      <p
                        style={{
                          color: "#4B5563",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        Defined use case and success metrics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ideation Card */}
              <div className="stagger-item">
                <div className="bg-white border border-[#E4E4E7] rounded-lg p-6 h-full relative">
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "28px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "normal",
                        background: "linear-gradient(0deg, rgba(255, 146, 49, 0.00) -28.57%, #FF9231 75%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Ideation
                    </h3>
                    <div className="relative" style={{ width: "48px", height: "48px" }}>
                      <Image
                        src="/img/LightbulbFilament.svg"
                        alt="Ideation"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4
                        style={{
                          color: "#111827",
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "normal",
                          marginBottom: "4px",
                        }}
                      >
                        Format
                      </h4>
                      <p
                        style={{
                          color: "#4B5563",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        Co-creation sprint
                      </p>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: "#111827",
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "normal",
                          marginBottom: "4px",
                        }}
                      >
                        Focus
                      </h4>
                      <p
                        style={{
                          color: "#4B5563",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        Design your first GenAI agent or workflow.
                      </p>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: "#111827",
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "normal",
                          marginBottom: "4px",
                        }}
                      >
                        What You Get
                      </h4>
                      <p
                        style={{
                          color: "#4B5563",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        Prototype concept and solution design.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pilot Card */}
              <div className="stagger-item">
                <div className="bg-white border border-[#E4E4E7] rounded-lg p-6 h-full relative">
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "28px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "normal",
                        background: "linear-gradient(0deg, rgba(240, 82, 131, 0.00) -28.57%, #F05283 75%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Pilot
                    </h3>
                    <div className="relative" style={{ width: "48px", height: "48px" }}>
                      <Image
                        src="/img/CursorClick.svg"
                        alt="Pilot"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4
                        style={{
                          color: "#111827",
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "normal",
                          marginBottom: "4px",
                        }}
                      >
                        Format
                      </h4>
                      <p
                        style={{
                          color: "#4B5563",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        Proof of Concept
                      </p>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: "#111827",
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "normal",
                          marginBottom: "4px",
                        }}
                      >
                        Focus
                      </h4>
                      <p
                        style={{
                          color: "#4B5563",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        Run pilots that show measurable impact and ROI.
                      </p>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: "#111827",
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "normal",
                          marginBottom: "4px",
                        }}
                      >
                        What You Get
                      </h4>
                      <p
                        style={{
                          color: "#4B5563",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        Validated MVP and business case.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deploy Card */}
              <div className="stagger-item">
                <div className="bg-white border border-[#E4E4E7] rounded-lg p-6 h-full relative">
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      style={{
                        fontFamily: "Poppins",
                        fontSize: "28px",
                        fontStyle: "normal",
                        fontWeight: 600,
                        lineHeight: "normal",
                        background: "linear-gradient(0deg, rgba(0, 174, 142, 0.00) -28.57%, #00AE8E 75%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Deploy
                    </h3>
                    <div className="relative" style={{ width: "48px", height: "48px" }}>
                      <Image
                        src="/img/CloudCheck.svg"
                        alt="Deploy"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4
                        style={{
                          color: "#111827",
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "normal",
                          marginBottom: "4px",
                        }}
                      >
                        Format
                      </h4>
                      <p
                        style={{
                          color: "#4B5563",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        Production rollout
                      </p>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: "#111827",
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "normal",
                          marginBottom: "4px",
                        }}
                      >
                        Focus
                      </h4>
                      <p
                        style={{
                          color: "#4B5563",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        Integrate into your systems and scale securely.
                      </p>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: "#111827",
                          fontFamily: "Poppins",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 500,
                          lineHeight: "normal",
                          marginBottom: "4px",
                        }}
                      >
                        What You Get
                      </h4>
                      <p
                        style={{
                          color: "#4B5563",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "normal",
                        }}
                      >
                        Live solution delivering sustained value.
                      </p>
                    </div>
                  </div>
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
                fontFamily: "Poppins",
                fontSize: "32px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
                textAlign: "center",
                background: "linear-gradient(90deg, #2D8E0C 0%, #77C402 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
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

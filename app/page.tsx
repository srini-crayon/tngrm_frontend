"use client";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/badge";
import { Search, Database, Gauge, Clock, Cloud, Settings, Shield, Rocket, CheckCircle2, ChevronDown, Plus, User, Star, Layers } from "lucide-react";
import { useModal } from "../hooks/use-modal";
import { useState, useEffect, useRef } from "react";
import ChatDialog from "../components/chat-dialog";
import Image from "next/image";
import Link from "next/link";
import HeroCta from "../components/HeroCta";
import { useAuthStore } from "../lib/store/auth.store";

export default function HomePage() {
  const { openModal } = useModal();
  const { isAuthenticated } = useAuthStore();
  const [chatOpen, setChatOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(1);
  const [typedText, setTypedText] = useState("");
  const [colorIndex, setColorIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  
  const typingPhrases = ["Faster Deployment", "Smarter Outcomes", "Data Activation"];
  const colors = ["#F05283", "#00AE8E", "#FFC432"];

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
    const rotateGradient = () => {
      angle = (angle + 1) % 360;
      element.style.setProperty("--gradient-angle", `${angle}deg`);
      requestAnimationFrame(rotateGradient);
    };

    rotateGradient();
  }, []);

  // Typing effect: type one phrase, erase, then type next
  useEffect(() => {
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let animationFrameId: number | null = null;
    let pauseTimeout: NodeJS.Timeout | null = null;
    let isActive = true;
    let isErasing = false;
    let lastUpdateTime = 0;
    const typingSpeed = 80; // milliseconds per character
    const erasingSpeed = 40; // milliseconds per character (faster)
    
    const animate = (currentTime: number) => {
      if (!isActive) return;
      
      const currentPhrase = typingPhrases[currentPhraseIndex];
      const elapsed = currentTime - lastUpdateTime;
      const speed = isErasing ? erasingSpeed : typingSpeed;
      
      if (elapsed >= speed) {
        lastUpdateTime = currentTime;
        
        if (!isErasing) {
          // Typing phase
          if (currentCharIndex < currentPhrase.length) {
            setTypedText(currentPhrase.slice(0, currentCharIndex + 1));
            currentCharIndex++;
            animationFrameId = requestAnimationFrame(animate);
          } else {
            // Finished typing, pause then start erasing
            setIsTyping(false);
            pauseTimeout = setTimeout(() => {
              if (!isActive) return;
              isErasing = true;
              currentCharIndex = currentPhrase.length;
              lastUpdateTime = performance.now();
              animationFrameId = requestAnimationFrame(animate);
            }, 2000); // Pause after typing
          }
        } else {
          // Erasing phase
          if (currentCharIndex > 0) {
            setTypedText(currentPhrase.slice(0, currentCharIndex - 1));
            currentCharIndex--;
            animationFrameId = requestAnimationFrame(animate);
          } else {
            // Finished erasing, move to next phrase
            setTypedText("");
            setIsTyping(false);
            
            // Move to next phrase and color
            currentPhraseIndex = (currentPhraseIndex + 1) % typingPhrases.length;
            setColorIndex((prev) => (prev + 1) % colors.length);
            
            // Small pause before starting next phrase
            pauseTimeout = setTimeout(() => {
              if (!isActive) return;
              isErasing = false;
              currentCharIndex = 0;
              setIsTyping(true);
              lastUpdateTime = performance.now();
              animationFrameId = requestAnimationFrame(animate);
            }, 500);
          }
        }
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    setIsTyping(true);
    lastUpdateTime = performance.now();
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      isActive = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (pauseTimeout) clearTimeout(pauseTimeout);
    };
  }, []);

  const benefitsData = [
    {
      id: 1,
      number: "01.",
      title: "Composability",
      description: "AI you can plug in anywhere — across systems, teams, or journeys.",
      image: "/img/Composability.svg",
      numberColor: "#FF9231",
    },
    {
      id: 2,
      number: "02.",
      title: "Agentic Workflows",
      description: "Automated workflows that adapt and learn from your business processes.",
      image: "/img/Agentic Workflows.svg",
      numberColor: "#6B7280",
    },
    {
      id: 3,
      number: "03.",
      title: "Faster Time-to-Value",
      description: "Deploy AI solutions in days, not months, with pre-built components.",
      image: "/img/Faster Time-to-Value.svg",
      numberColor: "#6B7280",
    },
    {
      id: 4,
      number: "04.",
      title: "Lower TCO",
      description: "Reduce total cost of ownership with efficient, scalable AI infrastructure.",
      image: "/img/Lower TCO.svg",
      numberColor: "#6B7280",
    },
    {
      id: 5,
      number: "05.",
      title: "Enterprise-Grade Deployment",
      description: "Production-ready AI with security, compliance, and governance built-in.",
      image: "/img/Enterprise-Grade Deployment.svg",
      numberColor: "#6B7280",
    },
  ];

  const currentItem = benefitsData.find(item => item.id === expandedItem) || benefitsData[0];

  // Scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
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
      animatedElements.forEach((element) => observer.observe(element));
    };

    // Use requestIdleCallback for better performance, fallback to setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(observeElements, { timeout: 200 });
    } else {
      setTimeout(observeElements, 100);
    }

    return () => {
      const animatedElements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item"
      );
      animatedElements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col" style={{ transform: "translateZ(0)", willChange: "scroll-position", scrollBehavior: "smooth" }}>
      {/* Hero Section (Agents hero moved here) */}
      <section 
        className="relative py-16 md:py-20 lg:py-24 h-[85vh] flex items-center w-full fade-in-section"
        style={{
          backgroundImage: "url('/img/indexbg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          transform: "translateZ(0)",
          willChange: "transform",
          backfaceVisibility: "hidden",
          contain: "layout style paint",
        }}
      >
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            {/* Badge: From Pilot to Platform */}
            <div className="mt-0 flex justify-center scale-in" style={{ marginBottom: "18px", willChange: "transform" }}>
              <div 
                className="inline-flex items-center gap-2 border bg-white"
                style={{
                  width: "206px",
                  height: "36px",
                  paddingTop: "6px",
                  paddingRight: "16px",
                  paddingBottom: "6px",
                  paddingLeft: "16px",
                  borderRadius: "10px",
                  borderColor: "#E5E7EB",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
              >
                <div className="relative h-4 w-4">
                  <Image
                    src="/chat_icon.png"
                    alt="bot"
                    fill
                    className="object-contain"
                    style={{ position: "absolute", height: "100%", width: "100%", inset: "0px", color: "transparent" }}
                  />
                </div>
              <span
                  className="whitespace-nowrap"
                style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "14px",
                    lineHeight: "18px",
                    letterSpacing: "0%",
                    verticalAlign: "middle",
                    color: "#111827",
                }}
              >
                  From Pilot to Platform
              </span>
              </div>
            </div>

            <div className="mb-0 text-balance mx-auto block">
              <h1 className="fade-in-blur" style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "52px",
                lineHeight: "48px",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#091917",
                margin: "0 auto",
                marginBottom: "14px",
                willChange: "opacity, transform, filter",
              }}>
                Simplify AI Success.
              </h1>
              <div className="fade-in-section" style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "28px",
                lineHeight: "1.4",
                textAlign: "center",
                color: "#091917",
                margin: "14px auto 64px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0",
                willChange: "opacity, transform",
              }}>
                <p style={{ margin: 0, lineHeight: "1.4", color: "#091917" }}>
                  With the Tangram Generative + Agentic AI platform that
                </p>
                <p style={{ margin: 0, lineHeight: "1.4", color: "#091917" }}>
                  <span style={{ fontWeight: 600, color: "#091917" }}>Delivers 7X </span>
                  <span
                    style={{
                      color: colors[colorIndex],
                      transition: "color 0.3s ease",
                      fontWeight: 600,
                      display: "inline-block",
                      minWidth: "280px",
                      textAlign: "left",
                      willChange: "contents",
                    }}
                  >
                    {typedText}
                    {isTyping && (
                      <span
                        style={{
                          color: colors[colorIndex],
                          animation: "blink 1s step-end infinite",
                          marginLeft: "2px",
                          display: "inline-block",
                        }}
                      >
                        |
                      </span>
                    )}
                  </span>
                </p>
              </div>
            </div>
            <p className="mb-8 text-balance mx-auto fade-in-section" style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "24px",
              letterSpacing: "0px",
              textAlign: "center",
              verticalAlign: "middle",
              color: "#091917",
              marginTop: "4px",
              willChange: "opacity, transform",
            }}>
              
            </p>

            {/* AI Capabilities Marquee - Two Rows */}
            <div className="mx-auto max-w-5xl overflow-hidden fade-in-section" style={{ marginBottom: "64px", willChange: "opacity, transform" }}>
              {(() => {
                const capabilities = [
                  { icon: "circle", color: "#04ab8b", text: "Conversational AI & Advisory" },
                  { icon: "triangle", color: "#394fa1", text: "Document Passing & Analysis" },
                  { icon: "square", color: "#ffc334", text: "image processing" },
                  { icon: "circle", color: "#394fa1", text: "Video Processing" },
                  { icon: "triangle", color: "#ffc334", text: "Voice and Meeting" },
                  { icon: "circle", color: "#ed407b", text: "Data Analysis and Insights" },
                  { icon: "circle", color: "#974095", text: "Content generation" },
                  { icon: "triangle", color: "#394fa1", text: "Process Automation" },
                  { icon: "square", color: "#04ab8b", text: "Data Transformation" },
                ];
                
                const renderTag = (cap: typeof capabilities[0], key: string) => (
                  <div 
                    key={key} 
                    className="flex items-center whitespace-nowrap shrink-0"
                    style={{
                      height: "32px",
                      paddingTop: "5.5px",
                      paddingRight: "9px",
                      paddingBottom: "6.5px",
                      paddingLeft: "9px",
                      gap: "5px",
                      borderRadius: "999px",
                      borderWidth: "0.5px",
                      borderStyle: "solid",
                      borderColor: "#DEE2E6",
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    {cap.icon === "circle" && (
                      <div 
                        className="shrink-0 rounded-full" 
                        style={{ 
                          backgroundColor: cap.color,
                          width: "12px",
                          height: "12px",
                        }}
                      />
                    )}
                    {cap.icon === "triangle" && (
                      <div 
                        className="shrink-0" 
                        style={{ 
                          backgroundColor: cap.color,
                          width: "12px",
                          height: "12px",
                          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                        }}
                      />
                    )}
                    {cap.icon === "square" && (
                      <div 
                        className="shrink-0 rounded" 
                        style={{ 
                          backgroundColor: cap.color,
                          width: "12px",
                          height: "12px",
                        }}
                      />
                    )}
                    <span style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "20px",
                      color: "#344054",
                    }}>
                      {cap.text}
                    </span>
                  </div>
                );

                // Duplicate items multiple times for seamless scrolling
                const duplicatedCapabilities = [...capabilities, ...capabilities, ...capabilities];

                return (
                  <div className="flex flex-col gap-3">
                    {/* First Row - Moving left to right */}
                    <div className="overflow-hidden relative">
                      {/* Fade gradient on left */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
                        style={{
                          width: "100px",
                          background: "linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
                        }}
                      />
                      {/* Fade gradient on right */}
                      <div 
                        className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
                        style={{
                          width: "100px",
                          background: "linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
                        }}
                      />
                      <div className="flex gap-3 animate-scroll-tags" style={{ width: "fit-content", animationDuration: "300s" }}>
                        {duplicatedCapabilities.map((cap, idx) => renderTag(cap, `row1-${idx}`))}
                      </div>
                    </div>
                    {/* Second Row - Moving right to left (opposite direction) */}
                    <div className="overflow-hidden relative">
                      {/* Fade gradient on left */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none"
                        style={{
                          width: "100px",
                          background: "linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
                        }}
                      />
                      {/* Fade gradient on right */}
                      <div 
                        className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none"
                        style={{
                          width: "100px",
                          background: "linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
                        }}
                      />
                      <div className="flex gap-3 animate-scroll-tags-reverse" style={{ width: "fit-content", animationDuration: "300s" }}>
                        {duplicatedCapabilities.map((cap, idx) => renderTag(cap, `row2-${idx}`))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* See Tangram in Action Button */}
            <div className="flex justify-center scale-in">
              <Link
                href="/contact"
                className="border-gradient relative text-white rounded-[4px] px-[28px] transition-transform duration-300 hover:scale-105"
                style={{
                  display: "flex",
                  height: "48px",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  lineHeight: "normal",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                  position: "relative",
                  padding: "20px 28px",
                  boxShadow: "0 0 20px rgba(255, 109, 27, 0.3), 0 0 40px rgba(75, 138, 255, 0.2), 0 0 60px rgba(107, 95, 255, 0.1)",
                  "--gradient-angle": "0deg",
                  willChange: "transform",
                } as React.CSSProperties & { "--gradient-angle"?: string }}
              >
                {/* Text */}
                <span style={{ 
                  position: "relative", 
                  zIndex: 10,
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "normal",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}>
                  See Tangram in Action
                </span>
              </Link>
            </div>

          </div>
        </div>
      </section>
      

      {/* Stop Searching Section */}
      <section className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[70vh] flex items-center bg-white">
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
              AI success made easy.
            </h2>
            <p 
              className="mb-12 fade-in-section"
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
            <div className="relative mx-auto flex justify-center items-center" style={{ width: "100%", padding: "0 16px", maxWidth: "100vw" }}>
              <div className="flex flex-wrap md:flex-nowrap justify-center items-center relative" style={{ width: "100%", maxWidth: "calc(100vw - 32px)", gap: "clamp(16px, 4vw, 60px)" }}>
                {/* Card 1: Find Your Use Case */}
                <div className="relative z-10 flex-shrink-0 stagger-item">
                  <div 
                    className="process-card bg-white border flex flex-col justify-center items-center"
                    style={{
                      borderRadius: "24px",
                      borderWidth: "1px",
                      borderColor: "#E4E4E7",
                      borderStyle: "solid",
                      padding: "42px 24px",
                    }}
                  >
                    <div className="flex flex-col items-center text-center gap-8">
                      <div 
                        className="relative inline-flex items-center justify-center"
                        style={{
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        <Image 
                          src="/img/Group 1171280425.png" 
                          alt="Find Your Use Case" 
                          width={100} 
                          height={100}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "27px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "#111827",
                          }}
                        >
                          Find Your Use Case
                        </div>
                        <div 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "21px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "#6B7280",
                          }}
                        >
                          <p className="mb-0">Explore ready-made industry </p>
                          <p>use cases.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Connecting line */}
                  <div 
                    className="absolute top-1/2 right-0 translate-x-full translate-y-[-50%] z-0"
                    style={{
                      width: "59px",
                      height: "2px",
                      background: "linear-gradient(90deg, #4D8AFF 0%, transparent 100%)",
                    }}
                  />
                </div>

                {/* Card 2: Try an agent */}
                <div className="relative z-10 flex-shrink-0 stagger-item">
                  <div 
                    className="process-card bg-white border flex flex-col justify-center items-center"
                    style={{
                      borderRadius: "24px",
                      borderWidth: "1px",
                      borderColor: "#E4E4E7",
                      borderStyle: "solid",
                      padding: "42px 24px",
                    }}
                  >
                    <div className="flex flex-col items-center text-center gap-8">
                      <div 
                        className="relative inline-flex items-center justify-center"
                        style={{
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        <Image 
                          src="/img/Group 1171280425-1.png" 
                          alt="Try an agent" 
                          width={100} 
                          height={100}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "27px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "#111827",
                          }}
                        >
                          Try an agent
                        </div>
                        <div 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "21px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "#6B7280",
                          }}
                        >
                          <p className="mb-0">Test the right AI copilot for </p>
                          <p>your need.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Connecting line */}
                  <div 
                    className="absolute top-1/2 right-0 translate-x-full translate-y-[-50%] z-0"
                    style={{
                      width: "59px",
                      height: "2px",
                      background: "linear-gradient(90deg, #F5891F 0%, transparent 100%)",
                    }}
                  />
                </div>

                {/* Card 3: Pick your stack */}
                <div className="relative z-10 flex-shrink-0 stagger-item">
                  <div 
                    className="process-card bg-white border flex flex-col justify-center items-center"
                    style={{
                      borderRadius: "24px",
                      borderWidth: "1px",
                      borderColor: "#E4E4E7",
                      borderStyle: "solid",
                      padding: "42px 24px",
                    }}
                  >
                    <div className="flex flex-col items-center text-center gap-8">
                      <div 
                        className="relative inline-flex items-center justify-center"
                        style={{
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        <Image 
                          src="/img/Group 1171280426.png" 
                          alt="Pick your stack" 
                          width={100} 
                          height={100}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "27px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "#111827",
                          }}
                        >
                          Pick your stack
                        </div>
                        <div 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "21px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "#6B7280",
                          }}
                        >
                          <p className="mb-0">Choose your preferred </p>
                          <p>platform or model.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Connecting line */}
                  <div 
                    className="absolute top-1/2 right-0 translate-x-full translate-y-[-50%] z-0"
                    style={{
                      width: "59px",
                      height: "2px",
                      background: "linear-gradient(90deg, #F05283 0%, transparent 100%)",
                    }}
                  />
                </div>

                {/* Card 4: Launch your trial */}
                <div className="relative z-10 flex-shrink-0">
                  <div 
                    className="process-card bg-white border flex flex-col justify-center items-center"
                    style={{
                      borderRadius: "24px",
                      borderWidth: "1px",
                      borderColor: "#E4E4E7",
                      borderStyle: "solid",
                      padding: "42px 24px",
                    }}
                  >
                    <div className="flex flex-col items-center text-center gap-8">
                      <div 
                        className="relative inline-flex items-center justify-center"
                        style={{
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        <Image 
                          src="/img/Group 1171280435.png" 
                          alt="Launch your trial" 
                          width={100} 
                          height={100}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <div 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 500,
                            fontStyle: "normal",
                            fontSize: "16px",
                            lineHeight: "27px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "#111827",
                          }}
                        >
                          Launch your trial
                        </div>
                        <div 
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 400,
                            fontStyle: "normal",
                            fontSize: "14px",
                            lineHeight: "21px",
                            letterSpacing: "0%",
                            textAlign: "center",
                            color: "#6B7280",
                          }}
                        >
                          <p className="mb-0">Experience the future of</p>
                          <p> work in minutes.</p>
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
      {/* AI Catalyst Section */}
      <section 
        className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[80vh] flex items-center"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #E8F7F4 76.44%, #FAFAFA 100%)",
        }}
      >
        <div className="w-full px-8 md:px-12 lg:px-16">
            <h2 
              className="mb-0 text-balance"
              style={{
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "28px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "44.8px",
                letterSpacing: "-1.28px",
                background: "linear-gradient(270deg, #0082C0 0%, #3B60AF 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: "8px",
              }}
            >
                Accelerate Deployment of Your Own Agents using AI Catalyst
            </h2>
            
            {/* Subtitle */}
            <p className="mb-12 max-w-4xl mx-auto" style={{ textAlign: "center" }}>
              <span style={{
                color: "#111827",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "24px",
              }}>
                Reduce risks. Accelerate adoption. Your data, your guardrails, our agents, our models.{" "}
                </span>
              <span style={{
                color: "#111827",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "24px",
              }}>
              Worried about hallucinations? Or data security? Catalyst is designed to address them.
              </span>
            </p>

            <div className="grid gap-4 md:grid-cols-3 mb-12 max-w-6xl mx-auto px-4 md:px-8" style={{ gap: "clamp(8px, 2vw, 16px)" }}>
              {/* Labs Card */}
              <div 
                className="border bg-white mx-auto overflow-hidden"
                style={{
                  width: "100%",
                  maxWidth: "352px",
                  height: "auto",
                  minHeight: "460px",
                  paddingTop: "1px",
                  paddingRight: "1px",
                  paddingLeft: "1px",
                  paddingBottom: "1rem",
                  borderRadius: "4px",
                }}
              >
                <div 
                  style={{
                    width: "100%",
                    height: "341px",
                    paddingTop: "50px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, rgba(240, 82, 131, 0.21) 0%, #FFFFFF 100%)",
                  }}
                >
                  <div 
                    className="mb-8 flex items-center justify-center overflow-hidden mx-auto"
                    style={{
                      width: "286px",
                      height: "291px",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  >
                  <Image
                    src="/card1.png"
                      alt="Labs - Use case discovery & rapid prototyping"
                      width={286}
                      height={291}
                    className="object-contain"
                      style={{
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                  />
                </div>
                  <h3 
                    className="mb-2"
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "27px",
                    }}
                  >
                    Labs
                  </h3>
                  <p 
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#4B5563",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      alignSelf: "stretch",
                    }}
                  >
                    Use case discovery & rapid prototyping
                  </p>
                </div>
              </div>

              {/* Foundry Card */}
              <div 
                className="border bg-white mx-auto overflow-hidden"
                style={{
                  width: "100%",
                  maxWidth: "352px",
                  height: "auto",
                  minHeight: "460px",
                  paddingTop: "1px",
                  paddingRight: "1px",
                  paddingLeft: "1px",
                  paddingBottom: "1rem",
                  borderRadius: "4px",
                }}
              >
                <div 
                  style={{
                    width: "100%",
                    height: "341px",
                    paddingTop: "50px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, rgba(59, 96, 175, 0.21) 0%, #FFFFFF 100%)",
                  }}
                >
                  <div 
                    className="mb-8 flex items-center justify-center overflow-hidden mx-auto"
                    style={{
                      width: "286px",
                      height: "291px",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  >
                  <Image
                    src="/card2.png"
                      alt="Foundry - Pilots integrated with your systems"
                      width={286}
                      height={291}
                    className="object-contain"
                      style={{
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                  />
                </div>
                  <h3 
                    className="mb-2"
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "27px",
                    }}
                  >
                    Foundry
                  </h3>
                  <p 
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#4B5563",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      alignSelf: "stretch",
                    }}
                  >
                    Pilots integrated with your systems
                  </p>
                </div>
              </div>

              {/* Factory Card */}
              <div 
                className="border bg-white mx-auto overflow-hidden"
                style={{
                  width: "100%",
                  maxWidth: "352px",
                  height: "auto",
                  minHeight: "460px",
                  paddingTop: "1px",
                  paddingRight: "1px",
                  paddingLeft: "1px",
                  paddingBottom: "1rem",
                  borderRadius: "4px",
                }}
              >
                <div 
                  style={{
                    width: "100%",
                    height: "342px",
                    paddingTop: "50px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, rgba(255, 196, 50, 0.21) 0%, #FFFFFF 100%)",
                  }}
                >
                  <div 
                    className="mb-8 flex items-center justify-center overflow-hidden mx-auto"
                    style={{
                      width: "286px",
                      height: "291px",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  >
                  <Image
                    src="/card3.png"
                      alt="Factory - Governed, production-grade rollouts"
                      width={286}
                      height={291}
                    className="object-contain"
                      style={{
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                  />
                </div>
                  <h3 
                    className="mb-2"
                    style={{
                      color: "#111827",
                      fontFamily: "Poppins",
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "27px",
                    }}
                  >
                    Factory
                  </h3>
                  <p 
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "14px",
                      lineHeight: "21px",
                      letterSpacing: "0%",
                      verticalAlign: "middle",
                      color: "#4B5563",
                      textAlign: "left",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      alignSelf: "stretch",
                    }}
                  >
                    Governed, production-grade rollouts
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <p 
              className="mb-6 max-w-3xl mx-auto"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "16px",
                lineHeight: "24px",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#111827",
              }}
            >
              Delivered by cross-functional squads with GenAI, data, domain, and engineering expertise.
            </p>
            
            <div className="flex justify-center">
              <Button
                className="bg-black hover:bg-black/90"
                asChild
                style={{
                  width: "110px",
                  height: "44px",
                  borderRadius: "4px",
                  padding: "16px",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "14px",
                  lineHeight: "21px",
                  letterSpacing: "0%",
                  verticalAlign: "middle",
                  color: "#FFFFFF",
                }}
              >
                <Link href="/ai-catalyst">Learn More</Link>
              </Button>
            </div>
        </div>
      </section>

      {/* Why Choose Tangram Section */}
      <section 
        className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[80vh] flex items-center"
        style={{
          background: "linear-gradient(180deg, #FFFFFF 0%, #F7F0E8 76.44%, #FAFAFA 100%)",
        }}
      >
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <h2 
              className="mb-0 text-balance fade-in-blur"
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
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                alignSelf: "stretch",
                marginBottom: "16px",
              }}
            >
              Why Choose Tangram?
            </h2>
            
            {/* Subtitle */}
            <p className="mb-12 max-w-4xl mx-auto fade-in-section" style={{
              color: "#111827",
              textAlign: "center",
              fontFamily: "Poppins",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "24px",
            }}>
              The Problem isn't the Model. It's the Last Mile. Most AI platforms stop at "cool demos." Tangram is built to cut costs and create lift - in production.
            </p>

            <div className="grid gap-4 md:grid-cols-3 mb-12 max-w-6xl mx-auto px-4 md:px-8" style={{ gap: "clamp(8px, 2vw, 16px)" }}>
              {/* Card 1: API-native agents */}
              <div 
                className="relative border bg-white mx-auto overflow-hidden"
                    style={{
                      width: "100%",
                  maxWidth: "352px",
                  height: "auto",
                  minHeight: "460px",
                  paddingTop: "1px",
                  paddingRight: "1px",
                  paddingLeft: "1px",
                  paddingBottom: "1rem",
                  borderRadius: "4px",
                }}
              >
                <div 
                  style={{
                    width: "100%",
                    height: "341px",
                    paddingTop: "50px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, rgba(247, 103, 103, 0.21) 0%, #FFF 100%)",
                  }}
                >
                  <div 
                    className="mb-8 flex items-center justify-center overflow-hidden mx-auto"
                    style={{
                      width: "286px",
                      height: "291px",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  >
                    <Image
                      src="/card1.png"
                      alt="API-native agents integration"
                      width={286}
                      height={291}
                      className="object-contain"
                      style={{
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                    }}
                  />
                  </div>
                  <p 
                    style={{
                      color: "#111827",
                      textAlign: "center",
                      fontFamily: "Poppins",
                      fontSize: "17px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "25.5px",
                    }}
                  >
                    API-native agents that integrate with your stack — instantly
                  </p>
                </div>
              </div>

              {/* Card 2: Designed for BFSI, commerce & large enterprise ops */}
              <div 
                className="relative border bg-white mx-auto overflow-hidden"
                style={{
                  width: "100%",
                  maxWidth: "352px",
                  height: "auto",
                  minHeight: "460px",
                  paddingTop: "1px",
                  paddingRight: "1px",
                  paddingLeft: "1px",
                  paddingBottom: "1rem",
                  borderRadius: "4px",
                }}
              >

                <div 
                  style={{
                    width: "100%",
                    height: "341px",
                    paddingTop: "50px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, rgba(140, 103, 247, 0.21) 0%, #FFF 100%)",
                  }}
                >
                  <div 
                    className="mb-8 flex items-center justify-center overflow-hidden mx-auto"
                    style={{
                      width: "286px",
                      height: "291px",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  >
                    <Image
                      src="/Section4_2.png"
                      alt="BFSI, commerce & large enterprise ops"
                      width={286}
                      height={291}
                      className="object-contain"
                      style={{
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                    />
                    </div>
                  <p 
                    style={{
                      color: "#111827",
                      textAlign: "center",
                      fontFamily: "Poppins",
                      fontSize: "17px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "25.5px",
                    }}
                  >
                    Designed for large, complex operations
                  </p>
                </div>
                  </div>

              {/* Card 3: Proven to reduce GTM */}
              <div 
                className="relative border bg-white mx-auto overflow-hidden"
                style={{
                  width: "100%",
                  maxWidth: "352px",
                  height: "auto",
                  minHeight: "460px",
                  paddingTop: "1px",
                  paddingRight: "1px",
                  paddingLeft: "1px",
                  paddingBottom: "1rem",
                  borderRadius: "4px",
                }}
              >

                <div 
                  style={{
                    width: "100%",
                    height: "342px",
                    paddingTop: "50px",
                    paddingRight: "25px",
                    paddingLeft: "25px",
                    borderRadius: "4px",
                    background: "linear-gradient(180deg, rgba(10, 207, 131, 0.19) 0%, #FFF 100%)",
                  }}
                >
                  <div 
                    className="mb-8 flex items-center justify-center overflow-hidden mx-auto"
                    style={{
                      width: "286px",
                      height: "291px",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px",
                    }}
                  >
                    <Image
                      src="/Section4_3.png"
                      alt="Proven to reduce GTM and effort"
                      width={286}
                      height={291}
                      className="object-contain"
                      style={{
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                      }}
                    />
                    </div>
                  <p 
                    style={{
                      color: "#111827",
                      textAlign: "center",
                      fontFamily: "Poppins",
                      fontSize: "17px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "25.5px",
                    }}
                  >
                    Faster GTM. Lighter lift. Multipliers everywhere.
                  </p>
                </div>
                  </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get with Tangram.ai Section */}
      <section className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[80vh] flex items-start bg-white">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="mb-4 text-balance"
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
                  marginBottom: "16px",
                }}
              >
                What You Get with Tangram.ai?
              </h2>
              <p 
                className="mb-20"
                style={{
                  color: "#091917",
                  textAlign: "center",
                  fontFamily: "Poppins",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "normal",
                }}
              >
                Tangram isn't a tool - it's a platform for GenAI adoption. With Tangram, enterprises unlock
              </p>
                </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Text Content */}
              <div className="flex flex-col">
                {/* Benefits List */}
                <div 
                  className="flex flex-col"
                  style={{
                    height: "350px",
                    justifyContent: "space-between",
                    gap: "clamp(8px, 1vw, 30px)",
                  }}
                >
                  {benefitsData.map((item) => {
                    const isExpanded = expandedItem === item.id;
                    return (
                      <div
                        key={item.id}
                        style={{
                          width: "520px",
                          maxWidth: "100%",
                          height: "127px",
                          display: "flex",
                          alignItems: "flex-start",
                          transform: "translateZ(0)",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        {isExpanded ? (
                          <div
                            className="border cursor-pointer"
                            style={{
                              width: "100%",
                              height: "100%",
                              paddingTop: "26px",
                              paddingRight: "24px",
                              paddingBottom: "24px",
                              paddingLeft: "26px",
                              borderRadius: "22px",
                              backgroundColor: "#FAFAFA",
                              boxSizing: "border-box",
                              transition: "background-color 0.3s ease-in-out, border-color 0.3s ease-in-out",
                              willChange: "background-color, border-color",
                            }}
                            onClick={() => setExpandedItem(item.id)}
                          >
                            <div className="flex items-start gap-3 h-full">
                              <span 
                                style={{
                                  color: "#FF9231",
                                  fontFamily: "Poppins",
                                  fontSize: "18px",
                                  fontStyle: "normal",
                                  fontWeight: 500,
                                  lineHeight: "21.6px",
                                }}
                              >
                                {item.number}
                              </span>
                              <div className="flex-1">
                                <h3 
                                  className="mb-2"
                                  style={{
                                    color: "#111827",
                                    fontFamily: "Poppins",
                                    fontSize: "18px",
                                    fontStyle: "normal",
                                    fontWeight: 500,
                                    lineHeight: "normal",
                                  }}
                                >
                                  {item.title}
                                </h3>
                                <p 
                                  style={{
                                    color: "#374151",
                                    fontFamily: "Poppins",
                                    fontSize: "14px",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    lineHeight: "21px",
                                  }}
                                >
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="flex items-start gap-3 cursor-pointer hover:opacity-80"
                            style={{
                              width: "100%",
                              height: "100%",
                              paddingTop: "26px",
                              paddingLeft: "26px",
                              paddingRight: "24px",
                              paddingBottom: "24px",
                              boxSizing: "border-box",
                              transition: "opacity 0.2s ease-in-out",
                              willChange: "opacity",
                            }}
                            onClick={() => setExpandedItem(item.id)}
                          >
                            <span 
                              style={{
                                color: "#6B7280",
                                fontFamily: "Poppins",
                                fontSize: "18px",
                                fontStyle: "normal",
                                fontWeight: 500,
                                lineHeight: "21.6px",
                              }}
                            >
                              {item.number}
                            </span>
                            <h3 
                              style={{
                                color: "#6B7280",
                                fontFamily: "Poppins",
                                fontSize: "18px",
                                fontStyle: "normal",
                                fontWeight: 500,
                                lineHeight: "21.6px",
                              }}
                            >
                              {item.title}
                            </h3>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                  </div>

              {/* Right Side - Diagram Image */}
              <div className="flex items-start justify-center">
                <div className="relative">
                  <Image
                    src={currentItem.image}
                    alt={`Tangram.ai - ${currentItem.title}`}
                    width={560}
                    height={527}
                    className="object-contain transition-opacity duration-300"
                    style={{
                      width: "560px",
                      height: "527px",
                    }}
                  />
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Tangram Is Already in Production Section */}
      <section className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[80vh] flex items-center" style={{ background: "#F9FAFB" }}>
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
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
                  marginBottom: "16px",
                  background: "linear-gradient(270deg, #3B60AF 0%, #0082C0 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Tangram Is Already in Production
              </h2>
              <p className="fade-in-section" style={{
                color: "#111827",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "24px",
              }}>
                This isn't a beta. Tangram is live, running, and delivering impact inside large enterprises.
              </p>
                </div>

            {/* Bento Grid of Cards */}
            <div className="flex flex-col gap-4 fade-in-section" style={{ maxWidth: "1200px", margin: "0 auto", paddingTop: "32px" }}>
              {/* Row 1 */}
              <div className="flex flex-col md:flex-row gap-5 items-center" style={{ gap: "20px" }}>
                {/* Card 1: Enterprise POCs */}
                <div 
                  className="relative bg-white overflow-hidden flex flex-col stagger-item"
                  style={{
                    width: "626px",
                    maxWidth: "100%",
                    height: "400px",
                    borderRadius: "24px",
                    border: "1px solid #E4E4E7",
                    boxSizing: "border-box",
                    transform: "translateZ(0)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", padding: "1px" }}>
                    <Image
                      src="/image_all.png"
                      alt="Company logos - mozark, ADIB, gradiant"
                      width={624}
                      height={300}
                      className="object-contain"
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "300px",
                      }}
                    />
                  </div>
                  <div style={{ padding: "0 24px 0 32px", flex: "1 0 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p 
                      style={{
                        color: "#111827",
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "24px",
                      }}
                    >
                      LIVE in Production and 12+ POCs in flight across banking, Retail, commerce, and operations.
                    </p>
                  </div>
                </div>

                {/* Card 2: CX Personalization */}
                <div 
                  className="relative bg-white overflow-hidden flex flex-col stagger-item"
                  style={{
                    width: "453px",
                    maxWidth: "100%",
                    height: "400px",
                    borderRadius: "24px",
                    border: "1px solid #E4E4E7",
                    boxSizing: "border-box",
                    transform: "translateZ(0)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", padding: "50px" }}>
                    <Image
                      src="/Section_6_2.png"
                      alt="Personalisation chart"
                      width={400}
                      height={300}
                      className="object-contain"
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "300px",
                      }}
                    />
                  </div>
                  <div style={{ padding: "10px 24px 0 32px", flex: "1 0 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p 
                      style={{
                        color: "#111827",
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "24px",
                      }}
                    >
                      15–22% uplift in customer experience through personalization
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col md:flex-row gap-5 items-center" style={{ gap: "20px" }}>
                {/* Card 3: Onboarding */}
                <div 
                  className="relative bg-white overflow-hidden flex flex-col stagger-item"
                  style={{
                    width: "540px",
                    maxWidth: "100%",
                    height: "380px",
                    borderRadius: "24px",
                    border: "1px solid #E4E4E7",
                    boxSizing: "border-box",
                    transform: "translateZ(0)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", padding: "50px" }}>
                    <Image
                      src="/Section_6_3.png"
                      alt="Onboarding 40%"
                      width={400}
                      height={300}
                      className="object-contain"
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "300px",
                      }}
                    />
                  </div>
                  <div style={{ padding: "10px 24px 0 32px", flex: "1 0 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p 
                      style={{
                        color: "#111827",
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "24px",
                      }}
                    >
                      40% lower drop-offs through agent-driven onboarding
                    </p>
                  </div>
                </div>

                {/* Card 4: Manual Operations */}
                <div 
                  className="relative bg-white overflow-hidden flex flex-col stagger-item"
                  style={{
                    width: "540px",
                    maxWidth: "100%",
                    height: "380px",
                    borderRadius: "24px",
                    border: "1px solid #E4E4E7",
                    boxSizing: "border-box",
                    transform: "translateZ(0)",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", padding: "50px 50px 0" }}>
                    <Image
                      src="/Section_6_4.png"
                      alt="Manual Operation 60%"
                      width={400}
                      height={300}
                      className="object-contain"
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "300px",
                      }}
                    />
                  </div>
                  <div style={{ padding: "10px 24px 0 32px", flex: "1 0 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <p 
                      style={{
                        color: "#111827",
                        fontFamily: "Poppins",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "24px",
                      }}
                    >
                      60% reduction in manual effort with chained agents
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Built for Real-World Load - Minimal */}
            <div className="mt-16 pt-12 border-t border-gray-200">
              <div className="text-center mb-8">
                <h3 
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "24px",
                    lineHeight: "32px",
                    letterSpacing: "-0.48px",
                    textAlign: "center",
                    color: "#111827",
                    marginBottom: "12px",
                  }}
                >
                  Built for Real-World Load
                </h3>
                <p 
                  className="max-w-2xl mx-auto"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    lineHeight: "24px",
                    textAlign: "center",
                    color: "#6B7280",
                  }}
                >
                  These aren't sandbox experiments — they're high-volume journeys, complex workflows, and mission-critical operations now running on Tangram.
                </p>
            </div>

              {/* Minimal Feature Tags */}
              <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                <span 
                  className="inline-flex items-center px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, rgba(0, 130, 192, 0.1) 0%, rgba(59, 96, 175, 0.1) 100%)",
                    border: "1px solid rgba(0, 130, 192, 0.2)",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#0082C0",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(0, 130, 192, 0.15) 0%, rgba(59, 96, 175, 0.15) 100%)";
                    e.currentTarget.style.borderColor = "rgba(0, 130, 192, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(0, 130, 192, 0.1) 0%, rgba(59, 96, 175, 0.1) 100%)";
                    e.currentTarget.style.borderColor = "rgba(0, 130, 192, 0.2)";
                  }}
                >
                  High-Volume Journeys
                </span>
                <span 
                  className="inline-flex items-center px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, rgba(59, 96, 175, 0.1) 0%, rgba(94, 4, 210, 0.1) 100%)",
                    border: "1px solid rgba(59, 96, 175, 0.2)",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#3B60AF",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(59, 96, 175, 0.15) 0%, rgba(94, 4, 210, 0.15) 100%)";
                    e.currentTarget.style.borderColor = "rgba(59, 96, 175, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(59, 96, 175, 0.1) 0%, rgba(94, 4, 210, 0.1) 100%)";
                    e.currentTarget.style.borderColor = "rgba(59, 96, 175, 0.2)";
                  }}
                >
                  Complex Workflows
                </span>
                <span 
                  className="inline-flex items-center px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, rgba(94, 4, 210, 0.1) 0%, rgba(0, 130, 192, 0.1) 100%)",
                    border: "1px solid rgba(94, 4, 210, 0.2)",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#5E04D2",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(94, 4, 210, 0.15) 0%, rgba(0, 130, 192, 0.15) 100%)";
                    e.currentTarget.style.borderColor = "rgba(94, 4, 210, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg, rgba(94, 4, 210, 0.1) 0%, rgba(0, 130, 192, 0.1) 100%)";
                    e.currentTarget.style.borderColor = "rgba(94, 4, 210, 0.2)";
                  }}
                >
                  Mission-Critical Operations
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="fade-in-section py-16 md:py-20 lg:py-24 min-h-[70vh] flex items-center">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="text-center">
            <div>
              <h2 
                className="max-w-xl mx-auto whitespace-nowrap"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontStyle: "normal",
                  fontSize: "32px",
                  lineHeight: "normal",
                  textAlign: "center",
                  background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  marginBottom: "8px",
                }}
              >
                Accelerate growth with Tangram.ai
              </h2>
              <p 
                className="mb-18 max-w-4xl md:max-w-5xl w-full px-4 sm:px-6 mx-auto fade-in-section"
                style={{
                  color: "#111827",
                  textAlign: "center",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 400,
                  lineHeight: "24px",
                }}
              >
                Our Partners are at the forefront of Enterprise AI transformation, and their success stories speak volumes. By partnering with Tangram.ai, they have helped businesses like yours reimagine how work gets done, service is delivered, and processes are automated, delivering real business value with AI.
              </p>
            </div>

            <div style={{ marginTop: "64px" }}>
              <div className="flex flex-col md:flex-row md:justify-center md:items-start gap-6 md:gap-12">
                {/* Vendors Card */}
              <div 
                className="flex flex-col justify-between text-left relative"
                style={{
                  width: "472px",
                  height: "275.46px",
                  paddingTop: "32.68px",
                  paddingRight: "24.51px",
                  paddingBottom: "32.68px",
                  paddingLeft: "24.51px",
                  gap: "32.7px",
                  backgroundImage: "url('/img/Acceleratecardbg.svg')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                  border: "none",
                  boxShadow: "none",
                  borderRadius: "0",
                }}
              >
                <div>
                  <span 
                    className="inline-block mb-3"
                    style={{
                      width: "188.68px",
                      height: "30.61px",
                      paddingTop: "7.65px",
                      paddingRight: "16.34px",
                      paddingBottom: "7.96px",
                      paddingLeft: "16.34px",
                      borderRadius: "2px",
                      backgroundColor: "#FFFFFF",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "100%",
                      letterSpacing: "0px",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                      color: "#181818",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Join as an ISV partner
                  </span>
                  <h3 
                    className="mb-2"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "24.5px",
                      lineHeight: "31.86px",
                      letterSpacing: "-0.49px",
                      verticalAlign: "middle",
                      color: "#181818",
                    }}
                  >
                    Tangram.ai ISV
                  </h3>
                  <p 
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "14.3px",
                      lineHeight: "21.45px",
                      letterSpacing: "-0.33px",
                      verticalAlign: "middle",
                      color: "#65717C",
                    }}
                  >
                    Our partners are certified Tangram.ai channel partners, technology partners, or independent software vendors (ISV).
                  </p>
                </div>
                <div className="flex justify-start">
                  <button 
                    onClick={() => !isAuthenticated && openModal("auth", { mode: "signup", role: "isv" })}
                    disabled={isAuthenticated}
                    style={{
                      height: "36.61px",
                      paddingTop: "10.8px",
                      paddingRight: "14.07px",
                      paddingBottom: "10.8px",
                      paddingLeft: "14.07px",
                      borderRadius: "4.09px",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: "#181818",
                      backgroundColor: "#181818",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "100%",
                      letterSpacing: "0.5px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      cursor: isAuthenticated ? "not-allowed" : "pointer",
                      whiteSpace: "nowrap",
                      opacity: 1,
                    }}
                  >
                    BECOME A ISV
                  </button>
                </div>
              </div>

              {/* Reseller Card */}
              <div 
                className="flex flex-col justify-between text-left relative"
                style={{
                  width: "472px",
                  height: "275.46px",
                  paddingTop: "32.68px",
                  paddingRight: "24.51px",
                  paddingBottom: "32.68px",
                  paddingLeft: "24.51px",
                  gap: "32.7px",
                  backgroundImage: "url('/img/Acceleratecardbg1.svg')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                  border: "none",
                  boxShadow: "none",
                  borderRadius: "0",
                }}
              >
                <div>
                  <span 
                    className="inline-block mb-3"
                    style={{
                      width: "212px",
                      height: "31px",
                      paddingTop: "7.65px",
                      paddingRight: "16px",
                      paddingBottom: "7.96px",
                      paddingLeft: "16px",
                      borderRadius: "2px",
                      backgroundColor: "#FFFFFF",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "100%",
                      letterSpacing: "0px",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                      color: "#181818",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Join as a Reseller Partner
                  </span>
                  <h3 
                    className="mb-2"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "24.5px",
                      lineHeight: "31.86px",
                      letterSpacing: "-0.49px",
                      verticalAlign: "middle",
                      color: "#181818",
                    }}
                  >
                    Tangram.ai Reseller
                  </h3>
                  <p 
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "14.3px",
                      lineHeight: "21.45px",
                      letterSpacing: "-0.33px",
                      verticalAlign: "middle",
                      color: "#65717C",
                    }}
                  >
                    Our Reseller program allows you to access Tangram.ai resources, support and professional services for your projects.
                  </p>
                </div>
                <div className="flex justify-start">
                  <button 
                    onClick={() => !isAuthenticated && openModal("auth", { mode: "signup", role: "reseller" })}
                    disabled={isAuthenticated}
                    style={{
                      height: "36.61px",
                      paddingTop: "10.8px",
                      paddingRight: "14.07px",
                      paddingBottom: "10.8px",
                      paddingLeft: "14.07px",
                      borderRadius: "4.09px",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: "#181818",
                      backgroundColor: "#181818",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "12px",
                      lineHeight: "100%",
                      letterSpacing: "0.5px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                      color: "#FFFFFF",
                      cursor: isAuthenticated ? "not-allowed" : "pointer",
                      whiteSpace: "nowrap",
                      opacity: 1,
                    }}
                  >
                    BECOME A RESELLER
                  </button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Turn GenAI From Cost Center to Value Engine Section */}
      <div className="fade-in-section">
        <HeroCta />
      </div>
    </div>
  );
}

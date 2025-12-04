"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import Image from "next/image"
import { useModal } from "../../hooks/use-modal"
import { useAuthStore } from "../../lib/store/auth.store"
import { useRouter } from "next/navigation"
import { Target, Globe, TrendingUp, Percent, DollarSign, Monitor, Headphones, ChevronLeft, ChevronRight, Plus, X } from "lucide-react"

export default function ResellerPage() {
  const { openModal } = useModal()
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const totalTestimonials = 3

  // Get the actual testimonial index (0-2) for display purposes
  const actualTestimonialIndex = currentTestimonial >= totalTestimonials 
    ? currentTestimonial - totalTestimonials 
    : currentTestimonial

  // Reset progress when testimonial actually changes
  useEffect(() => {
    setProgress(0)
  }, [actualTestimonialIndex])

  // Auto-scroll functionality with progress timer
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0
        }
        return prev + 2 // Increment by 2% every 100ms (5 seconds total)
      })
    }, 100) // Update every 100ms for smooth animation

    const slideInterval = setInterval(() => {
      setIsTransitioning(true)
      setCurrentTestimonial((prev) => {
        const next = prev + 1
        // If we've reached the duplicate set, jump back to the start seamlessly
        if (next >= totalTestimonials) {
          setTimeout(() => {
            setIsTransitioning(false)
            setCurrentTestimonial(0)
            setTimeout(() => {
              setIsTransitioning(true)
            }, 10)
          }, 600)
          return totalTestimonials
        }
        return next
      })
    }, 5000) // Change slide every 5 seconds

    return () => {
      clearInterval(progressInterval)
      clearInterval(slideInterval)
    }
  }, [totalTestimonials])

  const goToPrevious = () => {
    setIsTransitioning(true)
    setProgress(0) // Reset progress when manually navigating
    setCurrentTestimonial((prev) => {
      if (prev === 0) {
        // Jump to the end of duplicate set for seamless loop
        setTimeout(() => {
          setIsTransitioning(false)
          setCurrentTestimonial(totalTestimonials)
          setTimeout(() => {
            setIsTransitioning(true)
          }, 10)
        }, 600)
        return totalTestimonials * 2
      }
      return prev - 1
    })
  }

  const goToNext = () => {
    setIsTransitioning(true)
    setProgress(0) // Reset progress when manually navigating
    setCurrentTestimonial((prev) => {
      const next = prev + 1
      // If we've reached the duplicate set, jump back to the start seamlessly
      if (next >= totalTestimonials * 2) {
        setTimeout(() => {
          setIsTransitioning(false)
          setCurrentTestimonial(0)
          setTimeout(() => {
            setIsTransitioning(true)
          }, 10)
        }, 600)
        return totalTestimonials * 2
      }
      return next
    })
  }

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
  }, [])

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
  }, [])

  const handleResellerLogin = () => {
    if (isAuthenticated && user?.role === 'reseller') {
      router.push('/dashboard')
    } else {
      openModal("auth", { mode: "login", role: "reseller" })
    }
  }

  return (
    <div className="min-h-screen" style={{ scrollBehavior: "smooth" }}>
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden min-h-[90vh]" style={{ transform: "translateZ(0)", willChange: "scroll-position" }}>
        {/* Top radial gradient banner */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: 0,
            left: 0,
            background: "radial-gradient(100% 100% at 50% 0%, #DDFFED 0%, #FFFFFF 100%)",
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
              backgroundColor: "#A9E9C8",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "140%",
              letterSpacing: "0%",
              textAlign: "center",
              color: "#06552C",
              marginBottom: "14px",
            }}
          >
            Reseller
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
            Drive new revenue with<br />
            AI offerings from 1000+ ISVs
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
            }}
          >
            Join Tangram.ai Enterprise Agents Reseller Program Accelerator
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
            }}
          >
            Start referring or integrating agents from Tangram.ai store with your clients today to unlock new revenue opportunities, accelerate growth, and deliver intelligent AI solutions at scale.
          </p>

          {/* Buttons */}
          <div className="flex justify-center scale-in">
            <button
              onClick={handleResellerLogin}
              className="border-gradient relative text-white rounded-[4px] px-[28px] cursor-pointer transition-all hover:opacity-90"
              style={{
                display: "flex",
                height: "48px",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
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
                border: "none",
                outline: "none",
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
                Become a Reseller Partner
              </span>
            </button>
          </div>

          {/* Logo Scroll Section */}
          <div className="mt-24 md:mt-32 w-full overflow-hidden fade-in-section">
            <div className="overflow-hidden relative" style={{ transform: "translateZ(0)", willChange: "transform" }}>
              <div 
                className="flex items-center animate-scroll-tags" 
                style={{ 
                  width: "fit-content",
                  animationDuration: "90s",
                  gap: "4px",
                }}
              >
                {/* Logo array - Container.png, Container-1.png through Container-8.png */}
                {(() => {
                  const logos = [
                    { name: "Container", index: "" },
                    { name: "Container-1", index: "-1" },
                    { name: "Container-2", index: "-2" },
                    { name: "Container-3", index: "-3" },
                    { name: "Container-4", index: "-4" },
                    { name: "Container-5", index: "-5" },
                    { name: "Container-6", index: "-6" },
                    { name: "Container-7", index: "-7" },
                    { name: "Container-8", index: "-8" },
                  ];

                  // Duplicate logos 4 times for seamless scrolling
                  const duplicatedLogos = [...logos, ...logos, ...logos, ...logos];

                  return duplicatedLogos.map((logo, idx) => {
                    const grayLogo = `/img/Logo/gray/Container${logo.index}.png`;
                    const colorLogo = `/img/Logo/Container${logo.index}.png`;

                    return (
                      <div 
                        key={`logo-${idx}`}
                        className="flex items-center justify-center shrink-0 group relative"
                        style={{ 
                          height: "64px",
                          minWidth: "150px",
                          padding: "0 20px",
                        }}
                      >
                        {/* Grayscale logo (default) */}
                        <img
                          src={grayLogo}
                          alt={logo.name}
                          className="object-contain transition-opacity duration-300 group-hover:opacity-0"
                          style={{
                            height: "64px",
                            width: "auto",
                            maxWidth: "200px",
                            filter: "grayscale(100%)",
                          }}
                          onError={(e) => {
                            // Hide if image doesn't exist
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        {/* Color logo (on hover) */}
                        <img
                          src={colorLogo}
                          alt={`${logo.name} color`}
                          className="object-contain absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{ 
                            height: "64px",
                            width: "auto",
                            maxWidth: "200px",
                            margin: "0 auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onError={(e) => {
                            // Hide if image doesn't exist
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Build the Future Together Section */}
      <section className="w-full px-8 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24 bg-white" style={{ transform: "translateZ(0)", contain: "layout style paint" }}>
        <div className="max-w-[1209px] mx-auto">
          {/* Heading and Description */}
          <div className="flex flex-col gap-3 items-center text-center mb-16 md:mb-18">
            <h2 
              className="fade-in-blur"
              style={{
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "32px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
                background: "linear-gradient(90deg, #2D8E0C 0%, #77C402 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Are You a Good Fit?
            </h2>
            <p 
              className="fade-in-section"
              style={{
                color: "var(--Interface-Color-Primary-900, #091917)",
                textAlign: "center",
                fontFamily: "Poppins",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              You're a good fit for the Tangram.ai Reseller Program if you help clients adopt AI-driven solutions and want to expand your portfolio with enterprise-ready intelligence.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="flex flex-col md:flex-row gap-2 items-stretch justify-center" style={{ gap: "0px", alignItems: "stretch" }}>
            {/* Card 1: AI Consultants & Solution Providers */}
            <div 
              className="flex flex-col gap-6 p-6 w-full md:w-[386.72px] relative bg-white card-divider stagger-item"
              style={{
                padding: "24.51px",
                gap: "24.49px",
                backgroundColor: "#FFFFFF",
                position: "relative",
              }}
            >
              {/* Icon */}
              <div 
                className="bg-[#181818] rounded-[8.17px] flex items-center justify-center shrink-0 relative z-10"
                style={{
                  width: "49.02px",
                  height: "49.02px",
                }}
              >
                <Target className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <div 
                className="flex flex-col flex-1 relative z-10"
                style={{
                  gap: "7.935px",
                }}
              >
                <h3 
                  className="fade-in-blur"
                  style={{
                    color: "#181818",
                    fontFamily: "Poppins",
                    fontSize: "19px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "150%",
                    letterSpacing: "-0.4px",
                  }}
                >
                  AI Consultants & Solution Providers
                </h3>
                <p 
                  style={{
                    color: "#65717C",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "150%",
                    letterSpacing: "-0.4px",
                  }}
                >
                  Work with our partner ecosystem and access industry expertise and resources to help you achieve exceptional results.
                </p>
              </div>
            </div>

            {/* Card 2: IT Consultants & Service Providers */}
            <div 
              className="flex flex-col gap-6 p-6 w-full md:w-[386.72px] relative bg-white card-divider stagger-item"
              style={{
                padding: "24.51px",
                gap: "24.49px",
                backgroundColor: "#FFFFFF",
                position: "relative",
              }}
            >
              {/* Icon */}
              <div 
                className="bg-[#181818] rounded-[8.17px] flex items-center justify-center shrink-0 relative z-10"
                style={{
                  width: "49.02px",
                  height: "49.02px",
                }}
              >
                <Globe className="w-6 h-6 text-white" />
              </div>
             
              {/* Content */}
              <div 
                className="flex flex-col flex-1 relative z-10"
                style={{
                  gap: "7.935px",
                }}
              >
                <h3 
                  className="fade-in-blur"
                  style={{
                    color: "#181818",
                    fontFamily: "Poppins",
                    fontSize: "19px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "150%",
                    letterSpacing: "-0.4px",
                  }}
                >
                  IT Consultants & Service Providers
                </h3>
                <p 
                  style={{
                    color: "#65717C",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "150%",
                    letterSpacing: "-0.4px",
                  }}
                >
                  Enter new markets while accelerating your business's international reach with global partners or local experts.
                </p>
              </div>
            </div>

            {/* Card 3: AI Enterprise and GTM Agencies */}
            <div 
              className="flex flex-col gap-6 p-6 w-full md:w-[386.72px] relative bg-white stagger-item"
              style={{
                padding: "24.51px",
                gap: "24.49px",
                backgroundColor: "#FFFFFF",
                position: "relative",
              }}
            >
              {/* Icon */}
              <div 
                className="bg-[#181818] rounded-[8.17px] flex items-center justify-center shrink-0 relative z-10"
                style={{
                  width: "49.02px",
                  height: "49.02px",
                }}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <div 
                className="flex flex-col flex-1 relative z-10"
                style={{
                  gap: "7.935px",
                }}
              >
                <h3 
                  className="fade-in-blur"
                  style={{
                    color: "#181818",
                    fontFamily: "Poppins",
                    fontSize: "19px",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "150%",
                    letterSpacing: "-0.4px",
                  }}
                >
                  AI Enterprise and GTM Agencies
                </h3>
                <p 
                  style={{
                    color: "#65717C",
                    fontFamily: "Poppins",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "150%",
                    letterSpacing: "-0.4px",
                  }}
                >
                  Reduce time to deployment and accelerate projects with pre-configured, industry specific solutions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits of Reseller Partnership */}
      <section 
        className="relative"
        style={{
          width: "100%",
          height: "698px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #E8F6F7 76.44%, #FAFAFA 100%)",
          margin: "0 auto",
          transform: "translateZ(0)",
          contain: "layout style paint",
          willChange: "scroll-position",
        }}
      >
        <div className="w-full h-full px-8 md:px-12 lg:px-16 flex items-center justify-center">
          <div className="flex flex-col md:flex-row gap-12 items-start w-full max-w-6xl">
            {/* Left side - Text content */}
            <div className="flex-1 md:w-1/2">
              <h2 
                className="mb-6 fade-in-blur"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontStyle: "normal",
                  fontSize: "32px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  verticalAlign: "middle",
                  background: "linear-gradient(90deg, #02341A 0%, #006E84 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                Benefits of Reseller Partnership
              </h2>
              <p 
                className="fade-in-section"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "18px",
                  lineHeight: "150%",
                  letterSpacing: "0px",
                  color: "#374151",
                }}
              >
                Partnering with Tangram.ai unlocks new revenue streams, faster deal cycles, and access to enterprise-ready AI solutions. Resellers gain co-selling support, marketing enablement, and dedicated partner success resources — empowering them to deliver intelligent, scalable value to every client.
              </p>
            </div>

            {/* Right side - Benefits cards in 2x2 grid */}
            <div className="flex-1 md:w-1/2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1: Up to 40% off */}
                <div 
                  className="relative rounded-lg overflow-hidden w-full md:w-[258px] h-[120px] md:h-[151px] stagger-item transition-all duration-300 hover:scale-105"
                  style={{ willChange: "transform" }}
                >
                  {/* Background Mask Image */}
                  <div
                    className="absolute inset-0 pointer-events-none w-full h-full"
                    style={{
                      zIndex: 0,
                    }}
                  >
                    <Image
                      src="/Mask group.png"
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                  
                  {/* Card Content */}
                  <div 
                    className="relative bg-white rounded-lg p-3 md:p-6 flex flex-col items-start text-left"
                    style={{
                      border: "1px dashed #D1D5DB",
                      zIndex: 1,
                    }}
                  >
                    <Image 
                      src="/percentage-round.png" 
                      alt="Percentage" 
                      width={24} 
                      height={24}
                      className="object-contain mb-2 md:mb-4 w-5 h-5 md:w-6 md:h-6"
                      unoptimized
                    />
                    <p 
                      className="text-xs md:text-sm"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        lineHeight: "140%",
                        color: "#111827",
                      }}
                    >
                      Up to 40% off Annual Plans for Clients
                    </p>
                  </div>
                </div>

                {/* Card 2: Rev-Share Model */}
                <div 
                  className="relative rounded-lg overflow-hidden w-full md:w-[258px] h-[120px] md:h-[151px] md:mt-[25px] stagger-item transition-all duration-300 hover:scale-105"
                  style={{ willChange: "transform" }}
                >
                  {/* Background Mask Image */}
                  <div
                    className="absolute inset-0 pointer-events-none w-full h-full"
                    style={{
                      zIndex: 0,
                    }}
                  >
                    <Image
                      src="/Mask group.png"
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                  
                  {/* Card Content */}
                  <div 
                    className="relative bg-white rounded-lg p-3 md:p-6 flex flex-col items-start text-left"
                    style={{
                      border: "1px dashed #D1D5DB",
                      zIndex: 1,
                    }}
                  >
                    <Image 
                      src="/coins.png" 
                      alt="Coins" 
                      width={24} 
                      height={24}
                      className="object-contain mb-2 md:mb-4 w-5 h-5 md:w-6 md:h-6"
                      unoptimized
                    />
                    <p 
                      className="text-xs md:text-sm"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        lineHeight: "140%",
                        color: "#111827",
                      }}
                    >
                      Rev-Share Model on Closed Deals
                    </p>
                  </div>
                </div>

                {/* Card 3: Enterprise Demo Account */}
                <div 
                  className="relative rounded-lg overflow-hidden w-full md:w-[258px] h-[120px] md:h-[151px] stagger-item transition-all duration-300 hover:scale-105"
                  style={{ willChange: "transform" }}
                >
                  {/* Background Mask Image */}
                  <div
                    className="absolute inset-0 pointer-events-none w-full h-full"
                    style={{
                      zIndex: 0,
                    }}
                  >
                    <Image
                      src="/Mask group.png"
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                  
                  {/* Card Content */}
                  <div 
                    className="relative bg-white rounded-lg p-3 md:p-6 flex flex-col items-start text-left"
                    style={{
                      border: "1px dashed #D1D5DB",
                      zIndex: 1,
                    }}
                  >
                    <Image 
                      src="/fingerprint-circled-lock.png" 
                      alt="Fingerprint Lock" 
                      width={24} 
                      height={24}
                      className="object-contain mb-2 md:mb-4 w-5 h-5 md:w-6 md:h-6"
                      unoptimized
                    />
                    <p 
                      className="text-xs md:text-sm"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        lineHeight: "140%",
                        color: "#111827",
                      }}
                    >
                      Access to a Enterprise - level Demo Account
                    </p>
                  </div>
                </div>

                {/* Card 4: Dedicated Support */}
                <div 
                  className="relative rounded-lg overflow-hidden w-full md:w-[258px] h-[120px] md:h-[151px] md:mt-[25px] stagger-item transition-all duration-300 hover:scale-105"
                  style={{ willChange: "transform" }}
                >
                  {/* Background Mask Image */}
                  <div
                    className="absolute inset-0 pointer-events-none w-full h-full"
                    style={{
                      zIndex: 0,
                    }}
                  >
                    <Image
                      src="/Mask group.png"
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                  
                  {/* Card Content */}
                  <div 
                    className="relative bg-white rounded-lg p-3 md:p-6 flex flex-col items-start text-left"
                    style={{
                      border: "1px dashed #D1D5DB",
                      zIndex: 1,
                    }}
                  >
                    <Image 
                      src="/headset-help.png" 
                      alt="Headset Help" 
                      width={24} 
                      height={24}
                      className="object-contain mb-2 md:mb-4 w-5 h-5 md:w-6 md:h-6"
                      unoptimized
                    />
                    <p 
                      className="text-xs md:text-sm"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        lineHeight: "140%",
                        color: "#111827",
                      }}
                    >
                      Dedicated Support and Co-Selling
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reseller's Testimonials Section */}
      <section className="w-full px-8 md:px-12 lg:px-16 pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-20 lg:pb-24" style={{ backgroundColor: "#F9FAFB", transform: "translateZ(0)", contain: "layout style paint" }}>
        <div className="max-w-[1130px] mx-auto">
          {/* Heading */}
          <h2 
            className="text-center mb-16 fade-in-blur"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "32px",
              lineHeight: "normal",
              textAlign: "center",
              background: "linear-gradient(90deg, #7e0034 0%, #d9045b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Reseller's Testimonials
          </h2>

          {/* Scrollable Testimonials Container */}
          <div className="relative overflow-hidden fade-in-section">
            <div 
              className="flex"
              style={{
                transform: `translateX(-${currentTestimonial * 100}%)`,
                transition: isTransitioning ? "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)" : "transform 0s",
                willChange: "transform",
              }}
            >
              {/* First Set of Testimonials */}
              {/* Testimonial Card 1 */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-[72px] items-center min-w-full">
                {/* Logo */}
                <div 
                  className="relative shrink-0"
                  style={{
                    width: "481.33px",
                    height: "148.77px",
                    maxWidth: "100%",
                  }}
                >
                  <Image
                    src="https://www.figma.com/api/mcp/asset/7519488f-c8ba-4070-bd1d-ed93e6ff8330"
                    alt="Mozark Logo"
                    width={481}
                    height={149}
                    className="object-contain rounded-[8px]"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              
                {/* Content */}
                <div className="flex flex-col gap-2 flex-1 w-full md:w-[584px]">
                  {/* Company Name */}
                  <h3 
                    className="fade-in-blur"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "24px",
                      lineHeight: "1.5",
                      letterSpacing: "-0.4px",
                      color: "#181818",
                    }}
                  >
                    Mozark
                  </h3>

                  {/* Testimonial Text and Author */}
                  <div className="flex flex-col gap-4">
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "1.7",
                        letterSpacing: "-0.4px",
                        color: "#34414e",
                      }}
                    >
                      Partnering with Tangram.ai has accelerated outcomes beyond expectations. Within months, the collaboration has become core to every growth motion we run. Our shared customer obsession drives perfect alignment across every deal — leading to faster closes, higher conversions, and expanded opportunities that power scalable, efficient growth.
                    </p>
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "normal",
                        color: "#091917",
                      }}
                    >
                      - Chandrasekar Ramamoorthy, CTO
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial Card 2 */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-[72px] items-center min-w-full">
                {/* Logo */}
                <div 
                  className="relative shrink-0"
                  style={{
                    width: "481.33px",
                    height: "148.77px",
                    maxWidth: "100%",
                  }}
                >
                  <Image
                    src="https://www.figma.com/api/mcp/asset/7519488f-c8ba-4070-bd1d-ed93e6ff8330"
                    alt="Mozark Logo"
                    width={481}
                    height={149}
                    className="object-contain rounded-[8px]"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1 w-full md:w-[584px]">
                  {/* Company Name */}
                  <h3 
                    className="fade-in-blur"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "24px",
                      lineHeight: "1.5",
                      letterSpacing: "-0.4px",
                      color: "#181818",
                    }}
                  >
                    Mozark
                  </h3>

                  {/* Testimonial Text and Author */}
                  <div className="flex flex-col gap-4">
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "1.7",
                        letterSpacing: "-0.4px",
                        color: "#34414e",
                      }}
                    >
                      Partnering with Tangram.ai has accelerated outcomes beyond expectations. Within months, the collaboration has become core to every growth motion we run. Our shared customer obsession drives perfect alignment across every deal — leading to faster closes, higher conversions, and expanded opportunities that power scalable, efficient growth.
                    </p>
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "normal",
                        color: "#091917",
                      }}
                    >
                      - Chandrasekar Ramamoorthy, CTO
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial Card 3 */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-[72px] items-center min-w-full">
                {/* Logo */}
                <div 
                  className="relative shrink-0"
                  style={{
                    width: "481.33px",
                    height: "148.77px",
                    maxWidth: "100%",
                  }}
                >
                  <Image
                    src="https://www.figma.com/api/mcp/asset/7519488f-c8ba-4070-bd1d-ed93e6ff8330"
                    alt="Mozark Logo"
                    width={481}
                    height={149}
                    className="object-contain rounded-[8px]"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              
                {/* Content */}
                <div className="flex flex-col gap-2 flex-1 w-full md:w-[584px]">
                  {/* Company Name */}
                  <h3 
                    className="fade-in-blur"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "24px",
                      lineHeight: "1.5",
                      letterSpacing: "-0.4px",
                      color: "#181818",
                    }}
                  >
                    Mozark
                  </h3>

                  {/* Testimonial Text and Author */}
                  <div className="flex flex-col gap-4">
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "1.7",
                        letterSpacing: "-0.4px",
                        color: "#34414e",
                      }}
                    >
                      Partnering with Tangram.ai has accelerated outcomes beyond expectations. Within months, the collaboration has become core to every growth motion we run. Our shared customer obsession drives perfect alignment across every deal — leading to faster closes, higher conversions, and expanded opportunities that power scalable, efficient growth.
                    </p>
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "normal",
                        color: "#091917",
                      }}
                    >
                      - Chandrasekar Ramamoorthy, CTO
                    </p>
                  </div>
                </div>
              </div>

              {/* Duplicate Set for Seamless Loop */}
              {/* Testimonial Card 1 (Duplicate) */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-[72px] items-center min-w-full">
                {/* Logo */}
                <div 
                  className="relative shrink-0"
                  style={{
                    width: "481.33px",
                    height: "148.77px",
                    maxWidth: "100%",
                  }}
                >
                  <Image 
                    src="https://www.figma.com/api/mcp/asset/7519488f-c8ba-4070-bd1d-ed93e6ff8330"
                    alt="Mozark Logo"
                    width={481}
                    height={149}
                    className="object-contain rounded-[8px]"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1 w-full md:w-[584px]">
                  {/* Company Name */}
                  <h3 
                    className="fade-in-blur"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "24px",
                      lineHeight: "1.5",
                      letterSpacing: "-0.4px",
                      color: "#181818",
                    }}
                  >
                    Mozark
                  </h3>

                  {/* Testimonial Text and Author */}
                  <div className="flex flex-col gap-4">
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "1.7",
                        letterSpacing: "-0.4px",
                        color: "#34414e",
                      }}
                    >
                      Partnering with Tangram.ai has accelerated outcomes beyond expectations. Within months, the collaboration has become core to every growth motion we run. Our shared customer obsession drives perfect alignment across every deal — leading to faster closes, higher conversions, and expanded opportunities that power scalable, efficient growth.
                    </p>
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "normal",
                        color: "#091917",
                      }}
                    >
                      - Chandrasekar Ramamoorthy, CTO
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial Card 2 (Duplicate) */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-[72px] items-center min-w-full">
                {/* Logo */}
                <div 
                  className="relative shrink-0"
                  style={{
                    width: "481.33px",
                    height: "148.77px",
                    maxWidth: "100%",
                  }}
                >
                  <Image 
                    src="https://www.figma.com/api/mcp/asset/7519488f-c8ba-4070-bd1d-ed93e6ff8330"
                    alt="Mozark Logo"
                    width={481}
                    height={149}
                    className="object-contain rounded-[8px]"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1 w-full md:w-[584px]">
                  {/* Company Name */}
                  <h3 
                    className="fade-in-blur"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "24px",
                      lineHeight: "1.5",
                      letterSpacing: "-0.4px",
                      color: "#181818",
                    }}
                  >
                    Mozark
                  </h3>

                  {/* Testimonial Text and Author */}
                  <div className="flex flex-col gap-4">
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "1.7",
                        letterSpacing: "-0.4px",
                        color: "#34414e",
                      }}
                    >
                      Partnering with Tangram.ai has accelerated outcomes beyond expectations. Within months, the collaboration has become core to every growth motion we run. Our shared customer obsession drives perfect alignment across every deal — leading to faster closes, higher conversions, and expanded opportunities that power scalable, efficient growth.
                    </p>
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "normal",
                        color: "#091917",
                      }}
                    >
                      - Chandrasekar Ramamoorthy, CTO
                    </p>
                  </div>
                </div>
              </div>

              {/* Testimonial Card 3 (Duplicate) */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-[72px] items-center min-w-full">
                {/* Logo */}
                <div 
                  className="relative shrink-0"
                  style={{
                    width: "481.33px",
                    height: "148.77px",
                    maxWidth: "100%",
                  }}
                >
                  <Image
                    src="https://www.figma.com/api/mcp/asset/7519488f-c8ba-4070-bd1d-ed93e6ff8330"
                    alt="Mozark Logo"
                    width={481}
                    height={149}
                    className="object-contain rounded-[8px]"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 flex-1 w-full md:w-[584px]">
                  {/* Company Name */}
                  <h3 
                    className="fade-in-blur"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "24px",
                      lineHeight: "1.5",
                      letterSpacing: "-0.4px",
                      color: "#181818",
                    }}
                  >
                    Mozark
                  </h3>

                  {/* Testimonial Text and Author */}
                  <div className="flex flex-col gap-4">
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "1.7",
                        letterSpacing: "-0.4px",
                        color: "#34414e",
                      }}
                    >
                      Partnering with Tangram.ai has accelerated outcomes beyond expectations. Within months, the collaboration has become core to every growth motion we run. Our shared customer obsession drives perfect alignment across every deal — leading to faster closes, higher conversions, and expanded opportunities that power scalable, efficient growth.
                    </p>
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "normal",
                        color: "#091917",
                      }}
                    >
                      - Chandrasekar Ramamoorthy, CTO
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows and Dots */}
          <div className="flex justify-center items-center gap-4 mt-12">
            {/* Left Arrow */}
            <button
              onClick={goToPrevious}
              className="bg-transparent border-none cursor-pointer p-2 hover:opacity-70 transition-opacity"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>

            {/* Navigation Dots with Progress Timer */}
            <div 
              style={{
                width: "124px",
                height: "8px",
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsTransitioning(true)
                    setCurrentTestimonial(index)
                    setProgress(0)
                  }}
                  style={{
                    width: "32px",
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor: "#E5E7EB",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  aria-label={`Go to testimonial ${index + 1}`}
                >
                  {index === actualTestimonialIndex && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                        width: `${progress}%`,
                        backgroundColor: "#000000",
                        borderRadius: "4px",
                        transition: "width 0.1s linear",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={goToNext}
              className="bg-transparent border-none cursor-pointer p-2 hover:opacity-70 transition-opacity"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24 bg-white" style={{ transform: "translateZ(0)", contain: "layout style paint" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-[32px] items-start">
            {/* Left Column - Heading */}
            <div className="w-full md:w-[481.33px] shrink-0">
              <div className="sticky top-0">
                <h2 
                  className="fade-in-blur"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontStyle: "normal",
                    fontSize: "32px",
                    lineHeight: "normal",
                    background: "linear-gradient(90deg, #002e84 0%, #1157d9 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  frequently asked questions<br />
                  FAQ's
                </h2>
              </div>
            </div>

            {/* Spacer */}
            <div className="hidden md:block w-[70.66px] shrink-0" />

            {/* Right Column - FAQ Items */}
            <div className="flex-1 w-full md:w-[584px]">
              {/* FAQ Item 1 */}
              <div className="fade-in-section">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === 0 ? null : 0)}
                  className="w-full flex items-center justify-between px-2 py-6"
                  style={{
                    paddingTop: "24px",
                    paddingBottom: "24px",
                  }}
                >
                  <h3 
                    className="fade-in-blur"
                    style={{
                      color: "#161D26",
                      fontFamily: "Poppins",
                      fontSize: "17.4px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "23.99px",
                    }}
                  >
                    Incentives and Perks
                  </h3>
                  <div 
                    style={{
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        opacity: expandedFAQ === 0 ? 1 : 0,
                        transform: expandedFAQ === 0 ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
                      }}
                    >
                      <X className="w-4 h-4 text-[#161d26]" />
                    </div>
                    <div 
                      style={{
                        position: "absolute",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        opacity: expandedFAQ === 0 ? 0 : 1,
                        transform: expandedFAQ === 0 ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
                      }}
                    >
                      <Plus className="w-4 h-4 text-[#161d26]" />
                    </div>
                  </div>
                </button>
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: expandedFAQ === 0 ? "500px" : "0",
                    opacity: expandedFAQ === 0 ? 1 : 0,
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
                      Reseller partners receive exclusive benefits including co-marketing opportunities, technical support, marketplace visibility, and revenue sharing programs.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 2 */}
              <div className="border-t fade-in-section" style={{ borderColor: "#D1D6DB" }}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === 1 ? null : 1)}
                  className="w-full flex items-center justify-between px-2 py-6"
                  style={{
                    paddingTop: "24px",
                    paddingBottom: "24px",
                  }}
                >
                  <h3 
                    className="fade-in-blur"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "18px",
                      lineHeight: "23.99px",
                      color: "#161d26",
                    }}
                  >
                    Drive visibility with Tangram.ai Sales
                  </h3>
                  <div 
                    style={{
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        opacity: expandedFAQ === 1 ? 1 : 0,
                        transform: expandedFAQ === 1 ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
                      }}
                    >
                      <X className="w-4 h-4 text-[#161d26]" />
                    </div>
                    <div 
                      style={{
                        position: "absolute",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        opacity: expandedFAQ === 1 ? 0 : 1,
                        transform: expandedFAQ === 1 ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
                      }}
                    >
                      <Plus className="w-4 h-4 text-[#161d26]" />
                    </div>
                  </div>
                </button>
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: expandedFAQ === 1 ? "500px" : "0",
                    opacity: expandedFAQ === 1 ? 1 : 0,
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
                      Get direct access to our sales team, participate in joint customer meetings, and leverage our extensive customer network to accelerate your growth.
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Item 3 */}
              <div className="border-t fade-in-section" style={{ borderColor: "#D1D6DB" }}>
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === 2 ? null : 2)}
                  className="w-full flex items-center justify-between px-2 py-6"
                  style={{
                    paddingTop: "24px",
                    paddingBottom: "24px",
                  }}
                >
                  <h3 
                    className="fade-in-blur"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "17.2px",
                      lineHeight: "23.99px",
                      color: "#161d26",
                    }}
                  >
                    Focused co-sell support and resources
                  </h3>
                  <div 
                    style={{
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        opacity: expandedFAQ === 2 ? 1 : 0,
                        transform: expandedFAQ === 2 ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
                      }}
                    >
                      <X className="w-4 h-4 text-[#161d26]" />
                    </div>
                    <div 
                      style={{
                        position: "absolute",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        opacity: expandedFAQ === 2 ? 0 : 1,
                        transform: expandedFAQ === 2 ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
                      }}
                    >
                      <Plus className="w-4 h-4 text-[#161d26]" />
                    </div>
                  </div>
                </button>
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: expandedFAQ === 2 ? "500px" : "0",
                    opacity: expandedFAQ === 2 ? 1 : 0,
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
                      Access dedicated partner managers, sales enablement materials, and co-selling resources to maximize your success in the marketplace.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

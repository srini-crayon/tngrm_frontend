"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"
import { Input } from "../../components/ui/input"
import Image from "next/image"
import { useModal } from "../../hooks/use-modal"
import { useAuthStore } from "../../lib/store/auth.store"
import { useRouter } from "next/navigation"
import { ArrowRight, ArrowLeft, Target, Globe, TrendingUp, ChevronLeft, ChevronRight, Plus, X } from "lucide-react"

export default function ISVPage() {
  const { openModal } = useModal()
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [progress, setProgress] = useState(0)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const totalTestimonials = 3 // Update this when you add more testimonials

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

  const handleOnboardAgent = () => {
    if (isAuthenticated && user?.role === 'isv') {
      // User is logged in as ISV, redirect to onboard page
      router.push('/onboard')
    } else {
      // User is not logged in as ISV, show ISV login modal
      openModal("auth", { mode: "login", role: "isv" })
    }
  }
  return (
    <div className="min-h-screen" style={{ scrollBehavior: "smooth" }}>
            {/* Hero Section with Gradient */}
            <section className="relative overflow-hidden min-h-[90vh]" style={{ transform: "translateZ(0)", willChange: "scroll-position", contain: "layout style paint" }}>
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
        <div className="w-full px-8 md:px-12 lg:px-16 py-12 md:py-20 lg:py-24 relative text-center">
            {/* Badge */}
              <span 
                className="inline-block scale-in"
                style={{
                  width: "244px",
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
                  willChange: "transform",
                }}
              >
                Independent Software Vendor
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
                Do you have an<br />
                Innovative AI Solution?
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
              Build and Scale AI Agents That Reach Global Customers
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
              Independent Software Vendor (ISV) Accelerator gives you access to 1000+ new customers to grow your business
              through one of the world's largest commercial marketplaces.
            </p>

            {/* Buttons */}
          <div className="flex justify-center scale-in">
            <button
              onClick={() => openModal("auth", { mode: "login", role: "isv" })}
              className="border-gradient relative text-white rounded-[4px] px-[28px] cursor-pointer transition-all hover:opacity-90 hover:scale-105"
              style={{ willChange: "transform" } as React.CSSProperties}
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
              Become an ISV Partner
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
      <section className="w-full px-8 md:px-12 lg:px-16 pt-8 md:pt-12 lg:pt-16 pb-16 md:pb-20 lg:pb-24 bg-white fade-in-section" style={{ transform: "translateZ(0)", willChange: "transform" }}>
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
                background: "linear-gradient(90deg, #2F0368 0%, #5E04D2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                willChange: "opacity, transform, filter",
              }}
            >
              Build the Future Together
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
                maxWidth: "1100px",
                margin: "0 auto",
                willChange: "opacity, transform",
              }}
            >
              The Tangram.ai ISV Program empowers Independent Software Vendors to build, integrate, and scale on the Tangram.ai platform. Partners gain co-sell support, marketplace visibility, and go-to-market alignment — accelerating growth and expanding reach across the Tangram.ai ecosystem.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="flex flex-col md:flex-row gap-2 items-stretch justify-center" style={{ gap: "0px", alignItems: "stretch" }}>
            {/* Card 1: Accelerate Project Successes */}
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
                <Image
                  src="https://www.figma.com/api/mcp/asset/8a4eef0e-385d-4a31-bcc2-5dd56b5f4b38"
                  alt="Accelerate Project Successes"
                  width={24.5}
                  height={24.5}
                  className="object-contain"
                />
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
                    fontSize: "clamp(16px, 4vw, 20px)",
                  fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "150%",
                    letterSpacing: "-0.4px",
                    willChange: "opacity, transform, filter",
                }}
              >
                Accelerate Project Successes
              </h3>
              <p 
                style={{
                    color: "#65717C",
                    fontFamily: "Poppins",
                    fontSize: "clamp(14px, 3.5vw, 16px)",
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

            {/* Card 2: Scale your operations globally */}
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
                <Image
                  src="https://www.figma.com/api/mcp/asset/9c877fdb-a829-406b-969c-4ec7bff5b898"
                  alt="Scale your operations globally"
                  width={24.5}
                  height={24.5}
                  className="object-contain"
                />
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
                    fontSize: "clamp(16px, 4vw, 20px)",
                  fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "150%",
                    letterSpacing: "-0.4px",
                    whiteSpace: "nowrap",
                    willChange: "opacity, transform, filter",
                }}
              >
                Scale your operations globally
              </h3>
              <p 
                style={{
                    color: "#65717C",
                    fontFamily: "Poppins",
                    fontSize: "clamp(14px, 3.5vw, 16px)",
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

            {/* Card 3: Get faster business results */}
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
                <Image
                  src="https://www.figma.com/api/mcp/asset/6f100737-627e-4eb0-aae3-b04d34f9d940"
                  alt="Get faster business results"
                  width={24.5}
                  height={24.5}
                  className="object-contain"
                />
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
                    fontSize: "clamp(16px, 4vw, 20px)",
                  fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "150%",
                    letterSpacing: "-0.4px",
                    willChange: "opacity, transform, filter",
                }}
              >
                Get faster business results
              </h3>
              <p 
                style={{
                    color: "#65717C",
                    fontFamily: "Poppins",
                    fontSize: "clamp(14px, 3.5vw, 16px)",
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

      {/* ISV's Testimonials Section */}
      <section className="w-full px-8 md:px-12 lg:px-16 pt-12 md:pt-16 lg:pt-20 pb-16 md:pb-20 lg:pb-24 fade-in-section" style={{ backgroundColor: "#F9FAFB", transform: "translateZ(0)", willChange: "transform" }}>
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
              willChange: "opacity, transform, filter",
            }}
          >
            ISV's Testimonials
          </h2>

          {/* Scrollable Testimonials Container */}
          <div className="relative overflow-hidden">
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
              <div className="flex flex-col md:flex-row gap-8 md:gap-[72px] items-center min-w-full fade-in-section">
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
                      willChange: "opacity, transform, filter",
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
              <div className="flex flex-col md:flex-row gap-8 md:gap-[72px] items-center min-w-full fade-in-section">
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
              <div className="flex flex-col md:flex-row gap-8 md:gap-[72px] items-center min-w-full fade-in-section">
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
              <div className="flex flex-col md:flex-row gap-8 md:gap-[72px] items-center min-w-full fade-in-section">
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
              <div className="flex flex-col md:flex-row gap-8 md:gap-[72px] items-center min-w-full fade-in-section">
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
              <div className="flex flex-col md:flex-row gap-8 md:gap-[72px] items-center min-w-full fade-in-section">
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
      <section className="w-full px-8 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24 bg-white fade-in-section" style={{ transform: "translateZ(0)", willChange: "transform" }}>
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
                  willChange: "opacity, transform, filter",
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
                  onClick={() => setExpandedFaq(expandedFaq === 0 ? null : 0)}
                  className="w-full flex items-center justify-between px-2 py-6 transition-all duration-300 hover:opacity-80"
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
                        willChange: "opacity, transform, filter",
                      }}
                    >
                      Incentives for Sales teams
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
                        opacity: expandedFaq === 0 ? 1 : 0,
                        transform: expandedFaq === 0 ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
                      }}
                    >
                      <X className="w-4 h-4 text-[#161d26]" />
                  </div>
                    <div 
                      style={{
                        position: "absolute",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        opacity: expandedFaq === 0 ? 0 : 1,
                        transform: expandedFaq === 0 ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
                      }}
                    >
                      <Plus className="w-4 h-4 text-[#161d26]" />
                    </div>
                  </div>
                </button>
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: expandedFaq === 0 ? "500px" : "0",
                    opacity: expandedFaq === 0 ? 1 : 0,
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
                      Our ISV program offers competitive incentives for sales teams, including revenue sharing, performance bonuses, and co-marketing opportunities. Sales teams can earn additional commissions and rewards for successfully integrating and selling Tangram.ai solutions to their clients.
                    </p>
                    </div>
                </div>
                </div>

                {/* FAQ Item 2 */}
              <div className="border-t fade-in-section" style={{ borderColor: "#D1D6DB" }}>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === 1 ? null : 1)}
                  className="w-full flex items-center justify-between px-2 py-6 transition-all duration-300 hover:opacity-80"
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
                        willChange: "opacity, transform, filter",
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
                        opacity: expandedFaq === 1 ? 1 : 0,
                        transform: expandedFaq === 1 ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
                      }}
                    >
                      <X className="w-4 h-4 text-[#161d26]" />
                  </div>
                    <div 
                      style={{
                        position: "absolute",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        opacity: expandedFaq === 1 ? 0 : 1,
                        transform: expandedFaq === 1 ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
                      }}
                    >
                      <Plus className="w-4 h-4 text-[#161d26]" />
                    </div>
                  </div>
                </button>
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: expandedFaq === 1 ? "500px" : "0",
                    opacity: expandedFaq === 1 ? 1 : 0,
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
                      Partner with Tangram.ai to increase your brand visibility and reach. Our sales team works closely with ISV partners to co-sell solutions, providing joint marketing materials, sales enablement resources, and access to our customer base to help drive your business growth.
                    </p>
                    </div>
                </div>
                </div>

                {/* FAQ Item 3 */}
              <div className="border-t fade-in-section" style={{ borderColor: "#D1D6DB" }}>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === 2 ? null : 2)}
                  className="w-full flex items-center justify-between px-2 py-6 transition-all duration-300 hover:opacity-80"
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
                        willChange: "opacity, transform, filter",
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
                        opacity: expandedFaq === 2 ? 1 : 0,
                        transform: expandedFaq === 2 ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0)",
                      }}
                    >
                      <X className="w-4 h-4 text-[#161d26]" />
                  </div>
                    <div 
                      style={{
                        position: "absolute",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                        opacity: expandedFaq === 2 ? 0 : 1,
                        transform: expandedFaq === 2 ? "rotate(-90deg) scale(0)" : "rotate(0deg) scale(1)",
                      }}
                    >
                      <Plus className="w-4 h-4 text-[#161d26]" />
                    </div>
                  </div>
                </button>
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: expandedFaq === 2 ? "500px" : "0",
                    opacity: expandedFaq === 2 ? 1 : 0,
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
                      We provide dedicated co-sell support to help you succeed. This includes technical resources, sales training, marketing collateral, and a dedicated partner success manager who works with you to identify opportunities, develop go-to-market strategies, and ensure successful customer implementations.
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



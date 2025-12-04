"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import Image from "next/image"
import { useModal } from "../../hooks/use-modal"
import { useAuthStore } from "../../lib/store/auth.store"
import { useRouter } from "next/navigation"
import { Target, Globe, TrendingUp, Percent, DollarSign, Monitor, Headphones } from "lucide-react"

export default function ResellerPage() {
  const { openModal } = useModal()
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const handleResellerLogin = () => {
    if (isAuthenticated && user?.role === 'reseller') {
      router.push('/dashboard')
    } else {
      openModal("auth", { mode: "login", role: "reseller" })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden min-h-[90vh]">
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
        <div className="w-full px-8 md:px-12 lg:px-16 py-12 md:py-20 lg:py-24 relative">
          <div className="text-center">
            {/* Badge */}
            <div className="flex justify-center mb-4">
              <span 
                className="inline-block"
                style={{
                  width: "88px",
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
                }}
              >
                Reseller
              </span>
            </div>

            {/* Main Title */}
            <h1 className="mb-4 text-center">
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "52px",
                  lineHeight: "54px",
                  letterSpacing: "0%",
                  textAlign: "center",
                  color: "#091917",
                  display: "block",
                }}
              >
                Drive new revenue with<br />
                AI offerings from 1000+ ISVs
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="mb-4 text-center"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#091917",
              }}
            >
              Join Tangram.ai Enterprise Agents Reseller Program Accelerator
            </p>

            {/* Description */}
            <p 
              className="mx-auto mb-8 max-w-2xl text-center"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "24px",
                letterSpacing: "0px",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#091917",
              }}
            >
              Start referring or integrating agents from Tangram.ai store with your clients today to unlock new revenue opportunities, accelerate growth, and deliver intelligent AI solutions at scale.
            </p>

            {/* Buttons */}
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={handleResellerLogin}>
                Become an tangram.AI reseller
              </Button>
            </div>
          </div>
        </div>

        {/* Scrolling banner of company logos */}
        <div className="mt-12 w-full overflow-hidden py-8">
          {(() => {
            const companies = [
              { name: "Crayon", logo: "/crayon_bw.png", width: 113, height: 24 },
              { name: "Veehive", logo: "/veehive_bw.png", width: 113, height: 24 },
              { name: "Mozark", logo: "/mozak_bw.png", width: 113, height: 24 },
              { name: "Redington", logo: "/redington.JPG", width: 113, height: 24 },
            ];

            // Duplicate items multiple times for seamless scrolling
            const duplicatedCompanies = [...companies, ...companies, ...companies, ...companies];

            return (
              <div className="overflow-hidden relative w-full">
                <div 
                  className="flex gap-8 items-center animate-scroll-tags" 
                  style={{ 
                    width: "fit-content",
                    animationDuration: "40s",
                  }}
                >
                  {duplicatedCompanies.map((company, idx) => (
                    <div
                      key={`logo-${idx}`}
                      className="flex items-center justify-center shrink-0 opacity-80 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                      style={{
                        height: "40px",
                        minWidth: "120px",
                      }}
                    >
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="object-contain"
                        style={{ 
                          height: "40px",
                          width: "auto",
                          maxWidth: "200px"
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Build the Future Together */}
      <section className="bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
        <section className="py-12 md:py-16 lg:py-20 relative bg-white">
          <div className="w-full px-8 md:px-12 lg:px-16">
            {/* Title */}
            <div className="text-center mb-8">
              <h2 
                className="mb-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontStyle: "normal",
                  fontSize: "32px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  background: "linear-gradient(90deg, #2D8E0C 0%, #77C402 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                Are You a Good Fit?
              </h2>
              <p 
                className="mx-auto max-w-3xl"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  color: "#091917",
                }}
              >
                You're a good fit for the Tangram.ai Reseller Program if you help clients adopt AI-driven solutions
                and want to expand your portfolio with enterprise-ready intelligence.
              </p>
            </div>

            {/* Three Feature Cards */}
            <div 
              className="flex justify-center mt-12"
              style={{
                gap: "0px",
              }}
            >
              {/* Card 1 */}
              <div 
                className="bg-white relative"
                style={{
                  width: "386.72px",
                  height: "230.77px",
                  padding: "24.51px",
                  border: "1px solid #E5E7EB",
                  
                  background: "#FFFFFF",
                }}
              >
                {/* Corner plus signs */}
                <div 
                  className="absolute top-0 left-0 flex items-center justify-center"
                  style={{
                    width: "16px",
                    height: "16px",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span style={{ fontSize: "16px", color: "#000", lineHeight: "1" }}>+</span>
                </div>
                <div 
                  className="absolute bottom-0 left-0 flex items-center justify-center"
                  style={{
                    width: "16px",
                    height: "16px",
                    transform: "translate(-50%, 50%)",
                  }}
                >
                  <span style={{ fontSize: "16px", color: "#000", lineHeight: "1" }}>+</span>
                </div>
                
               
                
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontStyle: "normal",
                    fontSize: "20px",
                    lineHeight: "28px",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  AI Consultants & Solution Providers
                </h3>
                <p 
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#374151",
                  }}
                >
                  Work with our partner ecosystem and access industry expertise and resources to help you achieve exceptional results.
                </p>
              </div>

              {/* Card 2 */}
              <div 
                className="bg-white relative"
                style={{
                  width: "386.72px",
                  height: "230.77px",
                  padding: "24.51px",
                  border: "1px solid #E5E7EB",
                 
                  background: "#FFFFFF",
                }}
              >
                {/* Corner plus signs */}
                <div 
                  className="absolute top-0 left-0 flex items-center justify-center"
                  style={{
                    width: "16px",
                    height: "16px",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span style={{ fontSize: "16px", color: "#000", lineHeight: "1" }}>+</span>
                </div>
                <div 
                  className="absolute bottom-0 left-0 flex items-center justify-center"
                  style={{
                    width: "16px",
                    height: "16px",
                    transform: "translate(-50%, 50%)",
                  }}
                >
                  <span style={{ fontSize: "16px", color: "#000", lineHeight: "1" }}>+</span>
                </div>
                
                
                
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontStyle: "normal",
                    fontSize: "20px",
                    lineHeight: "28px",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  IT Consultants & Service Providers
                </h3>
                <p 
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#374151",
                  }}
                >
                  Enter new markets while accelerating your business's international reach with global partners or local experts.
                </p>
              </div>

              {/* Card 3 */}
              <div 
                className="bg-white relative"
                style={{
                  width: "386.72px",
                  height: "230.77px",
                  padding: "24.51px",
                  border: "1px solid #E5E7EB",
                  
                  background: "#FFFFFF",
                }}
              >
                {/* Corner plus signs */}
                <div 
                  className="absolute top-0 left-0 flex items-center justify-center"
                  style={{
                    width: "16px",
                    height: "16px",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <span style={{ fontSize: "16px", color: "#000", lineHeight: "1" }}>+</span>
                </div>
                <div 
                  className="absolute bottom-0 left-0 flex items-center justify-center"
                  style={{
                    width: "16px",
                    height: "16px",
                    transform: "translate(-50%, 50%)",
                  }}
                >
                  <span style={{ fontSize: "16px", color: "#000", lineHeight: "1" }}>+</span>
                </div>
                <div 
                  className="absolute top-0 right-0 flex items-center justify-center"
                  style={{
                    width: "16px",
                    height: "16px",
                    transform: "translate(50%, -50%)",
                  }}
                >
                  <span style={{ fontSize: "16px", color: "#000", lineHeight: "1" }}>+</span>
                </div>
                <div 
                  className="absolute bottom-0 right-0 flex items-center justify-center"
                  style={{
                    width: "16px",
                    height: "16px",
                    transform: "translate(50%, 50%)",
                  }}
                >
                  <span style={{ fontSize: "16px", color: "#000", lineHeight: "1" }}>+</span>
                </div>
                
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontStyle: "normal",
                    fontSize: "20px",
                    lineHeight: "28px",
                    color: "#111827",
                    marginBottom: "8px",
                  }}
                >
                  AI Enterprise and GTM Agencies
                </h3>
                <p 
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 400,
                    fontStyle: "normal",
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#374151",
                  }}
                >
                  Reduce time to deployment and accelerate projects with pre-configured, industry specific solutions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Benefits of Reseller Partnership */}
      <section 
        className="relative"
        style={{
          width: "100%",
          height: "698px",
          background: "linear-gradient(180deg, #FFFFFF 0%, #E8F6F7 76.44%, #FAFAFA 100%)",
          margin: "0 auto",
        }}
      >
        <div className="w-full h-full px-8 md:px-12 lg:px-16 flex items-center justify-center">
          <div className="flex flex-col md:flex-row gap-12 items-start w-full max-w-6xl">
            {/* Left side - Text content */}
            <div className="flex-1 md:w-1/2">
              <h2 
                className="mb-6"
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
              <div className="grid grid-cols-2 gap-4">
                {/* Card 1: Up to 40% off */}
                <div 
                  className="relative rounded-lg overflow-hidden"
                  style={{
                    width: "258px",
                    height: "151px",
                  }}
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
                    className="relative bg-white rounded-lg p-6 flex flex-col items-start text-left"
                    style={{
                      border: "1px dashed #D1D5DB",
                      zIndex: 1,
                      width: "calc(100% - 24px)",
                      height: "calc(100% - 18px)",
                      margin: "9px 12px",
                    }}
                  >
                    <Image 
                      src="/percentage-round.png" 
                      alt="Percentage" 
                      width={24} 
                      height={24}
                      className="object-contain mb-4"
                      unoptimized
                    />
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontSize: "14px",
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
                  className="relative rounded-lg overflow-hidden "
                  style={{
                    width: "258px",
                    height: "151px",
                    marginTop: "25px",
                  }}
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
                    className="relative bg-white rounded-lg p-6 flex flex-col items-start text-left"
                    style={{
                      border: "1px dashed #D1D5DB",
                      zIndex: 1,
                      width: "calc(100% - 24px)",
                      height: "calc(100% - 18px)",
                      margin: "9px 12px",
                      
                    }}
                  >
                    <Image 
                      src="/coins.png" 
                      alt="Coins" 
                      width={24} 
                      height={24}
                      className="object-contain mb-4"
                      unoptimized
                    />
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontSize: "14px",
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
                  className="relative rounded-lg overflow-hidden"
                  style={{
                    width: "258px",
                    height: "151px",
                  }}
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
                    className="relative bg-white rounded-lg p-6 flex flex-col items-start text-left"
                    style={{
                      border: "1px dashed #D1D5DB",
                      zIndex: 1,
                      width: "calc(100% - 24px)",
                      height: "calc(100% - 18px)",
                      margin: "9px 12px",
                    }}
                  >
                    <Image 
                      src="/fingerprint-circled-lock.png" 
                      alt="Fingerprint Lock" 
                      width={24} 
                      height={24}
                      className="object-contain mb-4"
                      unoptimized
                    />
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontSize: "14px",
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
                  className="relative rounded-lg overflow-hidden"
                  style={{
                    width: "258px",
                    height: "151px",
                    marginTop: "25px",
                  }}
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
                    className="relative bg-white rounded-lg p-6 flex flex-col items-start text-left"
                    style={{
                      border: "1px dashed #D1D5DB",
                      zIndex: 1,
                      width: "calc(100% - 24px)",
                      height: "calc(100% - 18px)",
                      margin: "9px 12px",
                    }}
                  >
                    <Image 
                      src="/headset-help.png" 
                      alt="Headset Help" 
                      width={24} 
                      height={24}
                      className="object-contain mb-4"
                      unoptimized
                    />
                    <p 
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontSize: "14px",
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

      {/* Testimonials */}
      <section className="py-12 md:py-16 lg:py-20 relative" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="w-full px-8 md:px-12 lg:px-16">
          {/* Title */}
          <h2 
            className="mb-12 text-center"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "32px",
              lineHeight: "100%",
              letterSpacing: "0px",
              textAlign: "center",
              verticalAlign: "middle",
              background: "linear-gradient(90deg, #7E0034 0%, #D9045B 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
            }}
          >
            Reseller's Testimonials
          </h2>

          {/* Testimonial Content */}
          <div 
            className="flex flex-col md:flex-row items-start mx-auto"
            style={{
              width: "1130px",
              height: "215px",
              gap: "72px",
            }}
          >
            {/* Logo Section - Left */}
            <div className="w-full md:w-1/2 flex justify-center md:justify-start mt-12">
              <div 
                className="relative"
                style={{
                  width: "481.33px",
                  height: "148.77px",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Image 
                  src="/mozak_bw.png" 
                  alt="Mozark" 
                  fill 
                  className="object-contain"
                  style={{
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>

            {/* Testimonial Text - Right */}
            <div 
              className="flex flex-col w-full md:w-1/2"
              style={{
                height: "215px",
                gap: "8px",
              }}
            >
              <h3 
                className="mb-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontStyle: "normal",
                  fontSize: "24px",
                  lineHeight: "150%",
                  letterSpacing: "-0.4px",
                  verticalAlign: "middle",
                  color: "#181818",
                }}
              >
                Mozark
              </h3>
              <p 
                className="mb-4"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "16px",
                  lineHeight: "170%",
                  letterSpacing: "-0.4px",
                  color: "#34414E",
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
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  verticalAlign: "middle",
                  color: "#091917",
                }}
              >
                - Chandrasekar Ramamoorthy, CTO
              </p>
            </div>
          </div>

          {/* Pagination Indicators */}
          <div className="flex justify-center gap-2 mt-22">
            <div 
              className="w-8 h-1"
              style={{
                backgroundColor: "#000000",
              }}
            ></div>
            <div 
              className="w-8 h-1"
              style={{
                backgroundColor: "transparent",
                border: "1px solid #D1D5DB",
              }}
            ></div>
            <div 
              className="w-8 h-1"
              style={{
                backgroundColor: "transparent",
                border: "1px solid #D1D5DB",
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-12 md:py-16 lg:py-20 relative mt-10">
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="flex flex-col md:flex-row gap-12 items-start max-w-6xl mx-auto">
            {/* Left side - Title */}
            <div className="flex-1 md:w-1/2 mt-12">
              <h2 
                className="mb-2"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontStyle: "normal",
                  fontSize: "32px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  verticalAlign: "middle",
                  background: "linear-gradient(90deg, #002E84 0%, #1157D9 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                frequently asked questions
              </h2>
              <p 
                style={{
                  fontSize: "32px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  verticalAlign: "middle",
                  background: "linear-gradient(90deg, #002E84 0%, #1157D9 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  fontStyle: "normal",
                }}
              >
                FAQ's
              </p>
            </div>

            {/* Right side - FAQ Items */}
            <div className="flex-1 md:w-1/2">
              <div className="space-y-0">
                {/* FAQ Item 1 */}
                <div className="border-b border-gray-200">
                  <div 
                    className="flex items-center justify-between cursor-pointer py-4"
                    onClick={() => setExpandedFAQ(expandedFAQ === 1 ? null : 1)}
                  >
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "17.4px",
                        lineHeight: "23.99px",
                        letterSpacing: "0%",
                        verticalAlign: "middle",
                        color: "#161D26",
                      }}
                    >
                      Incentives and Perks
                    </span>
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "24px",
                        lineHeight: "28px",
                        color: "#111827",
                        transform: expandedFAQ === 1 ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      +
                    </span>
                  </div>
                  {expandedFAQ === 1 && (
                    <div 
                      className="pb-4"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#6B7280",
                      }}
                    >
                      Reseller partners receive exclusive benefits including co-marketing opportunities, technical support, marketplace visibility, and revenue sharing programs.
                    </div>
                  )}
                </div>

                {/* FAQ Item 2 */}
                <div className="border-b border-gray-200">
                  <div 
                    className="flex items-center justify-between cursor-pointer py-4"
                    onClick={() => setExpandedFAQ(expandedFAQ === 2 ? null : 2)}
                  >
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "17.4px",
                        lineHeight: "23.99px",
                        letterSpacing: "0%",
                        verticalAlign: "middle",
                        color: "#161D26",
                      }}
                    >
                      Drive visibility with Tangram.ai Sales
                    </span>
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "24px",
                        lineHeight: "28px",
                        color: "#111827",
                        transform: expandedFAQ === 2 ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      +
                    </span>
                  </div>
                  {expandedFAQ === 2 && (
                    <div 
                      className="pb-4"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#6B7280",
                      }}
                    >
                      Get direct access to our sales team, participate in joint customer meetings, and leverage our extensive customer network to accelerate your growth.
                    </div>
                  )}
                </div>

                {/* FAQ Item 3 */}
                <div className="border-b border-gray-200">
                  <div 
                    className="flex items-center justify-between cursor-pointer py-4"
                    onClick={() => setExpandedFAQ(expandedFAQ === 3 ? null : 3)}
                  >
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "17.4px",
                        lineHeight: "23.99px",
                        letterSpacing: "0%",
                        verticalAlign: "middle",
                        color: "#161D26",
                      }}
                    >
                      Focused co-sell support and resources
                    </span>
                    <span
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "24px",
                        lineHeight: "28px",
                        color: "#111827",
                        transform: expandedFAQ === 3 ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      +
                    </span>
                  </div>
                  {expandedFAQ === 3 && (
                    <div 
                      className="pb-4"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "24px",
                        color: "#6B7280",
                      }}
                    >
                      Access dedicated partner managers, sales enablement materials, and co-selling resources to maximize your success in the marketplace.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

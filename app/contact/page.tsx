"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import ChatDialog from "../../components/chat-dialog";
import { useAuthStore } from "../../lib/store/auth.store";
import { useToast } from "../../hooks/use-toast";

export default function ContactPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate session_id if not available
      const sessionId = `contact_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      
      // Prepare request body - ensure all required fields are included
      const requestBody = {
        company_name: "",
        email: formData.email.trim(),
        full_name: `${formData.firstName} ${formData.lastName}`.trim(),
        message: formData.message.trim(),
        phone: formData.phone.trim() || "",
        session_id: sessionId,
        type: "contact",
        user_id: user?.user_id || "anonymous",
        user_type: user?.role || "client",
      };

      // Validate required fields
      if (!requestBody.email || !formData.firstName.trim() || !requestBody.message) {
        toast({
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(requestBody.email)) {
        toast({
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Log request for debugging
      console.log("Submitting contact form:", requestBody);

      const response = await fetch("https://agents-store.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      // Try to parse JSON response, but handle cases where response might not be valid JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If response is not valid JSON, create a generic error response
        console.error("Failed to parse response:", parseError);
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      if (response.ok && data.success) {
        toast({
          description: data.message || "Thank you for your enquiry! We'll get back to you soon.",
        });
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        // Handle error responses - FastAPI often uses 'detail' field for errors
        const errorMessage = data?.detail || data?.message || data?.error || `Server error: ${response.status} ${response.statusText}`;
        toast({
          description: errorMessage,
          variant: "destructive",
        });
        console.error("Contact form submission error:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
          requestBody: requestBody,
        });
      }
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      toast({
        description: error.message || "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-16"
        style={{
          background: "radial-gradient(100% 100% at 50% 0%, #FFF1E5 0%, #FFFFFF 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center space-y-4">
            <span
              className="inline-flex items-center justify-center uppercase tracking-wider"
              style={{
                width: "90px",
                height: "32px",
                borderRadius: "50px",
                padding: "4px 16px",
                gap: "8px",
                transform: "rotate(-0.28deg)",
                background: "#FFE4CC",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "140%",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#A75510",
              }}
            >
              Contact
            </span>
            <h1
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "52px",
                lineHeight: "52px",
                letterSpacing: "0%",
                textAlign: "center",
                color: "#091917",
              }}
            >
              How can we help?
            </h1>
            <p
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
                whiteSpace: "nowrap",
              }}
            >
              Get in touch with our sales and support teams for demos, onboarding support, or product questions.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_minmax(320px,1fr)] gap-10 items-center">
            {/* Illustration */}
            <div className="flex justify-center lg:justify-start">
              <img
                src="/Contact_image.png"
                alt="Support illustration"
                className="max-h-[420px] w-auto"
              />
            </div>

            {/* Form card */}
            <div className="relative">
              <div className="relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#FF9EB6] rounded-bl-[32px] rounded-tr-[32px] opacity-70" style={{ zIndex: -1 }} />
                {/* Background Mask Image */}
                <div
                  className="absolute inset-0 pointer-events-none w-full h-full"
                  style={{
                    zIndex: 0,
                  }}
                >
                  <Image
                    src="/Mask_img_contact.png"
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
                
                {/* Form Content */}
                <div 
                  className="relative bg-white border border-dashed border-[#E4E4E7] shadow-[0px_24px_65px_rgba(15,23,42,0.08)] p-6 sm:p-8"
                  style={{
                    zIndex: 1,
                    margin: "10px",
                    width: "calc(100% - 20px)",
                    height: "calc(100% - 20px)",
                  }}
                >
                  <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label 
                        htmlFor="firstName"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "16px",
                          lineHeight: "24px",
                          letterSpacing: "0%",
                          color: "#555555",
                        }}
                      >
                        First name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        className="mt-2 bg-white border-gray-200 focus:border-[#FF8CA0] focus:ring-[#FF8CA0]/30"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "18px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#B3B3B3",
                        }}
                      />
                    </div>
                    <div>
                      <Label 
                        htmlFor="lastName"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "16px",
                          lineHeight: "24px",
                          letterSpacing: "0%",
                          color: "#555555",
                        }}
                      >
                        Last name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        className="mt-2 bg-white border-gray-200 focus:border-[#FF8CA0] focus:ring-[#FF8CA0]/30"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "18px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#B3B3B3",
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label 
                        htmlFor="email"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "16px",
                          lineHeight: "24px",
                          letterSpacing: "0%",
                          color: "#555555",
                        }}
                      >
                        Email *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        className="mt-2 bg-white border-gray-200 focus:border-[#FF8CA0] focus:ring-[#FF8CA0]/30"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 400,
                          fontStyle: "normal",
                          fontSize: "18px",
                          lineHeight: "100%",
                          letterSpacing: "0%",
                          color: "#B3B3B3",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label 
                      htmlFor="phone"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "24px",
                        letterSpacing: "0%",
                        color: "#555555",
                      }}
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="mt-2 bg-white border-gray-200 focus:border-[#FF8CA0] focus:ring-[#FF8CA0]/30"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "18px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#B3B3B3",
                      }}
                    />
                  </div>

                  <div>
                    <Label 
                      htmlFor="message"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "16px",
                        lineHeight: "24px",
                        letterSpacing: "0%",
                        color: "#555555",
                      }}
                    >
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Leave us a message..."
                      className="mt-2 min-h-[140px] bg-white border-gray-200 focus:border-[#FF8CA0] focus:ring-[#FF8CA0]/30"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "18px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: "#B3B3B3",
                      }}
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-black hover:bg-black/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        width: "110px",
                        height: "42px",
                        borderRadius: "6px",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "24px",
                        letterSpacing: "0px",
                        verticalAlign: "middle",
                        color: "#FFFFFF",
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                  </div>
                </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChatDialog open={chatOpen} onOpenChange={setChatOpen} initialMode="create" />
    </div>
  );
}

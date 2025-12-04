"use client"

import { Users, User, UserCheck } from "lucide-react"

interface AuthTabsProps {
  activeTab: "client" | "reseller" | "isv"
  onTabChange?: (tab: "client" | "reseller" | "isv") => void
}

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <div 
      className="flex gap-2 justify-center items-center"
      style={{
        width: "343px",
        height: "32px",
        borderRadius: "8.91px",
        backgroundColor: "#F3F4F6",
        padding: "2px",
        margin: "0 auto",
      }}
    >
      <div
        className="flex items-center justify-center gap-2 cursor-pointer transition-colors"
        onClick={() => onTabChange?.("client")}
        style={{
          width: "112px",
          height: "28px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontStyle: "normal",
          fontSize: "13px",
          lineHeight: "150%",
          letterSpacing: "0%",
          textAlign: "center",
          verticalAlign: "middle",
          backgroundColor: activeTab === "client" ? "#1F2937" : "transparent",
          color: "#6B7280",
          borderRadius: activeTab === "client" ? "6.93px" : "6px",
          border: activeTab === "client" ? "0.5px solid rgba(0, 0, 0, 0.04)" : "none",
          boxShadow: activeTab === "client" ? "0px 3px 1px 0px rgba(0, 0, 0, 0.04), 0px 3px 8px 0px rgba(0, 0, 0, 0.12)" : "none",
        }}
      >
        <UserCheck 
          className="h-4 w-4" 
          style={{ color: activeTab === "client" ? "#FFFFFF" : "#9CA3AF" }}
        />
        <span style={{ color: activeTab === "client" ? "#FFFFFF" : "#6B7280" }}>Client</span>
      </div>
      <div
        className="flex items-center justify-center gap-2 cursor-pointer transition-colors"
        onClick={() => onTabChange?.("reseller")}
        style={{
          width: "112px",
          height: "28px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontStyle: "normal",
          fontSize: "13px",
          lineHeight: "150%",
          letterSpacing: "0%",
          textAlign: "center",
          verticalAlign: "middle",
          backgroundColor: activeTab === "reseller" ? "#1F2937" : "transparent",
          color: "#6B7280",
          borderRadius: activeTab === "reseller" ? "6.93px" : "6px",
          border: activeTab === "reseller" ? "0.5px solid rgba(0, 0, 0, 0.04)" : "none",
          boxShadow: activeTab === "reseller" ? "0px 3px 1px 0px rgba(0, 0, 0, 0.04), 0px 3px 8px 0px rgba(0, 0, 0, 0.12)" : "none",
        }}
      >
        <Users 
          className="h-4 w-4" 
          style={{ color: activeTab === "reseller" ? "#FFFFFF" : "#9CA3AF" }}
        />
        <span style={{ color: activeTab === "reseller" ? "#FFFFFF" : "#6B7280" }}>Reseller</span>
      </div>
      <div
        className="flex items-center justify-center gap-2 cursor-pointer transition-colors"
        onClick={() => onTabChange?.("isv")}
        style={{
          width: "112px",
          height: "28px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
          fontStyle: "normal",
          fontSize: "13px",
          lineHeight: "150%",
          letterSpacing: "0%",
          textAlign: "center",
          verticalAlign: "middle",
          backgroundColor: activeTab === "isv" ? "#1F2937" : "transparent",
          color: "#6B7280",
          borderRadius: activeTab === "isv" ? "6.93px" : "6px",
          border: activeTab === "isv" ? "0.5px solid rgba(0, 0, 0, 0.04)" : "none",
          boxShadow: activeTab === "isv" ? "0px 3px 1px 0px rgba(0, 0, 0, 0.04), 0px 3px 8px 0px rgba(0, 0, 0, 0.12)" : "none",
        }}
      >
        <User 
          className="h-4 w-4" 
          style={{ color: activeTab === "isv" ? "#FFFFFF" : "#9CA3AF" }}
        />
        <span style={{ color: activeTab === "isv" ? "#FFFFFF" : "#6B7280" }}>ISV</span>
      </div>
    </div>
  )
}

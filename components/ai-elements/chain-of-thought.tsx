"use client";

import { ReactNode, useState } from "react";
import { LucideIcon, Brain, ChevronUp, Search, Image as ImageIcon } from "lucide-react";

interface ChainOfThoughtProps {
  children: ReactNode;
  defaultOpen?: boolean;
}

interface ChainOfThoughtStepProps {
  children?: ReactNode;
  icon?: LucideIcon;
  label: string;
  status?: "complete" | "active" | "pending";
}

interface ChainOfThoughtSearchResultsProps {
  children: ReactNode;
}

interface ChainOfThoughtSearchResultProps {
  children: ReactNode;
}

interface ChainOfThoughtImageProps {
  children: ReactNode;
  caption?: string;
}

export function ChainOfThought({ children, defaultOpen = true }: ChainOfThoughtProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-gray-600" />
          <h3 
            className="text-sm font-medium text-gray-800"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Chain of Thought
          </h3>
        </div>
        <ChevronUp 
          className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? '' : 'rotate-180'}`}
        />
      </div>
      
      {/* Content */}
      {isOpen && (
        <div className="pt-2">
          {children}
        </div>
      )}
    </div>
  );
}

export function ChainOfThoughtHeader() {
  return null; // Header is now part of ChainOfThought component
}

export function ChainOfThoughtContent({ children }: { children: ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

export function ChainOfThoughtStep({ 
  children, 
  icon: Icon, 
  label, 
  status = "pending" 
}: ChainOfThoughtStepProps) {
  // Default to Search icon if no icon provided
  const StepIcon = Icon || Search;
  
  return (
    <div 
      className={`flex items-start gap-3 py-1.5 transition-opacity duration-300 ${
        status === "active" ? "opacity-100" : status === "complete" ? "opacity-60" : "opacity-40"
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <StepIcon 
          className={`w-4 h-4 transition-colors duration-200 ${
            status === "active" 
              ? "text-blue-600" 
              : status === "complete" 
              ? "text-gray-500" 
              : "text-gray-400"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p 
          className={`text-sm leading-relaxed transition-colors duration-200 ${
            status === "active" 
              ? "text-gray-900" 
              : status === "complete" 
              ? "text-gray-600" 
              : "text-gray-500"
          }`}
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {label}
        </p>
        {children && (
          <div className="mt-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export function ChainOfThoughtSearchResults({ children }: ChainOfThoughtSearchResultsProps) {
  return <div className="flex flex-wrap gap-2 mt-2">{children}</div>;
}

export function ChainOfThoughtSearchResult({ children }: ChainOfThoughtSearchResultProps) {
  return (
    <div 
      className="px-2.5 py-1.5 rounded-md border border-gray-200 bg-gray-50"
      style={{ 
        fontFamily: "Poppins, sans-serif",
        fontSize: "12px",
        color: "#4B5563"
      }}
    >
      {children}
    </div>
  );
}

export function ChainOfThoughtImage({ children, caption }: ChainOfThoughtImageProps) {
  return (
    <div className="mt-3">
      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[150px]">
        {children}
      </div>
      {caption && (
        <p 
          className="text-xs text-gray-500 mt-2 italic"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}

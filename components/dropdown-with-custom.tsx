"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../lib/utils"

interface DropdownWithCustomProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  required?: boolean
}

export function DropdownWithCustom({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  required = false,
}: DropdownWithCustomProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customValue, setCustomValue] = useState("")
  const [isCustomMode, setIsCustomMode] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setIsCustomMode(false)
        setCustomValue("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleOptionSelect = (option: string) => {
    if (option === "custom") {
      setIsCustomMode(true)
      setCustomValue(value && !options.includes(value) ? value : "")
    } else {
      onChange(option)
      setIsOpen(false)
      setIsCustomMode(false)
      setCustomValue("")
    }
  }

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onChange(customValue.trim())
      setIsOpen(false)
      setIsCustomMode(false)
      setCustomValue("")
    }
  }

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleCustomSubmit()
    } else if (e.key === "Escape") {
      setIsCustomMode(false)
      setCustomValue("")
    }
  }

  return (
    <div className="space-y-2">
      <label 
        className="text-sm font-medium text-gray-900"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontStyle: "normal",
          fontSize: "14px",
          lineHeight: "150%",
          letterSpacing: "0%",
          color: "#111827",
        }}
      >
        {label} {required && <span style={{ color: "#111827" }}>*</span>}
      </label>
      
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative pr-10 text-left text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          style={{
            width: "450px",
            minWidth: "240px",
            height: "44px",
            borderRadius: "4px",
            paddingTop: "11px",
            paddingRight: "16px",
            paddingBottom: "11px",
            paddingLeft: "16px",
            border: "1px solid #E5E7EB",
            borderTop: "1px solid #E5E7EB",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "14px",
            lineHeight: "150%",
            letterSpacing: "0%",
            verticalAlign: "middle",
            color: value ? "#111827" : "#6B7280",
          }}
        >
          <span>
            {value || placeholder}
          </span>
          <ChevronDown className={cn(
            "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-transform",
            isOpen && "rotate-180"
          )} />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div 
            className="absolute z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg"
            style={{
              width: "450px",
              minWidth: "240px",
            }}
          >
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleOptionSelect(option)}
                  className={cn(
                    "w-full px-4 py-2 text-left text-sm hover:bg-gray-100",
                    value === option && "bg-blue-50 text-blue-600"
                  )}
                >
                  {option}
                </button>
              ))}
              
              {/* Custom option */}
              <button
                type="button"
                onClick={() => handleOptionSelect("custom")}
                className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 border-t border-gray-200"
              >
                + Add custom option
              </button>
            </div>
          </div>
        )}

        {/* Custom input mode */}
        {isCustomMode && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg p-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">Custom Value</label>
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={handleCustomKeyDown}
                placeholder="Enter custom value..."
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCustomSubmit}
                  className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomMode(false)
                    setCustomValue("")
                  }}
                  className="rounded border border-gray-300 px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

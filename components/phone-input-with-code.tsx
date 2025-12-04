"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface PhoneInputWithCodeProps {
  label: string
  placeholder?: string
  value: string
  countryCode: string
  onValueChange: (value: string) => void
  onCountryCodeChange: (code: string) => void
  required?: boolean
}

const countryCodes = [
  { code: "IND", name: "India", flag: "🇮🇳" },
  { code: "USA", name: "United States", flag: "🇺🇸" },
  { code: "GBR", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CAN", name: "Canada", flag: "🇨🇦" },
  { code: "AUS", name: "Australia", flag: "🇦🇺" },
  { code: "DEU", name: "Germany", flag: "🇩🇪" },
  { code: "FRA", name: "France", flag: "🇫🇷" },
  { code: "JPN", name: "Japan", flag: "🇯🇵" },
  { code: "CHN", name: "China", flag: "🇨🇳" },
  { code: "SGP", name: "Singapore", flag: "🇸🇬" },
]

export function PhoneInputWithCode({
  label,
  placeholder = "Enter your contact number",
  value,
  countryCode,
  onValueChange,
  onCountryCodeChange,
  required = false
}: PhoneInputWithCodeProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const selectedCountry = countryCodes.find(country => country.code === countryCode) || countryCodes[0]

  return (
    <div className="space-y-2">
      <label 
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 400,
          fontStyle: "normal",
          fontSize: "14px",
          lineHeight: "24px",
          letterSpacing: "0%",
          color: "#555555",
        }}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex">
        {/* Country Code Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 h-11 border border-gray-300 border-r-0 rounded-l-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "24px",
              letterSpacing: "0%",
              color: "#555555",
            }}
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span>{selectedCountry.code}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {countryCodes.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onCountryCodeChange(country.code)
                    setIsDropdownOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span>{country.name}</span>
                  <span className="ml-auto text-gray-500">{country.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="flex-1 h-11 rounded-r-lg border border-gray-300 px-4 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>
    </div>
  )
}

"use client"

import { useState, useRef, useEffect } from "react"
import { X, ChevronDown } from "lucide-react"
import { cn } from "../lib/utils"

interface MultiSelectInputProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  placeholder?: string
  required?: boolean
  width?: string
}

export function MultiSelectInput({
  label,
  value,
  onChange,
  options,
  placeholder = "Type to search or add new...",
  required = false,
  width = "450px",
}: MultiSelectInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState(options)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter options based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(option)
      )
      setFilteredOptions(filtered)
    } else {
      setFilteredOptions(options.filter(option => !value.includes(option)))
    }
  }, [inputValue, options, value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    setIsOpen(true)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const addItem = (item: string) => {
    if (item.trim() && !value.includes(item.trim())) {
      onChange([...value, item.trim()])
    }
    setInputValue("")
    setIsOpen(false)
  }

  const removeItem = (itemToRemove: string) => {
    onChange(value.filter(item => item !== itemToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (inputValue.trim()) {
        addItem(inputValue)
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  return (
    <div className="space-y-2">
      <label 
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
      
      {/* Selected items */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          style={{
            width: width,
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
            color: inputValue ? "#111827" : "#6B7280",
          }}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer flex items-center justify-center"
          style={{ 
            right: "12px",
            width: "16px",
            height: "16px",
            padding: 0, 
            background: "transparent", 
            border: "none",
          }}
        >
          <ChevronDown 
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )} 
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg"
            style={{
              width: width,
              minWidth: "240px",
            }}
          >
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => addItem(option)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  >
                    {option}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  {inputValue.trim() ? "No matching options" : "No available options"}
                </div>
              )}
              
              {/* Add custom option */}
              {inputValue.trim() && !options.includes(inputValue.trim()) && !value.includes(inputValue.trim()) && (
                <button
                  type="button"
                  onClick={() => addItem(inputValue)}
                  className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50"
                >
                  Add "{inputValue}"
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

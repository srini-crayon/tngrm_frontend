"use client"

import type React from "react"

import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface InputFieldProps {
  label: string
  placeholder: string
  type?: string
  value?: string
  onChange?: (value: string) => void
  rightElement?: React.ReactNode
}

export function InputField({ label, placeholder, type = "text", value, onChange, rightElement }: InputFieldProps) {
  return (
    <div className="space-y-2">
      {rightElement ? (
        <div className="flex items-center justify-between">
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
          </label>
          {rightElement}
        </div>
      ) : (
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
        </label>
      )}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full focus-visible:ring-1 focus-visible:ring-gray-400 focus-visible:border-gray-400 placeholder:italic placeholder:text-gray-400"
        style={{
          width: "100%",
          maxWidth: "504px",
          height: "42px",
          borderRadius: "4px",
          border: "1px solid #E5E7EB",
          backgroundColor: "#FFFFFF",
          fontFamily: "Poppins, sans-serif",
          fontWeight: 400,
          fontStyle: "normal",
          fontSize: "14px",
          lineHeight: "28px",
          letterSpacing: "0%",
          color: value ? "#181818" : "#B3B3B3",
        }}
        onFocus={(e) => {
          e.target.style.color = "#181818"
        }}
        onBlur={(e) => {
          e.target.style.color = e.target.value ? "#181818" : "#B3B3B3"
        }}
      />
    </div>
  )
}

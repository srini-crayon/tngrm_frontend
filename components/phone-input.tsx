"use client"

import { useState } from "react"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
}

export function PhoneInput({ value, onChange }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState("IND")

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900">Contact Number</Label>
      <div className="flex gap-2">
        <Select value={countryCode} onValueChange={setCountryCode}>
          <SelectTrigger className="h-11 w-24 rounded-lg border-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IND">IND</SelectItem>
            <SelectItem value="USA">USA</SelectItem>
            <SelectItem value="UK">UK</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="tel"
          placeholder="Enter your contact numer"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-11 flex-1 rounded-lg border-gray-200 text-sm focus-visible:ring-2 focus-visible:ring-gray-900/10"
        />
      </div>
    </div>
  )
}

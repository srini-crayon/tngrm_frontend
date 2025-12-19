"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, ArrowUp, X, ChevronDown } from "lucide-react"
import { useChatStore } from "../lib/store/chat.store"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import { VoiceInputControls } from "./voice-input-controls"

interface AgentSearchChatProps {
  externalValue?: string
  onExternalValueChange?: (value: string) => void
  onEnterChat?: (message: string) => void
}

export function AgentSearchChat({ externalValue, onExternalValueChange, onEnterChat }: AgentSearchChatProps) {
  const { mode, setMode } = useChatStore()
  const [searchInput, setSearchInput] = useState("")
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLTextAreaElement>(null)

  // Sync external value with internal state
  useEffect(() => {
    if (externalValue !== undefined) {
      setSearchInput(externalValue)
    }
  }, [externalValue])

  // Notify parent of changes
  const handleInputChange = (value: string) => {
    setSearchInput(value)
    onExternalValueChange?.(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Support select-all shortcut
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault()
      e.currentTarget.select()
      return
    }

    if (e.key === "Enter" && searchInput.trim()) {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (searchInput.trim()) {
      onEnterChat?.(searchInput.trim())
      setSearchInput("")
      onExternalValueChange?.("")
    }
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
    // Focus the text input after opening file picker
    setTimeout(() => {
      textInputRef.current?.focus()
    }, 100)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setAttachedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Auto-resize the textarea to fit content (wraps onto new lines and expands container)
  useEffect(() => {
    const el = textInputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
    el.style.maxHeight = '200px'
  }, [searchInput])

  return (
    <div className="w-full">
      <div
        className="mx-auto mb-8 max-w-5xl rounded-2xl bg-white p-4 shadow-lg"
        style={{
          border: "1px solid #E5E7EB",
        }}
      >
        {/* Upper section: Input */}
        <div className="flex items-center gap-3 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="*/*"
          />
          <div className="flex-1 flex items-start gap-2">
            <div className="relative w-full">
              {/* Plus sign component - merged with textarea */}
              <div
                style={{
                  position: "absolute",
                  left: "10px",
                  top: "30%",
                  transform: "translateY(-50%)",
                  color: "#6B7280",
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "18px",
                  lineHeight: "1.5",
                  pointerEvents: "none",
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  
                }}
              >
                +

              </div>
              <textarea
                ref={textInputRef}
                placeholder="I want an agent to review NDAs"
                className="w-full text-lg py-2 flex-1 resize-none border-none focus:outline-none focus:bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                value={searchInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ 
                  outline: 'none', 
                  boxShadow: 'none', 
                  border: 'none', 
                  borderWidth: '0',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  overflowY: 'auto',
                  minHeight: '40px',
                  maxHeight: '200px',
                  backgroundColor: 'transparent',
                  fontFamily: "Poppins, sans-serif",
                  paddingLeft: "30px",
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  setIsFocused(true)
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  setIsFocused(false)
                }}
              />
            </div>
            {attachedFile && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-700 truncate max-w-[150px]">
                  {attachedFile.name}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="flex-shrink-0 p-0.5 hover:bg-gray-200 rounded transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lower section: Buttons and controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Left side: Mode toggle */}
          <div className="flex items-center gap-4">
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(value) => {
                if (value) setMode(value as "explore" | "create")
              }}
              className="bg-gray-100 rounded-lg p-1"
            >
              <ToggleGroupItem
                value="explore"
                aria-label="Explore"
                className="px-4 py-2 text-sm rounded-md data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900"
                style={{
                  boxShadow: mode === "explore" 
                    ? "0px 3px 1px 0px #0000000A, 0px 3px 8px 0px #0000001F" 
                    : undefined,
                }}
              >
                Explore
              </ToggleGroupItem>
              <ToggleGroupItem
                value="create"
                aria-label="Create"
                className="px-4 py-2 text-sm rounded-md data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900"
                style={{
                  boxShadow: mode === "create" 
                    ? "0px 3px 1px 0px #0000000A, 0px 3px 8px 0px #0000001F" 
                    : undefined,
                }}
              >
                Create
              </ToggleGroupItem>
            </ToggleGroup>
            
            {/* Language selector */}
            <button
              type="button"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "150%",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#111827",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px 8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <span style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "150%",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#111827",
              }}>English</span>
              <ChevronDown className="h-4 w-4" style={{ color: "#111827" }} />
            </button>
          </div>

          {/* Right side: Microphone and Submit button */}
          <div className="flex items-center gap-3">
            {/* VoiceInputControls styled to show only mic button */}
            <div className="[&>div>button:first-child]:hidden [&>div>button:last-child]:h-10 [&>div>button:last-child]:w-10 [&>div>button:last-child]:rounded-full [&>div>button:last-child]:bg-white [&>div>button:last-child]:hover:bg-gray-50">
              <VoiceInputControls
                value={searchInput}
                onValueChange={handleInputChange}
                buttonSize="icon"
                buttonVariant="outline"
                ariaLabel="Use voice input for agent search"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!searchInput.trim()}
              className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Submit search"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



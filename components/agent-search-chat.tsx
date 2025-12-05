"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "./ui/input"
import ChatDialog from "./chat-dialog"
import { Plus, ArrowUp, ChevronDown, X } from "lucide-react"
import { useChatStore } from "../lib/store/chat.store"
import { VoiceInputControls } from "./voice-input-controls"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"

interface AgentSearchChatProps {
  externalValue?: string
  onExternalValueChange?: (value: string) => void
}

export function AgentSearchChat({ externalValue, onExternalValueChange }: AgentSearchChatProps) {
  const [chatOpen, setChatOpen] = useState(false)
  const { mode, setMode } = useChatStore()
  const [searchInput, setSearchInput] = useState("")
  const [language, setLanguage] = useState("English")
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchInput.trim()) {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (searchInput.trim()) {
      console.log('Opening chat dialog with message:', searchInput)
      setChatOpen(true)
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

  return (
    <div className="w-full">
      <div className="mx-auto mb-8 max-w-5xl rounded-2xl border bg-white p-4 shadow-lg">
        {/* Upper section: Plus icon + Input */}
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={handleAttachmentClick}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Attach file"
          >
            <Plus className="h-5 w-5 text-gray-400" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="*/*"
          />
          <div className="flex-1 flex items-center gap-2">
            <Input
              ref={textInputRef}
              placeholder="I want an agent to review NDAs"
              className="!border-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 hover:border-0 hover:ring-0 text-lg py-2 flex-1"
              value={searchInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{ 
                outline: 'none', 
                boxShadow: 'none', 
                border: 'none', 
                borderWidth: '0',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
              onFocus={(e) => {
                e.target.style.outline = 'none'
                e.target.style.boxShadow = 'none'
                e.target.style.border = 'none'
                e.target.style.borderWidth = '0'
              }}
              onBlur={(e) => {
                e.target.style.outline = 'none'
                e.target.style.boxShadow = 'none'
                e.target.style.border = 'none'
                e.target.style.borderWidth = '0'
              }}
            />
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
          {/* Left side: Explore, Create, Language dropdown */}
          <div className="flex items-center gap-3">
            <ToggleGroup
              type="single"
              value={mode}
              onValueChange={(value) => {
                if (value) setMode(value as "explore" | "create")
              }}
              className="rounded-lg bg-gray-50 p-1"
            >
              <ToggleGroupItem
                value="explore"
                aria-label="Explore"
                className="px-4 py-2 text-sm rounded-md data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900"
              >
                Explore
              </ToggleGroupItem>
              <ToggleGroupItem
                value="create"
                aria-label="Create"
                className="px-4 py-2 text-sm rounded-md data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900"
              >
                Create
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-white rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 cursor-pointer transition-colors"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
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
      <ChatDialog 
        open={chatOpen} 
        onOpenChange={setChatOpen} 
        initialMode={mode}
        initialMessage={searchInput}
      />
    </div>
  )
}



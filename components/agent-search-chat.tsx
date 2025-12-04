"use client"

import { useState } from "react"
import { Input } from "./ui/input"
import ChatDialog from "./chat-dialog"
import { Plus, ArrowUp, ChevronDown } from "lucide-react"
import { useChatStore } from "../lib/store/chat.store"
import { VoiceInputControls } from "./voice-input-controls"

export function AgentSearchChat() {
  const [chatOpen, setChatOpen] = useState(false)
  const { mode, setMode } = useChatStore()
  const [searchInput, setSearchInput] = useState("")
  const [language, setLanguage] = useState("English")

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchInput.trim()) {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (searchInput.trim()) {
      setChatOpen(true)
    }
  }

  return (
    <div className="w-full">
      <div className="mx-auto mb-8 max-w-5xl rounded-2xl border bg-white p-4 shadow-lg">
        {/* Upper section: Plus icon + Input */}
        <div className="flex items-center gap-3 mb-4">
          <Plus className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <Input
            placeholder="I want an agent to review NDAs"
            className="border-0 focus-visible:ring-0 text-lg py-2 flex-1"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Lower section: Buttons and controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Left side: Explore, Create, Language dropdown */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMode("explore")}
              className={`px-4 py-2 text-sm rounded-lg transition-colors border ${
                mode === "explore" 
                  ? "bg-white text-gray-900 border-gray-300 shadow-sm" 
                  : "bg-white text-gray-600 border-gray-300 hover:text-gray-900"
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => setMode("create")}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                mode === "create" 
                  ? "bg-gray-100 text-gray-900" 
                  : "bg-gray-50 text-gray-600 hover:text-gray-900"
              }`}
            >
              Create
            </button>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm text-gray-700 cursor-pointer hover:border-gray-400 transition-colors"
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
            <div className="[&>div>button:first-child]:hidden [&>div>button:last-child]:h-10 [&>div>button:last-child]:w-10 [&>div>button:last-child]:rounded-full [&>div>button:last-child]:border-gray-300 [&>div>button:last-child]:bg-white [&>div>button:last-child]:hover:bg-gray-50 [&>div>button:last-child]:border">
              <VoiceInputControls
                value={searchInput}
                onValueChange={setSearchInput}
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



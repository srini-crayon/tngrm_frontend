import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Safari-safe localStorage wrapper
const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      return null
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      // Silently handle localStorage errors
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      // Silently handle localStorage errors
    }
  },
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
  time: string
  letsBuild?: boolean
  letsBuildTimestamp?: number
  gatheredInfo?: Record<string, any>
  brdDownloadUrl?: string
  brdStatus?: string
  filteredAgentIds?: string[]
  filteredAgents?: {
    agent_id: string
    agent_name: string
    description: string
    by_value?: string
    by_capability?: string
    service_provider?: string
    asset_type?: string
    by_persona?: string
  }[]
}

type ChatState = {
  messages: ChatMessage[]
  sessionId: string
  mode: "create" | "explore"
  addMessage: (message: ChatMessage) => void
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void
  clearChat: () => void
  setMode: (mode: "create" | "explore") => void
  setSessionId: (sessionId: string) => void
}

const initialMessage: ChatMessage = {
  id: "m1",
  role: "assistant",
  text: "Hi! Tell me what you want to search.",
  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [initialMessage],
      sessionId: "",
      mode: "explore",
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      
      updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map(msg => 
          msg.id === id ? { ...msg, ...updates } : msg
        )
      })),
      
      clearChat: () => set(() => ({
        messages: [initialMessage],
        sessionId: `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      })),
      
      setMode: (mode) => set(() => ({ mode })),
      
      setSessionId: (sessionId) => set(() => ({ sessionId }))
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        messages: state.messages,
        sessionId: state.sessionId,
        mode: state.mode
      })
    }
  )
)

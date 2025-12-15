"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog"
import { X, Maximize2, Minimize2, ExternalLink, Brain, Zap, Sparkles, Trash2 } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { useChatStore, type ChatMessage } from "../lib/store/chat.store"

type MarkdownComponentProps = {
  children?: React.ReactNode
}

type ChatDialogProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialMode?: "create" | "explore"
  initialMessage?: string
}

// Agent Card Component for Chat with hover animations
function ChatAgentCard({ agent, index }: { agent: NonNullable<ChatMessage['filteredAgents']>[0]; index?: number }) {
  return (
    <Card 
      className="mt-3 shadow-none border-0 !py-0 !gap-0 agent-card-hover" 
      style={{ 
        backgroundColor: "#E8E8E8",
        animationDelay: index !== undefined ? `${index * 100}ms` : undefined
      }}
    >
      <CardContent className="p-4 !px-4 !py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{agent.agent_name}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{agent.description}</p>
          </div>
          <Link href={`/agents/${agent.agent_id}`}>
            <Button size="sm" variant="outline" className="ml-2 flex-shrink-0 shadow-none transition-all duration-200 hover:scale-105">
              <ExternalLink className="h-3 w-3 mr-1" />
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

// Suggested Agent Card Component for Explore Mode with animations
function SuggestedAgentCard({ agent, index }: { agent: NonNullable<ChatMessage['suggested_agents']>[0]; index?: number }) {
  return (
    <Card 
      className="mt-2 shadow-sm border border-gray-200 agent-card-hover card-stagger" 
      style={{
        animationDelay: index !== undefined ? `${index * 100}ms` : undefined
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-gray-900">{agent.solution_name}</h4>
              <Badge variant="outline" className="text-xs transition-all duration-200 hover:scale-105">
                {agent.segment}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
            {agent.trend_reference && (
              <p className="text-xs text-gray-500 italic">
                Related to: {agent.trend_reference}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Mega Trends Component for Explore Mode
function MegaTrendsSection({ megaTrends }: { megaTrends: string }) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Zap className="h-4 w-4 text-purple-600" />
          Mega Trends & Opportunities
        </h3>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-100">
        <div className="text-sm leading-relaxed prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }: MarkdownComponentProps) => <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>,
              h2: ({ children }: MarkdownComponentProps) => <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0">{children}</h2>,
              h3: ({ children }: MarkdownComponentProps) => <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h3>,
              h4: ({ children }: MarkdownComponentProps) => <h4 className="text-sm font-semibold mb-1 mt-2">{children}</h4>,
              p: ({ children }: MarkdownComponentProps) => <p className="mb-2 text-gray-700">{children}</p>,
              ul: ({ children }: MarkdownComponentProps) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
              ol: ({ children }: MarkdownComponentProps) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
              li: ({ children }: MarkdownComponentProps) => <li className="text-sm text-gray-700">{children}</li>,
              strong: ({ children }: MarkdownComponentProps) => <strong className="font-semibold text-gray-900">{children}</strong>,
              em: ({ children }: MarkdownComponentProps) => <em className="italic">{children}</em>,
            }}
          >
            {formatChatText(megaTrends)}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

// Typing Effect Component
function TypingEffect({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 20) // Adjust speed as needed
      
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text])
  
  return (
    <span>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse">|</span>}
    </span>
  )
}

// Wave Dots Component for typing indicator
function WaveDots() {
  return (
    <div className="flex items-center gap-1 px-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full wave-dot"
          style={{
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
    </div>
  )
}

// Enhanced Thinking Component with shimmer
function ThinkingIndicator() {
  const [thinkingStage, setThinkingStage] = useState(0)
  
  const thinkingMessages = [
    "Analyzing your request...",
    "Processing information...",
    "Generating response...",
    "Almost ready..."
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setThinkingStage(prev => (prev + 1) % thinkingMessages.length)
    }, 800)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 shimmer-bg" />
      <div className="relative flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Brain className="h-4 w-4 text-white animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Sparkles className="h-3 w-3 text-yellow-500 animate-bounce" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-700">AI Assistant</span>
            <WaveDots />
          </div>
          <p className="text-sm text-gray-600">{thinkingMessages[thinkingStage]}</p>
        </div>
      </div>
    </div>
  )
}

// Function to fetch agent details by ID
async function fetchAgentDetails(agentId: string) {
  try {
    const res = await fetch(`https://agents-store.onrender.com/api/agents/${agentId}`, {
      cache: "no-store"
    })
    if (!res.ok) throw new Error(`Failed to fetch agent ${agentId}: ${res.status}`)
    const data = await res.json()
    
    // Check if agent is approved before returning
    if (data?.agent) {
      const agentsRes = await fetch("https://agents-store.onrender.com/api/agents", { cache: "no-store" })
      if (agentsRes.ok) {
        const agentsData = await agentsRes.json()
        const agentInList = agentsData?.agents?.find((a: any) => a.agent_id === agentId)
        // Only return agent if approved
        if (agentInList?.admin_approved === "yes") {
          return data?.agent || null
        }
      }
    }
    
    return null
  } catch (err) {
    return null
  }
}

// Function to format chat text for better readability
function formatChatText(text: string): string {
  if (!text || text === "AI thinking...") return text
  
  // First, replace all escape sequences with actual characters
  let formatted = text
    .replace(/\\n\d+/g, '\n')        // Convert \n1, \n2, \n3, etc. to actual newline
    .replace(/\\n/g, '\n')           // Convert \n to actual newline
    .replace(/\\t/g, '\t')           // Convert \t to tab
    .replace(/\\r/g, '\r')           // Convert \r to carriage return
    .replace(/\\"/g, '"')            // Convert \" to quote
    .replace(/\\'/g, "'")            // Convert \' to apostrophe
    .replace(/\\\\/g, '\\')          // Convert \\ to backslash
  
  // Now format the text for markdown
  return formatted
    // Convert \n\n to markdown paragraph breaks (already done, but keep structure)
    .replace(/\n\n\n+/g, '\n\n')     // Clean up multiple consecutive newlines
    // Keep the original structure for headers, lists, etc.
    .trim()
}

export default function ChatDialog({ open, onOpenChange, initialMode = "explore", initialMessage }: ChatDialogProps) {
  const { 
    messages, 
    sessionId, 
    mode, 
    addMessage, 
    updateMessage, 
    clearChat, 
    setMode, 
    setSessionId 
  } = useChatStore()
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [ripple, setRipple] = useState<{ x: number; y: number; id: string } | null>(null)
  const dialogContentRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollableContentRef = useRef<HTMLDivElement>(null)
  
  // Debug: Log when dialog should be open
  useEffect(() => {
    if (open) {
      console.log('ChatDialog: open is true, Dialog should be visible')
    }
  }, [open])

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (open) {
      // Save current scroll position
      const scrollY = window.scrollY
      const scrollX = window.scrollX
      
      // Lock body scroll
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = `-${scrollX}px`
      document.body.style.width = '100%'
      document.body.style.height = '100%'
      document.body.style.overflow = 'hidden'
      
      // Also lock html scroll
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.position = 'fixed'
      document.documentElement.style.width = '100%'
      document.documentElement.style.height = '100%'
      
      return () => {
        // Restore scroll position
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.width = ''
        document.body.style.height = ''
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        document.documentElement.style.position = ''
        document.documentElement.style.width = ''
        document.documentElement.style.height = ''
        window.scrollTo(scrollX, scrollY)
      }
    }
  }, [open])

  // Force positioning with direct DOM manipulation using MutationObserver
  useEffect(() => {
    if (open) {
      let isPositioning = false
      let lastUpdateTime = 0
      let updateTimeout: NodeJS.Timeout | null = null
      const DEBOUNCE_MS = 100 // Debounce updates to prevent infinite loops
      
      const updatePosition = (element: HTMLElement, force = false) => {
        const now = Date.now()
        // Prevent infinite loops by checking if we're already positioning or if update was too recent
        if ((isPositioning && !force) || (now - lastUpdateTime < DEBOUNCE_MS && !force)) {
          return
        }
        
        isPositioning = true
        lastUpdateTime = now
        
        try {
          // Find segment 1 (hero section) - the first section with fade-in-section class
          // This is the hero section that contains "Agent Store" heading
          let segment1Bottom = 0
          
          // Try multiple selectors to find the hero section
          let heroSection: HTMLElement | null = null
          
          // Try section with fade-in-section class first
          heroSection = document.querySelector('section.fade-in-section') as HTMLElement
          
          // If not found, try section containing fade-in-section element
          if (!heroSection) {
            try {
              heroSection = document.querySelector('section:has(.fade-in-section)') as HTMLElement
            } catch (e) {
              // :has() might not be supported, try alternative
            }
          }
          
          // If still not found, try section containing fade-in-blur
          if (!heroSection) {
            try {
              heroSection = document.querySelector('section:has(.fade-in-blur)') as HTMLElement
            } catch (e) {
              // :has() might not be supported
            }
          }
          
          // If found, use it
          if (heroSection) {
            const rect = heroSection.getBoundingClientRect()
            // Get the bottom position relative to viewport
            segment1Bottom = rect.bottom
          } else {
            // Fallback: look for the section before the filters section (bg-white)
            const allSections = Array.from(document.querySelectorAll('section'))
            const filtersSection = allSections.find(section => 
              section.classList.contains('bg-white') || 
              section.querySelector('.bg-white')
            )
            
            if (filtersSection && allSections.indexOf(filtersSection) > 0) {
              const heroIndex = allSections.indexOf(filtersSection) - 1
              const hero = allSections[heroIndex]
              if (hero) {
                const rect = hero.getBoundingClientRect()
                segment1Bottom = rect.bottom
              }
            } else if (allSections.length > 0) {
              // Use first section as fallback
              const rect = allSections[0].getBoundingClientRect()
              segment1Bottom = rect.bottom
            } else {
              // Last resort: use viewport calculation
              segment1Bottom = window.innerHeight * 0.6
            }
          }
          
          // Calculate viewport dimensions and safe margins
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight
          const margin = 24
          
          if (isExpanded) {
            // Expanded dialog: center bottom of hero section
            const dialogWidth = Math.min(960, viewportWidth - (margin * 2))
            const bottomOffset = Math.max(margin, viewportHeight - segment1Bottom)
            const maxDialogHeight = Math.min(640, Math.max(400, segment1Bottom - margin * 2))
            
            // Center horizontally - calculate left position to perfectly center the dialog
            // Ensure it doesn't go below margin on left side
            const calculatedLeft = (viewportWidth - dialogWidth) / 2
            const leftPosition = Math.max(margin, calculatedLeft)
            
            // Apply positioning styles for expanded dialog
            element.style.setProperty('position', 'fixed', 'important')
            element.style.setProperty('bottom', `${bottomOffset}px`, 'important')
            element.style.setProperty('left', `${leftPosition}px`, 'important')
            element.style.setProperty('right', 'auto', 'important')
            element.style.setProperty('top', 'auto', 'important')
            element.style.setProperty('transform', 'none', 'important')
            element.style.setProperty('margin', '0', 'important')
            element.style.setProperty('z-index', '9999', 'important')
            element.style.setProperty('width', `${dialogWidth}px`, 'important')
            element.style.setProperty('max-width', `${dialogWidth}px`, 'important')
            element.style.setProperty('min-width', `${dialogWidth}px`, 'important')
            element.style.setProperty('max-height', `${maxDialogHeight}px`, 'important')
            element.style.setProperty('height', 'auto', 'important')
            element.style.setProperty('overflow', 'hidden', 'important')
            element.style.setProperty('visibility', 'visible', 'important')
            element.style.setProperty('opacity', '1', 'important')
            element.style.setProperty('display', 'grid', 'important')
            element.style.setProperty('pointer-events', 'auto', 'important')
          } else {
            // Non-expanded dialog: right side, bottom of hero section
            const dialogWidth = Math.min(600, viewportWidth - (margin * 2))
            const bottomOffset = Math.max(margin, viewportHeight - segment1Bottom)
            const maxDialogHeight = Math.min(520, Math.max(400, segment1Bottom - margin * 2))
            
            // Apply positioning styles for non-expanded dialog
            element.style.setProperty('position', 'fixed', 'important')
            element.style.setProperty('bottom', `${bottomOffset}px`, 'important')
            element.style.setProperty('right', `${margin}px`, 'important')
            element.style.setProperty('top', 'auto', 'important')
            element.style.setProperty('left', 'auto', 'important')
            element.style.setProperty('transform', 'none', 'important')
            element.style.setProperty('margin', '0', 'important')
            element.style.setProperty('z-index', '9999', 'important')
            element.style.setProperty('width', `${dialogWidth}px`, 'important')
            element.style.setProperty('max-width', `${dialogWidth}px`, 'important')
            element.style.setProperty('max-height', `${maxDialogHeight}px`, 'important')
            element.style.setProperty('height', 'auto', 'important')
            element.style.setProperty('overflow', 'hidden', 'important')
            element.style.setProperty('visibility', 'visible', 'important')
            element.style.setProperty('opacity', '1', 'important')
            element.style.setProperty('display', 'grid', 'important')
            element.style.setProperty('pointer-events', 'auto', 'important')
          }
        } finally {
          // Use setTimeout to reset flag after a delay to prevent rapid re-triggering
          setTimeout(() => {
            isPositioning = false
          }, DEBOUNCE_MS)
        }
      }
      
      // Debounced update function
      const debouncedUpdate = (element: HTMLElement, force = false) => {
        if (updateTimeout) {
          clearTimeout(updateTimeout)
        }
        updateTimeout = setTimeout(() => {
          updatePosition(element, force)
        }, force ? 0 : DEBOUNCE_MS)
      }
      
      // Try to find and position element
      const tryUpdate = () => {
        const element = document.querySelector('[data-slot="dialog-content"]') as HTMLElement
        if (element) {
          // Use requestAnimationFrame to ensure styles are applied after Radix UI
          requestAnimationFrame(() => {
            updatePosition(element, true)
          })
          return true
        }
        return false
      }
      
      // Handle window resize and scroll
      const handleResize = () => {
        const element = document.querySelector('[data-slot="dialog-content"]') as HTMLElement
        if (element) {
          updatePosition(element, true)
        }
      }
      
      const handleScroll = () => {
        const element = document.querySelector('[data-slot="dialog-content"]') as HTMLElement
        if (element) {
          updatePosition(element, true)
        }
      }
      
      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      // Watch for dialog element being added to DOM
      let observer: MutationObserver | null = null
      
      // Try to find element immediately
      if (tryUpdate()) {
        // Element found, no need for observer
      } else {
        // Use MutationObserver to catch when element is added
        observer = new MutationObserver(() => {
          const element = document.querySelector('[data-slot="dialog-content"]') as HTMLElement
          if (element) {
            tryUpdate()
            // Disconnect observer once element is found
            if (observer) {
              observer.disconnect()
              observer = null
            }
          }
        })
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        })
        
        // Fallback: try a few times with delays
        const timers = [
          setTimeout(() => tryUpdate(), 0),
          setTimeout(() => tryUpdate(), 50),
          setTimeout(() => tryUpdate(), 100),
          setTimeout(() => tryUpdate(), 200)
        ]

        return () => {
          if (observer) observer.disconnect()
          if (updateTimeout) clearTimeout(updateTimeout)
          timers.forEach(timer => clearTimeout(timer))
          window.removeEventListener('resize', handleResize)
          window.removeEventListener('scroll', handleScroll)
        }
      }
      
      return () => {
        if (observer) observer.disconnect()
        if (updateTimeout) clearTimeout(updateTimeout)
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [open, isExpanded])

  useEffect(() => {
    if (!sessionId) {
      const sid = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      setSessionId(sid)
    }
  }, [sessionId, setSessionId])

  // Auto-scroll to bottom when messages change with smooth momentum
  useEffect(() => {
    // Scroll to bottom when messages change or when thinking/sending state changes
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        // Use scrollIntoView for smooth scrolling to the latest message
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end',
          inline: 'nearest'
        })
      } else if (scrollableContentRef.current) {
        // Fallback: scroll to bottom of scrollable container with smooth behavior
        scrollableContentRef.current.scrollTo({
          top: scrollableContentRef.current.scrollHeight,
          behavior: 'smooth'
        })
      }
    }
    
    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      setTimeout(scrollToBottom, 100)
    })
  }, [messages, isThinking, isSending])

  // Ensure mode resets to the requested initialMode whenever dialog opens
  useEffect(() => {
    if (open) {
      // Only set mode if initialMode is provided and different from current mode
      if (initialMode && initialMode !== mode) {
        setMode(initialMode)
      }
      setIsExpanded(false)
      // If there's an initial message, set it as input and auto-send
      if (initialMessage && initialMessage.trim()) {
        setInput(initialMessage)
        // Auto-send the message after a short delay to ensure the dialog is fully open
        setTimeout(() => {
          handleSendMessage(initialMessage)
        }, 300)
      }
      
      // Scroll to bottom when dialog opens
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end',
            inline: 'nearest'
          })
        } else if (scrollableContentRef.current) {
          scrollableContentRef.current.scrollTop = scrollableContentRef.current.scrollHeight
        }
      }, 100)
    }
  }, [open, initialMode, initialMessage, setMode, mode])

  async function handleSendMessage(messageText: string) {
    if (!messageText.trim()) return
    const now = new Date()
    const timeString = now.toLocaleString([], { 
      month: "short", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    })
    const userText = messageText
    addMessage({ id: crypto.randomUUID(), role: "user", text: userText, time: timeString })
    setInput("")
    setCharCount(0)
    setIsSending(true)
    setIsThinking(true)
    
    // Show feedback
    setFeedback({ type: 'success', message: 'Message sent!' })
    setTimeout(() => setFeedback(null), 2000)
    
    // Add thinking message immediately
    const thinkingMessageId = crypto.randomUUID()
    addMessage({ id: thinkingMessageId, role: "assistant", text: "AI thinking...", time: timeString })
    
    try {
      const res = await fetch("https://agents-store.onrender.com/api/chat", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode, query: userText, session_id: sessionId }),
      })
      const json = await res.json().catch(() => null)
      const reply = json?.data?.response || "Sorry, something went wrong. Please try again later."
      
      // Check if the API response has filtered_agents data (array of agent IDs)
      let filteredAgentIds = null
      if (json?.data?.filtered_agents && Array.isArray(json.data.filtered_agents) && json.data.filtered_agents.length > 0) {
        filteredAgentIds = json.data.filtered_agents
      }
      
      // Check if lets_build flag is set
      const letsBuild = json?.data?.lets_build === true
      const gatheredInfo = json?.data?.gathered_info || {}
      const brdDownloadUrl = json?.data?.brd_download_url || null
      const brdStatus = json?.data?.brd_status || null
      
      // Extract mega_trends and suggested_agents for explore mode
      const megaTrends = json?.data?.mega_trends || null
      const suggestedAgents = json?.data?.suggested_agents && Array.isArray(json.data.suggested_agents) 
        ? json.data.suggested_agents 
        : null
      
      const replyTs = json?.data?.timestamp
        ? new Date(json.data.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
        : new Date().toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
      
      // Replace thinking message with actual response
      updateMessage(thinkingMessageId, { 
        text: reply, 
        time: replyTs,
        filteredAgentIds, 
        letsBuild, 
        letsBuildTimestamp: letsBuild ? Date.now() : undefined,
        gatheredInfo,
        brdDownloadUrl,
        brdStatus,
        mega_trends: megaTrends,
        suggested_agents: suggestedAgents
      })
      
      // If we have agent IDs, fetch their details
      if (filteredAgentIds && filteredAgentIds.length > 0) {
        try {
          const agentDetailsPromises = filteredAgentIds.map((id: string) => fetchAgentDetails(id))
          const agentDetails = await Promise.all(agentDetailsPromises)
          const validAgents = agentDetails.filter(agent => agent !== null)
          
          if (validAgents.length > 0) {
            // Update the message with agent details
            updateMessage(thinkingMessageId, { filteredAgents: validAgents })
          }
        } catch (err) {
          // Silently handle error fetching agent details
        }
      }
    } catch (e) {
      const errTs = new Date().toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
      updateMessage(thinkingMessageId, {
          text: "I'm currently experiencing technical difficulties. Please try again.",
        time: errTs
      })
      // Show error feedback
      setFeedback({ type: 'error', message: 'Failed to send message' })
      setTimeout(() => setFeedback(null), 2000)
    } finally {
      setIsSending(false)
      setIsThinking(false)
    }
  }

  async function handleSend() {
    if (!input.trim()) return
    await handleSendMessage(input)
  }

  // Handle message bubble click for ripple effect
  const handleMessageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setRipple({ x, y, id: Date.now().toString() })
    setTimeout(() => setRipple(null), 600)
  }

  function handleClearChat() {
    clearChat()
    setInput("")
  }
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className={`p-0 rounded-2xl border shadow-2xl transition-all duration-300 ease-out dialog-enhanced-enter ${
            isExpanded 
              ? "sm:max-w-[900px] md:max-w-[960px] animate-in slide-in-from-bottom-4" 
              : "sm:max-w-[600px] md:max-w-[600px] animate-in slide-in-from-bottom-4 chat-dialog-bottom-right"
          }`}
          style={!isExpanded ? {
            overflow: 'hidden',
            maxHeight: 'calc(100vh - 48px)',
            height: 'auto',
            zIndex: 9999,
            maxWidth: '600px',
            width: 'calc(100% - 2rem)',
            display: 'flex',
            flexDirection: 'column',
          } as React.CSSProperties : {
            overflow: 'hidden',
            maxHeight: 'calc(100vh - 48px)',
            height: 'auto',
            zIndex: 9999,
            maxWidth: '960px',
            display: 'flex',
            flexDirection: 'column',
          } as React.CSSProperties}
          showCloseButton={false}
          showOverlay={true}
          disableCentering={true}
        >
          <DialogTitle className="sr-only">AI Assistant Chat</DialogTitle>
          <DialogDescription className="sr-only">Chat with AI assistant to explore or create agents</DialogDescription>
          <div className="bg-white" style={!isExpanded ? { 
            height: '520px',
            minHeight: '520px', 
            maxHeight: 'calc(100vh - 48px)', 
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            overflow: 'hidden' 
          } : { 
            height: '640px',
            minHeight: '640px', 
            maxHeight: 'calc(100vh - 48px)', 
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            overflow: 'hidden' 
          }}>
            <div className="flex items-center justify-between border-b px-4 py-3 bg-gradient-to-r from-white to-gray-50">
            <div className="flex items-center gap-3">
              <div className="relative h-6 w-6">
                <Image src="/chat_icon.png" alt="chat" fill className="object-contain" />
              </div>
              <div className="text-sm font-medium">AI Assistant</div>
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <ToggleGroup
                type="single"
                value={mode}
                onValueChange={(value) => {
                  if (value) setMode(value as "explore" | "create")
                }}
                className="rounded-lg bg-gray-100 p-0.5 hidden sm:flex"
              >
                <ToggleGroupItem
                  value="explore"
                  aria-label="Explore"
                  className="px-3 py-1 text-xs rounded-md data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900"
                >
                  Explore
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="create"
                  aria-label="Create"
                  className="px-3 py-1 text-xs rounded-md data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900"
                >
                  Create
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
              <div className="flex items-center gap-2">
                <button aria-label="Clear Chat" onClick={handleClearChat} className="rounded-full p-1 hover:bg-gray-100" title="Clear conversation">
                  <Trash2 className="h-4 w-4" />
                </button>
                <button aria-label={isExpanded ? "Restore" : "Expand"} onClick={() => setIsExpanded(!isExpanded)} className="rounded-full p-1 hover:bg-gray-100">
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
                <button aria-label="Close" onClick={() => onOpenChange(false)} className="rounded-full p-1 hover:bg-gray-100">
                  <X className="h-4 w-4" />
              </button>
            </div>
          </div>
            <div 
              ref={scrollableContentRef}
              className="space-y-4 overflow-y-auto overflow-x-hidden px-4 py-4 smooth-scroll" 
              style={{ 
                minHeight: 0, 
                maxHeight: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth'
              }}
            >
            {messages.map((m, index) => (
              <div 
                key={m.id} 
                className={`${m.role === "user" ? "flex flex-col items-end" : "flex flex-col items-start"} ${
                  m.role === "user" ? "user-message-enter" : "message-enter"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                <div className="flex max-w-[80%] items-end gap-2">
                  {m.role === "assistant" && (
                    <div className="relative mt-1 h-5 w-5 shrink-0">
                      <Image src="/chat_icon.png" alt="bot" fill className="object-contain" />
                    </div>
                  )}
                  <div 
                    className={`message-bubble ${
                      m.role === "user"
                        ? "rounded-xl px-4 py-2 text-white"
                        : "rounded-xl bg-gray-100 px-4 py-2 text-gray-900"
                    }`}
                    style={m.role === "user" ? { backgroundColor: "#6853D5" } : undefined}
                    onClick={handleMessageClick}
                  >
                    {ripple && (
                      <span
                        className="ripple-effect"
                        style={{
                          left: ripple.x,
                          top: ripple.y,
                        }}
                      />
                    )}
                    {m.role === "assistant" ? (
                      <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }: MarkdownComponentProps) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                            h2: ({ children }: MarkdownComponentProps) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                            h3: ({ children }: MarkdownComponentProps) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                            p: ({ children }: MarkdownComponentProps) => <p className="mb-2">{children}</p>,
                            ul: ({ children }: MarkdownComponentProps) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }: MarkdownComponentProps) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({ children }: MarkdownComponentProps) => <li className="text-sm">{children}</li>,
                            code: ({ children }: MarkdownComponentProps) => <code className="bg-gray-200 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                            pre: ({ children }: MarkdownComponentProps) => <pre className="bg-gray-200 p-2 rounded text-xs font-mono overflow-x-auto mb-2">{children}</pre>,
                            blockquote: ({ children }: MarkdownComponentProps) => <blockquote className="border-l-4 border-gray-300 pl-2 italic mb-2">{children}</blockquote>,
                            strong: ({ children }: MarkdownComponentProps) => <strong className="font-semibold">{children}</strong>,
                            em: ({ children }: MarkdownComponentProps) => <em className="italic">{children}</em>,
                          }}
                        >
                          {formatChatText(m.text)}
                        </ReactMarkdown>
                        
                        {/* Show Mega Trends and Suggested Agents in Explore Mode */}
                        {mode === "explore" && m.mega_trends && (
                          <MegaTrendsSection megaTrends={m.mega_trends} />
                        )}
                        
                        {mode === "explore" && m.suggested_agents && m.suggested_agents.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="mb-3">
                              <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-purple-600" />
                                Suggested Agents
                              </h3>
                            </div>
                            <div className="space-y-2">
                              {m.suggested_agents.map((agent, index) => (
                                <SuggestedAgentCard 
                                  key={`suggested-${index}`} 
                                  agent={agent} 
                                  index={index}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Show Let's Build buttons if lets_build flag is true */}
                        {m.letsBuild === true && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row gap-2">
                            <Link href="/contact" className="flex-1">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2">
                                Contact Us to Start Building
                              </Button>
                            </Link>
                            <Button 
                              onClick={async () => {
                                try {
                                  // Use the BRD download URL from API if available, otherwise fall back
                                  const downloadUrl = m.brdDownloadUrl 
                                    ? `https://agents-store.onrender.com${m.brdDownloadUrl}`
                                    : `https://agents-store.onrender.com/api/chat/download-brd`
                                  
                                  const response = await fetch(downloadUrl, {
                                    method: m.brdDownloadUrl ? 'GET' : 'POST',
                                    headers: m.brdDownloadUrl ? {} : {
                                      'Content-Type': 'application/json',
                                    },
                                    body: m.brdDownloadUrl ? undefined : JSON.stringify({
                                      session_id: sessionId,
                                      gathered_info: m.gatheredInfo || {}
                                    })
                                  })
                                  
                                  if (!response.ok) throw new Error('Failed to download BRD')
                                  
                                  // Get the blob and download it
                                  const blob = await response.blob()
                                  const url = window.URL.createObjectURL(blob)
                                  const a = document.createElement('a')
                                  a.href = url
                                  a.download = `BRD_${sessionId}.docx`
                                  document.body.appendChild(a)
                                  a.click()
                                  window.URL.revokeObjectURL(url)
                                  document.body.removeChild(a)
                                } catch (error) {
                                  alert('Failed to download BRD document. Please try again or contact support.')
                                }
                              }}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={(() => { if (!m.letsBuildTimestamp) return true; const elapsed = Date.now() - m.letsBuildTimestamp; return elapsed < 5000; })()}
                            >
                              Download BRD Document
                            </Button>
                            </div>
                          </div>
                        )}
                        
                        {/* Show Agent Cards if filteredAgents are present */}
                        {m.filteredAgents && m.filteredAgents.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {m.filteredAgents.map((agent, index) => (
                              <ChatAgentCard 
                                key={`${agent.agent_id}-${index}`} 
                                agent={agent} 
                                index={index}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm leading-relaxed">
                        {m.text === "AI thinking..." ? (
                          <ThinkingIndicator />
                        ) : (
                          m.text
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-[10px] text-gray-500 mt-1 ${m.role === "user" ? "mr-2" : "ml-7"}`}>{m.time}</span>
              </div>
            ))}
            {/* Invisible element at the end to scroll to */}
            <div ref={messagesEndRef} style={{ height: '1px', width: '100%' }} />
          </div>
            <div className="border-t px-3 py-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    setCharCount(e.target.value.length)
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter" && !isSending) handleSend() }}
                  placeholder="Type your message..."
                  className="flex-1 input-focus-ring"
                  disabled={isSending}
                />
                <Button 
                  onClick={handleSend} 
                  className="bg-black text-white hover:bg-black/90 button-shine transition-all duration-200 active:scale-95" 
                  disabled={isSending}
                  onMouseDown={(e) => {
                    e.currentTarget.classList.add('button-press')
                    setTimeout(() => e.currentTarget.classList.remove('button-press'), 200)
                  }}
                >
                  {isSending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full send-spinner" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <span>Send</span>
                  )}
                </Button>
              </div>
              {charCount > 0 && (
                <div className="text-xs text-gray-500 counter-enter px-1">
                  {charCount} {charCount === 1 ? 'character' : 'characters'}
                </div>
              )}
            </div>
          </div>
          
          {/* Feedback Toast */}
          {feedback && (
            <div 
              className={`fixed bottom-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
                feedback.type === 'success' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              } toast-enter`}
            >
              {feedback.message}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}



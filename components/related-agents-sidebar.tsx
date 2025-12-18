"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AgentIcon } from "./agent-icon"
import { ChevronLeft, ChevronRight } from "lucide-react"

type RelatedAgent = {
  agent_id?: string
  agent_name?: string
  description?: string
  demo_preview?: string
}

type RelatedAgentsSidebarProps = {
  relatedAgents: RelatedAgent[]
  agentName?: string
  agentsSource?: 'bundled' | 'similar' | null
}

export function RelatedAgentsSidebar({ relatedAgents, agentName, agentsSource }: RelatedAgentsSidebarProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  if (relatedAgents.length === 0) {
    return null
  }

  // Determine title based on which API was used
  const title = agentsSource === 'bundled' 
    ? `${agentName || 'Agent'} powered by Agents`
    : agentsSource === 'similar'
    ? 'Check out some of the similar agents in the store'
    : `${agentName || 'Agent'} powered by Agents`

  const cardsPerView = 3
  const maxIndex = Math.max(0, relatedAgents.length - cardsPerView)

  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => {
      const next = prev + cardsPerView
      return next > maxIndex ? 0 : next
    })
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const goToPrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => {
      const prevIndex = prev - cardsPerView
      return prevIndex < 0 ? maxIndex : prevIndex
    })
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (relatedAgents.length <= cardsPerView) return
    
    const interval = setInterval(() => {
      if (!isTransitioning) {
        setIsTransitioning(true)
        setCurrentIndex((prev) => {
          const next = prev + cardsPerView
          return next > maxIndex ? 0 : next
        })
        setTimeout(() => setIsTransitioning(false), 300)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [relatedAgents.length, isTransitioning, maxIndex])

  // Get the 3 agents to display
  const visibleAgents = relatedAgents.slice(currentIndex, currentIndex + cardsPerView)

  return (
    <div 
      style={{
        minWidth: '490px',
        width: 'fit-content',
        maxWidth: '490px',
        backgroundColor: '#F9FAFB',
        padding: '24px',
        borderRadius: '8px',
        position: 'relative',
        height: 'auto',
        marginLeft: '0',
        alignSelf: 'flex-start',
      }}
      className="flex-shrink-0"
    >
      <h4 
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '16px',
          fontWeight: 600,
          color: '#111827',
          marginBottom: '16px',
          lineHeight: '21px',
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </h4>
      
      {/* Agent Cards Container */}
      <div 
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          className="space-y-3"
          style={{
            transition: 'opacity 0.3s ease-in-out',
            opacity: isTransitioning ? 0.5 : 1,
          }}
        >
          {visibleAgents.map((agent, idx) => (
            <Link
              key={agent.agent_id || `${currentIndex + idx}`}
              href={`/agents/${agent.agent_id}`}
              className="block bg-white rounded-2xl p-2 border border-gray-100 hover:border-gray-300 transition-colors"
            >
              <div className="flex gap-2 items-center">
                <div 
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid #F3F4F6',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <AgentIcon
                    demoPreview={agent?.demo_preview}
                    agentName={agent?.agent_name || 'Agent'}
                    size={40}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#111827',
                      marginBottom: '4px',
                      lineHeight: '21px',
                    }}
                    className="truncate"
                  >
                    {agent.agent_name || 'Agent Name'}
                  </h5>
                  <p 
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: '12px',
                      fontWeight: 400,
                      color: '#344054',
                      lineHeight: '1.5',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {agent.description || 'Agent description'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      {relatedAgents.length > cardsPerView && (
        <div className="flex items-center justify-between mt-4">
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            disabled={isTransitioning}
            className="p-1.5 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous agents"
            style={{
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dots Indicator - Show dots for each group of 3 */}
          <div className="flex gap-1.5 items-center">
            {Array.from({ length: Math.ceil(relatedAgents.length / cardsPerView) }).map((_, groupIdx) => {
              const groupStartIndex = groupIdx * cardsPerView
              const isActive = currentIndex >= groupStartIndex && currentIndex < groupStartIndex + cardsPerView
              return (
                <button
                  key={groupIdx}
                  onClick={() => {
                    if (!isTransitioning) {
                      setIsTransitioning(true)
                      setCurrentIndex(groupStartIndex)
                      setTimeout(() => setIsTransitioning(false), 300)
                    }
                  }}
                  className="rounded-full transition-all"
                  style={{
                    width: isActive ? '24px' : '8px',
                    height: '8px',
                    backgroundColor: isActive ? '#111827' : '#D1D5DB',
                    cursor: 'pointer',
                  }}
                  aria-label={`Go to agents ${groupStartIndex + 1}-${Math.min(groupStartIndex + cardsPerView, relatedAgents.length)}`}
                />
              )
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className="p-1.5 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next agents"
            style={{
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  )
}


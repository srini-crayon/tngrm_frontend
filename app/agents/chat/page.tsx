"use client";

import { Button } from "../../../components/ui/button";
import { ArrowUp, ExternalLink } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "../../../lib/store/chat.store";
import ReactMarkdown from "react-markdown";
import { ToggleGroup, ToggleGroupItem } from "../../../components/ui/toggle-group";
import { VoiceInputControls } from "../../../components/voice-input-controls";
import { formatTime, formatDateTime } from "../../../lib/utils";
import Link from "next/link";

interface Agent {
  agent_id: string;
  agent_name: string;
  description?: string;
  by_capability?: string;
  by_persona?: string;
  by_value?: string;
  service_provider?: string;
  asset_type?: string;
}

// Agent Card Component matching Figma design
function AgentResponseCard({ agent }: { agent: Agent }) {
  const [agentDetails, setAgentDetails] = useState<{
    features?: string;
    roi?: string;
    by_value?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        const res = await fetch(`https://agents-store.onrender.com/api/agents/${agent.agent_id}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setAgentDetails({
            features: data?.agent?.features,
            roi: data?.agent?.roi,
            by_value: data?.agent?.by_value || agent.by_value,
          });
        }
      } catch (err) {
        console.error("Error fetching agent details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (agent.agent_id) {
      fetchAgentDetails();
    }
  }, [agent.agent_id]);

  // Parse features from string
  const parseFeatures = (featuresStr?: string): string[] => {
    if (!featuresStr || featuresStr === "na") return [];
    return featuresStr
      .split(/[;\n]+/)
      .map(s => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, ''))
      .filter(Boolean)
      .filter(item => !/^\d+\./.test(item.trim())); // Filter out numbered items
  };

  const features = parseFeatures(agentDetails?.features || agent.description);
  const valueProposition = agentDetails?.by_value || agent.by_value || "";

  // Combine features with value proposition as last bullet point
  const allFeatures = valueProposition 
    ? [...features, `Value Proposition: ${valueProposition}`]
    : features;

  return (
    <div 
      className="bg-gray-50 rounded-lg p-6 my-4 border border-gray-200"
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#F8F8FA",
        borderRadius: "8px",
      }}
    >
      {/* Header: Agent Name and View Link */}
      <div className="flex items-start justify-between mb-3">
        <h3 
          className="text-xl font-bold text-gray-900"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            lineHeight: "1.3",
            color: "#091917",
          }}
        >
          {agent.agent_name}
        </h3>
        <Link 
          href={`/agents/${agent.agent_id}`}
          className="text-blue-600 hover:text-blue-700 font-semibold uppercase text-sm flex items-center gap-1"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontSize: "13px",
            letterSpacing: "0.5px",
            color: "#2563EB",
          }}
        >
          VIEW AGENT
          <span className="text-blue-600" style={{ fontSize: "16px" }}>›</span>
        </Link>
      </div>

      {/* Description */}
      {agent.description && (
        <p 
          className="text-gray-700 mb-4"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#374151",
            marginBottom: "16px",
          }}
        >
          {agent.description}
        </p>
      )}

      {/* Key Features */}
      {allFeatures.length > 0 && (
        <div>
          <h4 
            className="font-semibold text-gray-900 mb-2 uppercase"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "0.5px",
              color: "#091917",
              marginBottom: "8px",
            }}
          >
            KEY FEATURES
          </h4>
          <ul className="list-disc list-inside space-y-1" style={{ marginLeft: "8px" }}>
            {allFeatures.map((feature, index) => (
              <li 
                key={index}
                className="text-gray-700"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "#374151",
                  marginBottom: "4px",
                }}
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Inline Agent Card Component (for inline mentions)
function InlineAgentCard({ agent }: { agent: Agent }) {
  return (
    <Link 
      href={`/agents/${agent.agent_id}`}
      className="inline-block my-1.5 mx-0.5 align-middle"
      onClick={(e) => e.stopPropagation()}
    >
      <span 
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-md hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
        style={{
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <span className="text-sm font-semibold text-blue-900">{agent.agent_name}</span>
        <ExternalLink className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
      </span>
    </Link>
  );
}

export default function AgentsChatPage() {
  const router = useRouter();
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  
  const { messages, mode, setMode, addMessage, updateMessage, sessionId } = useChatStore();
  
  // Fetch agents list
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("https://agents-store.onrender.com/api/agents", {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          const apiAgents: Agent[] = (data?.agents || [])
            .filter((a: any) => a?.admin_approved === "yes")
            .map((a: any) => ({
              agent_id: a.agent_id,
              agent_name: a.agent_name,
              description: a.description,
              by_capability: a.by_capability,
              by_persona: a.by_persona,
              by_value: a.by_value,
              service_provider: a.service_provider,
              asset_type: a.asset_type,
            }));
          setAgents(apiAgents);
        }
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };
    
    fetchAgents();
  }, []);
  
  // Function to process text and replace agent names with markdown links that will be rendered as cards
  const processTextWithAgents = (text: string): string => {
    if (!agents.length) return text;
    
    let processedText = text;
    
    // Sort agents by name length (longest first) to match longer names first
    const sortedAgents = [...agents].sort((a, b) => b.agent_name.length - a.agent_name.length);
    
    // Use a marker to avoid double-processing
    const processedMarkers = new Set<string>();
    
    sortedAgents.forEach(agent => {
      const escapedName = agent.agent_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const marker = `__AGENT_${agent.agent_id}__`;
      
      if (processedMarkers.has(marker)) return;
      processedMarkers.add(marker);
      
      // Match patterns like:
      // - "1. Agent Name" or "1) Agent Name"
      // - "Agent Name" (standalone or in context)
      const patterns = [
        // Pattern with number prefix: "1. Agent Name" or "1) Agent Name"
        new RegExp(`(\\d+[.)]\\s*)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
        // Pattern without number: "Agent Name" at word boundaries
        new RegExp(`(^|\\s|\\n)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
      ];
      
      patterns.forEach(pattern => {
        processedText = processedText.replace(pattern, (match, prefix, name) => {
          // Skip if already contains a link
          if (match.includes('[') && match.includes('](')) {
            return match;
          }
          // Create a markdown link that we'll detect and render as a card
          return `${prefix || ''}[${name}](/agents/${agent.agent_id})`;
        });
      });
    });
    
    return processedText;
  };
  
  // Function to extract agent names from text and render as cards
  const renderMessageWithAgentCards = (text: string): (string | JSX.Element)[] => {
    if (!agents.length) return [text];
    
    const parts: (string | JSX.Element)[] = [];
    const agentMatches: Array<{ agent: Agent; startIndex: number; endIndex: number; fullMatch: string }> = [];
    
    // Sort agents by name length (longest first) to match longer names first
    const sortedAgents = [...agents].sort((a, b) => b.agent_name.length - a.agent_name.length);
    
    // Find all agent mentions in the text
    sortedAgents.forEach(agent => {
      const escapedName = agent.agent_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Pattern for numbered list items: "1. Agent Name" or "1) Agent Name"
      // Also match with optional whitespace and handle cases where the number and agent are on separate lines
      const numberedPattern = new RegExp(`(\\d+[.)]\\s*)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n|\\r)`, 'gi');
      let match;
      
      while ((match = numberedPattern.exec(text)) !== null) {
        const startIndex = match.index;
        // Extend endIndex to include any trailing content on the same line
        let endIndex = match.index + match[0].length;
        
        // Look ahead to see if there's more content on the same line (description)
        const remainingText = text.substring(endIndex);
        const nextNewline = remainingText.indexOf('\n');
        const nextNumberedItem = remainingText.match(/^\s*\d+[.)]\s/);
        
        // If there's content before the next numbered item or newline, include it
        if (nextNewline !== -1 && (nextNumberedItem === null || nextNewline < remainingText.indexOf(nextNumberedItem[0]))) {
          // Include text up to the newline if it's part of the same item
          const lineContent = remainingText.substring(0, nextNewline).trim();
          if (lineContent && lineContent.length < 200) { // Reasonable description length
            endIndex = match.index + match[0].length + nextNewline;
          }
        } else if (nextNumberedItem && nextNumberedItem.index !== undefined) {
          // Stop at the next numbered item
          endIndex = match.index + match[0].length + nextNumberedItem.index;
        }
        
        // Check if this range overlaps with an existing match
        const overlaps = agentMatches.some(m => 
          (startIndex >= m.startIndex && startIndex < m.endIndex) ||
          (endIndex > m.startIndex && endIndex <= m.endIndex) ||
          (startIndex <= m.startIndex && endIndex >= m.endIndex)
        );
        
        if (!overlaps) {
          agentMatches.push({
            agent,
            startIndex,
            endIndex,
            fullMatch: match[0]
          });
        }
      }
    });
    
    // Sort by start index
    agentMatches.sort((a, b) => a.startIndex - b.startIndex);
    
    // If we found agent matches, render them as cards
    if (agentMatches.length > 0) {
      let lastIndex = 0;
      
      agentMatches.forEach(({ agent, startIndex, endIndex }, idx) => {
        // Add text before the agent
        if (startIndex > lastIndex) {
          const beforeText = text.substring(lastIndex, startIndex);
          if (beforeText.trim()) {
            parts.push(beforeText);
          }
        }
        
        // Add the agent card
        parts.push(<AgentResponseCard key={`agent-card-${agent.agent_id}-${idx}`} agent={agent} />);
        
        // Skip to after the match
        lastIndex = endIndex;
        
        // Skip to next line break if there's more text on the same line
        const nextNewline = text.indexOf('\n', endIndex);
        if (nextNewline !== -1 && nextNewline < endIndex + 50) {
          lastIndex = nextNewline + 1;
        }
      });
      
      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }
      
      return parts;
    }
    
    return [text];
  };
  
  // Custom link component that renders agent links as cards
  const AgentLink = ({ href, children }: { href?: string; children: React.ReactNode }) => {
    if (!href || !href.startsWith('/agents/')) {
      return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
    }
    
    const agentId = href.replace('/agents/', '');
    const agent = agents.find(a => a.agent_id === agentId);
    
    if (agent) {
      return <InlineAgentCard agent={agent} />;
    }
    
    return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
  };

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle sending chat message
  const handleSendChatMessage = async (messageText: string) => {
    const timeString = formatTime();
    const userText = messageText;
    addMessage({ id: crypto.randomUUID(), role: "user", text: userText, time: timeString });
    setChatInput("");
    setIsSending(true);
    
    // Add thinking message immediately
    const thinkingMessageId = crypto.randomUUID();
    addMessage({ id: thinkingMessageId, role: "assistant", text: "AI thinking...", time: timeString });
    
    try {
      const res = await fetch("https://agents-store.onrender.com/api/chat", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode, query: userText, session_id: sessionId }),
      });
      const json = await res.json().catch(() => null);
      const reply = json?.data?.response || "Sorry, something went wrong. Please try again later.";
      
      // Extract all API response data
      let filteredAgentIds = null;
      let filteredAgents = null;
      
      // Check if filtered_agents contains full objects or just IDs
      if (json?.data?.filtered_agents && Array.isArray(json.data.filtered_agents) && json.data.filtered_agents.length > 0) {
        // Check if first element is an object (full agent data) or string (just ID)
        if (typeof json.data.filtered_agents[0] === 'object' && json.data.filtered_agents[0] !== null) {
          // It's full agent objects
          filteredAgents = json.data.filtered_agents;
        } else {
          // It's just IDs
          filteredAgentIds = json.data.filtered_agents;
        }
      }
      
      // Also check for filtered_agents_full as a separate field
      if (!filteredAgents && json?.data?.filtered_agents_full && Array.isArray(json.data.filtered_agents_full) && json.data.filtered_agents_full.length > 0) {
        filteredAgents = json.data.filtered_agents_full;
      }
      
      // Extract mega_trends
      const megaTrends = json?.data?.mega_trends || null;
      
      // Extract suggested_agents
      const suggestedAgents = json?.data?.suggested_agents || null;
      
      const replyTs = json?.data?.timestamp
        ? formatDateTime(new Date(json.data.timestamp))
        : formatDateTime();
      
      // Replace thinking message with actual response including all API data
      updateMessage(thinkingMessageId, { 
        text: reply, 
        time: replyTs,
        filteredAgentIds,
        mega_trends: megaTrends,
        suggested_agents: suggestedAgents,
        filteredAgents: filteredAgents
      });
    } catch (e) {
      const errTs = formatDateTime();
      updateMessage(thinkingMessageId, {
        text: "I'm currently experiencing technical difficulties. Please try again.",
        time: errTs
      });
    } finally {
      setIsSending(false);
    }
  }

  // Handle pending message from navigation
  useEffect(() => {
    if (!isMounted) return;
    
    const pendingMessage = sessionStorage.getItem('pendingChatMessage');
    if (pendingMessage) {
      sessionStorage.removeItem('pendingChatMessage');
      // Send the message after a short delay to ensure component is ready
      setTimeout(() => {
        handleSendChatMessage(pendingMessage);
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && isMounted) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  }, [messages, isMounted]);

  // Auto-resize chat input
  useEffect(() => {
    const el = chatInputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    el.style.maxHeight = '200px';
  }, [chatInput]);

  // Simple Thinking Component
  const SimpleThinking = () => {
    const [dots, setDots] = useState('');
    
    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => {
          if (prev === '') return '.';
          if (prev === '.') return '..';
          if (prev === '..') return '...';
          return '';
        });
      }, 500);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <div className="w-full py-2">
        <p 
          className="text-sm text-gray-700 animate-pulse"
          style={{ 
            fontFamily: "Poppins, sans-serif",
            transition: "opacity 0.3s ease-in-out"
          }}
        >
          Thinking{dots}
        </p>
      </div>
    );
  };

  return (
    <div 
      className="flex flex-col h-screen bg-white overflow-hidden"
      style={{
        animation: "fadeInSlideUp 0.4s ease-out",
      }}
    >
      {/* Messages Area - Scrollable content only */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6" 
        style={{ 
          backgroundColor: "#FFFFFF",
          minHeight: 0,
          paddingBottom: "200px", // Add gap so messages are visible above the chat input box
        }}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {isMounted && messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
              style={{
                animation: `fadeInSlideUp 0.3s ease-out ${index * 0.05}s both`,
              }}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-50 text-gray-900"
                }`}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  backgroundColor: message.role === "assistant" ? "#F8F8FA" : undefined,
                  border: message.role === "assistant" ? "1px solid #E5E7EB" : "none",
                }}
              >
                {message.role === "assistant" && message.text === "AI thinking..." ? (
                  <SimpleThinking />
                ) : (
                  <>
                    {/* Render message with agent cards or regular markdown */}
                    {(() => {
                      const messageParts = renderMessageWithAgentCards(message.text);
                      const hasAgentCards = messageParts.some(part => typeof part !== 'string');
                      
                      // Common markdown components
                      const isUserMessage = message.role === "user";
                      const markdownComponents = {
                        h3: ({ children }: any) => {
                          const text = typeof children === 'string' ? children : 
                            (Array.isArray(children) ? children.join('') : String(children));
                          
                          if (typeof text === 'string' && (text.includes('Description:') || text.includes('Key Features:'))) {
                            return (
                              <h4 className="font-semibold mt-4 mb-1 first:mt-0" style={{ fontSize: '15px', color: isUserMessage ? "#FFFFFF" : "#111827" }}>
                                {children}
                              </h4>
                            );
                          }
                          
                          return (
                            <h3 
                              className="font-semibold mb-2 mt-3 first:mt-0"
                              style={{
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 600,
                                fontSize: "21px",
                                lineHeight: "1.2",
                                color: isUserMessage ? "#FFFFFF" : "#111827",
                              }}
                            >
                              {children}
                            </h3>
                          );
                        },
                        p: ({ children }: any) => {
                          return <p className="mb-2 last:mb-0" style={{ color: isUserMessage ? "#FFFFFF" : "#4b5563", fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>{children}</p>;
                        },
                        ul: ({ children }: any) => {
                          const processedChildren = Array.isArray(children) 
                            ? children.map((child: any, index: number) => {
                                if (child?.props?.children) {
                                  const text = typeof child.props.children === 'string' 
                                    ? child.props.children 
                                    : (Array.isArray(child.props.children) 
                                        ? child.props.children.join('') 
                                        : String(child.props.children));
                                  
                                  if (typeof text === 'string' && (text.trim().startsWith('Description:') || text.trim().startsWith('Key Features:'))) {
                                    return null;
                                  }
                                }
                                return child;
                              }).filter(Boolean)
                            : children;
                          
                          return <ul className="list-disc list-inside mb-2 space-y-1" style={{ color: isUserMessage ? "#FFFFFF" : "inherit" }}>{processedChildren}</ul>;
                        },
                        ol: ({ children }: any) => {
                          // Check if any list items contain agent names
                          const hasAgentItems = Array.isArray(children) && children.some((child: any) => {
                            const text = typeof child?.props?.children === 'string' 
                              ? child.props.children 
                              : (Array.isArray(child?.props?.children) 
                                  ? child.props.children.join('') 
                                  : String(child?.props?.children || ''));
                            
                            // Check if this text matches any agent name
                            return agents.some(agent => {
                              const agentName = agent.agent_name;
                              // Check if the text contains the agent name (possibly with number prefix)
                              return text.includes(agentName) || new RegExp(`\\d+[.)]\\s*${agentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(text);
                            });
                          });
                          
                          if (hasAgentItems) {
                            // Extract agent cards from list items
                            const agentCards: JSX.Element[] = [];
                            const otherItems: any[] = [];
                            
                            if (Array.isArray(children)) {
                              children.forEach((child: any, index: number) => {
                                const text = typeof child?.props?.children === 'string' 
                                  ? child.props.children 
                                  : (Array.isArray(child?.props?.children) 
                                      ? child.props.children.join('') 
                                      : String(child?.props?.children || ''));
                                
                                // Find matching agent
                                const matchingAgent = agents.find(agent => {
                                  const agentName = agent.agent_name;
                                  return text.includes(agentName) || new RegExp(`\\d+[.)]\\s*${agentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(text);
                                });
                                
                                if (matchingAgent) {
                                  agentCards.push(
                                    <AgentResponseCard key={`agent-card-${matchingAgent.agent_id}-${index}`} agent={matchingAgent} />
                                  );
                                } else {
                                  otherItems.push(child);
                                }
                              });
                            }
                            
                            // Return agent cards, and if there are other items, render them as a list
                            return (
                              <>
                                {agentCards}
                                {otherItems.length > 0 && (
                                  <ol className="list-decimal list-inside mb-2 space-y-1">{otherItems}</ol>
                                )}
                              </>
                            );
                          }
                          
                          // Default: render as regular ordered list
                          return <ol className="list-decimal list-inside mb-2 space-y-1" style={{ color: isUserMessage ? "#FFFFFF" : "inherit" }}>{children}</ol>;
                        },
                        li: ({ children }: any) => {
                          const text = typeof children === 'string' ? children : 
                            (Array.isArray(children) ? children.join('') : String(children));
                          
                          const cleanedText = typeof text === 'string' ? text.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim() : text;
                          
                          if (typeof cleanedText === 'string' && (cleanedText.startsWith('Description:') || cleanedText.startsWith('Key Features:'))) {
                            const headingMatch = cleanedText.match(/^(Description:|Key Features:)/);
                            if (headingMatch) {
                              return (
                                <li style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0, display: 'block' }}>
                                  <h4 className="font-semibold mt-4 mb-1 first:mt-0" style={{ fontSize: '15px', listStyle: 'none', marginLeft: 0, paddingLeft: 0, color: isUserMessage ? "#FFFFFF" : "#111827" }}>
                                    {headingMatch[1]}
                                  </h4>
                                  {cleanedText.replace(/^(Description:|Key Features:)\s*/, '').trim() && (
                                    <p className="mb-2" style={{ color: isUserMessage ? "#FFFFFF" : "inherit" }}>{cleanedText.replace(/^(Description:|Key Features:)\s*/, '')}</p>
                                  )}
                                </li>
                              );
                            }
                          }
                          
                          return <li className="ml-2" style={{ color: isUserMessage ? "#FFFFFF" : "inherit" }}>{children}</li>;
                        },
                        a: ({ href, children }: any) => <AgentLink href={href}>{children}</AgentLink>,
                        strong: ({ children }: any) => <strong className="font-semibold" style={{ color: isUserMessage ? "#FFFFFF" : "inherit" }}>{children}</strong>,
                        code: ({ children }: any) => (
                          <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ backgroundColor: isUserMessage ? "rgba(255, 255, 255, 0.2)" : "#E5E7EB", color: isUserMessage ? "#FFFFFF" : "inherit" }}>
                            {children}
                          </code>
                        ),
                      };
                      
                      if (hasAgentCards) {
                        return (
                          <>
                            {messageParts.map((part, idx) => {
                              if (typeof part === 'string' && part.trim()) {
                                return (
                                  <ReactMarkdown
                                    key={`text-${idx}`}
                                    components={markdownComponents}
                                  >
                                    {processTextWithAgents(part
                                      .replace(/^[-*•]\s*(Description:|Key Features:)/gm, '### $1')
                                      .replace(/^\d+\.\s*(Description:|Key Features:)/gm, '### $1')
                                      .replace(/^[\s]*[-*•]\s*(Description:|Key Features:)/gm, '### $1')
                                      .replace(/^(Description:|Key Features:)/gm, '### $1')
                                      .replace(/^\s+[-*•]\s*(Description:|Key Features:)/gm, '### $1'))}
                                  </ReactMarkdown>
                                );
                              } else if (typeof part !== 'string') {
                                return <React.Fragment key={`card-${idx}`}>{part}</React.Fragment>;
                              }
                              return null;
                            })}
                          </>
                        );
                      }
                      
                      // Regular markdown rendering
                      return (
                        <ReactMarkdown components={markdownComponents}>
                          {processTextWithAgents(message.text
                            .replace(/^[-*•]\s*(Description:|Key Features:)/gm, '### $1')
                            .replace(/^\d+\.\s*(Description:|Key Features:)/gm, '### $1')
                            .replace(/^[\s]*[-*•]\s*(Description:|Key Features:)/gm, '### $1')
                            .replace(/^(Description:|Key Features:)/gm, '### $1')
                            .replace(/^\s+[-*•]\s*(Description:|Key Features:)/gm, '### $1'))}
                        </ReactMarkdown>
                      );
                    })()}
                    
                    {/* Render Mega Trends */}
                    {message.mega_trends && (
                      <div className="mt-6 pt-6 border-t border-gray-300">
                        <div className="flex items-center gap-2 mb-3">
                          <div 
                            className="w-6 h-6 flex items-center justify-center"
                            style={{
                              background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                              borderRadius: "4px",
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M1 11L6 1L11 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <h4 
                            className="text-gray-900"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 500,
                              fontSize: "21px",
                              lineHeight: "1.2",
                              color: "#3b60af",
                            }}
                          >
                            Mega Trends
                          </h4>
                        </div>
                        <div className="h-px bg-gray-300 mb-4"></div>
                        <div className="text-gray-700">
                          <ReactMarkdown
                            components={{
                              h3: ({ children }) => {
                                const text = typeof children === 'string' ? children : 
                                  (Array.isArray(children) ? children.join('') : String(children));
                                
                                // Check if it's Description: or Key Features:
                                if (typeof text === 'string' && (text.includes('Description:') || text.includes('Key Features:'))) {
                                  return (
                                    <h4 className="font-semibold text-gray-900 mt-4 mb-1 first:mt-0" style={{ fontSize: '15px' }}>
                                      {children}
                                    </h4>
                                  );
                                }
                                
                                // Check if it's a Mega Trend heading like THEME, THE SHIFT, etc.
                                const isMegaTrendHeading = typeof text === 'string' && 
                                  (text.includes('THEME') || text.includes('THE SHIFT') || text.includes('THE TENSION') || 
                                   text.includes('THE OPPORTUNITY') || text.includes('AGENTIC OPPORTUNITY PLAYS'));
                                
                                if (isMegaTrendHeading) {
                                  return (
                                    <div className="mt-3 first:mt-0 mb-3">
                                      <p 
                                        className="font-semibold uppercase"
                                        style={{
                                          fontFamily: "Poppins, sans-serif",
                                          fontWeight: 600,
                                          fontSize: "14px",
                                          lineHeight: "21px",
                                          color: "#111827",
                                        }}
                                      >
                                      {children}
                                      </p>
                                    </div>
                                  );
                                }
                                
                                return (
                                  <h3 
                                    className="font-semibold mb-2 mt-3 first:mt-0"
                                    style={{
                                      fontFamily: "Poppins, sans-serif",
                                      fontWeight: 600,
                                      fontSize: "21px",
                                      lineHeight: "1.2",
                                      color: "#111827",
                                    }}
                                  >
                                    {children}
                                  </h3>
                                );
                              },
                              p: ({ children }) => {
                                return <p className="mb-2 last:mb-0" style={{ color: "rgb(75, 85, 99)", fontSize: "14px", lineHeight: "21px", marginTop: "0px", marginBottom: "12px", fontFamily: "Poppins, sans-serif", fontWeight: 400 }}>{children}</p>;
                              },
                              ul: ({ children }) => {
                                const processedChildren = Array.isArray(children) 
                                  ? children.map((child: any, index: number) => {
                                      if (child?.props?.children) {
                                        const text = typeof child.props.children === 'string' 
                                          ? child.props.children 
                                          : (Array.isArray(child.props.children) 
                                              ? child.props.children.join('') 
                                              : String(child.props.children));
                                        
                                        if (typeof text === 'string' && (text.trim().startsWith('Description:') || text.trim().startsWith('Key Features:'))) {
                                          return null;
                                        }
                                      }
                                      return child;
                                    }).filter(Boolean)
                                  : children;
                                
                                return <ul className="list-disc list-inside mb-2 space-y-1">{processedChildren}</ul>;
                              },
                              ol: ({ children }) => {
                                // Check if any list items contain agent names
                                const hasAgentItems = Array.isArray(children) && children.some((child: any) => {
                                  const text = typeof child?.props?.children === 'string' 
                                    ? child.props.children 
                                    : (Array.isArray(child?.props?.children) 
                                        ? child.props.children.join('') 
                                        : String(child?.props?.children || ''));
                                  
                                  // Check if this text matches any agent name
                                  return agents.some(agent => {
                                    const agentName = agent.agent_name;
                                    // Check if the text contains the agent name (possibly with number prefix)
                                    return text.includes(agentName) || new RegExp(`\\d+[.)]\\s*${agentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(text);
                                  });
                                });
                                
                                if (hasAgentItems) {
                                  // Extract agent cards from list items
                                  const agentCards: JSX.Element[] = [];
                                  const otherItems: any[] = [];
                                  
                                  if (Array.isArray(children)) {
                                    children.forEach((child: any, index: number) => {
                                      const text = typeof child?.props?.children === 'string' 
                                        ? child.props.children 
                                        : (Array.isArray(child?.props?.children) 
                                            ? child.props.children.join('') 
                                            : String(child?.props?.children || ''));
                                      
                                      // Find matching agent
                                      const matchingAgent = agents.find(agent => {
                                        const agentName = agent.agent_name;
                                        return text.includes(agentName) || new RegExp(`\\d+[.)]\\s*${agentName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(text);
                                      });
                                      
                                      if (matchingAgent) {
                                        agentCards.push(
                                          <AgentResponseCard key={`agent-card-${matchingAgent.agent_id}-${index}`} agent={matchingAgent} />
                                        );
                                      } else {
                                        otherItems.push(child);
                                      }
                                    });
                                  }
                                  
                                  // Return agent cards, and if there are other items, render them as a list
                                  return (
                                    <>
                                      {agentCards}
                                      {otherItems.length > 0 && (
                                        <ol className="list-decimal list-inside mb-2 space-y-1">{otherItems}</ol>
                                      )}
                                    </>
                                  );
                                }
                                
                                // Default: render as regular ordered list
                                return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>;
                              },
                              li: ({ children }) => {
                                const text = typeof children === 'string' ? children : 
                                  (Array.isArray(children) ? children.join('') : String(children));
                                
                                const cleanedText = typeof text === 'string' ? text.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim() : text;
                                
                                if (typeof cleanedText === 'string' && (cleanedText.startsWith('Description:') || cleanedText.startsWith('Key Features:'))) {
                                  const headingMatch = cleanedText.match(/^(Description:|Key Features:)/);
                                  if (headingMatch) {
                                    return (
                                      <li style={{ listStyle: 'none', marginLeft: 0, paddingLeft: 0, display: 'block' }}>
                                        <h4 className="font-semibold text-gray-900 mt-4 mb-1 first:mt-0" style={{ fontSize: '15px', listStyle: 'none', marginLeft: 0, paddingLeft: 0 }}>
                                          {headingMatch[1]}
                                        </h4>
                                        {cleanedText.replace(/^(Description:|Key Features:)\s*/, '').trim() && (
                                          <p className="mb-2">{cleanedText.replace(/^(Description:|Key Features:)\s*/, '')}</p>
                                        )}
                                      </li>
                                    );
                                  }
                                }
                                
                                return <li className="ml-2" style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6" }}>{children}</li>;
                              },
                              a: ({ href, children }) => <AgentLink href={href}>{children}</AgentLink>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            }}
                          >
                            {processTextWithAgents(message.mega_trends
                              .replace(/^[-*•]\s*(Description:|Key Features:)/gm, '### $1')
                              .replace(/^\d+\.\s*(Description:|Key Features:)/gm, '### $1')
                              .replace(/^[\s]*[-*•]\s*(Description:|Key Features:)/gm, '### $1')
                              .replace(/^(Description:|Key Features:)/gm, '### $1')
                              .replace(/^\s+[-*•]\s*(Description:|Key Features:)/gm, '### $1'))}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                    
                    {/* Render Suggested Agents */}
                    {message.suggested_agents && Array.isArray(message.suggested_agents) && message.suggested_agents.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-300">
                        <div className="flex items-center gap-2 mb-3">
                          <h4 
                            className="text-gray-900"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 500,
                              fontSize: "21px",
                              lineHeight: "1.2",
                              color: "#1c4a46",
                            }}
                          >
                            🤖 Suggested Agents
                          </h4>
                        </div>
                        <div className="h-px bg-gray-300 mb-4"></div>
                        <div className="space-y-3">
                          {message.suggested_agents.map((agent, index) => (
                            <div 
                              key={index} 
                              className="bg-white rounded-lg p-4 border border-gray-200"
                              style={{
                                fontFamily: "Poppins, sans-serif",
                                backgroundColor: "#FFFFFF",
                                borderRadius: "8px",
                              }}
                            >
                              <div 
                                className="font-semibold text-gray-900 mb-2"
                                style={{
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 600,
                                  fontSize: "21px",
                                  lineHeight: "1.2",
                                  color: "#111827",
                                }}
                              >
                                {agent.solution_name}
                              </div>
                              {agent.description && (
                                <div 
                                  className="text-sm mb-3"
                                  style={{
                                    fontFamily: "Poppins, sans-serif",
                                    fontSize: "14px",
                                    lineHeight: "21px",
                                    color: "#4b5563",
                                    fontWeight: 400,
                                  }}
                                >
                                  {agent.description}
                                </div>
                              )}
                              <div className="flex flex-wrap gap-2">
                                {agent.trend_reference && (
                                  <span 
                                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    style={{
                                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                                      border: "1px solid #d9e0e3",
                                      color: "#65717c",
                                      fontFamily: "Poppins, sans-serif",
                                      fontWeight: 500,
                                      fontSize: "12.3px",
                                      letterSpacing: "-0.327px",
                                      lineHeight: "15.93px",
                                    }}
                                  >
                                    {agent.trend_reference}
                                  </span>
                                )}
                                {agent.segment && (
                                  <span 
                                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    style={{
                                      backgroundColor: "rgba(255, 255, 255, 0.3)",
                                      border: "1px solid #d9e0e3",
                                      color: "#65717c",
                                      fontFamily: "Poppins, sans-serif",
                                      fontWeight: 500,
                                      fontSize: "12.3px",
                                      letterSpacing: "-0.327px",
                                      lineHeight: "15.93px",
                                    }}
                                  >
                                    Segment: {agent.segment}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Render Filtered Agents */}
                    {message.filteredAgents && Array.isArray(message.filteredAgents) && message.filteredAgents.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <h4 className="font-semibold mb-1 text-gray-900">🔍 Matching Agents</h4>
                        <div className="space-y-3">
                          {message.filteredAgents.map((agent, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="font-semibold text-gray-900 mb-1">{agent.agent_name}</div>
                              {agent.description && (
                                <div className="text-sm text-gray-700 mb-2">{agent.description}</div>
                              )}
                              <div className="flex flex-wrap gap-2 text-xs">
                                {agent.by_capability && (
                                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {agent.by_capability}
                                  </span>
                                )}
                                {agent.by_persona && (
                                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {agent.by_persona}
                                  </span>
                                )}
                                {agent.by_value && (
                                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                    {agent.by_value}
                                  </span>
                                )}
                                {agent.service_provider && (
                                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                    {agent.service_provider}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              {/* Timestamp */}
              {isMounted && (
                <div 
                  className={`mt-1 px-2 ${message.role === "user" ? "text-right" : "text-left"}`}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "11px",
                    color: "#9CA3AF",
                    lineHeight: "1.4",
                  }}
                  suppressHydrationWarning
                >
                  {message.time}
                </div>
              )}
            </div>
          ))}
          {isMounted && <div ref={messagesEndRef} />}
        </div>
      </div>

      {/* Chat Input - Matching search box style - Fixed at bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 px-4 py-4 z-50 bg-white" 
        style={{ 
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <div className="w-full">
          <div
            className="mx-auto max-w-5xl rounded-2xl bg-white p-4 shadow-lg"
            style={{
              border: "1px solid #E5E7EB",
            }}
          >
            {/* Upper section: Input */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 flex items-start gap-2">
                <textarea
                  ref={chatInputRef}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (chatInput.trim() && !isSending) {
                        handleSendChatMessage(chatInput.trim());
                      }
                    }
                  }}
                  placeholder="I want an agent to review NDAs"
                  className="w-full text-lg py-2 flex-1 resize-none border-none focus:outline-none focus:bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
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
                    backgroundColor: 'transparent'
                  }}
                  rows={1}
                />
              </div>
            </div>

            {/* Lower section: Buttons and controls */}
            <div className="flex items-center justify-between gap-4">
              {/* Left side: Mode toggle */}
              <div className="flex items-center">
                <ToggleGroup
                  type="single"
                  value={mode}
                  onValueChange={(value) => {
                    if (value) setMode(value as "explore" | "create");
                  }}
                  className="bg-gray-100 rounded-lg p-1"
                >
                  <ToggleGroupItem
                    value="explore"
                    aria-label="Explore"
                    className="px-4 py-2 text-sm rounded-md data-[state=on]:bg-gray-900 data-[state=on]:text-white data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900"
                  >
                    Explore
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="create"
                    aria-label="Create"
                    className="px-4 py-2 text-sm rounded-md data-[state=on]:bg-gray-900 data-[state=on]:text-white data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900"
                  >
                    Create
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Right side: Microphone and Submit button */}
              <div className="flex items-center gap-3">
                {/* VoiceInputControls styled to show only mic button */}
                <div className="[&>div>button:first-child]:hidden [&>div>button:last-child]:h-10 [&>div>button:last-child]:w-10 [&>div>button:last-child]:rounded-full [&>div>button:last-child]:bg-white [&>div>button:last-child]:hover:bg-gray-50">
                  <VoiceInputControls
                    value={chatInput}
                    onValueChange={setChatInput}
                    buttonSize="icon"
                    buttonVariant="outline"
                    ariaLabel="Use voice input for chat"
                  />
                </div>
                <button
                  onClick={() => {
                    if (chatInput.trim() && !isSending) {
                      handleSendChatMessage(chatInput.trim());
                    }
                  }}
                  disabled={!chatInput.trim() || isSending}
                  className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Submit message"
                >
                  <ArrowUp className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

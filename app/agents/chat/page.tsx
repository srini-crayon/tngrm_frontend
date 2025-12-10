"use client";

import { Button } from "../../../components/ui/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "../../../lib/store/chat.store";
import ReactMarkdown from "react-markdown";
import { ToggleGroup, ToggleGroupItem } from "../../../components/ui/toggle-group";
import { VoiceInputControls } from "../../../components/voice-input-controls";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtStep,
} from "../../../components/ai-elements/chain-of-thought";
import { Search } from "lucide-react";
import { formatTime, formatDateTime } from "../../../lib/utils";

export default function AgentsChatPage() {
  const router = useRouter();
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  
  const { messages, mode, setMode, addMessage, updateMessage, sessionId } = useChatStore();

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
      
      // Check if the API response has filtered_agents data
      let filteredAgentIds = null;
      if (json?.data?.filtered_agents && Array.isArray(json.data.filtered_agents) && json.data.filtered_agents.length > 0) {
        filteredAgentIds = json.data.filtered_agents;
      }
      
      const replyTs = json?.data?.timestamp
        ? formatDateTime(new Date(json.data.timestamp))
        : formatDateTime();
      
      // Replace thinking message with actual response
      updateMessage(thinkingMessageId, { 
        text: reply, 
        time: replyTs,
        filteredAgentIds
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

  // Simple Chain of Thought Component
  const SimpleChainOfThought = () => {
    const [currentStep, setCurrentStep] = useState(0);
    
    const steps = [
      { icon: Search, label: "Searching for relevant information...", status: "complete" as const },
      { icon: Search, label: "Analyzing your request...", status: "complete" as const },
      { icon: Search, label: "Generating response...", status: "active" as const },
    ];
    
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2000);
      
      return () => clearInterval(interval);
    }, []);
    
    return (
      <ChainOfThought defaultOpen>
        <ChainOfThoughtContent>
          {steps.map((step, index) => (
            <ChainOfThoughtStep
              key={index}
              icon={step.icon}
              label={step.label}
              status={index < currentStep ? "complete" : index === currentStep ? "active" : "pending"}
            />
          ))}
        </ChainOfThoughtContent>
      </ChainOfThought>
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
                    : "bg-gray-100 text-gray-900"
                }`}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {message.role === "assistant" && message.text === "AI thinking..." ? (
                  <SimpleChainOfThought />
                ) : (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="ml-2">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      code: ({ children }) => (
                        <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ),
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
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

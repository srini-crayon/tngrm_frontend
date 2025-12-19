"use client";

import { Button } from "../../../components/ui/button";
import { ArrowUp, ExternalLink, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useChatStore } from "../../../lib/store/chat.store";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { ToggleGroup, ToggleGroupItem } from "../../../components/ui/toggle-group";
import { VoiceInputControls } from "../../../components/voice-input-controls";
import { formatTime, formatDateTime } from "../../../lib/utils";
import Link from "next/link";
import Image from "next/image";

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

// Section Card Component for consistent styling - Modern ChatGPT-style card
function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div 
      className={`bg-white rounded-xl p-5 border border-gray-200 ${className}`}
      style={{
        fontFamily: "Poppins, sans-serif",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      {children}
    </div>
  );
}

// Utility function to extract intro text and agent markdown
function extractIntroAndAgentMarkdown(markdown: string): { introText: string; agentMarkdown: string } {
  // Find the first occurrence of "\n\n###" or "\n###" or "###" at the start of a line
  const headingPattern = /(\n\n|\n|^)###/;
  const match = markdown.match(headingPattern);
  
  if (match) {
    const splitIndex = match.index! + match[1].length;
    const introText = markdown.substring(0, splitIndex).trim();
    const agentMarkdown = markdown.substring(splitIndex).trim();
    return { introText, agentMarkdown };
  }
  
  // If no heading found, return the entire markdown as agent content
  return { introText: "", agentMarkdown: markdown };
}

// Utility function to remove label keys from markdown (e.g., "Description:", "Title:", "Subtitle:")
// This function removes labels but preserves their values
function removeMarkdownLabels(markdown: string, labelsToRemove: string[]): string {
  let cleaned = markdown;
  
  labelsToRemove.forEach(label => {
    // Handle various markdown formats:
    // 1. Bold labels: **Description:** or **Description**:
    // 2. Plain text labels: Description:
    // 3. In headings: ### Description:
    // 4. With markdown emphasis: *Description:*
    // 5. In paragraphs: Description: text here
    
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Pattern 1: Remove bold labels with colon (e.g., **Description:** or **Description**:)
    cleaned = cleaned.replace(new RegExp(`\\*\\*${escapedLabel}\\*\\*\\s*:?\\s*`, 'gi'), '');
    
    // Pattern 2: Remove plain labels with colon at start of line (e.g., Description:)
    cleaned = cleaned.replace(new RegExp(`^${escapedLabel}\\s*:?\\s*`, 'gim'), '');
    
    // Pattern 3: Remove labels in headings (e.g., ### Description: or ### **Description:**)
    cleaned = cleaned.replace(new RegExp(`(#{1,6})\\s+\\*\\*${escapedLabel}\\*\\*\\s*:?\\s*`, 'gi'), '$1 ');
    cleaned = cleaned.replace(new RegExp(`(#{1,6})\\s+${escapedLabel}\\s*:?\\s*`, 'gi'), '$1 ');
    
    // Pattern 4: Remove labels with markdown emphasis (e.g., *Description:*)
    cleaned = cleaned.replace(new RegExp(`\\*${escapedLabel}\\*\\s*:?\\s*`, 'gi'), '');
    
    // Pattern 5: Remove labels in list items (e.g., - Description: or • Description:)
    cleaned = cleaned.replace(new RegExp(`^[-*•]\\s+${escapedLabel}\\s*:?\\s*`, 'gim'), '');
    
    // Pattern 6: Remove labels in paragraphs after newline or at start (e.g., "\nDescription: some text" or "Description: some text")
    // Only match when label is at start of line or after whitespace/newline
    cleaned = cleaned.replace(new RegExp(`(^|\\n|\\r\\n)\\s*${escapedLabel}\\s*:?\\s*`, 'gim'), '$1');
    
    // Pattern 7: Remove labels that appear at the start of a line with optional whitespace (redundant but kept for safety)
    cleaned = cleaned.replace(new RegExp(`^\\s*${escapedLabel}\\s*:?\\s*`, 'gim'), '');
  });
  
  // Clean up extra whitespace and empty lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();
  
  return cleaned;
}

// Utility function to clean text by removing special characters
function cleanText(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    // Remove all asterisks (markdown bold) - all instances, anywhere
    .replace(/\*+/g, '')
    // Remove quotes at start and end (multiple quotes, both single and double)
    .replace(/^["']+|["']+$/g, '')
    .replace(/^["']|["']$/g, '')
    // Remove all quotes from anywhere in the text
    .replace(/["']/g, '')
    // Remove parentheses at start and end (but keep content inside)
    .replace(/^\(+|\)+$/g, '')
    // Remove all parentheses from anywhere in the text
    .replace(/[()]/g, '')
    // Remove any orphaned fragments like "** " or " **"
    .replace(/\*\*\s*/g, '')
    .replace(/\s*\*\*/g, '')
    // Remove any trailing colons that might be left
    .replace(/:\s*$/, '')
    .trim();
}

// Utility function to extract plain text from React children (handles strings, arrays, and React elements)
function extractTextFromChildren(children: any): string {
  if (typeof children === 'string') {
    return children;
  }
  if (typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(child => extractTextFromChildren(child)).join('');
  }
  if (children && typeof children === 'object' && 'props' in children) {
    return extractTextFromChildren(children.props.children);
  }
  return '';
}

// Utility function to check if text content is a section label and extract label/content
// Section labels: Description, Key Features, Value Proposition, and variations
function parseSectionLabel(text: string): { isLabel: boolean; label?: string; content?: string } {
  if (!text) return { isLabel: false };
  
  const normalizedText = text.trim();
  
  // List of section labels (case-insensitive)
  const sectionLabels = [
    'description',
    'key features',
    'value proposition',
    'features',
    'benefits',
    'use cases',
    'capabilities',
  ];
  
  // Remove markdown bold markers
  let cleanedText = normalizedText
    .replace(/^\*\*/, '') // Remove leading **
    .replace(/\*\*$/, '') // Remove trailing **
    .replace(/^\*/, '') // Remove leading * (for emphasis)
    .replace(/\*$/, '') // Remove trailing *
    .trim();
  
  const lowerCleaned = cleanedText.toLowerCase();
  
  // Check if text starts with any section label
  for (const label of sectionLabels) {
    if (lowerCleaned.startsWith(label)) {
      // Escape special regex characters in label
      const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Check if there's content after the label and colon
      const labelMatch = cleanedText.match(new RegExp(`^(${escapedLabel}):\\s*(.+)$`, 'i'));
      if (labelMatch) {
        return {
          isLabel: true,
          label: labelMatch[1],
          content: labelMatch[2].trim(),
        };
      }
      
      // If it's just the label (with or without colon), no content
      // Also check if it's the label followed by colon and nothing else
      if (lowerCleaned === label || lowerCleaned === `${label}:` || lowerCleaned === `${label}:`) {
        return {
          isLabel: true,
          label: label,
        };
      }
      
      // Handle case where label starts the text but might have more text after colon
      const exactMatch = cleanedText.match(new RegExp(`^(${escapedLabel}):\\s*$`, 'i'));
      if (exactMatch) {
        return {
          isLabel: true,
          label: exactMatch[1],
        };
      }
    }
  }
  
  return { isLabel: false };
}

// Utility function to process mega trends markdown - combines Title and Subtitle into single heading with pipe separator
function processMegaTrendsMarkdown(markdown: string): string {
  if (!markdown) return '';
  
  let processed = markdown;
  
  // Extract Title and Subtitle values BEFORE removing anything
  let titleValue = '';
  let subtitleValue = '';
  
  // Extract Title - try multiple patterns
  const titleRegex = /(?:\*\*)?Title(?:\*\*)?\s*:\s*"([^"]+)"|(?:\*\*)?Title(?:\*\*)?\s*:\s*(.+?)(?:\n|$)/gi;
  const titleMatch = processed.match(titleRegex);
  if (titleMatch && titleMatch[0]) {
    const fullMatch = titleMatch[0];
    // Extract the value part (after the colon)
    const valueMatch = fullMatch.match(/:\s*"([^"]+)"|:\s*(.+?)(?:\n|$)/);
    if (valueMatch) {
      const rawValue = valueMatch[1] || valueMatch[2] || '';
      titleValue = cleanText(rawValue.trim());
    }
  }
  
  // Extract Subtitle - try multiple patterns
  const subtitleRegex = /(?:\*\*)?Subtitle(?:\*\*)?\s*:\s*"\(([^)]+)\)"|(?:\*\*)?Subtitle(?:\*\*)?\s*:\s*\(([^)]+)\)|(?:\*\*)?Subtitle(?:\*\*)?\s*:\s*"([^"]+)"|(?:\*\*)?Subtitle(?:\*\*)?\s*:\s*(.+?)(?:\n|$)/gi;
  const subtitleMatch = processed.match(subtitleRegex);
  if (subtitleMatch && subtitleMatch[0]) {
    const fullMatch = subtitleMatch[0];
    // Extract the value part (after the colon)
    const valueMatch = fullMatch.match(/:\s*"\(([^)]+)\)"|:\s*\(([^)]+)\)|:\s*"([^"]+)"|:\s*(.+?)(?:\n|$)/);
    if (valueMatch) {
      const rawValue = valueMatch[1] || valueMatch[2] || valueMatch[3] || valueMatch[4] || '';
      subtitleValue = cleanText(rawValue.trim());
    }
  }
  
  // Remove Title and Subtitle label lines (only lines that START with Title: or Subtitle:)
  // This preserves content that might mention "Title" or "Subtitle" in the text
  processed = processed.split('\n').map(line => {
    const trimmedLine = line.trim();
    // Skip if it's already our combined heading
    if (trimmedLine.startsWith('###') && trimmedLine.includes('|')) {
      return line;
    }
    // Only remove lines that START with Title: or Subtitle: (with optional bold markers)
    if (/^(\*\*)?(Title|Subtitle)(\*\*)?\s*:\s*/i.test(trimmedLine)) {
      return '';
    }
    return line;
  }).filter(line => line.trim() !== '').join('\n');
  
  // Remove any remaining Title/Subtitle label patterns (only at start of line)
  processed = processed.replace(/^\*\*Title\*\*\s*:.*$/gim, '');
  processed = processed.replace(/^Title\s*:.*$/gim, '');
  processed = processed.replace(/^\*\*Subtitle\*\*\s*:.*$/gim, '');
  processed = processed.replace(/^Subtitle\s*:.*$/gim, '');
  
  // Remove orphaned fragments (only at start of line)
  processed = processed.replace(/^\*\*\s*\*\*/gm, '');
  processed = processed.replace(/^\*\*\s*Sub(?!title)/gim, '');
  processed = processed.replace(/^\*\*\s*Title/gim, '');
  
  // Combine Title and Subtitle into a single heading
  // Ensure both values are clean (no quotes, parentheses, or trailing colons)
  // Apply cleanText again to ensure all special characters are removed
  const cleanTitle = titleValue ? cleanText(titleValue).replace(/["'():]/g, '').trim() : '';
  const cleanSubtitle = subtitleValue ? cleanText(subtitleValue).replace(/["'():]/g, '').trim() : '';
  
  let combinedHeading = '';
  if (cleanTitle && cleanSubtitle) {
    combinedHeading = `### ${cleanTitle} | ${cleanSubtitle}`;
  } else if (cleanTitle) {
    combinedHeading = `### ${cleanTitle}`;
  } else if (cleanSubtitle) {
    combinedHeading = `### ${cleanSubtitle}`;
  }
  
  // If we have a combined heading, prepend it to the content
  if (combinedHeading) {
    // Remove any existing combined heading if present (to avoid duplicates)
    processed = processed.replace(/^###\s+.*\s*\|\s*.*$/gim, '');
    
    // Get remaining content
    const remainingContent = processed.trim();
    
    // Prepend the combined heading
    if (remainingContent) {
      processed = combinedHeading + '\n\n' + remainingContent;
    } else {
      processed = combinedHeading;
    }
  }
  
  // Final cleanup: Remove any remaining Title: or Subtitle: labels
  processed = removeMarkdownLabels(processed, ['Title', 'Subtitle']);
  
  // Remove any remaining fragments and orphaned text
  processed = processed.replace(/\*\*\s*\*\*/g, ''); // Remove ** ** patterns
  processed = processed.replace(/\*\*\s*[Ss]ub/gi, ''); // Remove ** Sub fragments
  processed = processed.replace(/\*\*\s*[Tt]itle/gi, ''); // Remove ** Title fragments
  processed = processed.replace(/\*\*\s*[Ss]ubtitle/gi, ''); // Remove ** Subtitle fragments
  
  // Final pass: Remove any remaining Title/Subtitle label lines (only at start)
  processed = processed.split('\n').map(line => {
    const trimmed = line.trim();
    // Skip our combined heading
    if (trimmed.startsWith('###') && trimmed.includes('|')) {
      return line;
    }
    // Only remove lines that START with Title: or Subtitle: labels
    if (/^(\*\*)?(Title|Subtitle)(\*\*)?\s*:\s*/i.test(trimmed)) {
      return '';
    }
    // Remove lines that are just fragments (only at start)
    if (/^\*\*\s*\*\*$/.test(trimmed) || /^\*\*\s*Sub(?!title)$/i.test(trimmed) || /^\*\*\s*Title$/i.test(trimmed)) {
      return '';
    }
    return line;
  }).filter(line => line.trim() !== '').join('\n');
  
  // Clean up extra whitespace and empty lines
  processed = processed.replace(/\n{3,}/g, '\n\n').trim();
  
  return processed;
}

// Comprehensive Markdown Components Factory for beautiful LLM response formatting
// Supports: headings, paragraphs, lists, code blocks, blockquotes, tables, links, emphasis
function createChatMarkdownComponents(options: {
  isUserMessage?: boolean;
  agents?: Agent[];
  onAgentClick?: (agentId: string) => void;
}) {
  const { isUserMessage = false, agents = [] } = options;
  
  const textColor = isUserMessage ? "#FFFFFF" : "#374151";
  const headingColor = isUserMessage ? "#FFFFFF" : "#111827";
  const mutedColor = isUserMessage ? "rgba(255,255,255,0.8)" : "#6b7280";
  const codeBackground = isUserMessage ? "rgba(255,255,255,0.15)" : "#f3f4f6";
  const codeBorderColor = isUserMessage ? "rgba(255,255,255,0.2)" : "#e5e7eb";
  const blockquoteBorder = isUserMessage ? "rgba(255,255,255,0.4)" : "#3b82f6";
  const tableBorderColor = isUserMessage ? "rgba(255,255,255,0.2)" : "#e5e7eb";

  return {
    // Headings
    h1: ({ children }: any) => (
      <h1 style={{ 
        fontFamily: "Poppins, sans-serif", 
        fontWeight: 700, 
        fontSize: "24px", 
        lineHeight: "1.3", 
        color: headingColor,
        marginTop: "20px",
        marginBottom: "12px",
      }}>{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 style={{ 
        fontFamily: "Poppins, sans-serif", 
        fontWeight: 600, 
        fontSize: "20px", 
        lineHeight: "1.3", 
        color: headingColor,
        marginTop: "18px",
        marginBottom: "10px",
      }}>{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{ 
        fontFamily: "Poppins, sans-serif", 
        fontWeight: 600, 
        fontSize: "17px", 
        lineHeight: "1.3", 
        color: headingColor,
        marginTop: "16px",
        marginBottom: "8px",
      }}>{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 style={{ 
        fontFamily: "Poppins, sans-serif", 
        fontWeight: 600, 
        fontSize: "15px", 
        lineHeight: "1.4", 
        color: headingColor,
        marginTop: "14px",
        marginBottom: "6px",
      }}>{children}</h4>
    ),
    
    // Paragraphs
    p: ({ children }: any) => (
      <p style={{ 
        color: textColor, 
        fontSize: "14px", 
        lineHeight: "22px", 
        fontFamily: "Poppins, sans-serif", 
        fontWeight: 400,
        marginBottom: "12px",
      }}>{children}</p>
    ),
    
    // Lists
    ul: ({ children }: any) => (
      <ul style={{ 
        color: textColor,
        fontSize: "14px",
        lineHeight: "22px",
        fontFamily: "Poppins, sans-serif",
        marginBottom: "12px",
        paddingLeft: "20px",
        listStyleType: "disc",
      }}>{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol style={{ 
        color: textColor,
        fontSize: "14px",
        lineHeight: "22px",
        fontFamily: "Poppins, sans-serif",
        marginBottom: "12px",
        paddingLeft: "20px",
        listStyleType: "decimal",
      }}>{children}</ol>
    ),
    li: ({ children }: any) => (
      <li style={{ 
        color: textColor,
        marginBottom: "6px",
        paddingLeft: "4px",
      }}>{children}</li>
    ),
    
    // Code blocks
    code: ({ inline, className, children }: any) => {
      if (inline) {
        return (
          <code style={{
            fontFamily: "'Fira Code', 'Consolas', monospace",
            fontSize: "13px",
            backgroundColor: codeBackground,
            padding: "2px 6px",
            borderRadius: "4px",
            color: isUserMessage ? "#FFFFFF" : "#e11d48",
          }}>{children}</code>
        );
      }
      // Block code
      return (
        <pre style={{
          backgroundColor: codeBackground,
          border: `1px solid ${codeBorderColor}`,
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "12px",
          overflow: "auto",
        }}>
          <code style={{
            fontFamily: "'Fira Code', 'Consolas', monospace",
            fontSize: "13px",
            lineHeight: "1.5",
            color: isUserMessage ? "#FFFFFF" : "#1f2937",
          }}>{children}</code>
        </pre>
      );
    },
    pre: ({ children }: any) => <>{children}</>,
    
    // Blockquotes
    blockquote: ({ children }: any) => (
      <blockquote style={{
        borderLeft: `4px solid ${blockquoteBorder}`,
        paddingLeft: "16px",
        marginLeft: "0",
        marginBottom: "12px",
        fontStyle: "italic",
        color: mutedColor,
      }}>{children}</blockquote>
    ),
    
    // Tables
    table: ({ children }: any) => (
      <div style={{ overflowX: "auto", marginBottom: "12px" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
          fontFamily: "Poppins, sans-serif",
        }}>{children}</table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead style={{
        backgroundColor: isUserMessage ? "rgba(255,255,255,0.1)" : "#f9fafb",
      }}>{children}</thead>
    ),
    tbody: ({ children }: any) => <tbody>{children}</tbody>,
    tr: ({ children }: any) => (
      <tr style={{
        borderBottom: `1px solid ${tableBorderColor}`,
      }}>{children}</tr>
    ),
    th: ({ children }: any) => (
      <th style={{
        padding: "10px 12px",
        textAlign: "left",
        fontWeight: 600,
        color: headingColor,
        borderBottom: `2px solid ${tableBorderColor}`,
      }}>{children}</th>
    ),
    td: ({ children }: any) => (
      <td style={{
        padding: "10px 12px",
        color: textColor,
      }}>{children}</td>
    ),
    
    // Links
    a: ({ href, children }: any) => {
      // Check if it's an agent link
      if (href?.startsWith('/agents/')) {
        const agentId = href.replace('/agents/', '');
        const agent = agents.find(a => a.agent_id === agentId);
        if (agent) {
          return (
            <a 
              href={href}
              style={{
                color: isUserMessage ? "#93c5fd" : "#2563eb",
                textDecoration: "none",
                fontWeight: 500,
                borderBottom: `1px dashed ${isUserMessage ? "#93c5fd" : "#2563eb"}`,
              }}
            >{children}</a>
          );
        }
      }
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: isUserMessage ? "#93c5fd" : "#2563eb",
            textDecoration: "none",
          }}
        >{children}</a>
      );
    },
    
    // Emphasis
    strong: ({ children }: any) => (
      <strong style={{ fontWeight: 600, color: "inherit" }}>{children}</strong>
    ),
    em: ({ children }: any) => (
      <em style={{ fontStyle: "italic" }}>{children}</em>
    ),
    
    // Horizontal rule
    hr: () => (
      <hr style={{
        border: "none",
        borderTop: `1px solid ${tableBorderColor}`,
        margin: "16px 0",
      }} />
    ),
  };
}

// Intro Text Component - Displays plain text without card
function IntroText({ text, agents }: { text: string; agents: Agent[] }) {
  if (!text) return null;
  
  const processTextWithAgents = (text: string): string => {
    if (!agents.length) return text;
    
    let processedText = text;
    const sortedAgents = [...agents].sort((a, b) => b.agent_name.length - a.agent_name.length);
    const processedMarkers = new Set<string>();
    
    sortedAgents.forEach(agent => {
      const escapedName = agent.agent_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const marker = `__AGENT_${agent.agent_id}__`;
      
      if (processedMarkers.has(marker)) return;
      processedMarkers.add(marker);
      
      const patterns = [
        new RegExp(`(\\d+[.)]\\s*)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
        new RegExp(`(^|\\s|\\n)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
      ];
      
      patterns.forEach(pattern => {
        processedText = processedText.replace(pattern, (match, prefix, name) => {
          if (match.includes('[') && match.includes('](')) {
            return match;
          }
          return `${prefix || ''}[${name}](/agents/${agent.agent_id})`;
        });
      });
    });
    
    return processedText;
  };

  const markdownComponents = {
    p: ({ children }: any) => {
      return <p className="mb-2 last:mb-0" style={{ color: "#374151", fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>{children}</p>;
    },
    a: ({ href, children }: any) => {
      if (!href || !href.startsWith('/agents/')) {
        return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
      }
      const agentId = href.replace('/agents/', '');
      const agent = agents.find(a => a.agent_id === agentId);
      if (agent) {
        return <AgentResponseCard agent={agent} />;
      }
      return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
    },
    strong: ({ children }: any) => <strong className="font-semibold" style={{ color: "inherit" }}>{children}</strong>,
  };

  return (
    <div className="mb-4" style={{ paddingLeft: "0", paddingRight: "0" }}>
      <div className="prose prose-gray max-w-none" style={{ fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {processTextWithAgents(text)}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// Agent Info Card Component - Main Agent Card
function AgentInfoCard({ markdown, agents, onAgentCardRender, filteredAgentIds }: { 
  markdown: string; 
  agents: Agent[];
  onAgentCardRender?: (agentCards: React.ReactElement[]) => void;
  filteredAgentIds?: string[];
}) {
  const processTextWithAgents = (text: string): string => {
    if (!agents.length) return text;
    
    let processedText = text;
    const sortedAgents = [...agents].sort((a, b) => b.agent_name.length - a.agent_name.length);
    const processedMarkers = new Set<string>();
    
    sortedAgents.forEach(agent => {
      const escapedName = agent.agent_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const marker = `__AGENT_${agent.agent_id}__`;
      
      if (processedMarkers.has(marker)) return;
      processedMarkers.add(marker);
      
      const patterns = [
        new RegExp(`(\\d+[.)]\\s*)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
        new RegExp(`(^|\\s|\\n)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
      ];
      
      patterns.forEach(pattern => {
        processedText = processedText.replace(pattern, (match, prefix, name) => {
          if (match.includes('[') && match.includes('](')) {
            return match;
          }
          return `${prefix || ''}[${name}](/agents/${agent.agent_id})`;
        });
      });
    });
    
    return processedText;
  };

  // Preprocess markdown to convert section labels from list items to proper headings/paragraphs
  // This ensures they don't render as bullets
  const preprocessMarkdown = (md: string): string => {
    let processed = md;
    
    // Convert list items with section labels to headings or paragraphs
    // Pattern: - **Description**: content
    processed = processed.replace(/^[-*•]\s+\*\*Description\*\*:\s*(.+)$/gim, (match, content) => {
      return content.trim();
    });
    
    // Pattern: - Description: content (without bold)
    processed = processed.replace(/^[-*•]\s+Description:\s*(.+)$/gim, (match, content) => {
      return content.trim();
    });
    
    // Pattern: - **Key Features**: (with nested list)
    processed = processed.replace(/^[-*•]\s+\*\*Key Features\*\*:\s*$/gim, '#### Key Features');
    
    // Pattern: - Key Features: (without bold, with nested list)
    processed = processed.replace(/^[-*•]\s+Key Features:\s*$/gim, '#### Key Features');
    
    // Pattern: - **Value Proposition**: content
    processed = processed.replace(/^[-*•]\s+\*\*Value Proposition\*\*:\s*(.+)$/gim, (match, content) => {
      return content.trim();
    });
    
    // Pattern: - Value Proposition: content (without bold)
    processed = processed.replace(/^[-*•]\s+Value Proposition:\s*(.+)$/gim, (match, content) => {
      return content.trim();
    });
    
    return processed;
  };

  // Remove labels from markdown before rendering
  // Remove "Description" label but keep the descriptive text
  const cleanedMarkdown = removeMarkdownLabels(preprocessMarkdown(markdown), ['Description']);

  const markdownComponents = {
    h3: ({ children }: any) => {
      const text = typeof children === 'string' ? children : 
        (Array.isArray(children) ? children.join('') : String(children));
      
      // Check if we have filtered agent IDs to show a tag/button
      const hasFilteredAgents = filteredAgentIds && Array.isArray(filteredAgentIds) && filteredAgentIds.length > 0;
      const firstAgentId = hasFilteredAgents ? filteredAgentIds[0] : null;
      
      return (
        <div className="flex items-center justify-between gap-3 mb-2 mt-3 first:mt-0 flex-wrap">
          <h3 
            className="font-semibold"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "21px",
              lineHeight: "120%",
              letterSpacing: "0%",
              color: "#111827",
              margin: 0,
            }}
          >
            {children}
          </h3>
          {firstAgentId && (
            <Link 
              href={`/agents/${firstAgentId}`}
              className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity flex-shrink-0"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "14px",
                lineHeight: "21px",
                letterSpacing: "0%",
                color: "#2563EB",
                textDecoration: "none",
              }}
            >
              View Agent <span style={{ marginLeft: "4px" }}>›</span>
            </Link>
          )}
        </div>
      );
    },
    h4: ({ children }: any) => {
      return (
        <h4 
          className="font-semibold mb-2 mt-4 first:mt-0" 
          style={{ 
            color: "#111827", 
            fontSize: "16px", 
            lineHeight: "1.4", 
            fontFamily: "Poppins, sans-serif", 
            fontWeight: 600,
            marginTop: "16px",
            marginBottom: "8px",
          }}
        >
          {children}
        </h4>
      );
    },
    p: ({ children }: any) => {
      return <p className="mb-2 last:mb-0" style={{ color: "#4b5563", fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>{children}</p>;
    },
    ul: ({ children }: any) => {
      // Check if all direct children (li elements) are section labels
      // If so, render them without list structure to avoid bullets
      if (Array.isArray(children)) {
        const allSectionLabels = children.every((child: any) => {
          if (!child || !child.props) return false;
          const textContent = extractTextFromChildren(child.props.children);
          const parsed = parseSectionLabel(textContent);
          return parsed.isLabel;
        });
        
        // If all are section labels, render without list structure (just the children)
        if (allSectionLabels) {
          return <div>{children}</div>;
        }
      }
      
      return <ul className="list-disc list-inside mb-2 space-y-1" style={{ color: "inherit" }}>{children}</ul>;
    },
    ol: ({ children }: any) => {
      return <ol className="list-decimal list-inside mb-2 space-y-1" style={{ color: "inherit" }}>{children}</ol>;
    },
    li: ({ children }: any) => {
      // Extract text content to check if it's a section label
      const textContent = extractTextFromChildren(children);
      const parsed = parseSectionLabel(textContent);
      
      // If it's a section label, handle it differently based on label type
      if (parsed.isLabel && parsed.label) {
        const labelLower = parsed.label.toLowerCase();
        
        // Description and Value Proposition: render only the content as paragraph (no label, no bullet)
        if (labelLower === 'description' || labelLower === 'value proposition') {
          // If there's content, render just the content as paragraph (skip the label)
          if (parsed.content) {
            return (
              <div style={{ marginBottom: "8px" }}>
                <p 
                  className="mb-0" 
                  style={{ 
                    color: "#4b5563", 
                    fontSize: "14px", 
                    lineHeight: "21px", 
                    fontFamily: "Poppins, sans-serif", 
                    fontWeight: 400, 
                    letterSpacing: "0%",
                    marginTop: "0",
                    marginBottom: "0",
                  }}
                >
                  {parsed.content}
                </p>
              </div>
            );
          }
          // If no content, render empty div to maintain list structure but hide the label
          return <div style={{ display: "none" }} />;
        }
        
        // Key Features: render as section header (no bullet, no content on same line)
        // Preserve any nested lists (actual feature items) - they will be rendered by ReactMarkdown
        if (labelLower === 'key features' || labelLower === 'features') {
          // Render as heading, but preserve any nested content (like nested ul/ol)
          // Filter out the label text from children to avoid duplication
          const filteredChildren = Array.isArray(children) 
            ? children.filter((child: any) => {
                const childText = extractTextFromChildren(child);
                // Keep nested lists and other non-text elements
                if (typeof child !== 'string' && child?.type) return true;
                // Filter out text that matches the label
                return !childText.toLowerCase().includes(labelLower);
              })
            : [];
          
          return (
            <div style={{ marginTop: "16px", marginBottom: "8px" }}>
              <h4 
                className="font-semibold mb-2 first:mt-0" 
                style={{ 
                  color: "#111827", 
                  fontSize: "16px", 
                  lineHeight: "1.4", 
                  fontFamily: "Poppins, sans-serif", 
                  fontWeight: 600,
                  marginTop: "16px",
                  marginBottom: "8px",
                }}
              >
                {parsed.label}
              </h4>
              {filteredChildren.length > 0 && <div>{filteredChildren}</div>}
            </div>
          );
        }
        
        // Other section labels: render as heading with optional content
        return (
          <div style={{ marginTop: "16px", marginBottom: "8px" }}>
            <h4 
              className="font-semibold mb-2 first:mt-0" 
              style={{ 
                color: "#111827", 
                fontSize: "16px", 
                lineHeight: "1.4", 
                fontFamily: "Poppins, sans-serif", 
                fontWeight: 600,
                marginBottom: parsed.content ? "8px" : "0",
              }}
            >
              {parsed.label}
            </h4>
            {parsed.content && (
              <p 
                className="mb-0" 
                style={{ 
                  color: "#4b5563", 
                  fontSize: "14px", 
                  lineHeight: "21px", 
                  fontFamily: "Poppins, sans-serif", 
                  fontWeight: 400, 
                  letterSpacing: "0%",
                  marginTop: "0",
                }}
              >
                {parsed.content}
              </p>
            )}
          </div>
        );
      }
      
      // Regular list item - render with bullet
      return <li className="ml-2" style={{ color: "#374151", fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>{children}</li>;
    },
    a: ({ href, children }: any) => {
      if (!href || !href.startsWith('/agents/')) {
        return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
      }
      const agentId = href.replace('/agents/', '');
      const agent = agents.find(a => a.agent_id === agentId);
      if (agent) {
        return <AgentResponseCard agent={agent} />;
      }
      return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
    },
    strong: ({ children }: any) => <strong className="font-semibold" style={{ color: "inherit" }}>{children}</strong>,
    code: ({ children }: any) => (
      <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ backgroundColor: "#E5E7EB", color: "inherit" }}>
        {children}
      </code>
    ),
  };

  return (
    <SectionCard>
      <div className="prose prose-gray max-w-none" style={{ fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}
        >
          {processTextWithAgents(cleanedMarkdown)}
        </ReactMarkdown>
      </div>
    </SectionCard>
  );
}

// Mega Trend Card Component - Collapsible
function MegaTrendCard({ markdown, agents }: { markdown: string; agents: Agent[] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  if (!markdown) return null;

  const processTextWithAgents = (text: string): string => {
    if (!agents.length) return text;
    
    let processedText = text;
    const sortedAgents = [...agents].sort((a, b) => b.agent_name.length - a.agent_name.length);
    const processedMarkers = new Set<string>();
    
    sortedAgents.forEach(agent => {
      const escapedName = agent.agent_name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const marker = `__AGENT_${agent.agent_id}__`;
      
      if (processedMarkers.has(marker)) return;
      processedMarkers.add(marker);
      
      const patterns = [
        new RegExp(`(\\d+[.)]\\s*)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
        new RegExp(`(^|\\s|\\n)(${escapedName})(?=\\s|$|,|\\.|:|;|\\n)`, 'gi'),
      ];
      
      patterns.forEach(pattern => {
        processedText = processedText.replace(pattern, (match, prefix, name) => {
          if (match.includes('[') && match.includes('](')) {
            return match;
          }
          return `${prefix || ''}[${name}](/agents/${agent.agent_id})`;
        });
      });
    });
    
    return processedText;
  };

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-2 cursor-pointer hover:opacity-80 transition-opacity mb-3"
        style={{
          fontFamily: "Poppins, sans-serif",
          paddingLeft: "0px",
          paddingRight: "0px",
          marginTop:"45px"
        }}
      >
        <h2 
          className="font-semibold flex items-center gap-2"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontStyle: "normal",
          fontSize: "21px",
          lineHeight: "120%",
          letterSpacing: "0%",
          color: "#3B60AF",
        }}
      >
          <img 
            src="/up-stream.png" 
            alt="Up Stream" 
            style={{ 
              width: "21.000417709350586px", 
              height: "13.500417709350586px", 
              marginLeft: "1.5px",
              marginTop: "4.5px",
              display: "inline-block",
              verticalAlign: "top",
              opacity: 1,
              transform: "rotate(0deg)"
            }} 
          />
          Mega Trends
      </h2>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      
      {/* Divider line after Mega Trends title */}
      <div 
        style={{ 
          height: "1px", 
          backgroundColor: "#D1D5DB",
          marginLeft: "0px",
          marginRight: "0px",
          marginBottom: "15px"
        }} 
      />
      
      {isExpanded && (
        <div className="prose prose-gray max-w-none px-0 pb-0" style={{ fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h4: ({ children }) => {
                // Handle subtitle styling
                const text = typeof children === 'string' ? children : 
                  (Array.isArray(children) ? children.join('') : String(children));
                
                return (
                  <h4 
                    className="font-semibold mb-1 mt-5 first:mt-0"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontSize: "16px",
                      lineHeight: "1.6",
                      color: "#111827",
                    }}
                  >
                    {children}
                  </h4>
                );
              },
              h3: ({ children }) => {
                const text = typeof children === 'string' ? children : 
                  (Array.isArray(children) ? children.join('') : String(children));
                
                // Check if this is the combined title/subtitle heading (contains pipe separator)
                const isCombinedTitleSubtitle = typeof text === 'string' && text.includes('|');
                
                if (isCombinedTitleSubtitle) {
                  return (
                    <h3 
                      className="mb-2 mt-3 first:mt-0"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 400,
                        fontStyle: "normal",
                        fontSize: "14px",
                        lineHeight: "21px",
                        letterSpacing: "0%",
                        color: "#091917",
                      }}
                    >
                      {children}
                    </h3>
                  );
                }
                
                if (typeof text === 'string' && (text.includes('Description:') || text.includes('Key Features:'))) {
                  return (
                    <h4 className="font-semibold text-gray-900 mt-4 mb-1 first:mt-0" style={{ fontSize: '15px' }}>
                      {children}
                    </h4>
                  );
                }
                
                const isMegaTrendHeading = typeof text === 'string' && 
                  (text.toUpperCase().includes('THEME') || text.toUpperCase().includes('THE SHIFT') || text.toUpperCase().includes('THE TENSION') || 
                   text.toUpperCase().includes('THE OPPORTUNITY') || text.toUpperCase().includes('AGENTIC OPPORTUNITY PLAYS'));
                
                if (isMegaTrendHeading) {
                  // Check if it's exactly one of these headings
                  const upperText = text.toUpperCase().trim();
                  const isExactMatch = upperText === 'THEME' || upperText === 'THE SHIFT' || upperText === 'THE TENSION' || 
                                      upperText === 'THE OPPORTUNITY' || upperText === 'AGENTIC OPPORTUNITY PLAYS' ||
                                      upperText.startsWith('THEME:') || upperText.startsWith('THE SHIFT:') || 
                                      upperText.startsWith('THE TENSION:') || upperText.startsWith('THE OPPORTUNITY:') ||
                                      upperText.startsWith('AGENTIC OPPORTUNITY PLAYS:');
                  
                  if (isExactMatch) {
                    return (
                      <div className="mt-4 first:mt-0 mb-2">
                        <p 
                          className="font-semibold uppercase"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            fontSize: "12px",
                            letterSpacing: "0.5px",
                            lineHeight: "1.5",
                            color: "#111827",
                            marginBottom: "8px",
                          }}
                        >
                        {children}
                        </p>
                      </div>
                    );
                  }
                }
                
                const isMegaTrendCard = typeof text === 'string' && 
                  /^Mega Trend\s*-\s*\d+/i.test(text.trim());
                
                if (isMegaTrendCard) {
                  return (
                    <h3 
                      className="font-bold mb-4 mt-6 first:mt-0"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                        fontSize: "20px",
                        lineHeight: "1.3",
                        color: "#111827",
                      }}
                    >
                      {children}
                    </h3>
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
                // Check if this paragraph contains a mega trend heading (THEME, THE SHIFT, etc.)
                const text = typeof children === 'string' ? children : 
                  (Array.isArray(children) ? children.join('') : String(children));
                
                if (typeof text === 'string') {
                  const upperText = text.toUpperCase().trim();
                  const isMegaTrendHeading = upperText === 'THEME' || upperText === 'THE SHIFT' || upperText === 'THE TENSION' || 
                                            upperText === 'THE OPPORTUNITY' || upperText === 'AGENTIC OPPORTUNITY PLAYS' ||
                                            upperText.startsWith('THEME:') || upperText.startsWith('THE SHIFT:') || 
                                            upperText.startsWith('THE TENSION:') || upperText.startsWith('THE OPPORTUNITY:') ||
                                            upperText.startsWith('AGENTIC OPPORTUNITY PLAYS:');
                  
                  if (isMegaTrendHeading) {
                    // Remove colon if present
                    const displayText = text.replace(/:\s*$/, '').trim();
                    return (
                      <div className="mt-4 first:mt-0 mb-2">
                        <p 
                          className="font-semibold uppercase"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600,
                            fontSize: "12px",
                            letterSpacing: "0.5px",
                            lineHeight: "1.5",
                            color: "#111827",
                            marginBottom: "8px",
                          }}
                        >
                          {displayText}
                        </p>
                      </div>
                    );
                  }
                }
                
                return <p className="mb-3 last:mb-0" style={{ color: "#374151", fontSize: "14px", lineHeight: "21px", marginTop: "0px", marginBottom: "8px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>{children}</p>;
              },
              ul: ({ children }) => {
                return (
                  <ul 
                    className="list-disc list-inside mb-2 space-y-1"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                      fontStyle: "normal",
                      fontSize: "21px",
                      lineHeight: "120%",
                      letterSpacing: "0%",
                      color: "#111827",
                    }}
                  >
                    {children}
                  </ul>
                );
              },
              ol: ({ children }) => {
                return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>;
              },
              li: ({ children }) => {
                // Extract text content to check if it's a section label
                const textContent = extractTextFromChildren(children);
                const parsed = parseSectionLabel(textContent);
                
                // If it's a section label, render as a heading instead of a bullet point
                if (parsed.isLabel && parsed.label) {
                  return (
                    <div style={{ marginTop: "16px", marginBottom: "8px" }}>
                      <h4 
                        className="font-semibold mb-2 first:mt-0" 
                        style={{ 
                          color: "#111827", 
                          fontSize: "16px", 
                          lineHeight: "1.4", 
                          fontFamily: "Poppins, sans-serif", 
                          fontWeight: 600,
                          marginBottom: parsed.content ? "8px" : "0",
                        }}
                      >
                        {parsed.label}
                      </h4>
                      {parsed.content && (
                        <p 
                          className="mb-0" 
                          style={{ 
                            color: "#374151", 
                            fontSize: "14px", 
                            lineHeight: "21px", 
                            fontFamily: "Poppins, sans-serif", 
                            fontWeight: 400, 
                            letterSpacing: "0%",
                            marginTop: "0",
                          }}
                        >
                          {parsed.content}
                        </p>
                      )}
                    </div>
                  );
                }
                
                // Regular list item - render with bullet
                return <li className="ml-2" style={{ color: "#374151", fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>{children}</li>;
              },
              a: ({ href, children }: any) => {
                if (!href || !href.startsWith('/agents/')) {
                  return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
                }
                const agentId = href.replace('/agents/', '');
                const agent = agents.find(a => a.agent_id === agentId);
                if (agent) {
                  return <AgentResponseCard agent={agent} />;
                }
                return <a href={href} className="text-blue-600 hover:underline">{children}</a>;
              },
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            }}
          >
            {processTextWithAgents(processMegaTrendsMarkdown(markdown)
              .replace(/^[-*•]\s*(Description:|Key Features:)/gm, '### $1')
              .replace(/^\d+\.\s*(Description:|Key Features:)/gm, '### $1')
              .replace(/^[\s]*[-*•]\s*(Description:|Key Features:)/gm, '### $1')
              .replace(/^(Description:|Key Features:)/gm, '### $1')
              .replace(/^\s+[-*•]\s*(Description:|Key Features:)/gm, '### $1'))}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}

// Suggested Agents Component - Improved card layout
function SuggestedAgents({ suggested_agents }: { suggested_agents?: Array<{ solution_name: string; description?: string; segment?: string; trend_reference?: string }> }) {
  if (!suggested_agents || !Array.isArray(suggested_agents) || suggested_agents.length === 0) return null;

  return (
    <div>
      <h2 
        className="font-medium flex items-center gap-2 mb-4"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 500,
          fontStyle: "normal",
          fontSize: "21px",
          lineHeight: "120%",
          letterSpacing: "0%",
          color: "#1C4A46",
          marginBottom: "16px",
          marginTop:"40px"
        }}
      >
        <Sparkles className="w-4 h-4" style={{ color: "#1C4A46" }} />
        Suggested Agents
      </h2>
      
      {/* Divider line after Suggested Agents title */}
      <div 
        style={{ 
          height: "1px", 
          backgroundColor: "#D1D5DB",
          marginLeft: "0px",
          marginRight: "0px",
          marginBottom: "15px"
        }} 
      />
      
      <div className="space-y-3">
      {suggested_agents.map((agent, index) => (
          <div
            key={index}
            className="mb-3 agent-card-hover card-stagger"
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <SectionCard className="mb-0">
          <div 
              className="font-semibold mb-2"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
                fontSize: "16px",
              color: "#111827",
                marginBottom: agent.description ? "8px" : "0",
                

            }}
          >
            {agent.solution_name}
          </div>
          {agent.description && (
            <div 
                className="mb-3"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontSize: "14px",
                  lineHeight: "21px",
                  fontWeight: 400,
                  letterSpacing: "0%",
                color: "#4B5563",
                  marginBottom: (agent.segment || agent.trend_reference) ? "12px" : "0",
              }}
            >
              {agent.description}
            </div>
          )}
            {(agent.segment || agent.trend_reference) && (
          <div 
                className="flex flex-wrap gap-2"
            style={{
              fontFamily: "Poppins, sans-serif",
                }}
              >
                {agent.trend_reference && (
                  <span 
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "#ffffff",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "12.3px",
                      lineHeight: "21px",
                      letterSpacing: "-0.33",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                      color: "#65717C",
                      border: "1px solid rgb(145, 157, 168)",
                    }}
                  >
                    {agent.trend_reference}
                  </span>
                )}
                {agent.segment && (
                  <span 
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "#ffffff",
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "12.3px",
                      lineHeight: "21px",
                      letterSpacing: "-0.33",
                      verticalAlign: "middle",
                      textTransform: "uppercase",
                      color: "#65717C",
                      border: "1px solid rgb(151, 165, 179)",
                    }}
                  >
                    Segment: {agent.segment}
                  </span>
                )}
          </div>
            )}
            </SectionCard>
          </div>
      ))}
      </div>
    </div>
  );
}

// Agent Card Component matching Figma design
function AgentResponseCard({ agent, index }: { agent: Agent; index?: number }) {
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

  // Combine features with value proposition if it's not already included
  const allFeatures = valueProposition && !features.some(f => f.toLowerCase().includes(valueProposition.toLowerCase()))
    ? [...features, `Value Proposition: ${valueProposition}`]
    : features;

  return (
    <div className="agent-card-hover card-stagger" style={{ animationDelay: index !== undefined ? `${index * 100}ms` : '0ms' }}>
      <SectionCard>
        {/* Header: Agent Name and View Link */}
      <div className="flex items-start justify-between mb-3">
        <h3 
          className="font-bold"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontSize: "18px",
            lineHeight: "1.3",
            color: "#111827",
          }}
        >
          {agent.agent_name}
        </h3>
        <Link 
          href={`/agents/${agent.agent_id}`}
          className="hover:opacity-80 font-semibold text-xs flex items-center gap-1 transition-all duration-200 hover:scale-105"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontStyle: "normal",
            fontSize: "14px",
            lineHeight: "21px",
            letterSpacing: "0%",
            verticalAlign: "middle",
            textTransform: "uppercase",
            color: "#111827",
            textDecoration: "none",
          }}
        >
          VIEW AGENT
          <span style={{ fontSize: "14px", marginLeft: "2px" }}>›</span>
        </Link>
      </div>

      {/* Description */}
      {agent.description && (
        <p 
          className="mb-4"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontSize: "14px",
            lineHeight: "21px",
            fontWeight: 400,
            letterSpacing: "0%",
            color: "#4B5563",
            marginBottom: "12px",
          }}
        >
          {agent.description}
        </p>
      )}

      {/* Key Features */}
      {allFeatures.length > 0 && (
        <div className="mb-4">
          <h4 
            className="font-semibold mb-2 uppercase"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "11px",
              letterSpacing: "0.5px",
              color: "#6B7280",
              marginBottom: "10px",
            }}
          >
            KEY FEATURES
          </h4>
          <ul className="list-disc space-y-1.5" style={{ marginLeft: "20px", paddingLeft: "0" }}>
            {allFeatures.map((feature, index) => (
              <li 
                key={index}
                style={{
                  fontFamily: "Poppins, sans-serif",
                    fontSize: "14px",
                    lineHeight: "21px",
                    fontWeight: 400,
                    letterSpacing: "0%",
                  color: "#374151",
                    paddingLeft: "4px",
                }}
              >
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Value Proposition - separate section */}
      {valueProposition && !allFeatures.some(f => f.toLowerCase().includes(valueProposition.toLowerCase())) && (
        <div className="mt-4">
          <h4 
            className="font-semibold mb-2 uppercase"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontSize: "11px",
              letterSpacing: "0.5px",
              color: "#6B7280",
              marginBottom: "10px",
            }}
          >
            VALUE PROPOSITION
          </h4>
          <p 
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              lineHeight: "21px",
              fontWeight: 400,
              letterSpacing: "0%",
              color: "#374151",
            }}
          >
            {valueProposition}
          </p>
        </div>
      )}
      </SectionCard>
    </div>
  );
}

// Agent Carousel Component for multiple agents
function AgentCarousel({ agents }: { agents: Agent[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (agents.length === 0) return null;
  if (agents.length === 1) {
    return <AgentResponseCard agent={agents[0]} />;
  }

  const nextAgent = () => {
    setCurrentIndex((prev) => (prev + 1) % agents.length);
  };

  const prevAgent = () => {
    setCurrentIndex((prev) => (prev - 1 + agents.length) % agents.length);
  };

  return (
    <div className="relative my-4">
      <div className="card-stagger" style={{ animationDelay: '0ms' }}>
        <AgentResponseCard agent={agents[currentIndex]} />
      </div>
      
      {/* Navigation Controls - Only Next button */}
      <div className="flex items-center justify-end mt-4 px-2">
        {currentIndex < agents.length - 1 && (
          <button
            onClick={nextAgent}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 button-shine active:scale-95 shadow-sm"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "14px",
              lineHeight: "21px",
              letterSpacing: "0%",
              verticalAlign: "middle",
              textTransform: "uppercase",
              color: "#111827",
              borderColor: "#2563EB",
            }}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        {currentIndex === agents.length - 1 && (
          <span 
            className="text-sm text-gray-500"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              color: "#9CA3AF",
            }}
          >
            Showing {agents.length} of {agents.length} agents
          </span>
        )}
      </div>
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
        <span 
          className="text-sm font-semibold"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            fontStyle: "normal",
            fontSize: "14px",
            lineHeight: "21px",
            letterSpacing: "0%",
            verticalAlign: "middle",
            textTransform: "uppercase",
            color: "#111827",
          }}
        >
          {agent.agent_name}
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
      </span>
    </Link>
  );
}

// Swipe to visit agent store component - positioned on right side
function SwipeToAgentStore() {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe || isRightSwipe) {
      router.push('/agents');
    }
  };

  const handleClick = () => {
    router.push('/agents');
  };

  return (
    <div
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed right-8 top-1/2 cursor-pointer  items-center gap-3 py-4 px-3 rounded-lg hover:bg-white/90 active:bg-white transition-all select-none"
      style={{
        fontFamily: "Poppins, sans-serif",
       
      }}
    >
      <span 
        className="whitespace-nowrap"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          fontSize: "12px",
          lineHeight: "130%",
          letterSpacing: "0%",
          verticalAlign: "middle",
          textTransform: "uppercase",
          color: "#111827",
          width: "88px",
          height: "32px",
          // top: "391px",
          transform: "rotate(0deg)",
          opacity: 1,
          backgroundColor: "transparent",
        }}
      >
        VISIT <br/> AGENTS STORE
         <div 
        className="flex items-center justify-center"
      >

        <Image
          src="/Arrow_right.png"
          alt="Arrow right"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>
        
      </span>
     
    </div>
  );
}

export default function AgentsChatPage() {
  const router = useRouter();
  const [chatInput, setChatInput] = useState("");
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
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
  const renderMessageWithAgentCards = (text: string): (string | React.ReactElement)[] => {
    if (!agents.length) return [text];
    
    const parts: (string | React.ReactElement)[] = [];
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
      const agentGroups: Array<{ agents: Agent[]; startIndex: number; endIndex: number }> = [];
      let currentGroup: { agents: Agent[]; startIndex: number; endIndex: number } | null = null;
      
      // Group consecutive agents together
      agentMatches.forEach(({ agent, startIndex, endIndex }) => {
        const gap = startIndex - (currentGroup?.endIndex || 0);
        const isConsecutive = gap < 100; // Consider agents within 100 chars as consecutive
        
        if (isConsecutive && currentGroup) {
          currentGroup.agents.push(agent);
          currentGroup.endIndex = endIndex;
        } else {
          if (currentGroup) {
            agentGroups.push(currentGroup);
          }
          currentGroup = { agents: [agent], startIndex, endIndex };
        }
      });
      
      if (currentGroup) {
        agentGroups.push(currentGroup);
      }
      
      // Render groups and text
      agentGroups.forEach((group, groupIdx) => {
        // Add text before the group
        if (group.startIndex > lastIndex) {
          const beforeText = text.substring(lastIndex, group.startIndex);
          if (beforeText.trim()) {
            parts.push(beforeText);
          }
        }
        
        // Add agent carousel or single card
        if (group.agents.length > 1) {
          parts.push(<AgentCarousel key={`agent-carousel-${groupIdx}`} agents={group.agents} />);
        } else {
          parts.push(<AgentResponseCard key={`agent-card-${group.agents[0].agent_id}-${groupIdx}`} agent={group.agents[0]} />);
        }
        
        lastIndex = group.endIndex;
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
    setFeedback({ type: 'success', message: 'Message sent!' });
    setTimeout(() => setFeedback(null), 2000);
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
      
      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }
      
      const json = await res.json().catch(() => null);
      if (!json || !json.data) {
        throw new Error("Invalid API response format");
      }
      
      const reply = json.data.response || "Sorry, something went wrong. Please try again later.";
      
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
      console.error("Error sending chat message:", e);
      const errTs = formatDateTime();
      updateMessage(thinkingMessageId, {
        text: "I'm currently experiencing technical difficulties. Please try again.",
        time: errTs
      });
      setFeedback({ type: 'error', message: 'Failed to send message' });
      setTimeout(() => setFeedback(null), 2000);
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
    if (scrollContainerRef.current && isMounted && messages.length > 0) {
      const scrollContainer = scrollContainerRef.current;
      setTimeout(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }, 150);
    }
  }, [messages, isMounted]);

  // Auto-resize chat input - optimized with requestAnimationFrame
  const resizeTextarea = useRef<number | null>(null);
  
  useEffect(() => {
    const el = chatInputRef.current;
    if (!el) return;
    
    // Cancel any pending resize
    if (resizeTextarea.current) {
      cancelAnimationFrame(resizeTextarea.current);
    }
    
    // Use requestAnimationFrame for smoother resizing
    resizeTextarea.current = requestAnimationFrame(() => {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 150)}px`;
    });
    
    return () => {
      if (resizeTextarea.current) {
        cancelAnimationFrame(resizeTextarea.current);
      }
    };
  }, [chatInput]);

  // Enhanced Thinking Component with wave dots
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
      <div className="w-full py-2 px-2 relative overflow-hidden rounded-lg">
        <div className="absolute inset-0 shimmer-bg" />
        <div className="relative flex items-center gap-2">
          <p 
            className="text-sm"
            style={{ 
              fontFamily: "Poppins, sans-serif",
              fontSize: "14px",
              lineHeight: "21px",
              fontWeight: 400,
              letterSpacing: "0%",
              color: "#374151",
            }}
          >
            Thinking{dots}
          </p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-gray-500 rounded-full wave-dot"
                style={{
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Add CSS to hide scrollbar
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .chat-scroll-container::-webkit-scrollbar {
        display: none;
      }
      .chat-scroll-container {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div 
      className="flex flex-col h-screen relative overflow-hidden"
      style={{
        backgroundColor: "#f8fafc",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Background images on left and right sides - greyed out */}
      <div
        className="fixed left-0 top-0 bottom-0 z-0"
        style={{
          width: "30%",
          backgroundImage: "url('/backgrop chat.png')",
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
          filter: "grayscale(100%) opacity(0.4)",
        }}
      />
      <div
        className="fixed right-0 top-0 bottom-0 z-0"
        style={{
          width: "30%",
          backgroundImage: "url('/backgrop chat.png')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
          pointerEvents: "none",
          filter: "grayscale(100%) opacity(0.4)",
        }}
      />
      {/* Swipe to visit agent store - positioned on right side */}
      <SwipeToAgentStore />
      {/* Single scrollable container for entire chat */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative z-10 chat-scroll-container"
        style={{ 
          scrollBehavior: "smooth",
          scrollbarWidth: "none", /* Firefox */
          msOverflowStyle: "none", /* IE and Edge */
        }}
      >
        {/* White background for center content area - extends full height */}
        <div 
          className="fixed top-0 bottom-0 z-0"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            width: "1800px",
            maxWidth: "100%",
            backgroundImage: `
  linear-gradient(to right,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.3) 10%,
    rgba(255,255,255,0.6) 14%,
    rgba(255,255,255,0.85) 18%,
    white 25%,
    white 75%,
    rgba(255,255,255,0.85) 85%,
    rgba(255,255,255,0.6) 90%,
    rgba(255,255,255,0.3) 95%,
    rgba(255,255,255,0) 100%
  )
`,
          }}
        />
        {/* Centered content wrapper */}
        <div 
          className="relative z-10 w-full max-w-3xl mx-auto px-4 py-6"
          style={{
            paddingBottom: "160px", // Space for fixed input
            backgroundColor: "white",
          }}
        >
          <div className="space-y-4">
          {isMounted && messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
              style={{
                animation: `fadeInSlideUp 0.3s ease-out ${index * 0.05}s both`,
                width: "100%",
              }}
            >
              <div
                className={`message-bubble ${message.role === "user" ? "rounded-2xl px-5 py-3" : ""}`}
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontSize: "14px",
                  lineHeight: "22px",
                  fontWeight: 400,
                  backgroundColor: message.role === "user" ? "#1f2937" : "transparent",
                  color: message.role === "user" ? "#FFFFFF" : "#374151",
                  width: message.role === "user" ? "fit-content" : "100%",
                  maxWidth: message.role === "user" ? "80%" : "100%",
                  boxShadow: message.role === "user" ? "0 2px 8px rgba(0, 0, 0, 0.12)" : "none",
                }}
              >
                {message.role === "assistant" && message.text === "AI thinking..." ? (
                  <div 
                    className="w-full rounded-2xl"
                    style={{
                      backgroundColor: "#F3F4F6",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                      padding: "16px 20px",
                    }}
                  >
                  <SimpleThinking />
                  </div>
                ) : message.role === "assistant" ? (
                  <div 
                    className="w-full rounded-2xl"
                    style={{
                      backgroundColor: "#F3F4F6",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                      padding: "20px",
                    }}
                  >
                    {/* Main Response */}
                    {(() => {
                      const { introText, agentMarkdown } = extractIntroAndAgentMarkdown(message.text);
                      return (
                        <>
                          {introText && (
                            <IntroText text={introText} agents={agents} />
                          )}
                          {agentMarkdown && (
                            <div className="mb-4">
                              <AgentInfoCard 
                                markdown={agentMarkdown} 
                                agents={agents} 
                                filteredAgentIds={message.filteredAgentIds}
                              />
                            </div>
                          )}
                        </>
                      );
                    })()}
                    
                    {/* Mega Trends */}
                    {message.mega_trends && (
                      <div className="mb-4">
                      <MegaTrendCard markdown={message.mega_trends} agents={agents} />
                      </div>
                    )}
                    
                    {/* Suggested Agents */}
                    {message.suggested_agents && Array.isArray(message.suggested_agents) && message.suggested_agents.length > 0 && (
                      <div className="mb-4">
                      <SuggestedAgents suggested_agents={message.suggested_agents} />
                      </div>
                    )}
                    
                    {/* Filtered Agents */}
                    {message.filteredAgents && Array.isArray(message.filteredAgents) && message.filteredAgents.length > 0 && (
                      <div className="mb-4">
                      <AgentCarousel agents={message.filteredAgents} />
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Render user message with agent cards or regular markdown */}
                    {(() => {
                      const messageParts = renderMessageWithAgentCards(message.text);
                      const hasAgentCards = messageParts.some(part => typeof part !== 'string');
                      
                      // Common markdown components
                      const isUserMessage = message.role === "user";
                      const markdownComponents = {
                        h3: ({ children }: any) => {
                          const text = typeof children === 'string' ? children : 
                            (Array.isArray(children) ? children.join('') : String(children));
                          
                           
                            return (
                              <h4 className="font-semibold mt-4 mb-1 first:mt-0" style={{ fontSize: '15px', color: isUserMessage ? "#FFFFFF" : "#111827" }}>
                                {children}
                              </h4>
                            );
                          
                          
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
                          return <p className="mb-2 last:mb-0" style={{ color: isUserMessage ? "#FFFFFF" : "#4b5563", fontSize: "14px", lineHeight: "21px", fontFamily: "Poppins, sans-serif", fontWeight: 400, letterSpacing: "0%" }}>{children}</p>;
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
                            const agentCards: React.ReactElement[] = [];
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
                          // Check if this is a section header like "Benefits:", "Description:", etc.
                          const textContent = extractTextFromChildren(children);
                          const sectionHeaders = ['benefits', 'description', 'value proposition', 'key features', 'features'];
                          const lowerText = textContent.toLowerCase().trim();
                          
                          // Check if it starts with a section header (with or without bold)
                          const matchedHeader = sectionHeaders.find(header => 
                            lowerText.startsWith(header + ':') || 
                            lowerText.startsWith(header + ' :') ||
                            lowerText === header ||
                            lowerText === header + ':'
                          );
                          
                          if (matchedHeader) {
                            // Render as a heading without bullet
                            return (
                              <div style={{ marginTop: "12px", marginBottom: "4px" }}>
                                <span 
                                  style={{ 
                                    color: isUserMessage ? "#FFFFFF" : "#111827", 
                                    fontSize: "14px", 
                                    lineHeight: "22px", 
                                    fontFamily: "Poppins, sans-serif", 
                                    fontWeight: 600,
                                  }}
                                >
                                  {children}
                                </span>
                              </div>
                            );
                          }
                          
                          // Regular list item - render with bullet
                          return (
                            <li 
                              className="ml-2 mb-1" 
                              style={{ 
                                color: isUserMessage ? "#FFFFFF" : "inherit", 
                                fontSize: "14px", 
                                lineHeight: "22px", 
                                fontFamily: "Poppins, sans-serif", 
                                fontWeight: 400,
                              }}
                            >
                              {children}
                            </li>
                          );
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
                                    remarkPlugins={[remarkGfm]}
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
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                          {processTextWithAgents(message.text
                            .replace(/^[-*•]\s*(Description:|Key Features:)/gm, '### $1')
                            .replace(/^\d+\.\s*(Description:|Key Features:)/gm, '### $1')
                            .replace(/^[\s]*[-*•]\s*(Description:|Key Features:)/gm, '### $1')
                            .replace(/^(Description:|Key Features:)/gm, '### $1')
                            .replace(/^\s+[-*•]\s*(Description:|Key Features:)/gm, '### $1'))}
                        </ReactMarkdown>
                      );
                    })()}
                  </>
                )}
              </div>
              {/* Timestamp */}
              {isMounted && (
                <div 
                  className={`mt-1.5 px-1 ${message.role === "user" ? "text-right" : "text-left"}`}
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "12px",
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
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div 
          className={`fixed bottom-32 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg ${
            feedback.type === 'success' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
          style={{ fontFamily: 'Poppins, sans-serif', fontSize: '14px' }}
        >
          {feedback.message}
        </div>
      )}

      {/* Chat Input - Fixed at bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{ 
          background: "linear-gradient(to top, #f8fafc 85%, transparent)",
          paddingTop: "24px",
          paddingBottom: "20px",
        }}
      >
        <div className="max-w-3xl mx-auto px-4">
          <div
            className="rounded-2xl bg-white p-4"
            style={{
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            {/* Input area */}
            <div className="mb-3">
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
                placeholder="Ask me about AI agents..."
                className="w-full py-2 resize-none border-none focus:outline-none bg-transparent"
                style={{ 
                  fontSize: '15px',
                  lineHeight: '1.5',
                  minHeight: '44px',
                  maxHeight: '150px',
                  fontFamily: 'Poppins, sans-serif',
                  color: '#1f2937',
                }}
                rows={1}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              {/* Mode toggle */}
              <ToggleGroup
                type="single"
                value={mode}
                onValueChange={(value) => {
                  if (value) setMode(value as "explore" | "create");
                }}
                className="bg-gray-100 rounded-xl p-1"
              >
                <ToggleGroupItem
                  value="explore"
                  aria-label="Explore"
                  className="px-4 py-2 text-sm rounded-lg data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm data-[state=off]:text-gray-500 transition-all"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Explore
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="create"
                  aria-label="Create"
                  className="px-4 py-2 text-sm rounded-lg data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm data-[state=off]:text-gray-500 transition-all"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontSize: "13px",
                  }}
                >
                  Create
                </ToggleGroupItem>
              </ToggleGroup>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <div className="[&>div>button:first-child]:hidden [&>div>button:last-child]:h-10 [&>div>button:last-child]:w-10 [&>div>button:last-child]:rounded-xl [&>div>button:last-child]:bg-gray-100 [&>div>button:last-child]:hover:bg-gray-200 [&>div>button:last-child]:border-0">
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
                  className="h-10 w-10 rounded-xl text-white flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: chatInput.trim() && !isSending 
                      ? "linear-gradient(135deg, #1f2937 0%, #374151 100%)" 
                      : "#d1d5db",
                    boxShadow: chatInput.trim() && !isSending 
                      ? "0 2px 8px rgba(31, 41, 55, 0.3)" 
                      : "none",
                  }}
                  aria-label="Submit message"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowUp className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

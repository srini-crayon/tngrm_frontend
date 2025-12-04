"use client"

import Image from "next/image"
import { useState, useMemo } from "react"

type AgentIconProps = {
  demoPreview?: string
  agentName?: string
  size?: number
}

export function AgentIcon({ demoPreview, agentName = 'Agent', size = 40 }: AgentIconProps) {
  const [imageError, setImageError] = useState(false)

  // Parse demo_preview to get first image URL
  const imageSrc = useMemo(() => {
    if (!demoPreview) return null;
    
    const demoPreviewUrls = demoPreview
      .split(",")
      .map((item: string) => item.trim())
      .filter((item: string) => {
        return item && (item.startsWith("http://") || item.startsWith("https://"));
      });
    
    return demoPreviewUrls.length > 0 ? demoPreviewUrls[0] : null;
  }, [demoPreview]);

  const handleError = () => {
    setImageError(true);
  };

  const finalSrc = imageError || !imageSrc ? "/img/agent dummy icon.svg" : imageSrc;

  return (
    <Image
      src={finalSrc}
      alt={agentName}
      width={size}
      height={size}
      className="object-contain rounded-lg"
      unoptimized
      onError={handleError}
    />
  );
}


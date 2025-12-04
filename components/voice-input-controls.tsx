"use client"

import { useEffect, useMemo, useRef } from "react"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"
import { Loader2, Mic, MicOff } from "lucide-react"
import { useSpeechRecognition } from "../hooks/use-speech-recognition"

type LangCode = "en-IN" | "hi-IN"

const languageLabels: Record<LangCode, string> = {
  "en-IN": "EN",
  "hi-IN": "HI",
}

interface VoiceInputControlsProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  buttonVariant?: "ghost" | "outline" | "secondary"
  buttonSize?: "icon" | "sm"
  compact?: boolean
  ariaLabel?: string
}

export function VoiceInputControls({
  value,
  onValueChange,
  className,
  buttonVariant = "ghost",
  buttonSize = "icon",
  compact = false,
  ariaLabel = "Start voice input",
}: VoiceInputControlsProps) {
  const typedBaseRef = useRef(value.trim())
  const voiceTranscriptRef = useRef("")

  const {
    isSupported,
    isListening,
    error,
    currentLang,
    setCurrentLang,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    interimResults: true,
    onResult: (spokenValue, isFinal) => {
      const spoken = spokenValue.trim()
      const base = typedBaseRef.current

      if (!spoken && !base) {
        onValueChange("")
        return
      }

      const combined = [base, spoken]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()

      onValueChange(combined)

      if (isFinal) {
        voiceTranscriptRef.current = spoken
      }
    },
  })

  useEffect(() => {
    if (!isListening) {
      typedBaseRef.current = value.trim()
      voiceTranscriptRef.current = ""
    }
  }, [isListening, value])

  const micIcon = useMemo(() => {
    if (!isSupported) {
      return <MicOff className="h-4 w-4 text-gray-400" />
    }

    if (isListening) {
      return <Loader2 className="h-4 w-4 animate-spin text-rose-500" />
    }

    return <Mic className="h-4 w-4" />
  }, [isListening, isSupported])

  const handleToggle = () => {
    if (!isSupported) {
      return
    }

    if (isListening) {
      stopListening()
    } else {
      typedBaseRef.current = value.trim()
      voiceTranscriptRef.current = ""
      startListening()
    }
  }

  const handleLanguageToggle = () => {
    setCurrentLang(currentLang === "en-IN" ? "hi-IN" : "en-IN")
  }

  const langLabel = languageLabels[currentLang as LangCode] ?? "EN"

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={handleLanguageToggle}
        disabled={!isSupported || isListening}
        className={cn(
          "rounded-full border border-gray-200 text-xs font-semibold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20",
          compact ? "px-2 py-1" : "px-3 py-1.5",
          (!isSupported || isListening) && "cursor-not-allowed opacity-60",
        )}
        title="Toggle voice input language"
        aria-label={`Toggle voice input language (current ${langLabel})`}
      >
        {langLabel}
      </button>

      <Button
        type="button"
        size={buttonSize}
        variant={buttonVariant}
        onClick={handleToggle}
        disabled={!isSupported}
        className={cn(
          "relative transition-colors",
          isListening && "bg-rose-50 text-rose-600 hover:bg-rose-100",
          !isSupported && "opacity-60",
          buttonSize === "icon" && "h-9 w-9",
        )}
        aria-pressed={isListening}
        aria-label={ariaLabel}
        title={
          !isSupported
            ? "Voice input is not supported in this browser"
            : isListening
              ? "Listening... click to stop"
              : `Use voice input (${langLabel})`
        }
      >
        {micIcon}
      </Button>

      {error && (
        <span className="sr-only" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}



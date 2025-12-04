"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type SpeechRecognitionInstance = any
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string, isFinal: boolean) => void
  continuous?: boolean
  interimResults?: boolean
  defaultLang?: string
}

export function useSpeechRecognition({
  onResult,
  continuous = false,
  interimResults = false,
  defaultLang = "en-IN",
}: UseSpeechRecognitionOptions = {}) {
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const onResultRef = useRef(onResult)
  const transcriptRef = useRef("")

  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentLang, setCurrentLang] = useState(defaultLang)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")

  useEffect(() => {
    onResultRef.current = onResult
  }, [onResult])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
    }
  }, [])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null
        recognitionRef.current.onend = null
        recognitionRef.current.onerror = null
        recognitionRef.current.stop()
      } catch (err) {
        // no-op
      } finally {
        recognitionRef.current = null
        setIsListening(false)
      }
    }
  }, [])

  const startListening = useCallback(
    (langOverride?: string) => {
      if (!isSupported || typeof window === "undefined") {
        return
      }

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        setError("Speech recognition is not supported in this browser.")
        return
      }

      stopListening()

      const recognition = new SpeechRecognition()
      recognition.lang = langOverride ?? currentLang
      recognition.continuous = continuous
      recognition.interimResults = interimResults
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
        setInterimTranscript("")
        setTranscript("")
        transcriptRef.current = ""
      }

      recognition.onerror = (event: any) => {
        setError(event?.error ?? "Speech recognition error")
        setIsListening(false)
        recognitionRef.current = null
      }

      recognition.onend = () => {
        setIsListening(false)
        recognitionRef.current = null
      }

      recognition.onresult = (event: any) => {
        const resultIndex = event.resultIndex ?? event.results?.length - 1
        const result = event.results?.[resultIndex]

        if (!result) {
          return
        }

        const segment = (result[0]?.transcript ?? "").trim()

        if (!segment) {
          return
        }

        if (result.isFinal) {
          const updatedTranscript = `${transcriptRef.current} ${segment}`.trim()
          transcriptRef.current = updatedTranscript
          setTranscript(updatedTranscript)
          setInterimTranscript("")
          onResultRef.current?.(updatedTranscript, true)
        } else {
          const interim = `${transcriptRef.current} ${segment}`.trim()
          setInterimTranscript(interim)
          onResultRef.current?.(interim, false)
        }
      }

      recognitionRef.current = recognition

      try {
        recognition.start()
      } catch (err: any) {
        setError(err?.message ?? "Unable to start speech recognition")
        recognitionRef.current = null
        setIsListening(false)
      }
    },
    [continuous, currentLang, interimResults, isSupported, stopListening],
  )

  useEffect(() => {
    return () => {
      stopListening()
    }
  }, [stopListening])

  return {
    isSupported,
    isListening,
    error,
    currentLang,
    setCurrentLang,
    startListening,
    stopListening,
    transcript,
    interimTranscript,
  }
}



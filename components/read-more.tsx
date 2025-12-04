"use client"

import { useState, useMemo } from "react"
import clsx from "clsx"

type ReadMoreProps = {
  text: string
  className?: string
  previewWords?: number
}

export default function ReadMore({ text, className, previewWords = 40 }: ReadMoreProps) {
  const [expanded, setExpanded] = useState(false)

  const { preview, needsToggle } = useMemo(() => {
    const words = (text || "").split(/\s+/)
    if (words.length <= previewWords) {
      return { preview: text, needsToggle: false }
    }
    return { preview: words.slice(0, previewWords).join(" ") + "…", needsToggle: true }
  }, [text, previewWords])

  return (
    <div className={clsx(className)}>
      <div style={{ whiteSpace: 'pre-line' }}>
        {expanded ? text : preview}
      </div>
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="mt-2 inline-block text-[14px] font-medium"
          style={{ color: "#155EEF" }}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  )
}



"use client"

import { useMemo, useState } from "react"
import clsx from "clsx"

type CollapsibleListProps = {
  items: string[]
  ordered?: boolean
  previewCount?: number
  className?: string
}

export default function CollapsibleList({ items, ordered = false, previewCount = 5, className }: CollapsibleListProps) {
  const [expanded, setExpanded] = useState(false)
  const safeItems = useMemo(() => (Array.isArray(items) ? items.filter(Boolean) : []), [items])
  const needsToggle = safeItems.length > previewCount
  const visibleItems = expanded || !needsToggle ? safeItems : safeItems.slice(0, previewCount)

  const listProps = {
    className: clsx(
      "pl-5",
      ordered ? "list-decimal" : "list-disc",
      className
    ),
    style: {
      fontFamily: "Inter, sans-serif",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "150%",
      letterSpacing: 0,
      color: "#344054",
    } as React.CSSProperties,
  }

  return (
    <div>
      {ordered ? (
        <ol {...listProps}>
          {visibleItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
      ) : (
        <ul {...listProps}>
          {visibleItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}

      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="mt-2 text-[14px] font-medium"
          style={{ color: "#155EEF", fontFamily: "Inter, sans-serif" }}
        >
          {expanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  )
}



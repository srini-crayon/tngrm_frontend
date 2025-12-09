import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { useState, useEffect, useRef } from "react"

interface ModelCardProps {
  id: string
  title: string
  description: string
  tags: string[]
  demoPreview?: string
}

export function ModelCard({ id, title, description, tags, demoPreview }: ModelCardProps) {
  const [visibleTags, setVisibleTags] = useState<string[]>([])
  const [overflowCount, setOverflowCount] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const tagsContainerRef = useRef<HTMLDivElement>(null)
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!tags || tags.length === 0 || !tagsContainerRef.current) {
      setVisibleTags([])
      setOverflowCount(0)
      return
    }

    const container = tagsContainerRef.current
    const containerWidth = container.offsetWidth
    let totalWidth = 0
    const visible: string[] = []
    let overflow = 0

    // Estimate width: each tag is max 155px + 4px gap, +X pill is ~30px
    const tagMaxWidth = 155
    const gap = 4
    const plusPillWidth = 30

    for (let i = 0; i < tags.length; i++) {
      const tagWidth = Math.min(tagMaxWidth, tags[i].length * 8 + 18) // Rough estimate
      const wouldFit = totalWidth + tagWidth + (i > 0 ? gap : 0) <= containerWidth - plusPillWidth - gap

      if (wouldFit) {
        visible.push(tags[i])
        totalWidth += tagWidth + (i > 0 ? gap : 0)
      } else {
        overflow = tags.length - i
        break
      }
    }

    // If all tags fit, show them all
    if (visible.length === tags.length) {
      setVisibleTags(tags)
      setOverflowCount(0)
    } else {
      setVisibleTags(visible)
      setOverflowCount(overflow)
    }
  }, [tags])

  return (
    <Link href={`/models/${id}`} scroll>
      <Card 
        className="flex flex-col overflow-hidden bg-white p-0 w-full !border-0 transition-all duration-300 ease-in-out cursor-pointer"
        style={{
          height: "378px",
          maxWidth: "442px",
          borderRadius: "0px",
          boxShadow: "none",
          border: "none",
        }}
        onMouseEnter={(e) => {
          const card = e.currentTarget;
          card.style.setProperty("box-shadow", "8px -8px 16px -12px rgba(0, 0, 0, 0.08), 4px -4px 10px -10px rgba(0, 0, 0, 0.05), 1px -1px 6px -8px rgba(0, 0, 0, 0.03)", "important");
          setIsHovered(true);
        }}
        onMouseLeave={(e) => {
          const card = e.currentTarget;
          card.style.setProperty("box-shadow", "none", "important");
          setIsHovered(false);
        }}
        onMouseDown={(e) => {
          const card = e.currentTarget;
          card.style.setProperty("box-shadow", "4px -4px 10px -10px rgba(0, 0, 0, 0.08), 2px -2px 6px -8px rgba(0, 0, 0, 0.05), 0.5px -0.5px 4px -6px rgba(0, 0, 0, 0.03)", "important");
          setIsHovered(true);
        }}
        onMouseUp={(e) => {
          const card = e.currentTarget;
          card.style.setProperty("box-shadow", "8px -8px 16px -12px rgba(0, 0, 0, 0.08), 4px -4px 10px -10px rgba(0, 0, 0, 0.05), 1px -1px 6px -8px rgba(0, 0, 0, 0.03)", "important");
          setIsHovered(true);
        }}
      >
        {/* Image Section */}
        <div 
          className="relative bg-gray-100 overflow-hidden flex-shrink-0 w-full"
          style={{
            height: "220px",
            border: "1px solid #E5E7EB",
            minHeight: "220px",
            maxHeight: "220px",
            flexShrink: 0,
          }}
        >
          {/* Mask Image - Base Layer */}
          <div
            className="absolute inset-0 pointer-events-none w-full h-full"
            style={{
              zIndex: 1,
            }}
          >
            <Image
              src="/Mask group.png"
              alt=""
              fill
              className="object-cover"
              unoptimized
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          
          {/* Card Image - On Top of Mask */}
          <div
            className="absolute"
            style={{
              width: "calc(100% - 22.32px)",
              height: "202.04px",
              maxWidth: "419.68px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          >
            {demoPreview ? (
              <Image
                src={demoPreview}
                alt={title}
                fill
                className="object-cover"
                unoptimized
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
                onError={(e) => {
                  // Fallback to sample image if demo preview fails
                  const target = e.target as HTMLImageElement;
                  if (target.src !== "/Sample_image_agent.png") {
                    target.src = "/Sample_image_agent.png";
                  }
                }}
              />
            ) : (
              <Image
                src="/Sample_image_agent.png"
                alt={title}
                fill
                className="object-cover"
                unoptimized
                style={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
              />
            )}
          </div>
          
        </div>

        {/* Content Section */}
        <CardContent 
          className="flex flex-col gap-4 flex-1 w-full !px-0" 
          style={{ 
            padding: "0",
            height: "140px",
            minHeight: "140px",
            maxHeight: "140px",
          }}
        >
          {/* Title with Badge */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="line-clamp-2 flex-1 transition-all duration-300" style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "normal",
              color: isHovered ? "transparent" : "#101828",
              background: isHovered ? "linear-gradient(90deg, #0013A2 0%, #D00004 100%)" : "none",
              backgroundClip: isHovered ? "text" : "unset",
              WebkitBackgroundClip: isHovered ? "text" : "unset",
              WebkitTextFillColor: isHovered ? "transparent" : "unset",
            }}>
              {title}
            </h3>
            <span
              className="flex-shrink-0"
              style={{
                display: "inline-flex",
                maxWidth: "120px",
                padding: "2px 6px",
                flexDirection: "column",
                alignItems: "center",
                background: "#E5E5FF",
                fontSize: "12px",
                color: "#4C1D95",
              }}
            >
              Model
            </span>
          </div>

          {/* Description */}
          <p className="line-clamp-2 flex-1" style={{
            marginTop: "2px",
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "14px",
            lineHeight: "140%",
            color: "#344054",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div 
              ref={tagsContainerRef}
              className="flex mt-auto w-full overflow-hidden"
              style={{
                height: "24px",
                gap: "4px",
              }}
            >
              {visibleTags.map((tag, index) => (
                <span
                  key={index}
                  ref={(el) => { tagRefs.current[index] = el }}
                  className="bg-white flex-shrink-0"
                  style={{
                    display: "flex",
                    maxWidth: "155px",
                    padding: "3px 9px",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "1px solid #E5E7EB",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "12px",
                    lineHeight: "100%",
                    textAlign: "center",
                    color: "#667085",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {tag}
                </span>
              ))}
              {overflowCount > 0 && (
                <span
                  className="bg-white flex-shrink-0"
                  style={{
                    display: "flex",
                    padding: "3px 9px",
                    flexDirection: "column",
                    alignItems: "center",
                    border: "1px solid #E5E7EB",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "12px",
                    lineHeight: "100%",
                    textAlign: "center",
                    color: "#667085",
                    whiteSpace: "nowrap",
                  }}
                >
                  +{overflowCount}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

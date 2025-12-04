import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "./ui/card"

interface AgentCardProps {
  id: string
  title: string
  description: string
  badges: Array<{ label: string; variant?: "default" | "primary" | "secondary" | "outline" }>
  tags: string[]
  assetType?: string
  demoPreview?: string
}

export function AgentCard({ id, title, description, tags, assetType, demoPreview }: AgentCardProps) {
  // Determine badge color based on assetType
  const badgeColor = assetType === "Solution" 
    ? { bg: "#FB923C", text: "white" } // Orange for Solution
    : { bg: "#10B981", text: "white" }; // Green for Agent

  return (
    <Link href={`/agents/${id}`} scroll>
      <Card 
        className="transition-shadow hover:shadow-lg flex flex-col overflow-hidden bg-white rounded-xl border shadow-sm p-0 w-full"
        style={{
          height: "378px",
          maxWidth: "442px",
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
          className="flex flex-col gap-4 p-6 flex-1 w-full" 
          style={{ 
            paddingTop: "0",
            height: "140px",
            minHeight: "140px",
            maxHeight: "140px",
          }}
        >
          {/* Title with Badge */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="line-clamp-2 flex-1" style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "16px",
              lineHeight: "100%",
              letterSpacing: "0%",
              verticalAlign: "middle",
              color: "#101828",
            }}>
              {title}
            </h3>
            {assetType && (
              <span
                className="px-2.5 py-1 rounded text-xs font-medium flex-shrink-0"
                style={{
                  backgroundColor: badgeColor.bg,
                  color: badgeColor.text,
                  borderRadius: "4px",
                }}
              >
                {assetType}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="line-clamp-3 flex-1" style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 400,
            fontStyle: "normal",
            fontSize: "14px",
            lineHeight: "140%",
            letterSpacing: "0%",
            color: "#344054",
          }}>
            {description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div 
              className="flex flex-wrap mt-auto w-full"
              style={{
                height: "24px",
                gap: "8px",
              }}
            >
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="border bg-white"
                  style={{
                    height: "24px",
                    maxWidth: "155px",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#E5E7EB",
                    borderRadius: "6px",
                    paddingTop: "3px",
                    paddingRight: "9px",
                    paddingBottom: "3px",
                    paddingLeft: "9px",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "12px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    textAlign: "center",
                    color: "#667085",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span
                  className="border bg-white"
                  style={{
                    height: "24px",
                    maxWidth: "155px",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#E5E7EB",
                    borderRadius: "6px",
                    paddingTop: "3px",
                    paddingRight: "9px",
                    paddingBottom: "3px",
                    paddingLeft: "9px",
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
                    fontSize: "12px",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    textAlign: "center",
                    color: "#667085",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

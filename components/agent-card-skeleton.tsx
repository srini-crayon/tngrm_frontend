import { Card, CardContent } from "./ui/card"
import { Skeleton } from "./ui/skeleton"

export function AgentCardSkeleton() {
  return (
    <Card 
      className="flex flex-col overflow-hidden bg-white p-0 w-full !border-0"
      style={{
        height: "378px",
        maxWidth: "442px",
        borderRadius: "0px",
        boxShadow: "none",
        border: "none",
      }}
    >
      {/* Image Section Skeleton */}
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
        <Skeleton className="w-full h-full rounded-none" />
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
          <Skeleton 
            className="flex-1" 
            style={{
              height: "20px",
              maxWidth: "70%",
            }}
          />
          <Skeleton 
            className="flex-shrink-0" 
            style={{
              width: "60px",
              height: "20px",
            }}
          />
        </div>

        {/* Description - 2 lines */}
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton 
            className="w-full" 
            style={{
              height: "16px",
            }}
          />
          <Skeleton 
            className="w-full" 
            style={{
              height: "16px",
              maxWidth: "85%",
            }}
          />
        </div>

        {/* Tags */}
        <div 
          className="flex mt-auto w-full"
          style={{
            height: "24px",
            gap: "4px",
          }}
        >
          <Skeleton 
            className="flex-shrink-0" 
            style={{
              width: "80px",
              height: "24px",
            }}
          />
          <Skeleton 
            className="flex-shrink-0" 
            style={{
              width: "100px",
              height: "24px",
            }}
          />
          <Skeleton 
            className="flex-shrink-0" 
            style={{
              width: "70px",
              height: "24px",
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}


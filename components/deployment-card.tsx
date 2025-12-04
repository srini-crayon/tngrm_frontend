import type React from "react"
import { Badge } from "./badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface DeploymentCardProps {
  title: string
  description: string
  provider: string
  providerLogo?: React.ReactNode
  deploymentType: string
  regions: string[]
  capabilities: string[]
}

export function DeploymentCard({
  title,
  description,
  provider,
  providerLogo,
  deploymentType,
  regions,
  capabilities,
}: DeploymentCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {providerLogo || (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-gray-300" />
              <span className="text-sm font-semibold">{provider}</span>
            </div>
          )}
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <div className="mb-1 text-xs font-semibold text-muted-foreground">Deployment Type</div>
          <Badge variant="outline">{deploymentType}</Badge>
        </div>
        <div className="mb-3">
          <div className="mb-1 text-xs font-semibold text-muted-foreground">Regions</div>
          <div className="flex flex-wrap gap-1">
            {regions.map((region, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {region}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold text-muted-foreground">Capabilities</div>
          <div className="flex flex-wrap gap-1">
            {capabilities.map((capability, index) => (
              <Badge key={index} variant="default" className="text-xs">
                {capability}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

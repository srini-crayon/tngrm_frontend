import Link from "next/link"
import { AgentIcon } from "./agent-icon"

type RelatedAgent = {
  agent_id?: string
  agent_name?: string
  description?: string
  demo_preview?: string
}

type RelatedAgentsSidebarProps = {
  relatedAgents: RelatedAgent[]
  agentName?: string
  agentsSource?: 'bundled' | 'similar' | null
}

export function RelatedAgentsSidebar({ relatedAgents, agentName, agentsSource }: RelatedAgentsSidebarProps) {
  if (relatedAgents.length === 0) {
    return null
  }

  // Determine title based on which API was used
  const title = agentsSource === 'bundled' 
    ? `${agentName || 'Agent'} powered by Agents`
    : agentsSource === 'similar'
    ? 'Check out some of the similar agents in the store'
    : `${agentName || 'Agent'} powered by Agents`

  return (
    <div 
      style={{
        maxWidth: '490px',
        width: '100%',
        backgroundColor: '#F9FAFB',
        padding: '24px',
        borderRadius: '8px',
        position: 'relative',
        height: 'auto',
        marginLeft: '0',
        alignSelf: 'flex-start',
      }}
      className="flex-shrink-0"
    >
      <h4 
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '16px',
          fontWeight: 600,
          color: '#111827',
          marginBottom: '16px',
          lineHeight: '21px',
        }}
      >
        {title}
      </h4>
      <div 
        className="space-y-3"
        style={{
          maxHeight: '374px',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {relatedAgents.map((relatedAgent, idx: number) => (
          <Link
            key={relatedAgent.agent_id || idx}
            href={`/agents/${relatedAgent.agent_id}`}
            className="block bg-white rounded-2xl p-2 border border-gray-100"
          >
            <div className="flex gap-2 items-center">
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  border: '1px solid #F3F4F6',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <AgentIcon
                  demoPreview={relatedAgent?.demo_preview}
                  agentName={relatedAgent?.agent_name || 'Agent'}
                  size={40}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h5 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#111827',
                    marginBottom: '4px',
                    lineHeight: '21px',
                  }}
                  className="truncate"
                >
                  {relatedAgent.agent_name || 'Agent Name'}
                </h5>
                <p 
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#344054',
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {relatedAgent.description || 'Agent description'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


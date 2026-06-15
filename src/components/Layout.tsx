import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

type DeploymentStatus = 'draft' | 'provisioning' | 'live' | null

interface LayoutProps {
  children: ReactNode
  currentView: 'agentdeploy' | 'console'
  deploymentStatus?: DeploymentStatus
  deploymentName?: string
  onAgentDeployClick?: () => void
  onConsoleClick?: () => void
}

export function Layout({
  children,
  currentView,
  deploymentStatus = null,
  deploymentName,
  onAgentDeployClick,
  onConsoleClick,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-do-surface">
      <Sidebar
        currentView={currentView}
        deploymentStatus={deploymentStatus}
        deploymentName={deploymentName}
        onAgentDeployClick={onAgentDeployClick}
        onConsoleClick={onConsoleClick}
      />
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">{children}</main>
    </div>
  )
}

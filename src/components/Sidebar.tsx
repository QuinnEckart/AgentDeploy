type DeploymentStatus = 'draft' | 'provisioning' | 'live' | null

interface SidebarProps {
  currentView: 'agentdeploy' | 'console'
  deploymentStatus: DeploymentStatus
  deploymentName?: string
  onAgentDeployClick?: () => void
  onConsoleClick?: () => void
}

export function Sidebar({
  currentView,
  deploymentStatus,
  deploymentName,
  onAgentDeployClick,
  onConsoleClick,
}: SidebarProps) {
  const statusLabel =
    deploymentStatus === 'live'
      ? 'Live'
      : deploymentStatus === 'provisioning'
        ? 'Provisioning'
        : deploymentStatus === 'draft'
          ? 'Draft'
          : null

  const statusColor =
    deploymentStatus === 'live'
      ? 'bg-do-success/20 text-do-success'
      : deploymentStatus === 'provisioning'
        ? 'bg-amber-100 text-amber-700'
        : 'bg-gray-100 text-gray-500'

  return (
    <aside className="w-56 shrink-0 bg-do-navy text-white flex flex-col min-h-screen">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-do-blue flex items-center justify-center text-sm font-bold" aria-hidden="true">
            DO
          </div>
          <span className="font-semibold text-sm tracking-wide">DigitalOcean</span>
        </div>
      </div>

      <nav className="flex-1 py-4" aria-label="Main navigation">
        <ul className="space-y-0.5 px-2">
          <li>
            <button
              type="button"
              onClick={onAgentDeployClick}
              aria-current={currentView === 'agentdeploy' ? 'page' : undefined}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                currentView === 'agentdeploy'
                  ? 'bg-do-blue text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              AgentDeploy
            </button>
          </li>
          {deploymentStatus && (
            <li>
              <button
                type="button"
                onClick={onConsoleClick}
                aria-current={currentView === 'console' ? 'page' : undefined}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  currentView === 'console'
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                Deployment Console
              </button>
            </li>
          )}
        </ul>
      </nav>

      {deploymentName && statusLabel && (
        <div className="px-4 pb-3">
          <div className="px-3 py-2 rounded-md bg-white/5">
            <p className="text-xs text-white/40 truncate">{deploymentName}</p>
            <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColor}`}>
              {statusLabel}
            </span>
          </div>
        </div>
      )}

      <div className="px-5 py-4 border-t border-white/10 text-xs text-white/40">
        AgentDeploy Preview
      </div>
    </aside>
  )
}

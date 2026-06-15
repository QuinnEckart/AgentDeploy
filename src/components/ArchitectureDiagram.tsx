import type { InfraComponent } from '../types'

interface ArchitectureDiagramProps {
  components: InfraComponent[]
  repoName: string
}

export function ArchitectureDiagram({ components, repoName }: ArchitectureDiagramProps) {
  const tiers = [
    {
      label: 'Edge',
      items: components.filter((c) => c.id === 'lb'),
    },
    {
      label: 'Compute',
      items: components.filter((c) => c.id === 'app-platform' || c.id === 'worker'),
    },
    {
      label: 'Data',
      items: components.filter((c) =>
        ['postgres', 'spaces', 'secrets'].includes(c.id)
      ),
    },
    {
      label: 'Platform',
      items: components.filter((c) =>
        ['vpc', 'observability'].includes(c.id)
      ),
    },
  ].filter((tier) => tier.items.length > 0)

  return (
    <div className="bg-white border border-do-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Architecture diagram</h3>

      <div className="flex flex-col lg:flex-row items-stretch gap-3">
        <div className="flex items-center justify-center px-4 py-3 bg-gray-900 text-white rounded-lg text-center shrink-0 lg:w-32">
          <div>
            <p className="text-xs font-semibold">GitHub</p>
            <p className="text-[10px] text-gray-400 mt-0.5 break-all">{repoName}</p>
          </div>
        </div>

        <div className="hidden lg:flex items-center text-gray-300" aria-hidden="true">
          →
        </div>

        <div className="flex-1 space-y-3">
          {tiers.map((tier) => (
            <div key={tier.label}>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                {tier.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {tier.items.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 px-3 py-2 bg-do-blue/5 border border-do-blue/20 rounded-lg"
                  >
                    <div className="w-2 h-2 rounded-full bg-do-blue shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{c.name}</p>
                      <p className="text-[10px] text-gray-500">{c.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:flex items-center text-gray-300" aria-hidden="true">
          →
        </div>

        <div className="flex items-center justify-center px-4 py-3 bg-do-blue/10 border border-do-blue/30 rounded-lg text-center shrink-0 lg:w-28">
          <div>
            <p className="text-xs font-semibold text-do-blue">Users</p>
            <p className="text-[10px] text-gray-500 mt-0.5">HTTPS</p>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 mt-3 text-center">
        All services connected via VPC · Terraform-managed provisioning
      </p>
    </div>
  )
}

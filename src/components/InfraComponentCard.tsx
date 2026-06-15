import type { InfraComponent } from '../types'

const statusStyles = {
  recommended: 'bg-blue-50 text-blue-700 border-blue-200',
  provisioned: 'bg-amber-50 text-amber-700 border-amber-200',
  healthy: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-orange-50 text-orange-700 border-orange-200',
}

const iconPaths: Record<string, string> = {
  app: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z',
  worker: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0',
  database: 'M4 7v10c0 2 4 3 8 3s8-1 8-3V7',
  storage: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4',
  network: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9',
  security: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944',
  monitor: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z',
  secrets: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z',
}

interface InfraComponentCardProps {
  component: InfraComponent
}

export function InfraComponentCard({ component }: InfraComponentCardProps) {
  const path = iconPaths[component.icon] ?? iconPaths.app

  return (
    <div className="bg-white border border-do-border rounded-xl p-4 hover:border-do-blue/40 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-do-blue/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-do-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={path} />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900">{component.name}</h4>
            <p className="text-xs text-gray-400">{component.type}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${statusStyles[component.status]}`}>
          {component.status}
        </span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{component.description}</p>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400">Monthly</span>
        <span className="text-sm font-semibold text-gray-700 tabular-nums">
          {component.monthlyCost === 0 ? 'Included' : `$${component.monthlyCost}`}
        </span>
      </div>
    </div>
  )
}

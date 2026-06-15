import type { InfraComponent } from '../types'

interface PricingBreakdownProps {
  components: InfraComponent[]
  totalMonthlyCost: number
  highAvailability?: boolean
}

export function PricingBreakdown({ components, totalMonthlyCost, highAvailability }: PricingBreakdownProps) {
  return (
    <div className="bg-white border border-do-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Estimated monthly cost</h3>
        <div className="text-right">
          <span className="text-2xl font-bold text-do-blue">${totalMonthlyCost}</span>
          <span className="text-xs text-gray-500 ml-1">/mo</span>
        </div>
      </div>

      {highAvailability && (
        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
          HA adds standby nodes and enhanced monitoring. Toggle off to reduce cost.
        </p>
      )}

      <div className="space-y-2">
        {components.map((component) => (
          <div
            key={component.id}
            className="flex items-center justify-between text-sm py-1.5 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-gray-700 truncate">{component.name}</span>
              <span className="text-xs text-gray-400 shrink-0">{component.type}</span>
            </div>
            <span className="text-gray-600 font-medium tabular-nums shrink-0">
              {component.monthlyCost === 0 ? 'Included' : `$${component.monthlyCost}`}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Estimates based on selected region, traffic, and availability. Actual billing reflects usage.
      </p>
    </div>
  )
}

import type { ArchitecturePlan } from '../types'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { PricingBreakdown } from './PricingBreakdown'
import { regionOptions } from '../data/mockData'

interface ArchitectureRecommendationProps {
  plan: ArchitecturePlan
  onDeploy: () => void
  onRegionChange: (region: string) => void
  onHAChange: (ha: boolean) => void
  onToggleComponent: (componentId: string) => void
}

export function ArchitectureRecommendation({
  plan,
  onDeploy,
  onRegionChange,
  onHAChange,
  onToggleComponent,
}: ArchitectureRecommendationProps) {
  const enabledCount = plan.components.filter((c) => c.enabled !== false).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Recommended stack for production</h2>
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{enabledCount} DigitalOcean resources</span> will be
          provisioned in <span className="font-medium text-gray-700">{plan.region}</span> to run{' '}
          <span className="font-medium text-gray-700">{plan.repoName.split('/')[1]}</span>. Review components and
          cost before deploying.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="region-select" className="text-xs font-medium text-gray-500">
            Region
          </label>
          <select
            id="region-select"
            value={plan.region}
            onChange={(e) => onRegionChange(e.target.value)}
            className="text-sm border border-do-border rounded-lg px-3 py-1.5 bg-white"
          >
            {regionOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={plan.highAvailability}
            onChange={(e) => onHAChange(e.target.checked)}
            className="accent-do-blue rounded"
          />
          High availability
        </label>
        <span className="px-2.5 py-1 bg-white rounded-full border border-do-border text-xs text-gray-600">
          Traffic: {plan.estimatedTraffic}
        </span>
        <span className="px-2.5 py-1 bg-white rounded-full border border-do-border text-xs text-gray-600">
          IaC: Terraform
        </span>
      </div>

      <ArchitectureDiagram components={plan.components.filter((c) => c.enabled !== false)} repoName={plan.repoName} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PricingBreakdown
          components={plan.components.filter((c) => c.enabled !== false)}
          totalMonthlyCost={plan.totalMonthlyCost}
          highAvailability={plan.highAvailability}
        />

        <div className="bg-white border border-do-border rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Components</h3>
          <ul className="space-y-2">
            {plan.components.map((c) => {
              const disabled = c.optional && c.enabled === false
              return (
                <li
                  key={c.id}
                  className={`flex items-start gap-3 p-2 rounded-lg ${disabled ? 'opacity-50' : ''}`}
                >
                  {c.optional ? (
                    <input
                      type="checkbox"
                      checked={c.enabled !== false}
                      onChange={() => onToggleComponent(c.id)}
                      className="mt-1 accent-do-blue rounded"
                      aria-label={`Include ${c.name}`}
                    />
                  ) : (
                    <div className="w-4 h-4 mt-1 flex items-center justify-center" aria-hidden="true">
                      <div className="w-1.5 h-1.5 rounded-full bg-do-blue" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {c.name}
                      {c.optional && <span className="text-xs text-gray-400 ml-1">(optional)</span>}
                    </p>
                    <p className="text-xs text-gray-500">{c.description}</p>
                  </div>
                  <span className="text-xs text-gray-500 tabular-nums shrink-0">
                    {c.monthlyCost === 0 ? 'Included' : `$${c.monthlyCost}`}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="sticky bottom-0 bg-do-surface border-t border-do-border -mx-8 px-8 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            ${plan.totalMonthlyCost}
            <span className="text-xs font-normal text-gray-500">/mo estimated</span>
          </p>
          <p className="text-xs text-gray-500">Billing starts once resources are provisioned</p>
        </div>
        <button
          type="button"
          onClick={onDeploy}
          className="px-6 py-2.5 bg-do-blue hover:bg-do-blue-dark text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          Review deployment plan
        </button>
      </div>
    </div>
  )
}

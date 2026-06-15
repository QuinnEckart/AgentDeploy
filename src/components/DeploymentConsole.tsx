import { useState } from 'react'
import type { ArchitecturePlan, Day2Operation, ConsoleTab } from '../types'
import { InfraComponentCard } from './InfraComponentCard'
import { Day2Operations } from './Day2Operations'
import { ConsoleTabs } from './ConsoleTabs'
import { PricingBreakdown } from './PricingBreakdown'
import { mockTerraformPreview } from '../data/mockData'

interface DeploymentConsoleProps {
  plan: ArchitecturePlan
  appUrl: string
  day2Operations: Day2Operation[]
  onBackToDeploy?: () => void
}

export function DeploymentConsole({ plan, appUrl, day2Operations, onBackToDeploy }: DeploymentConsoleProps) {
  const [activeTab, setActiveTab] = useState<ConsoleTab>('overview')

  const provisionedComponents = plan.components
    .filter((c) => c.enabled !== false)
    .map((c) => ({ ...c, status: 'healthy' as const }))

  const shortName = plan.repoName.split('/')[1]

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      <div className="px-8 py-5 border-b border-do-border bg-white">
        <nav aria-label="Breadcrumb" className="text-xs text-gray-400 mb-2">
          <ol className="flex items-center gap-1.5">
            <li>
              {onBackToDeploy ? (
                <button type="button" onClick={onBackToDeploy} className="hover:text-do-blue">
                  AgentDeploy
                </button>
              ) : (
                'AgentDeploy'
              )}
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-600">{shortName}</li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium">Console</li>
          </ol>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {shortName} — Deployment Console
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Production stack in {plan.region} · {provisionedComponents.length} resources · Managed with Terraform
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400">Monthly cost</p>
              <p className="text-lg font-bold text-do-blue">${plan.totalMonthlyCost}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-do-success/10 rounded-full">
              <span className="w-2 h-2 rounded-full bg-do-success" aria-hidden="true" />
              <span className="text-xs font-medium text-do-success">All systems healthy</span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <ConsoleTabs active={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      <div className="px-8 py-6 flex-1">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-do-border rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Live URL</p>
                <a
                  href={`https://${appUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-do-blue hover:underline break-all"
                >
                  {appUrl}
                </a>
              </div>
              <div className="bg-white border border-do-border rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Framework</p>
                <p className="text-sm font-medium text-gray-800">{plan.framework}</p>
              </div>
              <div className="bg-white border border-do-border rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Traffic (est.)</p>
                <p className="text-sm font-medium text-gray-800">{plan.estimatedTraffic}</p>
              </div>
              <div className="bg-white border border-do-border rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Resources</p>
                <p className="text-sm font-medium text-gray-800">{provisionedComponents.length} components</p>
              </div>
            </div>

            <div className="bg-white border border-do-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Provisioning timeline</h2>
              <ol className="space-y-2 text-sm">
                {['Terraform plan applied', 'Database created', 'VPC configured', 'SSL issued', 'Health checks passed'].map(
                  (step, i) => (
                    <li key={step} className="flex items-center gap-2 text-gray-600">
                      <svg className="w-4 h-4 text-do-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {step}
                      <span className="text-xs text-gray-400 ml-auto">Step {i + 1}</span>
                    </li>
                  )
                )}
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'infrastructure' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {provisionedComponents.map((component) => (
              <InfraComponentCard key={component.id} component={component} />
            ))}
          </div>
        )}

        {activeTab === 'operations' && <Day2Operations operations={day2Operations} />}

        {activeTab === 'cost' && (
          <div className="max-w-md">
            <PricingBreakdown
              components={provisionedComponents}
              totalMonthlyCost={plan.totalMonthlyCost}
              highAvailability={plan.highAvailability}
            />
          </div>
        )}

        {activeTab === 'terraform' && (
          <div className="bg-white border border-do-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-do-border bg-gray-50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Terraform configuration</h2>
              <button
                type="button"
                className="text-xs font-medium text-do-blue hover:underline"
                onClick={() => navigator.clipboard.writeText(mockTerraformPreview)}
              >
                Copy
              </button>
            </div>
            <pre className="p-4 text-xs text-gray-700 overflow-x-auto font-mono leading-relaxed">
              {mockTerraformPreview}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

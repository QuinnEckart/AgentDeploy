import type { ProvisioningStep } from '../types'

interface ProvisioningProgressProps {
  steps: ProvisioningStep[]
}

export function ProvisioningProgress({ steps }: ProvisioningProgressProps) {
  const activeIdx = steps.findIndex((s) => s.status === 'active')
  const completed = steps.filter((s) => s.status === 'complete').length

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="w-12 h-12 border-3 border-do-blue/20 border-t-do-blue rounded-full animate-spin-slow mx-auto mb-4" />
      <h2 className="text-base font-semibold text-gray-900 mb-1">
        Provisioning your stack
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Step {Math.min(activeIdx + 1, steps.length)} of {steps.length}
      </p>

      <ol className="text-left space-y-2" aria-label="Provisioning steps">
        {steps.map((step) => (
          <li
            key={step.id}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm ${
              step.status === 'active'
                ? 'bg-do-blue/5 border border-do-blue/20 text-gray-900 font-medium'
                : step.status === 'complete'
                  ? 'text-gray-600'
                  : 'text-gray-400'
            }`}
          >
            {step.status === 'complete' ? (
              <svg className="w-4 h-4 text-do-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : step.status === 'active' ? (
              <div className="w-4 h-4 border-2 border-do-blue/30 border-t-do-blue rounded-full animate-spin-slow shrink-0" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-gray-200 shrink-0" aria-hidden="true" />
            )}
            {step.label}
          </li>
        ))}
      </ol>

      <p className="text-xs text-gray-400 mt-4" aria-live="polite">
        {completed} of {steps.length} steps complete
      </p>
    </div>
  )
}

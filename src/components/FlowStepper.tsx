import type { FlowStep, StepperPhase } from '../types'

const phases: { id: StepperPhase; label: string }[] = [
  { id: 'connect', label: 'Connect' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'configure', label: 'Configure' },
  { id: 'review', label: 'Review' },
  { id: 'deploy', label: 'Deploy' },
  { id: 'operate', label: 'Operate' },
]

function stepToPhase(step: FlowStep): StepperPhase {
  switch (step) {
    case 'welcome':
    case 'linking':
      return 'connect'
    case 'summary':
      return 'analyze'
    case 'questions':
      return 'configure'
    case 'analyzing':
    case 'architecture':
      return 'review'
    case 'deploying':
      return 'deploy'
    case 'deployed':
    case 'console':
      return 'operate'
  }
}

function phaseIndex(phase: StepperPhase): number {
  return phases.findIndex((p) => p.id === phase)
}

interface FlowStepperProps {
  currentStep: FlowStep
}

export function FlowStepper({ currentStep }: FlowStepperProps) {
  const currentPhase = stepToPhase(currentStep)
  const currentIdx = phaseIndex(currentPhase)

  return (
    <nav aria-label="Deployment progress" className="flex items-center gap-1">
      {phases.map((phase, idx) => {
        const isComplete = idx < currentIdx
        const isCurrent = idx === currentIdx

        return (
          <div key={phase.id} className="flex items-center gap-1">
            {idx > 0 && (
              <div
                className={`w-6 h-px ${isComplete || isCurrent ? 'bg-do-blue' : 'bg-do-border'}`}
                aria-hidden="true"
              />
            )}
            <div className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  isComplete
                    ? 'bg-do-blue text-white'
                    : isCurrent
                      ? 'bg-do-blue text-white ring-2 ring-do-blue/30'
                      : 'bg-gray-100 text-gray-400'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isComplete ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:inline ${
                  isCurrent ? 'text-gray-900' : isComplete ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {phase.label}
              </span>
            </div>
          </div>
        )
      })}
    </nav>
  )
}

import type { DetectedSignal } from '../types'

interface AnalysisSummaryProps {
  repoName: string
  signals: DetectedSignal[]
  onContinue: () => void
}

export function AnalysisSummary({ repoName, signals, onContinue }: AnalysisSummaryProps) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Analysis complete</h2>
      <p className="text-sm text-gray-500 mb-6">
        Detected signals from <span className="font-medium text-gray-700">{repoName}</span>. Answer 3 questions next
        so AgentDeploy can recommend the right production stack.
      </p>

      <div className="bg-white border border-do-border rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-do-border bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900">What we detected</h3>
        </div>
        <dl className="divide-y divide-gray-50">
          {signals.map((signal) => (
            <div key={signal.label} className="flex items-center justify-between px-4 py-3">
              <dt className="text-sm text-gray-500">{signal.label}</dt>
              <dd className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">{signal.value}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    signal.confidence === 'high'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {signal.confidence}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="px-5 py-2.5 bg-do-blue hover:bg-do-blue-dark text-white text-sm font-semibold rounded-lg transition-colors"
      >
        Continue to configuration
      </button>
    </div>
  )
}

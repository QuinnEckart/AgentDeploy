import type { Day2Operation } from '../types'

const categoryColors = {
  security: 'bg-red-50 text-red-600',
  scaling: 'bg-purple-50 text-purple-600',
  observability: 'bg-blue-50 text-blue-600',
  configuration: 'bg-gray-100 text-gray-600',
}

interface Day2OperationsProps {
  operations: Day2Operation[]
}

export function Day2Operations({ operations }: Day2OperationsProps) {
  return (
    <div className="bg-white border border-do-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Operate your stack</h3>
      <p className="text-xs text-gray-500 mb-4">
        Common post-deploy actions supported by AgentDeploy.
      </p>

      <ul className="space-y-2" role="list">
        {operations.map((op) => (
          <li
            key={op.id}
            className="flex items-start gap-3 p-3 rounded-lg border border-do-border bg-gray-50/50"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-gray-800">{op.title}</span>
                {op.recommended && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-do-blue/10 text-do-blue rounded font-medium">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{op.description}</p>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 capitalize ${categoryColors[op.category]}`}
            >
              {op.category}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

import type { ArchitecturePlan } from '../types'

interface DeployConfirmationModalProps {
  open: boolean
  plan: ArchitecturePlan
  onClose: () => void
  onConfirm: () => void
}

export function DeployConfirmationModal({ open, plan, onClose, onConfirm }: DeployConfirmationModalProps) {
  if (!open) return null

  const enabledComponents = plan.components.filter((c) => c.enabled !== false)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deploy-modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-do-border max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-do-border">
          <h2 id="deploy-modal-title" className="text-base font-semibold text-gray-900">
            Approve deployment plan
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            This will create {enabledComponents.length} resources in {plan.region} and start billing once provisioned.
          </p>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="flex items-center justify-between p-3 bg-do-blue/5 rounded-lg border border-do-blue/20">
            <span className="text-sm font-medium text-gray-700">Estimated monthly cost</span>
            <span className="text-xl font-bold text-do-blue">${plan.totalMonthlyCost}/mo</span>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Resources to create
            </h3>
            <ul className="space-y-1.5">
              {enabledComponents.map((c) => (
                <li key={c.id} className="flex items-center justify-between text-sm py-1">
                  <span className="text-gray-700">
                    {c.name} <span className="text-gray-400">({c.type})</span>
                  </span>
                  <span className="text-gray-500 tabular-nums">
                    {c.monthlyCost === 0 ? 'Included' : `$${c.monthlyCost}/mo`}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-gray-500">
            Provisioned via Terraform. You can inspect, export, and manage resources in the Deployment Console after
            launch.
          </p>
        </div>

        <div className="px-6 py-4 border-t border-do-border flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg"
          >
            Go back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2 bg-do-blue hover:bg-do-blue-dark text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Approve & provision stack
          </button>
        </div>
      </div>
    </div>
  )
}

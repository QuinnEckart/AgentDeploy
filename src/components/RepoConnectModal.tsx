import { useState } from 'react'
import type { MockRepo } from '../types'
import { mockRepos } from '../data/mockData'

interface RepoConnectModalProps {
  open: boolean
  onClose: () => void
  onConnect: (repo: MockRepo) => void
}

export function RepoConnectModal({ open, onClose, onConnect }: RepoConnectModalProps) {
  const [selected, setSelected] = useState<string>(mockRepos[0].id)

  if (!open) return null

  const selectedRepo = mockRepos.find((r) => r.id === selected) ?? mockRepos[0]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      role="dialog"
      aria-modal="true"
      aria-labelledby="repo-modal-title"
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md border border-do-border">
        <div className="px-6 py-5 border-b border-do-border">
          <h2 id="repo-modal-title" className="text-base font-semibold text-gray-900">
            Connect GitHub repository
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select a repository for AgentDeploy to analyze. Read-only access — nothing is provisioned until you approve.
          </p>
        </div>

        <div className="px-6 py-4 space-y-2" role="radiogroup" aria-label="Repositories">
          {mockRepos.map((repo) => (
            <label
              key={repo.id}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                selected === repo.id
                  ? 'border-do-blue bg-do-blue/5'
                  : 'border-do-border hover:border-do-blue/40'
              }`}
            >
              <input
                type="radio"
                name="repo"
                value={repo.id}
                checked={selected === repo.id}
                onChange={() => setSelected(repo.id)}
                className="accent-do-blue"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{repo.fullName}</p>
                <p className="text-xs text-gray-500">
                  {repo.framework} · Updated {repo.lastUpdated}
                </p>
              </div>
            </label>
          ))}
        </div>

        <div className="px-6 py-3 bg-gray-50 border-t border-do-border rounded-b-xl">
          <p className="text-xs text-gray-500 mb-3">
            AgentDeploy requests read-only access to analyze code structure, dependencies, and deployment signals.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConnect(selectedRepo)}
              className="px-4 py-2 bg-do-blue hover:bg-do-blue-dark text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Connect {selectedRepo.fullName.split('/')[1]}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

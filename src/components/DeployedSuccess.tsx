import { useState } from 'react'

interface DeployedSuccessProps {
  appUrl: string
  resourceCount: number
  onOpenConsole: () => void
}

export function DeployedSuccess({ appUrl, resourceCount, onOpenConsole }: DeployedSuccessProps) {
  const [copied, setCopied] = useState(false)
  const fullUrl = `https://${appUrl}`

  async function handleCopy() {
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 rounded-full bg-do-success/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-do-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Your app is live</h1>
        <p className="text-sm text-gray-500 mb-8">
          All {resourceCount} resources are healthy. DNS and SSL are active.
        </p>

        <div className="flex items-center gap-2 p-3 bg-white border border-do-border rounded-xl mb-6">
          <span className="w-2 h-2 rounded-full bg-do-success shrink-0" aria-hidden="true" />
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-sm font-medium text-do-blue hover:underline text-left break-all"
          >
            {appUrl}
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-do-border rounded-lg hover:border-do-blue shrink-0"
          >
            {copied ? 'Copied' : 'Copy URL'}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 bg-do-blue hover:bg-do-blue-dark text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Visit live app
          </a>
          <button
            type="button"
            onClick={onOpenConsole}
            className="w-full sm:w-auto px-6 py-2.5 bg-white border border-do-border hover:border-do-blue text-sm font-medium text-gray-700 rounded-lg transition-colors"
          >
            Open Deployment Console
          </button>
        </div>
      </div>
    </div>
  )
}

import type { ConsoleTab } from '../types'

const tabs: { id: ConsoleTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'operations', label: 'Day-2 Ops' },
  { id: 'cost', label: 'Cost' },
  { id: 'terraform', label: 'Terraform' },
]

interface ConsoleTabsProps {
  active: ConsoleTab
  onChange: (tab: ConsoleTab) => void
}

export function ConsoleTabs({ active, onChange }: ConsoleTabsProps) {
  return (
    <nav aria-label="Console sections" className="flex gap-1 border-b border-do-border -mb-px">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          aria-current={active === tab.id ? 'page' : undefined}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            active === tab.id
              ? 'border-do-blue text-do-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

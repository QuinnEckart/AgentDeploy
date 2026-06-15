import type { ChatMessage } from '../types'
import { TypingIndicator } from './Spinner'

interface ChatWindowProps {
  messages: ChatMessage[]
  isTyping?: boolean
  compact?: boolean
}

function StructuredMessage({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="space-y-1">
      {items.map((item) => (
        <div key={item.label} className="flex gap-2 text-sm">
          <dt className="text-white/70 shrink-0">{item.label}:</dt>
          <dd className="font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function ChatWindow({ messages, isTyping, compact }: ChatWindowProps) {
  return (
    <div className={`flex flex-col h-full ${compact ? 'max-w-sm' : ''}`}>
      <div className="px-5 py-3 border-b border-do-border bg-white">
        <h2 className="text-sm font-semibold text-gray-900">Assistant</h2>
        <p className="text-xs text-gray-500">Guided deployment workflow</p>
      </div>

      <div
        className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Conversation"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-do-blue text-white'
                  : msg.role === 'system'
                    ? 'bg-gray-100 text-gray-600 text-xs italic'
                    : 'bg-white border border-do-border text-gray-800 shadow-sm'
              }`}
            >
              {msg.type === 'structured' && msg.structured ? (
                <StructuredMessage items={msg.structured} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start" aria-label="Assistant is typing">
            <div className="bg-white border border-do-border rounded-xl shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

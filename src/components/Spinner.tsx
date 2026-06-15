interface SpinnerProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Spinner({ label, size = 'md' }: SpinnerProps) {
  const sizeClass = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }[size]

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${sizeClass} border-2 border-do-blue/20 border-t-do-blue rounded-full animate-spin-slow`}
      />
      {label && <span className="text-sm text-gray-500">{label}</span>}
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-do-blue animate-pulse-dot"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  )
}

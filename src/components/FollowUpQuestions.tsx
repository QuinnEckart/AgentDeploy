import { useState } from 'react'
import type { FollowUpQuestion } from '../types'

interface FollowUpQuestionsProps {
  questions: FollowUpQuestion[]
  onComplete: (answers: Record<string, string>) => void
}

export function FollowUpQuestions({ questions, onComplete }: FollowUpQuestionsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const current = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1
  const selectedAnswer = answers[current.id]

  function handleSelect(option: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: option }))
  }

  function handleNext() {
    if (!selectedAnswer) return
    const updated = { ...answers, [current.id]: selectedAnswer }
    setAnswers(updated)
    if (isLast) {
      onComplete(updated)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  function handleBack() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <span>
          Question {currentIndex + 1} of {questions.length}
        </span>
        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden" aria-hidden="true">
          <div
            className="h-full bg-do-blue rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <fieldset>
        <legend className="text-base font-semibold text-gray-900 mb-4">{current.question}</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {current.options.map((option) => {
            const isSelected = selectedAnswer === option
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                aria-pressed={isSelected}
                className={`text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                  isSelected
                    ? 'border-do-blue bg-do-blue/5 text-gray-900 font-medium ring-1 ring-do-blue/30'
                    : 'border-do-border bg-white hover:border-do-blue hover:bg-do-blue/5 text-gray-700'
                }`}
              >
                {option}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="px-5 py-2.5 bg-do-blue hover:bg-do-blue-dark disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {isLast ? 'Build architecture plan' : 'Next'}
        </button>
      </div>
    </div>
  )
}

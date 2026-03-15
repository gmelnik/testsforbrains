'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface MultipleChoiceProps {
  question: string
  options: string[]
  correctAnswer: string
  onAnswer: (answer: string, isCorrect: boolean) => void
  disabled?: boolean
}

export function MultipleChoice({
  question,
  options,
  correctAnswer,
  onAnswer,
  disabled = false,
}: MultipleChoiceProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSelect = (option: string) => {
    if (disabled || showResult) return

    setSelectedAnswer(option)
    setShowResult(true)

    const isCorrect = option === correctAnswer
    onAnswer(option, isCorrect)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {question}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === option
          const isCorrect = option === correctAnswer
          const showCorrect = showResult && isCorrect
          const showWrong = showResult && isSelected && !isCorrect

          return (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={disabled || showResult}
              className={cn(
                'p-4 rounded-xl border-2 text-lg font-medium transition-all duration-200',
                'hover:scale-[1.02] active:scale-[0.98]',
                !showResult && 'border-gray-200 bg-white hover:border-spark-400 hover:bg-spark-50',
                showCorrect && 'border-green-500 bg-green-50 text-green-700',
                showWrong && 'border-red-500 bg-red-50 text-red-700',
                (disabled || showResult) && !showCorrect && !showWrong && 'opacity-50'
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                  showCorrect ? 'bg-green-500 text-white' : showWrong ? 'bg-red-500 text-white' : 'bg-gray-100'
                )}>
                  {showCorrect ? '✓' : showWrong ? '✗' : String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

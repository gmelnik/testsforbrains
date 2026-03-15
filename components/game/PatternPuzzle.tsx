'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface PatternPuzzleProps {
  pattern: string[]
  missingIndex: number
  options: string[]
  correctAnswer: string
  onAnswer: (answer: string, isCorrect: boolean) => void
  disabled?: boolean
}

export function PatternPuzzle({
  pattern,
  missingIndex,
  options,
  correctAnswer,
  onAnswer,
  disabled = false,
}: PatternPuzzleProps) {
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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          What comes next in the pattern?
        </h2>
      </div>

      {/* Pattern display */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {pattern.map((item, index) => (
          <div
            key={index}
            className={cn(
              'w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center text-3xl md:text-4xl',
              index === missingIndex
                ? 'border-2 border-dashed border-spark-400 bg-spark-50'
                : 'bg-white border-2 border-gray-200 shadow-sm'
            )}
          >
            {index === missingIndex ? (
              showResult ? (
                <span className={selectedAnswer === correctAnswer ? 'text-green-600' : 'text-red-600'}>
                  {selectedAnswer === correctAnswer ? selectedAnswer : correctAnswer}
                </span>
              ) : (
                <span className="text-spark-400">?</span>
              )
            ) : (
              item
            )}
          </div>
        ))}
      </div>

      {/* Options */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
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
                'w-16 h-16 md:w-20 md:h-20 rounded-xl text-3xl md:text-4xl',
                'transition-all duration-200 hover:scale-110 active:scale-95',
                !showResult && 'bg-white border-2 border-gray-200 shadow-sm hover:border-brain-400 hover:shadow-md',
                showCorrect && 'bg-green-100 border-2 border-green-500',
                showWrong && 'bg-red-100 border-2 border-red-500',
                (disabled || showResult) && !showCorrect && !showWrong && 'opacity-50'
              )}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

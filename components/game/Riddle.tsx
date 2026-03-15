'use client'

import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/utils'

interface RiddleProps {
  question: string
  hints?: string[]
  correctAnswer: string
  onAnswer: (answer: string, isCorrect: boolean) => void
  disabled?: boolean
}

export function Riddle({
  question,
  hints = [],
  correctAnswer,
  onAnswer,
  disabled = false,
}: RiddleProps) {
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    if (disabled || showResult || !userAnswer.trim()) return

    // Normalize both answers for comparison
    const normalizedUser = userAnswer.trim().toLowerCase()
    const normalizedCorrect = correctAnswer.toLowerCase()

    const correct = normalizedUser === normalizedCorrect
    setIsCorrect(correct)
    setShowResult(true)
    onAnswer(userAnswer, correct)
  }

  const showHint = () => {
    if (hintsUsed < hints.length) {
      setHintsUsed(hintsUsed + 1)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <span className="text-5xl mb-4 block">🤔</span>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          {question}
        </h2>
      </div>

      {/* Hints */}
      {hints.length > 0 && (
        <div className="space-y-2">
          {hints.slice(0, hintsUsed).map((hint, index) => (
            <div
              key={index}
              className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-sm"
            >
              <span className="font-medium">Hint {index + 1}:</span> {hint}
            </div>
          ))}
          {!showResult && hintsUsed < hints.length && (
            <Button
              variant="outline"
              size="sm"
              onClick={showHint}
              className="text-amber-600 border-amber-300"
            >
              💡 Get a hint ({hints.length - hintsUsed} remaining)
            </Button>
          )}
        </div>
      )}

      {/* Answer input */}
      {!showResult ? (
        <div className="flex gap-3">
          <Input
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer..."
            disabled={disabled}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="flex-1"
          />
          <Button
            onClick={handleSubmit}
            disabled={disabled || !userAnswer.trim()}
          >
            Submit
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            'text-center p-6 rounded-xl',
            isCorrect ? 'bg-green-50' : 'bg-red-50'
          )}
        >
          <span className="text-4xl block mb-2">
            {isCorrect ? '🎉' : '😅'}
          </span>
          <p className={cn(
            'font-bold text-lg',
            isCorrect ? 'text-green-700' : 'text-red-700'
          )}>
            {isCorrect ? 'Correct!' : 'Not quite!'}
          </p>
          {!isCorrect && (
            <p className="text-gray-600 mt-2">
              The answer was: <span className="font-bold">{correctAnswer}</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}

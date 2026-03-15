'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface TimerProps {
  seconds: number
  onTimeUp: () => void
  paused?: boolean
}

export function Timer({ seconds, onTimeUp, paused = false }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds)

  useEffect(() => {
    if (paused || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [paused, timeLeft, onTimeUp])

  const percentage = (timeLeft / seconds) * 100
  const isLow = percentage <= 25
  const isCritical = percentage <= 10

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12">
        {/* Background circle */}
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={125.6}
            strokeDashoffset={125.6 * (1 - percentage / 100)}
            className={cn(
              'transition-all duration-1000',
              isCritical
                ? 'text-red-500'
                : isLow
                ? 'text-amber-500'
                : 'text-spark-500'
            )}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn(
              'text-sm font-bold',
              isCritical
                ? 'text-red-600'
                : isLow
                ? 'text-amber-600'
                : 'text-gray-700'
            )}
          >
            {timeLeft}
          </span>
        </div>
      </div>

      {isCritical && (
        <span className="text-sm font-medium text-red-600 animate-pulse">
          Hurry!
        </span>
      )}
    </div>
  )
}

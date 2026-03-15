'use client'

import { cn } from '@/lib/utils'

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
}

export function StreakDisplay({ currentStreak, longestStreak }: StreakDisplayProps) {
  // Generate last 7 days
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const today = new Date().getDay()
  const adjustedToday = today === 0 ? 6 : today - 1 // Adjust for Monday start

  return (
    <div className="bg-gradient-to-r from-spark-50 to-amber-50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {currentStreak > 0 ? `${currentStreak} Day Streak!` : 'Start a Streak!'}
          </h3>
          <p className="text-sm text-gray-600">
            {currentStreak > 0
              ? 'Keep playing to maintain your streak'
              : 'Play today to start your streak'}
          </p>
        </div>
        <div className="text-4xl">
          {currentStreak >= 7 ? '🔥' : currentStreak >= 3 ? '⭐' : '✨'}
        </div>
      </div>

      {/* Weekly view */}
      <div className="flex gap-2 justify-between">
        {days.map((day, index) => {
          const isActive = index <= adjustedToday && currentStreak > (adjustedToday - index)
          const isToday = index === adjustedToday

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                  isActive
                    ? 'bg-gradient-to-br from-spark-400 to-spark-600 text-white'
                    : 'bg-gray-100 text-gray-400',
                  isToday && !isActive && 'ring-2 ring-spark-400'
                )}
              >
                {isActive ? '✓' : day}
              </div>
            </div>
          )
        })}
      </div>

      {longestStreak > 0 && (
        <p className="mt-4 text-sm text-gray-600">
          Longest streak: <span className="font-bold text-spark-600">{longestStreak} days</span>
        </p>
      )}
    </div>
  )
}

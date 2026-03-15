'use client'

import { Progress } from '@/components/ui'
import { calculateLevelProgress, XP_PER_LEVEL } from '@/types'

interface LevelProgressProps {
  currentLevel: number
  totalXp: number
}

export function LevelProgress({ currentLevel, totalXp }: LevelProgressProps) {
  const xpInCurrentLevel = calculateLevelProgress(totalXp)
  const progressPercent = (xpInCurrentLevel / XP_PER_LEVEL) * 100

  return (
    <div className="bg-gradient-to-r from-brain-50 to-spark-50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Level {currentLevel}</h3>
          <p className="text-sm text-gray-600">
            {xpInCurrentLevel} / {XP_PER_LEVEL} XP to next level
          </p>
        </div>
        <div className="text-4xl">
          {currentLevel <= 5 ? '🌱' : currentLevel <= 10 ? '🌿' : currentLevel <= 20 ? '🌳' : '🏆'}
        </div>
      </div>

      <Progress
        value={xpInCurrentLevel}
        max={XP_PER_LEVEL}
        variant="xp"
        size="lg"
      />

      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium">{totalXp}</span>
        <span>total XP earned</span>
      </div>
    </div>
  )
}

'use client'

import { Button, Card, CardContent, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface GameResultProps {
  isCorrect: boolean
  xpEarned: number
  explanation?: string
  streakBonus?: boolean
  onPlayAgain: () => void
  onNext: () => void
}

export function GameResult({
  isCorrect,
  xpEarned,
  explanation,
  streakBonus = false,
  onPlayAgain,
  onNext,
}: GameResultProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] animate-pop">
      <Card variant="elevated" className="w-full max-w-md text-center">
        <CardContent className="p-8">
          {/* Result emoji */}
          <div className="text-7xl mb-4">
            {isCorrect ? '🎉' : '💪'}
          </div>

          {/* Result message */}
          <h2 className={cn(
            'text-2xl font-bold mb-2',
            isCorrect ? 'text-green-600' : 'text-gray-700'
          )}>
            {isCorrect ? 'Awesome!' : 'Nice try!'}
          </h2>

          <p className="text-gray-600 mb-6">
            {isCorrect
              ? 'You got it right!'
              : "Don't worry, practice makes perfect!"}
          </p>

          {/* XP earned */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Badge variant="xp" size="lg">
              +{xpEarned} XP
            </Badge>
            {streakBonus && (
              <Badge variant="streak" size="lg">
                🔥 Streak Bonus!
              </Badge>
            )}
          </div>

          {/* Explanation */}
          {explanation && (
            <div className="bg-brain-50 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm font-medium text-brain-700 mb-1">💡 Did you know?</p>
              <p className="text-sm text-gray-700">{explanation}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onPlayAgain}
            >
              Play Again
            </Button>
            <Button
              className="flex-1"
              onClick={onNext}
            >
              Next Game
            </Button>
          </div>

          <Link
            href="/play"
            className="block mt-4 text-sm text-gray-500 hover:text-spark-500"
          >
            Back to all games
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

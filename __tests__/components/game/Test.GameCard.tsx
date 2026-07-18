'use client'

import Link from 'next/link'
import { Card, CardContent, Badge } from '@/components/ui'
import { ContentItem } from '@/types'
import { DIFFICULTY_LABELS, CATEGORIES } from '@/lib/utils'

interface GameCardProps {
  game: ContentItem
  locked?: boolean
}

export function GameCard({ game, locked = false }: GameCardProps) {
  const category = CATEGORIES.find(c => c.id === game.category)
  const difficultyInfo = DIFFICULTY_LABELS[game.difficulty]

  const content = (
    <Card variant="elevated" hover={!locked} className="relative overflow-hidden h-full">
      {locked && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <Badge variant="premium" size="lg">
            🔒 Premium
          </Badge>
        </div>
      )}

      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-2xl">{category?.icon}</span>
          <div className="flex gap-2">
            <Badge className={difficultyInfo.color} size="sm">
              {difficultyInfo.label}
            </Badge>
            <Badge variant="xp" size="sm">
              +{game.xp_reward} XP
            </Badge>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{game.title}</h3>

        <p className="text-sm text-gray-500 line-clamp-2">{game.question}</p>

        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <span>Ages {game.age_min}-{game.age_max}</span>
          {game.time_limit_seconds && (
            <span>{game.time_limit_seconds}s</span>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (locked) {
    return (
      <Link href="/pricing" className="block h-full">
        {content}
      </Link>
    )
  }

  return (
    <Link href={`/play/${game.id}`} className="block h-full">
      {content}
    </Link>
  )
}

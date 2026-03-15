'use client'

import Link from 'next/link'
import { Card, CardContent, Badge } from '@/components/ui'
import { CategoryInfo } from '@/types'
import { cn } from '@/lib/utils'

interface CategoryCardProps {
  category: CategoryInfo
  gamesPlayed?: number
  locked?: boolean
}

export function CategoryCard({ category, gamesPlayed = 0, locked = false }: CategoryCardProps) {
  const content = (
    <Card
      variant="elevated"
      hover={!locked}
      className={cn(
        'relative overflow-hidden',
        locked && 'opacity-75'
      )}
    >
      {/* Gradient accent */}
      <div className={cn(
        'absolute top-0 left-0 right-0 h-1',
        `bg-gradient-to-r ${category.bgGradient}`
      )} />

      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="text-4xl mb-4">{category.icon}</div>
          {locked && (
            <Badge variant="premium" size="sm">
              🔒 Premium
            </Badge>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{category.description}</p>

        {gamesPlayed > 0 && (
          <p className="mt-4 text-sm text-gray-600">
            {gamesPlayed} games played
          </p>
        )}
      </CardContent>
    </Card>
  )

  if (locked) {
    return (
      <Link href="/pricing" className="block">
        {content}
      </Link>
    )
  }

  return (
    <Link href={`/play?category=${category.id}`} className="block">
      {content}
    </Link>
  )
}

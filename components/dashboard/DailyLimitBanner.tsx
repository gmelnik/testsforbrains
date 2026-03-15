'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'
import { FREE_DAILY_LIMIT } from '@/lib/utils'

interface DailyLimitBannerProps {
  gamesPlayed: number
  isPremium: boolean
}

export function DailyLimitBanner({ gamesPlayed, isPremium }: DailyLimitBannerProps) {
  if (isPremium) return null

  const remaining = FREE_DAILY_LIMIT - gamesPlayed
  const isLow = remaining <= 2
  const isOut = remaining <= 0

  if (!isLow && !isOut) return null

  return (
    <div className={`rounded-2xl p-4 ${isOut ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isOut ? '😢' : '⚡'}</span>
          <div>
            <p className={`font-semibold ${isOut ? 'text-red-700' : 'text-amber-700'}`}>
              {isOut
                ? "You've reached today's limit!"
                : `Only ${remaining} free ${remaining === 1 ? 'game' : 'games'} left today!`}
            </p>
            <p className="text-sm text-gray-600">
              {isOut
                ? 'Upgrade to Premium for unlimited play'
                : 'Upgrade now for unlimited games'}
            </p>
          </div>
        </div>

        <Link href="/pricing">
          <Button size="sm" variant={isOut ? 'primary' : 'outline'}>
            Go Premium
          </Button>
        </Link>
      </div>
    </div>
  )
}

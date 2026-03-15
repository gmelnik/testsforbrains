'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useDailyLimit } from '@/hooks'
import { createClient } from '@/lib/supabase/client'
import { Button, Badge, Card, CardContent, Avatar } from '@/components/ui'
import {
  StatsCard,
  CategoryCard,
  LevelProgress,
  StreakDisplay,
  DailyLimitBanner,
} from '@/components/dashboard'
import { CATEGORIES } from '@/lib/utils'
import { GameSession } from '@/types'

export default function DashboardPage() {
  const router = useRouter()
  const { user, profile, isPremium, loading } = useAuth()
  const { gamesPlayedToday, remainingGames, hasReachedLimit } = useDailyLimit()
  const [recentGames, setRecentGames] = useState<GameSession[]>([])

  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      fetchRecentGames()
    }
  }, [profile])

  const fetchRecentGames = async () => {
    if (!profile) return

    const { data } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', profile.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(5)

    if (data) {
      setRecentGames(data as GameSession[])
    }
  }

  if (loading || !user || !profile) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse text-4xl">🧠</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar emoji={profile.avatar_url || '🦊'} size="lg" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, {profile.display_name}! 👋
            </h1>
            <p className="text-gray-600">
              {hasReachedLimit
                ? "You've played all your free games today!"
                : `Ready to learn something new?`}
            </p>
          </div>
        </div>

        <Link href="/play">
          <Button size="lg" disabled={hasReachedLimit && !isPremium}>
            {hasReachedLimit && !isPremium ? 'Upgrade to Play' : 'Play Now'}
          </Button>
        </Link>
      </div>

      {/* Daily Limit Banner */}
      <div className="mb-8">
        <DailyLimitBanner gamesPlayed={gamesPlayedToday} isPremium={isPremium} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total XP"
          value={profile.total_xp}
          icon="⭐"
          variant="xp"
        />
        <StatsCard
          title="Level"
          value={profile.current_level}
          icon="🏆"
          variant="success"
        />
        <StatsCard
          title="Current Streak"
          value={`${profile.current_streak} days`}
          icon="🔥"
          variant="streak"
        />
        <StatsCard
          title="Games Today"
          value={`${gamesPlayedToday}${!isPremium ? '/5' : ''}`}
          icon="🎮"
          variant="default"
        />
      </div>

      {/* Progress & Streak Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LevelProgress
          currentLevel={profile.current_level}
          totalXp={profile.total_xp}
        />
        <StreakDisplay
          currentStreak={profile.current_streak}
          longestStreak={profile.longest_streak}
        />
      </div>

      {/* Categories */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Play by Category</h2>
          <Link href="/play" className="text-spark-600 text-sm font-medium hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              locked={!isPremium && index >= 2}
            />
          ))}
        </div>
      </div>

      {/* Quick Play Section */}
      <Card variant="gradient" className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Ready for a challenge?</h2>
              <p className="text-gray-600">Jump into a random game and test your skills!</p>
            </div>
            <Link href="/play">
              <Button size="lg">
                🎲 Quick Play
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {recentGames.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Games</h2>
          <div className="space-y-3">
            {recentGames.map((game) => (
              <Card key={game.id} variant="default">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                      🎮
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Game completed</p>
                      <p className="text-sm text-gray-500">
                        {new Date(game.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="xp">+{game.xp_earned} XP</Badge>
                    <Badge variant={game.score > 0 ? 'success' : 'default'}>
                      Score: {game.score}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

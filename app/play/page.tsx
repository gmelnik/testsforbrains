'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useDailyLimit } from '@/hooks'
import { createClient } from '@/lib/supabase/client'
import { Button, Badge, Card, CardContent } from '@/components/ui'
import { GameCard } from '@/components/game'
import { DailyLimitBanner } from '@/components/dashboard'
import { CATEGORIES, cn } from '@/lib/utils'
import { ContentItem, ContentCategory } from '@/types'

export default function PlayPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, profile, isPremium, loading } = useAuth()
  const { gamesPlayedToday, hasReachedLimit } = useDailyLimit()

  const [games, setGames] = useState<ContentItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all')
  const [loadingGames, setLoadingGames] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    const categoryParam = searchParams.get('category') as ContentCategory | null
    if (categoryParam && CATEGORIES.some(c => c.id === categoryParam)) {
      setSelectedCategory(categoryParam)
    }
  }, [searchParams])

  useEffect(() => {
    fetchGames()
  }, [selectedCategory])

  const fetchGames = async () => {
    setLoadingGames(true)

    let query = supabase
      .from('content_items')
      .select('*')
      .order('created_at', { ascending: false })

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory)
    }

    const { data } = await query.limit(20)

    if (data) {
      setGames(data as ContentItem[])
    }

    setLoadingGames(false)
  }

  const handleCategoryChange = (category: ContentCategory | 'all') => {
    setSelectedCategory(category)
    if (category === 'all') {
      router.push('/play')
    } else {
      router.push(`/play?category=${category}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse text-4xl">🧠</div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Play & Learn</h1>
        <p className="text-gray-600">
          Choose a game or puzzle to challenge yourself
        </p>
      </div>

      {/* Daily Limit Banner for logged in users */}
      {user && !isPremium && (
        <div className="mb-6">
          <DailyLimitBanner gamesPlayed={gamesPlayedToday} isPremium={isPremium} />
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={cn(
              'px-4 py-2 rounded-full font-medium transition-all',
              selectedCategory === 'all'
                ? 'bg-spark-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            All Games
          </button>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={cn(
                'px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2',
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${category.bgGradient} text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <span>{category.icon}</span>
              <span className="hidden sm:inline">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      {loadingGames ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} variant="elevated" className="h-48 animate-pulse">
              <CardContent className="p-5">
                <div className="h-8 w-8 bg-gray-200 rounded mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              locked={game.is_premium && !isPremium}
            />
          ))}
        </div>
      ) : (
        <Card variant="elevated" className="text-center py-12">
          <CardContent>
            <span className="text-5xl block mb-4">🎮</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No games found</h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory !== 'all'
                ? 'Try selecting a different category'
                : 'Games will appear here once content is added'}
            </p>
            {selectedCategory !== 'all' && (
              <Button variant="outline" onClick={() => handleCategoryChange('all')}>
                View All Games
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Premium Upsell */}
      {!isPremium && user && (
        <Card variant="gradient" className="mt-12 bg-gradient-to-r from-brain-50 to-spark-50 border border-brain-100">
          <CardContent className="p-8 text-center">
            <Badge variant="premium" className="mb-4">Premium</Badge>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Unlock the Full Library
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Get unlimited access to all games, CoGAT practice tests, detailed analytics, and premium achievements.
            </p>
            <Button onClick={() => router.push('/pricing')}>
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sign Up CTA for non-logged in users */}
      {!user && (
        <Card variant="gradient" className="mt-12 bg-gradient-to-r from-spark-50 to-brain-50">
          <CardContent className="p-8 text-center">
            <span className="text-5xl block mb-4">🚀</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Track Your Progress
            </h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Create a free account to save your progress, earn XP, and compete on the leaderboard!
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push('/signup')}>
                Sign Up Free
              </Button>
              <Button variant="outline" onClick={() => router.push('/login')}>
                Log In
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

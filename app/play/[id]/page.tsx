'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useGameSession, useDailyLimit } from '@/hooks'
import { createClient } from '@/lib/supabase/client'
import { Button, Card, CardContent, Badge } from '@/components/ui'
import { MultipleChoice, PatternPuzzle, Riddle, GameResult, Timer } from '@/components/game'
import { ContentItem } from '@/types'
import { CATEGORIES, DIFFICULTY_LABELS } from '@/lib/utils'

export default function GamePage() {
  const router = useRouter()
  const params = useParams()
  const { user, profile, isPremium, loading: authLoading } = useAuth()
  const { hasReachedLimit, refresh: refreshLimit } = useDailyLimit()
  const { startSession, submitAnswer, completeSession, error: sessionError } = useGameSession()

  const [game, setGame] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)

  const supabase = createClient()
  const gameId = params.id as string

  useEffect(() => {
    fetchGame()
  }, [gameId])

  const fetchGame = async () => {
    const { data } = await supabase
      .from('content_items')
      .select('*')
      .eq('id', gameId)
      .single()

    if (data) {
      setGame(data as ContentItem)
    }
    setLoading(false)
  }

  const handleStartGame = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (hasReachedLimit && !isPremium) {
      router.push('/pricing')
      return
    }

    const session = await startSession(gameId)
    if (session) {
      setSessionId(session.id)
      setStartTime(Date.now())
    }
  }

  const handleAnswer = useCallback(async (answer: string, correct: boolean) => {
    if (!sessionId || !game) return

    const timeTaken = Math.floor((Date.now() - startTime) / 1000)

    // Submit the answer
    await submitAnswer(sessionId, game.id, answer, correct, timeTaken)

    // Calculate XP (bonus for correct, partial for attempt)
    const baseXp = correct ? game.xp_reward : Math.floor(game.xp_reward * 0.25)
    const streakBonus = profile?.current_streak && profile.current_streak >= 3 ? 1.5 : 1
    const earnedXp = Math.floor(baseXp * streakBonus)

    setIsCorrect(correct)
    setXpEarned(earnedXp)

    // Complete the session
    await completeSession(sessionId, correct ? 100 : 0, earnedXp, timeTaken)

    // Refresh daily limit
    await refreshLimit()

    setShowResult(true)
  }, [sessionId, game, startTime, profile, submitAnswer, completeSession, refreshLimit])

  const handleTimeUp = useCallback(() => {
    if (sessionId && game) {
      handleAnswer('', false)
    }
  }, [sessionId, game, handleAnswer])

  const handlePlayAgain = () => {
    setSessionId(null)
    setShowResult(false)
    setStartTime(0)
    handleStartGame()
  }

  const handleNext = async () => {
    // Fetch a random next game
    const { data } = await supabase
      .from('content_items')
      .select('id')
      .neq('id', gameId)
      .eq('category', game?.category)
      .limit(10)

    if (data && data.length > 0) {
      const randomGame = data[Math.floor(Math.random() * data.length)]
      router.push(`/play/${randomGame.id}`)
    } else {
      router.push('/play')
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse text-4xl">🧠</div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <span className="text-5xl block mb-4">😕</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Game not found</h1>
        <Link href="/play">
          <Button>Back to Games</Button>
        </Link>
      </div>
    )
  }

  // Check premium access
  if (game.is_premium && !isPremium) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Card variant="elevated">
          <CardContent className="p-8">
            <Badge variant="premium" className="mb-4">Premium Content</Badge>
            <span className="text-5xl block mb-4">🔒</span>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              This game requires Premium
            </h1>
            <p className="text-gray-600 mb-6">
              Upgrade to Premium to unlock this game and hundreds more!
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/pricing">
                <Button>Go Premium</Button>
              </Link>
              <Link href="/play">
                <Button variant="outline">Browse Free Games</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const category = CATEGORIES.find(c => c.id === game.category)
  const difficultyInfo = DIFFICULTY_LABELS[game.difficulty]

  // Show result screen
  if (showResult) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <GameResult
          isCorrect={isCorrect}
          xpEarned={xpEarned}
          explanation={game.explanation || undefined}
          streakBonus={profile?.current_streak ? profile.current_streak >= 3 : false}
          onPlayAgain={handlePlayAgain}
          onNext={handleNext}
        />
      </div>
    )
  }

  // Show game start screen
  if (!sessionId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card variant="elevated">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <span className="text-6xl block mb-4">{category?.icon}</span>
              <Badge className={difficultyInfo.color} size="lg">
                {difficultyInfo.label}
              </Badge>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">{game.title}</h1>
            <p className="text-gray-600 mb-6">{category?.name}</p>

            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge variant="xp" size="lg">+{game.xp_reward} XP</Badge>
              {game.time_limit_seconds && (
                <Badge size="lg">{game.time_limit_seconds}s time limit</Badge>
              )}
            </div>

            {sessionError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
                {sessionError}
              </div>
            )}

            <Button size="xl" onClick={handleStartGame}>
              Start Game
            </Button>

            <Link href="/play" className="block mt-4 text-gray-500 hover:text-spark-500">
              Back to games
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render the appropriate game component
  const renderGame = () => {
    const contentData = game.content_data as any

    switch (game.content_type) {
      case 'multiple-choice':
        return (
          <MultipleChoice
            question={game.question}
            options={contentData.options || []}
            correctAnswer={game.correct_answer}
            onAnswer={handleAnswer}
          />
        )

      case 'pattern-puzzle':
        return (
          <PatternPuzzle
            pattern={contentData.pattern || []}
            missingIndex={contentData.missing_index ?? contentData.pattern?.length - 1}
            options={contentData.options || []}
            correctAnswer={game.correct_answer}
            onAnswer={handleAnswer}
          />
        )

      case 'riddle':
        return (
          <Riddle
            question={game.question}
            hints={contentData.hints || []}
            correctAnswer={game.correct_answer}
            onAnswer={handleAnswer}
          />
        )

      default:
        return (
          <MultipleChoice
            question={game.question}
            options={contentData.options || ['Option A', 'Option B', 'Option C', 'Option D']}
            correctAnswer={game.correct_answer}
            onAnswer={handleAnswer}
          />
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category?.icon}</span>
          <div>
            <h1 className="font-bold text-gray-900">{game.title}</h1>
            <p className="text-sm text-gray-500">{category?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {game.time_limit_seconds && (
            <Timer
              seconds={game.time_limit_seconds}
              onTimeUp={handleTimeUp}
            />
          )}
          <Badge className={difficultyInfo.color}>{difficultyInfo.label}</Badge>
        </div>
      </div>

      {/* Game Content */}
      <Card variant="elevated">
        <CardContent className="p-8">
          {renderGame()}
        </CardContent>
      </Card>
    </div>
  )
}

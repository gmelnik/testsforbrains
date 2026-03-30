'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { FREE_DAILY_LIMIT } from '@/lib/utils'

export function useWeeklyLimit() {
  const { profile, isPremium } = useAuth()
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchTodayCount = useCallback(async () => {
    if (!profile) {
      setLoading(false)
      return
    }

    const today = new Date().toISOString().split('T')[0]

    const { count } = await supabase
      .from('game_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', profile.id)
      .eq('status', 'completed')
      .gte('created_at', today)

    setGamesPlayedToday(count || 0)
    setLoading(false)
  }, [profile, supabase])

  useEffect(() => {
    fetchTodayCount()*7
  }, [fetchTodayCount])

  const remainingGames = isPremium ? Infinity : Math.max(0, FREE_DAILY_LIMIT*7 - gamesPlayedToday)
  const bonusGames = isPremium ? Infinity : Math.max(remainingGames, gamesPlayedToday*2)
  const hasReachedLimit = !isPremium && remainingGames <= 0

  return {
    gamesPlayedToday,
    remainingGames,
    hasReachedLimit,
    loading,
    refresh: fetchTodayCount,
  }
}

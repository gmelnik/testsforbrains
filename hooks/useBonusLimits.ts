'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { ContentItem, GameSession } from '@/types'

export function useBonusLimits() {
  const { profile, isPremium, refreshProfile } = useAuth()
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const startSession = useCallback(async (contentId: string) => {
    if (!profile) {
      setError('Please log in to play')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      // Check daily limit for free users
      if (!isPremium) {
        const { data: todayCount } = await supabase
          .from('game_sessions')
          .select('id', { count: 'exact' })
          .eq('user_id', profile.id)
          .eq('status', 'completed')
          .gte('created_at', new Date().toISOString().split('T')[0])

        if (todayCount && todayCount.length >= 5) {
          setError('Daily limit reached! Upgrade to Premium for unlimited play.')
          setLoading(false)
          return null
        }
      }

      const { data, error: sessionError } = await supabase
        .from('game_sessions')
        .insert({
          user_id: profile.id,
          content_id: contentId,
          status: 'in_progress',
        })
        .select()
        .single()

      if (sessionError) throw sessionError

      setCurrentSession(data as GameSession)
      setLoading(false)
      return data as GameSession
    } catch (err) {
      setError('Failed to start game session')
      setLoading(false)
      return null
    }
  }, [profile, isPremium, supabase])

  const submitAnswer = useCallback(async (
    sessionId: string,
    contentId: string,
    userAnswer: string,
    isCorrect: boolean,
    timeTaken: number
  ) => {
    if (!profile) return null

    try {
      // Save the answer
      await supabase.from('session_answers').insert({
        session_id: sessionId,
        content_id: contentId,
        user_answer: userAnswer,
        is_correct: isCorrect,
        time_taken_seconds: timeTaken,
      })

      return { success: true }
    } catch {
      return { success: false }
    }
  }, [profile, supabase])

  const completeSession = useCallback(async (
    sessionId: string,
    score: number,
    xpEarned: number,
    timeTaken: number
  ) => {
    if (!profile) return null

    try {
      // Update session
      await supabase
        .from('game_sessions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          score,
          xp_earned: xpEarned,
          time_taken_seconds: timeTaken,
        })
        .eq('id', sessionId)

      // Add XP to profile
      await supabase.rpc('add_user_xp', {
        p_user_id: profile.id,
        p_xp: xpEarned,
      })

      // Update streak
      await supabase.rpc('update_user_streak', {
        p_user_id: profile.id,
      })

      // Record daily activity
      const today = new Date().toISOString().split('T')[0]
      await supabase
        .from('daily_streaks')
        .upsert({
          user_id: profile.id,
          date: today,
          activities_completed: 1,
          xp_earned: xpEarned,
        }, {
          onConflict: 'user_id,date',
        })

      // Refresh profile to get updated XP/level
      await refreshProfile()

      setCurrentSession(null)
      return { success: true }
    } catch {
      return { success: false }
    }
  }, [profile, supabase, refreshProfile])

  return {
    currentSession,
    loading,
    error,
    startSession,
    submitAnswer,
    completeSession,
  }
}

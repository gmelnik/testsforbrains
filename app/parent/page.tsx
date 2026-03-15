'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Button, Card, CardContent, Badge, Progress, Avatar } from '@/components/ui'
import { StatsCard } from '@/components/dashboard'
import { Profile, GameSession, ProgressSummary } from '@/types'
import { CATEGORIES } from '@/lib/utils'

export default function ParentDashboardPage() {
  const router = useRouter()
  const { user, profile, isPremium, loading } = useAuth()
  const [children, setChildren] = useState<Profile[]>([])
  const [selectedChild, setSelectedChild] = useState<Profile | null>(null)
  const [childProgress, setChildProgress] = useState<ProgressSummary[]>([])
  const [recentActivity, setRecentActivity] = useState<GameSession[]>([])
  const [loadingData, setLoadingData] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile?.role === 'parent') {
      fetchChildren()
    }
  }, [profile])

  useEffect(() => {
    if (selectedChild) {
      fetchChildData(selectedChild.id)
    }
  }, [selectedChild])

  const fetchChildren = async () => {
    if (!profile) return

    const { data: relationships } = await supabase
      .from('parent_child_relationships')
      .select('child_id')
      .eq('parent_id', profile.id)

    if (relationships && relationships.length > 0) {
      const childIds = relationships.map(r => r.child_id)
      const { data: childProfiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', childIds)

      if (childProfiles) {
        setChildren(childProfiles as Profile[])
        setSelectedChild(childProfiles[0] as Profile)
      }
    }

    setLoadingData(false)
  }

  const fetchChildData = async (childId: string) => {
    // Fetch progress summaries
    const { data: progress } = await supabase
      .from('progress_summaries')
      .select('*')
      .eq('user_id', childId)

    if (progress) {
      setChildProgress(progress as ProgressSummary[])
    }

    // Fetch recent activity
    const { data: activity } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('user_id', childId)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(10)

    if (activity) {
      setRecentActivity(activity as GameSession[])
    }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse text-4xl">🧠</div>
      </div>
    )
  }

  // Redirect if not a parent
  if (profile && profile.role !== 'parent') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Card variant="elevated">
          <CardContent className="p-8">
            <span className="text-5xl block mb-4">👨‍👩‍👧</span>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Parent Dashboard</h1>
            <p className="text-gray-600 mb-6">
              This page is for parents to track their children&apos;s progress.
              Create a parent account to access this feature.
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No children linked
  if (children.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <Card variant="elevated">
          <CardContent className="p-8">
            <span className="text-5xl block mb-4">👶</span>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">No Children Linked</h1>
            <p className="text-gray-600 mb-6">
              You haven&apos;t linked any children to your account yet.
              Have your child sign up and then link their account here.
            </p>
            <Button onClick={() => router.push('/profile')}>
              Link a Child
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate stats for selected child
  const totalGames = recentActivity.length
  const correctAnswers = recentActivity.filter(a => a.score > 0).length
  const accuracy = totalGames > 0 ? Math.round((correctAnswers / totalGames) * 100) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Parent Dashboard</h1>
        <p className="text-gray-600">Track your child&apos;s learning progress</p>
      </div>

      {/* Premium Upsell */}
      {!isPremium && (
        <Card variant="gradient" className="mb-8 bg-gradient-to-r from-brain-50 to-spark-50 border border-brain-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <Badge variant="premium" className="mb-2">Premium Feature</Badge>
                <h3 className="font-bold text-gray-900">Unlock Detailed Analytics</h3>
                <p className="text-gray-600 text-sm">Get full progress reports, skill breakdowns, and personalized recommendations.</p>
              </div>
              <Button onClick={() => router.push('/pricing')}>
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Child Selector */}
      {children.length > 1 && (
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child)}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                selectedChild?.id === child.id
                  ? 'bg-spark-100 border-2 border-spark-500'
                  : 'bg-white border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              <Avatar emoji={child.avatar_url || '🦊'} size="sm" />
              <span className="font-medium">{child.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {selectedChild && (
        <>
          {/* Child Overview */}
          <Card variant="elevated" className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar emoji={selectedChild.avatar_url || '🦊'} size="xl" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedChild.display_name}</h2>
                  <p className="text-gray-600">Age {selectedChild.age} | Level {selectedChild.current_level}</p>
                  <div className="flex gap-3 mt-3">
                    <Badge variant="xp">{selectedChild.total_xp} XP</Badge>
                    <Badge variant="streak">🔥 {selectedChild.current_streak} day streak</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total XP"
              value={selectedChild.total_xp}
              icon="⭐"
              variant="xp"
            />
            <StatsCard
              title="Current Level"
              value={selectedChild.current_level}
              icon="🏆"
              variant="success"
            />
            <StatsCard
              title="Games Played"
              value={totalGames}
              icon="🎮"
              variant="default"
            />
            <StatsCard
              title="Accuracy"
              value={`${accuracy}%`}
              icon="🎯"
              variant={accuracy >= 70 ? 'success' : 'streak'}
            />
          </div>

          {/* Category Progress */}
          <Card variant="elevated" className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Progress by Category</h3>

              {childProgress.length > 0 ? (
                <div className="space-y-6">
                  {CATEGORIES.map((category) => {
                    const progress = childProgress.find(p => p.category === category.id)
                    const percent = progress
                      ? Math.round((progress.correct_answers / Math.max(progress.total_attempts, 1)) * 100)
                      : 0

                    return (
                      <div key={category.id}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span className="font-medium text-gray-900">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                              {progress?.total_attempts || 0} games
                            </span>
                            <span className="font-medium text-gray-900">{percent}%</span>
                          </div>
                        </div>
                        <Progress
                          value={percent}
                          max={100}
                          variant="xp"
                          size="md"
                        />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No progress data yet. Encourage your child to start playing!
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card variant="elevated">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>

              {recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                          🎮
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Game completed</p>
                          <p className="text-sm text-gray-500">
                            {new Date(activity.created_at).toLocaleDateString()} at{' '}
                            {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="xp">+{activity.xp_earned} XP</Badge>
                        <Badge variant={activity.score > 0 ? 'success' : 'default'}>
                          {activity.score > 0 ? 'Correct' : 'Try Again'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No recent activity. Time to start playing!
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

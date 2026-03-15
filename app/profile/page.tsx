'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Button, Card, CardContent, Input, Badge, Avatar } from '@/components/ui'
import { AVATARS, cn } from '@/lib/utils'
import { UserAchievement, Achievement } from '@/types'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, isPremium, loading, refreshProfile, signOut } = useAuth()

  const [displayName, setDisplayName] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState('')
  const [saving, setSaving] = useState(false)
  const [achievements, setAchievements] = useState<(UserAchievement & { achievement: Achievement })[]>([])

  const supabase = createClient()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name)
      setSelectedAvatar(profile.avatar_url || AVATARS[0])
      fetchAchievements()
    }
  }, [profile])

  const fetchAchievements = async () => {
    if (!profile) return

    const { data } = await supabase
      .from('user_achievements')
      .select('*, achievement:achievements(*)')
      .eq('user_id', profile.id)
      .order('earned_at', { ascending: false })

    if (data) {
      setAchievements(data as any)
    }
  }

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName,
        avatar_url: selectedAvatar,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id)

    if (!error) {
      await refreshProfile()
    }

    setSaving(false)
  }

  if (loading || !user || !profile) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse text-4xl">🧠</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="elevated">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Profile</h2>

              <div className="space-y-6">
                <Input
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your nickname"
                />

                {profile.role === 'child' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Choose Your Avatar
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {AVATARS.map((avatar) => (
                        <button
                          key={avatar}
                          onClick={() => setSelectedAvatar(avatar)}
                          className={cn(
                            'w-14 h-14 rounded-xl text-2xl flex items-center justify-center transition-all',
                            selectedAvatar === avatar
                              ? 'bg-spark-100 ring-2 ring-spark-500 scale-110'
                              : 'bg-gray-100 hover:bg-gray-200'
                          )}
                        >
                          {avatar}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleSave}
                  loading={saving}
                  disabled={displayName === profile.display_name && selectedAvatar === profile.avatar_url}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card variant="elevated">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Achievements</h2>

              {achievements.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {achievements.map((ua) => (
                    <div
                      key={ua.id}
                      className="text-center p-4 bg-gradient-to-br from-amber-50 to-spark-50 rounded-xl"
                    >
                      <span className="text-3xl block mb-2">{ua.achievement?.icon}</span>
                      <p className="font-medium text-gray-900 text-sm">{ua.achievement?.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{ua.achievement?.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-4xl block mb-4">🏆</span>
                  <p className="text-gray-600">No achievements yet. Keep playing to earn some!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card variant="elevated">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">Account Type</p>
                    <p className="text-sm text-gray-500 capitalize">{profile.role}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Member Since</p>
                    <p className="text-sm text-gray-500">
                      {new Date(profile.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <Button
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50"
                  onClick={signOut}
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card variant="elevated">
            <CardContent className="p-6 text-center">
              <Avatar emoji={selectedAvatar} size="xl" className="mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">{displayName}</h3>
              <p className="text-gray-500 capitalize mb-4">{profile.role}</p>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Level</span>
                  <span className="font-bold text-gray-900">{profile.current_level}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Total XP</span>
                  <span className="font-bold text-gray-900">{profile.total_xp}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Current Streak</span>
                  <span className="font-bold text-gray-900">🔥 {profile.current_streak}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Longest Streak</span>
                  <span className="font-bold text-gray-900">{profile.longest_streak} days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card variant="elevated">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Subscription</h3>

              {isPremium ? (
                <div>
                  <Badge variant="premium" className="mb-3">Premium</Badge>
                  <p className="text-sm text-gray-600 mb-4">
                    You have full access to all BrainSpark features.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      // In production, this would open Stripe Customer Portal
                      alert('This would open Stripe Customer Portal to manage subscription.')
                    }}
                  >
                    Manage Subscription
                  </Button>
                </div>
              ) : (
                <div>
                  <Badge className="mb-3">Free</Badge>
                  <p className="text-sm text-gray-600 mb-4">
                    Upgrade to Premium for unlimited games and full access.
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => router.push('/pricing')}
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

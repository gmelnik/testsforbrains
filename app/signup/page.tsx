'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button, Card, CardContent, Input } from '@/components/ui'
import { AVATARS } from '@/lib/utils'
import { cn } from '@/lib/utils'

type AccountType = 'child' | 'parent'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [accountType, setAccountType] = useState<AccountType>('child')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [age, setAge] = useState('')
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          role: accountType,
          avatar_url: selectedAvatar,
          age: accountType === 'child' ? parseInt(age) : null,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Card variant="elevated" className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <span className="text-5xl block mb-4">🧠</span>
            <h1 className="text-2xl font-bold text-gray-900">Join BrainSpark!</h1>
            <p className="text-gray-600 mt-2">Start your learning adventure</p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  'w-3 h-3 rounded-full transition-colors',
                  s <= step ? 'bg-spark-500' : 'bg-gray-200'
                )}
              />
            ))}
          </div>

          <form onSubmit={handleSignup}>
            {/* Step 1: Account Type */}
            {step === 1 && (
              <div className="space-y-4">
                <p className="font-medium text-gray-700 mb-4">I am a...</p>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAccountType('child')}
                    className={cn(
                      'p-4 rounded-xl border-2 text-center transition-all',
                      accountType === 'child'
                        ? 'border-spark-500 bg-spark-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <span className="text-3xl block mb-2">🧒</span>
                    <span className="font-medium">Kid</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAccountType('parent')}
                    className={cn(
                      'p-4 rounded-xl border-2 text-center transition-all',
                      accountType === 'parent'
                        ? 'border-spark-500 bg-spark-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <span className="text-3xl block mb-2">👨‍👩‍👧</span>
                    <span className="font-medium">Parent</span>
                  </button>
                </div>

                <Button
                  type="button"
                  className="w-full mt-6"
                  onClick={() => setStep(2)}
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step 2: Profile Info */}
            {step === 2 && (
              <div className="space-y-4">
                <Input
                  label={accountType === 'child' ? 'Your nickname' : 'Your name'}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={accountType === 'child' ? 'Cool Coder' : 'John Smith'}
                  required
                />

                {accountType === 'child' && (
                  <Input
                    label="Your age"
                    type="number"
                    min="6"
                    max="12"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="8"
                    required
                  />
                )}

                {accountType === 'child' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pick your avatar
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AVATARS.map((avatar) => (
                        <button
                          key={avatar}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar)}
                          className={cn(
                            'w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all',
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

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    onClick={() => setStep(3)}
                    disabled={!displayName || (accountType === 'child' && !age)}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Account Info */}
            {step === 3 && (
              <div className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={accountType === 'child' ? "Parent's email" : 'you@example.com'}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                />

                {error && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    loading={loading}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-spark-600 font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

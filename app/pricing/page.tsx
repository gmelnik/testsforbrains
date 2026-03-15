'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Card, CardContent, Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

type BillingPeriod = 'monthly' | 'yearly'

const PLANS = {
  free: {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      '5 games per day',
      'Basic progress tracking',
      'Access to sample content',
      'Streak tracking',
      '2 categories unlocked',
    ],
    notIncluded: [
      'Full content library',
      'Unlimited games',
      'CoGAT practice tests',
      'Detailed parent analytics',
      'Premium achievements',
    ],
  },
  premium: {
    name: 'Premium',
    monthlyPrice: 9.99,
    yearlyPrice: 79.99, // ~33% savings
    features: [
      'Unlimited games',
      'Full content library (100+ games)',
      'All 5 categories unlocked',
      'CoGAT practice tests',
      'Detailed parent analytics',
      'Premium achievements & badges',
      'Priority support',
      'Early access to new content',
    ],
    notIncluded: [],
  },
}

export default function PricingPage() {
  const router = useRouter()
  const { user, isPremium } = useAuth()
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/signup')
      return
    }

    setLoading(true)

    // In a real app, this would create a Stripe checkout session
    // For MVP, we'll simulate this
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: billingPeriod === 'monthly'
            ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID
            : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID,
        }),
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      } else {
        // For demo without Stripe, show message
        alert('Stripe checkout would open here. Configure your Stripe keys to enable payments.')
      }
    } catch {
      alert('Stripe checkout would open here. Configure your Stripe keys to enable payments.')
    }

    setLoading(false)
  }

  const yearlyMonthlyPrice = (PLANS.premium.yearlyPrice / 12).toFixed(2)
  const savingsPercent = Math.round(
    (1 - PLANS.premium.yearlyPrice / (PLANS.premium.monthlyPrice * 12)) * 100
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Badge variant="premium" className="mb-4">Pricing</Badge>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start free, upgrade when you are ready. Cancel anytime.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <button
          onClick={() => setBillingPeriod('monthly')}
          className={cn(
            'px-4 py-2 rounded-full font-medium transition-all',
            billingPeriod === 'monthly'
              ? 'bg-spark-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingPeriod('yearly')}
          className={cn(
            'px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2',
            billingPeriod === 'yearly'
              ? 'bg-spark-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Yearly
          <span className={cn(
            'text-xs px-2 py-0.5 rounded-full',
            billingPeriod === 'yearly'
              ? 'bg-white/20'
              : 'bg-green-100 text-green-700'
          )}>
            Save {savingsPercent}%
          </span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card variant="elevated">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{PLANS.free.name}</h3>
            <p className="text-gray-600 mb-6">Perfect for trying out BrainSpark</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-500">/month</span>
            </div>

            <ul className="space-y-3 mb-8">
              {PLANS.free.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-500 font-bold">✓</span> {feature}
                </li>
              ))}
              {PLANS.free.notIncluded.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-gray-400">
                  <span className="font-bold">✗</span> {feature}
                </li>
              ))}
            </ul>

            {!user ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/signup')}
              >
                Get Started Free
              </Button>
            ) : !isPremium ? (
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                Downgrade
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card variant="elevated" className="relative border-2 border-spark-500">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="premium">Most Popular</Badge>
          </div>

          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{PLANS.premium.name}</h3>
            <p className="text-gray-600 mb-6">Full access to everything</p>

            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">
                ${billingPeriod === 'monthly' ? PLANS.premium.monthlyPrice : yearlyMonthlyPrice}
              </span>
              <span className="text-gray-500">/month</span>
              {billingPeriod === 'yearly' && (
                <p className="text-sm text-gray-500 mt-1">
                  ${PLANS.premium.yearlyPrice} billed yearly
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {PLANS.premium.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-gray-700">
                  <span className="text-spark-500 font-bold">✓</span> {feature}
                </li>
              ))}
            </ul>

            {isPremium ? (
              <Button className="w-full" disabled>
                Current Plan
              </Button>
            ) : (
              <Button className="w-full" onClick={handleSubscribe} loading={loading}>
                {user ? 'Upgrade to Premium' : 'Start Premium'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {[
            {
              q: 'Can I cancel anytime?',
              a: 'Yes! You can cancel your subscription at any time. You will continue to have access until the end of your billing period.',
            },
            {
              q: 'Is there a free trial?',
              a: 'Our free plan lets you try BrainSpark with 5 games per day. Upgrade whenever you are ready for unlimited access.',
            },
            {
              q: 'Can multiple children use one account?',
              a: 'Each child should have their own profile to track individual progress. One Premium subscription covers your entire family.',
            },
            {
              q: 'What ages is BrainSpark for?',
              a: 'BrainSpark is designed for children ages 6-12, with content appropriate for different skill levels within that range.',
            },
          ].map(({ q, a }) => (
            <Card key={q} variant="default">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-2">{q}</h3>
                <p className="text-gray-600">{a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <p className="text-gray-600 mb-4">
          Questions? Reach out to us at{' '}
          <a href="mailto:support@brainspark.com" className="text-spark-600 hover:underline">
            support@brainspark.com
          </a>
        </p>
      </div>
    </div>
  )
}

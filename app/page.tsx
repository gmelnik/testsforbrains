import Link from 'next/link'
import { Button, Card, CardContent, Badge } from '@/components/ui'
import { CATEGORIES } from '@/lib/utils'

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-spark-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-brain-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-reward-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge variant="premium" className="mb-6">
              Fun Learning for Ages 6-12
            </Badge>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Play Smart.{' '}
              <span className="bg-gradient-to-r from-spark-500 to-brain-500 bg-clip-text text-transparent">
                Grow Smarter.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Math games, logic puzzles, and brain training that kids actually love.
              Build real cognitive skills while having fun!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="xl" className="w-full sm:w-auto">
                  Start Playing Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  View Premium
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center justify-center gap-8 text-gray-500">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">5+</p>
                <p className="text-sm">Daily Free Games</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">5</p>
                <p className="text-sm">Categories</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">100+</p>
                <p className="text-sm">Puzzles & Games</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Something for Every Mind
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From math practice to CoGAT prep, we have games that challenge and delight
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <Card key={category.id} variant="elevated" hover className="group">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.bgGradient} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Learning Made Fun
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our game-based approach keeps kids engaged while building real skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: '🎮',
                title: 'Play Games',
                description: 'Choose from math, logic, riddles, and more. Each game is designed to be short, fun, and rewarding.',
              },
              {
                step: '2',
                icon: '⭐',
                title: 'Earn Rewards',
                description: 'Collect XP, maintain streaks, and unlock achievements. Every correct answer brings new rewards!',
              },
              {
                step: '3',
                icon: '📈',
                title: 'Track Progress',
                description: 'Parents can see detailed progress reports, strengths, and areas for improvement.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-spark-100 to-brain-100 flex items-center justify-center text-4xl">
                    {item.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-spark-500 text-white flex items-center justify-center font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Parents Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-brain-100 text-brain-700">For Parents</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Screen Time You Can Feel Good About
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                BrainSpark turns screen time into learning time. Our parent dashboard lets you track exactly what your child is learning and how they are progressing.
              </p>

              <ul className="space-y-4">
                {[
                  'Real-time progress tracking',
                  'Detailed skill breakdown by category',
                  'Activity history and time spent',
                  'Personalized improvement suggestions',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-sm">✓</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <Card variant="elevated" className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Alex's Progress</h3>
                    <Badge variant="success">This Week</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brain-50 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-brain-600">847</p>
                      <p className="text-sm text-gray-600">XP Earned</p>
                    </div>
                    <div className="bg-spark-50 rounded-xl p-4 text-center">
                      <p className="text-3xl font-bold text-spark-600">12</p>
                      <p className="text-sm text-gray-600">Games Played</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { name: 'Math', percent: 85, color: 'bg-blue-500' },
                      { name: 'Logic', percent: 72, color: 'bg-purple-500' },
                      { name: 'Riddles', percent: 90, color: 'bg-amber-500' },
                    ].map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-700">{skill.name}</span>
                          <span className="text-gray-500">{skill.percent}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full">
                          <div className={`h-2 rounded-full ${skill.color}`} style={{ width: `${skill.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-gradient-to-b from-brain-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Start Free, Go Premium
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Try BrainSpark free with 5 games per day. Upgrade for unlimited access to our full library.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card variant="elevated" className="text-left">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg font-normal text-gray-500">/month</span></p>

                <ul className="space-y-3 mb-8">
                  {['5 games per day', 'Basic progress tracking', 'Access to sample content', 'Streak tracking'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-600">
                      <span className="text-green-500">✓</span> {item}
                    </li>
                  ))}
                </ul>

                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card variant="elevated" className="text-left relative border-2 border-spark-500">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="premium">Most Popular</Badge>
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Premium</h3>
                <p className="text-4xl font-bold text-gray-900 mb-6">$9.99<span className="text-lg font-normal text-gray-500">/month</span></p>

                <ul className="space-y-3 mb-8">
                  {['Unlimited games', 'Full content library', 'Detailed parent analytics', 'Premium achievements', 'CoGAT practice tests', 'Priority support'].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-600">
                      <span className="text-spark-500">✓</span> {item}
                    </li>
                  ))}
                </ul>

                <Link href="/pricing" className="block">
                  <Button className="w-full">Go Premium</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-spark-500 to-brain-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Spark Your Child's Potential?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of families making learning fun. Start with 5 free games today!
          </p>
          <Link href="/signup">
            <Button size="xl" className="bg-white text-spark-600 hover:bg-gray-100">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

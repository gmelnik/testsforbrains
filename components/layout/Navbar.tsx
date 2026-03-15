'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button, Badge, Avatar } from '@/components/ui'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { user, profile, isPremium, signOut, loading } = useAuth()
  const pathname = usePathname()

  const navLinks = user
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/play', label: 'Play' },
        ...(profile?.role === 'parent' ? [{ href: '/parent', label: 'Parent Hub' }] : []),
      ]
    : []

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-3xl">🧠</span>
            <span className="text-xl font-bold bg-gradient-to-r from-spark-500 to-brain-500 bg-clip-text text-transparent">
              BrainSpark
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-spark-600'
                    : 'text-gray-600 hover:text-spark-500'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <>
                {/* XP Badge */}
                {profile && (
                  <div className="hidden sm:flex items-center gap-2">
                    <Badge variant="xp" size="sm">
                      {profile.total_xp} XP
                    </Badge>
                    {profile.current_streak > 0 && (
                      <Badge variant="streak" size="sm">
                        🔥 {profile.current_streak}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Premium Badge */}
                {isPremium && (
                  <Badge variant="premium" size="sm">
                    ⭐ Premium
                  </Badge>
                )}

                {/* Profile dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2">
                    <Avatar emoji={profile?.avatar_url || '🦊'} size="sm" />
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {profile?.display_name}
                    </span>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    {!isPremium && (
                      <Link
                        href="/pricing"
                        className="block px-4 py-2 text-sm text-spark-600 font-medium hover:bg-spark-50"
                      >
                        Upgrade to Premium
                      </Link>
                    )}
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

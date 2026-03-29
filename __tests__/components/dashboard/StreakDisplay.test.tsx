import React from 'react'
import { render, screen } from '@testing-library/react'
import { StreakDisplay } from '@/components/dashboard/StreakDisplay'

describe('StreakDisplay', () => {
  it('shows streak count when currentStreak > 0', () => {
    render(<StreakDisplay currentStreak={5} longestStreak={10} />)
    expect(screen.getByText('5 Day Streak!')).toBeInTheDocument()
  })

  it('shows start streak prompt when currentStreak is 0', () => {
    render(<StreakDisplay currentStreak={0} longestStreak={0} />)
    expect(screen.getByText('Start a Streak!')).toBeInTheDocument()
  })

  it('shows fire emoji for streaks >= 7', () => {
    render(<StreakDisplay currentStreak={7} longestStreak={7} />)
    expect(screen.getByText('🔥')).toBeInTheDocument()
  })

  it('shows star emoji for streaks >= 3 but < 7', () => {
    render(<StreakDisplay currentStreak={4} longestStreak={4} />)
    expect(screen.getByText('⭐')).toBeInTheDocument()
  })

  it('shows sparkle emoji for streaks < 3', () => {
    render(<StreakDisplay currentStreak={2} longestStreak={2} />)
    expect(screen.getByText('✨')).toBeInTheDocument()
  })

  it('shows sparkle emoji for 0 streak', () => {
    render(<StreakDisplay currentStreak={0} longestStreak={0} />)
    expect(screen.getByText('✨')).toBeInTheDocument()
  })

  it('shows longest streak when longestStreak > 0', () => {
    render(<StreakDisplay currentStreak={3} longestStreak={12} />)
    expect(screen.getByText('12 days')).toBeInTheDocument()
  })

  it('does not show longest streak when longestStreak is 0', () => {
    render(<StreakDisplay currentStreak={0} longestStreak={0} />)
    expect(screen.queryByText(/longest streak/i)).not.toBeInTheDocument()
  })

  it('renders 7 day circles', () => {
    const { container } = render(
      <StreakDisplay currentStreak={3} longestStreak={5} />
    )
    // Each day has a circle div
    const dayCircles = container.querySelectorAll('.w-8.h-8.rounded-full')
    expect(dayCircles).toHaveLength(7)
  })

  it('shows keep playing message when streak active', () => {
    render(<StreakDisplay currentStreak={3} longestStreak={5} />)
    expect(screen.getByText(/keep playing to maintain your streak/i)).toBeInTheDocument()
  })

  it('shows play today message when no streak', () => {
    render(<StreakDisplay currentStreak={0} longestStreak={0} />)
    expect(screen.getByText(/play today to start your streak/i)).toBeInTheDocument()
  })
})

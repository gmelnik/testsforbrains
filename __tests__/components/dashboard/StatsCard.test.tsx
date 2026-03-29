import React from 'react'
import { render, screen } from '@testing-library/react'
import { StatsCard } from '@/components/dashboard/StatsCard'

describe('StatsCard', () => {
  it('renders the title', () => {
    render(<StatsCard title="Games Played" value={42} icon="🎮" />)
    expect(screen.getByText('Games Played')).toBeInTheDocument()
  })

  it('renders a numeric value', () => {
    render(<StatsCard title="Games Played" value={42} icon="🎮" />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('renders a string value', () => {
    render(<StatsCard title="Level" value="Gold" icon="⭐" />)
    expect(screen.getByText('Gold')).toBeInTheDocument()
  })

  it('renders the icon', () => {
    render(<StatsCard title="Games Played" value={42} icon="🎮" />)
    expect(screen.getByText('🎮')).toBeInTheDocument()
  })

  it('does not render trend when trend prop is not provided', () => {
    render(<StatsCard title="Games Played" value={42} icon="🎮" />)
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument()
  })

  it('renders positive trend with + prefix', () => {
    render(
      <StatsCard
        title="Games Played"
        value={42}
        icon="🎮"
        trend={{ value: 5, label: 'this week' }}
      />
    )
    expect(screen.getByText(/\+5 this week/)).toBeInTheDocument()
  })

  it('renders negative trend without + prefix', () => {
    render(
      <StatsCard
        title="Games Played"
        value={42}
        icon="🎮"
        trend={{ value: -3, label: 'this week' }}
      />
    )
    expect(screen.getByText(/-3 this week/)).toBeInTheDocument()
  })

  it('applies xp variant styles', () => {
    const { container } = render(
      <StatsCard title="XP" value={500} icon="⚡" variant="xp" />
    )
    const iconBox = container.querySelector('.bg-gradient-to-br')!
    expect(iconBox.className).toMatch(/from-brain-400/)
  })

  it('applies streak variant styles', () => {
    const { container } = render(
      <StatsCard title="Streak" value={7} icon="🔥" variant="streak" />
    )
    const iconBox = container.querySelector('.bg-gradient-to-br')!
    expect(iconBox.className).toMatch(/from-spark-400/)
  })

  it('applies success variant styles', () => {
    const { container } = render(
      <StatsCard title="Score" value={100} icon="✅" variant="success" />
    )
    const iconBox = container.querySelector('.bg-gradient-to-br')!
    expect(iconBox.className).toMatch(/from-reward-400/)
  })
})

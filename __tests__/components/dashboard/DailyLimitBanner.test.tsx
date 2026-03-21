import React from 'react'
import { render, screen } from '@testing-library/react'
import { DailyLimitBanner } from '@/components/dashboard/DailyLimitBanner'
import { FREE_DAILY_LIMIT } from '@/lib/utils'

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) {
    return <a href={href}>{children}</a>
  }
})

describe('DailyLimitBanner', () => {
  it('renders nothing when user is premium', () => {
    const { container } = render(
      <DailyLimitBanner gamesPlayed={3} isPremium />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when remaining games > 2', () => {
    const { container } = render(
      <DailyLimitBanner gamesPlayed={1} isPremium={false} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders low games warning when 2 games remain', () => {
    render(<DailyLimitBanner gamesPlayed={FREE_DAILY_LIMIT - 2} isPremium={false} />)
    expect(screen.getByText(/only 2 free games left today/i)).toBeInTheDocument()
  })

  it('renders low games warning when 1 game remains', () => {
    render(<DailyLimitBanner gamesPlayed={FREE_DAILY_LIMIT - 1} isPremium={false} />)
    expect(screen.getByText(/only 1 free game left today/i)).toBeInTheDocument()
  })

  it('renders limit reached message when 0 games remain', () => {
    render(<DailyLimitBanner gamesPlayed={FREE_DAILY_LIMIT} isPremium={false} />)
    expect(screen.getByText(/you've reached today's limit/i)).toBeInTheDocument()
  })

  it('shows the upgrade button linking to /pricing', () => {
    render(<DailyLimitBanner gamesPlayed={FREE_DAILY_LIMIT} isPremium={false} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/pricing')
    expect(screen.getByRole('button', { name: /go premium/i })).toBeInTheDocument()
  })

  it('shows lightning bolt emoji when games are low', () => {
    render(<DailyLimitBanner gamesPlayed={FREE_DAILY_LIMIT - 1} isPremium={false} />)
    expect(screen.getByText('⚡')).toBeInTheDocument()
  })

  it('shows sad emoji when limit is reached', () => {
    render(<DailyLimitBanner gamesPlayed={FREE_DAILY_LIMIT} isPremium={false} />)
    expect(screen.getByText('😢')).toBeInTheDocument()
  })
})

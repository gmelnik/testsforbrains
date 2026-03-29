import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { GameResult } from '@/components/game/GameResult'

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

const defaultProps = {
  isCorrect: true,
  xpEarned: 10,
  onPlayAgain: jest.fn(),
  onNext: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('GameResult', () => {
  it('renders 🎉 emoji when answer is correct', () => {
    render(<GameResult {...defaultProps} />)
    expect(screen.getByText('🎉')).toBeInTheDocument()
  })

  it('renders 💪 emoji when answer is incorrect', () => {
    render(<GameResult {...defaultProps} isCorrect={false} />)
    expect(screen.getByText('💪')).toBeInTheDocument()
  })

  it('shows "Awesome!" for correct answer', () => {
    render(<GameResult {...defaultProps} />)
    expect(screen.getByText('Awesome!')).toBeInTheDocument()
  })

  it('shows "Nice try!" for incorrect answer', () => {
    render(<GameResult {...defaultProps} isCorrect={false} />)
    expect(screen.getByText('Nice try!')).toBeInTheDocument()
  })

  it('shows XP earned badge', () => {
    render(<GameResult {...defaultProps} xpEarned={25} />)
    expect(screen.getByText('+25 XP')).toBeInTheDocument()
  })

  it('does not show streak badge by default', () => {
    render(<GameResult {...defaultProps} />)
    expect(screen.queryByText(/streak bonus/i)).not.toBeInTheDocument()
  })

  it('shows streak badge when streakBonus is true', () => {
    render(<GameResult {...defaultProps} streakBonus />)
    expect(screen.getByText(/streak bonus/i)).toBeInTheDocument()
  })

  it('does not show explanation by default', () => {
    render(<GameResult {...defaultProps} />)
    expect(screen.queryByText(/did you know/i)).not.toBeInTheDocument()
  })

  it('shows explanation when provided', () => {
    render(
      <GameResult
        {...defaultProps}
        explanation="Clocks have hands that point to numbers."
      />
    )
    expect(screen.getByText(/did you know/i)).toBeInTheDocument()
    expect(
      screen.getByText('Clocks have hands that point to numbers.')
    ).toBeInTheDocument()
  })

  it('calls onPlayAgain when Play Again button is clicked', () => {
    const onPlayAgain = jest.fn()
    render(<GameResult {...defaultProps} onPlayAgain={onPlayAgain} />)
    fireEvent.click(screen.getByRole('button', { name: /play again/i }))
    expect(onPlayAgain).toHaveBeenCalledTimes(1)
  })

  it('calls onNext when Next Game button is clicked', () => {
    const onNext = jest.fn()
    render(<GameResult {...defaultProps} onNext={onNext} />)
    fireEvent.click(screen.getByRole('button', { name: /next game/i }))
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('renders "Back to all games" link', () => {
    render(<GameResult {...defaultProps} />)
    const link = screen.getByRole('link', { name: /back to all games/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/play')
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { CategoryCard } from '@/components/dashboard/CategoryCard'
import { CategoryInfo } from '@/types'

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    className,
  }: {
    children: React.ReactNode
    href: string
    className?: string
  }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
})

const mathCategory: CategoryInfo = {
  id: 'math',
  name: 'Math Games',
  description: 'Addition, subtraction, multiplication, and more!',
  icon: '🔢',
  color: 'text-blue-600',
  bgGradient: 'from-blue-400 to-blue-600',
}

describe('CategoryCard', () => {
  it('renders the category name', () => {
    render(<CategoryCard category={mathCategory} />)
    expect(screen.getByText('Math Games')).toBeInTheDocument()
  })

  it('renders the category description', () => {
    render(<CategoryCard category={mathCategory} />)
    expect(
      screen.getByText('Addition, subtraction, multiplication, and more!')
    ).toBeInTheDocument()
  })

  it('renders the category icon', () => {
    render(<CategoryCard category={mathCategory} />)
    expect(screen.getByText('🔢')).toBeInTheDocument()
  })

  it('links to /play?category=math when unlocked', () => {
    render(<CategoryCard category={mathCategory} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/play?category=math')
  })

  it('links to /pricing when locked', () => {
    render(<CategoryCard category={mathCategory} locked />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/pricing')
  })

  it('shows Premium badge when locked', () => {
    render(<CategoryCard category={mathCategory} locked />)
    expect(screen.getByText(/premium/i)).toBeInTheDocument()
  })

  it('does not show Premium badge when unlocked', () => {
    render(<CategoryCard category={mathCategory} />)
    expect(screen.queryByText(/premium/i)).not.toBeInTheDocument()
  })

  it('shows games played count when gamesPlayed > 0', () => {
    render(<CategoryCard category={mathCategory} gamesPlayed={7} />)
    expect(screen.getByText('7 games played')).toBeInTheDocument()
  })

  it('does not show games played count when gamesPlayed is 0', () => {
    render(<CategoryCard category={mathCategory} gamesPlayed={0} />)
    expect(screen.queryByText(/games played/i)).not.toBeInTheDocument()
  })
})

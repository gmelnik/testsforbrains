import React from 'react'
import { render, screen } from '@testing-library/react'
import { LevelProgress } from '@/components/dashboard/LevelProgress'

describe('LevelProgress', () => {
  it('renders the current level', () => {
    render(<LevelProgress currentLevel={3} totalXp={250} />)
    expect(screen.getByText('Level 3')).toBeInTheDocument()
  })

  it('renders total XP earned', () => {
    render(<LevelProgress currentLevel={3} totalXp={250} />)
    expect(screen.getByText('250')).toBeInTheDocument()
  })

  it('renders XP progress within current level', () => {
    // totalXp=250 → xpInCurrentLevel = 250 % 100 = 50
    render(<LevelProgress currentLevel={3} totalXp={250} />)
    expect(screen.getByText(/50 \/ 100 xp to next level/i)).toBeInTheDocument()
  })

  it('renders seedling emoji for low levels (≤5)', () => {
    render(<LevelProgress currentLevel={2} totalXp={150} />)
    expect(screen.getByText('🌱')).toBeInTheDocument()
  })

  it('renders sprout emoji for mid levels (6-10)', () => {
    render(<LevelProgress currentLevel={7} totalXp={650} />)
    expect(screen.getByText('🌿')).toBeInTheDocument()
  })

  it('renders tree emoji for higher levels (11-20)', () => {
    render(<LevelProgress currentLevel={15} totalXp={1450} />)
    expect(screen.getByText('🌳')).toBeInTheDocument()
  })

  it('renders trophy emoji for top levels (>20)', () => {
    render(<LevelProgress currentLevel={21} totalXp={2050} />)
    expect(screen.getByText('🏆')).toBeInTheDocument()
  })

  it('renders a Progress component', () => {
    const { container } = render(<LevelProgress currentLevel={1} totalXp={50} />)
    // Progress renders a bar element with width style
    const bar = container.querySelector('[style]')
    expect(bar).toBeInTheDocument()
  })

  it('shows 0 XP progress at level boundary', () => {
    // totalXp=200 → xpInCurrentLevel = 200 % 100 = 0
    render(<LevelProgress currentLevel={3} totalXp={200} />)
    expect(screen.getByText(/0 \/ 100 xp to next level/i)).toBeInTheDocument()
  })
})

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { PatternPuzzle } from '@/components/game/PatternPuzzle'

const defaultProps = {
  pattern: ['🔴', '🔵', '🔴', '?', '🔴'],
  missingIndex: 3,
  options: ['🔵', '🔴', '🟡', '🟢'],
  correctAnswer: '🔵',
  onAnswer: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('PatternPuzzle', () => {
  it('renders the pattern question heading', () => {
    render(<PatternPuzzle {...defaultProps} />)
    expect(screen.getByText(/what comes next in the pattern/i)).toBeInTheDocument()
  })

  it('renders a ? placeholder at the missing index', () => {
    render(<PatternPuzzle {...defaultProps} />)
    expect(screen.getByText('?')).toBeInTheDocument()
  })

  it('renders pattern items (excluding missing index)', () => {
    render(<PatternPuzzle {...defaultProps} />)
    // Items at non-missing positions: 🔴, 🔵, 🔴, 🔴 (pattern[0],[1],[2],[4])
    const reds = screen.getAllByText('🔴')
    expect(reds.length).toBeGreaterThan(0)
  })

  it('renders all answer options', () => {
    render(<PatternPuzzle {...defaultProps} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(defaultProps.options.length)
  })

  it('calls onAnswer with correct answer and isCorrect=true', () => {
    const onAnswer = jest.fn()
    render(<PatternPuzzle {...defaultProps} onAnswer={onAnswer} />)
    const buttons = screen.getAllByRole('button')
    // First button is 🔵 (correct answer)
    fireEvent.click(buttons[0])
    expect(onAnswer).toHaveBeenCalledWith('🔵', true)
  })

  it('calls onAnswer with wrong answer and isCorrect=false', () => {
    const onAnswer = jest.fn()
    render(<PatternPuzzle {...defaultProps} onAnswer={onAnswer} />)
    const buttons = screen.getAllByRole('button')
    // Second button is 🔴 (wrong answer)
    fireEvent.click(buttons[1])
    expect(onAnswer).toHaveBeenCalledWith('🔴', false)
  })

  it('disables all buttons after selection', () => {
    render(<PatternPuzzle {...defaultProps} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    for (const button of buttons) {
      expect(button).toBeDisabled()
    }
  })

  it('does not call onAnswer a second time when clicking after answer', () => {
    const onAnswer = jest.fn()
    render(<PatternPuzzle {...defaultProps} onAnswer={onAnswer} />)
    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[0])
    fireEvent.click(buttons[1])
    expect(onAnswer).toHaveBeenCalledTimes(1)
  })

  it('does not call onAnswer when disabled prop is true', () => {
    const onAnswer = jest.fn()
    render(<PatternPuzzle {...defaultProps} onAnswer={onAnswer} disabled />)
    const buttons = screen.getAllByRole('button')
    for (const button of buttons) {
      fireEvent.click(button)
    }
    expect(onAnswer).not.toHaveBeenCalled()
  })
})

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MultipleChoice } from '@/components/game/MultipleChoice'

const defaultProps = {
  question: 'What is 2 + 2?',
  options: ['3', '4', '5', '6'],
  correctAnswer: '4',
  onAnswer: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('MultipleChoice', () => {
  it('renders the question', () => {
    render(<MultipleChoice {...defaultProps} />)
    expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument()
  })

  it('renders all answer options', () => {
    render(<MultipleChoice {...defaultProps} />)
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
  })

  it('displays A/B/C/D labels before selection', () => {
    render(<MultipleChoice {...defaultProps} />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it('calls onAnswer with correct answer and isCorrect=true', () => {
    const onAnswer = jest.fn()
    render(<MultipleChoice {...defaultProps} onAnswer={onAnswer} />)
    fireEvent.click(screen.getByText('4'))
    expect(onAnswer).toHaveBeenCalledWith('4', true)
  })

  it('calls onAnswer with wrong answer and isCorrect=false', () => {
    const onAnswer = jest.fn()
    render(<MultipleChoice {...defaultProps} onAnswer={onAnswer} />)
    fireEvent.click(screen.getByText('3'))
    expect(onAnswer).toHaveBeenCalledWith('3', false)
  })

  it('disables all options after an answer is selected', () => {
    render(<MultipleChoice {...defaultProps} />)
    fireEvent.click(screen.getByText('4'))
    const buttons = screen.getAllByRole('button')
    for (const button of buttons) {
      expect(button).toBeDisabled()
    }
  })

  it('shows checkmark on correct answer after selection', () => {
    render(<MultipleChoice {...defaultProps} />)
    fireEvent.click(screen.getByText('4'))
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('shows X on wrong answer after selection', () => {
    render(<MultipleChoice {...defaultProps} />)
    fireEvent.click(screen.getByText('3'))
    expect(screen.getByText('✗')).toBeInTheDocument()
  })

  it('does not call onAnswer a second time when clicking after answer', () => {
    const onAnswer = jest.fn()
    render(<MultipleChoice {...defaultProps} onAnswer={onAnswer} />)
    fireEvent.click(screen.getByText('4'))
    fireEvent.click(screen.getByText('3'))
    expect(onAnswer).toHaveBeenCalledTimes(1)
  })

  it('does not call onAnswer when disabled prop is true', () => {
    const onAnswer = jest.fn()
    render(<MultipleChoice {...defaultProps} onAnswer={onAnswer} disabled />)
    const buttons = screen.getAllByRole('button')
    for (const button of buttons) {
      fireEvent.click(button)
    }
    expect(onAnswer).not.toHaveBeenCalled()
  })
})

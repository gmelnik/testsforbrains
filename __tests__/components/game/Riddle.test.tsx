import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Riddle } from '@/components/game/Riddle'

const defaultProps = {
  question: 'What has hands but cannot clap?',
  correctAnswer: 'clock',
  onAnswer: jest.fn(),
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Riddle', () => {
  it('renders the question', () => {
    render(<Riddle {...defaultProps} />)
    expect(screen.getByText('What has hands but cannot clap?')).toBeInTheDocument()
  })

  it('renders the thinking emoji', () => {
    render(<Riddle {...defaultProps} />)
    expect(screen.getByText('🤔')).toBeInTheDocument()
  })

  it('renders the answer input', () => {
    render(<Riddle {...defaultProps} />)
    expect(screen.getByPlaceholderText(/type your answer/i)).toBeInTheDocument()
  })

  it('renders the Submit button', () => {
    render(<Riddle {...defaultProps} />)
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('Submit button is disabled when input is empty', () => {
    render(<Riddle {...defaultProps} />)
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
  })

  it('Submit button is enabled when user types', () => {
    render(<Riddle {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
      target: { value: 'clock' },
    })
    expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled()
  })

  it('calls onAnswer with correct isCorrect=true for matching answer', () => {
    const onAnswer = jest.fn()
    render(<Riddle {...defaultProps} onAnswer={onAnswer} />)
    fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
      target: { value: 'clock' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onAnswer).toHaveBeenCalledWith('clock', true)
  })

  it('is case-insensitive for answer comparison', () => {
    const onAnswer = jest.fn()
    render(<Riddle {...defaultProps} onAnswer={onAnswer} />)
    fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
      target: { value: 'CLOCK' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onAnswer).toHaveBeenCalledWith('CLOCK', true)
  })

  it('calls onAnswer with isCorrect=false for wrong answer', () => {
    const onAnswer = jest.fn()
    render(<Riddle {...defaultProps} onAnswer={onAnswer} />)
    fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
      target: { value: 'watch' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(onAnswer).toHaveBeenCalledWith('watch', false)
  })

  it('shows success result after correct answer', () => {
    render(<Riddle {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
      target: { value: 'clock' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText('Correct!')).toBeInTheDocument()
    expect(screen.getByText('🎉')).toBeInTheDocument()
  })

  it('shows failure result after wrong answer', () => {
    render(<Riddle {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
      target: { value: 'watch' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText('Not quite!')).toBeInTheDocument()
    expect(screen.getByText('😅')).toBeInTheDocument()
  })

  it('shows correct answer after wrong submission', () => {
    render(<Riddle {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
      target: { value: 'watch' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.getByText('clock')).toBeInTheDocument()
  })

  it('hides input after submission', () => {
    render(<Riddle {...defaultProps} />)
    fireEvent.change(screen.getByPlaceholderText(/type your answer/i), {
      target: { value: 'clock' },
    })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    expect(screen.queryByPlaceholderText(/type your answer/i)).not.toBeInTheDocument()
  })

  it('submits on Enter key press', () => {
    const onAnswer = jest.fn()
    render(<Riddle {...defaultProps} onAnswer={onAnswer} />)
    const input = screen.getByPlaceholderText(/type your answer/i)
    fireEvent.change(input, { target: { value: 'clock' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onAnswer).toHaveBeenCalledWith('clock', true)
  })

  it('renders hints section when hints are provided', () => {
    render(
      <Riddle
        {...defaultProps}
        hints={['It ticks', 'It hangs on walls']}
      />
    )
    expect(screen.getByRole('button', { name: /get a hint/i })).toBeInTheDocument()
  })

  it('does not render hints section when no hints provided', () => {
    render(<Riddle {...defaultProps} />)
    expect(screen.queryByRole('button', { name: /get a hint/i })).not.toBeInTheDocument()
  })

  it('shows a hint when Get a hint button is clicked', () => {
    render(
      <Riddle
        {...defaultProps}
        hints={['It ticks', 'It hangs on walls']}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /get a hint/i }))
    expect(screen.getByText('It ticks')).toBeInTheDocument()
  })

  it('counts down remaining hints', () => {
    render(
      <Riddle
        {...defaultProps}
        hints={['Hint 1', 'Hint 2']}
      />
    )
    expect(screen.getByText(/2 remaining/i)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /get a hint/i }))
    expect(screen.getByText(/1 remaining/i)).toBeInTheDocument()
  })
})

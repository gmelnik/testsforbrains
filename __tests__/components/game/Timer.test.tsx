import React from 'react'
import { render, screen, act } from '@testing-library/react'
import { Timer } from '@/components/game/Timer'

beforeEach(() => {
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

describe('Timer', () => {
  it('displays the initial seconds', () => {
    render(<Timer seconds={30} onTimeUp={jest.fn()} />)
    expect(screen.getByText('30')).toBeInTheDocument()
  })

  it('counts down over time', () => {
    render(<Timer seconds={10} onTimeUp={jest.fn()} />)
    expect(screen.getByText('10')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('calls onTimeUp when timer reaches 0', () => {
    const onTimeUp = jest.fn()
    render(<Timer seconds={3} onTimeUp={onTimeUp} />)

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(onTimeUp).toHaveBeenCalledTimes(1)
  })

  it('stops counting when paused', () => {
    render(<Timer seconds={10} onTimeUp={jest.fn()} paused />)

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('shows "Hurry!" message when time is critical (≤10%)', () => {
    render(<Timer seconds={10} onTimeUp={jest.fn()} />)

    act(() => {
      jest.advanceTimersByTime(9000)
    })

    expect(screen.getByText('Hurry!')).toBeInTheDocument()
  })

  it('does not show "Hurry!" at the start', () => {
    render(<Timer seconds={30} onTimeUp={jest.fn()} />)
    expect(screen.queryByText('Hurry!')).not.toBeInTheDocument()
  })

  it('renders SVG circles for the timer ring', () => {
    const { container } = render(<Timer seconds={30} onTimeUp={jest.fn()} />)
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThanOrEqual(2)
  })
})

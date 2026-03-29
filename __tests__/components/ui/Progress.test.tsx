import React from 'react'
import { render, screen } from '@testing-library/react'
import { Progress } from '@/components/ui/Progress'

describe('Progress', () => {
  it('renders without crashing', () => {
    const { container } = render(<Progress value={50} />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it('calculates percentage correctly', () => {
    const { container } = render(<Progress value={50} max={100} />)
    const bar = container.querySelector('[style]')!
    expect(bar).toHaveStyle({ width: '50%' })
  })

  it('clamps to 100% when value exceeds max', () => {
    const { container } = render(<Progress value={150} max={100} />)
    const bar = container.querySelector('[style]')!
    expect(bar).toHaveStyle({ width: '100%' })
  })

  it('clamps to 0% when value is negative', () => {
    const { container } = render(<Progress value={-10} max={100} />)
    const bar = container.querySelector('[style]')!
    expect(bar).toHaveStyle({ width: '0%' })
  })

  it('uses max=100 by default', () => {
    const { container } = render(<Progress value={25} />)
    const bar = container.querySelector('[style]')!
    expect(bar).toHaveStyle({ width: '25%' })
  })

  it('shows label when showLabel is true', () => {
    render(<Progress value={30} max={100} showLabel />)
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('does not show label by default', () => {
    render(<Progress value={30} max={100} />)
    expect(screen.queryByText('30')).not.toBeInTheDocument()
  })

  it('applies sm size class', () => {
    const { container } = render(<Progress value={50} size="sm" />)
    const track = container.querySelector('.h-2')
    expect(track).toBeInTheDocument()
  })

  it('applies md size class (default)', () => {
    const { container } = render(<Progress value={50} />)
    const track = container.querySelector('.h-3')
    expect(track).toBeInTheDocument()
  })

  it('applies lg size class', () => {
    const { container } = render(<Progress value={50} size="lg" />)
    const track = container.querySelector('.h-4')
    expect(track).toBeInTheDocument()
  })

  it('applies xp variant styles', () => {
    const { container } = render(<Progress value={50} variant="xp" />)
    const bar = container.querySelector('[style]')!
    expect(bar.className).toMatch(/from-brain-400/)
  })

  it('applies streak variant styles', () => {
    const { container } = render(<Progress value={50} variant="streak" />)
    const bar = container.querySelector('[style]')!
    expect(bar.className).toMatch(/from-spark-400/)
  })

  it('applies success variant styles', () => {
    const { container } = render(<Progress value={50} variant="success" />)
    const bar = container.querySelector('[style]')!
    expect(bar.className).toMatch(/from-reward-400/)
  })

  it('merges custom className', () => {
    const { container } = render(<Progress value={50} className="custom-progress" />)
    expect(container.firstChild).toHaveClass('custom-progress')
  })

  it('handles custom max value', () => {
    const { container } = render(<Progress value={1} max={4} />)
    const bar = container.querySelector('[style]')!
    expect(bar).toHaveStyle({ width: '25%' })
  })
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>5 XP</Badge>)
    expect(screen.getByText('5 XP')).toBeInTheDocument()
  })

  it('defaults to default variant and md size', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge.className).toMatch(/bg-gray-100/)
    expect(badge.className).toMatch(/px-3/)
  })

  it('applies success variant styles', () => {
    render(<Badge variant="success">Done</Badge>)
    expect(screen.getByText('Done').className).toMatch(/bg-green-100/)
  })

  it('applies warning variant styles', () => {
    render(<Badge variant="warning">Warning</Badge>)
    expect(screen.getByText('Warning').className).toMatch(/bg-yellow-100/)
  })

  it('applies premium variant styles', () => {
    render(<Badge variant="premium">Premium</Badge>)
    expect(screen.getByText('Premium').className).toMatch(/from-amber-400/)
  })

  it('applies xp variant styles', () => {
    render(<Badge variant="xp">XP</Badge>)
    expect(screen.getByText('XP').className).toMatch(/from-brain-400/)
  })

  it('applies streak variant styles', () => {
    render(<Badge variant="streak">Streak</Badge>)
    expect(screen.getByText('Streak').className).toMatch(/from-spark-400/)
  })

  it('applies sm size styles', () => {
    render(<Badge size="sm">Small</Badge>)
    expect(screen.getByText('Small').className).toMatch(/px-2/)
  })

  it('applies lg size styles', () => {
    render(<Badge size="lg">Large</Badge>)
    expect(screen.getByText('Large').className).toMatch(/px-4/)
  })

  it('merges custom className', () => {
    render(<Badge className="custom-badge">Custom</Badge>)
    expect(screen.getByText('Custom').className).toMatch(/custom-badge/)
  })

  it('renders as a span element', () => {
    render(<Badge>Span</Badge>)
    expect(screen.getByText('Span').tagName).toBe('SPAN')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<Badge ref={ref}>Ref Badge</Badge>)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe('SPAN')
  })
})

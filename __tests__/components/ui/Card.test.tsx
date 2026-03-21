import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('defaults to default variant without hover', () => {
    render(<Card data-testid="card">Default</Card>)
    const card = screen.getByTestId('card')
    expect(card.className).toMatch(/border-gray-100/)
    expect(card.className).not.toMatch(/hover:scale/)
  })

  it('applies elevated variant styles', () => {
    render(<Card data-testid="card" variant="elevated">Elevated</Card>)
    expect(screen.getByTestId('card').className).toMatch(/shadow-lg/)
  })

  it('applies gradient variant styles', () => {
    render(<Card data-testid="card" variant="gradient">Gradient</Card>)
    expect(screen.getByTestId('card').className).toMatch(/bg-gradient-to-br/)
  })

  it('applies hover styles when hover prop is true', () => {
    render(<Card data-testid="card" hover>Hoverable</Card>)
    const card = screen.getByTestId('card')
    expect(card.className).toMatch(/hover:scale/)
    expect(card.className).toMatch(/cursor-pointer/)
  })

  it('does not apply hover styles when hover prop is false', () => {
    render(<Card data-testid="card" hover={false}>Not Hoverable</Card>)
    expect(screen.getByTestId('card').className).not.toMatch(/cursor-pointer/)
  })

  it('merges custom className', () => {
    render(<Card data-testid="card" className="custom-card">Custom</Card>)
    expect(screen.getByTestId('card').className).toMatch(/custom-card/)
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Card ref={ref}>Ref Card</Card>)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe('DIV')
  })
})

describe('CardHeader', () => {
  it('renders children', () => {
    render(<CardHeader>Header</CardHeader>)
    expect(screen.getByText('Header')).toBeInTheDocument()
  })

  it('applies default padding', () => {
    render(<CardHeader data-testid="header">Header</CardHeader>)
    expect(screen.getByTestId('header').className).toMatch(/p-6/)
  })
})

describe('CardContent', () => {
  it('renders children', () => {
    render(<CardContent>Content</CardContent>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies default padding', () => {
    render(<CardContent data-testid="content">Content</CardContent>)
    expect(screen.getByTestId('content').className).toMatch(/p-6/)
  })
})

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter>Footer</CardFooter>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('applies default padding', () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>)
    expect(screen.getByTestId('footer').className).toMatch(/p-6/)
  })
})

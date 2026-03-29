import React from 'react'
import { render, screen } from '@testing-library/react'
import { Avatar } from '@/components/ui/Avatar'

describe('Avatar', () => {
  it('renders default fox emoji when no props provided', () => {
    render(<Avatar />)
    expect(screen.getByText('🦊')).toBeInTheDocument()
  })

  it('renders provided emoji', () => {
    render(<Avatar emoji="🐻" />)
    expect(screen.getByText('🐻')).toBeInTheDocument()
  })

  it('renders image when imageUrl is provided', () => {
    render(<Avatar imageUrl="https://example.com/avatar.png" />)
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.png')
    expect(img).toHaveAttribute('alt', 'Avatar')
  })

  it('applies sm size styles', () => {
    const { container } = render(<Avatar emoji="🦊" size="sm" />)
    expect(container.firstChild).toHaveClass('w-8', 'h-8', 'text-lg')
  })

  it('applies md size styles (default)', () => {
    const { container } = render(<Avatar emoji="🦊" />)
    expect(container.firstChild).toHaveClass('w-12', 'h-12', 'text-2xl')
  })

  it('applies lg size styles', () => {
    const { container } = render(<Avatar emoji="🦊" size="lg" />)
    expect(container.firstChild).toHaveClass('w-16', 'h-16', 'text-3xl')
  })

  it('applies xl size styles', () => {
    const { container } = render(<Avatar emoji="🦊" size="xl" />)
    expect(container.firstChild).toHaveClass('w-24', 'h-24', 'text-5xl')
  })

  it('merges custom className', () => {
    const { container } = render(<Avatar emoji="🦊" className="custom-avatar" />)
    expect(container.firstChild).toHaveClass('custom-avatar')
  })

  it('image avatar applies correct size styles', () => {
    const { container } = render(
      <Avatar imageUrl="https://example.com/img.png" size="lg" />
    )
    expect(container.firstChild).toHaveClass('w-16', 'h-16')
  })
})

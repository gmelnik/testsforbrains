import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('renders label when label prop is provided', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('does not render label when label prop is absent', () => {
    render(<Input />)
    expect(screen.queryByRole('label')).not.toBeInTheDocument()
  })

  it('renders error message when error prop is provided', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('applies error styles to input when error prop is provided', () => {
    render(<Input error="Error!" />)
    const input = screen.getByRole('textbox')
    expect(input.className).toMatch(/border-red-500/)
  })

  it('defaults to text type', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
  })

  it('accepts email type', () => {
    render(<Input type="email" />)
    expect(document.querySelector('input[type="email"]')).toBeInTheDocument()
  })

  it('accepts password type', () => {
    render(<Input type="password" />)
    expect(document.querySelector('input[type="password"]')).toBeInTheDocument()
  })

  it('calls onChange handler on input', () => {
    const handleChange = jest.fn()
    render(<Input onChange={handleChange} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.tagName).toBe('INPUT')
  })

  it('merges custom className', () => {
    render(<Input className="custom-input" />)
    expect(document.querySelector('input')!.className).toMatch(/custom-input/)
  })

  it('passes additional props to the input element', () => {
    render(<Input required aria-label="Name" />)
    const input = document.querySelector('input')!
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('aria-label', 'Name')
  })
})

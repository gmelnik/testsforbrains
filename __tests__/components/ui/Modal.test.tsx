import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal'

describe('Modal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={jest.fn()}>
        <div>Modal content</div>
      </Modal>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('renders children when isOpen is true', () => {
    render(
      <Modal isOpen onClose={jest.fn()}>
        <div>Modal content</div>
      </Modal>
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn()
    const { container } = render(
      <Modal isOpen onClose={onClose}>
        <div>Content</div>
      </Modal>
    )
    // Backdrop is the div with absolute positioning (first child of fixed container)
    const backdrop = container.querySelector('.absolute.inset-0')!
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('applies sm size class', () => {
    const { container } = render(
      <Modal isOpen size="sm" onClose={jest.fn()}>
        Content
      </Modal>
    )
    const modalContent = container.querySelector('.relative')!
    expect(modalContent.className).toMatch(/max-w-sm/)
  })

  it('applies md size class (default)', () => {
    const { container } = render(
      <Modal isOpen onClose={jest.fn()}>
        Content
      </Modal>
    )
    const modalContent = container.querySelector('.relative')!
    expect(modalContent.className).toMatch(/max-w-md/)
  })

  it('applies lg size class', () => {
    const { container } = render(
      <Modal isOpen size="lg" onClose={jest.fn()}>
        Content
      </Modal>
    )
    const modalContent = container.querySelector('.relative')!
    expect(modalContent.className).toMatch(/max-w-lg/)
  })
})

describe('ModalHeader', () => {
  it('renders children', () => {
    render(<ModalHeader>Header Title</ModalHeader>)
    expect(screen.getByText('Header Title')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<ModalHeader className="custom-header">H</ModalHeader>)
    expect(container.firstChild).toHaveClass('custom-header')
  })
})

describe('ModalBody', () => {
  it('renders children', () => {
    render(<ModalBody>Body Text</ModalBody>)
    expect(screen.getByText('Body Text')).toBeInTheDocument()
  })

  it('applies default padding', () => {
    const { container } = render(<ModalBody>Body</ModalBody>)
    expect(container.firstChild).toHaveClass('p-6')
  })
})

describe('ModalFooter', () => {
  it('renders children', () => {
    render(<ModalFooter>Footer</ModalFooter>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('applies flex and justify-end styles', () => {
    const { container } = render(<ModalFooter>Footer</ModalFooter>)
    expect(container.firstChild).toHaveClass('flex', 'justify-end')
  })
})

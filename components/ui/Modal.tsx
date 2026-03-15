'use client'

import { Fragment, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ isOpen, onClose, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div
        className={cn(
          'relative w-full mx-4 bg-white rounded-2xl shadow-2xl',
          'animate-pop',
          sizes[size]
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pb-0', className)}>
      {children}
    </div>
  )
}

export function ModalBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  )
}

export function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pt-0 flex gap-3 justify-end', className)}>
      {children}
    </div>
  )
}

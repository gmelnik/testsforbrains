'use client'

import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'xp' | 'streak' | 'success'
  showLabel?: boolean
  className?: string
}

export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  className,
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  }

  const variants = {
    default: 'bg-gradient-to-r from-gray-400 to-gray-500',
    xp: 'bg-gradient-to-r from-brain-400 to-brain-600',
    streak: 'bg-gradient-to-r from-spark-400 to-spark-600',
    success: 'bg-gradient-to-r from-reward-400 to-reward-600',
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn(
          'w-full bg-gray-200 rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between mt-1 text-sm text-gray-600">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  )
}

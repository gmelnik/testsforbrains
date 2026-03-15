import { cn } from '@/lib/utils'

interface AvatarProps {
  emoji?: string
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({
  emoji,
  imageUrl,
  size = 'md',
  className,
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl',
  }

  if (imageUrl) {
    return (
      <div
        className={cn(
          'rounded-full overflow-hidden bg-gray-100',
          sizes[size],
          className
        )}
      >
        <img
          src={imageUrl}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center',
        'bg-gradient-to-br from-brain-100 to-spark-100',
        sizes[size],
        className
      )}
    >
      {emoji || '🦊'}
    </div>
  )
}

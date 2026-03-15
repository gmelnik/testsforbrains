import { Card, CardContent } from '@/components/ui'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  icon: string
  trend?: {
    value: number
    label: string
  }
  variant?: 'default' | 'xp' | 'streak' | 'success'
}

export function StatsCard({ title, value, icon, trend, variant = 'default' }: StatsCardProps) {
  const gradients = {
    default: 'from-gray-400 to-gray-500',
    xp: 'from-brain-400 to-brain-600',
    streak: 'from-spark-400 to-spark-600',
    success: 'from-reward-400 to-reward-600',
  }

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className={cn(
                'mt-1 text-sm font-medium',
                trend.value >= 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.value >= 0 ? '+' : ''}{trend.value} {trend.label}
              </p>
            )}
          </div>
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
            `bg-gradient-to-br ${gradients[variant]}`
          )}>
            <span className="filter drop-shadow-sm">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { CategoryInfo } from '@/types'

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'math',
    name: 'Math Games',
    description: 'Addition, subtraction, multiplication, and more!',
    icon: '🔢',
    color: 'text-blue-600',
    bgGradient: 'from-blue-400 to-blue-600',
  },
  {
    id: 'logic',
    name: 'Logic Puzzles',
    description: 'Train your brain with pattern recognition',
    icon: '🧩',
    color: 'text-purple-600',
    bgGradient: 'from-purple-400 to-purple-600',
  },
  {
    id: 'riddles',
    name: 'Riddles',
    description: 'Fun brain teasers and word puzzles',
    icon: '🤔',
    color: 'text-amber-600',
    bgGradient: 'from-amber-400 to-amber-600',
  },
  {
    id: 'brain-training',
    name: 'Brain Training',
    description: 'Memory, focus, and cognitive exercises',
    icon: '🧠',
    color: 'text-pink-600',
    bgGradient: 'from-pink-400 to-pink-600',
  },
  {
    id: 'cogat',
    name: 'CoGAT Prep',
    description: 'Practice for cognitive ability tests',
    icon: '📚',
    color: 'text-green-600',
    bgGradient: 'from-green-400 to-green-600',
  },
]

export const AVATARS = [
  '🦊', '🐻', '🐼', '🐨', '🦁',
  '🐯', '🐸', '🐵', '🦄', '🐲',
  '🦋', '🐬', '🦩', '🦜', '🐢',
]

export const DIFFICULTY_LABELS = {
  easy: { label: 'Easy', color: 'bg-green-100 text-green-700' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  hard: { label: 'Hard', color: 'bg-red-100 text-red-700' },
}

export const FREE_DAILY_LIMIT = 5

// User and Profile Types
export type UserRole = 'child' | 'parent' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  display_name: string
  avatar_url?: string
  age?: number
  grade_level?: number
  role: UserRole
  total_xp: number
  current_level: number
  current_streak: number
  longest_streak: number
  last_activity_date?: string
  created_at: string
  updated_at: string
}

export interface ParentChildRelationship {
  id: string
  parent_id: string
  child_id: string
  created_at: string
}

// Content Types
export type ContentCategory =
  | 'math'
  | 'logic'
  | 'riddles'
  | 'brain-training'
  | 'cogat'

export type ContentType =
  | 'multiple-choice'
  | 'pattern-puzzle'
  | 'riddle'
  | 'sequence'
  | 'timed-quiz'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface ContentItem {
  id: string
  title: string
  category: ContentCategory
  content_type: ContentType
  age_min: number
  age_max: number
  difficulty: Difficulty
  question: string
  // JSON field for flexible content structure
  content_data: ContentData
  correct_answer: string
  explanation?: string
  is_premium: boolean
  xp_reward: number
  time_limit_seconds?: number
  created_at: string
  updated_at: string
}

// Flexible content data structure for different question types
export interface ContentData {
  // For multiple choice
  options?: string[]
  // For pattern puzzles
  pattern?: string[]
  missing_index?: number
  // For sequences
  sequence?: (string | number)[]
  // For visual puzzles
  image_url?: string
  // For riddles
  hints?: string[]
}

// Game Session Types
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned'

export interface GameSession {
  id: string
  user_id: string
  content_id: string
  started_at: string
  completed_at?: string
  status: SessionStatus
  score: number
  xp_earned: number
  time_taken_seconds?: number
  created_at: string
}

export interface SessionAnswer {
  id: string
  session_id: string
  content_id: string
  user_answer: string
  is_correct: boolean
  time_taken_seconds?: number
  created_at: string
}

// Achievement Types
export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'streak' | 'xp' | 'completion' | 'mastery' | 'special'
  requirement_type: string
  requirement_value: number
  xp_reward: number
  is_premium: boolean
  created_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  earned_at: string
  achievement?: Achievement
}

// Subscription Types
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'trialing'
  | 'incomplete'

export type SubscriptionTier = 'free' | 'premium'

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  tier: SubscriptionTier
  status: SubscriptionStatus
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

// Progress and Stats Types
export interface ProgressSummary {
  id: string
  user_id: string
  category: ContentCategory
  total_attempts: number
  correct_answers: number
  total_xp: number
  average_time_seconds?: number
  last_played_at?: string
  created_at: string
  updated_at: string
}

export interface DailyStreak {
  id: string
  user_id: string
  date: string
  activities_completed: number
  xp_earned: number
  created_at: string
}

// UI Helper Types
export interface CategoryInfo {
  id: ContentCategory
  name: string
  description: string
  icon: string
  color: string
  bgGradient: string
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

// Daily Limits for Free Users
export const FREE_DAILY_LIMIT = 5
export const FREE_CATEGORIES_LIMIT = 2

// XP and Level Configuration
export const XP_PER_LEVEL = 100
export const STREAK_BONUS_MULTIPLIER = 1.5

// Calculate level from XP
export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

// Calculate XP progress within current level
export function calculateLevelProgress(xp: number): number {
  return xp % XP_PER_LEVEL
}

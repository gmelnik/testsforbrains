/**
 * Seed script for BrainSpark
 * Run with: npm run seed
 *
 * This script populates the database with sample content for testing.
 * Make sure to set up your .env.local file with Supabase credentials first.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample content data
const contentItems = [
  // MATH - Multiple Choice
  {
    title: 'Quick Addition',
    category: 'math',
    content_type: 'multiple-choice',
    age_min: 6,
    age_max: 8,
    difficulty: 'easy',
    question: 'What is 7 + 5?',
    content_data: {
      options: ['10', '11', '12', '13'],
    },
    correct_answer: '12',
    explanation: 'When we add 7 + 5, we can think of it as 7 + 3 + 2 = 10 + 2 = 12',
    is_premium: false,
    xp_reward: 10,
    time_limit_seconds: 30,
  },
  {
    title: 'Subtraction Challenge',
    category: 'math',
    content_type: 'multiple-choice',
    age_min: 6,
    age_max: 8,
    difficulty: 'easy',
    question: 'What is 15 - 8?',
    content_data: {
      options: ['5', '6', '7', '8'],
    },
    correct_answer: '7',
    explanation: '15 - 8 = 7. You can count backwards from 15: 14, 13, 12, 11, 10, 9, 8, 7!',
    is_premium: false,
    xp_reward: 10,
    time_limit_seconds: 30,
  },
  {
    title: 'Multiplication Fun',
    category: 'math',
    content_type: 'multiple-choice',
    age_min: 8,
    age_max: 10,
    difficulty: 'medium',
    question: 'What is 6 x 7?',
    content_data: {
      options: ['36', '42', '48', '49'],
    },
    correct_answer: '42',
    explanation: '6 x 7 = 42. A fun way to remember: 6 and 7 had a baby and they named it 42!',
    is_premium: false,
    xp_reward: 15,
    time_limit_seconds: 30,
  },
  {
    title: 'Division Detective',
    category: 'math',
    content_type: 'multiple-choice',
    age_min: 9,
    age_max: 12,
    difficulty: 'medium',
    question: 'What is 72 ÷ 8?',
    content_data: {
      options: ['7', '8', '9', '10'],
    },
    correct_answer: '9',
    explanation: '72 ÷ 8 = 9. Think: 8 x 9 = 72, so 72 divided by 8 equals 9.',
    is_premium: true,
    xp_reward: 20,
    time_limit_seconds: 45,
  },
  {
    title: 'Word Problem Wizard',
    category: 'math',
    content_type: 'multiple-choice',
    age_min: 8,
    age_max: 12,
    difficulty: 'hard',
    question: 'Sarah has 24 stickers. She wants to share them equally with 3 friends (including herself). How many stickers does each person get?',
    content_data: {
      options: ['4', '6', '8', '12'],
    },
    correct_answer: '6',
    explanation: 'Sarah and 3 friends = 4 people total. 24 ÷ 4 = 6 stickers each!',
    is_premium: true,
    xp_reward: 25,
    time_limit_seconds: 60,
  },

  // LOGIC - Pattern Puzzles
  {
    title: 'Shape Pattern',
    category: 'logic',
    content_type: 'pattern-puzzle',
    age_min: 6,
    age_max: 9,
    difficulty: 'easy',
    question: 'What comes next in the pattern?',
    content_data: {
      pattern: ['🔴', '🔵', '🔴', '🔵', '🔴', '?'],
      missing_index: 5,
      options: ['🔴', '🔵', '🟢', '🟡'],
    },
    correct_answer: '🔵',
    explanation: 'The pattern alternates between red and blue circles. Red, Blue, Red, Blue, Red... next is Blue!',
    is_premium: false,
    xp_reward: 10,
    time_limit_seconds: 45,
  },
  {
    title: 'Number Sequence',
    category: 'logic',
    content_type: 'pattern-puzzle',
    age_min: 7,
    age_max: 10,
    difficulty: 'medium',
    question: 'What number comes next?',
    content_data: {
      pattern: ['2', '4', '6', '8', '?'],
      missing_index: 4,
      options: ['9', '10', '11', '12'],
    },
    correct_answer: '10',
    explanation: 'Each number increases by 2. This is counting by 2s! 2, 4, 6, 8, 10...',
    is_premium: false,
    xp_reward: 15,
    time_limit_seconds: 45,
  },
  {
    title: 'Growing Pattern',
    category: 'logic',
    content_type: 'pattern-puzzle',
    age_min: 8,
    age_max: 12,
    difficulty: 'medium',
    question: 'Find the next element in the pattern.',
    content_data: {
      pattern: ['⭐', '⭐⭐', '⭐⭐⭐', '?'],
      missing_index: 3,
      options: ['⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
    },
    correct_answer: '⭐⭐⭐⭐',
    explanation: 'Each step adds one more star. 1 star, 2 stars, 3 stars, 4 stars!',
    is_premium: true,
    xp_reward: 20,
    time_limit_seconds: 45,
  },
  {
    title: 'Skip Counting',
    category: 'logic',
    content_type: 'pattern-puzzle',
    age_min: 9,
    age_max: 12,
    difficulty: 'hard',
    question: 'What comes next in this sequence?',
    content_data: {
      pattern: ['3', '6', '12', '24', '?'],
      missing_index: 4,
      options: ['36', '42', '48', '30'],
    },
    correct_answer: '48',
    explanation: 'Each number is double the previous one! 3 x 2 = 6, 6 x 2 = 12, 12 x 2 = 24, 24 x 2 = 48',
    is_premium: true,
    xp_reward: 25,
    time_limit_seconds: 60,
  },

  // RIDDLES
  {
    title: 'The Classic Riddle',
    category: 'riddles',
    content_type: 'riddle',
    age_min: 6,
    age_max: 12,
    difficulty: 'easy',
    question: 'I have hands but cannot clap. What am I?',
    content_data: {
      hints: [
        'I hang on the wall',
        'I tell you something important every day',
        'Tick tock, tick tock...',
      ],
    },
    correct_answer: 'clock',
    explanation: 'A clock has hands (the hour and minute hands) but cannot clap like real hands!',
    is_premium: false,
    xp_reward: 15,
  },
  {
    title: 'Animal Riddle',
    category: 'riddles',
    content_type: 'riddle',
    age_min: 6,
    age_max: 10,
    difficulty: 'easy',
    question: 'I have a tail and a head, but no body. What am I?',
    content_data: {
      hints: [
        'You might find me in your pocket',
        'I am made of metal',
        'Flip me to make a decision!',
      ],
    },
    correct_answer: 'coin',
    explanation: 'A coin has a "head" side and a "tail" side, but no actual body!',
    is_premium: false,
    xp_reward: 15,
  },
  {
    title: 'Tricky Words',
    category: 'riddles',
    content_type: 'riddle',
    age_min: 8,
    age_max: 12,
    difficulty: 'medium',
    question: 'The more you take, the more you leave behind. What are they?',
    content_data: {
      hints: [
        'Think about walking',
        'You make them when you move',
        'Look behind you on a sandy beach',
      ],
    },
    correct_answer: 'footsteps',
    explanation: 'When you walk, every step you "take" leaves a footstep behind you!',
    is_premium: true,
    xp_reward: 20,
  },
  {
    title: 'Mystery Object',
    category: 'riddles',
    content_type: 'riddle',
    age_min: 9,
    age_max: 12,
    difficulty: 'hard',
    question: 'I can fly without wings. I can cry without eyes. Wherever I go, darkness flies. What am I?',
    content_data: {
      hints: [
        'I am not an animal',
        'I form in the sky',
        'I block the sun',
      ],
    },
    correct_answer: 'cloud',
    explanation: 'Clouds float through the sky without wings, they "cry" rain without eyes, and when they pass, they create shadows (darkness flies)!',
    is_premium: true,
    xp_reward: 25,
  },

  // BRAIN TRAINING - Multiple Choice
  {
    title: 'Memory Match',
    category: 'brain-training',
    content_type: 'multiple-choice',
    age_min: 6,
    age_max: 10,
    difficulty: 'easy',
    question: 'If RED = 1, BLUE = 2, and GREEN = 3, what does BLUE + GREEN equal?',
    content_data: {
      options: ['3', '4', '5', '6'],
    },
    correct_answer: '5',
    explanation: 'BLUE = 2 and GREEN = 3, so 2 + 3 = 5!',
    is_premium: false,
    xp_reward: 15,
    time_limit_seconds: 30,
  },
  {
    title: 'Odd One Out',
    category: 'brain-training',
    content_type: 'multiple-choice',
    age_min: 6,
    age_max: 10,
    difficulty: 'easy',
    question: 'Which one does NOT belong? Apple, Banana, Carrot, Orange',
    content_data: {
      options: ['Apple', 'Banana', 'Carrot', 'Orange'],
    },
    correct_answer: 'Carrot',
    explanation: 'Apple, Banana, and Orange are all fruits. Carrot is a vegetable!',
    is_premium: false,
    xp_reward: 10,
    time_limit_seconds: 30,
  },
  {
    title: 'Reverse Thinking',
    category: 'brain-training',
    content_type: 'multiple-choice',
    age_min: 8,
    age_max: 12,
    difficulty: 'medium',
    question: 'If you spell "STOP" backwards, what word do you get?',
    content_data: {
      options: ['SPOT', 'TOPS', 'POTS', 'OPTS'],
    },
    correct_answer: 'POTS',
    explanation: 'S-T-O-P spelled backwards is P-O-T-S!',
    is_premium: true,
    xp_reward: 20,
    time_limit_seconds: 45,
  },

  // COGAT PREP
  {
    title: 'Figure Classification',
    category: 'cogat',
    content_type: 'multiple-choice',
    age_min: 6,
    age_max: 9,
    difficulty: 'easy',
    question: 'Look at these shapes: ⬜ ⬛ ⬜. Which shape completes the set? (All shapes are squares)',
    content_data: {
      options: ['🔴', '⬛', '🔺', '⭕'],
    },
    correct_answer: '⬛',
    explanation: 'The set contains only square shapes. The black square (⬛) fits because it is also a square!',
    is_premium: false,
    xp_reward: 15,
    time_limit_seconds: 45,
  },
  {
    title: 'Number Analogies',
    category: 'cogat',
    content_type: 'multiple-choice',
    age_min: 8,
    age_max: 12,
    difficulty: 'medium',
    question: '2 is to 4 as 5 is to ___?',
    content_data: {
      options: ['7', '8', '10', '15'],
    },
    correct_answer: '10',
    explanation: '2 doubled equals 4. Following the same pattern, 5 doubled equals 10!',
    is_premium: true,
    xp_reward: 20,
    time_limit_seconds: 45,
  },
  {
    title: 'Paper Folding',
    category: 'cogat',
    content_type: 'multiple-choice',
    age_min: 8,
    age_max: 12,
    difficulty: 'medium',
    question: 'If you fold a square paper in half, then cut a triangle from the folded edge, how many triangular holes will you see when unfolded?',
    content_data: {
      options: ['1', '2', '3', '4'],
    },
    correct_answer: '2',
    explanation: 'When you fold paper in half and cut a shape, you create a mirror image. One cut makes 2 holes!',
    is_premium: true,
    xp_reward: 25,
    time_limit_seconds: 60,
  },
  {
    title: 'Verbal Classification',
    category: 'cogat',
    content_type: 'multiple-choice',
    age_min: 9,
    age_max: 12,
    difficulty: 'hard',
    question: 'Dog, Cat, and Rabbit are all ___?',
    content_data: {
      options: ['Wild animals', 'Pets', 'Farm animals', 'Reptiles'],
    },
    correct_answer: 'Pets',
    explanation: 'Dogs, cats, and rabbits are all commonly kept as pets!',
    is_premium: true,
    xp_reward: 20,
    time_limit_seconds: 30,
  },
  {
    title: 'Sentence Completion',
    category: 'cogat',
    content_type: 'multiple-choice',
    age_min: 8,
    age_max: 12,
    difficulty: 'medium',
    question: 'Hot is to cold as day is to ___?',
    content_data: {
      options: ['Sun', 'Light', 'Night', 'Morning'],
    },
    correct_answer: 'Night',
    explanation: 'Hot and cold are opposites. Day and night are also opposites!',
    is_premium: false,
    xp_reward: 15,
    time_limit_seconds: 30,
  },
]

// Achievement data
const achievements = [
  {
    name: 'First Steps',
    description: 'Complete your first game',
    icon: '🎯',
    category: 'completion',
    requirement_type: 'games_completed',
    requirement_value: 1,
    xp_reward: 50,
    is_premium: false,
  },
  {
    name: 'Getting Started',
    description: 'Complete 10 games',
    icon: '🌟',
    category: 'completion',
    requirement_type: 'games_completed',
    requirement_value: 10,
    xp_reward: 100,
    is_premium: false,
  },
  {
    name: 'Dedicated Learner',
    description: 'Complete 50 games',
    icon: '📚',
    category: 'completion',
    requirement_type: 'games_completed',
    requirement_value: 50,
    xp_reward: 250,
    is_premium: false,
  },
  {
    name: 'Brain Champion',
    description: 'Complete 100 games',
    icon: '🏆',
    category: 'completion',
    requirement_type: 'games_completed',
    requirement_value: 100,
    xp_reward: 500,
    is_premium: true,
  },
  {
    name: 'Streak Starter',
    description: 'Achieve a 3-day streak',
    icon: '🔥',
    category: 'streak',
    requirement_type: 'streak_days',
    requirement_value: 3,
    xp_reward: 75,
    is_premium: false,
  },
  {
    name: 'On Fire',
    description: 'Achieve a 7-day streak',
    icon: '💪',
    category: 'streak',
    requirement_type: 'streak_days',
    requirement_value: 7,
    xp_reward: 150,
    is_premium: false,
  },
  {
    name: 'Unstoppable',
    description: 'Achieve a 30-day streak',
    icon: '⚡',
    category: 'streak',
    requirement_type: 'streak_days',
    requirement_value: 30,
    xp_reward: 500,
    is_premium: true,
  },
  {
    name: 'XP Hunter',
    description: 'Earn 500 XP',
    icon: '💎',
    category: 'xp',
    requirement_type: 'total_xp',
    requirement_value: 500,
    xp_reward: 100,
    is_premium: false,
  },
  {
    name: 'XP Master',
    description: 'Earn 2000 XP',
    icon: '👑',
    category: 'xp',
    requirement_type: 'total_xp',
    requirement_value: 2000,
    xp_reward: 300,
    is_premium: true,
  },
  {
    name: 'Math Whiz',
    description: 'Complete 20 math games with 80%+ accuracy',
    icon: '🔢',
    category: 'mastery',
    requirement_type: 'math_mastery',
    requirement_value: 20,
    xp_reward: 200,
    is_premium: true,
  },
  {
    name: 'Logic Legend',
    description: 'Complete 20 logic puzzles with 80%+ accuracy',
    icon: '🧩',
    category: 'mastery',
    requirement_type: 'logic_mastery',
    requirement_value: 20,
    xp_reward: 200,
    is_premium: true,
  },
  {
    name: 'Riddle Master',
    description: 'Solve 15 riddles correctly',
    icon: '🤔',
    category: 'mastery',
    requirement_type: 'riddles_solved',
    requirement_value: 15,
    xp_reward: 200,
    is_premium: true,
  },
]

async function seed() {
  console.log('🌱 Starting database seed...')

  // Insert content items
  console.log('📝 Inserting content items...')
  const { data: contentData, error: contentError } = await supabase
    .from('content_items')
    .insert(contentItems)
    .select()

  if (contentError) {
    console.error('Error inserting content:', contentError)
  } else {
    console.log(`✅ Inserted ${contentData.length} content items`)
  }

  // Insert achievements
  console.log('🏆 Inserting achievements...')
  const { data: achievementData, error: achievementError } = await supabase
    .from('achievements')
    .insert(achievements)
    .select()

  if (achievementError) {
    console.error('Error inserting achievements:', achievementError)
  } else {
    console.log(`✅ Inserted ${achievementData.length} achievements`)
  }

  console.log('🎉 Seed completed!')
}

seed().catch(console.error)

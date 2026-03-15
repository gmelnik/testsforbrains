-- BrainSpark Seed Data
-- Run this after schema.sql to populate initial content

-- Insert sample content items
INSERT INTO content_items (title, category, content_type, age_min, age_max, difficulty, question, content_data, correct_answer, explanation, is_premium, xp_reward, time_limit_seconds) VALUES

-- MATH - Multiple Choice
('Quick Addition', 'math', 'multiple-choice', 6, 8, 'easy',
 'What is 7 + 5?',
 '{"options": ["10", "11", "12", "13"]}',
 '12',
 'When we add 7 + 5, we can think of it as 7 + 3 + 2 = 10 + 2 = 12',
 false, 10, 30),

('Subtraction Challenge', 'math', 'multiple-choice', 6, 8, 'easy',
 'What is 15 - 8?',
 '{"options": ["5", "6", "7", "8"]}',
 '7',
 '15 - 8 = 7. You can count backwards from 15: 14, 13, 12, 11, 10, 9, 8, 7!',
 false, 10, 30),

('Multiplication Fun', 'math', 'multiple-choice', 8, 10, 'medium',
 'What is 6 x 7?',
 '{"options": ["36", "42", "48", "49"]}',
 '42',
 '6 x 7 = 42. A fun way to remember: 6 and 7 had a baby and they named it 42!',
 false, 15, 30),

('Division Detective', 'math', 'multiple-choice', 9, 12, 'medium',
 'What is 72 ÷ 8?',
 '{"options": ["7", "8", "9", "10"]}',
 '9',
 '72 ÷ 8 = 9. Think: 8 x 9 = 72, so 72 divided by 8 equals 9.',
 true, 20, 45),

('Word Problem Wizard', 'math', 'multiple-choice', 8, 12, 'hard',
 'Sarah has 24 stickers. She wants to share them equally with 3 friends (including herself). How many stickers does each person get?',
 '{"options": ["4", "6", "8", "12"]}',
 '6',
 'Sarah and 3 friends = 4 people total. 24 ÷ 4 = 6 stickers each!',
 true, 25, 60),

-- LOGIC - Pattern Puzzles
('Shape Pattern', 'logic', 'pattern-puzzle', 6, 9, 'easy',
 'What comes next in the pattern?',
 '{"pattern": ["🔴", "🔵", "🔴", "🔵", "🔴", "?"], "missing_index": 5, "options": ["🔴", "🔵", "🟢", "🟡"]}',
 '🔵',
 'The pattern alternates between red and blue circles. Red, Blue, Red, Blue, Red... next is Blue!',
 false, 10, 45),

('Number Sequence', 'logic', 'pattern-puzzle', 7, 10, 'medium',
 'What number comes next?',
 '{"pattern": ["2", "4", "6", "8", "?"], "missing_index": 4, "options": ["9", "10", "11", "12"]}',
 '10',
 'Each number increases by 2. This is counting by 2s! 2, 4, 6, 8, 10...',
 false, 15, 45),

('Growing Pattern', 'logic', 'pattern-puzzle', 8, 12, 'medium',
 'Find the next element in the pattern.',
 '{"pattern": ["⭐", "⭐⭐", "⭐⭐⭐", "?"], "missing_index": 3, "options": ["⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]}',
 '⭐⭐⭐⭐',
 'Each step adds one more star. 1 star, 2 stars, 3 stars, 4 stars!',
 true, 20, 45),

('Skip Counting', 'logic', 'pattern-puzzle', 9, 12, 'hard',
 'What comes next in this sequence?',
 '{"pattern": ["3", "6", "12", "24", "?"], "missing_index": 4, "options": ["36", "42", "48", "30"]}',
 '48',
 'Each number is double the previous one! 3 x 2 = 6, 6 x 2 = 12, 12 x 2 = 24, 24 x 2 = 48',
 true, 25, 60),

-- RIDDLES
('The Classic Riddle', 'riddles', 'riddle', 6, 12, 'easy',
 'I have hands but cannot clap. What am I?',
 '{"hints": ["I hang on the wall", "I tell you something important every day", "Tick tock, tick tock..."]}',
 'clock',
 'A clock has hands (the hour and minute hands) but cannot clap like real hands!',
 false, 15, NULL),

('Animal Riddle', 'riddles', 'riddle', 6, 10, 'easy',
 'I have a tail and a head, but no body. What am I?',
 '{"hints": ["You might find me in your pocket", "I am made of metal", "Flip me to make a decision!"]}',
 'coin',
 'A coin has a "head" side and a "tail" side, but no actual body!',
 false, 15, NULL),

('Tricky Words', 'riddles', 'riddle', 8, 12, 'medium',
 'The more you take, the more you leave behind. What are they?',
 '{"hints": ["Think about walking", "You make them when you move", "Look behind you on a sandy beach"]}',
 'footsteps',
 'When you walk, every step you "take" leaves a footstep behind you!',
 true, 20, NULL),

('Mystery Object', 'riddles', 'riddle', 9, 12, 'hard',
 'I can fly without wings. I can cry without eyes. Wherever I go, darkness flies. What am I?',
 '{"hints": ["I am not an animal", "I form in the sky", "I block the sun"]}',
 'cloud',
 'Clouds float through the sky without wings, they "cry" rain without eyes, and when they pass, they create shadows!',
 true, 25, NULL),

-- BRAIN TRAINING
('Memory Match', 'brain-training', 'multiple-choice', 6, 10, 'easy',
 'If RED = 1, BLUE = 2, and GREEN = 3, what does BLUE + GREEN equal?',
 '{"options": ["3", "4", "5", "6"]}',
 '5',
 'BLUE = 2 and GREEN = 3, so 2 + 3 = 5!',
 false, 15, 30),

('Odd One Out', 'brain-training', 'multiple-choice', 6, 10, 'easy',
 'Which one does NOT belong? Apple, Banana, Carrot, Orange',
 '{"options": ["Apple", "Banana", "Carrot", "Orange"]}',
 'Carrot',
 'Apple, Banana, and Orange are all fruits. Carrot is a vegetable!',
 false, 10, 30),

('Reverse Thinking', 'brain-training', 'multiple-choice', 8, 12, 'medium',
 'If you spell "STOP" backwards, what word do you get?',
 '{"options": ["SPOT", "TOPS", "POTS", "OPTS"]}',
 'POTS',
 'S-T-O-P spelled backwards is P-O-T-S!',
 true, 20, 45),

-- COGAT PREP
('Figure Classification', 'cogat', 'multiple-choice', 6, 9, 'easy',
 'Look at these shapes: ⬜ ⬛ ⬜. Which shape completes the set? (All shapes are squares)',
 '{"options": ["🔴", "⬛", "🔺", "⭕"]}',
 '⬛',
 'The set contains only square shapes. The black square (⬛) fits because it is also a square!',
 false, 15, 45),

('Number Analogies', 'cogat', 'multiple-choice', 8, 12, 'medium',
 '2 is to 4 as 5 is to ___?',
 '{"options": ["7", "8", "10", "15"]}',
 '10',
 '2 doubled equals 4. Following the same pattern, 5 doubled equals 10!',
 true, 20, 45),

('Paper Folding', 'cogat', 'multiple-choice', 8, 12, 'medium',
 'If you fold a square paper in half, then cut a triangle from the folded edge, how many triangular holes will you see when unfolded?',
 '{"options": ["1", "2", "3", "4"]}',
 '2',
 'When you fold paper in half and cut a shape, you create a mirror image. One cut makes 2 holes!',
 true, 25, 60),

('Verbal Classification', 'cogat', 'multiple-choice', 9, 12, 'hard',
 'Dog, Cat, and Rabbit are all ___?',
 '{"options": ["Wild animals", "Pets", "Farm animals", "Reptiles"]}',
 'Pets',
 'Dogs, cats, and rabbits are all commonly kept as pets!',
 true, 20, 30),

('Sentence Completion', 'cogat', 'multiple-choice', 8, 12, 'medium',
 'Hot is to cold as day is to ___?',
 '{"options": ["Sun", "Light", "Night", "Morning"]}',
 'Night',
 'Hot and cold are opposites. Day and night are also opposites!',
 false, 15, 30);

-- Insert achievements
INSERT INTO achievements (name, description, icon, category, requirement_type, requirement_value, xp_reward, is_premium) VALUES
('First Steps', 'Complete your first game', '🎯', 'completion', 'games_completed', 1, 50, false),
('Getting Started', 'Complete 10 games', '🌟', 'completion', 'games_completed', 10, 100, false),
('Dedicated Learner', 'Complete 50 games', '📚', 'completion', 'games_completed', 50, 250, false),
('Brain Champion', 'Complete 100 games', '🏆', 'completion', 'games_completed', 100, 500, true),
('Streak Starter', 'Achieve a 3-day streak', '🔥', 'streak', 'streak_days', 3, 75, false),
('On Fire', 'Achieve a 7-day streak', '💪', 'streak', 'streak_days', 7, 150, false),
('Unstoppable', 'Achieve a 30-day streak', '⚡', 'streak', 'streak_days', 30, 500, true),
('XP Hunter', 'Earn 500 XP', '💎', 'xp', 'total_xp', 500, 100, false),
('XP Master', 'Earn 2000 XP', '👑', 'xp', 'total_xp', 2000, 300, true),
('Math Whiz', 'Complete 20 math games with 80%+ accuracy', '🔢', 'mastery', 'math_mastery', 20, 200, true),
('Logic Legend', 'Complete 20 logic puzzles with 80%+ accuracy', '🧩', 'mastery', 'logic_mastery', 20, 200, true),
('Riddle Master', 'Solve 15 riddles correctly', '🤔', 'mastery', 'riddles_solved', 15, 200, true);

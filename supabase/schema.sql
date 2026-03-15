-- BrainSpark Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('child', 'parent', 'admin');
CREATE TYPE content_category AS ENUM ('math', 'logic', 'riddles', 'brain-training', 'cogat');
CREATE TYPE content_type AS ENUM ('multiple-choice', 'pattern-puzzle', 'riddle', 'sequence', 'timed-quiz');
CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE session_status AS ENUM ('in_progress', 'completed', 'abandoned');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'incomplete');
CREATE TYPE subscription_tier AS ENUM ('free', 'premium');
CREATE TYPE achievement_category AS ENUM ('streak', 'xp', 'completion', 'mastery', 'special');

-- ============================================
-- PROFILES TABLE
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  age INTEGER CHECK (age >= 1 AND age <= 100),
  grade_level INTEGER CHECK (grade_level >= 0 AND grade_level <= 12),
  role user_role NOT NULL DEFAULT 'child',
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PARENT-CHILD RELATIONSHIPS
-- ============================================

CREATE TABLE parent_child_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(parent_id, child_id)
);

-- ============================================
-- CONTENT ITEMS
-- ============================================

CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category content_category NOT NULL,
  content_type content_type NOT NULL,
  age_min INTEGER NOT NULL DEFAULT 6,
  age_max INTEGER NOT NULL DEFAULT 12,
  difficulty difficulty_level NOT NULL DEFAULT 'easy',
  question TEXT NOT NULL,
  content_data JSONB NOT NULL DEFAULT '{}',
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  time_limit_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for content queries
CREATE INDEX idx_content_category ON content_items(category);
CREATE INDEX idx_content_difficulty ON content_items(difficulty);
CREATE INDEX idx_content_premium ON content_items(is_premium);
CREATE INDEX idx_content_age_range ON content_items(age_min, age_max);

-- ============================================
-- GAME SESSIONS
-- ============================================

CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status session_status NOT NULL DEFAULT 'in_progress',
  score INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON game_sessions(user_id);
CREATE INDEX idx_sessions_status ON game_sessions(status);
CREATE INDEX idx_sessions_date ON game_sessions(created_at);

-- ============================================
-- SESSION ANSWERS
-- ============================================

CREATE TABLE session_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES game_sessions(id) ON DELETE CASCADE NOT NULL,
  content_id UUID REFERENCES content_items(id) ON DELETE CASCADE NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_answers_session ON session_answers(session_id);

-- ============================================
-- ACHIEVEMENTS
-- ============================================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category achievement_category NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  tier subscription_tier NOT NULL DEFAULT 'free',
  status subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_stripe ON subscriptions(stripe_customer_id);

-- ============================================
-- PROGRESS SUMMARIES (per category)
-- ============================================

CREATE TABLE progress_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category content_category NOT NULL,
  total_attempts INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_xp INTEGER NOT NULL DEFAULT 0,
  average_time_seconds INTEGER,
  last_played_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, category)
);

CREATE INDEX idx_progress_user ON progress_summaries(user_id);

-- ============================================
-- DAILY STREAKS
-- ============================================

CREATE TABLE daily_streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  activities_completed INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_streaks_user_date ON daily_streaks(user_id, date);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_child_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_streaks ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Parents can view their children's profiles
CREATE POLICY "Parents can view children profiles" ON profiles
  FOR SELECT USING (
    id IN (
      SELECT child_id FROM parent_child_relationships
      WHERE parent_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

-- Content: Everyone can read content
CREATE POLICY "Anyone can view content" ON content_items
  FOR SELECT USING (true);

-- Game Sessions: Users can manage their own sessions
CREATE POLICY "Users can view own sessions" ON game_sessions
  FOR SELECT USING (
    user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create sessions" ON game_sessions
  FOR INSERT WITH CHECK (
    user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own sessions" ON game_sessions
  FOR UPDATE USING (
    user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Parents can view children's sessions
CREATE POLICY "Parents can view children sessions" ON game_sessions
  FOR SELECT USING (
    user_id IN (
      SELECT child_id FROM parent_child_relationships
      WHERE parent_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

-- Session Answers: Users can manage their own answers
CREATE POLICY "Users can view own answers" ON session_answers
  FOR SELECT USING (
    session_id IN (
      SELECT id FROM game_sessions
      WHERE user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create answers" ON session_answers
  FOR INSERT WITH CHECK (
    session_id IN (
      SELECT id FROM game_sessions
      WHERE user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

-- Achievements: Everyone can view achievements
CREATE POLICY "Anyone can view achievements" ON achievements
  FOR SELECT USING (true);

-- User Achievements: Users can view their own
CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (
    user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can earn achievements" ON user_achievements
  FOR INSERT WITH CHECK (
    user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Subscriptions: Users can view their own
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (
    user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Progress: Users can manage their own progress
CREATE POLICY "Users can view own progress" ON progress_summaries
  FOR SELECT USING (
    user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own progress" ON progress_summaries
  FOR ALL USING (
    user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Parents can view children's progress
CREATE POLICY "Parents can view children progress" ON progress_summaries
  FOR SELECT USING (
    user_id IN (
      SELECT child_id FROM parent_child_relationships
      WHERE parent_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
    )
  );

-- Streaks: Users can manage their own
CREATE POLICY "Users can manage own streaks" ON daily_streaks
  FOR ALL USING (
    user_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- Parent-child relationships
CREATE POLICY "Parents can view relationships" ON parent_child_relationships
  FOR SELECT USING (
    parent_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Parents can create relationships" ON parent_child_relationships
  FOR INSERT WITH CHECK (
    parent_id = (SELECT id FROM profiles WHERE user_id = auth.uid())
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, display_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Player'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'child')
  );

  -- Create free subscription for new user
  INSERT INTO subscriptions (user_id, tier, status)
  VALUES (
    (SELECT id FROM profiles WHERE user_id = NEW.id),
    'free',
    'active'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
  v_last_date DATE;
  v_today DATE := CURRENT_DATE;
  v_current_streak INTEGER;
BEGIN
  SELECT last_activity_date, current_streak INTO v_last_date, v_current_streak
  FROM profiles WHERE id = p_user_id;

  IF v_last_date IS NULL OR v_last_date < v_today - 1 THEN
    -- Reset streak
    UPDATE profiles SET current_streak = 1, last_activity_date = v_today WHERE id = p_user_id;
  ELSIF v_last_date = v_today - 1 THEN
    -- Increment streak
    UPDATE profiles SET
      current_streak = current_streak + 1,
      longest_streak = GREATEST(longest_streak, current_streak + 1),
      last_activity_date = v_today
    WHERE id = p_user_id;
  ELSIF v_last_date = v_today THEN
    -- Same day, no change needed
    NULL;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add XP and level up
CREATE OR REPLACE FUNCTION add_user_xp(p_user_id UUID, p_xp INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET
    total_xp = total_xp + p_xp,
    current_level = (total_xp + p_xp) / 100 + 1,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check daily game limit for free users
CREATE OR REPLACE FUNCTION check_daily_limit(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_tier subscription_tier;
  v_today_count INTEGER;
BEGIN
  SELECT tier INTO v_tier FROM subscriptions WHERE user_id = p_user_id;

  IF v_tier = 'premium' THEN
    RETURN -1; -- Unlimited
  END IF;

  SELECT COUNT(*) INTO v_today_count
  FROM game_sessions
  WHERE user_id = p_user_id
    AND DATE(created_at) = CURRENT_DATE
    AND status = 'completed';

  RETURN 5 - v_today_count; -- 5 free games per day
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

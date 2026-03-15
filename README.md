# BrainSpark - Kids Learning Platform

**Play Smart. Grow Smarter.**

BrainSpark is a fun, game-based learning platform for kids ages 6-12. It features math games, logic puzzles, riddles, brain training exercises, and CoGAT prep - all designed to make learning feel like play.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Payments:** Stripe
- **Deployment:** Vercel-ready

## Features

### For Kids
- 5 categories: Math, Logic, Riddles, Brain Training, CoGAT Prep
- XP and leveling system
- Daily streak tracking
- Achievement badges
- Fun, colorful UI designed for engagement

### For Parents
- Progress dashboard
- Skill breakdowns by category
- Activity history
- Performance analytics

### Business Model
- **Free Tier:** 5 games/day, basic progress tracking, 2 categories
- **Premium ($9.99/mo):** Unlimited games, full library, detailed analytics

## Local Setup

### Prerequisites

- Node.js 18+
- A Supabase account (free tier works)
- (Optional) Stripe account for payments

### 1. Clone and Install

```bash
cd testsforbrains
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Copy your project credentials from **Settings > API**

### 3. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional - for payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Seed the Database

```bash
npm run seed
```

This populates the database with sample games, puzzles, and achievements.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/app                    # Next.js App Router pages
  /api                  # API routes
    /auth/callback      # Supabase auth callback
    /stripe             # Stripe checkout
    /webhooks           # Stripe webhooks
  /dashboard            # User dashboard
  /login                # Login page
  /signup               # Signup flow
  /play                 # Game listing
  /play/[id]            # Individual game
  /parent               # Parent dashboard
  /pricing              # Subscription plans
  /profile              # User profile

/components             # React components
  /ui                   # Base UI components
  /game                 # Game-specific components
  /dashboard            # Dashboard widgets
  /layout               # Navbar, Footer

/lib                    # Utilities
  /supabase             # Supabase clients
  /stripe               # Stripe helpers
  /utils                # Constants, helpers

/contexts               # React contexts
/hooks                  # Custom hooks
/types                  # TypeScript types
/supabase               # Database schema
/scripts                # Seed scripts
```

## Database Schema

### Core Tables

- `profiles` - User profiles (child/parent/admin)
- `content_items` - Games, puzzles, riddles
- `game_sessions` - Game play records
- `session_answers` - Individual answers
- `achievements` - Achievement definitions
- `user_achievements` - Earned achievements
- `subscriptions` - Premium subscriptions
- `progress_summaries` - Per-category progress
- `daily_streaks` - Streak tracking
- `parent_child_relationships` - Family linking

## Content Types

1. **Multiple Choice** - Math problems, verbal questions
2. **Pattern Puzzle** - Visual sequences
3. **Riddle** - Free-form text answers
4. **Sequence** - Number/shape patterns
5. **Timed Quiz** - Speed challenges

## Stripe Setup (Optional)

For payment functionality:

1. Create products in Stripe Dashboard:
   - Monthly plan ($9.99/month)
   - Yearly plan ($79.99/year)

2. Add price IDs to `.env.local`:
   ```env
   STRIPE_MONTHLY_PRICE_ID=price_xxx
   STRIPE_YEARLY_PRICE_ID=price_xxx
   ```

3. Set up webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_failed`

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## What to Build Next

### Phase 2 Features
- [ ] Leaderboards
- [ ] Social sharing
- [ ] More game types (drag-drop, drawing)
- [ ] Adaptive difficulty
- [ ] Timed practice tests
- [ ] Sound effects and music

### Phase 3 Features
- [ ] Mobile app (React Native)
- [ ] Teacher/classroom accounts
- [ ] Custom content creation
- [ ] AI-generated questions
- [ ] Multiplayer challenges
- [ ] Video explanations

## License

MIT

---

Built with care for curious minds everywhere.

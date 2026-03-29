import {
  calculateLevel,
  calculateLevelProgress,
  XP_PER_LEVEL,
  FREE_DAILY_LIMIT,
  FREE_CATEGORIES_LIMIT,
  STREAK_BONUS_MULTIPLIER,
} from '@/types'

describe('XP_PER_LEVEL', () => {
  it('equals 100', () => {
    expect(XP_PER_LEVEL).toBe(100)
  })
})

describe('FREE_DAILY_LIMIT', () => {
  it('equals 5', () => {
    expect(FREE_DAILY_LIMIT).toBe(5)
  })
})

describe('BONUS_LEVEL', () => {
  it('equals 10', () => {
    expect(BONUS_LEVEL).toBe(10)
  })
})

describe('FREE_CATEGORIES_LIMIT', () => {
  it('equals 2', () => {
    expect(FREE_CATEGORIES_LIMIT).toBe(2)
  })
})

describe('STREAK_BONUS_MULTIPLIER', () => {
  it('equals 1.5', () => {
    expect(STREAK_BONUS_MULTIPLIER).toBe(1.5)
  })
})

describe('calculateLevel', () => {
  it('returns level 1 for 0 XP', () => {
    expect(calculateLevel(0)).toBe(1)
  })

  it('returns level 1 for XP below threshold', () => {
    expect(calculateLevel(99)).toBe(1)
  })

  it('returns level 2 at exactly XP_PER_LEVEL', () => {
    expect(calculateLevel(XP_PER_LEVEL)).toBe(2)
  })

  it('returns level 2 for XP in second level range', () => {
    expect(calculateLevel(150)).toBe(2)
  })

  it('returns level 3 at 200 XP', () => {
    expect(calculateLevel(200)).toBe(3)
  })

  it('returns level 11 at 1000 XP', () => {
    expect(calculateLevel(1000)).toBe(11)
  })

  it('scales linearly with XP', () => {
    expect(calculateLevel(500)).toBe(6)
    expect(calculateLevel(900)).toBe(10)
  })
})

describe('calculateLevelProgress', () => {
  it('returns 0 for 0 XP', () => {
    expect(calculateLevelProgress(0)).toBe(0)
  })

  it('returns 50 for 50 XP', () => {
    expect(calculateLevelProgress(50)).toBe(50)
  })

  it('returns 0 when XP is exactly at level boundary', () => {
    expect(calculateLevelProgress(100)).toBe(0)
    expect(calculateLevelProgress(200)).toBe(0)
  })

  it('returns remaining progress within current level', () => {
    expect(calculateLevelProgress(150)).toBe(50)
    expect(calculateLevelProgress(275)).toBe(75)
  })

  it('is always less than XP_PER_LEVEL', () => {
    const testValues = [0, 50, 99, 100, 199, 200, 999]
    for (const xp of testValues) {
      expect(calculateLevelProgress(xp)).toBeLessThan(XP_PER_LEVEL)
    }
  })

  it('is always non-negative', () => {
    expect(calculateLevelProgress(0)).toBeGreaterThanOrEqual(0)
    expect(calculateLevelProgress(350)).toBeGreaterThanOrEqual(0)
  })
})

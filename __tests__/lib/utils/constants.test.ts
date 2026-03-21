import {
  CATEGORIES,
  AVATARS,
  DIFFICULTY_LABELS,
  FREE_DAILY_LIMIT,
} from '@/lib/utils/constants'

describe('CATEGORIES', () => {
  it('has exactly 5 categories', () => {
    expect(CATEGORIES).toHaveLength(5)
  })

  it('includes expected category ids', () => {
    const ids = CATEGORIES.map((c) => c.id)
    expect(ids).toContain('math')
    expect(ids).toContain('logic')
    expect(ids).toContain('riddles')
    expect(ids).toContain('brain-training')
    expect(ids).toContain('cogat')
  })

  it('every category has required fields', () => {
    for (const category of CATEGORIES) {
      expect(category).toHaveProperty('id')
      expect(category).toHaveProperty('name')
      expect(category).toHaveProperty('description')
      expect(category).toHaveProperty('icon')
      expect(category).toHaveProperty('color')
      expect(category).toHaveProperty('bgGradient')
    }
  })

  it('category names are non-empty strings', () => {
    for (const category of CATEGORIES) {
      expect(typeof category.name).toBe('string')
      expect(category.name.length).toBeGreaterThan(0)
    }
  })
})

describe('AVATARS', () => {
  it('has 15 avatars', () => {
    expect(AVATARS).toHaveLength(15)
  })

  it('all avatars are non-empty strings', () => {
    for (const avatar of AVATARS) {
      expect(typeof avatar).toBe('string')
      expect(avatar.length).toBeGreaterThan(0)
    }
  })
})

describe('DIFFICULTY_LABELS', () => {
  it('has easy, medium, and hard levels', () => {
    expect(DIFFICULTY_LABELS).toHaveProperty('easy')
    expect(DIFFICULTY_LABELS).toHaveProperty('medium')
    expect(DIFFICULTY_LABELS).toHaveProperty('hard')
  })

  it('each level has label and color', () => {
    for (const level of Object.values(DIFFICULTY_LABELS)) {
      expect(level).toHaveProperty('label')
      expect(level).toHaveProperty('color')
    }
  })

  it('easy label reads "Easy"', () => {
    expect(DIFFICULTY_LABELS.easy.label).toBe('Easy')
  })

  it('medium label reads "Medium"', () => {
    expect(DIFFICULTY_LABELS.medium.label).toBe('Medium')
  })

  it('hard label reads "Hard"', () => {
    expect(DIFFICULTY_LABELS.hard.label).toBe('Hard')
  })
})

describe('FREE_DAILY_LIMIT', () => {
  it('is 5', () => {
    expect(FREE_DAILY_LIMIT).toBe(5)
  })

  it('is a positive number', () => {
    expect(FREE_DAILY_LIMIT).toBeGreaterThan(0)
  })
})

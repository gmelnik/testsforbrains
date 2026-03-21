import { cn } from '@/lib/utils/cn'

describe('cn', () => {
  it('returns a single class name unchanged', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('merges multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('ignores falsy values', () => {
    expect(cn('foo', false, undefined, null, '')).toBe('foo')
  })

  it('merges conflicting Tailwind classes correctly', () => {
    // tailwind-merge resolves conflicts by keeping the last one
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('handles conditional classes', () => {
    expect(cn('base', { active: true, inactive: false })).toBe('base active')
  })

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz')
  })

  it('returns empty string when no valid classes are provided', () => {
    expect(cn(false, null, undefined)).toBe('')
  })
})

import { describe, expect, it } from 'vitest'
import { isValidEmail, isValidName, isValidRole, sanitizeText } from './sanitize'

describe('sanitizeText', () => {
  it('strips HTML tags', () => {
    expect(sanitizeText('<script>alert(1)</script>Alice')).toBe('alert(1)Alice')
  })

  it('trims surrounding whitespace', () => {
    expect(sanitizeText('  Alice  ')).toBe('Alice')
  })

  it('removes control characters', () => {
    expect(sanitizeText('Alice\u0000\u001f')).toBe('Alice')
  })
})

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('alice@example.com')).toBe(true)
  })

  it('rejects an email with no domain', () => {
    expect(isValidEmail('alice@')).toBe(false)
  })

  it('rejects an email with no @', () => {
    expect(isValidEmail('alice.example.com')).toBe(false)
  })
})

describe('isValidName', () => {
  it('accepts letters, spaces and hyphens', () => {
    expect(isValidName('Anne-Marie')).toBe(true)
  })

  it('rejects a name starting with a digit', () => {
    expect(isValidName('1Alice')).toBe(false)
  })

  it('rejects an empty string', () => {
    expect(isValidName('')).toBe(false)
  })
})

describe('isValidRole', () => {
  it('accepts a normal job title', () => {
    expect(isValidRole('Frontend Developer')).toBe(true)
  })

  it('rejects a single character', () => {
    expect(isValidRole('A')).toBe(false)
  })
})

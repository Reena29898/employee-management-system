import { describe, expect, it } from 'vitest'
import { isValidEmail, isValidName, isValidRole, sanitizeText } from './sanitize'

describe('sanitizeText', () => {
  it('strips tags and control characters, then trims', () => {
    expect(sanitizeText('<script>alert(1)</script>Alice')).toBe('alert(1)Alice')
    expect(sanitizeText('Alice\u0000\u001f')).toBe('Alice')
    expect(sanitizeText('  Alice  ')).toBe('Alice')
  })
})

describe('isValidEmail', () => {
  it('accepts a well-formed email and rejects the obvious malformed cases', () => {
    expect(isValidEmail('alice@example.com')).toBe(true)
    expect(isValidEmail('alice@')).toBe(false)
    expect(isValidEmail('alice.example.com')).toBe(false)
  })
})

describe('isValidName', () => {
  it('accepts letters/spaces/hyphens, rejects a leading digit or an empty string', () => {
    expect(isValidName('Anne-Marie')).toBe(true)
    expect(isValidName('1Alice')).toBe(false)
    expect(isValidName('')).toBe(false)
  })
})

describe('isValidRole', () => {
  it('accepts a normal job title and rejects a single character', () => {
    expect(isValidRole('Frontend Developer')).toBe(true)
    expect(isValidRole('A')).toBe(false)
  })
})
